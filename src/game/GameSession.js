import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { NeonFoundry } from '../stages/NeonFoundry.js';
import {
  PhysicsWorld,
  createBody,
  bodyHeight,
  bodyEyeHeight,
  playerAABB,
} from './PhysicsWorld.js';
import { EffectsSystem } from './Effects.js';
import { ProjectileSystem } from './Projectiles.js';
import { ViewModel } from './ViewModel.js';
import { Avatar } from './Avatar.js';
import { HUD } from './HUD.js';
import { Input } from './Input.js';
import { makeBotRecords } from './Bots.js';
import { CombatSystem } from './Combat.js';
import { NetworkSync } from './NetSync.js';
import { MSG } from '../net/PeerRoom.js';
import { registerBuiltinWeapons } from '../weapons/index.js';
import {
  clamp,
  damp,
  sanitizeName,
  safeNumber,
  PLAYER_COLORS,
  TAU,
} from '../core/utils.js';

const FIXED_STEP = 1 / 60;
const MAX_STEPS = 5;
const RESPAWN_DELAY = 3.4;
const SPAWN_PROTECT = 1.0;
const MAX_HEALTH = 100;

function sanitizeColor(color, fallback = '#00f6ff') {
  return /^#[0-9a-f]{6}$/i.test(String(color ?? '')) ? String(color).toLowerCase() : fallback;
}

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * Owns one running match: renderer, arena, records, local simulation, combat,
 * pickups, respawns and the network facade. Presentation lives in HUD,
 * networking in NetworkSync and weapon mechanics in CombatSystem.
 */
export class GameSession {
  constructor({
    canvas,
    room = null,
    practice = false,
    settings,
    audio,
    localName = 'PLAYER',
    localId = null,
    roomCode = null,
    initialPlayers = [],
    weaponId = null,
  }) {
    this.canvas = canvas;
    this.room = room;
    this.practice = Boolean(practice);
    this.settings = settings;
    this.audio = audio;
    this.localName = sanitizeName(localName);
    this.roomCode = String(roomCode || room?.code || (practice ? 'SOLO' : '----')).toUpperCase();
    this.modeLabel = practice ? 'PRACTICE // BOTS' : room?.isHost ? 'HOST // P2P' : 'CLIENT // P2P';
    this.localId = localId || (practice ? 'local' : room?.isHost ? 'host' : 'guest');
    this.isAuthority = practice || Boolean(room?.isHost);
    this.onMatchStart = null;
    this.matchStartRequested = false;
    // The session exists while the lobby is open, but the world is not shown
    // until the host starts the match. Skipping render/visual updates here
    // keeps the lobby light while networking still runs.
    this.lobbyMode = true;

    this.registry = registerBuiltinWeapons();
    // A player takes exactly one weapon into a match. The choice is made in
    // the lobby; there are no in-match weapon slots to cycle through.
    this.loadout = [];
    this.weapon = this.registry.createInstance(weaponId) || this.registry.createInstance('pulse');
    if (this.weapon) this.loadout.push(this.weapon);
    this.weaponId = this.weapon?.id ?? 'pulse';

    this.records = new Map();
    this.bots = [];
    this.botControllers = new Map();
    this._botSeq = 0;
    this._colorIndex = 0;
    this._pickupCooldown = 0;
    this._triggerBox = new THREE.Box3();
    this._shakeOffset = new THREE.Vector3();
    this._eyeDamp = 1.66;
    this._bobPhase = 0;
    this._landDip = 0;
    this._lastFrame = 0;
    this._accumulator = 0;
    this._frameHandle = 0;
    this._width = 1280;
    this._height = 720;
    this._composerAttempted = false;
    this._bloomEnabled = false;
    this._disposed = false;

    this.time = 0;
    this.matchTime = 0;
    this.deployed = false;
    this.paused = false;
    this.running = false;
    this.aiming = false;
    this.crosshairTarget = false;
    this.fps = 60;
    this.localDeath = null;

    const selfInfo = initialPlayers.find((player) => player.id === this.localId);
    const localColor = sanitizeColor(selfInfo?.color, this.nextPlayerColor());

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: settings?.get('quality') !== 'low',
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(0x03020a, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(settings?.get('fov') ?? 82, 1, 0.05, 420);
    this.camera.rotation.order = 'YXZ';

    this.physics = new PhysicsWorld();
    this.effects = new EffectsSystem(this.scene);
    this.ctx = {
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      physics: this.physics,
      session: this,
      stage: null,
      materials: null,
    };
    this.stage = new NeonFoundry().init(this.ctx);
    this.projectiles = new ProjectileSystem(this);
    this.viewModel = new ViewModel({
      renderer: this.renderer,
      weaponRegistry: this.registry,
      settings: this.settings,
    });
    this.viewModel.setWeapon(this.weaponId);
    this.input = new Input({ canvas });
    this.combat = new CombatSystem(this);

    this.localRecord = this._createRecord({
      id: this.localId,
      name: this.localName,
      color: localColor,
      isLocal: true,
    });
    this._spawnRecord(this.localRecord, { silent: true, initial: true });
    this._eyeDamp = bodyEyeHeight(this.localRecord.body);

    for (const player of initialPlayers) {
      if (!player?.id || player.id === this.localId) continue;
      if (this.records.has(player.id)) continue;
      const record = this._createRecord({
        id: player.id,
        name: player.name,
        color: player.color,
        weaponId: player.weapon || player.weaponId,
        isBot: false,
      });
      this._spawnRecord(record, { silent: true, initial: true });
    }

    if (this.practice) {
      const controllers = makeBotRecords(this, 3);
      for (const controller of controllers) {
        this.bots.push(controller);
        this.botControllers.set(controller.record.id, controller);
      }
    } else if (!this.isAuthority) {
      for (const pickup of this.stage.pickups) {
        pickup.remoteControlled = true;
        pickup.available = false;
        pickup.group.visible = false;
      }
    }

    this.net = new NetworkSync(this);
    this.hud = new HUD(this);

    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);
    this._settingsOff = this.settings?.on('change', (key) => {
      if (key === 'quality') this.applyQuality();
    });
    this.applyQuality();
    this.resize();
  }

