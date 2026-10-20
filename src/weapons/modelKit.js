import * as THREE from 'three';

const materialCache = new Map();

export function mat(color = 0x141c2c, { metalness = 0.65, roughness = 0.42, emissive = 0x000000, emissiveIntensity = 0, flat = true } = {}) {
  const key = `${color}-${metalness}-${roughness}-${emissive}-${emissiveIntensity}-${flat}`;
  if (materialCache.has(key)) return materialCache.get(key);
  const m = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
    flatShading: flat,
  });
  materialCache.set(key, m);
  return m;
}

export function glow(color = 0x00f6ff, opacity = 1, additive = false) {
  const key = `glow-${color}-${opacity}-${additive}`;
  if (materialCache.has(key)) return materialCache.get(key);
  const m = new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1 || additive,
    opacity,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: !additive,
    toneMapped: false,
  });
  materialCache.set(key, m);
  return m;
}

export function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
}

export function cyl(radiusTop, radiusBottom, height, material, segments = 8) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
}

export function makeWeaponRoot(position = [0.31, -0.29, -0.58]) {
  const root = new THREE.Group();
  root.position.set(...position);
  root.rotation.order = 'YXZ';
  const pivot = new THREE.Group();
  root.add(pivot);
  root.userData.pivot = pivot;
  return root;
}

export function addMuzzle(root, x, y, z, pivot = null) {
  const muzzle = new THREE.Object3D();
  muzzle.position.set(x, y, z);
  (pivot || root.userData.pivot || root).add(muzzle);
  root.userData.muzzle = muzzle;
  return muzzle;
}

export function createHand(material, gloveMaterial, x, y, z, rotation = [0, 0, 0]) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.set(...rotation);
  const palm = box(0.075, 0.085, 0.11, material, 0, 0, 0);
  group.add(palm);
  const glove = box(0.08, 0.045, 0.115, gloveMaterial, 0, 0.055, -0.005);
  group.add(glove);
  const fingers = box(0.075, 0.065, 0.045, gloveMaterial, 0, 0.02, -0.075);
  group.add(fingers);
  const strip = box(0.082, 0.007, 0.06, glow(0x00f6ff, 0.9), 0, 0.075, 0.02);
  group.add(strip);
  return group;
}

/**
 * Registers a small animation part so ViewModel can move it (slides, mags...).
 */
export function tagPart(root, name, obj) {
  if (!root.userData.parts) root.userData.parts = {};
  root.userData.parts[name] = obj;
  return obj;
}

export function applyDepthMaterials(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = false;
    child.renderOrder = 10;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const m of mats) {
      m.depthTest = true;
    }
  });
  return root;
}
