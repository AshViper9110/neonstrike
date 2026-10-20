import * as THREE from 'three';
import { makeWeaponRoot, box, cyl, mat, glow, addMuzzle, createHand, tagPart } from '../modelKit.js';

const BODY = 0x0b0b18;
const METAL = 0x2a2a42;

export default {
  id: 'rail',
  name: 'RAIL-7',
  slot: 4,
  type: 'hitscan',
  classLabel: 'RAIL / PIERCE',
  description: '壁を貫かない超高威力ビーム。最大2体を貫通する。',
  damage: 78,
  headshotMult: 2.1,
  fireInterval: 1.02,
  auto: false,
  pellets: 1,
  pierce: 2,
  spreadHip: 0.0018,
  spreadAim: 0.0002,
  moveSpread: 2.2,
  airSpread: 3,
  crouchSpread: 0.75,
  magSize: 4,
  reserveMax: 16,
  reloadTime: 2.2,
  range: 110,
  color: '#a78bff',
  accent: 0xa78bff,
  icon: '⟁',
  zoomFov: 48,
  recoil: { pitch: 0.02, yaw: 0.002, kick: 0.05, recover: 8 },
  hitParticles: 0xcbb6ff,
  buildModel() {
    const root = makeWeaponRoot([0.3, -0.27, -0.62]);
    const pivot = root.userData.pivot;
    const body = box(0.08, 0.095, 0.5, mat(BODY), 0, 0, -0.06);
    pivot.add(body);
    const barrel = cyl(0.021, 0.025, 0.55, mat(0x40405e, { metalness: 0.92, roughness: 0.2 }), 10);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, -0.42);
    pivot.add(barrel);
    const coils = [];
    for (let i = 0; i < 4; i++) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.007, 5, 20), glow(0xa78bff, 0.9));
      coil.position.set(0, 0.02, -0.24 - i * 0.11);
      coils.push(coil);
      pivot.add(coil);
    }
    root.userData.coils = coils;
    const spine = box(0.018, 0.018, 0.46, glow(0x00f6ff, 0.85), 0, 0.079, -0.1);
    pivot.add(spine);
    const sideFinL = box(0.014, 0.07, 0.18, mat(0x1c1c30), -0.052, 0.02, 0.1);
    sideFinL.rotation.z = -0.14;
    const sideFinR = sideFinL.clone();
    sideFinR.position.x = 0.052;
    sideFinR.rotation.z = 0.14;
    pivot.add(sideFinL, sideFinR);
    const scopeBody = box(0.062, 0.062, 0.22, mat(0x17172a), 0, 0.115, -0.02);
    pivot.add(scopeBody);
    const scopeLens = box(0.04, 0.04, 0.005, glow(0xa78bff, 0.8), 0, 0.115, -0.132);
    pivot.add(scopeLens);
    const scopeLensBack = scopeLens.clone();
    scopeLensBack.position.z = 0.092;
    pivot.add(scopeLensBack);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.006, 5, 16), glow(0x00f6ff, 0.75));
    ring.position.set(0, 0.115, -0.128);
    pivot.add(ring);
    const stock = box(0.07, 0.13, 0.24, mat(0x121220), 0, -0.025, 0.28);
    pivot.add(stock);
    const glowStock = box(0.073, 0.01, 0.2, glow(0xa78bff, 0.6), 0, 0.039, 0.28);
    pivot.add(glowStock);
    const cell = box(0.055, 0.13, 0.1, mat(0x1b1b30), 0, -0.11, -0.02);
    pivot.add(cell);
    const cellGlow = box(0.01, 0.09, 0.07, glow(0x00f6ff, 0.8), 0.03, -0.11, -0.02);
    pivot.add(cellGlow);
    tagPart(root, 'magazine', cell);
    tagPart(root, 'magazineGlow', cellGlow);
    const grip = box(0.065, 0.16, 0.08, mat(0x0d0d18), 0, -0.132, 0.1);
    grip.rotation.x = -0.22;
    pivot.add(grip);
    const handR = createHand(mat(0x181824), mat(0x080810), 0.018, -0.17, 0.11, [0.12, 0, 0]);
    pivot.add(handR);
    const handL = createHand(mat(0x181824), mat(0x080810), -0.002, -0.11, -0.23, [0.12, 0, -0.15]);
    handL.scale.setScalar(0.82);
    pivot.add(handL);
    addMuzzle(root, 0, 0.02, -0.71);
    root.userData.muzzleColor = 0xd8c6ff;
    return root;
  },
};
