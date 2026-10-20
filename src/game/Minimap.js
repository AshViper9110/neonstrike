import { clamp } from '../core/utils.js';

const MINIMAP_PADDING = 30;

/**
 * Top-down tactical map drawn from the stage's declarative minimap data.
 * Everything is rendered into a fixed 360x360 backing canvas so line widths
 * remain crisp while CSS scales it down for the HUD.
 */
export class Minimap {
  constructor(canvas, session) {
    this.canvas = canvas;
    this.session = session;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.accum = 0;
    this.interval = 1 / 24;
  }

  update(dt) {
    this.accum += dt;
    if (this.accum < this.interval) return;
    this.accum = 0;
    this.draw();
  }

  _map(x, z) {
    const bounds = this.session.stage.bounds;
    const w = bounds.maxX - bounds.minX;
    const d = bounds.maxZ - bounds.minZ;
    const innerW = this.width - MINIMAP_PADDING * 2;
    const innerH = this.height - MINIMAP_PADDING * 2;
    const scale = Math.min(innerW / w, innerH / d);
    return {
      x: this.width / 2 + (x - (bounds.minX + bounds.maxX) / 2) * scale,
      y: this.height / 2 + (z - (bounds.minZ + bounds.maxZ) / 2) * scale,
      scale,
    };
  }

  draw() {
    const g = this.ctx;
    if (!g) return;
    const { width: w, height: h } = this;
    g.clearRect(0, 0, w, h);

    // Backdrop.
    const bg = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.65);
    bg.addColorStop(0, 'rgba(4, 16, 27, 0.92)');
    bg.addColorStop(1, 'rgba(2, 5, 13, 0.94)');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    const bounds = this.session.stage.bounds;
    const map = this._map(bounds.minX, bounds.minZ);
    const mapMax = this._map(bounds.maxX, bounds.maxZ);

    // Grid.
    g.save();
    g.strokeStyle = 'rgba(0, 246, 255, 0.08)';
    g.lineWidth = 1;
    for (let i = 1; i < 8; i += 1) {
      const t = i / 8;
      const x = map.x + (mapMax.x - map.x) * t;
      const y = map.y + (mapMax.y - map.y) * t;
      g.beginPath();
      g.moveTo(x, map.y);
      g.lineTo(x, mapMax.y);
      g.stroke();
      g.beginPath();
      g.moveTo(map.x, y);
      g.lineTo(mapMax.x, y);
      g.stroke();
    }
    g.strokeStyle = 'rgba(0, 246, 255, 0.22)';
    g.strokeRect(map.x, map.y, mapMax.x - map.x, mapMax.y - map.y);
    g.restore();

    // Arena geometry. Boxes are already filtered to gameplay-relevant heights.
    for (const box of this.session.stage.minimapBoxes) {
      const a = this._map(box.x - box.w / 2, box.z - box.d / 2);
      const b = this._map(box.x + box.w / 2, box.z + box.d / 2);
      const color = typeof box.color === 'number'
        ? `#${box.color.toString(16).padStart(6, '0')}`
        : String(box.color || '#00f6ff');
      g.fillStyle = `${color}22`;
      g.strokeStyle = `${color}66`;
      g.lineWidth = 1;
      g.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      g.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
    }

    // Gimmick markers.
    for (const marker of this.session.stage.minimapMarkers) {
      if (marker.type === 'platform') continue;
      const point = this._map(marker.x, marker.z);
      const color = typeof marker.color === 'number'
        ? `#${marker.color.toString(16).padStart(6, '0')}`
        : String(marker.color || '#00f6ff');
      g.save();
      g.fillStyle = `${color}cc`;
      g.strokeStyle = color;
      g.shadowColor = color;
      g.shadowBlur = 7;
      g.lineWidth = 1.4;
      if (marker.type === 'health') {
        g.beginPath();
        g.arc(point.x, point.y, 3.4, 0, Math.PI * 2);
        g.fill();
      } else if (marker.type === 'teleport') {
        g.strokeRect(point.x - 4, point.y - 4, 8, 8);
      } else if (marker.type === 'jump') {
        g.beginPath();
        g.moveTo(point.x, point.y - 5);
        g.lineTo(point.x + 4.5, point.y + 3);
        g.lineTo(point.x - 4.5, point.y + 3);
        g.closePath();
        g.fill();
      } else if (marker.type === 'laser') {
        g.fillRect(point.x - 5, point.y - 1, 10, 2);
      } else if (marker.type === 'gate') {
        g.beginPath();
        g.moveTo(point.x - 5, point.y);
        g.lineTo(point.x + 5, point.y);
        g.stroke();
      } else if (marker.type === 'gravity') {
        g.beginPath();
        g.arc(point.x, point.y, 6, 0, Math.PI * 2);
        g.stroke();
      }
      g.restore();
    }

    // Health pickups still available.
    for (const pickup of this.session.stage.pickups) {
      if (!pickup.available) continue;
      const point = this._map(pickup.pos.x, pickup.pos.z);
      g.fillStyle = 'rgba(166, 255, 77, 0.95)';
      g.fillRect(point.x - 1.5, point.y - 4, 3, 8);
      g.fillRect(point.x - 4, point.y - 1.5, 8, 3);
    }

    // Remote players.
    for (const record of this.session.records.values()) {
      if (record.isLocal || !record.alive) continue;
      const point = this._map(record.pos.x, record.pos.z);
      g.save();
      g.fillStyle = record.color;
      g.shadowColor = record.color;
      g.shadowBlur = 8;
      g.beginPath();
      g.arc(point.x, point.y, record.isBot ? 4.3 : 5.2, 0, Math.PI * 2);
      g.fill();
      if (record.isBot) {
        g.strokeStyle = 'rgba(0,0,0,0.8)';
        g.lineWidth = 1;
        g.stroke();
      }
      g.restore();
    }

    // Local player arrow + cone.
    const local = this.session.localRecord;
    if (local) {
      const point = this._map(local.pos.x, local.pos.z);
      const yaw = local.yaw || 0;
      g.save();
      g.translate(point.x, point.y);
      g.rotate(-yaw);
      const cone = g.createLinearGradient(0, 0, 0, -34);
      cone.addColorStop(0, 'rgba(0, 246, 255, 0.24)');
      cone.addColorStop(1, 'rgba(0, 246, 255, 0)');
      g.fillStyle = cone;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(-20, -34);
      g.lineTo(20, -34);
      g.closePath();
      g.fill();
      g.fillStyle = local.alive ? '#eaffff' : '#ff3b5c';
      g.strokeStyle = '#00f6ff';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(0, -7.5);
      g.lineTo(5.5, 5);
      g.lineTo(0, 2.5);
      g.lineTo(-5.5, 5);
      g.closePath();
      g.fill();
      g.stroke();
      g.restore();
    }

    // North marker.
    g.save();
    g.fillStyle = 'rgba(0, 246, 255, 0.8)';
    g.font = '600 13px Orbitron, sans-serif';
    g.textAlign = 'center';
    g.fillText('N', w / 2, 19);
    g.restore();
  }

  dispose() {
    this.ctx = null;
    this.session = null;
  }
}
