import * as THREE from 'three';

const EPS = 0.0025;
const STEP_HEIGHT = 0.34;
const TMP_A = new THREE.Vector3();
const TMP_B = new THREE.Vector3();

export const PLAYER_RADIUS = 0.37;
export const PLAYER_HEIGHT = 1.82;
export const PLAYER_CROUCH_HEIGHT = 1.24;
export const PLAYER_EYE = 1.66;
export const PLAYER_CROUCH_EYE = 1.02;
export const GRAVITY = 26;

export function playerAABB(pos, radius, height, target = new THREE.Box3()) {
  return target.set(
    TMP_A.set(pos.x - radius, pos.y, pos.z - radius),
    TMP_B.set(pos.x + radius, pos.y + height, pos.z + radius),
  );
}

export function bodyHeight(body) {
  return body.crouch ? PLAYER_CROUCH_HEIGHT : PLAYER_HEIGHT;
}

export function bodyEyeHeight(body) {
  return body.crouch ? PLAYER_CROUCH_EYE : PLAYER_EYE;
}

export function createBody({ position = new THREE.Vector3(0, 0.05, 0), yaw = 0 } = {}) {
  return {
    pos: position.clone(),
    vel: new THREE.Vector3(),
    yaw,
    pitch: 0,
    crouch: false,
    grounded: true,
    groundSolid: null,
    coyote: 0.12,
    jumpBuffer: 0,
    gravityScale: 1,
    updraft: 0,
    jumpScale: 1,
    radius: PLAYER_RADIUS,
    justJumped: false,
    justLanded: false,
    landSpeed: 0,
    externalMove: false,
  };
}

export class PhysicsWorld {
  constructor() {
    this.solids = [];
    this.triggers = [];
    this._solidId = 0;
    this._triggerId = 0;
    this._scratch = new THREE.Box3();
  }

  addSolid(box, { blocks = ['player', 'bullet', 'projectile'], enabled = true } = {}) {
    const solid = {
      id: ++this._solidId,
      box: box.clone(),
      blocks: new Set(blocks),
      enabled,
      delta: new THREE.Vector3(),
      linked: null,
    };
    this.solids.push(solid);
    return solid;
  }

  addTrigger(box, { kind = 'generic', data = {}, enabled = true, tags = ['player'] } = {}) {
    const trigger = {
      id: ++this._triggerId,
      box: box.clone(),
      kind,
      data,
      enabled,
      tags,
      linked: null,
    };
    this.triggers.push(trigger);
    return trigger;
  }

  removeSolid(solid) {
    const index = this.solids.indexOf(solid);
    if (index >= 0) this.solids.splice(index, 1);
  }

  clear() {
    this.solids.length = 0;
    this.triggers.length = 0;
  }

  _aabbFor(pos, radius, height) {
    return new THREE.Box3(
      new THREE.Vector3(pos.x - radius, pos.y, pos.z - radius),
      new THREE.Vector3(pos.x + radius, pos.y + height, pos.z + radius),
    );
  }

  querySolids(aabb, tag, out = []) {
    out.length = 0;
    for (const solid of this.solids) {
      if (!solid.enabled || !solid.blocks.has(tag)) continue;
      if (aabb.intersectsBox(solid.box)) out.push(solid);
    }
    return out;
  }

  collidesAt(x, y, z, radius, height, tag = 'player') {
    const aabb = this._scratch.set(
      new THREE.Vector3(x - radius, y, z - radius),
      new THREE.Vector3(x + radius, y + height, z + radius),
    );
    for (const solid of this.solids) {
      if (!solid.enabled || !solid.blocks.has(tag)) continue;
      if (aabb.intersectsBox(solid.box)) return true;
    }
    return false;
  }

  triggersAt(aabb) {
    return this.triggers.filter((trigger) => trigger.enabled && trigger.box.intersectsBox(aabb));
  }

  /**
   * Slab ray/box test. Returns entry distance and a rough normal.
   */
  raycast(origin, direction, maxDistance = 100, tag = 'bullet') {
    let nearest = null;
    for (const solid of this.solids) {
      if (!solid.enabled || !solid.blocks.has(tag)) continue;
      const hit = this._rayBox(origin, direction, solid.box, maxDistance);
      if (!hit) continue;
      if (!nearest || hit.distance < nearest.distance) {
        nearest = { ...hit, solid };
      }
    }
    return nearest;
  }

