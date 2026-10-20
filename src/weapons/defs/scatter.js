import * as THREE from 'three';
import { makeWeaponRoot, box, cyl, mat, glow, addMuzzle, createHand, tagPart } from '../modelKit.js';

const BODY = 0x140a19;
const METAL = 0x3a253f;

export default {
  id: 'scatter',
  name: 'SCATTER-12',
  slot: 3,
  type: 'hitscan',
  classLabel: 'SCATTER / 8 PELLET',
  description: '8発のペレットを拡散射撃。近距離では圧倒的。',
  damage: 10.5,
  headshotMult: 1.5,
  fireInterval: 0.82,
  auto: false,
  pellets: 8,
  spreadHip: 0.058,
  spreadAim: 0.042,
  moveSpread: 0.9,
  airSpread: 1.25,
  crouchSpread: 0.82,
  magSize: 6,
  reserveMax: 36,
  reloadTime: 2.05,
  range: 36,
  falloff: { start: 8, end: 30, min: 0.42 },
  color: '#ff2bd6',
  accent: 0xff2bd6,
  icon: '⁂',
  zoomFov: 74,
  recoil: { pitch: 0.032, yaw: 0.005, kick: 0.075, recover: 9 },
  hitParticles: 0xff80e5,
  buildModel() {
    const root = makeWeaponRoot([0.3, -0.3, -0.56]);
    const pivot = root.userData.pivot;
    const body = box(0.13, 0.13, 0.3, mat(BODY), 0, 0, 0.02);
    pivot.add(body);
    const upper = box(0.115, 0.055, 0.34, mat(METAL, { metalness: 0.75 }), 0, 0.075, -0.04);
    pivot.add(upper);
    const barrelL = cyl(0.028, 0.028, 0.38, mat(0x2b2335, { metalness: 0.95, roughness: 0.2 }), 10);
    barrelL.rotation.x = Math.PI / 2;
    barrelL.position.set(-0.032, 0.035, -0.29);
    pivot.add(barrelL);
    const barrelR = barrelL.clone();
    barrelR.position.x = 0.032;
    pivot.add(barrelR);
    const ringA = new THREE.TorusGeometry(0.043, 0.006, 6, 16);
    const ring = new THREE.Mesh(ringA, glow(0xff2bd6, 0.85));
    ring.position.set(0, 0.035, -0.43);
    pivot.add(ring);
    const pump = box(0.16, 0.075, 0.18, mat(0x251a2e), 0, -0.025, -0.25);
    pivot.add(pump);
    const pumpStrip1 = box(0.162, 0.012, 0.12, glow(0xff2bd6, 0.7), 0, 0.018, -0.25);
    const pumpStrip2 = pumpStrip1.clone();
    pumpStrip2.position.y = -0.066;
    pivot.add(pumpStrip1, pumpStrip2);
    tagPart(root, 'pump', pump);
    tagPart(root, 'pumpStrips', pumpStrip1);
    tagPart(root, 'pumpStrips2', pumpStrip2);
    const tube = cyl(0.022, 0.022, 0.3, mat(0x322540), 8);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, -0.065, -0.31);
    pivot.add(tube);
    const stock = box(0.082, 0.14, 0.21, mat(0x1b1322), 0, -0.035, 0.27);
    stock.rotation.x = 0.08;
    pivot.add(stock);
    const grip = box(0.07, 0.15, 0.08, mat(0x130e19), 0, -0.13, 0.16);
    grip.rotation.x = -0.25;
    pivot.add(grip);
    const shellL = box(0.017, 0.045, 0.06, glow(0xffc857, 0.8), -0.09, -0.02, 0.06);
    pivot.add(shellL);
    const shell2 = shellL.clone();
    shell2.position.x = -0.065;
    pivot.add(shell2);
    const handR = createHand(mat(0x1b1423), mat(0x0a0610), 0.015, -0.16, 0.17, [0.12, 0, 0]);
    pivot.add(handR);
    const handL = createHand(mat(0x1b1423), mat(0x0a0610), -0.005, -0.095, -0.25, [0.18, 0, 0.05]);
    handL.scale.setScalar(0.86);
    pivot.add(handL);
    addMuzzle(root, 0, 0.035, -0.49);
    root.userData.muzzleColor = 0xff80e5;
    return root;
  },
};
