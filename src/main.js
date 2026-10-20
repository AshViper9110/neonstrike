import './styles/main.css';
import { Settings, loadNetConfig, saveNetConfig, describeNetConfig } from './core/Settings.js';
import { AudioManager } from './core/AudioManager.js';
import { PeerRoom } from './net/PeerRoom.js';
import { GameSession } from './game/GameSession.js';
import { registerBuiltinWeapons } from './weapons/index.js';
import { sanitizeName, sanitizeRoomCode, isValidRoomCode, makeId } from './core/utils.js';

document.getElementById('boot-notice')?.remove();

const MAX_PLAYERS = 4;
const JOIN_ATTEMPTS = 3;
const JOIN_RETRY_DELAY_MS = 600;
const RETRYABLE_JOIN_ERRORS = new Set([
  'timeout',
  'connection-failed',
  'connection-closed',
  'host-not-found',
  'signal-error',
  'webrtc',
]);
const NAME_STORAGE_KEY = 'neonstrike.name.v1';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

const settings = new Settings();
const audio = new AudioManager(settings);
const registry = registerBuiltinWeapons();

const app = {
  session: null,
  room: null,
  pendingRoom: null,
  connecting: false,
  connectToken: 0,
  name: sanitizeName(params.get('name') || localStorage.getItem(NAME_STORAGE_KEY) || 'PLAYER'),
  netConfig: loadNetConfig(),
  startHintTimer: null,
  toastTimer: null,
};

const el = {
  menu: $('menu-screen'),
  game: $('game-screen'),
  name: $('input-name'),
  room: $('input-room'),
  roomCount: $('room-count'),
  status: $('menu-status'),
  statusText: $('menu-status').querySelector('span'),
  connectOverlay: $('connect-overlay'),
  connectKicker: $('connect-kicker'),
  connectTitle: $('connect-title'),
  connectDetail: $('connect-detail'),
  connectCancel: $('btn-connect-cancel'),
  start: $('start-overlay'),
  startTitle: $('start-title'),
  startSub: $('start-sub'),
  startRoom: $('start-room-code'),
  startNote: $('start-note'),
  pause: $('pause-menu'),
  pauseDesc: $('pause-desc'),
  pauseRoom: $('pause-room'),
  disconnect: $('disconnect-overlay'),
  disconnectReason: $('disconnect-reason'),
  death: $('death-overlay'),
  toast: $('toast'),
  toastText: $('toast-text'),
  settingsDialog: $('settings-dialog'),
  helpDialog: $('help-dialog'),
  btnHost: $('btn-host'),
  btnJoin: $('btn-join'),
  btnPractice: $('btn-practice'),
};

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

function setStatus(text, kind = '') {
  el.statusText.textContent = text;
  el.status.classList.toggle('is-error', kind === 'error');
  el.status.classList.toggle('is-ok', kind === 'ok');
}

function toast(text, color = '#00f6ff', duration = 2400) {
  if (!text) return;
  clearTimeout(app.toastTimer);
  el.toastText.textContent = text;
  el.toast.style.setProperty('--toast-color', color);
  el.toast.classList.add('show');
  app.toastTimer = setTimeout(() => el.toast.classList.remove('show'), duration);
}

function setMenuButtonsDisabled(disabled) {
  for (const button of [el.btnHost, el.btnJoin, el.btnPractice]) button.disabled = disabled;
}

function showConnectOverlay(kicker, title, detail) {
  app.connecting = true;
  setMenuButtonsDisabled(true);
  el.connectKicker.textContent = kicker;
  el.connectTitle.textContent = title;
  el.connectDetail.textContent = detail;
  el.connectOverlay.classList.remove('hidden');
  el.connectCancel.classList.remove('hidden');
}

function setConnectDetail(detail) {
  el.connectDetail.textContent = detail;
}

function hideConnectOverlay() {
  app.connecting = false;
  setMenuButtonsDisabled(false);
  el.connectOverlay.classList.add('hidden');
}

function showScreen(name) {
  const game = name === 'game';
  el.game.classList.toggle('hidden', !game);
  el.menu.classList.toggle('hidden', game);
  document.body.classList.toggle('in-game', game);
}

function showStartOverlay() {
  el.start.classList.remove('hidden');
}

function hideStartOverlay() {
  el.start.classList.add('hidden');
}

function showPause() {
  const session = app.session;
  if (!session?.deployed) return;
  el.pause.classList.remove('hidden');
  el.pauseRoom.textContent = `ROOM ${session.roomCode}`;
  el.pauseDesc.innerHTML = session.practice
    ? '演習を一時停止しました。<br />再開するには下のボタンをクリックしてください。'
    : '戦闘は継続中です。<br />再開するには下のボタンをクリックしてください。';
  session.setPaused(true);
  session.hud?.setScoreboard(false);
}