  _rayBox(origin, direction, box, maxDistance) {
    let tmin = 0;
    let tmax = maxDistance;
    let normalAxis = -1;
    let normalSign = 0;
    for (let axis = 0; axis < 3; axis++) {
      const o = axis === 0 ? origin.x : axis === 1 ? origin.y : origin.z;
      const d = axis === 0 ? direction.x : axis === 1 ? direction.y : direction.z;
      const min = axis === 0 ? box.min.x : axis === 1 ? box.min.y : box.min.z;
      const max = axis === 0 ? box.max.x : axis === 1 ? box.max.y : box.max.z;
      if (Math.abs(d) < 1e-9) {
        if (o < min || o > max) return null;
        continue;
      }
      let t1 = (min - o) / d;
      let t2 = (max - o) / d;
      let sign = -1;
      if (t1 > t2) {
        [t1, t2] = [t2, t1];
        sign = 1;
      }
      if (t1 > tmin) {
        tmin = t1;
        normalAxis = axis;
        normalSign = sign;
      }
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }
    if (tmin < 0 || tmin > maxDistance) return null;
    const normal = new THREE.Vector3();
    if (normalAxis === -1) {
      normal.copy(direction).multiplyScalar(-1);
    } else {
      normal.setComponent(normalAxis, normalSign);
    }
    return {
      distance: tmin,
      point: origin.clone().addScaledVector(direction, tmin),
      normal,
    };
  }

  lineOfSight(from, to, tag = 'bullet') {
    const dir = TMP_A.subVectors(to, from);
    const distance = dir.length();
    if (distance < 0.0001) return true;
    dir.multiplyScalar(1 / distance);
    const hit = this.raycast(from, dir, distance - 0.02, tag);
    return !hit;
  }

  /**
   * Body movement with substepping, step-up, sliding and moving-platform carry.
   * Called at a fixed timestep by the session for locally simulated players.
   */
  moveBody(body, input, dt) {
    dataResetBodyFrame(body);
    if (input.carry && body.groundSolid?.delta) {
      body.pos.add(body.groundSolid.delta);
    }

    const wish = TMP_A.set(input.wishX || 0, 0, input.wishZ || 0);
    const wishLen = Math.hypot(wish.x, wish.z);
    if (wishLen > 1) wish.multiplyScalar(1 / wishLen);
    const moving = wishLen > 0.01;
    const sprint = Boolean(input.sprint) && !body.crouch;
    const baseSpeed = body.crouch ? 4.3 : sprint ? 10.4 : 7.35;
    const wasGrounded = body.grounded;
    const gravityScale = body.gravityScale || 1;

    // Jump buffering / coyote time.
    if (input.jumpPressed) body.jumpBuffer = 0.13;
    body.jumpBuffer = Math.max(0, body.jumpBuffer - dt);
    if (body.grounded) body.coyote = 0.12;
    if (body.jumpBuffer > 0 && body.coyote > 0) {
      body.vel.y = 8.85 * (body.jumpScale || 1);
      body.grounded = false;
      body.groundSolid = null;
      body.coyote = 0;
      body.jumpBuffer = 0;
      body.justJumped = true;
    }

    // Horizontal acceleration.
    if (body.grounded) {
      const accel = 74;
      if (moving && !input.noMove) {
        body.vel.x = moveTowards(body.vel.x, wish.x * baseSpeed, accel * dt);
        body.vel.z = moveTowards(body.vel.z, wish.z * baseSpeed, accel * dt);
      } else {
        const friction = Math.exp(-9.5 * dt);
        body.vel.x *= friction;
        body.vel.z *= friction;
      }
    } else if (moving && !input.noMove) {
      const current = Math.hypot(body.vel.x, body.vel.z);
      const maxAir = Math.max(baseSpeed, current);
      const accel = 21;
      body.vel.x += wish.x * accel * dt;
      body.vel.z += wish.z * accel * dt;
      const next = Math.hypot(body.vel.x, body.vel.z);
      if (next > maxAir) {
        body.vel.x *= maxAir / next;
        body.vel.z *= maxAir / next;
      }
    }

    // Gravity / updraft.
    body.vel.y -= GRAVITY * gravityScale * dt;
    body.vel.y += (body.updraft || 0) * dt;
    body.vel.y = THREE.MathUtils.clamp(body.vel.y, -46, 30);

    // Horizontal movement, axis separated with step-up.
    this._moveHorizontal(body, 'x', body.vel.x * dt);
    this._moveHorizontal(body, 'z', body.vel.z * dt);

    // Vertical movement.
    const height = bodyHeight(body);
    body.grounded = false;
    body.groundSolid = null;
    const fallSpeed = body.vel.y;
    const moved = this._moveVertical(body, height, body.vel.y * dt);
    if (!moved) body.vel.y = 0;
    if (body.grounded) {
      body.coyote = 0.12;
      if (!wasGrounded && fallSpeed < -4) {
        body.justLanded = true;
        body.landSpeed = Math.abs(fallSpeed);
      }
    } else {
      body.coyote = Math.max(0, body.coyote - dt);
    }
  }

