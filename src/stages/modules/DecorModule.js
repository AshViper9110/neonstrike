import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, createCanvasTexture, addGlowStrip, addRing } from '../stageKit.js';

class DecorModule extends StageModule {
  build(ctx) {
    const cfg = this.config;
    this.group = new THREE.Group();
    ctx.scene.add(this.group);
    this.rings = [];
    this.shards = [];

    for (const ringCfg of cfg.rings || []) {
      const group = new THREE.Group();
      group.position.set(...ringCfg.pos);
      group.rotation.set(...(ringCfg.rotation ?? [0, 0, 0]));
      this.group.add(group);
      const ring = addRing(ctx, {
        pos: [0, 0, 0],
        radius: ringCfg.radius ?? 7,
        tube: ringCfg.tube ?? 0.035,
        color: ringCfg.color ?? NEON_COLORS.cyan,
        opacity: ringCfg.opacity ?? 0.32,
        group,
      });
      this.rings.push({ group, mesh: ring, speed: ringCfg.speed ?? 0.08, phase: Math.random() * 6 });
    }

    for (const signCfg of cfg.signs || []) {
      const texture = createCanvasTexture(1024, 256, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        g.fillStyle = 'rgba(4, 8, 18, 0.6)';
        g.fillRect(0, 0, w, h);
        g.strokeStyle = signCfg.color ?? '#00f6ff';
        g.globalAlpha = 0.7;
        g.lineWidth = 4;
        g.strokeRect(10, 10, w - 20, h - 20);
        g.globalAlpha = 0.22;
        for (let x = 0; x < w; x += 32) {
          g.beginPath();
          g.moveTo(x, 0);
          g.lineTo(x, h);
          g.strokeStyle = '#3fd7ee';
          g.lineWidth = 1;
          g.stroke();
        }
        g.globalAlpha = 1;
        g.fillStyle = signCfg.color ?? '#00f6ff';
        g.font = '900 86px Orbitron, sans-serif';
        g.textAlign = 'left';
        g.textBaseline = 'middle';
        g.fillText(signCfg.text ?? 'NEON', 48, 110);
        g.fillStyle = 'rgba(225, 250, 255, 0.66)';
        g.font = '500 26px Orbitron, sans-serif';
        g.fillText(signCfg.sub ?? '', 52, 188);
        g.fillStyle = signCfg.color ?? '#00f6ff';
        g.fillRect(48, 148, 120, 3);
        g.globalAlpha = 0.2;
        g.fillStyle = '#ffffff';
        for (let i = 0; i < 30; i++) {
          g.fillRect(Math.random() * w, Math.random() * h, Math.random() * 60, 1);
        }
      });
      ctx.materials.trackTexture(texture);
      const material = ctx.materials.basic(`sign-${signCfg.text}`, {
        map: texture,
        transparent: true,
        opacity: 0.86,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(signCfg.width ?? 14, signCfg.height ?? 3.5), material);
      mesh.position.set(...signCfg.pos);
      mesh.rotation.set(...(signCfg.rotation ?? [0, 0, 0]));
      this.group.add(mesh);
      this.signs ??= [];
      this.signs.push(mesh);
    }

    const shardColors = [NEON_COLORS.cyan, NEON_COLORS.magenta, NEON_COLORS.violet, NEON_COLORS.lime];
    for (let i = 0; i < 18; i++) {
      const color = shardColors[i % shardColors.length];
      const size = 0.2 + Math.random() * 0.55;
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(size, 0),
        ctx.materials.standard(`shard-${color}-${i % 3}`, {
          color: 0x0a1220,
          emissive: color,
          emissiveIntensity: 1.7,
          metalness: 0.4,
          roughness: 0.25,
          flatShading: true,
        }),
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = 13 + Math.random() * 16;
      mesh.position.set(Math.cos(angle) * radius, 5 + Math.random() * 8, Math.sin(angle) * radius);
      this.group.add(mesh);
      this.shards.push({
        mesh,
        baseY: mesh.position.y,
        radius,
        angle,
        speed: 0.018 + Math.random() * 0.04,
        bob: Math.random() * 6,
      });
    }

    for (const line of cfg.lines || []) {
      addGlowStrip(ctx, line.from, line.to, line.color ?? NEON_COLORS.cyan, line.thickness ?? 0.03, this.group, line.opacity ?? 0.4);
    }

    this.overhead = [];
    for (let i = 0; i < 2; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(52, 0.07, 0.07),
        ctx.materials.basic(`overhead-${i}`, { color: i ? NEON_COLORS.magenta : NEON_COLORS.cyan, toneMapped: false, transparent: true, opacity: 0.5 }),
      );
      bar.position.set(0, 12.5, i ? 12 : -12);
      this.group.add(bar);
      this.overhead.push(bar);
    }
  }

  update(dt, time) {
    for (const ring of this.rings) {
      ring.mesh.rotation.z = time * ring.speed + ring.phase;
      ring.group.rotation.y = Math.sin(time * 0.15 + ring.phase) * 0.08;
    }
    for (const shard of this.shards) {
      shard.angle += shard.speed * dt;
      shard.mesh.position.x = Math.cos(shard.angle) * shard.radius;
      shard.mesh.position.z = Math.sin(shard.angle) * shard.radius;
      shard.mesh.position.y = shard.baseY + Math.sin(time * 0.5 + shard.bob) * 0.35;
      shard.mesh.rotation.x = time * 0.3 + shard.bob;
      shard.mesh.rotation.y = time * 0.42 + shard.bob;
    }
    if (this.signs) {
      for (let i = 0; i < this.signs.length; i++) {
        this.signs[i].material.opacity = 0.78 + Math.sin(time * 1.1 + i) * 0.05;
      }
    }
    if (this.overhead) {
      for (let i = 0; i < this.overhead.length; i++) {
        this.overhead[i].material.opacity = 0.35 + Math.sin(time * 2.2 + i * 2) * 0.12;
      }
    }
  }
}

stageModules.register('decor', DecorModule);
export { DecorModule };
