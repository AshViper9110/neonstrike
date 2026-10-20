import { MSG } from '../net/PeerRoom.js';
import { clamp, safeNumber } from '../core/utils.js';

const GUEST_STATE_INTERVAL = 1 / 20;
const HOST_SNAPSHOT_INTERVAL = 1 / 15;
const MISSED_SNAPSHOT_LIMIT = 4;

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function positionArray(pos) {
  return [round3(pos.x), round3(pos.y), round3(pos.z)];
}

/**
 * PeerJS session bridge.
 *
 * Authority model:
 *  - guests simulate their own movement and send MSG.STATE at 20 Hz
 *  - the host validates damage (MSG.HIT / MSG.HAZARD / MSG.HEAL) and
 *    broadcasts MSG.SNAPSHOT at 15 Hz
 *  - only the host owns health, kills, respawns and pickup state; guests
 *    accept absolute health values from MSG.DAMAGE / MSG.KILL.
 */
export class NetworkSync {
  constructor(session) {
    this.session = session;
    this.room = session.room;
    this._unsubscribers = [];
    this._bound = false;
    this._stateTimer = 0;
    this._snapshotTimer = 0;
  }

  get active() {
    return Boolean(this.room && !this.room.closed);
  }

  bind() {
    if (this._bound || !this.room) return;
    this._bound = true;
    const on = (event, handler) => {
      this._unsubscribers.push(this.room.on(event, handler));
    };
    on('message', (payload) => this.handleMessage(payload));
    on('snapshot', (message) => this.handleSnapshot(message));
  }

  dispose() {
    for (const off of this._unsubscribers) {
      try { off(); } catch { /* noop */ }
    }
    this._unsubscribers.length = 0;
    this._bound = false;
  }

  update(dt) {
    const session = this.session;
    if (!this.active || !session.running) return;
    if (session.isAuthority) {
      this._snapshotTimer -= dt;
      if (this._snapshotTimer <= 0) {
        this._snapshotTimer = HOST_SNAPSHOT_INTERVAL;
        this.sendSnapshot();
      }
      return;
    }
    this._stateTimer -= dt;
    if (this._stateTimer <= 0) {
      this._stateTimer = GUEST_STATE_INTERVAL;
      this.sendState();
    }
  }

  // ------------------------------------------------------------ outbound ----

  sendState() {
    const session = this.session;
    const room = this.room;
    const record = session.localRecord;
    if (!room || room.isHost || !record) return;
    if (!record.alive) {
      room.sendToHost({ t: MSG.STATE, dead: true });
      return;
    }
    room.sendToHost({
      t: MSG.STATE,
      pos: positionArray(record.pos),
      yaw: round3(record.yaw),
      pitch: round3(record.pitch),
      crouch: Boolean(record.crouch),
      weapon: session.weaponId,
      moving: Boolean(record.moving),
      health: Math.round(record.health),
      ping: Number.isFinite(room.ping) ? Math.round(room.ping) : null,
    });
  }

  sendSnapshot() {
    const session = this.session;
    const room = this.room;
    if (!room?.isHost) return;
    const players = [];
    for (const record of session.records.values()) {
      if (record.isBot) continue;
      if (record.isLocal) {
        players.push({
          id: record.id,
          name: record.name,
          color: record.color,
          pos: positionArray(record.pos),
          yaw: round3(record.yaw),
          pitch: round3(record.pitch),
          crouch: Boolean(record.crouch),
          weapon: session.weaponId,
          health: Math.round(record.health),
          alive: record.alive,
          kills: record.kills || 0,
          deaths: record.deaths || 0,
        });
        continue;
      }
      players.push({
        id: record.id,
        name: record.name,
        color: record.color,
        pos: positionArray(record.pos),
        yaw: round3(record.yaw),
        pitch: round3(record.pitch),
        crouch: Boolean(record.crouch),
        weapon: record.weaponId || session.weaponId,
        health: Math.round(record.health),
        alive: record.alive,
        kills: record.kills || 0,
        deaths: record.deaths || 0,
        respawnRemaining: round3(record.respawnRemaining),
        ping: record.ping,
      });
    }
    const pickups = [];
    for (const pickup of session.stage.pickups) {
      if (!pickup.available) pickups.push(pickup.id);
    }
    room.broadcast({
      t: MSG.SNAPSHOT,
      time: round3(session.matchTime),
      deployed: session.deployed,
      players,
      pickups,
    });
  }

  sendFire(message) {
    const room = this.room;
    if (!this.active || !room) return;
    const payload = { t: MSG.FIRE, ...message };
    if (room.isHost) room.broadcast(payload);
    else room.sendToHost(payload);
  }

  sendProjectile(message) {
    const room = this.room;
    if (!this.active || !room) return;
    const payload = { t: MSG.PROJECTILE, ...message };
    if (room.isHost) room.broadcast(payload);
    else room.sendToHost(payload);
  }

  sendHit(payload) {
    if (!this.active || this.room.isHost) return;
    this.room.sendToHost({ t: MSG.HIT, ...payload });
  }

