import { clamp, formatClock, formatPing } from '../core/utils.js';
import { Minimap } from './Minimap.js';

const MAX_KILLFEED = 5;

/**
 * All DOM/HUD presentation lives here. It only reads session state and exposes
 * imperative event helpers (kill feed, hit marker, toast) to the simulation.
 */
export class HUD {
  constructor(session) {
    this.session = session;
    const byId = (id) => document.getElementById(id);
    this.el = {
      mode: byId('hud-mode'),
      timer: byId('hud-timer'),
      roomCode: byId('hud-room-code'),
      net: byId('hud-net'),
      healthValue: byId('health-value'),
      healthFill: byId('health-fill'),
      kills: byId('hud-kills'),
      deaths: byId('hud-deaths'),
      ping: byId('hud-ping'),
      weaponClass: byId('weapon-class'),
      weaponName: byId('weapon-name'),
      ammoMag: byId('ammo-mag'),
      ammoReserve: byId('ammo-reserve'),
      ammoMain: byId('ammo-main'),
      reloadRing: byId('reload-ring'),
      reloadProgress: byId('reload-progress'),
      ammoPips: byId('ammo-pips'),
      weaponBar: byId('weapon-bar'),
      crosshair: byId('crosshair'),
      hitmarker: byId('hitmarker'),
      damageVignette: byId('damage-vignette'),
      damageDirection: byId('damage-direction'),
      killfeed: byId('killfeed'),
      toastStack: byId('toast-stack'),
      hint: byId('hint-line'),
      waiting: byId('waiting-note'),
      waitCode: byId('wait-code'),
      perf: byId('perf'),
      scoreboard: byId('scoreboard'),
      scoreRows: byId('score-rows'),
      scoreRoom: byId('score-room'),
      deathOverlay: byId('death-overlay'),
      deathBy: byId('death-by'),
      respawnTimer: byId('respawn-timer'),
    };

    this.slots = new Map();
    this.ammoPips = [];
    this.activeWeaponId = null;
    this.killEntries = [];
    this.toastEntries = [];
    this.hintTimer = 0;
    this.damageTimer = 0;
    this.hitmarkerTimer = 0;
    this.scoreboardVisible = false;
    this.lastScoreRefresh = 0;
    this.lastFpsRefresh = 0;
    this.lastPerfText = '';
    this.lastNetState = '';

    this._buildWeaponBar();
    this.minimap = new Minimap(byId('minimap'), session);
    this.el.mode.textContent = session.modeLabel;
    this.el.roomCode.textContent = session.roomCode;
    this.el.scoreRoom.textContent = `ROOM ${session.roomCode}`;
    this.el.deathOverlay.classList.add('hidden');
    if (session.practice) {
      this.el.waiting.classList.add('hidden');
    }
  }

  _buildWeaponBar() {
    const frag = document.createDocumentFragment();
    for (const def of this.session.registry.list()) {
      const slot = document.createElement('div');
      slot.className = 'weapon-slot';
      slot.style.setProperty('--slot-color', def.color);
      slot.dataset.weapon = def.id;
      slot.innerHTML = `
        <span class="ws-key">${def.slot}</span>
        <span class="ws-name">${def.name}</span>
        <span class="ws-bar"><i></i></span>
      `;
      frag.appendChild(slot);
      this.slots.set(def.id, { root: slot, bar: slot.querySelector('.ws-bar i') });
    }
    this.el.weaponBar.appendChild(frag);
  }

  _buildAmmoPips(count) {
    this.el.ammoPips.innerHTML = '';
    this.ammoPips = [];
    const total = Math.min(16, Math.max(4, count));
    for (let i = 0; i < total; i += 1) {
      const pip = document.createElement('i');
      this.el.ammoPips.appendChild(pip);
      this.ammoPips.push(pip);
    }
    this.ammoPipMax = total;
  }

