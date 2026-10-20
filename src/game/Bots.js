import * as THREE from 'three';
import { angleDelta, clamp, randRange } from '../core/utils.js';

const BOT_NAMES = ['NULL-7', 'VANTA', 'KILO-9', 'ECHO-4', 'SABLE', 'RIFT-2'];
const BOT_WEAPONS = ['pulse', 'volt', 'scatter'];

function flatDirection(from, to, out = new THREE.Vector3()) {
  out.set(to.x - from.x, 0, to.z - from.z);
  if (out.lengthSq() > 0.0001) out.normalize();
  return out;
}

/**
 * Lightweight practice-mode opponent. Bots use the same physics and visuals as
 * players, but their intent is a deliberately simple waypoint/strafe AI. The
 * session owns all damage so bots remain fully host-authoritative.
 */
export class BotController {
  constructor(session, record, index = 0) {
    this.session = session;
    this.record = record;
    this.avatar = record.avatar;
    this.body = record.body;
    this.index = index;
    this.name = record.name;
    this.weaponId = BOT_WEAPONS[index % BOT_WEAPONS.length];
    this.skill = randRange(0.46, 0.68);
    this.waypoint = session.stage.randomWaypoint(record.pos);
    this.waypointTimer = 0;
    this.fireTimer = randRange(0.7, 2.2);
    this.switchTimer = randRange(5, 10);
    this.strafeDir = Math.random() < 0.5 ? -1 : 1;
    this.strafeTimer = randRange(1.2, 2.8);
    this.stuckTimer = 0;
    this.lastPos = record.pos.clone();
    this.reaction = randRange(0.12, 0.3);
    this.targetVisible = false;
    this.targetDistance = Infinity;
    this.aimYaw = record.yaw;
    this.aimPitch = 0;
    this._move = new THREE.Vector3();
    this._toTarget = new THREE.Vector3();
    this._eye = new THREE.Vector3();
    this._targetEye = new THREE.Vector3();
    this._aimPoint = new THREE.Vector3();
    this._missPoint = new THREE.Vector3();
    this._lastYaw = record.yaw;
  }

  reset(spawn) {
    this.waypoint = this.session.stage.randomWaypoint(spawn.pos);
    this.waypointTimer = 0;
    this.fireTimer = randRange(0.9, 2.2);
    this.switchTimer = randRange(5, 10);
    this.strafeTimer = randRange(1, 2.5);
    this.stuckTimer = 0;
    this.lastPos.copy(spawn.pos);
    this.reaction = randRange(0.12, 0.3);
    this.targetVisible = false;
    this.record.yaw = spawn.yaw;
    this.record.pitch = 0;
  }

  update(dt, time) {
    const record = this.record;
    if (!record.alive || !this.body) return;
    const target = this.session.localRecord;
    const body = this.body;

    body.crouch = false;

    this.record.pos.copy(body.pos);

    const targetAlive = target?.alive && !target.isBot;
    let distance = Infinity;
    let hasLOS = false;
    if (targetAlive) {
      distance = record.pos.distanceTo(target.pos);
      this._eye.copy(record.pos);
      this._eye.y += 1.58;
      this._targetEye.copy(target.pos);
      this._targetEye.y += target.crouch ? 0.85 : 1.42;
      hasLOS = distance < 72 && this.session.physics.lineOfSight(this._eye, this._targetEye, 'bullet');
    }
    this.targetVisible = hasLOS;
    this.targetDistance = distance;

    if (targetAlive) {
      const dx = target.pos.x - record.pos.x;
      const dz = target.pos.z - record.pos.z;
      const desiredYaw = Math.atan2(-dx, -dz);
      const turnSpeed = 4.5 + this.skill * 4;
      this.aimYaw = record.yaw + angleDelta(record.yaw, desiredYaw) * Math.min(1, dt * turnSpeed);
      record.yaw = this.aimYaw;
      const dy = (target.pos.y + (target.crouch ? 0.8 : 1.35)) - (record.pos.y + 1.5);
      const desiredPitch = Math.atan2(dy, Math.max(0.2, Math.hypot(dx, dz)));
      record.pitch += (desiredPitch - record.pitch) * Math.min(1, dt * 5);
      record.pitch = clamp(record.pitch, -0.8, 0.8);
    }

    // Select a sensible distance-dependent weapon.
    this.switchTimer -= dt;
    if (this.switchTimer <= 0) {
      this.switchTimer = randRange(6, 11);
      if (distance > 18 && this.weaponId === 'scatter') this.weaponId = 'volt';
      else if (distance < 8 && this.weaponId === 'rail') this.weaponId = 'pulse';
      else if (Math.random() < 0.35) this.weaponId = BOT_WEAPONS[Math.floor(Math.random() * BOT_WEAPONS.length)];
    }

    this.waypointTimer -= dt;
    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeTimer = randRange(1.1, 2.6);
      if (Math.random() < 0.55) this.strafeDir *= -1;
    }