  playerCount() {
    let count = 0;
    for (const record of this.records.values()) if (!record.isBot) count += 1;
    return count;
  }

  nextPlayerColor() {
    const color = PLAYER_COLORS[this._colorIndex % PLAYER_COLORS.length];
    this._colorIndex += 1;
    return color;
  }

  _createRecord({ id, name, color, weaponId = null, isLocal = false, isBot = false }) {
    const record = {
      id: String(id),
      name: sanitizeName(name),
      color: sanitizeColor(color, PLAYER_COLORS[0]),
      isLocal: Boolean(isLocal),
      isBot: Boolean(isBot),
      alive: true,
      health: MAX_HEALTH,
      maxHealth: MAX_HEALTH,
      kills: 0,
      deaths: 0,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      yaw: 0,
      pitch: 0,
      crouch: false,
      grounded: false,
      moving: false,
      respawnAt: 0,
      respawnRemaining: 0,
      invulnerableUntil: 0,
      weaponId: (isLocal ? this.weaponId : weaponId) || 'pulse',
      ping: null,
      missedSnapshots: 0,
      body: null,
      avatar: null,
    };
    this.records.set(record.id, record);

    if (isLocal || isBot) {
      record.body = createBody({ position: new THREE.Vector3(0, 0.05, 0), yaw: 0 });
      record.body.recordId = record.id;
      record.body.gimmickCooldowns = new Map();
    }
    if (!isLocal) {
      record.avatar = new Avatar({
        id: record.id,
        name: record.name,
        color: record.color,
        isBot,
      });
      record.avatar.group.visible = false;
      this.scene.add(record.avatar.group);
    }
    return record;
  }

  _spawnRecord(record, { silent = false, initial = false } = {}) {
    const avoid = [];
    for (const other of this.records.values()) {
      if (other !== record && other.alive) avoid.push(other.pos);
    }
    const spawn = this.stage.pickSpawn(avoid);
    record.pos.copy(spawn.pos);
    record.vel.set(0, 0, 0);
    record.yaw = spawn.yaw;
    record.pitch = 0;
    record.crouch = false;
    record.grounded = false;
    record.moving = false;
    record.alive = true;
    record.health = MAX_HEALTH;
    record.respawnAt = 0;
    record.respawnRemaining = 0;
    record.invulnerableUntil = this.time + SPAWN_PROTECT;
    record.missedSnapshots = 0;

    const body = record.body;
    if (body) {
      body.pos.copy(record.pos);
      body.vel.set(0, 0, 0);
      body.yaw = record.yaw;
      body.pitch = 0;
      body.crouch = false;
      body.grounded = false;
      body.groundSolid = null;
      body.coyote = 0;
      body.jumpBuffer = 0;
      body.gravityScale = 1;
      body.updraft = 0;
      body.jumpScale = 1;
      body.gimmickCooldowns?.clear();
    }

    if (record.avatar) {
      record.avatar.deathTime = 0;
      record.avatar.setAlive(true);
      record.avatar.setCrouch(false);
      record.avatar.setHealth(MAX_HEALTH);
      record.avatar.group.visible = true;
      record.avatar.group.position.copy(record.pos);
      record.avatar.group.rotation.set(0, record.yaw, 0);
    }

    if (record.isLocal) {
      for (const weapon of this.loadout) weapon.refill();
      this.localDeath = null;
      this.hud?.hideDeath();
      this._eyeDamp = body ? bodyEyeHeight(body) : 1.66;
    }

    if (!silent) {
      const color = new THREE.Color(record.color).getHex();
      this.effects.spawnBurst(record.pos, color);
      if (record.isLocal) this.audio?.spawn();
    }
    return record;
  }

  respawnRecord(record) {
    if (!this.isAuthority || !record) return;
    this._spawnRecord(record);
    const bot = this.botControllers.get(record.id);
    bot?.reset({ pos: record.pos, yaw: record.yaw });
    if (record.isLocal) {
      this.hud?.showHint('再展開 // 戦闘復帰', 1.6);
    } else if (this.room?.isHost && !record.isBot) {
      this.room.sendTo(record.id, {
        t: MSG.RESPAWN,
        pos: [record.pos.x, record.pos.y, record.pos.z],
        yaw: record.yaw,
        health: MAX_HEALTH,
        time: this.matchTime,
      });
    }
  }

