import * as THREE from 'three';
import { makeWeaponRoot, box, cyl, mat, glow, addMuzzle, createHand, tagPart } from '../modelKit.js';

const BODY = 0x0b1220;
const METAL = 0x26344c;

export default {
  id: 'pulse',
  name: 'PULSE-9',
  slot: 1,
  type: 'hitscan',
  classLabel: 'PULSE / AUTO',
  description: 'エネルギー弾を連射する万能兵器。予備弾薬は無限。',
  damage: 16,
  headshotMult: 1.8,
  fireInterval: 0.145,
  auto: true,
  pellets: 1,
  spreadHip: 0.0075,
  spreadAim: 0.0022,
  moveSpread: 1.7,
  airSpread: 2.1,
  crouchSpread: 0.75,
  magSize: 14,
  reserveMax: Infinity,
  reloadTime: 1.05,
  range: 70,
  color: '#00f6ff',
  accent: 0x00f6ff,
  icon: '✦',
  zoomFov: 68,
  recoil: { pitch: 0.0065, yaw: 0.0022, kick: 0.022, recover: 16 },
  hitParticles: 0x74fbff,
  buildModel() {
    const root = makeWeaponRoot([0.29, -0.27, -0.56]);
    const pivot = root.userData.pivot;
    const body = box(0.115, 0.105, 0.31, mat(BODY), 0, 0, -0.08);
    pivot.add(body);
    const upper = box(0.085, 0.055, 0.27, mat(METAL, { metalness: 0.8 }), 0, 0.065, -0.135);
    pivot.add(upper);
    const shroud = box(0.13, 0.028, 0.14, mat(0x172438), 0, 0.035, -0.26);
    pivot.add(shroud);
    const barrel = cyl(0.024, 0.026, 0.3, mat(0x394a63, { metalness: 0.9, roughness: 0.25 }), 10);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, -0.33);
    pivot.add(barrel);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.007, 6, 18), glow(0x00f6ff, 0.95));
    coil.position.set(0, 0.01, -0.265);
    pivot.add(coil);
    const coil2 = coil.clone();
    coil2.position.z = -0.345;
    coil2.scale.setScalar(0.85);
    pivot.add(coil2);
    const stripL = box(0.012, 0.016, 0.22, glow(0x00f6ff, 0.85), -0.062, 0.025, -0.13);
    const stripR = stripL.clone();
    stripR.position.x = 0.062;
    pivot.add(stripL, stripR);
    const sight = box(0.03, 0.035, 0.08, mat(0x1a2334), 0, 0.1, -0.17);
    pivot.add(sight);
    const sightDot = box(0.012, 0.012, 0.008, glow(0xff2bd6), 0, 0.115, -0.212);
    pivot.add(sightDot);
    const grip = box(0.072, 0.17, 0.075, mat(0x101827), 0, -0.125, 0.035);
    grip.rotation.x = -0.2;
    pivot.add(grip);
    const mag = box(0.07, 0.12, 0.085, mat(0x192337), 0, -0.105, -0.1);
    mag.rotation.x = 0.08;
    pivot.add(mag);
    const magGlow = box(0.072, 0.018, 0.087, glow(0x00f6ff, 0.7), 0, -0.065, -0.1);
    pivot.add(magGlow);
    tagPart(root, 'magazine', mag);
    tagPart(root, 'magazineGlow', magGlow);
    const hand = createHand(mat(0x151d2b), mat(0x08111b), 0.018, -0.15, 0.055, [0.12, 0, 0]);
    pivot.add(hand);
    addMuzzle(root, 0, 0.01, -0.485);
    root.userData.muzzleColor = 0x74fbff;
    return root;
  },
};