    let wantX = 0;
    let wantZ = 0;
    if (targetAlive && hasLOS) {
      // Hold a mid-range fight, strafing around the target.
      const toTarget = flatDirection(record.pos, target.pos, this._toTarget);
      const ideal = this.weaponId === 'scatter' ? 7 : this.weaponId === 'pulse' ? 14 : 19;
      const approach = clamp((distance - ideal) / 10, -1, 1);
      const strafeX = -toTarget.z * this.strafeDir;
      const strafeZ = toTarget.x * this.strafeDir;
      wantX = toTarget.x * approach + strafeX * 0.75;
      wantZ = toTarget.z * approach + strafeZ * 0.75;
      if (distance < 4) {
        wantX = -toTarget.x;
        wantZ = -toTarget.z;
      }
    } else {
      if (!this.waypoint || this.waypointTimer <= 0 || record.pos.distanceToSquared(this.waypoint) < 2.2) {
        this.waypoint = this.session.stage.randomWaypoint(targetAlive ? target.pos : record.pos, 32);
        this.waypointTimer = randRange(4, 8);
      }
      if (this.waypoint) {
        const toWaypoint = flatDirection(record.pos, this.waypoint, this._toTarget);
        wantX = toWaypoint.x;
        wantZ = toWaypoint.z;
      }
    }

    // Small amount of deterministic steering noise keeps bots from moving in lockstep.
    const wobble = Math.sin(time * 1.3 + this.index * 2.7) * 0.18;
    wantX += wobble;
    wantZ -= wobble * 0.6;
    const wishLen = Math.hypot(wantX, wantZ);
    if (wishLen > 0.01) {
      wantX /= wishLen;
      wantZ /= wishLen;
    }

    const jump = body.jumpBuffer > 0 || Math.random() < dt * 0.03;
    this.session.physics.moveBody(body, {
      wishX: wantX,
      wishZ: wantZ,
      sprint: distance > 12 && hasLOS,
      jumpPressed: jump,
      carry: true,
    }, dt);

    // Stuck detection: jump, then pick a new waypoint if still pinned.
    this.stuckTimer += dt;
    if (this.stuckTimer > 1.1) {
      this.stuckTimer = 0;
      const movedSq = record.pos.distanceToSquared(this.lastPos);
      if (movedSq < 0.06) {
        if (body.grounded) {
          body.vel.y = 7.5;
          body.grounded = false;
        }
        this.waypoint = this.session.stage.randomWaypoint(record.pos);
        this.waypointTimer = randRange(3, 6);
      }
      this.lastPos.copy(record.pos);
    }

    record.pos.copy(body.pos);
    record.vel.copy(body.vel);
    record.crouch = false;
    record.grounded = body.grounded;
    record.moving = Math.hypot(body.vel.x, body.vel.z) > 1.2;

    if (this.avatar) {
      this.avatar.setCrouch(false);
    }

    if (record.pos.y < -12) {
      this.session.applyDamage(record.id, 999, null, 'fall');
      return;
    }

    if (targetAlive && hasLOS && distance < 50) this._tryFire(dt, target);
  }

  _tryFire(dt, target) {
    this.fireTimer -= dt;
    if (this.fireTimer > 0) return;
    const def = this.session.getWeaponDef(this.weaponId);
    if (!def) return;
    const interval = Math.max(0.14, def.fireInterval);
    const maxRange = this.weaponId === 'scatter' ? 24 : def.range;
    if (this.targetDistance > maxRange) {
      this.fireTimer = Math.min(this.fireTimer, 0.08);
      return;
    }
    const yawToTarget = Math.atan2(-(target.pos.x - this.record.pos.x), -(target.pos.z - this.record.pos.z));
    const facing = Math.abs(angleDelta(this.record.yaw, yawToTarget));
    if (facing > 0.32) {
      this.fireTimer = 0.05;
      return;
    }

    this.session.botFire(this, target, def);

    // Burst-ish pacing. A little randomness avoids robotic laser precision.
    const burstPause = Math.random() < 0.18 ? randRange(0.35, 0.8) : 0;
    this.fireTimer = interval * randRange(1.05, 1.65) + burstPause;
  }
}

export function makeBotRecords(session, count = 3) {
  const controllers = [];
  const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count; i += 1) {
    const record = session.addBot({
      name: shuffled[i % shuffled.length],
      color: session.nextPlayerColor(),
    });
    if (!record) continue;
    controllers.push(new BotController(session, record, i));
  }
  return controllers;
}