  _reviveLocal(pos, yaw = 0, health = MAX_HEALTH) {
    const record = this.localRecord;
    record.pos.copy(pos);
    record.vel.set(0, 0, 0);
    record.yaw = normalizeAngle(yaw);
    record.pitch = 0;
    record.crouch = false;
    record.grounded = false;
    record.moving = false;
    record.alive = true;
    record.health = clamp(health, 1, MAX_HEALTH);
    record.respawnAt = 0;
    record.respawnRemaining = 0;
    record.invulnerableUntil = this.time + SPAWN_PROTECT;
    record.missedSnapshots = 0;

    const body = record.body;
    if (body) {
      body.pos.copy(record.pos);
      body.vel.set(0, 0, 0);
      body.yaw = record.yaw;
      body.pitch = 0;
      body.crouch = false;
      body.grounded = false;
      body.groundSolid = null;
      body.coyote = 0;
      body.jumpBuffer = 0;
      body.gravityScale = 1;
      body.updraft = 0;
      body.jumpScale = 1;
      body.gimmickCooldowns?.clear();
      this._eyeDamp = bodyEyeHeight(body);
    }
    for (const weapon of this.loadout) weapon.refill();
    this.weapon?.cancelReload();
    this.localDeath = null;
    this.hud?.hideDeath();
    this.effects.spawnBurst(record.pos, new THREE.Color(record.color).getHex());
    this.audio?.spawn();
    this._landDip = 0;
    this._bobPhase = 0;
  }

  addGuestRecord({ id, name, color, weaponId = 'pulse' }) {
    if (!id || this.records.has(id)) return this.records.get(id) || null;
    const record = this._createRecord({
      id,
      name,
      color: color || this.nextPlayerColor(),
      weaponId,
      isBot: false,
    });
    this._spawnRecord(record, { silent: true });
    return record;
  }

  addBot({ name, color }) {
    this._botSeq += 1;
    const record = this._createRecord({
      id: `bot_${this._botSeq}`,
      name,
      color: color || this.nextPlayerColor(),
      isBot: true,
    });
    this._spawnRecord(record, { silent: true, initial: true });
    return record;
  }

  removePlayer(id, { notify = true } = {}) {
    const record = this.records.get(id);
    if (!record || record.isLocal) return;
    record.avatar?.dispose();
    this.records.delete(id);
    this.botControllers.delete(id);
    if (notify) this.hud?.showToast(`${record.name} が退出しました`, record.color, 2200);
  }

  getRoster() {
    const roster = [];
    for (const record of this.records.values()) {
      if (record.isBot) continue;
      roster.push({
        id: record.id,
        name: record.name,
        color: record.color,
        weapon: record.weaponId || 'pulse',
        kills: record.kills || 0,
        deaths: record.deaths || 0,
      });
    }
    return roster;
  }

  getWeaponDef(id) {
    return this.registry.get(id);
  }

  /**
   * Replace the local loadout while still in the lobby. Once deployed the
   * choice is locked for the rest of the match.
   */
  setLocalWeapon(id, { force = false } = {}) {
    if (this.deployed && !force) return false;
    const next = this.registry.createInstance(id);
    if (!next) return false;
    if (next.id === this.weaponId) return true;
    this.weapon?.cancelReload();
    this.loadout = [next];
    this.weapon = next;
    this.weaponId = next.id;
    this.localRecord.weaponId = next.id;
    this.viewModel?.setWeapon(next.id);
    this.hud?.refreshWeaponBar();
    return true;
  }

  requestMatchStart() {
    if (this.deployed || this.practice) return false;
    this.matchStartRequested = true;
    this.onMatchStart?.();
    return true;
  }

  getDamageableTargets(ownerId = null) {
    const targets = [];
    for (const record of this.records.values()) {
      if (!record.alive || record.id === ownerId) continue;
      targets.push({ state: record, record });
    }
    return targets;
  }

  start() {
    if (this.running) return this;
    this.running = true;
    this.net.bind();
    if (this.room) this.room.markSessionReady();
    this.input.setEnabled(false);
    this._lastFrame = performance.now();
    this._frameHandle = requestAnimationFrame(this._tick);
    return this;
  }

  setDeployed(value = true) {
    const next = Boolean(value);
    if (next === this.deployed) return;
    this.deployed = next;
    this.matchTime = 0;
    this._accumulator = 0;
    this._lastFrame = performance.now();
    if (this.deployed) {
      this.input.setEnabled(true);
      this.hud?.showHint(
        this.practice ? '演習開始 // BOTS ONLINE' : '戦闘開始 // 接続完了',
        2.4,
      );
    } else {
      this.input.setEnabled(false);
    }
  }

  setPaused(value) {
    this.paused = Boolean(value);
    if (this.paused) {
      this.input.setEnabled(false);
    } else if (this.deployed) {
      this.input.setEnabled(true);
    }
  }

  setLobbyMode(value) {
    this.lobbyMode = Boolean(value);
    this._accumulator = 0;
    if (!this.lobbyMode) this.resize();
  }

  _tick = (now) => {
    if (!this.running || this._disposed) return;
    const rawDt = Math.max(0, (now - this._lastFrame) / 1000);
    this._lastFrame = now;
    const dt = clamp(rawDt, 0, 0.1);
    if (rawDt > 0) this.fps = this.fps * 0.9 + (1 / Math.max(rawDt, 0.0001)) * 0.1;

    const simulate = !(this.paused && this.practice);
    let steps = 0;
    if (simulate) {
      this._accumulator += dt;
      while (this._accumulator >= FIXED_STEP && steps < MAX_STEPS) {
        this.fixedUpdate(FIXED_STEP);
        this._accumulator -= FIXED_STEP;
        steps += 1;
      }
      if (steps >= MAX_STEPS) this._accumulator = 0;
    } else {
      this._accumulator = 0;
    }

    if (this.lobbyMode) {
      this.room?.update();
      this.input.endFrame();
      this._frameHandle = requestAnimationFrame(this._tick);
      return;
    }

    this.updateVisuals(dt);
    this.hud?.update(dt);
    this.viewModel.update(dt, this.time, {
      reloading: this.weapon?.reloading,
      reloadProgress: this.weapon?.reloadProgress ?? 0,
    });
    this.render(dt);
    if (steps > 0 || !simulate) this.input.endFrame();
    this.room?.update();
    this._frameHandle = requestAnimationFrame(this._tick);
  };

