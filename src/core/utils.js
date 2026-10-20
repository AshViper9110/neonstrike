export const TAU = Math.PI * 2;

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, value) => (a === b ? 0 : (value - a) / (b - a));
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
export const smoothstep = (t) => t * t * (3 - 2 * t);

export function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randInt(min, max) {
  return Math.floor(randRange(min, max + 1));
}

export function choice(list) {
  if (!list?.length) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

export function sanitizeName(raw, fallback = 'PLAYER') {
  const cleaned = String(raw ?? '')
    .replace(/[<>&"'`\\/\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12);
  return cleaned || fallback;
}

export function sanitizeRoomCode(raw) {
  return String(raw ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);
}

export function isValidRoomCode(code) {
  return /^[A-Z0-9]{1,4}$/.test(code);
}

export function formatClock(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatPing(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '--';
  return String(Math.round(ms));
}

export function makeId(prefix = 'p') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function angleDelta(from, to) {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

export function moveTowards(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}

export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function safeNumber(value, fallback = 0, min = -Infinity, max = Infinity) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return clamp(n, min, max);
}

export function nowMs() {
  return (typeof performance !== 'undefined' ? performance.now() : Date.now());
}

export function isTouchDevice() {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

export const PLAYER_COLORS = ['#00f6ff', '#ff2bd6', '#a6ff4d', '#ffc857', '#8a5bff', '#ff7a45', '#4dd2ff', '#ff5e9c'];

export function colorWithAlpha(hex, alpha) {
  const clean = String(hex).replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = Number.parseInt(full, 16);
  if (!Number.isFinite(num)) return `rgba(0, 246, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
