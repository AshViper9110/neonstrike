import * as THREE from 'three';
import { clamp, damp } from '../core/utils.js';

export class ViewModel {
  constructor({ renderer, weaponRegistry, settings }) {
    this.renderer = renderer;
    this.registry = weaponRegistry;
    this.settings = settings;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(settings?.get('fov') ?? 82, 1, 0.01, 12);
    this.roots = new Map();
    this.activeId = null;
    this.switchTarget = null;
    this.switchTimer = 0;
    this.switchPhase = 'idle';
    this.recoil = 0;
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.aim = 0;
    this.bobT = 0;
    this.swayX = 0;
    this.swayY = 0;
    this.time = 0;
    this.muzzleTimer = 0;
    this.reloadTilt = 0;
    this.geometries = new Set();
    this.extraMaterials = new Set();
    this._build();
  }

  _build() {
    this.ambient = new THREE.AmbientLight(0xb8deff, 1.2);
    this.scene.add(this.ambient);
    this.key = new THREE.DirectionalLight(0x9feaff, 2.6);
    this.key.position.set(1.2, 2.4, 1.6);
    this.scene.add(this.key);
    this.rim = new THREE.DirectionalLight(0xff41d8, 2.0);
    this.rim.position.set(-1.6, 0.4, -0.8);
    this.scene.add(this.rim);
    this.fill = new THREE.PointLight(0x58a8ff, 6, 4, 2);
    this.fill.position.set(-0.5, -0.7, 0.4);
    this.scene.add(this.fill);

    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);

    for (const def of this.registry.list()) {
      const model = def.buildModel();
      model.visible = false;
      this.modelRoot.add(model);
      const muzzleFlash = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 6, 4),
        new THREE.MeshBasicMaterial({
          color: 0xeaffff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      muzzleFlash.visible = false;
      if (model.userData.muzzle) {
        muzzleFlash.position.copy(model.userData.muzzle.position);
        model.userData.muzzle.add(muzzleFlash);
      } else {
        model.add(muzzleFlash);
      }
      this.extraMaterials.add(muzzleFlash.material);
      this.geometries.add(muzzleFlash.geometry);
      this.roots.set(def.id, { def, model, muzzleFlash });
      model.traverse((child) => {
        if (child.geometry) this.geometries.add(child.geometry);
      });
    }
    this.muzzleLight = new THREE.PointLight(0x9ffcff, 0, 3, 2);
    this.scene.add(this.muzzleLight);
  }

  setWeapon(id) {
    if (!this.roots.has(id) || this.activeId === id) return;
    if (!this.activeId) {
      this._show(id);
      return;
    }
    this.switchTarget = id;
    this.switchTimer = 0;
    this.switchPhase = 'lower';
  }

  _show(id) {
    if (this.activeId) {
      const old = this.roots.get(this.activeId);
      if (old) old.model.visible = false;
    }
    this.activeId = id;
    const entry = this.roots.get(id);
    if (entry) {
      entry.model.visible = true;
      entry.model.position.copy(entry.def.buildPosition ?? entry.model.userData.basePosition ?? entry.model.position);
      entry.muzzleFlash.visible = false;
    }
    this.switchPhase = 'idle';
    this.switchTarget = null;
  }

  fire(def) {
    this.recoil = Math.min(1.4, this.recoil + (def.recoil?.kick ?? 0.03) * 18);
    this.recoilPitch = Math.min(0.35, this.recoilPitch + (def.recoil?.pitch ?? 0.01) * 10);
    this.recoilYaw += (Math.random() - 0.5) * (def.recoil?.yaw ?? 0.003) * 14;
    this.muzzleTimer = 0.05;
    const entry = this.roots.get(this.activeId);
    if (entry) {
      entry.muzzleFlash.visible = true;
      entry.muzzleFlash.scale.setScalar(0.7 + Math.random() * 0.8);
      entry.muzzleFlash.rotation.z = Math.random() * Math.PI;
      if (entry.model.userData.muzzle) {
        const world = entry.model.userData.muzzle.getWorldPosition(new THREE.Vector3());
        this.muzzleLight.position.copy(world);
        this.muzzleLight.color.set(entry.model.userData.muzzleColor ?? 0x9ffcff);
        this.muzzleLight.intensity = 2.4;
      }
    }
  }