  _moveHorizontal(body, axis, amount) {
    if (Math.abs(amount) < 1e-7) return;
    const height = bodyHeight(body);
    const steps = Math.min(8, Math.ceil(Math.abs(amount) / 0.18));
    const step = amount / steps;
    for (let i = 0; i < steps; i++) {
      const before = body.pos[axis];
      body.pos[axis] += step;
      const aabb = this._aabbFor(body.pos, body.radius, height);
      const collisions = this.querySolids(aabb, 'player');
      if (!collisions.length) continue;

      // Step up onto low ledges when grounded.
      let stepped = false;
      if (body.grounded || body.coyote > 0) {
        const candidates = collisions
          .map((solid) => solid.box.max.y)
          .filter((top) => top > body.pos.y + 0.008 && top <= body.pos.y + STEP_HEIGHT + 0.02)
          .sort((a, b) => a - b);
        for (const top of candidates) {
          const testY = top + EPS;
          if (!this.collidesAt(body.pos.x, testY, body.pos.z, body.radius, height, 'player')) {
            body.pos.y = testY;
            const testAABB = this._aabbFor(body.pos, body.radius, height);
            if (!this.querySolids(testAABB, 'player').length) {
              stepped = true;
              break;
            }
          }
        }
      }
      if (stepped) continue;
      body.pos[axis] = before;
      body.vel[axis] = 0;
      break;
    }
  }

  _moveVertical(body, height, amount) {
    if (Math.abs(amount) < 1e-7) {
      // Still detect the floor so grounded stays stable while standing.
      const aabb = this._aabbFor(body.pos, body.radius, height);
      const collisions = this.querySolids(aabb, 'player');
      return !collisions.length;
    }
    const steps = Math.min(12, Math.ceil(Math.abs(amount) / 0.15));
    const step = amount / steps;
    for (let i = 0; i < steps; i++) {
      body.pos.y += step;
      const aabb = this._aabbFor(body.pos, body.radius, height);
      const collisions = this.querySolids(aabb, 'player');
      if (!collisions.length) continue;
      if (step < 0) {
        let top = -Infinity;
        let ground = null;
        for (const solid of collisions) {
          if (solid.box.max.y > top) {
            top = solid.box.max.y;
            ground = solid;
          }
        }
        body.pos.y = top + EPS;
        body.vel.y = 0;
        body.grounded = true;
        body.groundSolid = ground;
      } else {
        let bottom = Infinity;
        for (const solid of collisions) {
          if (solid.box.min.y < bottom) bottom = solid.box.min.y;
        }
        body.pos.y = bottom - height - EPS;
        body.vel.y = 0;
      }
      return false;
    }
    return true;
  }

  tryUncrouch(body) {
    if (!body.crouch) return true;
    if (this.collidesAt(body.pos.x, body.pos.y, body.pos.z, body.radius, PLAYER_HEIGHT, 'player')) {
      return false;
    }
    body.crouch = false;
    return true;
  }

  setCrouch(body, crouch) {
    if (crouch) {
      body.crouch = true;
      return true;
    }
    return this.tryUncrouch(body);
  }
}

function dataResetBodyFrame(body) {
  body.justJumped = false;
  body.justLanded = false;
  body.landSpeed = 0;
}

function moveTowards(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}