function hidePause() {
  el.pause.classList.add('hidden');
}

function showDisconnect(reason) {
  if (!app.session) return;
  el.disconnectReason.textContent = reason || 'ホストとの接続が切れました。';
  el.disconnect.classList.remove('hidden');
  app.session.setPaused(true);
  app.session.input.setEnabled(false);
}

function hideDisconnect() {
  el.disconnect.classList.add('hidden');
}

// ---------------------------------------------------------------------------
// Start overlay copy
// ---------------------------------------------------------------------------

function refreshStartCopy() {
  const session = app.session;
  if (!session) return;
  el.startRoom.textContent = session.roomCode;
  if (session.practice) {
    el.startTitle.textContent = 'NEON FOUNDRY // TRAINING';
    el.startSub.textContent = 'クリックして演習を開始';
    el.startNote.textContent = 'BOTS 3体 // オフライン';
    return;
  }
  el.startTitle.textContent = 'NEON FOUNDRY';
  if (session.room?.isHost) {
    const guests = session.room.guestCount();
    el.startSub.textContent = guests > 0
      ? `${guests + 1} PLAYERS CONNECTED // DEPLOY で開始`
      : 'ルームを待機中 // DEPLOY でソロ開始';
    el.startNote.textContent = `ルームコード ${session.roomCode} を共有してください`;
  } else {
    el.startSub.textContent = session.remoteDeployed
      ? 'ホストが戦闘を開始しました // DEPLOY で参戦'
      : 'クリックして戦闘に参加';
    el.startNote.textContent = 'ホストの開始を待機中でも先に展開できます';
  }
}

function startHintLoop() {
  clearInterval(app.startHintTimer);
  app.startHintTimer = setInterval(() => {
    if (!app.session) return;
    if (!app.session.deployed) refreshStartCopy();
  }, 900);
}

// ---------------------------------------------------------------------------
// Session lifecycle
// ---------------------------------------------------------------------------

function freshCanvas() {
  const previous = $('game-canvas');
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  if (previous) previous.replaceWith(canvas);
  else el.game.prepend(canvas);
  return canvas;
}

function releaseSession() {
  clearInterval(app.startHintTimer);
  app.startHintTimer = null;
  if (!app.session) return;
  try {
    app.session.dispose();
  } catch (error) {
    console.warn('[NEONSTRIKE] session dispose failed', error);
  }
  app.session = null;
  window.__neonstrikeSession = null;
}

function startSession({ room = null, practice = false, code = '----', initialPlayers = [], localId = null }) {
  releaseSession();
  hideStartOverlay();
  hidePause();
  hideDisconnect();
  el.death.classList.add('hidden');
  showScreen('game');

  const canvas = freshCanvas();
  const session = new GameSession({
    canvas,
    room,
    practice,
    settings,
    audio,
    localName: app.name,
    localId,
    roomCode: code,
    initialPlayers,
  });
  app.session = session;
  window.__neonstrikeSession = session;

  if (room?.isHost) bindHostRequests(room);
  session.start();

  refreshStartCopy();
  showStartOverlay();
  startHintLoop();
  if (params.get('unlocked') === '1') session.input.setUnlockedOverride(true);
  return session;
}

function deployGame({ requestLock = true } = {}) {
  const session = app.session;
  if (!session) return;
  hideStartOverlay();
  hidePause();
  audio.ensure();
  audio.setVolume();
  if (settings.get('ambientAudio')) audio.startAmbient();
  session.input.setEnabled(true);
  session.setDeployed(true);
  session.setPaused(false);

  if (requestLock && !session.input.unlockedOverride) {
    try {
      const promise = session.canvas.requestPointerLock?.();
      if (promise?.catch) promise.catch(() => {});
    } catch { /* browser denied pointer lock */ }
    setTimeout(() => {
      if (!app.session || app.session !== session) return;
      if (!session.deployed || session.input.unlockedOverride) return;
      if (document.pointerLockElement === session.canvas) return;
      // Pointer lock is unavailable (iframe / embedded / headless). Keep the
      // match playable with the direct mouse hook instead of trapping the user.
      session.input.setUnlockedOverride(true);
      toast('マウスロックを利用できません — 直接入力モードで続行', '#ffc857', 3200);
    }, 800);
  }
}

