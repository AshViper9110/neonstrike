import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, addRing, addGlowStrip } from '../stageKit.js';

class JumpPadModule extends StageModule {
  build(ctx, stage) {
    const cfg = this.config;
    const pos = cfg.pos;
    const color = cfg.color ?? NEON_COLORS.cyan;
    const power = cfg.power ?? 16.8;
    this.group = new THREE.Group();
    this.group.position.set(pos[0], pos[1] ?? 0, pos[2]);
    ctx.scene.add(this.group);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.75, 0.18, 24, 1),
      ctx.materials.standard('pad-base', { color: 0x07111a, metalness: 0.7, roughness: 0.4, flatShading: true }),
    );
    base.position.y = 0.09;
    this.group.add(base);

    const discMat = ctx.materials.basic(`pad-disc-${color}`, {
      color,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.19;
    this.group.add(disc);
    this.discMat = discMat;

    this.rings = [];
    for (const [radius, opacity] of [[1.42, 0.8], [1.1, 0.55], [0.72, 0.4]]) {
      this.rings.push(addRing(ctx, {
        pos: [0, 0.2, 0],
        radius,
        tube: 0.026,
        color,
        opacity,
        group: this.group,
      }));
    }
    // Upward chevrons.
    this.chevrons = [];
    for (let i = 0; i < 3; i++) {
      const chevron = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 0.3, 4, 1, true),
        ctx.materials.basic(`pad-chev-${color}-${i}`, {
          color,
          transparent: true,
          opacity: 0.35 - i * 0.07,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        }),
      );
      chevron.rotation.x = Math.PI;
      chevron.rotation.y = Math.PI / 4;
      chevron.position.y = 0.5 + i * 0.25;
      this.group.add(chevron);
      this.chevrons.push(chevron);
    }
    const beamMat = ctx.materials.basic(`pad-beam-${color}`, {
      color,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 3.8, 24, 1, true), beamMat);
    beam.position.y = 2.0;
    this.group.add(beam);
    this.beamMat = beamMat;

    const triggerBox = new THREE.Box3(
      new THREE.Vector3(pos[0] - 1.5, (pos[1] ?? 0) + 0.02, pos[2] - 1.5),
      new THREE.Vector3(pos[0] + 1.5, (pos[1] ?? 0) + 2.5, pos[2] + 1.5),
    );
    this.trigger = stage.registerTrigger(triggerBox, {
      kind: 'jumpPad',
      data: { power, color, x: pos[0], z: pos[2], y: pos[1] ?? 0 },
    });

    stage.registerTriggerHandler('jumpPad', (player, trigger, api) => {
      const now = api.time;
      const cooldown = player.gimmickCooldowns?.get(`pad:${trigger.id}`) ?? 0;
      if (now < cooldown) return;
      player.vel.y = Math.max(player.vel.y, trigger.data.power);
      player.grounded = false;
      player.groundSolid = null;
      player.gimmickCooldowns?.set(`pad:${trigger.id}`, now + 0.8);
      api.session.onJumpPad(player, trigger);
    });

    stage.addMapMarker({ x: pos[0], z: pos[2], color, type: 'jump' });
  }

  update(dt, time) {
    const t = time * 1.8;
    for (let i = 0; i < this.rings.length; i++) {
      const s = 1 + Math.sin(t + i * 0.8) * 0.08;
      this.rings[i].scale.setScalar(s);
      this.rings[i].rotation.z = t * (i % 2 ? -0.7 : 0.5);
    }
    for (let i = 0; i < this.chevrons.length; i++) {
      const y = 0.45 + ((t * 0.4 + i * 0.33) % 1) * 1.5;
      this.chevrons[i].position.y = y;
      this.chevrons[i].material.opacity = 0.05 + Math.sin(Math.PI * ((y - 0.45) / 1.5)) * 0.35;
    }
    this.beamMat.opacity = 0.045 + Math.sin(t * 1.3) * 0.015;
    this.discMat.opacity = 0.26 + Math.sin(t * 2.1) * 0.08;
  }
}

stageModules.register('jumpPad', JumpPadModule);
export { JumpPadModule };
