import * as THREE from 'three';
import { clamp, damp } from '../core/utils.js';

function makeNameTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return { canvas, ctx: canvas.getContext('2d'), texture };
}

// All remote avatars are hostiles in free-for-all. A single hot color makes
// them readable against the cyan/magenta arena, regardless of player accent.
const HOSTILE_COLOR = 0xff3b5c;
const NAME_BASE_WIDTH = 2.9;
const NAME_BASE_HEIGHT = 0.725;

let auraTexture = null;
function makeAuraTexture() {
  if (auraTexture) return auraTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const g = canvas.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.28)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  auraTexture = new THREE.CanvasTexture(canvas);
  auraTexture.colorSpace = THREE.SRGBColorSpace;
  return auraTexture;
}

/**
 * Third-person neon avatar used for remote players and bots.
 * Includes separate invisible hit meshes so hitscan can identify head/body.
 */
export class Avatar {
  constructor({ id, name = 'PLAYER', color = '#00f6ff', isBot = false } = {}) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isBot = isBot;
    this.group = new THREE.Group();
    this.group.name = `avatar-${id}`;
    this.group.rotation.order = 'YXZ';
    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);
    this.materials = new Set();
    this.geometries = new Set();
    this.outlineMaterials = [];
    this.walkPhase = Math.random() * 6;
    this.alive = true;
    this.deathTime = 0;
    this.health = 100;
    this.lastHealth = -1;
    this.lastAlive = null;
    this.fireTimer = 0;
    this.hitFlash = 0;
    this._nameScale = 1;
    this._rimOpacity = 0.78;
    this.crouch = false;
    this.pitch = 0;
    this._build();
    this._buildMarker();

    this.nameCanvas = makeNameTexture();
    this.nameTexture = this.nameCanvas.texture;
    this.nameMaterial = new THREE.SpriteMaterial({
      map: this.nameTexture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });
    this.nameSprite = new THREE.Sprite(this.nameMaterial);
    this.nameSprite.position.set(0, 2.15, 0);
    this.nameSprite.scale.set(NAME_BASE_WIDTH, NAME_BASE_HEIGHT, 1);
    this.group.add(this.nameSprite);
    this._drawLabel();
    this.setHealth(100, 100);
  }

  _mat(color, { emissive = 0x000000, emissiveIntensity = 0, metalness = 0.6, roughness = 0.45 } = {}) {
    const m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, metalness, roughness, flatShading: true });
    this.materials.add(m);
    return m;
  }

  _basic(color) {
    const m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
    this.materials.add(m);
    return m;
  }

  _geo(geometry) {
    this.geometries.add(geometry);
    return geometry;
  }

  _mesh(geometry, material, x, y, z, parent = this.bodyGroup) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  /**
   * Inverted-hull neon rim. The back faces of a slightly inflated copy peek
   * past the silhouette, so enemies stay readable in dark areas and at range.
   */
  _outline(mesh) {
    if (!mesh) return null;
    const material = new THREE.MeshBasicMaterial({
      color: HOSTILE_COLOR,
      transparent: true,
      opacity: 0.78,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.materials.add(material);
    this.outlineMaterials.push(material);
    const hull = new THREE.Mesh(mesh.geometry, material);
    hull.scale.setScalar(1.065);
    hull.frustumCulled = false;
    mesh.add(hull);
    return hull;
  }

  _buildMarker() {
    const group = new THREE.Group();
    group.position.y = 2.78;
    this.markerGroup = group;

    const haloMat = new THREE.MeshBasicMaterial({
      color: HOSTILE_COLOR,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.materials.add(haloMat);
    this.markerHalo = new THREE.Mesh(this._geo(new THREE.OctahedronGeometry(0.3, 0)), haloMat);
    this.markerHalo.scale.set(0.9, 1.5, 0.9);
    group.add(this.markerHalo);

    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffd7de,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.materials.add(coreMat);
    this.markerCore = new THREE.Mesh(this._geo(new THREE.OctahedronGeometry(0.14, 0)), coreMat);
    this.markerCore.scale.set(0.72, 1.35, 0.72);
    group.add(this.markerCore);

    this.group.add(group);

    // Soft hostile backlight; the body occludes its center so it reads as a
    // colored rim even when the armor is in shadow.
    const auraMat = new THREE.SpriteMaterial({
      map: makeAuraTexture(),
      color: HOSTILE_COLOR,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });
    this.materials.add(auraMat);
    this.aura = new THREE.Sprite(auraMat);
    this.aura.position.y = 1.05;
    this.aura.scale.set(1.7, 2.2, 1);
    this.group.add(this.aura);
  }

  _build() {
    const accent = new THREE.Color(this.color);
    const accentHex = accent.getHex();
    const dark = this._mat(0x1d2838, { emissive: 0x0a1220, emissiveIntensity: 0.65, metalness: 0.62, roughness: 0.44 });
    const mid = this._mat(0x34465f, { emissive: 0x0c1624, emissiveIntensity: 0.5, metalness: 0.68, roughness: 0.38 });
    const accentMat = this._mat(0x0d1b25, { emissive: accentHex, emissiveIntensity: 1.7, metalness: 0.5, roughness: 0.35 });
    const visorMat = this._basic(accentHex);

    // Legs (pivot at hips).
    this.legL = new THREE.Group();
    this.legL.position.set(-0.14, 0.86, 0);
    this.bodyGroup.add(this.legL);
    this.legR = new THREE.Group();
    this.legR.position.set(0.14, 0.86, 0);
    this.bodyGroup.add(this.legR);
    for (const [leg, sign] of [[this.legL, -1], [this.legR, 1]]) {
      const legMesh = this._mesh(this._geo(new THREE.BoxGeometry(0.17, 0.72, 0.2)), dark, 0, -0.36, 0, leg);
      this._outline(legMesh);
      this._mesh(this._geo(new THREE.BoxGeometry(0.19, 0.14, 0.28)), mid, 0, -0.72, -0.03, leg);
      const strip = this._mesh(this._geo(new THREE.BoxGeometry(0.02, 0.4, 0.02)), visorMat, sign * 0.095, -0.32, -0.1, leg);
      strip.scale.y = 0.7;
      const thighStrip = this._mesh(this._geo(new THREE.BoxGeometry(0.18, 0.025, 0.21)), accentMat, 0, -0.16, 0, leg);
      thighStrip.scale.set(0.9, 1, 0.9);
    }

    // Hips and torso.
    const hipsMesh = this._mesh(this._geo(new THREE.BoxGeometry(0.42, 0.16, 0.28)), mid, 0, 0.88, 0);
    this._outline(hipsMesh);
    this.torso = new THREE.Group();
    this.torso.position.y = 1.16;
    this.bodyGroup.add(this.torso);
    const torsoMesh = this._mesh(this._geo(new THREE.BoxGeometry(0.48, 0.52, 0.3)), dark, 0, 0, 0, this.torso);
    this._outline(torsoMesh);
    this._mesh(this._geo(new THREE.BoxGeometry(0.34, 0.32, 0.05)), mid, 0, 0.03, -0.17, this.torso);
    this._mesh(this._geo(new THREE.BoxGeometry(0.36, 0.035, 0.06)), accentMat, 0, 0.15, -0.18, this.torso);
    this._mesh(this._geo(new THREE.BoxGeometry(0.05, 0.3, 0.02)), visorMat, 0, 0.02, -0.195, this.torso);
    // Chest core.
    this._mesh(this._geo(new THREE.OctahedronGeometry(0.065, 0)), this._basic(0xffffff), 0, 0.02, -0.21, this.torso);
    // Backpack.
    this._mesh(this._geo(new THREE.BoxGeometry(0.32, 0.34, 0.18)), mid, 0, 0.04, 0.2, this.torso);
    const packGlow = this._mesh(this._geo(new THREE.BoxGeometry(0.22, 0.025, 0.02)), visorMat, 0, 0.12, 0.295, this.torso);
    packGlow.scale.y = 0.6;

    // Arms.
    this.armL = new THREE.Group();
    this.armL.position.set(-0.32, 1.39, 0);
    this.bodyGroup.add(this.armL);
    this.armR = new THREE.Group();
    this.armR.position.set(0.32, 1.39, 0);
    this.bodyGroup.add(this.armR);
    for (const [arm, sign] of [[this.armL, -1], [this.armR, 1]]) {
      const shoulder = this._mesh(this._geo(new THREE.BoxGeometry(0.22, 0.16, 0.24)), mid, sign * 0.02, 0.03, 0, arm);
      this._outline(shoulder);
      const forearm = this._mesh(this._geo(new THREE.BoxGeometry(0.14, 0.46, 0.14)), dark, sign * 0.04, -0.26, 0, arm);
      this._outline(forearm);
      this._mesh(this._geo(new THREE.BoxGeometry(0.15, 0.12, 0.16)), mid, sign * 0.04, -0.51, -0.02, arm);
      this._mesh(this._geo(new THREE.BoxGeometry(0.15, 0.02, 0.15)), accentMat, sign * 0.04, -0.42, 0, arm);
    }
    // Pose arms forward holding a weapon.
    this.armR.rotation.x = -0.85;
    this.armR.rotation.z = -0.08;
    this.armL.rotation.x = -1.0;
    this.armL.rotation.z = 0.32;

    // Weapon prop.
    this.weaponGroup = new THREE.Group();
    this.weaponGroup.position.set(0.1, 1.15, -0.36);
    this.weaponGroup.rotation.x = -0.04;
    this.bodyGroup.add(this.weaponGroup);
    const gunBody = this._mesh(this._geo(new THREE.BoxGeometry(0.12, 0.12, 0.46)), mid, 0, 0, -0.05, this.weaponGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.055, 0.055, 0.28)), dark, 0, 0.045, -0.24, this.weaponGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.13, 0.02, 0.2)), visorMat, 0, 0.06, -0.1, this.weaponGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.06, 0.16, 0.08)), dark, 0, -0.13, 0.03, this.weaponGroup);
    this.muzzleObject = new THREE.Object3D();
    this.muzzleObject.position.set(0, 0.045, -0.42);
    this.weaponGroup.add(this.muzzleObject);

    this.muzzleFlash = new THREE.Mesh(
      this._geo(new THREE.SphereGeometry(0.12, 6, 4)),
      new THREE.MeshBasicMaterial({ color: 0xd9ffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    this.muzzleFlash.position.copy(this.muzzleObject.position);
    this.muzzleFlash.visible = false;
    this.weaponGroup.add(this.muzzleFlash);
    this.materials.add(this.muzzleFlash.material);

    // Head.
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.63, 0);
    this.bodyGroup.add(this.headGroup);
    const headMesh = this._mesh(this._geo(new THREE.BoxGeometry(0.28, 0.29, 0.28)), dark, 0, 0, 0, this.headGroup);
    this._outline(headMesh);
    this._mesh(this._geo(new THREE.BoxGeometry(0.24, 0.08, 0.03)), visorMat, 0, 0.02, -0.155, this.headGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.3, 0.035, 0.3)), mid, 0, 0.16, 0, this.headGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.06, 0.2, 0.02)), accentMat, 0.15, 0.01, 0, this.headGroup);
    this._mesh(this._geo(new THREE.BoxGeometry(0.06, 0.2, 0.02)), accentMat, -0.15, 0.01, 0, this.headGroup);

    // Invisible hitboxes.
    this.hitGroup = new THREE.Group();
    this.group.add(this.hitGroup);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
    this.materials.add(hitMat);
    this.hitBody = new THREE.Mesh(this._geo(new THREE.CapsuleGeometry(0.31, 0.82, 4, 8)), hitMat);
    this.hitBody.position.y = 0.88;
    this.hitBody.userData = { playerId: this.id, hitPart: 'body', active: true };
    this.hitBody.frustumCulled = false;
    this.hitGroup.add(this.hitBody);
    this.hitHead = new THREE.Mesh(this._geo(new THREE.SphereGeometry(0.24, 8, 6)), hitMat);
    this.hitHead.position.y = 1.64;
    this.hitHead.userData = { playerId: this.id, hitPart: 'head', active: true };
    this.hitHead.frustumCulled = false;
    this.hitGroup.add(this.hitHead);

    // Ground ring.
    const ring = new THREE.Mesh(
      this._geo(new THREE.TorusGeometry(0.46, 0.012, 4, 24)),
      new THREE.MeshBasicMaterial({ color: accentHex, transparent: true, opacity: 0.3, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.materials.add(ring.material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    this.group.add(ring);
    this.groundRing = ring;

    this.group.traverse((child) => {
      if (child.isMesh && child !== this.hitBody && child !== this.hitHead) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }

  _drawLabel() {
    const { ctx: g, canvas, texture } = this.nameCanvas;
    const w = canvas.width;
    const h = canvas.height;
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(3, 8, 16, 0.82)';
    g.beginPath();
    g.roundRect(10, 10, w - 20, h - 20, 8);
    g.fill();
    g.strokeStyle = this.color;
    g.globalAlpha = 0.55;
    g.lineWidth = 3;
    g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = this.color;
    g.fillRect(14, 14, 60, 4);
    g.fillStyle = '#eaffff';
    g.font = '700 40px Orbitron, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const safeName = String(this.name).slice(0, 12);
    g.fillText(safeName, w / 2, 53);
    // Health bar.
    const pct = clamp(this.health / 100, 0, 1);
    g.fillStyle = 'rgba(255,255,255,0.1)';
    g.fillRect(34, 88, w - 68, 12);
    g.fillStyle = pct > 0.5 ? '#a6ff4d' : pct > 0.25 ? '#ffc857' : '#ff3b5c';
    g.fillRect(34, 88, (w - 68) * pct, 12);
    g.strokeStyle = 'rgba(255,255,255,0.18)';
    g.lineWidth = 1;
    g.strokeRect(34, 88, w - 68, 12);
    texture.needsUpdate = true;
  }

  setHealth(health, maxHealth = 100) {
    const next = clamp(health, 0, maxHealth);
    if (Math.abs(next - this.lastHealth) < 0.1 && this.lastAlive === this.alive) return;
    if (this.alive && this.lastHealth >= 0 && next < this.lastHealth - 0.01) {
      this.hitFlash = 0.16;
    }
    this.health = next;
    this.lastHealth = next;
    this.lastAlive = this.alive;
    if (this.alive) {
      this._drawLabel();
      this.nameSprite.visible = true;
    } else {
      this.nameSprite.visible = false;
    }
  }

  setAlive(alive) {
    if (this.alive === alive) return;
    this.alive = alive;
    this.deathTime = alive ? 0 : 0.0001;
    this.hitGroup.visible = alive;
    this.hitBody.userData.active = alive;
    this.hitHead.userData.active = alive;
    if (alive) {
      this.group.visible = true;
      this.bodyGroup.rotation.z = 0;
      this.bodyGroup.rotation.x = 0;
      this.bodyGroup.position.y = 0;
      this.nameSprite.visible = true;
      this.markerGroup.visible = true;
      this.aura.visible = true;
      this.hitFlash = 0;
      this._drawLabel();
    } else {
      this.nameSprite.visible = false;
      this.markerGroup.visible = false;
      this.aura.visible = false;
      this.lastHealth = -1;
    }
  }

  setCrouch(crouch) {
    if (this.crouch === crouch) return;
    this.crouch = crouch;
    this.bodyGroup.scale.y = crouch ? 0.82 : 1;
    this.nameSprite.position.y = crouch ? 1.9 : 2.15;
    this.hitBody.position.y = crouch ? 0.72 : 0.88;
    this.hitBody.scale.y = crouch ? 0.78 : 1;
    this.hitHead.position.y = crouch ? 1.33 : 1.64;
  }

  /** Keep nameplates and the hostile marker legible at long arena ranges. */
  setCameraDistance(distance) {
    const target = clamp(Number(distance) / 9, 1, 2.4);
    if (Math.abs(target - this._nameScale) < 0.02) return;
    this._nameScale = target;
    this.nameSprite.scale.set(NAME_BASE_WIDTH * target, NAME_BASE_HEIGHT * target, 1);
    this.markerGroup?.scale.setScalar(0.9 + (target - 1) * 0.55);
  }

  setWeaponColor(color) {
    // The weapon glow follows the player's accent color; this is cheap (one material).
    if (this._weaponGlow) this._weaponGlow.color.set(color);
  }

  flashMuzzle(duration = 0.055) {
    this.fireTimer = Math.max(this.fireTimer, duration);
    this.muzzleFlash.visible = true;
    this.muzzleFlash.rotation.z = Math.random() * Math.PI;
    this.muzzleFlash.scale.setScalar(0.8 + Math.random() * 0.6);
  }

  getMuzzleWorld(target = new THREE.Vector3()) {
    return this.muzzleObject.getWorldPosition(target);
  }

  getHitMeshes() {
    return this.alive ? [this.hitHead, this.hitBody] : [];
  }

  update(dt, { time = 0, speed = 0, grounded = true, pitch = 0, firing = false } = {}) {
    if (!this.alive) {
      this.deathTime += dt;
      const t = clamp(this.deathTime / 0.7, 0, 1);
      this.bodyGroup.rotation.z = t * 1.35;
      this.bodyGroup.rotation.x = t * 0.1;
      this.bodyGroup.position.y = -t * 0.25;
      if (this.deathTime > 1.6) this.group.visible = false;
      return;
    }
    this.pitch = damp(this.pitch, clamp(pitch, -1.2, 1.2), 14, dt);
    this.headGroup.rotation.x = this.pitch * 0.65;
    this.torso.rotation.x = this.pitch * 0.12;
    this.walkPhase += dt * (2.2 + Math.min(speed, 12) * 0.9);
    const pace = clamp(speed / 8, 0, 1.3);
    const swing = Math.sin(this.walkPhase) * 0.55 * pace;
    this.legL.rotation.x = swing;
    this.legR.rotation.x = -swing;
    this.armL.rotation.x = -1.0 - swing * 0.25;
    this.armR.rotation.x = -0.85 + swing * 0.14;
    const bob = grounded ? Math.abs(Math.sin(this.walkPhase)) * 0.035 * pace : 0.02;
    this.bodyGroup.position.y = bob;
    // Face the weapon's recoil flash.
    this.fireTimer = Math.max(0, this.fireTimer - dt);
    this.muzzleFlash.visible = this.fireTimer > 0;
    this.weaponGroup.position.z = -0.36 + (firing ? 0.045 : 0);
    this.weaponGroup.rotation.x = -0.04 + (firing ? 0.08 : 0);
    this.groundRing.material.opacity = 0.18 + Math.sin(time * 2 + this.walkPhase) * 0.06;
    this.groundRing.visible = grounded;

    // Damage flash on the rim, plus a floating hostile diamond that stays
    // readable above cover and at long range.
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    const rimOpacity = 0.78 + Math.min(0.22, this.hitFlash * 2.2);
    if (Math.abs(rimOpacity - this._rimOpacity) > 0.004) {
      this._rimOpacity = rimOpacity;
      for (const material of this.outlineMaterials) material.opacity = rimOpacity;
    }
    this.markerGroup.position.y = (this.crouch ? 2.52 : 2.78) + Math.sin(time * 2.6) * 0.05;
    this.markerCore.rotation.y = time * 1.9;
    this.markerHalo.rotation.y = -time * 1.2;
    const pulse = 0.86 + Math.sin(time * 4.2) * 0.14;
    this.markerHalo.scale.set(0.9 * pulse, 1.5 * pulse, 0.9 * pulse);
  }

  dispose() {
    this.group.removeFromParent();
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
    this.nameTexture?.dispose();
    this.nameMaterial?.dispose();
    this.geometries.clear();
    this.materials.clear();
  }
}
