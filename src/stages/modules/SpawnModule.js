import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, addRing } from '../stageKit.js';

class SpawnModule extends StageModule {
  build(ctx, stage) {
    this.group = new THREE.Group();
    this.group.name = 'spawns';
    ctx.scene.add(this.group);
    this.rings = [];
    const cfg = this.config;
    for (const [index, spawn] of (cfg.spawns || []).entries()) {
      stage.registerSpawn(spawn.x, spawn.y ?? 0.03, spawn.z, spawn.yaw ?? 0);
      const color = spawn.color ?? (index % 2 ? NEON_COLORS.magenta : NEON_COLORS.cyan);
      if (spawn.visual === false) continue;
      const ring = addRing(ctx, {
        pos: [spawn.x, (spawn.y ?? 0.03) + 0.02, spawn.z],
        radius: 0.95,
        tube: 0.018,
        color,
        opacity: 0.34,
        group: this.group,
      });
      this.rings.push(ring);
      const inner = addRing(ctx, {
        pos: [spawn.x, (spawn.y ?? 0.03) + 0.03, spawn.z],
        radius: 0.42,
        tube: 0.012,
        color,
        opacity: 0.22,
        group: this.group,
      });
      this.rings.push(inner);
    }
    for (const waypoint of cfg.waypoints || []) {
      stage.registerWaypoint(waypoint[0], waypoint[1], waypoint[2] ?? 0);
    }
  }

  update(dt, time) {
    for (let i = 0; i < this.rings.length; i++) {
      const s = 1 + Math.sin(time * 1.6 + i * 1.7) * 0.08;
      this.rings[i].scale.setScalar(s);
    }
  }
}

stageModules.register('spawn', SpawnModule);
export { SpawnModule };