  update(dt) {
    const session = this.session;
    const local = session.localRecord;
    if (!local) return;

    // Health + scoreboard telemetry.
    const health = Math.max(0, Math.round(local.health));
    if (this.el.healthValue.textContent !== String(health)) this.el.healthValue.textContent = String(health);
    this.el.healthFill.style.width = `${clamp(health, 0, 100)}%`;
    this.el.healthFill.classList.toggle('low', health <= 30);
    this.el.kills.textContent = `K ${local.kills ?? 0}`;
    this.el.deaths.textContent = `D ${local.deaths ?? 0}`;
    const ping = session.getDisplayPing();
    this.el.ping.textContent = ping == null ? '-- ms' : `${formatPing(ping)} ms`;

    this.el.timer.textContent = formatClock(session.matchTime);
    this.el.crosshair.classList.toggle('is-hidden', !local.alive || !session.deployed);
    this.el.crosshair.classList.toggle('is-reloading', session.weapon?.reloading);

    this._updateWeapon(dt);
    this._updateNetwork();
    this._updateDeath();
    this._updateWaiting();
    this._updateScoreboard(dt);

    // Dynamic crosshair gap.
    const def = session.weapon?.def;
    if (def) {
      const aiming = session.aiming;
      const speed = Math.hypot(local.vel?.x || 0, local.vel?.z || 0);
      const spread = session.weapon.getSpread({
        aiming,
        moveSpeed: speed,
        airborne: !local.grounded,
        crouching: local.crouch,
      });
      const gap = clamp(5 + spread * 620, 5, 28);
      this.el.crosshair.style.setProperty('--gap', `${gap.toFixed(1)}px`);
      this.el.crosshair.classList.toggle('is-target', session.crosshairTarget);
    }

    this.minimap.update(dt);

    if (this.hintTimer > 0) {
      this.hintTimer -= dt;
      if (this.hintTimer <= 0) this.el.hint.classList.remove('show');
    }
    if (this.damageTimer > 0) {
      this.damageTimer -= dt;
      if (this.damageTimer <= 0) {
        this.el.damageVignette.classList.remove('show');
        this.el.damageDirection.classList.remove('show');
      }
    }
    if (this.hitmarkerTimer > 0) {
      this.hitmarkerTimer -= dt;
      if (this.hitmarkerTimer <= 0) {
        this.el.hitmarker.classList.remove('show', 'kill');
      }
    }

    this._updatePerf(dt);
  }

  _updateWeapon(dt) {
    const session = this.session;
    const weapon = session.weapon;
    if (!weapon) return;
    const def = weapon.def;
    if (this.activeWeaponId !== def.id) {
      this.activeWeaponId = def.id;
      this._buildAmmoPips(def.magSize);
      this.el.weaponClass.textContent = def.classLabel;
      this.el.weaponName.textContent = def.name;
    }
    this.el.ammoMag.textContent = String(weapon.ammo);
    this.el.ammoReserve.textContent = weapon.reserve === Infinity ? '/ ∞' : `/ ${weapon.reserve}`;
    this.el.ammoMain.classList.toggle('is-low', weapon.ammo <= Math.max(1, Math.floor(def.magSize * 0.25)));

    const progress = weapon.reloadProgress;
    this.el.reloadRing.classList.toggle('is-reloading', weapon.reloading);
    this.el.reloadProgress.style.strokeDashoffset = String(113 * (1 - progress));
    const ratio = weapon.ammo / Math.max(1, def.magSize);
    const lit = Math.ceil(ratio * this.ammoPipMax);
    for (let i = 0; i < this.ammoPips.length; i += 1) {
      this.ammoPips[i].classList.toggle('on', i < lit);
    }
    for (const [id, slot] of this.slots) {
      slot.root.classList.toggle('active', id === session.weapon.id);
      const other = session.loadout.find((w) => w.id === id);
      const empty = !other || (other.ammo === 0 && other.reserve !== Infinity && other.reserve <= 0);
      slot.root.classList.toggle('empty', empty);
      if (other) slot.bar.style.width = `${clamp(other.ammo / Math.max(1, other.def.magSize), 0, 1) * 100}%`;
    }
  }

