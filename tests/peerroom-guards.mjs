import assert from 'node:assert/strict';
import { PeerRoom } from '../src/net/PeerRoom.js';

function fakeConn(peer, open = true) {
  const handlers = new Map();
  return {
    peer,
    open,
    sent: [],
    handlers,
    on(event, handler) { handlers.set(event, handler); return this; },
    send(message) { this.sent.push(message); },
    close() { this.open = false; },
    fire(event, value) { handlers.get(event)?.(value); },
  };
}

// HELLO arriving before a join handler must wait instead of being rejected.
{
  const room = new PeerRoom({ role: 'host', code: 'TEST', name: 'HOST' });
  const conn = fakeConn('peer-a');
  room._handleIncoming(conn);
  room._handleIncomingData(conn, { t: 'hello', v: 1, name: 'GUEST' });
  assert.equal(room._pendingJoins.size, 1);
  assert.equal(room.guestCount(), 0);

  let request = null;
  room.on('join-request', (value) => { request = value; });
  assert.ok(request, 'pending request should flush when handler is attached');
  assert.equal(room._pendingJoins.size, 0);

  request.accept({ playerId: 'g_1', welcome: { players: [] } });
  assert.equal(room.guestCount(), 1);
  assert.equal(conn.sent[0].t, 'welcome');
  assert.equal(room._joinTimers.size, 0);
}

// A stale close from a superseded connection must not evict the active guest.
{
  const room = new PeerRoom({ role: 'host', code: 'TEST', name: 'HOST' });
  const conn = fakeConn('peer-a');
  room._handleIncoming(conn);
  room._handleIncomingData(conn, { t: 'hello', v: 1, name: 'GUEST' });
  let request = null;
  room.on('join-request', (value) => { request = value; });
  request.accept({ playerId: 'g_1', welcome: {} });
  let left = 0;
  room.on('guest-left', () => { left += 1; });

  const stale = fakeConn('peer-a');
  room._handleGuestClosed(stale);
  assert.equal(room.guestCount(), 1);
  assert.equal(left, 0);

  room._handleGuestClosed(conn);
  assert.equal(room.guestCount(), 0);
  assert.equal(left, 1);
}

// A rejected connection cannot be restarted by a duplicate HELLO.
{
  const room = new PeerRoom({ role: 'host', code: 'TEST', name: 'HOST' });
  const conn = fakeConn('peer-a');
  room._handleIncoming(conn);
  room._handleIncomingData(conn, { t: 'hello', v: 1, name: 'GUEST' });
  let request = null;
  room.on('join-request', (value) => { request = value; });
  request.reject('room-full', 'full');
  room._handleIncomingData(conn, { t: 'hello', v: 1, name: 'GUEST' });
  assert.equal(room._pendingJoins.size, 0);
  assert.equal(room._joinTimers.size, 0);
  assert.equal(room.guestCount(), 0);
}

// A second transport for an already-active peer is closed immediately.
{
  const room = new PeerRoom({ role: 'host', code: 'TEST', name: 'HOST' });
  const conn = fakeConn('peer-a');
  room._handleIncoming(conn);
  room._handleIncomingData(conn, { t: 'hello', v: 1, name: 'GUEST' });
  let request = null;
  room.on('join-request', (value) => { request = value; });
  request.accept({ playerId: 'g_1', welcome: {} });
  const duplicate = fakeConn('peer-a');
  room._handleIncoming(duplicate);
  assert.equal(duplicate.open, false);
  assert.equal(room.guestCount(), 1);
}

console.log('PeerRoom guard checks passed');
