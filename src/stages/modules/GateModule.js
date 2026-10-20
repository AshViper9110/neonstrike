import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, makeHologramMaterial, makeLabelSprite, createCanvasTexture } from '../stageKit.js';

/**
 * The pass-through prototype. `blocks` selects collision tags.
 *   blocks ['bullet','projectile'] -> players walk through, shots stop.
 *   blocks ['player']              -> bullets/projectiles pass, players stop.
 * This makes the gate a reusable building block for future entity types too.
 */
class GateModule extends StageModule {
  build(ctx, stage) {
    const cfg = this.config;
    const [x, y, z] = cfg.pos;
    const width = cfg.width ?? 6;
    const height = cfg.height ?? 4;
    const axis = cfg.axis ?? 'x';
    const color = cfg.color ?? NEON_COLORS.violet;
    const blocks = cfg.blocks ?? ['bullet', 'projectile'];
    this.group = new THREE.Group();
    this.group.name = `phase-gate-${this.id}`;
    this.group.position.set(x, y, z);
    ctx.scene.add(this.group);

    const frameMat = ctx.materials.standard(`gate-frame-${color}`, {
      color: 0x0b1322,
      metalness: 0.8,
      roughness: 0.3,
      flatShading: true,
    });
    const halfW = width / 2;
    const halfH = height / 2;
    const postGeo = new THREE.BoxGeometry(0.22, height + 0.25, 0.22);
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(postGeo, frameMat);
      if (axis === 'x') post.position.set(side * halfW, 0, 0);
      else post.position.set(0, 0, side * halfW);
      this.group.add(post);
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, height, 0.03),
        ctx.materials.basic(`gate-post-${color}`, { color, toneMapped: false }),
      );
      if (axis === 'x') strip.position.set(side * halfW, 0, 0.125);
      else strip.position.set(0.125, 0, side * halfW);
      this.group.add(strip);
    }
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(axis === 'x' ? width + 0.25 : 0.22, 0.2, axis === 'x' ? 0.22 : width + 0.25),
      frameMat,
    );
    top.position.y = halfH + 0.08;
    this.group.add(top);
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(axis === 'x' ? width + 0.3 : 0.45, 0.12, axis === 'x' ? 0.45 : width + 0.3),
      frameMat,
    );
    base.position.y = -halfH - 0.05;
    this.group.add(base);

    const texture = createCanvasTexture(256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      for (let row = 0; row < 32; row++) {
        const a = 0.05 + (row % 4 === 0 ? 0.18 : 0.02);
        g.fillStyle = `rgba(255,255,255,${a})`;
        g.fillRect(0, row * 8, w, 1);
      }
      g.strokeStyle = 'rgba(255,255,255,0.12)';
      g.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        g.strokeRect(14 + i * 6, 14 + i * 6, w - 28 - i * 12, h - 28 - i * 12);
      }
      g.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < 40; i++) {
        g.fillRect(Math.random() * w, Math.random() * h, 2, 7);
      }
    });
    ctx.materials.trackTexture(texture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(axis === 'x' ? 3 : 1, 2);
    const fieldMat = ctx.materials.basic(`gate-field-${color}`, {
      map: texture,
      color,
      transparent: true,
      opacity: 0.44,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const fieldGeo = new THREE.PlaneGeometry(width - 0.28, height - 0.15);
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    if (axis === 'z') field.rotation.y = Math.PI / 2;
    this.group.add(field);
    this.texture = texture;
    this.fieldMat = fieldMat;
    this.field = field;

    const passPlayer = !blocks.includes('player');
    const passBullet = !blocks.includes('bullet');
    const labelText = passPlayer ? 'PLAYERS PASS' : 'BULLETS PASS';
    const sub = passPlayer ? '弾丸は遮断' : '弾丸のみ通過';
    const label = makeLabelSprite(ctx, labelText, sub, `#${new THREE.Color(color).getHexString()}`, { width: 512, height: 128 });
    label.position.set(0, halfH + 0.75, 0);
    label.scale.set(3.4, 0.85, 1);
    this.group.add(label);

    const size = axis === 'x' ? [width, height, 0.3] : [0.3, height, width];
    this.solid = ctx.physics.addSolid(
      new THREE.Box3(
        new THREE.Vector3(x - size[0] / 2, y - height / 2, z - size[2] / 2),
        new THREE.Vector3(x + size[0] / 2, y + height / 2, z + size[2] / 2),
      ),
      { blocks },
    );
    stage.addMapMarker({ x, z, color, type: 'gate' });
  }

  update(dt, time) {
    this.texture.offset.y = (time * 0.21) % 1;
    this.fieldMat.opacity = 0.37 + Math.sin(time * 2.2) * 0.06;
    this.field.scale.x = 1 + Math.sin(time * 3.1) * 0.004;
  }
}

stageModules.register('gate', GateModule);
export { GateModule };