function pauseGame() {
  const session = app.session;
  if (!session?.deployed) return;
  showPause();
  if (document.pointerLockElement === session.canvas) {
    try { document.exitPointerLock?.(); } catch { /* noop */ }
  }
}

function resumeGame() {
  const session = app.session;
  if (!session) return;
  hidePause();
  session.setPaused(false);
  session.input.setEnabled(true);
  if (!session.input.unlockedOverride) {
    try {
      const promise = session.canvas.requestPointerLock?.();
      if (promise?.catch) promise.catch(() => {});
    } catch { /* noop */ }
  }
}

function leaveGame() {
  releaseSession();
  if (app.room) {
    try { app.room.close(); } catch (error) { console.warn('[NEONSTRIKE] room close failed', error); }
    app.room = null;
  }
  app.pendingRoom?.close?.();
  app.pendingRoom = null;
  hideStartOverlay();
  hidePause();
  hideDisconnect();
  hideConnectOverlay();
  el.death.classList.add('hidden');
  showScreen('menu');
  audio.stopAmbient();
  setStatus('ネットワーク待機中', '');
  refreshWeaponList();
}

// ---------------------------------------------------------------------------
// Room bindings
// ---------------------------------------------------------------------------

function bindHostRequests(room) {
  room.on('join-request', (request) => {
    const session = app.session;
    if (!session || app.room !== room) {
      request.reject('not-ready', 'ホストは準備中です。数秒後に再試行してください。');
      return;
    }
    if (session.playerCount() >= MAX_PLAYERS) {
      request.reject('room-full', `ルームが満員です（最大${MAX_PLAYERS}人）。`);
      return;
    }
    const name = sanitizeName(request.name);
    const id = makeId('g');
    const color = session.nextPlayerColor();
    const record = session.addGuestRecord({ id, name, color });
    if (!record) {
      request.reject('error', '参加処理に失敗しました。もう一度お試しください。');
      return;
    }
    request.accept({
      playerId: id,
      name,
      welcome: {
        players: session.getRoster(),
        hostName: session.localName,
        matchTime: session.matchTime,
        mode: 'p2p',
      },
    });
    session.hud?.showToast(`${name} が参加しました`, color, 2400);
    session.hud?.showHint(`${name} 接続 // P2P`, 2.2);
    audio.pickup();
    refreshStartCopy();
  });

  room.on('guest-left', ({ playerId }) => {
    const session = app.session;
    if (!session) return;
    const record = session.records.get(playerId);
    if (!record) return;
    session.removePlayer(playerId, { notify: true });
    session.hud?.showHint(`${record.name} が退出しました`, 2);
    refreshStartCopy();
  });
}

function bindRoomLifecycle(room) {
  room.on('fatal-error', (error) => {
    if (app.room !== room && app.pendingRoom !== room) return;
    if (app.session && app.room === room) {
      showDisconnect(error?.message || '接続エラーが発生しました。');
      return;
    }
    if (app.pendingRoom === room) {
      // The host/join flow owns the final UI state so it can decide whether to
      // retry with a fresh connection.
      setConnectDetail(error?.message || '接続エラーが発生しました。');
      return;
    }
    hideConnectOverlay();
    setStatus(error?.message || '接続エラーが発生しました。', 'error');
    toast(error?.message || '接続エラー', '#ff3b5c', 3200);
    audio.error();
  });
  room.on('warning', (warning) => {
    if (app.room !== room && app.pendingRoom !== room) return;
    if (!warning?.message) return;
    toast(warning.message, '#ffc857', 3000);
  });
  room.on('signaling-lost', () => {
    if (app.room !== room && app.pendingRoom !== room) return;
    if (!app.session) setStatus('シグナリング再接続中…', '');
    else toast('シグナリング接続が不安定です — 再接続中', '#ffc857', 2600);
  });
  room.on('connection-lost', ({ reason } = {}) => {
    if (app.room === room && app.session) showDisconnect(reason);
  });
}

// ---------------------------------------------------------------------------
// Connection flows
// ---------------------------------------------------------------------------

function readName() {
  return sanitizeName(el.name.value || app.name || 'PLAYER');
}

function readCode() {
  return sanitizeRoomCode(el.room.value);
}

function commitName(name) {
  app.name = sanitizeName(name);
  el.name.value = app.name;
  try { localStorage.setItem(NAME_STORAGE_KEY, app.name); } catch { /* storage disabled */ }
}

function saveNetFromUI() {
  app.netConfig = {
    host: $('peer-host').value.trim(),
    port: $('peer-port').value.trim(),
    path: $('peer-path').value.trim(),
    key: $('peer-key').value.trim(),
    secure: $('peer-secure').checked,
    remember: $('peer-remember').checked,
  };
  saveNetConfig(app.netConfig);
}

