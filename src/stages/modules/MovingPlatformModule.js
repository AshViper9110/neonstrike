import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, addNeonBox, addGlowStrip } from '../stageKit.js';

/**
 * Moving platform. It owns a dynamic Box3 and publishes a per-step delta that
 * Player physics uses to carry riders. Any entity using player physics can ride.
 */
class MovingPlatformModule extends StageModule {
  build(ctx) {
    const cfg = this.config;
    const [w, h, d] = cfg.size ?? [3.4, 0.35, 3.4];
    const from = new THREE.Vector3(...(cfg.from ?? [0, 0.4, 0]));
    const to = new THREE.Vector3(...(cfg.to ?? [0, 4, 0]));
    this.from = from;
    this.to = to;
    this.speed = cfg.speed ?? 0.32;
    this.phase = cfg.phase ?? 0;
    this.color = cfg.color ?? NEON_COLORS.cyan;
    this.group = new THREE.Group();
    this.group.name = `moving-platform-${this.id}`;
    ctx.scene.add(this.group);
    this.platformGroup = new THREE.Group();
    this.group.add(this.platformGroup);

    addNeonBox(ctx, {
      pos: [0, 0, 0],
      size: [w, h, d],
      color: this.color,
      baseColor: 0x0a1420,
      solid: false,
      group: this.platformGroup,
      minimap: false,
      glowCap: true,
      metalness: 0.72,
      roughness: 0.38,
    });
    const underGlow = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.8, 0.05, d * 0.8),
      ctx.materials.basic(`mp-under-${this.color}`, {
        color: this.color,
        transparent: true,
        opacity: 0.8,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    underGlow.position.y = -h / 2 - 0.03;
    this.platformGroup.add(underGlow);

    // Edge warning strips.
    for (const x of [-w / 2 + 0.12, w / 2 - 0.12]) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, d - 0.15),
        ctx.materials.basic(`mp-strip-${this.color}`, { color: this.color, toneMapped: false }),
      );
      strip.position.set(x, h / 2 + 0.01, 0);
      this.platformGroup.add(strip);
    }

    // Static guide rails.
    const low = Math.min(from.y, to.y);
    const high = Math.max(from.y, to.y);
    for (const [sx, sz] of [[-w / 2 + 0.25, -d / 2 + 0.25], [w / 2 - 0.25, d / 2 - 0.25]]) {
      addGlowStrip(
        ctx,
        [from.x + sx, low - 0.3, from.z + sz],
        [from.x + sx, high + 0.9, from.z + sz],
        this.color,
        0.035,
        this.group,
        0.26,
      );
    }

    const firstPos = this._sample(0);
    this.platformGroup.position.copy(firstPos);
    this.solid = ctx.physics.addSolid(
      new THREE.Box3(
        new THREE.Vector3(firstPos.x - w / 2, firstPos.y - h / 2, firstPos.z - d / 2),
        new THREE.Vector3(firstPos.x + w / 2, firstPos.y + h / 2, firstPos.z + d / 2),
      ),
      { blocks: ['player', 'bullet', 'projectile'] },
    );
    this.lastPos = firstPos.clone();
    this.half = new THREE.Vector3(w / 2, h / 2, d / 2);
    ctx.stage.addMapMarker({ x: from.x, z: from.z, color: this.color, type: 'platform' });
  }

  _sample(time) {
    // Ping-pong with a soft ease at the endpoints.
    const raw = (time * this.speed + this.phase) % 1;
    const tri = raw < 0.5 ? raw * 2 : (1 - raw) * 2;
    const eased = tri * tri * (3 - 2 * tri);
    return new THREE.Vector3().lerpVectors(this.from, this.to, eased);
  }

  update(dt, time) {
    const pos = this._sample(time);
    this.platformGroup.position.copy(pos);
    this.platformGroup.rotation.y = Math.sin(time * this.speed * Math.PI * 2 + this.phase * Math.PI * 2) * 0.035;
    const delta = new THREE.Vector3().subVectors(pos, this.lastPos);
    this.solid.delta.copy(delta);
    this.solid.box.min.set(pos.x - this.half.x, pos.y - this.half.y, pos.z - this.half.z);
    this.solid.box.max.set(pos.x + this.half.x, pos.y + this.half.y, pos.z + this.half.z);
    this.lastPos.copy(pos);
  }
}

stageModules.register('movingPlatform', MovingPlatformModule);
export { MovingPlatformModule };