  fixedUpdate(dt) {
    if (this._disposed) return;
    this.time += dt;
    if (this.deployed) this.matchTime += dt;

    this.stage.update(dt, this.time);

    if (this.deployed) {
      if (this.localRecord.alive) this._updateLocal(dt);
      if (this.practice) this._updateBots(dt);
      this.projectiles.update(dt);
    }

    this._updatePickups(dt);
    this._updateRespawns();
    this._updateTimers(dt);
    this.net.update(dt);
    this.combat.updateCrosshair(dt);
    // Tracers, particles, flashes and screen shake are simulation-timed.
    this.effects.update(dt);
  }

  _updateLocal(dt) {
    const record = this.localRecord;
    const body = record.body;
    if (!body) return;

    body.gravityScale = 1;
    body.updraft = 0;
    body.jumpScale = 1;

    const look = this.input.takeLook();
    const sensitivity = this.settings?.get('sensitivity') ?? 1;
    if (look.x || look.y) {
      record.yaw = normalizeAngle(record.yaw - look.x * 0.0022 * sensitivity);
      record.pitch = clamp(record.pitch - look.y * 0.0022 * sensitivity, -1.5, 1.5);
      this.viewModel.addSway(look.x, look.y);
    }

    // One weapon per player: switching is intentionally unavailable in-match.
    const wantCrouch = this.input.anyDown('ControlLeft', 'ControlRight');
    this.physics.setCrouch(body, wantCrouch);
    body.yaw = record.yaw;
    body.pitch = record.pitch;

    const forward = this.input.moveForward;
    const strafe = this.input.moveRight;
    const yaw = record.yaw;
    let wishX = -Math.sin(yaw) * forward + Math.cos(yaw) * strafe;
    let wishZ = -Math.cos(yaw) * forward - Math.sin(yaw) * strafe;
    const wishLen = Math.hypot(wishX, wishZ);
    if (wishLen > 1) {
      wishX /= wishLen;
      wishZ /= wishLen;
    }

    const jumpPressed = this.input.consumeKey('Space');
    const sprint = this.input.anyDown('ShiftLeft', 'ShiftRight') && !wantCrouch;

    this._processTriggers(body, record, dt);
    if (!record.alive) {
      this._syncRecordFromBody(record);
      return;
    }

    this.physics.moveBody(
      body,
      {
        wishX,
        wishZ,
        sprint,
        jumpPressed,
        carry: true,
        noMove: !this.input.enabled,
      },
      dt,
    );

    this._syncRecordFromBody(record);

    if (body.justJumped) this.audio?.jump();
    if (body.justLanded) {
      this._landDip = Math.min(0.09, body.landSpeed * 0.0035);
      this.effects.addShake(Math.min(0.09, body.landSpeed * 0.0035));
      if (body.landSpeed > 6) this.audio?.land();
    }

    if (record.pos.y < -12) {
      this._fallOut(record);
      return;
    }

    this.combat.updateLocal(dt);
  }

  _syncRecordFromBody(record) {
    const body = record.body;
    if (!body) return;
    record.pos.copy(body.pos);
    record.vel.copy(body.vel);
    record.yaw = body.yaw;
    record.pitch = body.pitch;
    record.crouch = body.crouch;
    record.grounded = body.grounded;
    record.moving = Math.hypot(body.vel.x, body.vel.z) > 1.2;
  }

  switchWeapon(index) {
    if (!this.loadout.length) return;
    const wrapped = ((index % this.loadout.length) + this.loadout.length) % this.loadout.length;
    const next = this.loadout[wrapped];
    if (!next || next === this.weapon) return;
    this.weapon?.cancelReload();
    this.weapon = next;
    this.weaponId = next.id;
    this.localRecord.weaponId = next.id;
    this.viewModel.setWeapon(next.id);
    this.audio?.switchWeapon();
  }

  _updateBots(dt) {
    for (const controller of this.botControllers.values()) {
      const record = controller.record;
      if (!record.alive || !record.body) continue;
      const body = record.body;
      body.gravityScale = 1;
      body.updraft = 0;
      body.jumpScale = 1;
      body.gimmickCooldowns ??= new Map();

      this._processTriggers(body, record, dt);
      if (!record.alive) {
        record.pos.copy(body.pos);
        continue;
      }

      controller.update(dt, this.time);
      record.weaponId = controller.weaponId;

      if (record.pos.y < -12) {
        this.applyDamage(record.id, 999, null, 'fall', { weaponName: 'VOID' });
      }
    }
  }

  _processTriggers(body, record, dt) {
    if (!body || !record) return;
    const aabb = playerAABB(body.pos, body.radius, bodyHeight(body), this._triggerBox);
    const triggers = this.physics.triggersAt(aabb);
    for (const trigger of triggers) {
      const handler = this.stage.getTriggerHandler(trigger.kind);
      if (!handler) continue;
      try {
        handler(body, trigger, { session: this, dt, time: this.time });
      } catch (error) {
        console.warn(`[GameSession] trigger "${trigger.kind}" failed`, error);
      }
    }
  }