async function hostGame() {
  if (app.connecting) return false;
  const name = readName();
  const code = readCode();
  if (!isValidRoomCode(code)) {
    setStatus('ルームコードは英数字1〜4文字で入力してください', 'error');
    el.room.focus();
    audio.error();
    return false;
  }
  commitName(name);
  saveNetFromUI();
  audio.ensure();
  audio.ui();

  const token = ++app.connectToken;
  showConnectOverlay('HOSTING', 'ルームを準備中', `ルームコード ${code} を確保しています…`);
  const room = new PeerRoom({ role: 'host', code, name, netConfig: app.netConfig });
  app.pendingRoom = room;
  bindRoomLifecycle(room);

  try {
    await room.openHost();
  } catch (error) {
    if (token !== app.connectToken) return false;
    app.pendingRoom = null;
    hideConnectOverlay();
    setStatus(error?.message || 'ルームを作成できませんでした。', 'error');
    toast(error?.message || 'ルームを作成できませんでした。', '#ff3b5c', 3400);
    audio.error();
    try { room.close(); } catch { /* noop */ }
    return false;
  }

  if (token !== app.connectToken) {
    try { room.close(); } catch { /* noop */ }
    return false;
  }

  app.pendingRoom = null;
  app.room = room;
  hideConnectOverlay();
  setStatus(`ルーム ${code} をホスト中 — コードを共有してください`, 'ok');
  startSession({ room, practice: false, code: room.code });
  toast(`ROOM ${code} // HOST`, '#00f6ff', 2600);
  return true;
}

async function joinGame() {
  if (app.connecting) return false;
  const name = readName();
  const code = readCode();
  if (!isValidRoomCode(code)) {
    setStatus('ルームコードは英数字1〜4文字で入力してください', 'error');
    el.room.focus();
    audio.error();
    return false;
  }
  commitName(name);
  saveNetFromUI();
  audio.ensure();
  audio.ui();

  const token = ++app.connectToken;
  showConnectOverlay('CONNECTING', 'ルームに接続中', `ルーム ${code} のホストを検索しています…`);

  let room = null;
  let welcome = null;

  for (let attempt = 1; attempt <= JOIN_ATTEMPTS; attempt += 1) {
    if (token !== app.connectToken) return false;

    room = new PeerRoom({ role: 'guest', code, name, netConfig: app.netConfig });
    app.pendingRoom = room;
    bindRoomLifecycle(room);
    setConnectDetail(attempt === 1
      ? 'シグナリング完了 — P2Pチャンネルを確立しています…'
      : `P2P接続を再試行しています… (${attempt}/${JOIN_ATTEMPTS})`);

    try {
      welcome = await room.connectToHost();
      break;
    } catch (error) {
      if (app.pendingRoom === room) app.pendingRoom = null;
      try { room.close(); } catch { /* noop */ }
      room = null;
      welcome = null;
      if (token !== app.connectToken) return false;

      const canRetry = attempt < JOIN_ATTEMPTS && RETRYABLE_JOIN_ERRORS.has(error?.code);
      if (!canRetry) {
        hideConnectOverlay();
        setStatus(error?.message || 'ルームに接続できませんでした。', 'error');
        toast(error?.message || 'ルームに接続できませんでした。', '#ff3b5c', 3400);
        audio.error();
        return false;
      }

      // A data channel can occasionally stall in ICE/DTLS without emitting an
      // error. A new Peer and a fresh RTCPeerConnection resolve it reliably.
      setConnectDetail(`接続を再確立しています… (${attempt + 1}/${JOIN_ATTEMPTS})`);
      await new Promise((resolve) => { setTimeout(resolve, JOIN_RETRY_DELAY_MS); });
      if (token !== app.connectToken) return false;
    }
  }

  if (!room || !welcome || token !== app.connectToken) {
    try { room?.close(); } catch { /* noop */ }
    if (app.pendingRoom === room) app.pendingRoom = null;
    return false;
  }

  app.pendingRoom = null;
  app.room = room;
  hideConnectOverlay();
  const players = Array.isArray(welcome?.players) ? welcome.players : [];
  const hostName = sanitizeName(welcome?.hostName || 'HOST');
  setStatus(`ルーム ${code} に参加中 — HOST: ${hostName}`, 'ok');
  startSession({
    room,
    practice: false,
    code: room.code,
    initialPlayers: players,
    localId: room.selfId,
  });
  app.session.matchTime = Number(welcome?.matchTime) || 0;
  toast(`ROOM ${code} // CONNECTED`, '#a6ff4d', 2600);
  return true;
}