  _updateNetwork() {
    const session = this.session;
    let label = 'LOCAL';
    let state = 'local';
    if (session.room) {
      if (session.room.isHost) {
        label = session.room.guestCount() > 0 ? `P2P ${session.room.guestCount() + 1}P` : 'HOST';
        state = 'ok';
      } else {
        const ping = session.room.ping;
        label = ping == null ? 'P2P' : `P2P ${formatPing(ping)}ms`;
        state = ping == null ? 'ok' : ping > 160 ? 'bad' : ping > 80 ? 'warn' : 'ok';
      }
    }
    const signature = `${label}|${state}`;
    if (signature !== this.lastNetState) {
      this.lastNetState = signature;
      const pill = this.el.net;
      pill.querySelector('span').textContent = label;
      pill.classList.toggle('is-warn', state === 'warn');
      pill.classList.toggle('is-bad', state === 'bad');
    }
  }

  _updateDeath() {
    const local = this.session.localRecord;
    const show = this.session.deployed && local && !local.alive;
    this.el.deathOverlay.classList.toggle('hidden', !show);
    if (!show) return;
    const info = this.session.localDeath;
    if (info) {
      const by = info.killerName ? `BY ${String(info.killerName).toUpperCase()}` : 'BY ENVIRONMENT';
      const weapon = info.weaponName ? ` // ${info.weaponName}` : '';
      const text = `${by}${weapon}`;
      if (this.el.deathBy.textContent !== text) this.el.deathBy.textContent = text;
    } else if (this.el.deathBy.textContent !== 'BY UNKNOWN') {
      this.el.deathBy.textContent = 'BY UNKNOWN';
    }
    const remaining = Math.max(0, Math.ceil(local.respawnRemaining ?? 0));
    if (this.el.respawnTimer.textContent !== String(remaining)) this.el.respawnTimer.textContent = String(remaining);
  }

  _updateWaiting() {
    const session = this.session;
    const waiting = Boolean(session.room && session.room.isHost && session.room.guestCount() === 0 && !session.practice);
    this.el.waiting.classList.toggle('hidden', !waiting);
    if (waiting && this.el.waitCode.textContent !== session.roomCode) {
      this.el.waitCode.textContent = session.roomCode;
    }
  }

