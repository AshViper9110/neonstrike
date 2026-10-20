import Peer from 'peerjs';
import { EventBus } from '../core/EventBus.js';
import { sanitizeName, isValidRoomCode } from '../core/utils.js';

export const PROTOCOL_VERSION = 1;
export const HOST_PREFIX = 'neonstrike-v1-';
// Keep a single attempt short enough that a fresh retry still fits in a
// reasonable total wait. A stalled ICE/DTLS negotiation never errors by
// itself, so the app retries with a new Peer after this timeout.
export const CONNECT_TIMEOUT_MS = 10000;

export const MSG = Object.freeze({
  HELLO: 'hello',
  WELCOME: 'welcome',
  REJECT: 'reject',
  STATE: 'state',
  SNAPSHOT: 'snapshot',
  HIT: 'hit',
  HAZARD: 'hazard',
  HEAL: 'heal',
  RESPAWN: 'respawn',
  FIRE: 'fire',
  PROJECTILE: 'projectile',
  DAMAGE: 'damage',
  KILL: 'kill',
  LOADOUT: 'loadout',
  MATCH_START: 'match-start',
  PING: 'ping',
  PONG: 'pong',
  BYE: 'bye',
  CHAT: 'chat',
});

export function roomToPeerId(code) {
  return `${HOST_PREFIX}${String(code).toLowerCase()}`;
}

export function makePeerOptions(netConfig = {}) {
  const localSignaling = Boolean(netConfig.host);
  const options = {
    debug: 1,
    config: {
      // A local PeerServer is normally used inside one LAN, where host
      // candidates connect directly. Skip external STUN so a blocked or slow
      // STUN request cannot delay/fail an otherwise local connection.
      ...(localSignaling ? {} : {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      }),
      iceCandidatePoolSize: 4,
    },
  };
  if (localSignaling) {
    options.host = String(netConfig.host).trim();
    options.secure = Boolean(netConfig.secure);
    const port = Number(netConfig.port);
    if (Number.isFinite(port) && port > 0) options.port = port;
    options.path = netConfig.path?.trim() || '/';
    options.key = netConfig.key?.trim() || 'peerjs';
  }
  return options;
}

export function describePeerError(error) {
  const type = error?.type || error?.name || 'unknown';
  switch (type) {
    case 'unavailable-id':
      return { code: 'room-in-use', message: 'このルームコードは既に使用されています。別のコードを試してください。' };
    case 'peer-unavailable':
      return { code: 'host-not-found', message: 'ホストが見つかりません。ルームコードを確認してください。' };
    case 'network':
    case 'server-error':
    case 'socket-error':
    case 'socket-closed':
      return { code: 'signal-error', message: 'シグナリングサーバーに接続できません。回線または詳細設定を確認してください。' };
    case 'browser-incompatible':
      return { code: 'unsupported', message: 'このブラウザはWebRTC / PeerJSに対応していません。' };
    case 'webrtc':
      return { code: 'webrtc', message: 'P2P接続の確立に失敗しました。別のネットワークで再試行してください。' };
    default:
      return { code: type, message: `接続エラーが発生しました (${type})。` };
  }
}

function normalizeData(data) {
  if (data == null) return null;
  if (typeof data === 'object' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) return data;
  try {
    if (typeof data === 'string') return JSON.parse(data);
  } catch {
    return null;
  }
  return null;
}

export class PeerRoom extends EventBus {
  constructor({ role, code, name, netConfig }) {
    super();
    this.role = role;
    this.code = String(code || '').toUpperCase();
    this.name = sanitizeName(name);
    this.netConfig = netConfig || {};
    this.peer = null;
    this.conn = null;
    this.selfId = null;
    this.opened = false;
    this.sessionReady = false;
    this.closed = false;
    this.peerId = role === 'host' ? roomToPeerId(this.code) : null;
    this.connectionsByPlayer = new Map();
    this.playersByPeer = new Map();
    this.lastDataAt = 0;
    this.lastPingAt = 0;
    this.ping = null;
    this._pendingMessages = [];
    this._pendingJoins = new Map();
    this._joinTimers = new Map();
    this._connectTimer = null;
    this._pingTimer = null;
    this._healthTimer = null;
    this._connSeq = 0;
    this._welcomeReceived = false;
    this._left = false;
    this._limiter = new Map();
  }