function startPractice() {
  if (app.connecting) return;
  const name = readName();
  commitName(name);
  audio.ensure();
  audio.ui();
  app.room = null;
  startSession({ practice: true, code: 'SOLO' });
  setStatus('練習モード // BOTS ONLINE', 'ok');
}

function cancelConnecting() {
  if (!app.connecting) return;
  app.connectToken += 1;
  const room = app.pendingRoom;
  app.pendingRoom = null;
  try { room?.close(); } catch { /* noop */ }
  hideConnectOverlay();
  setStatus('接続を中止しました', '');
}

// ---------------------------------------------------------------------------
// Menu weapon list
// ---------------------------------------------------------------------------

function refreshWeaponList() {
  const list = $('menu-weapon-list');
  if (!list) return;
  const fragment = document.createDocumentFragment();
  for (const def of registry.list()) {
    const item = document.createElement('li');
    const dot = document.createElement('i');
    dot.style.background = def.color;
    dot.style.boxShadow = `0 0 10px ${def.color}`;
    const index = document.createElement('span');
    index.className = 'w-index';
    index.textContent = String(def.slot).padStart(2, '0');
    const name = document.createElement('span');
    name.className = 'w-name';
    name.textContent = def.name;
    const meta = document.createElement('span');
    meta.className = 'w-meta';
    meta.textContent = (def.classLabel || def.type).split(' / ')[0];
    item.append(dot, index, name, meta);
    fragment.appendChild(item);
  }
  list.replaceChildren(fragment);
}

// ---------------------------------------------------------------------------
// Settings UI
// ---------------------------------------------------------------------------

function syncSettingsUI() {
  const sensitivity = settings.get('sensitivity');
  const fov = settings.get('fov');
  const volume = settings.get('volume');
  $('sensitivity').value = String(sensitivity);
  $('sensitivity-value').textContent = Number(sensitivity).toFixed(2);
  $('fov').value = String(fov);
  $('fov-value').textContent = `${fov}°`;
  $('volume').value = String(volume);
  $('volume-value').textContent = `${volume}%`;
  $('show-fps').checked = Boolean(settings.get('showFps'));
  $('ambient-audio').checked = Boolean(settings.get('ambientAudio'));
  const quality = settings.get('quality');
  for (const button of document.querySelectorAll('#quality-segmented button')) {
    button.classList.toggle('active', button.dataset.quality === quality);
  }
  $('settings-server-text').textContent = describeNetConfig(app.netConfig);
}

function wireSettingsUI() {
  $('sensitivity').addEventListener('input', (event) => {
    const value = settings.set('sensitivity', Number(event.target.value));
    $('sensitivity-value').textContent = Number(value).toFixed(2);
  });
  $('fov').addEventListener('input', (event) => {
    const value = settings.set('fov', Number(event.target.value));
    $('fov-value').textContent = `${value}°`;
  });
  $('volume').addEventListener('input', (event) => {
    const value = settings.set('volume', Number(event.target.value));
    $('volume-value').textContent = `${value}%`;
    audio.setVolume();
  });
  $('show-fps').addEventListener('change', (event) => {
    settings.set('showFps', event.target.checked);
  });
  $('ambient-audio').addEventListener('change', (event) => {
    settings.set('ambientAudio', event.target.checked);
    audio.setAmbientEnabled(event.target.checked);
  });
  for (const button of document.querySelectorAll('#quality-segmented button')) {
    button.addEventListener('click', () => {
      settings.set('quality', button.dataset.quality === 'low' ? 'low' : 'high');
      syncSettingsUI();
      audio.ui();
    });
  }
  $('btn-settings-reset').addEventListener('click', () => {
    settings.reset();
    syncSettingsUI();
    audio.setVolume();
    audio.ui();
  });
  $('btn-settings-close').addEventListener('click', () => el.settingsDialog.close());
  $('settings-form').addEventListener('submit', () => {
    syncSettingsUI();
  });

  settings.on('change', (key) => {
    if (key === 'quality' || key === 'fov') syncSettingsUI();
  });
}

