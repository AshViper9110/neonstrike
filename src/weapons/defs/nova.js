import * as THREE from 'three';
import { makeWeaponRoot, box, cyl, mat, glow, addMuzzle, createHand, tagPart } from '../modelKit.js';

const BODY = 0x14100b;
const METAL = 0x3c2f1d;

export default {
  id: 'nova',
  name: 'NOVA-6',
  slot: 5,
  type: 'projectile',
  classLabel: 'NOVA / ROCKET',
  description: '直撃と範囲爆発を併せ持つロケットランチャー。自爆注意。',
  damage: 55,
  headshotMult: 1.2,
  fireInterval: 0.92,
  auto: false,
  pellets: 1,
  spreadHip: 0.006,
  spreadAim: 0.002,
  moveSpread: 0.8,
  airSpread: 1.1,
  crouchSpread: 0.8,
  magSize: 2,
  reserveMax: 10,
  reloadTime: 2.35,
  range: 120,
  color: '#ffb347',
  accent: 0xffb347,
  icon: '⊙',
  zoomFov: 72,
  recoil: { pitch: 0.028, yaw: 0.004, kick: 0.06, recover: 8 },
  projectile: {
    speed: 38,
    radius: 0.12,
    gravity: 2.4,
    ttl: 6,
    splashDamage: 58,
    splashRadius: 4.2,
    splashKnockback: 9,
    selfDamageScale: 0.55,
    directKnockback: 5,
  },
  hitParticles: 0xffc266,
  buildModel() {
    const root = makeWeaponRoot([0.31, -0.3, -0.58]);
    const pivot = root.userData.pivot;
    const tube = cyl(0.092, 0.1, 0.58, mat(BODY, { metalness: 0.55, roughness: 0.5 }), 12);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 0.03, -0.16);
    pivot.add(tube);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.011, 6, 22), glow(0xffb347, 0.9));
    rim.position.set(0, 0.03, -0.45);
    pivot.add(rim);
    const rim2 = rim.clone();
    rim2.position.z = 0.11;
    rim2.scale.setScalar(0.94);
    pivot.add(rim2);
    const topRail = box(0.045, 0.025, 0.34, mat(METAL), 0, 0.13, -0.18);
    pivot.add(topRail);
    const sight = box(0.05, 0.05, 0.08, mat(0x1b150d), 0, 0.155, -0.03);
    pivot.add(sight);
    const sightGlass = box(0.032, 0.028, 0.004, glow(0x00f6ff, 0.65), 0, 0.157, -0.073);
    pivot.add(sightGlass);
    const sideStripeL = box(0.008, 0.018, 0.34, glow(0xffb347, 0.75), -0.088, 0.03, -0.16);
    const sideStripeR = sideStripeL.clone();
    sideStripeR.position.x = 0.088;
    pivot.add(sideStripeL, sideStripeR);
    const drum = cyl(0.085, 0.085, 0.16, mat(0x22190f), 10);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0.09, -0.055, -0.04);
    pivot.add(drum);
    const drumGlow = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.007, 5, 18), glow(0xffb347, 0.7));
    drumGlow.rotation.y = Math.PI / 2;
    drumGlow.position.set(0.175, -0.055, -0.04);
    pivot.add(drumGlow);
    tagPart(root, 'drum', drum);
    tagPart(root, 'drumGlow', drumGlow);
    const handle = box(0.055, 0.17, 0.075, mat(0x130e08), 0, -0.13, 0.03);
    handle.rotation.x = -0.18;
    pivot.add(handle);
    const foregrip = box(0.06, 0.13, 0.07, mat(0x130e08), 0, -0.1, -0.33);
    foregrip.rotation.x = 0.22;
    pivot.add(foregrip);
    const stock = box(0.07, 0.14, 0.16, mat(0x1a130a), 0, 0.0, 0.25);
    pivot.add(stock);
    const handR = createHand(mat(0x1d160e), mat(0x0a0705), 0.02, -0.165, 0.05, [0.12, 0, 0]);
    pivot.add(handR);
    const handL = createHand(mat(0x1d160e), mat(0x0a0705), 0, -0.15, -0.33, [0.1, 0, 0.2]);
    handL.scale.setScalar(0.85);
    pivot.add(handL);
    addMuzzle(root, 0, 0.03, -0.5);
    root.userData.muzzleColor = 0xffd08a;
    return root;
  },
};
