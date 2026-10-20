import { clamp, randRange } from './utils.js';

/**
 * Tiny procedural audio engine (no asset files).
 * All sounds are synthesized with Web Audio and respect the master volume.
 */
export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.master = null;
    this.compressor = null;
    this.noiseBuffer = null;
    this.ambient = null;
    this.muted = false;
    this._last = new Map();
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    }
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 20;
      this.compressor.ratio.value = 8;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.2;
      this.master = this.ctx.createGain();
      this.master.gain.value = this._volumeGain();
      this.master.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
      this._buildNoise();
      if (this.settings?.get('ambientAudio')) this.startAmbient();
      return this.ctx;
    } catch (error) {
      console.warn('[Audio] unavailable', error);
      return null;
    }
  }

  _volumeGain() {
    const volume = this.muted ? 0 : clamp((this.settings?.get('volume') ?? 65) / 100, 0, 1);
    return volume * 0.75;
  }

  setVolume() {
    if (!this.master || !this.ctx) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(this._volumeGain(), this.ctx.currentTime, 0.04);
  }

  setMuted(muted) {
    this.muted = muted;
    this.setVolume();
  }

  isMuted() {
    return this.muted;
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  _buildNoise() {
    const sr = this.ctx.sampleRate;
    const length = Math.floor(sr * 1.2);
    const buffer = this.ctx.createBuffer(1, length, sr);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    this.noiseBuffer = buffer;
  }

  _canPlay(key, minInterval) {
    if (!key) return true;
    const now = performance.now();
    const last = this._last.get(key) ?? 0;
    if (now - last < minInterval) return false;
    this._last.set(key, now);
    return true;
  }

  _panNode(pan = 0) {
    if (!this.ctx) return null;
    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = clamp(pan, -1, 1);
      return panner;
    }
    return this.ctx.createGain();
  }

  _envGain(volume, attack, decay, sustain = 0.0001) {
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, volume), now + Math.max(0.001, attack));
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain), now + Math.max(attack + 0.01, decay));
    return gain;
  }

  _tone({ freq = 440, endFreq = freq, dur = 0.15, type = 'sine', volume = 0.1, pan = 0, delay = 0, detune = 0 }) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = this._panNode(pan);
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + dur);
    if (detune) osc.detune.value = detune;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  _noise({ dur = 0.12, volume = 0.1, pan = 0, delay = 0, filterFreq = 1200, endFreq = null, q = 0.8, type = 'lowpass' }) {
    if (!this.ctx || this.muted || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const start = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panner = this._panNode(pan);
    src.buffer = this.noiseBuffer;
    src.loop = true;
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(filterFreq, start);
    if (endFreq) filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), start + dur);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    src.start(start, Math.random() * 0.5);
    src.stop(start + dur + 0.03);
  }

  _ok(key, ms = 30) {
    if (!this.ensure()) return false;
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
    return this._canPlay(key, ms);
  }

  shot(weaponId = 'pulse', { pan = 0, volume = 1 } = {}) {
    if (!this._ok(`shot-${weaponId}`, 18)) return;
    const p = clamp(pan, -1, 1) * 0.8;
    const v = clamp(volume, 0.1, 1.2);
    switch (weaponId) {
      case 'volt':
        this._noise({ dur: 0.075, volume: 0.075 * v, pan: p, filterFreq: 2400, endFreq: 500, q: 1.2 });
        this._tone({ freq: randRange(210, 250), endFreq: 75, dur: 0.09, type: 'sawtooth', volume: 0.055 * v, pan: p });
        break;
      case 'scatter':
        this._noise({ dur: 0.2, volume: 0.16 * v, pan: p, filterFreq: 2800, endFreq: 220, q: 0.6 });
        this._tone({ freq: 110, endFreq: 38, dur: 0.22, type: 'sine', volume: 0.16 * v, pan: p });
        break;
      case 'rail':
        this._tone({ freq: 1700, endFreq: 140, dur: 0.28, type: 'sawtooth', volume: 0.09 * v, pan: p });
        this._tone({ freq: 3400, endFreq: 600, dur: 0.16, type: 'square', volume: 0.035 * v, pan: p });
        this._noise({ dur: 0.14, volume: 0.06 * v, pan: p, filterFreq: 6500, endFreq: 900, type: 'highpass' });
        break;
      case 'nova':
        this._noise({ dur: 0.32, volume: 0.12 * v, pan: p, filterFreq: 900, endFreq: 160, q: 0.7 });
        this._tone({ freq: 150, endFreq: 42, dur: 0.28, type: 'sawtooth', volume: 0.11 * v, pan: p });
        break;
      case 'pulse':
      default:
        this._tone({ freq: randRange(900, 1100), endFreq: 260, dur: 0.085, type: 'square', volume: 0.055 * v, pan: p });
        this._tone({ freq: 220, endFreq: 90, dur: 0.06, type: 'sine', volume: 0.05 * v, pan: p });
        this._noise({ dur: 0.04, volume: 0.035 * v, pan: p, filterFreq: 5000, endFreq: 1200, type: 'highpass' });
        break;
    }
  }

  explosion({ pan = 0, volume = 1, distant = false } = {}) {
    if (!this._ok('explosion', 40)) return;
    const v = clamp(volume, 0.1, 1.2);
    this._noise({ dur: distant ? 0.5 : 0.85, volume: 0.2 * v, pan, filterFreq: distant ? 700 : 1300, endFreq: 40, q: 0.5 });
    this._tone({ freq: 90, endFreq: 24, dur: 0.75, type: 'sine', volume: 0.2 * v, pan });
    this._tone({ freq: 220, endFreq: 45, dur: 0.35, type: 'sawtooth', volume: 0.06 * v, pan });
  }

  hitmarker(kill = false) {
    if (!this._ok(kill ? 'kill' : 'hit', kill ? 80 : 35)) return;
    this._tone({ freq: kill ? 1600 : 1250, endFreq: kill ? 2000 : 1000, dur: 0.045, type: 'square', volume: 0.05 });
    if (kill) {
      this._tone({ freq: 700, endFreq: 300, dur: 0.18, type: 'sawtooth', volume: 0.045, delay: 0.035 });
      this._noise({ dur: 0.18, volume: 0.02, filterFreq: 3000, type: 'highpass' });
    }
  }

  hurt() {
    if (!this._ok('hurt', 120)) return;
    this._noise({ dur: 0.22, volume: 0.1, filterFreq: 600, endFreq: 120 });
    this._tone({ freq: 120, endFreq: 60, dur: 0.25, type: 'triangle', volume: 0.09 });
  }

  empty() {
    if (!this._ok('empty', 120)) return;
    this._tone({ freq: 520, endFreq: 380, dur: 0.035, type: 'square', volume: 0.04 });
  }

  reload(duration = 1) {
    if (!this._ok('reload', 100)) return;
    this._noise({ dur: 0.05, volume: 0.05, filterFreq: 2400, type: 'bandpass', q: 2 });
    this._tone({ freq: 380, endFreq: 280, dur: 0.04, type: 'square', volume: 0.03, delay: Math.max(0.05, duration * 0.55) });
    this._tone({ freq: 640, endFreq: 420, dur: 0.05, type: 'square', volume: 0.035, delay: Math.max(0.12, duration * 0.9) });
  }

  switchWeapon() {
    if (!this._ok('switch', 60)) return;
    this._noise({ dur: 0.04, volume: 0.035, filterFreq: 3200, type: 'bandpass', q: 2 });
    this._tone({ freq: 800, endFreq: 500, dur: 0.05, type: 'triangle', volume: 0.03 });
  }

  jump() {
    if (!this._ok('jump', 90)) return;
    this._noise({ dur: 0.12, volume: 0.025, filterFreq: 900, endFreq: 2400, type: 'bandpass', q: 1.1 });
  }

  land() {
    if (!this._ok('land', 180)) return;
    this._noise({ dur: 0.08, volume: 0.045, filterFreq: 500, endFreq: 120 });
    this._tone({ freq: 90, endFreq: 50, dur: 0.09, type: 'sine', volume: 0.05 });
  }

  pickup() {
    if (!this._ok('pickup', 150)) return;
    this._tone({ freq: 600, endFreq: 900, dur: 0.08, type: 'sine', volume: 0.05 });
    this._tone({ freq: 900, endFreq: 1400, dur: 0.12, type: 'sine', volume: 0.04, delay: 0.07 });
    this._noise({ dur: 0.18, volume: 0.015, filterFreq: 4000, type: 'highpass' });
  }

  teleport() {
    if (!this._ok('teleport', 200)) return;
    this._tone({ freq: 180, endFreq: 1600, dur: 0.3, type: 'sine', volume: 0.06 });
    this._tone({ freq: 900, endFreq: 220, dur: 0.35, type: 'triangle', volume: 0.035, delay: 0.06 });
    this._noise({ dur: 0.3, volume: 0.035, filterFreq: 2000, endFreq: 7000, type: 'bandpass', q: 2 });
  }

  jumpPad() {
    if (!this._ok('pad', 200)) return;
    this._tone({ freq: 200, endFreq: 1100, dur: 0.25, type: 'sawtooth', volume: 0.055 });
    this._noise({ dur: 0.32, volume: 0.04, filterFreq: 500, endFreq: 3500, type: 'bandpass', q: 1.4 });
  }

  laser() {
    if (!this._ok('laser', 400)) return;
    this._tone({ freq: 1200, endFreq: 1600, dur: 0.12, type: 'square', volume: 0.022 });
  }

  spawn() {
    if (!this._ok('spawn', 300)) return;
    this._tone({ freq: 300, endFreq: 900, dur: 0.25, type: 'sine', volume: 0.05 });
    this._tone({ freq: 600, endFreq: 1200, dur: 0.35, type: 'triangle', volume: 0.025, delay: 0.05 });
  }

  death() {
    if (!this._ok('death', 500)) return;
    this._tone({ freq: 340, endFreq: 60, dur: 0.7, type: 'sawtooth', volume: 0.09 });
    this._noise({ dur: 0.5, volume: 0.06, filterFreq: 800, endFreq: 90 });
  }

  ui() {
    if (!this._ok('ui', 45)) return;
    this._tone({ freq: 900, endFreq: 1200, dur: 0.035, type: 'sine', volume: 0.022 });
  }

  error() {
    if (!this._ok('error', 200)) return;
    this._tone({ freq: 180, endFreq: 140, dur: 0.12, type: 'square', volume: 0.035 });
    this._tone({ freq: 150, endFreq: 110, dur: 0.16, type: 'square', volume: 0.03, delay: 0.11 });
  }

  startAmbient() {
    const ctx = this.ctx;
    if (!ctx || this.ambient || this.muted) return;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.setTargetAtTime(clamp((this.settings?.get('volume') ?? 65) / 100, 0, 1) * 0.012, ctx.currentTime, 1.2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    filter.Q.value = 3;
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    oscA.type = 'sawtooth';
    oscB.type = 'sine';
    oscA.frequency.value = 55;
    oscB.frequency.value = 82.4;
    oscA.detune.value = -7;
    oscB.detune.value = 4;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    oscA.start();
    oscB.start();
    lfo.start();
    this.ambient = { gain, oscA, oscB, lfo, filter };
  }

  stopAmbient() {
    if (!this.ambient || !this.ctx) return;
    const { gain, oscA, oscB, lfo } = this.ambient;
    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(0.0001, now, 0.3);
    try {
      oscA.stop(now + 1.4);
      oscB.stop(now + 1.4);
      lfo.stop(now + 1.4);
    } catch { /* already stopped */ }
    this.ambient = null;
  }

  setAmbientEnabled(enabled) {
    if (enabled) {
      if (this.ctx) this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  dispose() {
    this.stopAmbient();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch { /* noop */ }
      this.ctx = null;
    }
    this.master = null;
  }
}