function wireNetUI() {
  const fill = () => {
    $('peer-host').value = app.netConfig.host || '';
    $('peer-port').value = app.netConfig.port || '';
    $('peer-path').value = app.netConfig.path || '';
    $('peer-key').value = app.netConfig.key || '';
    $('peer-secure').checked = Boolean(app.netConfig.secure);
    $('peer-remember').checked = Boolean(app.netConfig.remember);
    $('settings-server-text').textContent = describeNetConfig(app.netConfig);
  };
  fill();

  $('btn-local-preset').addEventListener('click', () => {
    $('peer-host').value = '127.0.0.1';
    $('peer-port').value = '9000';
    $('peer-path').value = '/';
    $('peer-key').value = 'peerjs';
    $('peer-secure').checked = false;
    setStatus('ローカルPeerServerプリセット（npm run signal）', '');
    audio.ui();
  });
  $('btn-cloud-preset').addEventListener('click', () => {
    $('peer-host').value = '';
    $('peer-port').value = '';
    $('peer-path').value = '';
    $('peer-key').value = '';
    $('peer-secure').checked = true;
    setStatus('PeerJSクラウドを使用します', '');
    audio.ui();
  });
}

// ---------------------------------------------------------------------------
// Global UI bindings
// ---------------------------------------------------------------------------

function wireMenuUI() {
  el.name.value = app.name;
  el.room.value = sanitizeRoomCode(params.get('room') || '');
  el.roomCount.textContent = `${el.room.value.length}/4`;

  el.room.addEventListener('input', () => {
    const clean = sanitizeRoomCode(el.room.value);
    if (el.room.value !== clean) el.room.value = clean;
    el.roomCount.textContent = `${clean.length}/4`;
  });
  el.name.addEventListener('change', () => commitName(el.name.value));

  el.btnHost.addEventListener('click', () => { void hostGame(); });
  el.btnJoin.addEventListener('click', () => { void joinGame(); });
  el.btnPractice.addEventListener('click', () => { startPractice(); });
  el.connectCancel.addEventListener('click', () => { cancelConnecting(); });

  $('btn-settings').addEventListener('click', () => {
    syncSettingsUI();
    if (!el.settingsDialog.open) el.settingsDialog.showModal();
    audio.ui();
  });
  $('btn-help').addEventListener('click', () => {
    if (!el.helpDialog.open) el.helpDialog.showModal();
    audio.ui();
  });
  $('btn-help-close').addEventListener('click', () => el.helpDialog.close());
  $('btn-help-done').addEventListener('click', () => el.helpDialog.close());

  $('btn-deploy').addEventListener('click', () => deployGame());
  $('btn-leave-start').addEventListener('click', () => leaveGame());
  $('btn-resume').addEventListener('click', () => resumeGame());
  $('btn-pause-settings').addEventListener('click', () => {
    syncSettingsUI();
    if (!el.settingsDialog.open) el.settingsDialog.showModal();
    audio.ui();
  });
  $('btn-leave').addEventListener('click', () => leaveGame());
  $('btn-disconnect-menu').addEventListener('click', () => leaveGame());

  el.name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void hostGame();
    }
  });
  el.room.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void joinGame();
    }
  });
}

function wireGlobalKeys() {
  window.addEventListener('keydown', (event) => {
    const session = app.session;
    if (!session?.deployed) return;
    if (el.settingsDialog.open || el.helpDialog.open) return;
    if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA') return;

    if (event.code === 'Tab') {
      event.preventDefault();
      session.hud?.setScoreboard(true);
      return;
    }
    if (event.code === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (!el.pause.classList.contains('hidden')) resumeGame();
      else pauseGame();
      return;
    }
    if (event.repeat) return;
    if (event.code === 'KeyM') {
      const muted = audio.toggleMuted();
      session.hud?.showToast(muted ? 'AUDIO MUTED' : 'AUDIO ON', '#ffc857', 1500);
      return;
    }
    if (event.code === 'KeyF') {
      void toggleFullscreen();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'Tab') app.session?.hud?.setScoreboard(false);
  });

  document.addEventListener('pointerlockchange', () => {
    const session = app.session;
    if (!session) return;
    if (session.input.unlockedOverride) return;
    const locked = document.pointerLockElement === session.canvas;
    if (locked) {
      hidePause();
      if (session.deployed) {
        session.setPaused(false);
        session.input.setEnabled(true);
      }
    } else if (session.deployed && el.death.classList.contains('hidden')) {
      showPause();
    }
  });

  window.addEventListener('beforeunload', () => {
    try { app.room?.close(); } catch { /* noop */ }
  });
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  } catch (error) {
    console.warn('[NEONSTRIKE] fullscreen unavailable', error);
  }
}

// ---------------------------------------------------------------------------
// Test / automation hooks
// ---------------------------------------------------------------------------