  _fallOut(record) {
    if (!record?.alive) return;
    if (!this.isAuthority) {
      record.health = 0;
      record.alive = false;
      record.respawnAt = this.matchTime + RESPAWN_DELAY;
      record.respawnRemaining = RESPAWN_DELAY;
      this.localDeath = { killerName: null, weaponName: 'VOID' };
      this.hud?.showDeath(null, 'VOID');
      this.hud?.showDamage(100);
      this.audio?.death();
      this.weapon?.cancelReload();
      this.net.sendHazard({ kind: 'fall' });
      return;
    }
    this.applyDamage(record.id, 999, null, 'fall', { weaponName: 'VOID' });
  }

  _updatePickups(_dt) {
    if (!this.stage?.pickups?.length) return;
    if (!this.isAuthority) {
      this._requestGuestPickups();
      return;
    }

    for (const pickup of this.stage.pickups) {
      if (!pickup.available) continue;
      for (const record of this.records.values()) {
        if (!record.alive || record.health >= record.maxHealth) continue;
        if (!record.isLocal && !record.isBot) continue;
        if (this._nearPickup(record, pickup)) {
          this._applyHeal(record, pickup);
          break;
        }
      }
    }
  }

  _requestGuestPickups() {
    const record = this.localRecord;
    if (!record.alive || record.health >= record.maxHealth) return;
    if (this.time < this._pickupCooldown) return;
    for (const pickup of this.stage.pickups) {
      if (!pickup.available) continue;
      if (!this._nearPickup(record, pickup)) continue;
      this._pickupCooldown = this.time + 1.1;
      this.net.sendHeal(pickup.id);
      break;
    }
  }

  _nearPickup(record, pickup) {
    const radius = (pickup.radius ?? 1.45) + 0.3;
    const dx = record.pos.x - pickup.pos.x;
    const dz = record.pos.z - pickup.pos.z;
    if (dx * dx + dz * dz > radius * radius) return false;
    const bottom = pickup.pos.y - 0.6;
    const top = pickup.pos.y + (pickup.height ?? 1.6);
    const playerBottom = record.pos.y;
    const playerTop = record.pos.y + (record.crouch ? 1.3 : 1.82);
    return playerBottom < top && playerTop > bottom;
  }

  _applyHeal(record, pickup) {
    if (!record?.alive || !pickup) return 0;
    const amount = Math.min(pickup.amount ?? 35, record.maxHealth - record.health);
    if (amount <= 0) return 0;
    record.health = clamp(record.health + amount, 0, record.maxHealth);
    record.avatar?.setHealth(record.health);
    pickup.available = false;
    pickup.respawnAt = this.time + (pickup.respawn ?? 16);
    pickup.group.visible = false;
    this.effects.pickupBurst(
      new THREE.Vector3(pickup.pos.x, pickup.pos.y, pickup.pos.z),
      0xa6ff4d,
    );
    if (record.isLocal) {
      this.audio?.pickup();
      this.hud?.showToast(`+${Math.round(amount)} INTEGRITY`, '#a6ff4d', 1600);
      this.hud?.showHint('体力回復 // INTEGRITY RESTORED', 1.5);
    }
    return amount;
  }

  _updateRespawns() {
    if (!this.isAuthority) return;
    for (const record of this.records.values()) {
      if (record.alive) continue;
      if (record.respawnAt > 0 && this.matchTime >= record.respawnAt) {
        this.respawnRecord(record);
      }
    }
  }

  _updateTimers(dt) {
    for (const record of this.records.values()) {
      if (record.alive) {
        record.respawnRemaining = 0;
      } else if (this.isAuthority) {
        record.respawnRemaining = Math.max(0, record.respawnAt - this.matchTime);
      } else {
        record.respawnRemaining = Math.max(0, record.respawnRemaining - dt);
      }
    }
  }

  applyDamage(targetId, amount, attackerId = null, cause = 'weapon', options = {}) {
    const target = this.records.get(targetId);
    if (!target?.alive) return { applied: 0, killed: false };
    const environmental = cause === 'fall' || cause === 'laser';
    if (!environmental && this.time < (target.invulnerableUntil || 0)) {
      return { applied: 0, killed: false };
    }
    const damage = clamp(Number(amount) || 0, 0, 999);
    if (damage <= 0) return { applied: 0, killed: false };

    const attacker = attackerId ? this.records.get(attackerId) : null;
    const before = target.health;
    target.health = clamp(target.health - damage, 0, target.maxHealth);
    target.avatar?.setHealth(target.health);

    if (target.isLocal) {
      const angle = attacker ? this._damageAngle(attacker.pos) : null;
      this.hud?.showDamage(damage, angle);
      this.audio?.hurt();
      this.effects.addShake(clamp(damage * 0.004, 0.02, 0.2));
    }

    if (this.room?.isHost && !target.isLocal && !target.isBot) {
      this.room.sendTo(target.id, {
        t: MSG.DAMAGE,
        targetId: target.id,
        attackerId: attacker?.id ?? null,
        amount: damage,
        health: target.health,
        cause,
        weaponId: options.weaponId ?? null,
        headshot: Boolean(options.headshot),
      });
    }

    if (attacker?.isLocal && attacker !== target) {
      this.hud?.showHitmarker(false);
      this.audio?.hitmarker(false);
    }

    if (target.health <= 0) {
      this._kill(target, attacker, cause, options);
      return { applied: before, killed: true };
    }
    return { applied: damage, killed: false };
  }