  sendHazard(payload) {
    if (!this.active || this.room.isHost) return;
    this.room.sendToHost({ t: MSG.HAZARD, ...payload });
  }

  sendHeal(pickupId) {
    if (!this.active || this.room.isHost || !pickupId) return;
    this.room.sendToHost({ t: MSG.HEAL, pickupId });
  }

  sendLoadout(weaponId) {
    if (!this.active || this.room.isHost || !weaponId) return;
    this.room.sendToHost({ t: MSG.LOADOUT, weaponId });
  }

  // ------------------------------------------------------------- inbound ----

  handleMessage({ message, fromId } = {}) {
    if (!message || typeof message.t !== 'string') return;
    const session = this.session;
    const sender = message.from ?? fromId;
    switch (message.t) {
      case MSG.STATE:
        if (session.isAuthority) this.handleState(message, sender);
        break;
      case MSG.HIT:
        if (session.isAuthority) this.handleHit(message, sender);
        break;
      case MSG.HAZARD:
        if (session.isAuthority) this.handleHazard(message, sender);
        break;
      case MSG.HEAL:
        if (session.isAuthority) this.handleHealRequest(message, sender);
        else session.handleHealMessage(message);
        break;
      case MSG.FIRE:
        session.combat.handleRemoteFire({ ...message, ownerId: message.ownerId ?? sender });
        break;
      case MSG.PROJECTILE:
        this.handleProjectile(message);
        break;
      case MSG.DAMAGE:
        session.handleDamageMessage(message);
        break;
      case MSG.KILL:
        session.handleKillMessage(message);
        break;
      case MSG.RESPAWN:
        session.handleRespawnMessage(message);
        break;
      case MSG.LOADOUT:
        if (session.isAuthority) this.handleLoadout(message, sender);
        break;
      case MSG.MATCH_START:
        if (!session.isAuthority) session.requestMatchStart();
        break;
      case MSG.CHAT:
        session.hud?.showToast(`${message.name || 'PLAYER'}: ${message.text || ''}`, message.color, 2600);
        break;
      default:
        break;
    }
  }

  handleState(message, fromId) {
    const session = this.session;
    const record = session.records.get(fromId);
    if (!record || record.isLocal || record.isBot) return;
    if (message.health != null) {
      record.health = clamp(safeNumber(message.health, record.health, 0, record.maxHealth), 0, record.maxHealth);
    }
    if (message.ping != null) {
      record.ping = safeNumber(message.ping, record.ping, 0, 5000);
    }
    if (message.dead || !record.alive) return;

    const pos = session.parsePosition(message.pos);
    if (pos) record.pos.copy(pos);
    record.yaw = safeNumber(message.yaw, record.yaw);
    record.pitch = safeNumber(message.pitch, record.pitch, -1.5, 1.5);
    record.crouch = Boolean(message.crouch);
    if (typeof message.weapon === 'string' && session.getWeaponDef(message.weapon)) {
      record.weaponId = message.weapon;
    }
    record.moving = Boolean(message.moving);
    record.vel.set(0, 0, 0);
    record.missedSnapshots = 0;
  }

  handleSnapshot(message) {
    const session = this.session;
    const room = this.room;
    if (!room || room.isHost || !message) return;
    const seen = new Set();
    const local = session.localRecord;

    if (typeof message.time === 'number') {
      session.matchTime = Math.max(0, message.time);
    }
    session.remoteDeployed = Boolean(message.deployed);

    for (const entry of message.players || []) {
      if (!entry?.id) continue;
      seen.add(entry.id);
      const pos = session.parsePosition(entry.pos);

      if (entry.id === session.localId) {
        if (local && !local.alive) {
          const respawnIn = safeNumber(entry.respawnRemaining, 0, 0, 30);
          local.respawnRemaining = Math.max(0, respawnIn);
          if (entry.alive) session._reviveLocal(pos || local.pos, safeNumber(entry.yaw, local.yaw));
        }
        continue;
      }

      let record = session.records.get(entry.id);
      if (!record) {
        record = session.addGuestRecord({
          id: entry.id,
          name: entry.name || 'PLAYER',
          color: entry.color,
        });
      }
      if (!record || record.isLocal) continue;

      if (pos) {
        if (record.pos.distanceToSquared(pos) > 36) record.pos.copy(pos);
        else record.pos.lerp(pos, 0.5);
      }
      record.yaw = safeNumber(entry.yaw, record.yaw);
      record.pitch = safeNumber(entry.pitch, record.pitch, -1.5, 1.5);
      record.crouch = Boolean(entry.crouch);
      if (typeof entry.weapon === 'string' && session.getWeaponDef(entry.weapon)) {
        record.weaponId = entry.weapon;
      }
      record.health = clamp(safeNumber(entry.health, record.health, 0, 100), 0, record.maxHealth);
      record.kills = safeNumber(entry.kills, record.kills, 0, 99999);
      record.deaths = safeNumber(entry.deaths, record.deaths, 0, 99999);
      record.missedSnapshots = 0;
      if (entry.ping != null) record.ping = safeNumber(entry.ping, record.ping, 0, 5000);

      const alive = entry.alive !== false;
      if (alive !== record.alive) {
        record.alive = alive;
        record.health = alive ? record.health : 0;
        record.avatar?.setAlive(alive);
      }
      record.avatar?.setHealth(record.health);
    }

    for (const record of [...session.records.values()]) {
      if (record.isLocal || record.isBot) continue;
      if (seen.has(record.id)) continue;
      record.missedSnapshots = (record.missedSnapshots || 0) + 1;
      if (record.missedSnapshots >= MISSED_SNAPSHOT_LIMIT) {
        session.removePlayer(record.id, { notify: true });
      }
    }

    if (Number.isFinite(room.ping)) {
      const hostRecord = session.records.get('host');
      if (hostRecord) hostRecord.ping = Math.round(room.ping);
    }

    this._syncPickups(message.pickups);
  }