  on(type, handler) {
    const off = super.on(type, handler);
    // A guest can reach the room between PeerJS opening and the host UI
    // creating its session. Hold those HELLOs instead of rejecting them, then
    // deliver them as soon as a join handler is attached.
    if (type === 'join-request') this._flushPendingJoins();
    return off;
  }

  get isHost() {
    return this.role === 'host';
  }

  get hostId() {
    return roomToPeerId(this.code);
  }

  _setFailure(error) {
    this.lastError = describePeerError(error);
    this.emit('fatal-error', this.lastError);
    return this.lastError;
  }

  async openHost() {
    if (!isValidRoomCode(this.code)) throw new Error('invalid-room-code');
    this._createPeer(this.peerId);
    this.peer.on('connection', (conn) => this._handleIncoming(conn));
    await this._waitForPeerOpen();
    if (this.closed) throw new Error('closed');
    this.opened = true;
    this.selfId = 'host';
    this.peer.on('disconnected', () => {
      if (this.closed) return;
      this.emit('signaling-lost');
      this._tryReconnect();
    });
    this.peer.on('error', (error) => this._handleRuntimePeerError(error));
    this._startHealthTimer();
    return this;
  }

  async connectToHost() {
    if (!isValidRoomCode(this.code)) throw new Error('invalid-room-code');
    this._createPeer(undefined);
    await this._waitForPeerOpen();
    if (this.closed) throw new Error('closed');

    const welcome = await new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        fn(value);
      };
      const timer = setTimeout(() => {
        finish(reject, { code: 'timeout', message: '接続がタイムアウトしました。ホストの状態とルームコードを確認してください。' });
        this._safeCloseConnection();
      }, CONNECT_TIMEOUT_MS);

      const conn = this.peer.connect(this.hostId, {
        reliable: true,
        serialization: 'json',
        metadata: { name: this.name, protocol: PROTOCOL_VERSION },
      });
      if (!conn) {
        finish(reject, { code: 'connection-failed', message: '接続を開始できませんでした。' });
        return;
      }
      this.conn = conn;

