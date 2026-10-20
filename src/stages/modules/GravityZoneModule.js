import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';
import { NEON_COLORS, makeLabelSprite } from '../stageKit.js';

class GravityZoneModule extends StageModule {
  build(ctx, stage) {
    const cfg = this.config;
    const [x, y, z] = cfg.pos;
    const [w, h, d] = cfg.size ?? [8, 9, 8];
    const color = cfg.color ?? NEON_COLORS.cyan;
    this.group = new THREE.Group();
    this.group.position.set(x, y, z);
    ctx.scene.add(this.group);

    const volumeMat = ctx.materials.basic(`grav-volume-${this.id}`, {
      color,
      transparent: true,
      opacity: 0.035,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const volume = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), volumeMat);
    this.group.add(volume);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
      ctx.materials.line(`grav-edge-${this.id}`, {
        color,
        transparent: true,
        opacity: 0.3,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.group.add(edges);

    // Rising particles.
    const count = 110;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * (w - 0.7);
      positions[i * 3 + 1] = (Math.random() - 0.5) * h;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (d - 0.7);
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size: 0.11,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      fog: false,
    });
    this.particles = new THREE.Points(geo, mat);
    this.group.add(this.particles);
    this.particlePositions = positions;
    this.particleSpeeds = speeds;
    this.zoneSize = [w, h, d];

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(w * 0.38, 0.02, 6, 48),
      ctx.materials.basic(`grav-ring-${this.id}`, {
        color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -h / 2 + 0.05;
    this.group.add(ring);
    this.ring = ring;

    const label = makeLabelSprite(ctx, 'LOW-G', 'UPDRAFT FIELD', `#${new THREE.Color(color).getHexString()}`, { width: 384, height: 112 });
    label.position.set(0, h / 2 + 0.8, 0);
    label.scale.set(2.8, 0.82, 1);
    this.group.add(label);

    this.trigger = stage.registerTrigger(
      new THREE.Box3(
        new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
        new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
      ),
      {
        kind: 'gravity',
        data: { gravityScale: cfg.gravityScale ?? 0.3, updraft: cfg.updraft ?? 5.8 },
      },
    );

    stage.registerTriggerHandler('gravity', (player, trigger) => {
      player.gravityScale = Math.min(player.gravityScale ?? 1, trigger.data.gravityScale);
      player.updraft = Math.max(player.updraft ?? 0, trigger.data.updraft);
      player.jumpScale = Math.min(player.jumpScale ?? 1, 0.82);
    });

    stage.addMapMarker({ x, z, color, type: 'gravity' });
  }

  update(dt, time) {
    const arr = this.particlePositions;
    const [w, h, d] = this.zoneSize;
    for (let i = 0; i < this.particleSpeeds.length; i++) {
      arr[i * 3 + 1] += this.particleSpeeds[i] * dt;
      arr[i * 3] += Math.sin(time * 0.7 + i) * dt * 0.08;
      if (arr[i * 3 + 1] > h / 2) {
        arr[i * 3 + 1] = -h / 2;
        arr[i * 3] = (Math.random() - 0.5) * (w - 0.7);
        arr[i * 3 + 2] = (Math.random() - 0.5) * (d - 0.7);
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.ring.rotation.z = time * 0.22;
    this.ring.scale.setScalar(1 + Math.sin(time * 1.3) * 0.035);
  }
}

stageModules.register('gravityZone', GravityZoneModule);
export { GravityZoneModule };
