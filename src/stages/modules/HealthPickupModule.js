import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, addRing, makeLabelSprite } from '../stageKit.js';

class HealthPickupModule extends StageModule {
  build(ctx, stage) {
    this.group = new THREE.Group();
    ctx.scene.add(this.group);
    const cfg = this.config;
    this.records = [];
    for (const [index, item] of (cfg.items || []).entries()) {
      const color = item.color ?? NEON_COLORS.lime;
      const g = new THREE.Group();
      g.position.set(item.x, item.y ?? 0.9, item.z);
      this.group.add(g);
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.3, 0),
        ctx.materials.standard(`hp-core-${index}`, {
          color: 0x142a16,
          emissive: color,
          emissiveIntensity: 2.2,
          metalness: 0.4,
          roughness: 0.3,
          flatShading: true,
        }),
      );
      g.add(core);
      const shell = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.52, 0)),
        ctx.materials.line(`hp-shell-${index}`, {
          color,
          transparent: true,
          opacity: 0.5,
          toneMapped: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      g.add(shell);
      const ringA = addRing(ctx, { pos: [0, 0, 0], radius: 0.62, tube: 0.012, color, opacity: 0.55, group: g });
      ringA.rotation.x = Math.PI / 3;
      ringA.rotation.y = index;
      const ringB = addRing(ctx, { pos: [0, 0, 0], radius: 0.46, tube: 0.009, color, opacity: 0.35, group: g });
      ringB.rotation.x = -Math.PI / 2.5;
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.36, 1.5, 12, 1, true),
        ctx.materials.basic(`hp-beam-${index}`, {
          color,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        }),
      );
      beam.position.y = 0.55;
      g.add(beam);
      const crossMat = ctx.materials.basic(`hp-cross-${index}`, { color: 0xeaffd2, toneMapped: false });
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.03), crossMat);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.03), crossMat);
      crossV.position.z = -0.32;
      crossH.position.z = -0.32;
      g.add(crossV, crossH);

      const label = makeLabelSprite(ctx, `+${item.amount ?? 35}`, 'INTEGRITY', `#a6ff4d`, { width: 256, height: 96 });
      label.position.set(0, 0.95, 0);
      label.scale.set(1.7, 0.64, 1);
      g.add(label);

      const record = {
        id: `hp-${index}`,
        pos: new THREE.Vector3(item.x, item.y ?? 0.9, item.z),
        baseY: item.y ?? 0.9,
        amount: item.amount ?? 35,
        respawn: item.respawn ?? 16,
        radius: item.radius ?? 1.45,
        height: item.height ?? 1.6,
        group: g,
        core,
        shell,
        ringA,
        ringB,
        beam,
        available: true,
        respawnAt: 0,
        phase: index * 0.9,
      };
      this.records.push(record);
      stage.pickups.push(record);
      stage.addMapMarker({ x: item.x, z: item.z, color, type: 'health' });
    }
  }

  update(dt, time, ctx, stage) {
    for (const rec of this.records) {
      rec.group.rotation.y = time * 0.7 + rec.phase;
      rec.group.position.y = rec.baseY + Math.sin(time * 1.7 + rec.phase) * 0.12;
      const pulse = 1 + Math.sin(time * 2.4 + rec.phase) * 0.06;
      rec.core.scale.setScalar(pulse);
      rec.ringA.rotation.z = time * 0.8 + rec.phase;
      rec.ringB.rotation.z = -time * 0.55 + rec.phase;
      if (!rec.available && !rec.remoteControlled && time >= rec.respawnAt) {
        rec.available = true;
        rec.group.visible = true;
        rec.group.scale.setScalar(0.1);
      }
      if (rec.available && rec.group.scale.x < 1) {
        const s = Math.min(1, rec.group.scale.x + dt * 3.5);
        rec.group.scale.setScalar(s);
      }
    }
  }
}

stageModules.register('healthPickup', HealthPickupModule);
export { HealthPickupModule };
