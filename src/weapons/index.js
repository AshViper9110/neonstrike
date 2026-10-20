import { weaponRegistry } from './WeaponRegistry.js';
import pulse from './defs/pulse.js';
import volt from './defs/volt.js';
import scatter from './defs/scatter.js';
import rail from './defs/rail.js';
import nova from './defs/nova.js';

let initialized = false;

export function registerBuiltinWeapons() {
  if (initialized) return weaponRegistry;
  initialized = true;
  [pulse, volt, scatter, rail, nova].forEach((def) => weaponRegistry.register(def));
  return weaponRegistry;
}

export { weaponRegistry };
export const WEAPON_COUNT = 5;
