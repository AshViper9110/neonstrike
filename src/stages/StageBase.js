import * as THREE from 'three';
import { StageMaterials, NEON_COLORS } from './stageKit.js';
import { stageModules } from './StageModule.js';
import { choice, randRange } from '../core/utils.js';

/**
 * Base class for arena definitions. It owns:
 *  - the module composition pipeline
 *  - physics trigger registry
 *  - spawn points, bot waypoints and minimap data
 *  - shared per-stage materials
 *
 * Plug-in content only needs to implement build() and add modules.
 */
export class StageBase {
  constructor({ id = 'stage', name = 'UNTITLED ARENA', subtitle = '' } = {}) {
    this.id = id;
    this.name = name;
    this.subtitle = subtitle;
    this.ctx = null;
    this.modules = [];
    this.spawnPoints = [];
    this.botWaypoints = [];
    this.pickups = [];
    this.minimapBoxes = [];
    this.minimapMarkers = [];
    this.triggerHandlers = new Map();
    this.bounds = { minX: -32, maxX: 32, minZ: -32, maxZ: 32 };
    this.startedAt = 0;
    this._built = false;
    this._lights = [];
  }

  build(_ctx) {
    // subclass composes modules
  }

  init(ctx) {
    if (this._built) return this;
    this._built = true;
    this.ctx = ctx;
    ctx.stage = this;
    ctx.materials = new StageMaterials();
    this.build(ctx);
    return this;
  }

  addModule(spec) {
    if (!this.ctx) throw new Error('Stage not initialized');
    const module = stageModules.create({ id: `${spec.type}-${this.modules.length}`, ...spec });
    module.build(this.ctx, this);
    this.modules.push(module);
    return module;
  }

  addLight(light) {
    this.ctx.scene.add(light);
    this._lights.push(light);
    return light;
  }

  registerSpawn(x, y, z, yaw = 0) {
    this.spawnPoints.push({ pos: new THREE.Vector3(x, y, z), yaw });
  }

  registerWaypoint(x, z, y = 0) {
    this.botWaypoints.push(new THREE.Vector3(x, y, z));
  }

  addMapMarker(marker) {
    this.minimapMarkers.push(marker);
  }

  registerTrigger(box, { kind, data = {}, enabled = true, blocks = null } = {}) {
    const trigger = this.ctx.physics.addTrigger(box, { kind, data, enabled });
    return trigger;
  }

  registerTriggerHandler(kind, handler) {
    this.triggerHandlers.set(kind, handler);
  }

  getTriggerHandler(kind) {
    return this.triggerHandlers.get(kind);
  }

  pickSpawn(avoidPositions = [], random = Math.random) {
    if (!this.spawnPoints.length) {
      return { pos: new THREE.Vector3(0, 0.1, 0), yaw: 0 };
    }
    const scored = this.spawnPoints.map((spawn) => {
      let nearest = Infinity;
      for (const p of avoidPositions) {
        const d = spawn.pos.distanceToSquared(p);
        if (d < nearest) nearest = d;
      }
      return { spawn, nearest: Number.isFinite(nearest) ? nearest : 1000 };
    });
    scored.sort((a, b) => b.nearest - a.nearest);
    const pool = scored.slice(0, Math.max(1, Math.min(3, scored.length)));
    const picked = pool[Math.floor(random() * pool.length)]?.spawn ?? choice(this.spawnPoints);
    return { pos: picked.pos.clone().add(new THREE.Vector3(0, 0.03, 0)), yaw: picked.yaw };
  }

  randomWaypoint(near = null, maxDistance = Infinity) {
    const points = this.botWaypoints.filter((p) => !near || p.distanceTo(near) <= maxDistance);
    return choice(points.length ? points : this.botWaypoints)?.clone() ?? new THREE.Vector3();
  }

  update(dt, time) {
    if (!this.ctx) return;
    for (const module of this.modules) {
      module.update(dt, time, this.ctx, this);
    }
    for (const pickup of this.pickups) {
      if (pickup.module?.updatePickup) pickup.module.updatePickup(pickup, dt, time);
    }
  }

  dispose() {
    for (const module of [...this.modules].reverse()) {
      try { module.dispose(this.ctx); } catch (error) { console.warn('[Stage] module dispose failed', error); }
    }
    for (const light of this._lights) light.removeFromParent();
    this._lights.length = 0;
    this.ctx?.materials?.dispose();
    this.modules.length = 0;
    this.pickups.length = 0;
    this.minimapBoxes.length = 0;
    this.minimapMarkers.length = 0;
    this._built = false;
  }

  get accentColor() {
    return NEON_COLORS.cyan;
  }
}
