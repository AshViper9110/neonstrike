import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { addNeonBox, addGlowStrip, NEON_COLORS } from '../stageKit.js';

/**
 * Generic structural module. Every box can declare which collision tags it
 * blocks, making it usable as a wall, floor, bullet-shield, or one-way filter.
 */
class BlocksModule extends StageModule {
  build(ctx) {
    this.group = new THREE.Group();
    this.group.name = `blocks-${this.config.name || this.id}`;
    ctx.scene.add(this.group);
    const cfg = this.config;
    for (const spec of cfg.boxes || []) {
      const color = spec.color ?? NEON_COLORS.cyan;
      const result = addNeonBox(ctx, {
        pos: spec.pos,
        size: spec.size,
        color,
        baseColor: spec.baseColor ?? 0x070d18,
        edge: spec.edge !== false,
        opacity: spec.opacity ?? 0.7,
        glowCap: Boolean(spec.glowCap),
        solid: spec.solid !== false,
        blocks: spec.blocks ?? ['player', 'bullet', 'projectile'],
        minimap: spec.minimap !== false,
        group: this.group,
        metalness: spec.metalness ?? 0.6,
        roughness: spec.roughness ?? 0.48,
        emissive: spec.emissive ?? 0x000000,
        emissiveIntensity: spec.emissiveIntensity ?? 0,
      });
      if (spec.label && result.mesh) {
        result.mesh.userData.label = spec.label;
      }
    }
    for (const line of cfg.lines || []) {
      addGlowStrip(ctx, line.from, line.to, line.color ?? NEON_COLORS.cyan, line.thickness ?? 0.035, this.group, line.opacity ?? 0.8);
    }
    for (const light of cfg.lights || []) {
      const point = new THREE.PointLight(light.color ?? NEON_COLORS.cyan, light.intensity ?? 80, light.distance ?? 18, 2);
      point.position.set(...light.pos);
      this.group.add(point);
    }
  }
}

stageModules.register('blocks', BlocksModule);
export { BlocksModule };
