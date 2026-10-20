import * as THREE from 'three';
import { StageBase } from './StageBase.js';
import { NEON_COLORS } from './stageKit.js';
import './modules/EnvironmentModule.js';
import './modules/FloorModule.js';
import './modules/BlocksModule.js';
import './modules/SpawnModule.js';
import './modules/JumpPadModule.js';
import './modules/TeleporterModule.js';
import './modules/MovingPlatformModule.js';
import './modules/GateModule.js';
import './modules/LaserFenceModule.js';
import './modules/GravityZoneModule.js';
import './modules/HealthPickupModule.js';
import './modules/DecorModule.js';

/**
 * NEON FOUNDRY
 * A symmetrical two-level arena built entirely from stage modules.
 */
export class NeonFoundry extends StageBase {
  constructor() {
    super({ id: 'neon-foundry', name: 'NEON FOUNDRY', subtitle: 'SECTOR 07 // P2P ARENA' });
  }

  build(_ctx) {
    this.addModule({ type: 'environment' });
    this.addModule({ type: 'floor' });

    const cyan = NEON_COLORS.cyan;
    const magenta = NEON_COLORS.magenta;
    const violet = NEON_COLORS.violet;
    const lime = NEON_COLORS.lime;

    const boxes = [];
    const lines = [];

    // Outer walls.
    for (const x of [-32.5, 32.5]) {
      boxes.push({
        pos: [x, 9, 0], size: [1, 18, 65], color: x < 0 ? cyan : magenta,
        baseColor: 0x050912, edge: true, minimap: false, glowCap: true, metalness: 0.72,
      });
    }
    for (const z of [-32.5, 32.5]) {
      boxes.push({
        pos: [0, 9, z], size: [65, 18, 1], color: z < 0 ? magenta : cyan,
        baseColor: 0x050912, edge: true, minimap: false, glowCap: true, metalness: 0.72,
      });
    }
    // Wall light bands.
    for (const y of [2.6, 6.2, 10.2, 14.2]) {
      lines.push({ from: [-31.3, y, -31.95], to: [31.3, y, -31.95], color: y === 6.2 ? magenta : cyan, thickness: 0.055, opacity: 0.34 });
      lines.push({ from: [-31.3, y, 31.95], to: [31.3, y, 31.95], color: y === 6.2 ? cyan : magenta, thickness: 0.055, opacity: 0.34 });
      lines.push({ from: [-31.95, y, -31.3], to: [-31.95, y, 31.3], color: cyan, thickness: 0.055, opacity: 0.3 });
      lines.push({ from: [31.95, y, -31.3], to: [31.95, y, 31.3], color: magenta, thickness: 0.055, opacity: 0.3 });
    }

    // Corner monoliths.
    for (const [x, z] of [[-28, -28], [28, -28], [-28, 28], [28, 28]]) {
      boxes.push({
        pos: [x, 7, z], size: [2.6, 14, 2.6], color: x * z > 0 ? magenta : cyan,
        baseColor: 0x070b16, minimap: false, glowCap: true, metalness: 0.8, roughness: 0.35,
      });
      lines.push({ from: [x, 0.6, z + 1.33], to: [x, 13.2, z + 1.33], color: x * z > 0 ? magenta : cyan, thickness: 0.05, opacity: 0.7 });
    }

    // Central raised platform.
    boxes.push({
      pos: [0, 0.65, 0], size: [14, 1.3, 14], color: cyan,
      baseColor: 0x08111d, glowCap: true, metalness: 0.7, roughness: 0.4,
    });
    boxes.push({ pos: [0, 0.12, 0], size: [18, 0.24, 18], color: violet, baseColor: 0x070a14, glowCap: false, minimap: false, edge: true });
    // Stairs on all four sides (3 steps up to the platform).
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const top = 0.33 * (i + 1);
        const near = 7.0 + 0.55 + i * 1.1;
        boxes.push({
          pos: [0, top / 2, side * near], size: [5, top, 1.1],
          color: i % 2 ? cyan : violet, baseColor: 0x0a101c, edge: true, minimap: false, metalness: 0.64,
        });
        boxes.push({
          pos: [side * near, top / 2, 0], size: [1.1, top, 5],
          color: i % 2 ? violet : cyan, baseColor: 0x0a101c, edge: true, minimap: false, metalness: 0.64,
        });
      }
    }
    // Platform cover.
    boxes.push({ pos: [-4.6, 1.75, 0], size: [1.3, 0.9, 2.6], color: magenta, baseColor: 0x0a0d18, glowCap: true });
    boxes.push({ pos: [4.6, 1.75, 0], size: [1.3, 0.9, 2.6], color: cyan, baseColor: 0x0a0d18, glowCap: true });
    boxes.push({ pos: [0, 1.75, -4.6], size: [2.6, 0.9, 1.3], color: cyan, baseColor: 0x0a0d18, glowCap: true });

    // Catwalks.
    for (const side of [-1, 1]) {
      boxes.push({
        pos: [side * 24, 4.0, 0], size: [4.6, 0.4, 40],
        color: side < 0 ? cyan : magenta, baseColor: 0x08101a, glowCap: true, metalness: 0.75,
      });
      // Outer rail.
      boxes.push({
        pos: [side * 26.22, 4.75, 0], size: [0.14, 1.1, 40],
        color: side < 0 ? cyan : magenta, baseColor: 0x09111d, edge: true, minimap: false,
      });
      // End rails.
      for (const z of [-20, 20]) {
        boxes.push({
          pos: [side * 24, 4.75, z], size: [4.6, 1.1, 0.14],
          color: side < 0 ? cyan : magenta, baseColor: 0x09111d, edge: true, minimap: false,
        });
      }
      // Support pylons.
      for (const z of [-15, 0, 15]) {
        boxes.push({
          pos: [side * 24, 2.0, z], size: [0.65, 4.0, 0.65],
          color: side < 0 ? magenta : cyan, baseColor: 0x080e18, edge: true, minimap: false, metalness: 0.8,
        });
      }
      // Access landings for the elevators.
      boxes.push({
        pos: [side * 21.5, 4.05, -8], size: [1.7, 0.3, 3.2],
        color: lime, baseColor: 0x08110d, glowCap: true, metalness: 0.7,
      });
      // Crates on the catwalk.
      boxes.push({
        pos: [side * 24, 4.9, 8], size: [2.8, 1.4, 1.4],
        color: lime, baseColor: 0x0a0f10, glowCap: true,
      });
      boxes.push({
        pos: [side * 24, 4.8, -14], size: [2.2, 1.2, 1.2],
        color: side < 0 ? lime : magenta, baseColor: 0x0d0c15, glowCap: true,
      });
    }

    // Floor cover and crates.
    const cover = [
      { pos: [0, 0.9, -17], size: [5, 1.8, 1.2], color: magenta },
      { pos: [0, 0.9, 17], size: [5, 1.8, 1.2], color: cyan },
      { pos: [-12, 0.75, 0], size: [1.2, 1.5, 5.6], color: cyan },
      { pos: [12, 0.75, 0], size: [1.2, 1.5, 5.6], color: magenta },
      { pos: [-18, 0.9, 18], size: [2.4, 1.8, 2.4], color: violet },
      { pos: [18, 0.9, -18], size: [2.4, 1.8, 2.4], color: violet },
      { pos: [18, 0.9, 18], size: [2.4, 1.8, 2.4], color: cyan },
      { pos: [10, 0.55, 9], size: [2.2, 1.1, 2.2], color: lime },
      { pos: [-9, 0.55, -10], size: [2.2, 1.1, 2.2], color: lime },
      { pos: [-22, 0.4, 0], size: [2.4, 0.8, 4.5], color: magenta },
      { pos: [22, 0.4, 0], size: [2.4, 0.8, 4.5], color: cyan },
      // Low-gravity platform.
      { pos: [-15, 4.7, -20], size: [3.6, 0.3, 3.6], color: cyan, glowCap: true },
      { pos: [-15, 4.55, -20], size: [1.2, 1.2, 1.2], color: violet },
    ];
    for (const c of cover) {
      boxes.push({
        ...c, baseColor: 0x080d16, edge: true, glowCap: c.glowCap ?? true, metalness: 0.65, roughness: 0.42,
      });
    }

    // Angled-ish decorative rails around the floor.
    for (const side of [-1, 1]) {
      lines.push({ from: [side * 26.5, 4.25, -19.5], to: [side * 26.5, 4.25, 19.5], color: side < 0 ? cyan : magenta, thickness: 0.045, opacity: 0.75 });
      lines.push({ from: [side * 21.7, 4.25, -19.5], to: [side * 21.7, 4.25, 19.5], color: side < 0 ? cyan : magenta, thickness: 0.035, opacity: 0.35 });
    }

    this.addModule({ type: 'blocks', name: 'foundry-structure', boxes, lines, lights: [
      { pos: [-24, 6, -24], color: cyan, intensity: 100, distance: 24 },
      { pos: [24, 6, 24], color: magenta, intensity: 100, distance: 24 },
      { pos: [0, 4, -26], color: violet, intensity: 80, distance: 20 },
    ] });

    this.addModule({
      type: 'spawn',
      spawns: [
        { x: 0, z: 28, yaw: 0 },
        { x: 0, z: -28, yaw: Math.PI },
        { x: 28, z: 0, yaw: Math.PI / 2 },
        { x: -28, z: 0, yaw: -Math.PI / 2 },
        { x: 20, z: 20, yaw: Math.PI / 4 },
        { x: -20, z: -20, yaw: -3 * Math.PI / 4 },
        { x: 20, z: -20, yaw: 3 * Math.PI / 4 },
        { x: -20, z: 20, yaw: -Math.PI / 4 },
        { x: 30, z: 14, yaw: Math.PI / 2 },
        { x: -30, z: -14, yaw: -Math.PI / 2 },
      ],
      waypoints: [
        [0, 13], [0, -13], [13, 0], [-13, 0],
        [15, 15], [-15, 15], [15, -15], [-15, -15],
        [22, 6], [-22, 6], [22, -6], [-22, -6],
        [6, 22], [-6, 22], [6, -22], [-6, -22],
        [0, 24], [0, -24],
      ],
    });

    this.addModule({
      type: 'movingPlatform',
      from: [19.2, 0.5, -8],
      to: [19.2, 4.05, -8],
      size: [3.2, 0.35, 3.2],
      speed: 0.22,
      phase: 0,
      color: lime,
    });
    this.addModule({
      type: 'movingPlatform',
      from: [-19.2, 0.5, 8],
      to: [-19.2, 4.05, 8],
      size: [3.2, 0.35, 3.2],
      speed: 0.22,
      phase: 0.5,
      color: lime,
    });

    this.addModule({ type: 'jumpPad', pos: [-14, 0.02, 18], power: 17.0, color: cyan });
    this.addModule({ type: 'jumpPad', pos: [14, 0.02, -18], power: 17.0, color: magenta });

    this.addModule({
      type: 'teleporter',
      channel: 'A',
      pads: [
        { x: -27, z: 27, y: 0, channel: 'A', label: 'A-1', sub: 'LINK ACTIVE', color: magenta },
        { x: 24, z: 17, y: 4.2, channel: 'A', label: 'A-2', sub: 'CATWALK', color: magenta },
        { x: 27, z: -27, y: 0, channel: 'B', label: 'B-1', sub: 'LINK ACTIVE', color: cyan },
        { x: -24, z: -17, y: 4.2, channel: 'B', label: 'B-2', sub: 'CATWALK', color: cyan },
      ],
    });

    this.addModule({
      type: 'gate',
      pos: [-7, 2.2, -12],
      width: 6,
      height: 4.4,
      axis: 'x',
      blocks: ['bullet', 'projectile'],
      color: magenta,
    });
    this.addModule({
      type: 'gate',
      pos: [7, 2.2, 12],
      width: 6,
      height: 4.4,
      axis: 'x',
      blocks: ['player'],
      color: cyan,
    });

    this.addModule({
      type: 'laserFence',
      pos: [-20, 1.9, 8],
      length: 8,
      height: 3.8,
      axis: 'z',
      phase: 0,
      onTime: 2.1,
      offTime: 1.7,
      warnTime: 0.55,
      damage: 15,
      color: '#ff3b5c',
    });
    this.addModule({
      type: 'laserFence',
      pos: [20, 1.9, -8],
      length: 8,
      height: 3.8,
      axis: 'z',
      phase: 1.9,
      onTime: 2.1,
      offTime: 1.7,
      warnTime: 0.55,
      damage: 15,
    });

    this.addModule({
      type: 'gravityZone',
      pos: [-15, 4.2, -20],
      size: [8, 8.4, 8],
      gravityScale: 0.32,
      updraft: 5.6,
      color: cyan,
    });

    this.addModule({
      type: 'healthPickup',
      items: [
        { x: 0, y: 2.45, z: 0, amount: 50, respawn: 20, radius: 1.6 },
        { x: -24, y: 5.15, z: 10, amount: 35, respawn: 16 },
        { x: 24, y: 5.15, z: -10, amount: 35, respawn: 16 },
        { x: -15, y: 5.6, z: -20, amount: 35, respawn: 18 },
        { x: 0, y: 0.95, z: -25, amount: 30, respawn: 14 },
        { x: 0, y: 0.95, z: 25, amount: 30, respawn: 14 },
      ],
    });

    this.addModule({
      type: 'decor',
      rings: [
        { pos: [0, 10.5, 0], radius: 9.5, color: cyan, opacity: 0.15, speed: 0.035 },
        { pos: [0, 11.4, 0], radius: 6.5, color: magenta, opacity: 0.2, speed: -0.05 },
        { pos: [0, 13, 0], radius: 4.0, color: violet, opacity: 0.24, speed: 0.08, rotation: [0.6, 0, 0] },
      ],
      signs: [
        { text: 'NEON FOUNDRY', sub: 'SECTOR 07 // FREE FOR ALL', pos: [0, 9.4, -31.2], width: 16, height: 4, color: '#00f6ff' },
        { text: 'NO SIGNAL', sub: 'NO MERCY // P2P COMBAT', pos: [31.2, 8.2, 0], width: 12, height: 3, rotation: [0, -Math.PI / 2, 0], color: '#ff2bd6' },
        { text: 'PHASE // GATES', sub: 'PLAYERS PASS · BULLETS PASS', pos: [-31.2, 8.2, 0], width: 12, height: 3, rotation: [0, Math.PI / 2, 0], color: '#a78bff' },
        { text: 'STAY MOVING', sub: 'LOW-G ELEVATION AHEAD', pos: [0, 8.2, 31.2], width: 13, height: 3.2, rotation: [0, Math.PI, 0], color: '#a6ff4d' },
      ],
      lines: [
        { from: [-30, 13.4, -20], to: [30, 13.4, -20], color: cyan, thickness: 0.03, opacity: 0.3 },
        { from: [-30, 13.4, 20], to: [30, 13.4, 20], color: magenta, thickness: 0.03, opacity: 0.3 },
        { from: [-20, 13.4, -30], to: [-20, 13.4, 30], color: violet, thickness: 0.03, opacity: 0.22 },
        { from: [20, 13.4, -30], to: [20, 13.4, 30], color: violet, thickness: 0.03, opacity: 0.22 },
      ],
    });
  }
}

export const neonFoundry = () => new NeonFoundry();