      conn.on('open', () => {
        this.lastDataAt = performance.now();
        this._sendRaw({
          t: MSG.HELLO,
          v: PROTOCOL_VERSION,
          name: this.name,
          clientTime: Date.now(),
        });
      });
      conn.on('data', (raw) => {
        this.lastDataAt = performance.now();
        const message = normalizeData(raw);
        if (!message) return;
        if (message.t === MSG.WELCOME && !this._welcomeReceived) {
          this._welcomeReceived = true;
          this.opened = true;
          this.selfId = message.selfId;
          this.ping = 0;
          this._startGuestTimers();
          finish(resolve, message);
          return;
        }
        if (message.t === MSG.REJECT) {
          finish(reject, {
            code: message.code || 'rejected',
            message: message.reason || 'ホストに接続を拒否されました。',
          });
          this._safeCloseConnection();
          return;
        }
        this._dispatchHostMessage(message);
      });
      conn.on('close', () => {
        if (!this._welcomeReceived) {
          finish(reject, { code: 'connection-closed', message: 'ホストとの接続が確立できませんでした。' });
        } else if (!this.closed) {
          this._handleHostLost('ホストとの接続が切断されました。');
        }
      });
      conn.on('error', (error) => {
        console.warn('[PeerRoom] data connection error', error);
        if (!this._welcomeReceived) {
          finish(reject, describePeerError(error));
        }
      });
      this.peer.on('error', (error) => {
        const friendly = describePeerError(error);
        if (!this._welcomeReceived) {
          finish(reject, friendly);
        } else if (friendly.code === 'signal-error') {
          this.emit('signaling-lost');
        }
      });
      this.peer.on('disconnected', () => {
        if (!this.closed) this.emit('signaling-lost');
      });
    });

    this.opened = true;
    this.selfId = welcome.selfId;
    return welcome;
  }

  _createPeer(id) {
    const options = makePeerOptions(this.netConfig);
    try {
      this.peer = id ? new Peer(id, options) : new Peer(options);
    } catch (error) {
      this.lastError = { code: 'peer-init', message: 'PeerJSの初期化に失敗しました。' };
      throw this.lastError;
    }
  }

  _waitForPeerOpen() {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject({ code: 'peer-init', message: 'PeerJSが初期化されていません。' });
        return;
      }
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        try { this.peer.destroy(); } catch { /* noop */ }
        reject({ code: 'timeout', message: 'シグナリングサーバーへの接続がタイムアウトしました。詳細設定を確認してください。' });
      }, CONNECT_TIMEOUT_MS);

      this.peer.on('open', (id) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.signalId = id;
        if (!this.isHost) this.selfId = id;
        this.emit('peer-open', id);
        resolve();
      });
      this.peer.on('error', (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const friendly = this._setFailure(error);
        reject(friendly);
      });
    });
  }

  _handleRuntimePeerError(error) {
    console.warn('[PeerRoom] runtime peer error', error);
    const friendly = describePeerError(error);
    if (friendly.code === 'signal-error') {
      this.emit('signaling-lost');
      this._tryReconnect();
    } else {
      this.emit('warning', friendly);
    }
  }

  _tryReconnect() {
    if (!this.peer || this.peer.destroyed || this.peer.disconnected === false) return;
    setTimeout(() => {
      if (this.closed || !this.peer || this.peer.destroyed) return;
      try { this.peer.reconnect(); } catch { /* noop */ }
    }, 1200);
  }

  _handleIncoming(conn) {
    if (this.closed) {
      try { conn.close(); } catch { /* noop */ }
      return;
    }

    // PeerJS normally gives every client a unique peer ID for its lifetime.
    // If a second connection arrives for an existing peer, keep the original:
    // its close event must never be able to evict the live player mapping.
    const existingPlayerId = this.playersByPeer.get(conn.peer);
    if (existingPlayerId) {
      const active = this.connectionsByPlayer.get(existingPlayerId);
      if (active && active !== conn) {
        console.warn('[PeerRoom] duplicate connection for peer, closing', conn.peer);
        try { conn.close(); } catch { /* noop */ }
        return;
      }
    }

    conn._neonConnId = ++this._connSeq;
    conn.on('data', (raw) => this._handleIncomingData(conn, raw));
    conn.on('close', () => {
      this._dropPendingJoin(conn);
      this._handleGuestClosed(conn);
    });
    conn.on('error', (error) => {
      console.warn('[PeerRoom] guest connection error', error);
      this._dropPendingJoin(conn);
      this._handleGuestClosed(conn);
    });
  }

  _flushPendingJoins() {
    if (this.closed || this.listenerCount('join-request') === 0) return;
    const pending = [...this._pendingJoins.values()];
    this._pendingJoins.clear();
    for (const { conn, request } of pending) {
      if (conn._neonJoined) continue;
      this.emit('join-request', request);
    }
  }

  _armJoinTimeout(conn) {
    this._clearJoinTimeout(conn.peer);
    const timer = setTimeout(() => {
      this._joinTimers.delete(conn.peer);
      if (this.playersByPeer.has(conn.peer)) return;
      this._pendingJoins.delete(conn.peer);
      this._rejectGuest(conn, 'timeout', 'ホストの応答がありません。');
    }, 5000);
    this._joinTimers.set(conn.peer, timer);
  }

  _clearJoinTimeout(peerId) {
    const timer = this._joinTimers.get(peerId);
    if (timer) clearTimeout(timer);
    this._joinTimers.delete(peerId);
  }

  _dropPendingJoin(conn) {
    this._pendingJoins.delete(conn.peer);
    if (!this.playersByPeer.has(conn.peer)) this._clearJoinTimeout(conn.peer);
  }

  _handleIncomingData(conn, raw) {
    const message = normalizeData(raw);
    if (!message || typeof message.t !== 'string') return;

    const playerId = this.playersByPeer.get(conn.peer);
    if (!playerId) {
      if (message.t !== MSG.HELLO || conn._neonJoined || conn._neonRejected) return;
      this.lastDataAt = performance.now();
      if (message.v !== PROTOCOL_VERSION) {
        this._rejectGuest(conn, 'protocol-mismatch', 'ゲームのバージョンが一致しません。ページを再読み込みしてください。');
        return;
      }
      if (this.playersByPeer.size >= 11) {
        this._rejectGuest(conn, 'room-full', 'ルームが満員です。');
        return;
      }
      // Duplicate HELLO before the host decision: keep waiting for the
      // existing request rather than creating a second record.
      if (this._joinTimers.has(conn.peer)) return;
      conn._neonName = sanitizeName(message.name);
      conn._neonHelloAt = performance.now();
      const request = {
        conn,
        name: conn._neonName,
        peerId: conn.peer,
        accept: (info) => this._acceptGuest(conn, info),
        reject: (code, reason) => this._rejectGuest(conn, code, reason),
      };
      this._armJoinTimeout(conn);
      if (this.listenerCount('join-request') > 0) {
        this.emit('join-request', request);
      } else {
        this._pendingJoins.set(conn.peer, { conn, request });
      }
      return;
    }

    this.lastDataAt = performance.now();
    conn._neonLastSeen = this.lastDataAt;
    if (!this._allowMessage(playerId, message.t)) return;

    if (message.t === MSG.PING) {
      this.sendTo(playerId, { t: MSG.PONG, ts: message.ts, serverTime: Date.now() });
      return;
    }
    if (message.t === MSG.BYE) {
      try { conn.close(); } catch { /* noop */ }
      this._handleGuestClosed(conn);
      return;
    }

    // Visual events are relayed to other players by the host automatically.
    if (message.t === MSG.FIRE || message.t === MSG.PROJECTILE) {
      message.from = playerId;
      this.broadcast(message, playerId);
    }
    this._emitSessionMessage(message, playerId);
  }

  _allowMessage(playerId, type) {
    const limits = {
      [MSG.STATE]: 50,
      [MSG.FIRE]: 30,
      [MSG.PROJECTILE]: 30,
      [MSG.HIT]: 20,
      [MSG.HAZARD]: 6,
      [MSG.HEAL]: 4,
      [MSG.LOADOUT]: 8,
      [MSG.PING]: 3,
      [MSG.CHAT]: 5,
    };
    const limit = limits[type];
    if (!limit) return false;
    const now = performance.now();
    const key = `${playerId}:${type}`;
    let bucket = this._limiter.get(key);
    if (!bucket || now - bucket.time > 1000) {
      bucket = { time: now, count: 0 };
      this._limiter.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > limit) return false;
    return true;
  }

  _acceptGuest(conn, info = {}) {
    if (this.playersByPeer.has(conn.peer) || conn._neonLeft || conn._neonRejected) return false;
    const playerId = String(info.playerId || '').slice(0, 40);
    if (!playerId || this.connectionsByPlayer.has(playerId)) {
      this._rejectGuest(conn, 'duplicate', '参加処理に失敗しました。もう一度お試しください。');
      return false;
    }
    this._pendingJoins.delete(conn.peer);
    this._clearJoinTimeout(conn.peer);
    conn._neonJoined = true;
    this.playersByPeer.set(conn.peer, playerId);
    this.connectionsByPlayer.set(playerId, conn);
    this.sendTo(playerId, {
      t: MSG.WELCOME,
      v: PROTOCOL_VERSION,
      selfId: playerId,
      code: this.code,
      ...info.welcome,
    });
    this.emit('guest-joined', { playerId, name: conn._neonName || info.name || 'PLAYER', peerId: conn.peer });
    return true;
  }

  _rejectGuest(conn, code, reason) {
    conn._neonRejected = true;
    this._pendingJoins.delete(conn.peer);
    this._clearJoinTimeout(conn.peer);
    try {
      if (conn.open) conn.send({ t: MSG.REJECT, code, reason });
    } catch { /* noop */ }
    setTimeout(() => {
      try { conn.close(); } catch { /* noop */ }
    }, 350);
  }

  _handleGuestClosed(conn) {
    if (!conn || conn._neonLeft) return;
    const playerId = this.playersByPeer.get(conn.peer);
    if (!playerId) return;
    // A close event from a superseded or duplicate connection must not remove
    // the player that is still connected on the active channel.
    const active = this.connectionsByPlayer.get(playerId);
    if (active && active !== conn) return;
    conn._neonLeft = true;
    this.playersByPeer.delete(conn.peer);
    this.connectionsByPlayer.delete(playerId);
    this._clearJoinTimeout(conn.peer);
    this._pendingJoins.delete(conn.peer);
    for (const key of this._limiter.keys()) {
      if (key.startsWith(`${playerId}:`)) this._limiter.delete(key);
    }
    this.emit('guest-left', { playerId });
  }

  _dispatchHostMessage(message) {
    if (message.t === MSG.PONG) {
      if (typeof message.ts === 'number') {
        this.ping = Math.max(0, Math.round(performance.now() - message.ts));
        this.emit('latency', this.ping);
      }
      return;
    }
    if (message.t === MSG.SNAPSHOT) {
      this.lastSnapshotAt = performance.now();
      this.emit('snapshot', message);
      return;
    }
    if (message.t === MSG.DAMAGE) {
      this.emit('damage', message);
    } else if (message.t === MSG.KILL) {
      this.emit('kill', message);
    }
    this._emitSessionMessage(message, 'host');
  }

  _emitSessionMessage(message, fromId) {
    const wrapped = { message, fromId };
    if (!this.sessionReady) {
      if (this._pendingMessages.length < 200) this._pendingMessages.push(wrapped);
      return;
    }
    this.emit('message', wrapped);
  }

  markSessionReady() {
    this.sessionReady = true;
    const pending = this._pendingMessages.splice(0);
    for (const { message, fromId } of pending) this.emit('message', { message, fromId });
  }

  _sendRaw(message) {
    try {
      if (this.conn?.open) {
        this.conn.send(message);
        return true;
      }
    } catch (error) {
      console.warn('[PeerRoom] send failed', error);
    }
    return false;
  }

  sendToHost(message) {
    if (this.isHost) return false;
    return this._sendRaw(message);
  }

  broadcast(message, exceptPlayerId = null) {
    if (!this.isHost) return 0;
    let sent = 0;
    for (const [playerId, conn] of this.connectionsByPlayer) {
      if (playerId === exceptPlayerId) continue;
      try {
        if (conn.open) {
          conn.send(message);
          sent += 1;
        }
      } catch (error) {
        console.warn('[PeerRoom] broadcast failed', error);
      }
    }
    return sent;
  }

  sendTo(playerId, message) {
    if (!this.isHost) return false;
    const conn = this.connectionsByPlayer.get(playerId);
    if (!conn?.open) return false;
    try {
      conn.send(message);
      return true;
    } catch (error) {
      console.warn('[PeerRoom] sendTo failed', error);
      return false;
    }
  }

  guestCount() {
    return this.connectionsByPlayer.size;
  }

  playerIds() {
    return [...this.connectionsByPlayer.keys()];
  }

  _startGuestTimers() {
    clearInterval(this._pingTimer);
    this.pingTimer = setInterval(() => {
      if (this.closed) return;
      this._sendRaw({ t: MSG.PING, ts: performance.now() });
    }, 2000);
    this._pingTimer = this.pingTimer;
  }

  _startHealthTimer() {
    clearInterval(this._healthTimer);
    this._healthTimer = setInterval(() => {
      if (this.closed) return;
      const now = performance.now();
      for (const [playerId, conn] of this.connectionsByPlayer) {
        if (conn._neonLeft) continue;
        const last = conn._neonLastSeen || conn._neonHelloAt || now;
        if (now - last > 14000) {
          console.warn('[PeerRoom] stale guest, closing', playerId);
          try { conn.close(); } catch { /* noop */ }
          this._handleGuestClosed(conn);
        }
      }
    }, 4000);
  }

  update() {
    if (this.closed) return;
    if (!this.isHost) {
      const now = performance.now();
      if (this._welcomeReceived && this.lastDataAt && now - this.lastDataAt > 11000) {
        this.lastDataAt = now;
        this._handleHostLost('ホストからの応答がありません。接続が切断された可能性があります。');
      }
    }
  }

  _handleHostLost(reason) {
    if (this.closed) return;
    this.emit('connection-lost', { reason });
  }

  _safeCloseConnection() {
    try { this.conn?.close(); } catch { /* noop */ }
    this.conn = null;
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    clearTimeout(this._connectTimer);
    for (const timer of this._joinTimers.values()) clearTimeout(timer);
    this._joinTimers.clear();
    this._pendingJoins.clear();
    clearInterval(this._pingTimer);
    clearInterval(this._healthTimer);
    try {
      if (this.conn?.open) this.conn.send({ t: MSG.BYE });
    } catch { /* noop */ }
    for (const conn of this.connectionsByPlayer.values()) {
      try { conn.close(); } catch { /* noop */ }
    }
    this.connectionsByPlayer.clear();
    this.playersByPeer.clear();
    try { this.conn?.close(); } catch { /* noop */ }
    try { this.peer?.destroy(); } catch { /* noop */ }
    this.peer = null;
    this.conn = null;
    this.opened = false;
    this.closed = true;
  }
}
