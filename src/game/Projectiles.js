import * as THREE from 'three';
import { clamp, randRange } from '../core/utils.js';

const PROJECTILE_TAG = 'projectile';

function segmentSphereDistanceSq(a, b, center) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const abz = b.z - a.z;
  const acx = center.x - a.x;
  const acy = center.y - a.y;
  const acz = center.z - a.z;
  const abLenSq = abx * abx + aby * aby + abz * abz;
  let t = 0;
  if (abLenSq > 1e-8) t = clamp((acx * abx + acy * aby + acz * abz) / abLenSq, 0, 1);
  const dx = acx - abx * t;
  const dy = acy - aby * t;
  const dz = acz - abz * t;
  return { distSq: dx * dx + dy * dy + dz * dz, t };
}

export class ProjectileSystem {
  constructor(session) {
    this.session = session;
    this.scene = session.scene;
    this.physics = session.physics;
    this.effects = session.effects;
    this.projectiles = [];
    this.visualExplosions = new Set();
    this.nextId = 1;
    this._step = new THREE.Vector3();
    this._stepDir = new THREE.Vector3();
    this._forward = new THREE.Vector3(0, 0, -1);
  }

  createId() {
    return `rk_${Date.now().toString(36)}_${this.nextId++}`;
  }

  _buildMesh(color) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18202c,
      metalness: 0.7,
      roughness: 0.35,
      emissive: color,
      emissiveIntensity: 0.45,
      flatShading: true,
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.42, 8), bodyMat);
    body.rotation.x = Math.PI / 2;
    body.position.z = 0.02;
    group.add(body);
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.095, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x2b2318, metalness: 0.7, roughness: 0.3, flatShading: true }),
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -0.27;
    group.add(nose);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 6, 4),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    glow.position.z = 0.28;
    group.add(glow);
    group.userData.glow = glow;
    group.userData.materials = [bodyMat, nose.material, glow.material];
    group.userData.geometries = [body.geometry, nose.geometry, glow.geometry];
    return group;
  }

  spawn({ id = null, ownerId, origin, direction, weapon, authority = true, startPos = null }) {
    const def = weapon;
    const color = new THREE.Color(def.color).getHex();
    const mesh = this._buildMesh(color);
    mesh.position.copy(startPos || origin);
    const dir = direction.clone().normalize();
    const speed = def.projectile.speed ?? 38;
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    this.scene.add(mesh);
    const projectile = {
      id: id || this.createId(),
      ownerId,
      def,
      direction: dir,
      velocity: dir.clone().multiplyScalar(speed),
      speed,
      gravity: def.projectile.gravity ?? 0,
      ttl: def.projectile.ttl ?? 6,
      age: 0,
      authority,
      pos: mesh.position.clone(),
      prev: mesh.position.clone(),
      mesh,
      color,
      directHit: null,
      dead: false,
      trailTimer: 0,
    };
    this.projectiles.push(projectile);
    if (authority) {
      this.session.netSendProjectile({
        action: 'spawn',
        id: projectile.id,
        weapon: def.id,
        ownerId,
        origin: [origin.x, origin.y, origin.z],
        dir: [dir.x, dir.y, dir.z],
      });
    }
    return projectile;
  }

  spawnRemote({ id, ownerId, origin, dir, weapon }) {
    const def = this.session.getWeaponDef(weapon);
    if (!def?.projectile) return null;
    const originV = new THREE.Vector3(...origin);
    const dirV = new THREE.Vector3(...dir);
    return this.spawn({
      id,
      ownerId,
      origin: originV,
      direction: dirV,
      weapon: def,
      authority: false,
      startPos: originV,
    });
  }

  detonateRemote(id, posArray) {
    const pos = new THREE.Vector3(...posArray);
    const projectile = this.projectiles.find((p) => p.id === id && !p.dead);
    if (projectile) {
      this._explode(projectile, pos, null, true);
      return;
    }
    if (this.visualExplosions.has(id)) return;
    this.visualExplosions.add(id);
    if (this.visualExplosions.size > 60) this.visualExplosions.delete(this.visualExplosions.values().next().value);
    this.effects.explosion(pos, 0xffb347, 4.2);
    this.session.playExplosionAudio(pos, true);
  }

  update(dt) {
    for (const projectile of [...this.projectiles]) {
      if (projectile.dead) continue;
      projectile.age += dt;
      projectile.trailTimer -= dt;
      if (projectile.age > projectile.ttl) {
        this._explode(projectile, projectile.pos, null, !projectile.authority);
        continue;
      }
      projectile.prev.copy(projectile.pos);
      projectile.velocity.y -= (projectile.gravity || 0) * dt;
      const step = this._step.copy(projectile.velocity).multiplyScalar(dt);
      const stepDistance = step.length();
      if (stepDistance < 1e-6) continue;
      const stepDir = this._stepDir.copy(step).divideScalar(stepDistance);
      projectile.direction.copy(stepDir);
      const next = projectile.pos.clone().add(step);
      const worldHit = this.physics.raycast(projectile.pos, stepDir, stepDistance + 0.15, PROJECTILE_TAG);

      let directTarget = null;
      let contactPosition = null;
      if (projectile.authority) {
        const targets = this.session.getDamageableTargets(projectile.ownerId);
        let nearestT = Infinity;
        for (const entry of targets) {
          const state = entry.state;
          if (!state.alive) continue;
          const centerY = state.pos.y + (state.crouch ? 0.8 : 1.0);
          const bodyCenter = new THREE.Vector3(state.pos.x, centerY, state.pos.z);
          const bodyRadius = state.crouch ? 0.55 : 0.58;
          const headCenter = new THREE.Vector3(state.pos.x, state.pos.y + (state.crouch ? 1.3 : 1.58), state.pos.z);
          for (const [center, radius] of [[bodyCenter, bodyRadius], [headCenter, 0.33]]) {
            const { distSq, t } = segmentSphereDistanceSq(projectile.prev, next, center);
            if (distSq <= radius * radius && t < nearestT) {
              nearestT = t;
              directTarget = state;
              contactPosition = projectile.prev.clone().lerp(next, t);
            }
          }
        }
        if (directTarget && (!worldHit || nearestT * stepDistance <= worldHit.distance)) {
          this._explode(projectile, contactPosition || next, directTarget, false);
          continue;
        }
      }

      if (worldHit) {
        const hitPos = projectile.prev.clone().addScaledVector(projectile.direction, Math.max(0, worldHit.distance - 0.05));
        this._explode(projectile, hitPos, null, !projectile.authority);
        continue;
      }

      projectile.pos.copy(next);
      projectile.mesh.position.copy(next);
      projectile.mesh.quaternion.setFromUnitVectors(this._forward, stepDir);
      const glow = projectile.mesh.userData.glow;
      if (glow) {
        const s = 0.8 + Math.sin(projectile.age * 38) * 0.25;
        glow.scale.setScalar(s);
      }
      if (projectile.trailTimer <= 0) {
        projectile.trailTimer = 0.035;
        this.effects._particles(next, projectile.color, {
          count: 1,
          speed: 0.4,
          gravity: -0.2,
          size: 0.16,
          life: 0.35,
          spread: 0.5,
          normal: projectile.direction.clone().multiplyScalar(-1),
        });
      }
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }

  _explode(projectile, position, directTarget, visualOnly) {
    if (projectile.dead) return;
    projectile.dead = true;
    this._disposeMesh(projectile.mesh);
    const splashRadius = projectile.def.projectile.splashRadius ?? 4;
    this.effects.explosion(position, 0xffa64d, splashRadius);
    this.session.playExplosionAudio(position, !projectile.authority);
    this.session.onProjectileDetonated?.(projectile, position, directTarget, visualOnly);
    if (projectile.authority) {
      this.session.netSendProjectile({
        action: 'explode',
        id: projectile.id,
        pos: [position.x, position.y, position.z],
      });
      this.session.handleProjectileDamage(projectile, position, directTarget);
    } else {
      this.visualExplosions.add(projectile.id);
    }
  }

  _disposeMesh(mesh) {
    mesh.removeFromParent();
    for (const geo of mesh.userData.geometries || []) geo.dispose();
    for (const mat of mesh.userData.materials || []) mat.dispose();
  }

  clear() {
    for (const projectile of this.projectiles) this._disposeMesh(projectile.mesh);
    this.projectiles.length = 0;
    this.visualExplosions.clear();
  }
}
