import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS } from '../stageKit.js';

class LaserFenceModule extends StageModule {
  build(ctx, stage) {
    const cfg = this.config;
    const [x, y, z] = cfg.pos;
    const length = cfg.length ?? 9;
    const height = cfg.height ?? 3.6;
    const axis = cfg.axis ?? 'x';
    const offTime = cfg.offTime ?? 1.6;
    const warnTime = cfg.warnTime ?? 0.55;
    const onTime = cfg.onTime ?? 2.1;
    this.cycle = warnTime + onTime + offTime;
    this.warnTime = warnTime;
    this.onTime = onTime;
    this.phase = cfg.phase ?? 0;
    this.state = 'off';
    this.group = new THREE.Group();
    this.group.position.set(x, y, z);
    ctx.scene.add(this.group);

    const postMat = ctx.materials.standard('laser-post', { color: 0x0c0a12, metalness: 0.85, roughness: 0.3, flatShading: true });
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, height + 0.4, 6), postMat);
      if (axis === 'x') post.position.set(side * length / 2, 0, 0);
      else post.position.set(0, 0, side * length / 2);
      this.group.add(post);
    }

    this.beamMat = ctx.materials.basic(`laser-beam-${this.id}`, {
      color: NEON_COLORS.red,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.beams = [];
    const beamCount = 7;
    for (let i = 0; i < beamCount; i++) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(axis === 'x' ? length : 0.035, 0.035, axis === 'x' ? 0.035 : length),
        this.beamMat,
      );
      beam.position.y = -height / 2 + (i / (beamCount - 1)) * height;
      this.group.add(beam);
      this.beams.push(beam);
    }

    const planeMat = ctx.materials.basic(`laser-plane-${this.id}`, {
      color: NEON_COLORS.red,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(length, height),
      planeMat,
    );
    if (axis === 'z') plane.rotation.y = Math.PI / 2;
    this.group.add(plane);
    this.planeMat = planeMat;

    const emitterMat = ctx.materials.basic(`laser-emitter-${this.id}`, { color: NEON_COLORS.amber, toneMapped: false });
    for (const side of [-1, 1]) {
      const emitter = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), emitterMat);
      if (axis === 'x') emitter.position.set(side * length / 2, height / 2 + 0.22, 0);
      else emitter.position.set(0, height / 2 + 0.22, side * length / 2);
      this.group.add(emitter);
    }
    this.emitterMat = emitterMat;

    const size = axis === 'x' ? [length, height, 0.24] : [0.24, height, length];
    this.trigger = stage.registerTrigger(
      new THREE.Box3(
        new THREE.Vector3(x - size[0] / 2, y - height / 2, z - size[2] / 2),
        new THREE.Vector3(x + size[0] / 2, y + height / 2, z + size[2] / 2),
      ),
      {
        kind: 'laser',
        enabled: false,
        data: { damage: cfg.damage ?? 15, x, z, color: NEON_COLORS.red },
      },
    );

    stage.registerTriggerHandler('laser', (player, trigger, api) => {
      const now = api.time;
      const key = `laser:${trigger.id}`;
      const cooldown = player.gimmickCooldowns?.get(key) ?? 0;
      if (now < cooldown) return;
      player.gimmickCooldowns?.set(key, now + 0.62);
      api.session.damageSimulatedPlayer(player, trigger.data.damage, 'laser');
    });

    stage.addMapMarker({ x, z, color: NEON_COLORS.red, type: 'laser' });
  }

  update(dt, time) {
    const local = ((time + this.phase) % this.cycle + this.cycle) % this.cycle;
    let state;
    if (local < this.warnTime) state = 'warn';
    else if (local < this.warnTime + this.onTime) state = 'on';
    else state = 'off';
    if (state !== this.state) {
      this.state = state;
      this.trigger.enabled = state === 'on';
    }
    this.trigger.enabled = state === 'on';
    if (state === 'on') {
      const flicker = 0.78 + Math.sin(time * 30) * 0.12;
      this.beamMat.opacity = flicker;
      this.beamMat.color.setHex(NEON_COLORS.red);
      this.planeMat.opacity = 0.1 + Math.sin(time * 8) * 0.025;
      this.emitterMat.color.setHex(NEON_COLORS.red);
    } else if (state === 'warn') {
      const blink = Math.sin(time * 22) > 0 ? 0.5 : 0.16;
      this.beamMat.opacity = blink;
      this.beamMat.color.setHex(NEON_COLORS.amber);
      this.planeMat.opacity = blink * 0.12;
      this.emitterMat.color.setHex(NEON_COLORS.amber);
    } else {
      this.beamMat.opacity = 0.045;
      this.planeMat.opacity = 0.012;
      this.emitterMat.color.setHex(0x453424);
    }
  }
}

stageModules.register('laserFence', LaserFenceModule);
export { LaserFenceModule };