  applyOutgoingDamage(target, amount, weaponId, options = {}) {
    if (!target?.alive) return;
    const cause = options.cause || 'weapon';
    if (!this.isAuthority) {
      if (!target.isLocal) {
        this.hud?.showHitmarker(false);
        this.audio?.hitmarker(false);
      }
      this.net.sendHit({
        targetId: target.id,
        amount: Math.round(clamp(amount, 0, 999) * 10) / 10,
        weaponId,
        headshot: Boolean(options.headshot),
        cause,
      });
      return;
    }
    this.applyDamage(
      target.id,
      amount,
      options.attackerId || this.localId,
      cause,
      { ...options, weaponId },
    );
  }

  _kill(victim, killer, cause, options = {}) {
    if (!victim?.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.deaths = (victim.deaths || 0) + 1;
    victim.respawnAt = this.matchTime + RESPAWN_DELAY;
    victim.respawnRemaining = RESPAWN_DELAY;
    victim.body?.vel.set(0, 0, 0);
    victim.avatar?.setAlive(false);

    if (killer && killer !== victim) {
      killer.kills = (killer.kills || 0) + 1;
    }

    let weaponName = options.weaponName;
    if (!weaponName && options.weaponId) weaponName = this.getWeaponDef(options.weaponId)?.name;
    if (!weaponName) {
      if (cause === 'laser') weaponName = 'LASER FENCE';
      else if (cause === 'fall') weaponName = 'VOID';
      else if (cause === 'splash' || cause === 'projectile') weaponName = 'EXPLOSIVE';
      else weaponName = 'ENVIRONMENT';
    }

    const color = killer?.color ?? '#ff3b5c';
    const killInfo = {
      killerId: killer?.id ?? null,
      killerName: killer?.name ?? null,
      victimId: victim.id,
      victimName: victim.name,
      weaponName,
      headshot: Boolean(options.headshot),
      color,
      respawnIn: RESPAWN_DELAY,
      killerKills: killer?.kills ?? null,
      victimDeaths: victim.deaths,
      cause,
    };

    if (victim.isLocal) {
      this.localDeath = { killerName: killer?.name ?? null, weaponName };
      this.hud?.showDeath(killer?.name ?? null, weaponName);
      this.hud?.showDamage(100, killer ? this._damageAngle(killer.pos) : null);
      this.audio?.death();
      this.weapon?.cancelReload();
      this.effects.addShake(0.14);
    }
    if (killer?.isLocal) {
      this.hud?.showHitmarker(true);
      this.audio?.hitmarker(true);
      this.hud?.showToast(`ELIMINATED ${victim.name}`, killer.color, 1400);
    }

    this.hud?.addKill(killInfo);

    if (this.room?.isHost) {
      this.room.broadcast({ t: MSG.KILL, ...killInfo, weaponId: options.weaponId ?? null });
    }
  }

  handleKillMessage(message) {
    const victim = this.records.get(message.victimId);
    const killer = message.killerId ? this.records.get(message.killerId) : null;
    const respawnIn = safeNumber(message.respawnIn, RESPAWN_DELAY, 0, 20);
    if (victim) {
      victim.alive = false;
      victim.health = 0;
      victim.deaths = safeNumber(message.victimDeaths, victim.deaths + 1, 0, 99999);
      victim.respawnAt = this.matchTime + respawnIn;
      victim.respawnRemaining = respawnIn;
      victim.body?.vel.set(0, 0, 0);
      victim.avatar?.setAlive(false);
    }
    if (killer && message.killerKills != null) {
      killer.kills = safeNumber(message.killerKills, killer.kills, 0, 99999);
    }

    if (victim?.isLocal) {
      this.localDeath = {
        killerName: message.killerName || null,
        weaponName: message.weaponName || null,
      };
      this.hud?.showDeath(message.killerName || null, message.weaponName || null);
      this.hud?.showDamage(100);
      this.audio?.death();
      this.weapon?.cancelReload();
      this.effects.addShake(0.14);
    }
    if (killer?.isLocal) {
      this.hud?.showHitmarker(true);
      this.audio?.hitmarker(true);
    }
    this.hud?.addKill({
      killerId: message.killerId,
      killerName: message.killerName,
      victimId: message.victimId,
      victimName: message.victimName,
      weaponName: message.weaponName,
      headshot: Boolean(message.headshot),
      color: message.color || '#ff3b5c',
    });
  }

  handleDamageMessage(message) {
    const target = this.records.get(message.targetId);
    if (!target) return;
    const previous = target.health;
    if (typeof message.health === 'number') {
      target.health = clamp(message.health, 0, target.maxHealth);
    } else {
      target.health = clamp(target.health - (Number(message.amount) || 0), 0, target.maxHealth);
    }
    target.avatar?.setHealth(target.health);
    if (target.isLocal && target.health !== previous) {
      const attacker = message.attackerId ? this.records.get(message.attackerId) : null;
      this.hud?.showDamage(Number(message.amount) || 0, attacker ? this._damageAngle(attacker.pos) : null);
      this.audio?.hurt();
      this.effects.addShake(clamp((Number(message.amount) || 0) * 0.004, 0.015, 0.18));
    }
  }

  handleHealMessage(message) {
    const record = this.localRecord;
    if (!record) return;
    if (message.targetId && message.targetId !== this.localId) return;
    const before = record.health;
    record.health = clamp(
      typeof message.health === 'number' ? message.health : record.health + (message.amount || 0),
      0,
      record.maxHealth,
    );
    const pickup = this.stage.pickups.find((item) => item.id === message.pickupId);
    if (pickup) {
      pickup.available = false;
      pickup.group.visible = false;
      pickup.respawnAt = this.time + (pickup.respawn ?? 16);
    }
    if (record.health > before) {
      this.effects.pickupBurst(record.pos.clone().add(new THREE.Vector3(0, 0.9, 0)), 0xa6ff4d);
      this.audio?.pickup();
      this.hud?.showToast(`+${Math.round(record.health - before)} INTEGRITY`, '#a6ff4d', 1600);
      this.hud?.showHint('体力回復 // INTEGRITY RESTORED', 1.5);
    }
  }

  handleRespawnMessage(message) {
    const pos = this.parsePosition(message.pos);
    if (!pos || !this.localRecord) return;
    this._reviveLocal(pos, safeNumber(message.yaw, 0), safeNumber(message.health, MAX_HEALTH, 1, MAX_HEALTH));
  }

  parsePosition(value) {
    if (!Array.isArray(value) || value.length < 3) return null;
    const bounds = this.stage.bounds;
    return new THREE.Vector3(
      clamp(safeNumber(value[0], 0), bounds.minX - 1, bounds.maxX + 1),
      clamp(safeNumber(value[1], 0.05), -8, 30),
      clamp(safeNumber(value[2], 0), bounds.minZ - 1, bounds.maxZ + 1),
    );
  }

  _damageAngle(attackerPos) {
    const local = this.localRecord;
    if (!local || !attackerPos) return 0;
    const dx = attackerPos.x - local.pos.x;
    const dz = attackerPos.z - local.pos.z;
    const yaw = local.yaw;
    const right = dx * Math.cos(yaw) - dz * Math.sin(yaw);
    const forward = -dx * Math.sin(yaw) - dz * Math.cos(yaw);
    return Math.atan2(right, forward);
  }

  onJumpPad(body, trigger) {
    const record = this.records.get(body?.recordId);
    const color = trigger.data?.color ?? 0x00f6ff;
    this.effects.jumpPadBurst(new THREE.Vector3(body.pos.x, body.pos.y + 0.18, body.pos.z), color);
    this.effects.addShake(0.045);
    this.audio?.jumpPad();
    if (record?.isLocal) this.hud?.showHint('ジャンプパッド // LAUNCH', 0.9);
  }

  onTeleport(body, from, target, color) {
    const record = this.records.get(body?.recordId);
    if (from) this.effects.teleportBurst(from.clone(), color);
    if (target) this.effects.teleportBurst(target.clone(), color);
    this.audio?.teleport();
    if (record?.isLocal) {
      this.hud?.showHint('位相転移 // TELEPORT', 1.0);
      if (body) this._eyeDamp = bodyEyeHeight(body);
    }
  }

  damageSimulatedPlayer(body, amount, cause = 'hazard') {
    const record = this.records.get(body?.recordId);
    if (!record?.alive) return;
    const damage = clamp(safeNumber(amount, 0), 0, 200);
    if (!this.isAuthority) {
      if (record.isLocal) {
        record.health = clamp(record.health - damage, 0, record.maxHealth);
        this.hud?.showDamage(damage);
        this.audio?.hurt();
        this.effects.addShake(clamp(damage * 0.004, 0.02, 0.16));
      }
      this.net.sendHazard({ kind: cause === 'laser' ? 'laser' : 'fall' });
      return;
    }
    this.applyDamage(record.id, damage, null, cause, {
      weaponName: cause === 'laser' ? 'LASER FENCE' : 'HAZARD',
    });
  }

  panFor(pos) {
    const local = this.localRecord;
    if (!local || !pos) return 0;
    const dx = pos.x - local.pos.x;
    const dz = pos.z - local.pos.z;
    const length = Math.hypot(dx, dz);
    if (length < 0.001) return 0;
    return clamp((dx * Math.cos(local.yaw) - dz * Math.sin(local.yaw)) / length, -1, 1);
  }

  volumeFor(pos, maxDistance = 70) {
    const local = this.localRecord;
    if (!local || !pos) return 0.8;
    return clamp(1 - local.pos.distanceTo(pos) / maxDistance, 0.1, 1);
  }

  playExplosionAudio(pos, remote = false) {
    const distance = this.localRecord ? this.localRecord.pos.distanceTo(pos) : 0;
    this.audio?.explosion({
      pan: this.panFor(pos),
      volume: this.volumeFor(pos, 90),
      distant: Boolean(remote) && distance > 12,
    });
  }

  netSendFire(message) {
    this.net?.sendFire(message);
  }

  netSendProjectile(message) {
    this.net?.sendProjectile(message);
  }

  botFire(bot, target, def) {
    this.combat?.botFire(bot, target, def);
  }

  handleProjectileDamage(projectile, position, directTarget) {
    this.combat?.handleProjectileDamage(projectile, position, directTarget);
  }

  updateVisuals(dt) {
    this._updateAvatars(dt);
    this._updateCamera(dt);
    const record = this.localRecord;
    if (record) {
      this.viewModel.setMove(Math.hypot(record.vel.x, record.vel.z), record.grounded);
    }
  }

  _updateAvatars(dt) {
    for (const record of this.records.values()) {
      const avatar = record.avatar;
      if (!avatar) continue;
      if (avatar.alive !== record.alive) avatar.setAlive(record.alive);
      avatar.setCrouch(record.crouch);
      if (record.alive) avatar.setHealth(record.health);

      const group = avatar.group;
      const distanceSq = group.position.distanceToSquared(record.pos);
      if (distanceSq > 64) {
        group.position.copy(record.pos);
      } else {
        const factor = 1 - Math.exp(-(record.isBot ? 30 : 20) * dt);
        group.position.lerp(record.pos, factor);
      }
      group.rotation.y = record.yaw;
      avatar.setCameraDistance(this.camera.position.distanceTo(group.position));

      const speed = Math.hypot(record.vel.x, record.vel.z) || (record.moving ? 6 : 0);
      avatar.update(dt, {
        time: this.time,
        speed,
        grounded: record.grounded,
        pitch: record.pitch,
        firing: false,
      });
    }
  }

  _updateCamera(dt) {
    const record = this.localRecord;
    if (!record) return;
    const body = record.body;
    const eye = record.alive && body ? bodyEyeHeight(body) : 0.42;
    this._eyeDamp = damp(this._eyeDamp, eye, 18, dt);
    const speed = Math.hypot(record.vel.x, record.vel.z);
    this._bobPhase += dt * (2.4 + Math.min(speed, 12) * 1.1);
    this._landDip = damp(this._landDip, 0, 9, dt);
    this.effects.getShakeOffset(this._shakeOffset);

    const speedNorm = clamp(speed / 8, 0, 1.3);
    const bob = record.alive && record.grounded ? Math.sin(this._bobPhase * 2) * 0.012 * speedNorm : 0;

    this.camera.position.set(
      record.pos.x + this._shakeOffset.x * 0.07,
      record.pos.y + this._eyeDamp + bob + this._shakeOffset.y * 0.05 - this._landDip,
      record.pos.z + this._shakeOffset.z * 0.07,
    );

    const def = this.weapon?.def;
    const targetFov = this.aiming && record.alive && def?.zoomFov
      ? def.zoomFov
      : this.settings?.get('fov') ?? 82;
    this.camera.fov = damp(this.camera.fov, targetFov, 12, dt);
    this.camera.updateProjectionMatrix();

    this.camera.rotation.set(
      clamp(record.pitch + this._shakeOffset.y * 0.009, -1.52, 1.52),
      record.yaw + this._shakeOffset.x * 0.012,
      this._shakeOffset.z * 0.006,
    );
  }

  render(_dt) {
    this.viewModel.setFov(this.camera.fov);
    if (this._bloomEnabled && this.composer) {
      try {
        this.composer.render();
      } catch (error) {
        console.warn('[GameSession] post-processing failed, falling back', error);
        this._bloomEnabled = false;
        this.renderer.render(this.scene, this.camera);
      }
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    this.viewModel.render();
  }

  resize() {
    const rect = typeof this.canvas.getBoundingClientRect === 'function'
      ? this.canvas.getBoundingClientRect()
      : { width: 0, height: 0 };
    let width = Math.round(this.canvas.clientWidth || rect.width || window.innerWidth || 1280);
    let height = Math.round(this.canvas.clientHeight || rect.height || window.innerHeight || 720);
    if (width < 2 || height < 2) {
      width = 1280;
      height = 720;
    }
    this._width = width;
    this._height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(width, height);
    }
    this.viewModel.resize(width, height, this.camera.fov);
  }

  applyQuality() {
    const high = this.settings?.get('quality') !== 'low';
    const dpr = high ? Math.min(window.devicePixelRatio || 1, 1.75) : 1;
    this.renderer.setPixelRatio(dpr);
    if (high) this._ensureComposer();
    this._bloomEnabled = Boolean(high && this.composer);
    this.resize();
  }

  _ensureComposer() {
    if (this.composer || this._composerAttempted) return;
    this._composerAttempted = true;
    try {
      const composer = new EffectComposer(this.renderer);
      composer.addPass(new RenderPass(this.scene, this.camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(this._width, this._height), 0.52, 0.55, 0.72);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      this.composer = composer;
      this.bloomPass = bloom;
    } catch (error) {
      console.warn('[GameSession] post-processing unavailable', error);
      this.composer = null;
      this.bloomPass = null;
    }
  }

  getDisplayPing() {
    if (!this.room || this.room.isHost) return null;
    return Number.isFinite(this.room.ping) ? this.room.ping : null;
  }

  getScoreboardData() {
    const rows = [...this.records.values()].map((record) => ({
      id: record.id,
      name: record.name,
      color: record.color,
      kills: record.kills || 0,
      deaths: record.deaths || 0,
      alive: record.alive,
      isLocal: record.isLocal,
      isHost: Boolean(record.isLocal && this.room?.isHost),
      isBot: record.isBot,
      ping: record.isLocal ? this.getDisplayPing() : record.ping,
    }));
    rows.sort((a, b) => (
      b.kills - a.kills
      || a.deaths - b.deaths
      || a.name.localeCompare(b.name)
    ));
    return rows;
  }

  getRenderLabel() {
    const quality = this.settings?.get('quality') === 'low' ? 'LOW' : 'HIGH';
    const api = this.renderer.capabilities?.isWebGL2 ? 'WEBGL2' : 'WEBGL';
    return `${api} / ${quality}`;
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.running = false;
    cancelAnimationFrame(this._frameHandle);
    window.removeEventListener('resize', this._resizeHandler);
    this._settingsOff?.();
    try {
      if (document.pointerLockElement === this.canvas) document.exitPointerLock?.();
    } catch { /* noop */ }

    this.net.dispose();
    this.hud.dispose();
    this.input.dispose();
    this.viewModel.dispose();
    this.projectiles.clear();

    for (const record of this.records.values()) {
      try { record.avatar?.dispose(); } catch (error) { console.warn('[GameSession] avatar dispose failed', error); }
    }
    this.records.clear();
    this.botControllers.clear();
    this.bots.length = 0;

    this.stage.dispose();
    this.effects.dispose();
    this.composer?.dispose?.();
    this.composer = null;
    this.bloomPass = null;

    this.renderer.dispose?.();
    this.scene.clear();
  }
}
