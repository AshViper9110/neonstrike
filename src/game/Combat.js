import * as THREE from 'three';
import { clamp, randRange, TAU } from '../core/utils.js';
import { bodyEyeHeight } from './PhysicsWorld.js';

const HIT_TAG = 'bullet';
const MAX_SHOT_TARGETS = 4;
const BODY_RADIUS = 0.42;
const HEAD_RADIUS = 0.28;

function colorHex(def, fallback = 0x9ffcff) {
  const raw = def?.hitParticles ?? def?.color ?? fallback;
  try {
    return new THREE.Color(raw).getHex();
  } catch {
    return fallback;
  }
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function damageAtRange(def, distance, headshot = false) {
  let damage = def?.damage ?? 0;
  const falloff = def?.falloff;
  if (falloff && distance > falloff.start) {
    const t = clamp((distance - falloff.start) / Math.max(0.001, falloff.end - falloff.start), 0, 1);
    damage *= 1 + (falloff.min - 1) * t;
  }
  if (headshot) damage *= def?.headshotMult ?? 1;
  return damage;
}

function vec3FromArray(value) {
  if (!Array.isArray(value) || value.length < 3) return null;
  return new THREE.Vector3(Number(value[0]) || 0, Number(value[1]) || 0, Number(value[2]) || 0);
}

function directionFromAngles(yaw, pitch, out = new THREE.Vector3()) {
  const cosPitch = Math.cos(pitch);
  return out.set(-Math.sin(yaw) * cosPitch, Math.sin(pitch), -Math.cos(yaw) * cosPitch);
}

/**
 * Weapon runtime: local firing, hitscan resolution, projectiles, splash damage,
 * crosshair feedback and the practice-mode bot trigger.
 * Combat writes damage through `session.applyOutgoingDamage` so authority rules
 * stay in one place (host/solo applies, guests report via MSG.HIT).
 */
export class CombatSystem {
  constructor(session) {
    this.session = session;
    this.physics = session.physics;
    this.effects = session.effects;

    this._origin = new THREE.Vector3();
    this._dir = new THREE.Vector3();
    this._shotDir = new THREE.Vector3();
    this._end = new THREE.Vector3();
    this._point = new THREE.Vector3();
    this._muzzle = new THREE.Vector3();
    this._toTarget = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._crosshairTimer = 0;
    this._reloadHintAt = 0;
    this._remoteFireAt = 0;
  }

  originFor(record, out = this._origin) {
    const body = record?.body;
    const eye = body ? bodyEyeHeight(body) : record?.crouch ? 1.02 : 1.66;
    return out.set(record.pos.x, record.pos.y + eye, record.pos.z);
  }

  /** Camera-space spread applied to an aim direction. */
  spreadDirection(direction, spread, out) {
    if (!spread || spread <= 0) return out.copy(direction);
    const radius = Math.sqrt(Math.random()) * spread;
    const angle = Math.random() * TAU;
    // Build a stable-ish basis around the aim direction for a round cone.
    this._right.set(-direction.z, 0, direction.x);
    if (this._right.lengthSq() < 1e-6) this._right.set(1, 0, 0);
    this._right.normalize();
    const up = this._up.copy(direction).cross(this._right).normalize();
    return out
      .copy(direction)
      .addScaledVector(this._right, Math.cos(angle) * radius)
      .addScaledVector(up, Math.sin(angle) * radius)
      .normalize();
  }

  // ---------------------------------------------------------------- local ----

  updateLocal(dt) {
    const session = this.session;
    const record = session.localRecord;
    if (!record?.alive) return;

    for (const weapon of session.loadout) {
      const result = weapon.update(dt);
      if (result?.reloadCompleted && weapon === session.weapon) this._onReloadFinished(weapon);
    }

    const weapon = session.weapon;
    if (!weapon) return;
    const def = weapon.def;
    const input = session.input;

    const aiming = Boolean(def.zoomFov) && input.isMouseDown(2) && !weapon.reloading;
    if (session.aiming !== aiming) {
      session.aiming = aiming;
      session.viewModel?.setAiming(aiming);
    }

    if (input.consumeKey('KeyR')) this.startReload();

    const pressed = input.consumeMousePress(0);
    const held = input.isMouseDown(0);
    if ((def.auto && held) || (!def.auto && pressed)) this._tryFireLocal(record, weapon);
  }

  startReload() {
    const session = this.session;
    const weapon = session.weapon;
    if (!weapon || weapon.reloading) return false;
    if (!weapon.startReload()) {
      if (weapon.ammo <= 0 && !weapon.hasReserve) {
        weapon.cooldown = Math.max(weapon.cooldown, 0.3);
        session.audio?.empty();
      }
      return false;
    }
    session.audio?.reload(weapon.def.reloadTime);
    return true;
  }

  _tryFireLocal(record, weapon) {
    const session = this.session;
    const def = weapon.def;
    if (weapon.reloading || weapon.cooldown > 0) return;
    if (weapon.ammo <= 0) {
      if (weapon.canReload) {
        this.startReload();
      } else {
        weapon.cooldown = Math.max(weapon.cooldown, 0.28);
        session.audio?.empty();
      }
      return;
    }
    if (!weapon.consumeShot()) return;

    const origin = this.originFor(record);
    directionFromAngles(record.yaw, record.pitch, this._dir);
    const spread = weapon.getSpread({
      aiming: session.aiming,
      moveSpeed: Math.hypot(record.vel.x, record.vel.z),
      airborne: !record.grounded,
      crouching: record.crouch,
    });

    // Weapon kick: applied to the view so sustained fire climbs.
    const kickScale = session.aiming ? 0.62 : 1;
    record.pitch = clamp(
      record.pitch + def.recoil.pitch * kickScale * randRange(0.85, 1.15),
      -1.5,
      1.5,
    );
    record.yaw += (Math.random() - 0.5) * def.recoil.yaw * 2 * kickScale;
    if (record.body) {
      record.body.yaw = record.yaw;
      record.body.pitch = record.pitch;
    }
    this.effects.addShake(clamp(def.recoil.kick * 0.45, 0.008, 0.055));
    session.viewModel?.fire(def);
    session.audio?.shot(def.id, { volume: 1 });

    session.netSendFire({
      ownerId: record.id,
      weapon: def.id,
      origin: [round3(origin.x), round3(origin.y), round3(origin.z)],
      dir: [round3(this._dir.x), round3(this._dir.y), round3(this._dir.z)],
    });

    this._resolveShot(record, weapon, origin, this._dir, spread);
  }

  _resolveShot(record, weapon, origin, aimDir, spread) {
    const def = weapon.def;
    if (def.type === 'projectile') {
      const dir = this.spreadDirection(aimDir, spread ?? 0, this._shotDir);
      const startPos = origin.clone().addScaledVector(dir, 0.45);
      this.effects.muzzleFlash(startPos, colorHex(def), 1.15, true);
      this.session.projectiles.spawn({
        ownerId: record.id,
        origin: startPos,
        direction: dir,
        weapon: def,
      });
      return;
    }
    this._fireHitscan(record, weapon, origin, aimDir, spread ?? 0);
  }

  // ------------------------------------------------------------- hitscan ----

  _fireHitscan(shooter, weapon, origin, aimDir, spread) {
    const session = this.session;
    const def = weapon.def;
    const range = def.range ?? 60;
    const pellets = Math.max(1, def.pellets ?? 1);
    const pierce = Math.max(1, def.pierce ?? 1);
    const targets = session.getDamageableTargets(shooter.id);
    const color = colorHex(def);
    const accumulated = new Map();
    const tracerBudget = pellets > 4 ? 3 : pellets;
    let tracers = 0;
    let impacts = 0;

    for (let i = 0; i < pellets; i += 1) {
      const dir = this.spreadDirection(aimDir, spread, this._shotDir);
      const wall = this.physics.raycast(origin, dir, range, HIT_TAG);
      const limit = wall ? Math.min(range, wall.distance) : range;
      const hits = [];
      for (const entry of targets) {
        const hit = this._rayTarget(origin, dir, limit, entry.state);
        if (hit) hits.push(hit);
      }
      hits.sort((a, b) => a.distance - b.distance);

      const allowed = hits.slice(0, pierce);
      for (const hit of allowed) {
        const damage = damageAtRange(def, hit.distance, hit.headshot);
        const bucket = accumulated.get(hit.record) ?? { amount: 0, headshot: false, point: hit.point };
        bucket.amount += damage;
        bucket.headshot = bucket.headshot || hit.headshot;
        accumulated.set(hit.record, bucket);
      }

      // Tracer goes to the closest thing we hit (target, wall, or max range).
      const firstHit = allowed[0] ?? null;
      if (tracers < tracerBudget) {
        tracers += 1;
        const to = firstHit
          ? firstHit.point
          : wall
            ? wall.point
            : this._end.copy(origin).addScaledVector(dir, range);
        const from = this._point.copy(origin).addScaledVector(dir, 0.45);
        if (def.id === 'rail') this.effects.railBeam(from, to, color);
        else this.effects.tracer(from, to, color, { duration: 0.075 });
      }

      if (firstHit) {
        if (impacts < 2) {
          impacts += 1;
          const normal = this._toTarget.copy(dir).multiplyScalar(-1);
          this.effects.bloodSpark(firstHit.point, normal, color);
        }
      } else if (wall && impacts < 3) {
        impacts += 1;
        this.effects.impact(wall.point, wall.normal, color, { heavy: def.type === 'rail' || def.id === 'scatter' });
      }
    }

    for (const [target, bucket] of accumulated) {
      if (!target?.alive) continue;
      session.applyOutgoingDamage(target, bucket.amount, def.id, {
        headshot: bucket.headshot,
        cause: 'weapon',
      });
    }
  }

  /** Sphere/segment test against one player's body + head volumes. */
  _rayTarget(origin, direction, maxDistance, target) {
    if (!target?.alive) return null;
    const crouch = Boolean(target.crouch);
    const bodyCenter = this._toTarget.set(
      target.pos.x,
      target.pos.y + (crouch ? 0.72 : 0.88),
      target.pos.z,
    );
    const headCenter = this._muzzle.set(
      target.pos.x,
      target.pos.y + (crouch ? 1.3 : 1.62),
      target.pos.z,
    );
    const body = this._segmentSphere(origin, direction, maxDistance, bodyCenter, BODY_RADIUS);
    const head = this._segmentSphere(origin, direction, maxDistance, headCenter, HEAD_RADIUS);
    if (head && (!body || head.distance <= body.distance)) {
      return { record: target, distance: head.distance, headshot: true, point: head.point };
    }
    if (body) return { record: target, distance: body.distance, headshot: false, point: body.point };
    return null;
  }

  _segmentSphere(origin, direction, maxDistance, center, radius) {
    const ox = origin.x - center.x;
    const oy = origin.y - center.y;
    const oz = origin.z - center.z;
    const dx = direction.x;
    const dy = direction.y;
    const dz = direction.z;
    const b = ox * dx + oy * dy + oz * dz;
    const c = ox * ox + oy * oy + oz * oz - radius * radius;
    if (c > 0 && b > 0) return null;
    const disc = b * b - c;
    if (disc < 0) return null;
    const root = Math.sqrt(disc);
    let t = -b - root;
    if (t < 0) t = 0;
    if (t > maxDistance) return null;
    return {
      distance: t,
      point: new THREE.Vector3(origin.x + dx * t, origin.y + dy * t, origin.z + dz * t),
    };
  }

  // ------------------------------------------------------------ crosshair ----

  updateCrosshair(dt) {
    const session = this.session;
    const record = session.localRecord;
    const weapon = session.weapon;
    if (!record?.alive || !weapon || !session.deployed) {
      session.crosshairTarget = false;
      this._crosshairTimer = 0;
      if (session.aiming) {
        session.aiming = false;
        session.viewModel?.setAiming(false);
      }
      return;
    }
    this._crosshairTimer -= dt;
    if (this._crosshairTimer > 0) return;
    this._crosshairTimer = 0.045;

    const origin = this.originFor(record);
    directionFromAngles(record.yaw, record.pitch, this._dir);
    const range = weapon.def.range ?? 60;
    const wall = this.physics.raycast(origin, this._dir, range, HIT_TAG);
    const limit = wall ? Math.min(range, wall.distance) : range;

    let found = false;
    for (const entry of session.getDamageableTargets(record.id)) {
      if (this._rayTarget(origin, this._dir, limit, entry.state)) {
        found = true;
        break;
      }
    }
    session.crosshairTarget = found;
  }

  // --------------------------------------------------------------- remote ----

  /** Visual reproduction of another player's shot (MSG.FIRE). */
  handleRemoteFire(payload) {
    const session = this.session;
    if (!payload) return;
    const ownerId = payload.ownerId ?? payload.from;
    const def = session.getWeaponDef(payload.weapon);
    if (!def) return;
    const record = session.records.get(ownerId);
    if (!record || record.isLocal) return;

    const origin = vec3FromArray(payload.origin);
    const dir = vec3FromArray(payload.dir);
    if (!origin || !dir || dir.lengthSq() < 1e-6) return;
    dir.normalize();

    record.avatar?.flashMuzzle(0.06);
    const from = record.avatar
      ? record.avatar.getMuzzleWorld(this._muzzle.clone())
      : this._muzzle.copy(origin);
    const color = colorHex(def);
    if (def.type !== 'projectile') {
      const wall = this.physics.raycast(from, dir, def.range ?? 60, HIT_TAG);
      const end = wall ? wall.point : this._end.copy(from).addScaledVector(dir, def.range ?? 60);
      if (def.id === 'rail') this.effects.railBeam(from, end, color);
      else this.effects.tracer(from, end, color, { duration: 0.075 });
      if (wall) this.effects.impact(wall.point, wall.normal, color, { heavy: def.id === 'scatter' });
    }
    this.effects.muzzleFlash(from, color, 1, false);
    session.audio?.shot(def.id, {
      pan: session.panFor(from),
      volume: session.volumeFor(from, 80),
    });
  }

  /** Practice-mode bot trigger (bots live on the authoritative client only). */
  botFire(bot, target, def) {
    const session = this.session;
    if (!session.isAuthority || !bot?.record?.alive || !target?.alive) return;
    const record = bot.record;
    const origin = this.originFor(record);
    const muzzle = record.avatar
      ? record.avatar.getMuzzleWorld(this._muzzle.clone())
      : this._muzzle.copy(origin);
    const distance = record.pos.distanceTo(target.pos);
    const color = colorHex(def, 0xff6a4d);
    const maxRange = def.id === 'scatter' ? 26 : def.range ?? 60;

    this._toTarget.set(
      target.pos.x,
      target.pos.y + (target.crouch ? 0.82 : 1.12),
      target.pos.z,
    );
    const dir = this._shotDir.subVectors(this._toTarget, origin).normalize();
    const skill = clamp(bot.skill ?? 0.5, 0, 1);
    const hitChance = clamp(0.3 + skill * 0.58 - Math.max(0, distance - 10) * 0.0075, 0.08, 0.88);
    const willHit = Math.random() < hitChance;
    const missSpread = willHit ? 0.014 : randRange(0.05, 0.11);
    this.spreadDirection(dir, missSpread, dir);

    const wall = this.physics.raycast(origin, dir, maxRange, HIT_TAG);
    const limit = wall ? Math.min(maxRange, wall.distance) : maxRange;
    const test = willHit ? this._rayTarget(origin, dir, limit, target) : null;
    const end = test
      ? test.point
      : wall
        ? wall.point
        : this._end.copy(origin).addScaledVector(dir, maxRange);

    record.avatar?.flashMuzzle(0.06);
    if (def.id === 'rail') this.effects.railBeam(muzzle, end, color);
    else this.effects.tracer(muzzle, end, color, { duration: 0.07 });
    this.effects.muzzleFlash(muzzle, color, 0.95, false);
    session.audio?.shot(def.id, {
      pan: session.panFor(record.pos),
      volume: session.volumeFor(record.pos, 85),
    });

    if (test) {
      const headshot = test.headshot && skill > 0.6;
      const damage = damageAtRange(def, test.distance, headshot);
      this.effects.bloodSpark(test.point, this._point.copy(dir).multiplyScalar(-1), color);
      session.applyDamage(target.id, damage, record.id, 'weapon', {
        weaponId: def.id,
        headshot,
      });
      return;
    }
    if (wall) this.effects.impact(wall.point, wall.normal, color);
  }

  // ------------------------------------------------------------ explosive ----

  /** Owner-side splash resolution for a detonated projectile. */
  handleProjectileDamage(projectile, position, directTarget) {
    const session = this.session;
    if (!projectile || !position) return;
    const def = projectile.def;
    const proj = def?.projectile ?? {};
    const radius = proj.splashRadius ?? 4;
    const splashDamage = proj.splashDamage ?? 0;
    const selfScale = proj.selfDamageScale ?? 0.5;
    const knockback = proj.splashKnockback ?? 6;
    const ownerId = projectile.ownerId;
    const color = def?.hitParticles ?? 0xffa64d;

    for (const record of session.records.values()) {
      if (!record.alive) continue;
      const centerY = record.pos.y + (record.crouch ? 0.62 : 0.92);
      const dx = record.pos.x - position.x;
      const dy = centerY - position.y;
      const dz = record.pos.z - position.z;
      const distance = Math.hypot(dx, dy, dz);
      const isDirect = Boolean(directTarget && directTarget.id === record.id);
      const falloff = distance >= radius ? 0 : Math.pow(1 - distance / radius, 0.85);
      if (!isDirect && falloff <= 0) continue;

      const isSelf = record.id === ownerId;
      let damage = 0;
      if (isDirect) damage += def?.damage ?? 0;
      if (isSelf) damage += splashDamage * selfScale * (isDirect ? 0.6 : falloff);
      else damage += splashDamage * falloff;
      damage = Math.min(damage, 160);
      if (isSelf && !isDirect && damage < 1) continue;

      if (damage > 0) {
        if (isSelf) {
          this._applySelfSplash(record, damage, def);
        } else {
          session.applyOutgoingDamage(record, damage, def?.id, {
            cause: isDirect ? 'projectile' : 'splash',
            headshot: false,
          });
        }
      }

      const body = record.body;
      if (body) {
        const flat = Math.hypot(dx, dz) || 0.0001;
        const push = knockback * Math.max(0.25, isDirect ? 1 : falloff);
        body.vel.x += (dx / flat) * push;
        body.vel.z += (dz / flat) * push;
        if (body.grounded || dy > 0.2) body.vel.y += Math.min(5.5, push * 0.5);
        body.grounded = false;
      }
      if (record.isLocal || record.isBot) {
        this.effects.bloodSpark(
          this._point.set(record.pos.x, centerY, record.pos.z),
          this._toTarget.set(0, 1, 0),
          color,
        );
      }
    }
  }

  _applySelfSplash(record, damage, def) {
    const session = this.session;
    const weaponName = def?.name ?? 'EXPLOSIVE';
    if (session.isAuthority) {
      session.applyDamage(record.id, damage, record.id, 'splash', {
        weaponId: def?.id,
        weaponName,
      });
      return;
    }
    // Guests own their own health, then report the loss to the host.
    record.health = clamp(record.health - damage, 0, record.maxHealth);
    session.hud?.showDamage(damage);
    session.audio?.hurt();
    session.effects.addShake(clamp(damage * 0.004, 0.02, 0.18));
    session.net.sendHazard({ kind: 'splash', amount: Math.round(damage * 10) / 10 });
  }

  _onReloadFinished(weapon) {
    this.session.audio?.reload(0.06);
    this.session.hud?.showHint(`${weapon.def.name} 装填完了`, 0.8);
  }
}
