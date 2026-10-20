import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, addRing, makeLabelSprite } from '../stageKit.js';

class TeleporterModule extends StageModule {
  build(ctx, stage) {
    const cfg = this.config;
    this.group = new THREE.Group();
    ctx.scene.add(this.group);
    this.rings = [];
    const pads = cfg.pads || [];
    const padRecords = pads.map((pad, index) => {
      const color = pad.color ?? (index % 2 ? NEON_COLORS.magenta : NEON_COLORS.violet);
      const group = new THREE.Group();
      group.position.set(pad.x, pad.y ?? 0, pad.z);
      this.group.add(group);
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.5, 0.16, 8),
        ctx.materials.standard('tp-base', { color: 0x060a14, metalness: 0.75, roughness: 0.32, flatShading: true }),
      );
      base.position.y = 0.08;
      group.add(base);
      const inner = new THREE.Mesh(
        new THREE.CircleGeometry(1.14, 8),
        ctx.materials.basic(`tp-disc-${color}`, {
          color,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        }),
      );
      inner.rotation.x = -Math.PI / 2;
      inner.position.y = 0.17;
      group.add(inner);
      const rings = [];
      for (let i = 0; i < 2; i++) {
        const ring = addRing(ctx, {
          pos: [0, 0.18 + i * 0.06, 0],
          radius: 1.2 - i * 0.28,
          tube: 0.022,
          color,
          opacity: 0.75 - i * 0.2,
          group,
        });
        rings.push(ring);
        this.rings.push({ mesh: ring, phase: Math.random() * 5, speed: i % 2 ? -1.1 : 0.8 });
      }
      const column = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.28, 3.2, 16, 1, true),
        ctx.materials.basic(`tp-column-${color}`, {
          color,
          transparent: true,
          opacity: 0.05,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        }),
      );
      column.position.y = 1.7;
      group.add(column);
      const label = makeLabelSprite(ctx, pad.label ?? cfg.channel ?? 'LINK', pad.sub ?? 'TELEPORT', `#${new THREE.Color(color).getHexString()}`, { width: 320, height: 96 });
      label.position.set(0, 3.0, 0);
      label.scale.set(2.2, 0.66, 1);
      group.add(label);
      return { pad, color, group, rings, column };
    });

    for (let i = 0; i < padRecords.length; i++) {
      const record = padRecords[i];
      const pad = record.pad;
      // Link pads that share a channel (A-1 <-> A-2, B-1 <-> B-2).
      const targetRecord = (pad.channel
        ? padRecords.find(
          (candidate, index) => index !== i && candidate.pad.channel === pad.channel,
        )
        : null) ?? padRecords[(i + 1) % padRecords.length];
      if (!targetRecord || targetRecord === record) continue;
      const target = targetRecord.pad;
      const box = new THREE.Box3(
        new THREE.Vector3(pad.x - 1.2, (pad.y ?? 0) + 0.02, pad.z - 1.2),
        new THREE.Vector3(pad.x + 1.2, (pad.y ?? 0) + 2.4, pad.z + 1.2),
      );
      const trigger = stage.registerTrigger(box, {
        kind: 'teleporter',
        data: {
          color: record.color,
          target: new THREE.Vector3(target.x, (target.y ?? 0) + 0.06, target.z),
          x: pad.x,
          z: pad.z,
          channel: pad.channel,
          label: pad.label,
          targetLabel: target.label,
        },
      });
      record.trigger = trigger;
      stage.addMapMarker({ x: pad.x, z: pad.z, color: record.color, type: 'teleport' });
    }

    stage.registerTriggerHandler('teleporter', (player, trigger, api) => {
      const now = api.time;
      const last = player.gimmickCooldowns?.get('teleport') ?? 0;
      if (now < last) return;
      const from = player.pos.clone();
      player.pos.copy(trigger.data.target);
      player.pos.y += 0.04;
      player.vel.set(0, 2.2, 0);
      player.grounded = false;
      player.groundSolid = null;
      player.gimmickCooldowns?.set('teleport', now + 1.1);
      api.session.onTeleport(player, from, trigger.data.target, trigger.data.color);
    });
  }

  update(dt, time) {
    for (const item of this.rings) {
      item.mesh.rotation.z = time * item.speed + item.phase;
      const s = 1 + Math.sin(time * 2 + item.phase) * 0.06;
      item.mesh.scale.set(s, s, 1);
    }
  }
}

stageModules.register('teleporter', TeleporterModule);
export { TeleporterModule };
