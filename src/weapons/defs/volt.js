import { makeWeaponRoot, box, cyl, mat, glow, addMuzzle, createHand, tagPart } from '../modelKit.js';

const BODY = 0x0a101c;
const METAL = 0x243249;

export default {
  id: 'volt',
  name: 'VOLT-AR',
  slot: 2,
  type: 'hitscan',
  classLabel: 'VOLT / FULL AUTO',
  description: '高レートのアサルトライフル。中距離の撃ち合いに強い。',
  damage: 11.5,
  headshotMult: 1.75,
  fireInterval: 0.098,
  auto: true,
  pellets: 1,
  spreadHip: 0.013,
  spreadAim: 0.0045,
  moveSpread: 2.0,
  airSpread: 2.4,
  crouchSpread: 0.72,
  magSize: 30,
  reserveMax: 150,
  reloadTime: 1.45,
  range: 78,
  color: '#a6ff4d',
  accent: 0xa6ff4d,
  icon: '≋',
  zoomFov: 66,
  recoil: { pitch: 0.0075, yaw: 0.0032, kick: 0.03, recover: 13 },
  hitParticles: 0xc4ff7a,
  buildModel() {
    const root = makeWeaponRoot([0.3, -0.29, -0.58]);
    const pivot = root.userData.pivot;
    const body = box(0.105, 0.12, 0.42, mat(BODY), 0, 0, -0.08);
    pivot.add(body);
    const rail = box(0.06, 0.03, 0.5, mat(METAL, { metalness: 0.85 }), 0, 0.078, -0.1);
    pivot.add(rail);
    const handguard = box(0.09, 0.085, 0.23, mat(0x162134), 0, -0.005, -0.35);
    pivot.add(handguard);
    const barrel = cyl(0.019, 0.02, 0.32, mat(0x4a5a72, { metalness: 0.9, roughness: 0.25 }), 8);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.015, -0.47);
    pivot.add(barrel);
    const brake = box(0.065, 0.06, 0.075, mat(0x29374b), 0, 0.015, -0.61);
    pivot.add(brake);
    const brakeSlot = box(0.068, 0.016, 0.03, glow(0xa6ff4d, 0.75), 0, 0.03, -0.63);
    pivot.add(brakeSlot);
    for (let i = 0; i < 4; i++) {
      const vent = box(0.012, 0.012, 0.022, glow(0xa6ff4d, 0.8), -0.048, -0.005, -0.28 - i * 0.055);
      const ventR = vent.clone();
      ventR.position.x = 0.048;
      pivot.add(vent, ventR);
    }
    const topStrip = box(0.014, 0.012, 0.34, glow(0x00f6ff, 0.7), 0, 0.098, -0.13);
    pivot.add(topStrip);
    const sight = box(0.055, 0.055, 0.1, mat(0x1d293c), 0, 0.115, -0.04);
    pivot.add(sight);
    const lens = box(0.035, 0.03, 0.004, glow(0x00f6ff, 0.6), 0, 0.12, -0.092);
    pivot.add(lens);
    const mag = box(0.075, 0.17, 0.1, mat(0x1c2739), 0, -0.145, -0.06);
    mag.rotation.x = -0.12;
    pivot.add(mag);
    const magGlow = box(0.078, 0.014, 0.104, glow(0xa6ff4d, 0.8), 0, -0.08, -0.06);
    pivot.add(magGlow);
    tagPart(root, 'magazine', mag);
    tagPart(root, 'magazineGlow', magGlow);
    const stock = box(0.075, 0.11, 0.18, mat(0x121b29), 0, -0.015, 0.2);
    pivot.add(stock);
    const stockStrip = box(0.078, 0.012, 0.14, glow(0x00f6ff, 0.45), 0, 0.045, 0.2);
    pivot.add(stockStrip);
    const grip = box(0.068, 0.16, 0.075, mat(0x101827), 0, -0.13, 0.1);
    grip.rotation.x = -0.25;
    pivot.add(grip);
    const handR = createHand(mat(0x151d2b), mat(0x08111b), 0.018, -0.16, 0.12, [0.14, 0, 0]);
    pivot.add(handR);
    const handL = createHand(mat(0x151d2b), mat(0x08111b), -0.005, -0.12, -0.33, [0.1, 0, -0.28]);
    handL.scale.setScalar(0.82);
    pivot.add(handL);
    addMuzzle(root, 0, 0.015, -0.66);
    root.userData.muzzleColor = 0xc4ff7a;
    return root;
  },
};