function recordSnapshot(record) {
  if (!record) return null;
  return {
    id: record.id,
    name: record.name,
    color: record.color,
    isLocal: Boolean(record.isLocal),
    isBot: Boolean(record.isBot),
    alive: Boolean(record.alive),
    health: Math.round(record.health * 10) / 10,
    kills: record.kills || 0,
    deaths: record.deaths || 0,
    weapon: record.weaponId,
    pos: [record.pos.x, record.pos.y, record.pos.z],
    yaw: record.yaw,
    pitch: record.pitch,
    crouch: Boolean(record.crouch),
  };
}

const testApi = {
  app,
  registry,
  get session() { return app.session; },
  get room() { return app.room; },
  state() {
    const session = app.session;
    if (!session) return null;
    return {
      roomCode: session.roomCode,
      practice: session.practice,
      isHost: session.isAuthority,
      isGuest: Boolean(session.room && !session.room.isHost),
      localId: session.localId,
      deployed: session.deployed,
      paused: session.paused,
      matchTime: session.matchTime,
      weapon: session.weaponId,
      ammo: session.weapon?.ammo ?? null,
      reserve: session.weapon?.reserve ?? null,
      reloading: Boolean(session.weapon?.reloading),
      aiming: Boolean(session.aiming),
      crosshairTarget: Boolean(session.crosshairTarget),
      guestCount: session.room?.guestCount?.() ?? 0,
      local: recordSnapshot(session.localRecord),
      records: [...session.records.values()].map(recordSnapshot),
      pickups: session.stage.pickups.map((pickup) => ({ id: pickup.id, available: pickup.available })),
      deployedPlayers: [...session.records.values()].filter((record) => !record.isBot).length,
    };
  },
  async host({ code = 'TEST', name = 'HOST', deploy = true } = {}) {
    el.name.value = name;
    el.room.value = sanitizeRoomCode(code);
    const ok = await hostGame();
    if (ok && deploy) deployGame({ requestLock: false });
    return ok ? this.state() : null;
  },
  async guest({ code = 'TEST', name = 'GUEST', deploy = true } = {}) {
    el.name.value = name;
    el.room.value = sanitizeRoomCode(code);
    const ok = await joinGame();
    if (ok && deploy) deployGame({ requestLock: false });
    return ok ? this.state() : null;
  },
  async practice({ name = 'TESTER', deploy = true } = {}) {
    el.name.value = name;
    startPractice();
    if (deploy) deployGame({ requestLock: false });
    return this.state();
  },
  deploy(options = {}) { deployGame({ requestLock: false, ...options }); return this.state(); },
  pause() { pauseGame(); },
  resume() { resumeGame(); },
  leave() { leaveGame(); },
  setUnlockedInput(value = true) {
    app.session?.input.setUnlockedOverride(value);
    if (value) app.session?.input.setEnabled(true);
  },
  key(code, down = true) {
    const input = app.session?.input;
    if (!input) return;
    if (down) {
      if (!input.keys.has(code)) input.pressed.add(code);
      input.keys.add(code);
    } else {
      input.keys.delete(code);
    }
  },
  tap(code) {
    const input = app.session?.input;
    if (!input) return;
    input.pressed.add(code);
  },
  mouse(button = 0, down = true) {
    const input = app.session?.input;
    if (!input) return;
    if (down && !input.mouse[button]) input.mousePressed.add(button);
    input.mouse[button] = Boolean(down);
  },
  look(dx = 0, dy = 0) {
    const input = app.session?.input;
    if (!input) return;
    input.lookX += dx;
    input.lookY += dy;
  },
  selectWeapon(id) {
    const session = app.session;
    if (!session) return null;
    const index = session.loadout.findIndex((weapon) => weapon.id === id);
    if (index < 0) return null;
    session.switchWeapon(index);
    return session.weaponId;
  },
  reload() {
    app.session?.combat?.startReload();
    return Boolean(app.session?.weapon?.reloading);
  },
  fire() {
    const session = app.session;
    if (!session) return;
    session.combat?._tryFireLocal(session.localRecord, session.weapon);
  },
  aimAt(targetId, { head = false } = {}) {
    const session = app.session;
    if (!session || !targetId) return;
    const target = session.records.get(targetId);
    if (!target) return;
    const local = session.localRecord;
    const eye = 1.66;
    const dx = target.pos.x - local.pos.x;
    const dz = target.pos.z - local.pos.z;
    const yaw = Math.atan2(-dx, -dz);
    const targetY = target.pos.y + (head ? 1.62 : 1.0);
    const pitch = Math.atan2(targetY - (local.pos.y + eye), Math.max(0.05, Math.hypot(dx, dz)));
    local.yaw = yaw;
    local.pitch = pitch;
    if (local.body) {
      local.body.yaw = yaw;
      local.body.pitch = pitch;
    }
  },
  aimAtNearest({ head = false } = {}) {
    const session = app.session;
    if (!session) return null;
    const targets = session.getDamageableTargets(session.localId);
    if (!targets.length) return null;
    let closest = targets[0].state;
    for (const entry of targets) {
      if (entry.state.pos.distanceToSquared(session.localRecord.pos)
        < closest.pos.distanceToSquared(session.localRecord.pos)) closest = entry.state;
    }
    this.aimAt(closest.id, { head });
    return closest.id;
  },
  teleport(x, y, z) {
    const session = app.session;
    if (!session) return;
    const local = session.localRecord;
    local.pos.set(Number(x) || 0, Number(y) || 1, Number(z) || 0);
    local.vel.set(0, 0, 0);
    if (local.body) {
      local.body.pos.copy(local.pos);
      local.body.vel.set(0, 0, 0);
      local.body.grounded = false;
    }
  },
  advance(seconds = 1) {
    const session = app.session;
    if (!session) return null;
    const steps = Math.max(1, Math.min(1200, Math.round(Number(seconds) * 60)));
    for (let i = 0; i < steps; i += 1) session.fixedUpdate(1 / 60);
    session.input.endFrame();
    return this.state();
  },
  placeAhead(id, distance = 6, lateral = 0) {
    const session = app.session;
    const target = session?.records.get(id);
    const local = session?.localRecord;
    if (!target || !local) return null;
    const yaw = local.yaw;
    const fx = -Math.sin(yaw);
    const fz = -Math.cos(yaw);
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    target.pos.set(
      local.pos.x + fx * distance + rx * lateral,
      local.pos.y + 0.02,
      local.pos.z + fz * distance + rz * lateral,
    );
    target.vel.set(0, 0, 0);
    target.alive = true;
    target.health = target.maxHealth;
    target.invulnerableUntil = 0;
    if (target.body) {
      target.body.pos.copy(target.pos);
      target.body.vel.set(0, 0, 0);
      target.body.grounded = false;
    }
    target.avatar?.setAlive?.(true);
    target.avatar?.setHealth?.(target.health);
    return recordSnapshot(target);
  },
  setHealth(id, health = 100) {
    const session = app.session;
    const record = session?.records.get(id);
    if (!record) return null;
    record.health = Math.max(0, Math.min(record.maxHealth, Number(health) || 0));
    record.avatar?.setHealth?.(record.health);
    return recordSnapshot(record);
  },
  triggers(kind = null) {
    const triggers = app.session?.physics?.triggers ?? [];
    return triggers
      .filter((trigger) => !kind || trigger.kind === kind)
      .map((trigger) => ({
        kind: trigger.kind,
        id: trigger.id,
        enabled: trigger.enabled,
        center: [
          (trigger.box.min.x + trigger.box.max.x) / 2,
          (trigger.box.min.y + trigger.box.max.y) / 2,
          (trigger.box.min.z + trigger.box.max.z) / 2,
        ],
        size: [
          trigger.box.max.x - trigger.box.min.x,
          trigger.box.max.y - trigger.box.min.y,
          trigger.box.max.z - trigger.box.min.z,
        ],
        data: trigger.data
          ? {
            damage: trigger.data.damage,
            power: trigger.data.power,
            gravityScale: trigger.data.gravityScale,
            updraft: trigger.data.updraft,
            channel: trigger.data.channel,
            label: trigger.data.label,
            targetLabel: trigger.data.targetLabel,
            target: trigger.data.target
              ? [trigger.data.target.x, trigger.data.target.y, trigger.data.target.z]
              : null,
          }
          : null,
      }));
  },
  damage(targetId, amount = 25) {
    const session = app.session;
    if (!session) return null;
    return session.applyDamage(targetId, amount, session.localId, 'weapon', { weaponId: session.weaponId });
  },
  kill(targetId) {
    return this.damage(targetId, 999);
  },
  respawn(targetId) {
    const session = app.session;
    const target = session?.records.get(targetId);
    if (target) session.respawnRecord(target);
  },
  setPaused(value = true) {
    const session = app.session;
    if (!session) return;
    session.setPaused(value);
  },
  record(id) {
    return recordSnapshot(app.session?.records.get(id));
  },
};

window.__neonstrike = testApi;

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function boot() {
  refreshWeaponList();
  wireMenuUI();
  wireSettingsUI();
  wireNetUI();
  wireGlobalKeys();
  syncSettingsUI();
  setStatus('ネットワーク待機中', '');
  el.death.classList.add('hidden');
}

boot();
