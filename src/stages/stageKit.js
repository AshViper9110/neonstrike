import * as THREE from 'three';
import { clamp } from '../core/utils.js';

export class StageMaterials {
  constructor() {
    this.cache = new Map();
    this.textures = new Set();
    this.materials = new Set();
  }

  standard(key, params) {
    if (this.cache.has(key)) return this.cache.get(key);
    const m = new THREE.MeshStandardMaterial(params);
    this.cache.set(key, m);
    this.materials.add(m);
    return m;
  }

  basic(key, params) {
    if (this.cache.has(key)) return this.cache.get(key);
    const m = new THREE.MeshBasicMaterial(params);
    this.cache.set(key, m);
    this.materials.add(m);
    return m;
  }

  line(key, params) {
    if (this.cache.has(key)) return this.cache.get(key);
    const m = new THREE.LineBasicMaterial(params);
    this.cache.set(key, m);
    this.materials.add(m);
    return m;
  }

  trackTexture(texture) {
    this.textures.add(texture);
    return texture;
  }

  dispose() {
    for (const m of this.materials) m.dispose();
    for (const t of this.textures) t.dispose();
    this.materials.clear();
    this.textures.clear();
    this.cache.clear();
  }
}

export const NEON_COLORS = {
  cyan: 0x00f6ff,
  magenta: 0xff2bd6,
  violet: 0x8a5bff,
  lime: 0xa6ff4d,
  amber: 0xffc857,
  red: 0xff3b5c,
  blue: 0x3898ff,
  white: 0xd8f8ff,
};

export function createGridTexture(renderer) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext('2d');
  g.fillStyle = '#04070f';
  g.fillRect(0, 0, size, size);
  // subtle panel noise
  for (let i = 0; i < 240; i++) {
    g.fillStyle = `rgba(60, 120, 150, ${Math.random() * 0.018})`;
    g.fillRect(Math.random() * size, Math.random() * size, Math.random() * 40 + 2, Math.random() * 40 + 2);
  }
  g.strokeStyle = 'rgba(0, 210, 235, 0.10)';
  g.lineWidth = 1;
  const cell = size / 4;
  for (let i = 1; i < 4; i++) {
    g.beginPath();
    g.moveTo(i * cell, 0);
    g.lineTo(i * cell, size);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i * cell);
    g.lineTo(size, i * cell);
    g.stroke();
  }
  g.strokeStyle = 'rgba(0, 246, 255, 0.34)';
  g.lineWidth = 2;
  g.strokeRect(0, 0, size, size);
  g.strokeStyle = 'rgba(255, 43, 214, 0.2)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(0, size);
  g.lineTo(size, 0);
  g.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() ?? 4);
  return texture;
}

export function addNeonBox(ctx, {
  pos = [0, 0, 0],
  size = [1, 1, 1],
  color = NEON_COLORS.cyan,
  baseColor = 0x080d18,
  edge = true,
  opacity = 1,
  glowCap = false,
  solid = true,
  blocks = ['player', 'bullet', 'projectile'],
  minimap = true,
  group = null,
  flat = true,
  metalness = 0.56,
  roughness = 0.5,
  emissive = 0x000000,
  emissiveIntensity = 0,
}) {
  const [w, h, d] = size;
  const [x, y, z] = pos;
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = ctx.materials.standard(`box-${baseColor}-${metalness}-${roughness}-${emissive}-${emissiveIntensity}`, {
    color: baseColor,
    metalness,
    roughness,
    flatShading: flat,
    emissive,
    emissiveIntensity,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  (group || ctx.scene).add(mesh);

  if (edge) {
    const lineMat = ctx.materials.line(`edge-${color}-${opacity}`, {
      color,
      transparent: true,
      opacity: clamp(opacity, 0, 1),
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMat);
    edges.position.copy(mesh.position);
    (group || ctx.scene).add(edges);
  }

  if (glowCap) {
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(0.02, w - 0.04), 0.035, Math.max(0.02, d - 0.04)),
      ctx.materials.basic(`glowcap-${color}-${opacity}`, { color, toneMapped: false }),
    );
    cap.position.set(x, y + h / 2 + 0.015, z);
    (group || ctx.scene).add(cap);
  }

  let solidRef = null;
  if (solid) {
    const box = new THREE.Box3(
      new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
    );
    solidRef = ctx.physics.addSolid(box, { blocks });
  }

  if (minimap && y - h / 2 < 8 && h < 10 && w < 30 && d < 30) {
    ctx.stage.minimapBoxes.push({
      x, z, w, d,
      color,
      top: y + h / 2,
    });
  }

  return { mesh, solid: solidRef, geometry, pos: new THREE.Vector3(x, y, z) };
}

export function addGlowStrip(ctx, from, to, color, thickness = 0.03, group = null, opacity = 0.9) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const delta = new THREE.Vector3().subVectors(end, start);
  const length = delta.length();
  if (length <= 0.0001) return null;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, thickness, length),
    ctx.materials.basic(`strip-${color}-${opacity}`, {
      color,
      toneMapped: false,
      transparent: opacity < 1,
      opacity,
    }),
  );
  mesh.position.copy(start).addScaledVector(delta, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), delta.clone().normalize());
  (group || ctx.scene).add(mesh);
  return mesh;
}

export function createCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext('2d');
  draw(g, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function makeLabelSprite(ctx, text, sub = '', color = '#00f6ff', { width = 512, height = 128 } = {}) {
  const texture = createCanvasTexture(width, height, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(3, 8, 18, 0.72)';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = color;
    g.lineWidth = 3;
    g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = color;
    g.fillRect(0, 0, 90, 4);
    g.fillRect(w - 90, h - 4, 90, 4);
    g.fillStyle = color;
    g.font = '700 42px Orbitron, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, w / 2, sub ? h / 2 - 10 : h / 2);
    if (sub) {
      g.fillStyle = 'rgba(220, 250, 255, 0.65)';
      g.font = '500 20px Orbitron, sans-serif';
      g.fillText(sub, w / 2, h / 2 + 32);
    }
  });
  ctx.materials.trackTexture(texture);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  ctx.materials.materials.add(material);
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width / 128, height / 128, 1);
  return sprite;
}

export function makeHologramMaterial(ctx, color, opacity = 0.18) {
  return ctx.materials.basic(`hologram-${color}-${opacity}`, {
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

export function addRing(ctx, { pos = [0, 0, 0], radius = 1, tube = 0.03, color, rotation = [-Math.PI / 2, 0, 0], opacity = 1, group = null }) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 6, 48),
    ctx.materials.basic(`ring-${color}-${opacity}`, {
      color,
      transparent: opacity < 1,
      opacity,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  mesh.position.set(...pos);
  mesh.rotation.set(...rotation);
  (group || ctx.scene).add(mesh);
  return mesh;
}