  handleLoadout(message, fromId) {
    const session = this.session;
    if (!session.isAuthority) return;
    const record = session.records.get(fromId);
    const def = session.getWeaponDef(message?.weaponId);
    if (!record || !def) return;
    record.weaponId = def.id;
  }

  _syncPickups(takenIds) {
    const session = this.session;
    if (!session.stage?.pickups?.length) return;
    const taken = new Set(Array.isArray(takenIds) ? takenIds : []);
    for (const pickup of session.stage.pickups) {
      const next = !taken.has(pickup.id);
      if (pickup.available === next) continue;
      pickup.available = next;
      pickup.group.visible = next;
      if (next) {
        pickup.group.scale.setScalar(1);
        pickup.respawnAt = 0;
      }
    }
  }

  handleProjectile(message) {
    const session = this.session;
    if (!session.projectiles || !message) return;
    if (message.action === 'spawn') {
      session.projectiles.spawnRemote({
        id: message.id,
        ownerId: message.ownerId ?? message.from,
        origin: message.origin,
        dir: message.dir,
        weapon: message.weapon,
      });
      return;
    }
    if (message.action === 'explode' && Array.isArray(message.pos)) {
      session.projectiles.detonateRemote(message.id, message.pos);
    }
  }

  // ---------------------------------------------------------- validation ----

  handleHit(message, fromId) {
    const session = this.session;
    if (!session.isAuthority) return;
    const attacker = session.records.get(fromId);
    const target = session.records.get(message.targetId);
    if (!attacker?.alive || !target?.alive || attacker === target) return;

    const def = session.getWeaponDef(message.weaponId);
    if (!def) return;

    const pellets = Math.max(1, def.pellets ?? 1);
    const maxPerShot = def.damage * pellets * Math.max(1, def.headshotMult ?? 1)
      + (def.projectile?.splashDamage ?? 0);
    let amount = clamp(safeNumber(message.amount, 0, 0, 999), 0, Math.ceil(maxPerShot));
    if (amount <= 0) return;

    const distance = attacker.pos.distanceTo(target.pos);
    const reach = (def.range ?? 60) + (def.projectile?.splashRadius ?? 0) + 8;
    if (distance > reach) return;

    const cause = message.cause === 'splash' ? 'splash' : message.cause === 'projectile' ? 'projectile' : 'weapon';
    session.applyDamage(target.id, amount, attacker.id, cause, {
      weaponId: def.id,
      headshot: Boolean(message.headshot),
    });
  }

  handleHazard(message, fromId) {
    const session = this.session;
    if (!session.isAuthority) return;
    const record = session.records.get(fromId);
    if (!record?.alive) return;
    const kind = message.kind === 'laser' ? 'laser' : message.kind === 'splash' ? 'splash' : 'fall';
    const amount = kind === 'fall'
      ? 999
      : clamp(safeNumber(message.amount, 0, 0, 200), 0, 200);
    if (amount <= 0) return;
    session.applyDamage(record.id, amount, null, kind, {
      weaponName: kind === 'laser' ? 'LASER FENCE' : kind === 'splash' ? 'SELF-DAMAGE' : 'VOID',
    });
  }

  handleHealRequest(message, fromId) {
    const session = this.session;
    if (!session.isAuthority) return;
    const record = session.records.get(fromId);
    if (!record?.alive || record.health >= record.maxHealth) return;
    if (session.time < (record._pickupBlockUntil || 0)) return;
    const pickup = session.stage.pickups.find((item) => item.id === message.pickupId && item.available);
    if (!pickup || !session._nearPickup(record, pickup)) return;
    const healed = session._applyHeal(record, pickup);
    record._pickupBlockUntil = session.time + 0.8;
    if (healed > 0) {
      session.room?.sendTo(fromId, {
        t: MSG.HEAL,
        targetId: fromId,
        amount: Math.round(healed * 10) / 10,
        health: Math.round(record.health * 10) / 10,
        pickupId: pickup.id,
      });
    }
  }
}
