import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, createGridTexture, addNeonBox, addGlowStrip, addRing } from '../stageKit.js';

class FloorModule extends StageModule {
  build(ctx) {
    this.group = new THREE.Group();
    this.group.name = 'floor';
    ctx.scene.add(this.group);

    const texture = ctx.materials.trackTexture(createGridTexture(ctx.renderer));
    texture.repeat.set(8, 8);
    const floorMat = ctx.materials.standard('floor-grid', {
      map: texture,
      color: 0xa4d4e8,
      roughness: 0.82,
      metalness: 0.25,
      emissive: 0x0d9fbc,
      emissiveMap: texture,
      emissiveIntensity: 0.43,
    });

    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(65, 1, 65), floorMat);
    floorMesh.position.set(0, -0.5, 0);
    this.group.add(floorMesh);
    ctx.physics.addSolid(
      new THREE.Box3(new THREE.Vector3(-32.5, -1, -32.5), new THREE.Vector3(32.5, 0, 32.5)),
      { blocks: ['player', 'bullet', 'projectile'] },
    );

    // A raised inlay frame around the arena.
    const frameColor = NEON_COLORS.cyan;
    addGlowStrip(ctx, [-31.5, 0.015, -31.5], [31.5, 0.015, -31.5], frameColor, 0.055, this.group, 0.55);
    addGlowStrip(ctx, [-31.5, 0.015, 31.5], [31.5, 0.015, 31.5], frameColor, 0.055, this.group, 0.55);
    addGlowStrip(ctx, [-31.5, 0.015, -31.5], [-31.5, 0.015, 31.5], NEON_COLORS.magenta, 0.055, this.group, 0.5);
    addGlowStrip(ctx, [31.5, 0.015, -31.5], [31.5, 0.015, 31.5], NEON_COLORS.magenta, 0.055, this.group, 0.5);

    // Concentric rings under the central platform / around the arena.
    this.rings = [];
    for (const [radius, color, opacity] of [
      [24, NEON_COLORS.cyan, 0.18],
      [17.5, NEON_COLORS.magenta, 0.22],
      [12.2, NEON_COLORS.cyan, 0.22],
    ]) {
      const ring = addRing(ctx, {
        pos: [0, 0.022, 0],
        radius,
        tube: 0.022,
        color,
        opacity,
        group: this.group,
      });
      this.rings.push(ring);
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const inner = 12.5;
      const outer = 17;
      addGlowStrip(
        ctx,
        [Math.cos(angle) * inner, 0.024, Math.sin(angle) * inner],
        [Math.cos(angle) * outer, 0.024, Math.sin(angle) * outer],
        i % 2 ? NEON_COLORS.cyan : NEON_COLORS.magenta,
        0.035,
        this.group,
        0.35,
      );
    }

    // Underfloor neon glow blocks at the edges.
    for (let i = -2; i <= 2; i++) {
      addGlowStrip(ctx, [-31.9, 0.01, i * 9], [31.9, 0.01, i * 9], i === 0 ? NEON_COLORS.magenta : NEON_COLORS.cyan, 0.02, this.group, 0.08);
    }
  }

  update(dt, time) {
    if (this.rings) {
      this.rings[0].rotation.z = time * 0.025;
      this.rings[1].rotation.z = -time * 0.04;
      this.rings[2].rotation.z = time * 0.06;
    }
  }
}

stageModules.register('floor', FloorModule);
export { FloorModule };
