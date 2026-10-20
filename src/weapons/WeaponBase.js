import { clamp } from '../core/utils.js';

/**
 * Weapon runtime state. Every player owns one instance per weapon slot,
 * while definitions live in the WeaponRegistry and are shared/immutable.
 *
 * Extend gameplay by adding a new definition file (see defs/*.js) and
 * registering it. The firing, HUD, ammo, reload and hit-validation systems
 * are data driven and need no changes for standard hitscan/projectile guns.
 */
export class WeaponBase {
  constructor(def) {
    this.def = def;
    this.slot = def.slot;
    this.id = def.id;
    this.ammo = def.magSize;
    this.reserve = def.reserveMax;
    this.reloading = false;
    this.reloadRemaining = 0;
    this.cooldown = 0;
    this.heat = 0;
    this.shotCount = 0;
    this.lastShotAt = -1;
  }

  get isReloading() {
    return this.reloading;
  }

  get isFull() {
    return this.ammo >= this.def.magSize;
  }

  get hasReserve() {
    return this.reserve === Infinity || this.reserve > 0;
  }

  get reloadProgress() {
    if (!this.reloading) return 0;
    return clamp(1 - this.reloadRemaining / this.def.reloadTime, 0, 1);
  }

  get ammoFraction() {
    return this.def.magSize > 0 ? this.ammo / this.def.magSize : 0;
  }

  get canReload() {
    return !this.reloading && this.ammo < this.def.magSize && this.hasReserve;
  }

  update(dt) {
    const result = { reloadCompleted: false, reloadStarted: false };
    if (this.cooldown > 0) this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.heat > 0) this.heat = Math.max(0, this.heat - dt * 3.2);
    if (this.reloading) {
      this.reloadRemaining -= dt;
      if (this.reloadRemaining <= 0) {
        this._finishReload();
        result.reloadCompleted = true;
      }
    }
    return result;
  }

  startReload() {
    if (!this.canReload) return false;
    this.reloading = true;
    this.reloadRemaining = this.def.reloadTime / Math.max(0.1, this.def.reloadSpeedBonus ?? 1);
    return true;
  }

  cancelReload() {
    if (!this.reloading) return false;
    this.reloading = false;
    this.reloadRemaining = 0;
    return true;
  }

  _finishReload() {
    const missing = this.def.magSize - this.ammo;
    if (this.reserve === Infinity) {
      this.ammo = this.def.magSize;
    } else {
      const loaded = Math.min(missing, this.reserve);
      this.ammo += loaded;
      this.reserve -= loaded;
    }
    this.reloading = false;
    this.reloadRemaining = 0;
  }

  consumeShot() {
    if (this.ammo <= 0) return false;
    this.ammo -= 1;
    this.cooldown = this.def.fireInterval;
    this.heat = 1;
    this.shotCount += 1;
    this.lastShotAt = performance.now() / 1000;
    return true;
  }

  refill() {
    this.ammo = this.def.magSize;
    this.reserve = this.def.reserveMax;
    this.reloading = false;
    this.reloadRemaining = 0;
    this.cooldown = 0;
    this.heat = 0;
  }

  getSpread({ aiming = false, moveSpeed = 0, airborne = false, crouching = false } = {}) {
    let spread = aiming ? this.def.spreadAim : this.def.spreadHip;
    const moveNorm = clamp(moveSpeed / 10, 0, 1.4);
    spread *= 1 + moveNorm * (this.def.moveSpread ?? 1.4);
    if (airborne) spread *= this.def.airSpread ?? 2.0;
    if (crouching) spread *= this.def.crouchSpread ?? 0.72;
    return spread;
  }

  getDamage(distance, headshot = false) {
    let damage = this.def.damage;
    const falloff = this.def.falloff;
    if (falloff && distance > falloff.start) {
      const t = clamp((distance - falloff.start) / Math.max(0.001, falloff.end - falloff.start), 0, 1);
      damage *= 1 + (falloff.min - 1) * t;
    }
    if (headshot) damage *= this.def.headshotMult;
    return damage;
  }

  getMaxDamagePerShot() {
    const pellets = this.def.pellets ?? 1;
    const direct = this.def.damage * pellets * Math.max(1, this.def.headshotMult);
    const splash = this.def.projectile?.splashDamage ?? 0;
    return Math.ceil(direct + splash);
  }

  snapshotAmmo() {
    return { ammo: this.ammo, reserve: this.reserve === Infinity ? -1 : this.reserve };
  }

  resetCooldown() {
    this.cooldown = 0;
  }
}
