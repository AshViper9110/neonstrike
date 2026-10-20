import * as THREE from 'three';
import { clamp } from '../core/utils.js';

function makeSoftTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const g = canvas.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.2)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class EffectsSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'effects';
    scene.add(this.group);
    this.transients = [];
    this.softTexture = makeSoftTexture();
    this.shake = 0;
    this.flashLight = new THREE.PointLight(0xffffff, 0, 24, 2);
    this.flashLight.position.set(0, 6, 0);
    this.group.add(this.flashLight);
    this._lightTarget = 0;
    this._decals = [];
  }

  _addTransient(object, life, update) {
    this.group.add(object);
    this.transients.push({ object, life, maxLife: life, update });
    if (this.transients.length > 220) {
      const oldest = this.transients.shift();
      this._disposeObject(oldest.object);
    }
  }

  _disposeObject(object) {
    object.removeFromParent();
    object.traverse?.((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    });
  }

  addShake(amount) {
    this.shake = Math.min(0.45, this.shake + amount);
  }

  getShakeOffset(out = new THREE.Vector3()) {
    const s = this.shake;
    out.set((Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s);
    return out;
  }

  flashLightAt(pos, color, intensity = 40, life = 0.09) {
    this.flashLight.position.copy(pos);
    this.flashLight.color.set(color);
    this.flashLight.intensity = Math.max(this.flashLight.intensity, intensity);
    this._lightTarget = Math.max(this._lightTarget, life);
  }

  tracer(from, to, color = 0x7ffcff, { duration = 0.1, width = 1 } = {}) {
    const geometry = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      linewidth: width,
    });
    const line = new THREE.Line(geometry, material);
    this._addTransient(line, duration, (t, dt, obj) => {
      obj.material.opacity = 0.95 * (t / duration);
    });
  }

  railBeam(from, to, color = 0xcbb6ff) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    if (length < 0.1) return;
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.035, 0.015, length, 6, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.copy(from).addScaledVector(dir, 0.5);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    group.add(beam);
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.04, length, 6, 1, true),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    outer.position.copy(beam.position);
    outer.quaternion.copy(beam.quaternion);
    group.add(outer);
    this._addTransient(group, 0.28, (t, dt, obj) => {
      const a = Math.max(0, t / 0.28);
      obj.children[0].material.opacity = 0.85 * a;
      obj.children[1].material.opacity = 0.16 * a;
    });
    this.flashLightAt(to, color, 35, 0.1);
  }

  muzzleFlash(pos, color = 0x9ffcff, scale = 1, isLocal = false) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.softTexture,
      color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }));
    sprite.position.copy(pos);
    sprite.scale.setScalar(0.34 * scale);
    this._addTransient(sprite, 0.055, (t, dt, obj) => {
      obj.scale.setScalar(0.34 * scale * (1 + (1 - t / 0.055) * 0.8));
      obj.material.opacity = Math.min(1, t / 0.02) * 0.9;
    });
    this.flashLightAt(pos, color, isLocal ? 18 : 10, 0.06);
  }

  impact(point, normal, color = 0x9ffcff, { heavy = false } = {}) {
    const count = heavy ? 16 : 7;
    this._particles(point, color, {
      count,
      speed: heavy ? 4.5 : 2.2,
      gravity: 7,
      size: heavy ? 0.12 : 0.07,
      life: heavy ? 0.5 : 0.32,
      normal,
      spread: 0.9,
    });
    this.decal(point, normal, color, heavy ? 0.35 : 0.2);
    this.flashLightAt(point, color, heavy ? 16 : 6, 0.05);
  }

  bloodSpark(point, normal, color) {
    this._particles(point, color, {
      count: 10,
      speed: 2.8,
      gravity: 9,
      size: 0.075,
      life: 0.4,
      normal,
      spread: 1.1,
    });
    this.flashLightAt(point, color, 8, 0.05);
  }

  explosion(pos, color = 0xffa040, radius = 4) {
    const scale = clamp(radius / 4, 0.7, 2);
    const group = new THREE.Group();
    group.position.copy(pos);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 12, 8),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    group.add(core);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xff5a1f, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide, toneMapped: false }),
    );
    group.add(glow);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.06, 6, 36),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -pos.y + 0.12;
    group.add(ring);
    this._addTransient(group, 0.65, (t, dt, obj) => {
      const p = 1 - t / 0.65;
      core.scale.setScalar((0.8 + p * 3.2) * scale);
      core.material.opacity = Math.max(0, 1 - p * 1.9);
      glow.scale.setScalar((1 + p * 2.0) * scale);
      glow.material.opacity = Math.max(0, 0.24 * (1 - p));
      ring.scale.setScalar(0.4 + p * 4.2 * scale);
      ring.material.opacity = Math.max(0, 0.8 * (1 - p * 1.4));
    });

    this._particles(pos, color, {
      count: 30,
      speed: 7 * scale,
      gravity: 8,
      size: 0.16 * scale,
      life: 0.7,
      spread: 1,
      normal: new THREE.Vector3(0, 1, 0),
    });
    this._particles(pos, 0xffefb0, {
      count: 16,
      speed: 11 * scale,
      gravity: 4,
      size: 0.09 * scale,
      life: 0.45,
      spread: 1,
      normal: new THREE.Vector3(0, 1, 0),
    });
    this.flashLightAt(pos, color, 180 * scale, 0.25);
    this.addShake(0.16 * scale);
  }

  _particles(pos, color, { count = 10, speed = 3, gravity = 6, size = 0.08, life = 0.4, normal = null, spread = 1 } = {}) {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      let vx = Math.random() * 2 - 1;
      let vy = Math.random() * 2 - 1;
      let vz = Math.random() * 2 - 1;
      const len = Math.hypot(vx, vy, vz) || 1;
      vx /= len; vy /= len; vz /= len;
      if (normal) {
        vx = vx * (1 - spread * 0.5) + normal.x * (0.6 + Math.random());
        vy = vy * (1 - spread * 0.5) + normal.y * (0.6 + Math.random());
        vz = vz * (1 - spread * 0.5) + normal.z * (0.6 + Math.random());
      }
      const s = speed * (0.4 + Math.random() * 0.8);
      velocities.push(new THREE.Vector3(vx * s, vy * s, vz * s));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size,
      map: this.softTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    this._addTransient(points, life, (t, dt, obj) => {
      const posAttr = obj.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const v = velocities[i];
        v.y -= gravity * dt;
        posAttr.array[i * 3] += v.x * dt;
        posAttr.array[i * 3 + 1] += v.y * dt;
        posAttr.array[i * 3 + 2] += v.z * dt;
      }
      posAttr.needsUpdate = true;
      obj.material.opacity = Math.max(0, (t / life) * 0.9);
    });
  }

  decal(point, normal, color, size = 0.2) {
    const material = new THREE.SpriteMaterial({
      map: this.softTexture,
      color,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(point).addScaledVector(normal, 0.012);
    sprite.scale.setScalar(size);
    this._addTransient(sprite, 1.8, (t, dt, obj) => {
      obj.material.opacity = Math.max(0, 0.55 * (t / 1.8));
    });
  }

  teleportBurst(pos, color) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.04, 6, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    ring.position.copy(pos);
    ring.rotation.x = -Math.PI / 2;
    this._addTransient(ring, 0.45, (t, dt, obj) => {
      const p = 1 - t / 0.45;
      obj.scale.setScalar(1 + p * 2.4);
      obj.material.opacity = 0.8 * (1 - p);
    });
    this._particles(pos.clone().add(new THREE.Vector3(0, 0.8, 0)), color, {
      count: 18, speed: 3.5, gravity: -2, size: 0.11, life: 0.55, spread: 1,
    });
    this.flashLightAt(pos, color, 60, 0.16);
  }

  pickupBurst(pos, color = 0xa6ff4d) {
    this._particles(pos, color, {
      count: 18, speed: 2.4, gravity: -1.8, size: 0.1, life: 0.65, spread: 1,
    });
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.03, 6, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    ring.position.copy(pos);
    ring.rotation.x = -Math.PI / 2;
    this._addTransient(ring, 0.5, (t, dt, obj) => {
      const p = 1 - t / 0.5;
      obj.scale.setScalar(1 + p * 3.2);
      obj.material.opacity = 0.85 * (1 - p);
    });
    this.flashLightAt(pos, color, 24, 0.1);
  }

  jumpPadBurst(pos, color = 0x00f6ff) {
    this._particles(pos.clone().add(new THREE.Vector3(0, 0.3, 0)), color, {
      count: 20, speed: 6, gravity: -3, size: 0.1, life: 0.6, spread: 0.7, normal: new THREE.Vector3(0, 1, 0),
    });
    this.flashLightAt(pos, color, 30, 0.12);
  }

  spawnBurst(pos, color = 0x00f6ff) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.035, 6, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    ring.position.copy(pos);
    ring.position.y += 0.1;
    ring.rotation.x = -Math.PI / 2;
    this._addTransient(ring, 0.7, (t, dt, obj) => {
      const p = 1 - t / 0.7;
      obj.scale.setScalar(0.4 + p * 2.4);
      obj.material.opacity = 0.9 * (1 - p);
    });
    this._particles(pos.clone().add(new THREE.Vector3(0, 1, 0)), color, {
      count: 20, speed: 3, gravity: -1, size: 0.1, life: 0.7, spread: 1,
    });
  }

  update(dt) {
    for (let i = this.transients.length - 1; i >= 0; i--) {
      const item = this.transients[i];
      item.life -= dt;
      if (item.life <= 0) {
        this._disposeObject(item.object);
        this.transients.splice(i, 1);
        continue;
      }
      item.update?.(item.life, dt, item.object);
    }
    this.shake *= Math.exp(-10 * dt);
    if (this.shake < 0.0005) this.shake = 0;
    if (this.flashLight.intensity > 0) {
      this.flashLight.intensity *= Math.exp(-18 * dt);
      if (this.flashLight.intensity < 0.2) this.flashLight.intensity = 0;
    }
  }

  dispose() {
    for (const item of this.transients) this._disposeObject(item.object);
    this.transients.length = 0;
    this.softTexture.dispose();
    this.flashLight.removeFromParent();
    this.flashLight.dispose?.();
    this.group.removeFromParent();
  }
}