  setAiming(aiming) {
    this.aimTarget = aiming ? 1 : 0;
  }

  setMove(speed, grounded) {
    this.moveSpeed = speed;
    this.grounded = grounded;
  }

  addSway(dx, dy) {
    this.swayX = clamp(this.swayX - dx * 0.00032, -0.045, 0.045);
    this.swayY = clamp(this.swayY + dy * 0.00032, -0.035, 0.035);
  }

  update(dt, time, { reloading = false, reloadProgress = 0 } = {}) {
    this.time = time;
    this.aim = damp(this.aim, this.aimTarget ?? 0, 12, dt);
    this.swayX = damp(this.swayX, 0, 9, dt);
    this.swayY = damp(this.swayY, 0, 9, dt);
    this.recoil = damp(this.recoil, 0, 13, dt);
    this.recoilPitch = damp(this.recoilPitch, 0, 14, dt);
    this.recoilYaw = damp(this.recoilYaw, 0, 12, dt);
    this.reloadTilt = damp(this.reloadTilt, reloading ? 1 : 0, 10, dt);

    if (this.switchPhase === 'lower') {
      this.switchTimer += dt;
      if (this.switchTimer >= 0.12 && this.switchTarget) {
        this._show(this.switchTarget);
        this.switchPhase = 'raise';
        this.switchTimer = 0;
      }
    } else if (this.switchPhase === 'raise') {
      this.switchTimer += dt;
      if (this.switchTimer >= 0.18) {
        this.switchPhase = 'idle';
        this.switchTimer = 0;
      }
    }

    const entry = this.roots.get(this.activeId);
    if (!entry) return;
    const { model } = entry;
    const base = model.userData.basePosition;
    if (base) {
      this.bobT += dt * (2.5 + Math.min(this.moveSpeed ?? 0, 12) * 1.1);
      const moveNorm = clamp((this.moveSpeed ?? 0) / 8, 0, 1.3);
      const bobX = Math.sin(this.bobT) * 0.005 * moveNorm;
      const bobY = Math.abs(Math.cos(this.bobT)) * 0.0055 * moveNorm * (this.grounded ? 1 : 0.3);
      const switchDrop = this.switchPhase === 'lower'
        ? (this.switchTimer / 0.12) * 0.3
        : this.switchPhase === 'raise'
          ? (1 - this.switchTimer / 0.18) * 0.3
          : 0;
      const aimX = 0.285 - 0.115 * this.aim;
      const aimY = -0.26 + 0.035 * this.aim;
      const aimZ = base.z + 0.06 * this.aim;
      model.position.x = damp(model.position.x, aimX + bobX + this.swayX, 15, dt);
      model.position.y = damp(model.position.y, aimY + bobY - switchDrop + this.swayY, 15, dt);
      model.position.z = damp(model.position.z, aimZ + this.recoil * 0.12, 18, dt);
      model.rotation.x = damp(model.rotation.x, -this.aim * 0.015 + this.recoilPitch * 0.5 - this.reloadTilt * 0.28, 14, dt);
      model.rotation.y = damp(model.rotation.y, this.swayX * 1.4 + this.recoilYaw * 0.5 + this.reloadTilt * 0.22, 12, dt);
      model.rotation.z = damp(model.rotation.z, this.reloadTilt * 0.34 + this.swayX * 0.6, 12, dt);
    }

    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      entry.muzzleFlash.visible = this.muzzleTimer > 0;
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - dt * 40);
    } else {
      entry.muzzleFlash.visible = false;
      this.muzzleLight.intensity = 0;
    }
  }

  resize(width, height, fov) {
    this.camera.aspect = width / Math.max(1, height);
    if (fov) this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  setFov(fov) {
    if (Math.abs(this.camera.fov - fov) < 0.01) return;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  render() {
    const autoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = autoClear;
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.extraMaterials) mat.dispose();
    this.geometries.clear();
    this.extraMaterials.clear();
    this.roots.clear();
  }
}
