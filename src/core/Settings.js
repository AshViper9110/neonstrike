import { EventBus } from './EventBus.js';
import { clamp, safeNumber } from './utils.js';

const STORAGE_KEY = 'neonstrike.settings.v1';

export const DEFAULT_SETTINGS = Object.freeze({
  sensitivity: 1.0,
  fov: 82,
  volume: 65,
  quality: 'high',
  showFps: false,
  ambientAudio: true,
});

function sanitize(raw = {}) {
  return {
    sensitivity: clamp(safeNumber(raw.sensitivity, DEFAULT_SETTINGS.sensitivity, 0.2, 3), 0.2, 3),
    fov: clamp(Math.round(safeNumber(raw.fov, DEFAULT_SETTINGS.fov, 65, 110)), 65, 110),
    volume: clamp(Math.round(safeNumber(raw.volume, DEFAULT_SETTINGS.volume, 0, 100)), 0, 100),
    quality: raw.quality === 'low' ? 'low' : 'high',
    showFps: Boolean(raw.showFps),
    ambientAudio: raw.ambientAudio !== false,
  };
}

export class Settings extends EventBus {
  constructor(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
    super();
    this.storage = storage;
    this.values = { ...DEFAULT_SETTINGS };
    this.load();
  }

  load() {
    if (!this.storage) return;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw) this.values = sanitize({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch (error) {
      console.warn('[Settings] failed to load', error);
    }
  }

  save() {
    if (!this.storage) return;
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.values));
    } catch (error) {
      console.warn('[Settings] failed to save', error);
    }
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    const next = sanitize({ ...this.values, [key]: value });
    const previous = this.values;
    this.values = next;
    this.save();
    if (previous[key] !== next[key]) this.emit('change', key, next[key], next);
    return next[key];
  }

  patch(partial) {
    const next = sanitize({ ...this.values, ...partial });
    const previous = this.values;
    this.values = next;
    this.save();
    for (const key of Object.keys(next)) {
      if (previous[key] !== next[key]) this.emit('change', key, next[key], next);
    }
    return next;
  }

  reset() {
    this.values = { ...DEFAULT_SETTINGS };
    this.save();
    this.emit('reset', this.values);
    for (const [key, value] of Object.entries(this.values)) this.emit('change', key, value, this.values);
  }
}

export const NET_STORAGE_KEY = 'neonstrike.net.v1';

export const DEFAULT_NET_CONFIG = Object.freeze({
  host: '',
  port: '',
  path: '',
  key: '',
  secure: true,
  remember: false,
});

export function loadNetConfig(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  let config = { ...DEFAULT_NET_CONFIG };
  if (storage) {
    try {
      const raw = storage.getItem(NET_STORAGE_KEY);
      if (raw) config = { ...config, ...JSON.parse(raw) };
    } catch (error) {
      console.warn('[NetConfig] failed to load', error);
    }
  }
  // URL params win so automated tests / LAN links can override without saving.
  if (typeof location !== 'undefined') {
    const params = new URLSearchParams(location.search);
    const get = (name) => params.get(name);
    if (get('peerhost')) {
      config.host = get('peerhost');
      config.port = get('peerport') ?? '';
      config.path = get('peerpath') ?? '/';
      config.key = get('peerkey') ?? 'peerjs';
      config.secure = get('peersecure') === '1';
      config.remember = false;
    }
  }
  return config;
}

export function saveNetConfig(config, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return;
  try {
    if (config.remember) {
      storage.setItem(NET_STORAGE_KEY, JSON.stringify(config));
    } else {
      storage.removeItem(NET_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('[NetConfig] failed to save', error);
  }
}

export function describeNetConfig(config) {
  if (!config.host) return 'PeerJS Cloud';
  return `${config.secure ? 'wss' : 'ws'}://${config.host}:${config.port || (config.secure ? 443 : 80)}${config.path || '/'}`;
}
