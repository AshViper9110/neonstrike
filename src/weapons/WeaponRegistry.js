import { WeaponBase } from './WeaponBase.js';

export class WeaponRegistry {
  constructor() {
    this.defs = new Map();
  }

  register(def) {
    if (!def?.id) throw new Error('Weapon definition requires an id');
    if (this.defs.has(def.id)) throw new Error(`Weapon "${def.id}" already registered`);
    const required = ['name', 'slot', 'type', 'damage', 'magSize', 'reserveMax', 'fireInterval', 'reloadTime'];
    for (const key of required) {
      if (def[key] == null) throw new Error(`Weapon "${def.id}" is missing "${key}"`);
    }
    if (!['hitscan', 'projectile'].includes(def.type)) throw new Error(`Weapon "${def.id}" has invalid type`);
    const normalized = {
      pellets: 1,
      headshotMult: 1.5,
      spreadHip: 0.01,
      spreadAim: 0.004,
      range: 60,
      auto: false,
      color: '#00f6ff',
      classLabel: def.type.toUpperCase(),
      icon: '✦',
      recoil: { pitch: 0.008, yaw: 0.002, kick: 0.025, recover: 12 },
      ...def,
    };
    this.defs.set(def.id, normalized);
    return normalized;
  }

  get(id) {
    return this.defs.get(id);
  }

  list() {
    return [...this.defs.values()].sort((a, b) => a.slot - b.slot);
  }

  ids() {
    return this.list().map((def) => def.id);
  }

  createInstance(id) {
    const def = this.defs.get(id);
    return def ? new WeaponBase(def) : null;
  }

  createLoadout() {
    return this.list().map((def) => new WeaponBase(def));
  }
}

export const weaponRegistry = new WeaponRegistry();