  _updateScoreboard(dt) {
    this.el.scoreboard.classList.toggle('hidden', !this.scoreboardVisible);
    if (!this.scoreboardVisible) return;
    this.lastScoreRefresh -= dt;
    if (this.lastScoreRefresh > 0) return;
    this.lastScoreRefresh = 0.25;
    const rows = this.session.getScoreboardData();
    const frag = document.createDocumentFragment();
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const div = document.createElement('div');
      div.className = 'score-row';
      if (row.isLocal) div.classList.add('is-self');
      if (!row.alive) div.classList.add('is-dead');
      div.style.setProperty('--pc', row.color);
      const tags = [
        row.isLocal ? '<span class="s-tag you">YOU</span>' : '',
        row.isHost ? '<span class="s-tag host">HOST</span>' : '',
        row.isBot ? '<span class="s-tag">BOT</span>' : '',
      ].join('');
      div.innerHTML = `
        <span class="s-rank">#${String(i + 1).padStart(2, '0')}</span>
        <span class="s-player"><i class="s-dot"></i><span class="s-name">${escapeHtml(row.name)}</span>${tags}</span>
        <span class="s-kills">${row.kills}</span>
        <span class="s-deaths">${row.deaths}</span>
        <span class="s-status ${row.alive ? '' : 'dead'}">${row.alive ? 'ACTIVE' : 'RESPAWN'}</span>
        <span class="s-ping">${row.ping == null ? '--' : `${row.ping}ms`}</span>
      `;
      frag.appendChild(div);
    }
    this.el.scoreRows.replaceChildren(frag);
  }

  _updatePerf(dt) {
    this.lastFpsRefresh += dt;
    if (this.lastFpsRefresh < 0.4) return;
    this.lastFpsRefresh = 0;
    const fps = Math.round(this.session.fps || 0);
    const text = `${fps} FPS · ${this.session.getRenderLabel()}`;
    if (text !== this.lastPerfText) {
      this.lastPerfText = text;
      this.el.perf.textContent = text;
    }
    this.el.perf.classList.toggle('hidden', !this.session.settings.get('showFps'));
  }

  setScoreboard(visible) {
    this.scoreboardVisible = Boolean(visible);
    if (visible) this.lastScoreRefresh = 0;
  }

  addKill({ killerName, victimName, weaponName, killerId, victimId, headshot = false, color = '#00f6ff' }) {
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.style.setProperty('--kill-color', color);
    entry.innerHTML = `
      <span class="k-name ${killerId === this.session.localId ? 'k-you' : ''}">${escapeHtml(killerName || 'WORLD')}</span>
      <span class="k-icon">▸</span>
      <span class="k-name ${victimId === this.session.localId ? 'k-you' : ''}">${escapeHtml(victimName || 'UNKNOWN')}</span>
      ${headshot ? '<span class="k-head">HEAD</span>' : ''}
      <span class="k-weapon">${escapeHtml(weaponName || '')}</span>
    `;
    this.el.killfeed.prepend(entry);
    this.killEntries.push({ entry, timestamp: performance.now() });
    while (this.killEntries.length > MAX_KILLFEED) {
      this.killEntries.shift()?.entry.remove();
    }
    setTimeout(() => {
      entry.style.transition = 'opacity 0.25s';
      entry.style.opacity = '0';
      setTimeout(() => entry.remove(), 260);
    }, 6500);
  }

  showToast(text, color = '#00f6ff', duration = 1800) {
    const toast = document.createElement('div');
    toast.className = 'hud-toast';
    toast.textContent = text;
    toast.style.setProperty('--toast-color', color);
    this.el.toastStack.appendChild(toast);
    this.toastEntries.push(toast);
    while (this.toastEntries.length > 3) this.toastEntries.shift()?.remove();
    setTimeout(() => {
      toast.style.transition = 'opacity 0.22s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 240);
    }, duration);
  }

  showHint(text, duration = 2.4) {
    this.el.hint.textContent = text;
    this.el.hint.classList.add('show');
    this.hintTimer = duration;
  }

  showHitmarker(kill = false) {
    const marker = this.el.hitmarker;
    marker.classList.remove('show', 'kill');
    void marker.offsetWidth;
    if (kill) marker.classList.add('kill');
    marker.classList.add('show');
    this.hitmarkerTimer = 0.22;
  }

  showDamage(amount = 0, angle = null) {
    this.el.damageVignette.classList.toggle('show', amount > 0);
    if (angle != null) {
      this.el.damageDirection.style.transform = `rotate(${angle}rad)`;
      this.el.damageDirection.classList.add('show');
    } else {
      this.el.damageDirection.classList.remove('show');
    }
    this.damageTimer = 0.16;
  }

  showDeath(killerName = null, weaponName = null) {
    this.session.localDeath = { killerName, weaponName };
    this.el.deathOverlay.classList.remove('hidden');
    this.el.deathBy.textContent = killerName ? `BY ${String(killerName).toUpperCase()}` : 'BY ENVIRONMENT';
  }

  hideDeath() {
    this.el.deathOverlay.classList.add('hidden');
    this.session.localDeath = null;
  }

  setNetworkStatus(label, state = 'ok') {
    const pill = this.el.net;
    pill.querySelector('span').textContent = label;
    pill.classList.toggle('is-warn', state === 'warn');
    pill.classList.toggle('is-bad', state === 'bad');
    this.lastNetState = `${label}|${state}`;
  }

  dispose() {
    this.minimap.dispose();
    for (const { entry } of this.killEntries) entry.remove();
    for (const toast of this.toastEntries) toast.remove();
    this.killEntries.length = 0;
    this.toastEntries.length = 0;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}
