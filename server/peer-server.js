/**
 * Standalone PeerJS signalling server for NEON//STRIKE.
 *
 *   npm run signal
 *   -> ws://localhost:9000/  (key: peerjs)
 *
 * The browser-only app uses the public PeerJS cloud by default. This optional
 * server is only for LAN / self-hosted signaling. Run it, then enter the host
 * in the advanced network settings or append:
 *   ?peerhost=127.0.0.1&peerport=9000&peerpath=/&peersecure=0
 */
import os from 'node:os';
import { PeerServer } from 'peer';

const port = Number(process.env.PEER_PORT || process.env.PORT || 9000);
const host = process.env.PEER_HOST || '0.0.0.0';
const path = process.env.PEER_PATH || '/';
const key = process.env.PEER_KEY || 'peerjs';

function lanAddresses() {
  const addresses = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const info of list || []) {
      if (info.family === 'IPv4' && !info.internal) addresses.push(info.address);
    }
  }
  return addresses;
}

const server = PeerServer({ port, host, path, key, allow_discovery: true }, () => {
  const scheme = 'ws';
  console.log('');
  console.log('  NEON//STRIKE signalling server');
  console.log(`  ${scheme}://localhost:${port}${path}  (key: ${key})`);
  for (const address of lanAddresses()) {
    console.log(`  ${scheme}://${address}:${port}${path}  (LAN)`);
  }
  console.log('');
  console.log('  Menu > 詳細ネットワーク設定 で HOST / PORT / PATH / KEY を指定してください。');
  console.log('  Ctrl+C で停止');
  console.log('');
});

let online = 0;

server.on('connection', (client) => {
  online += 1;
  console.log(`[signal] + ${client?.getId?.() ?? 'client'} (online: ${online})`);
});

server.on('disconnect', (client) => {
  online = Math.max(0, online - 1);
  console.log(`[signal] - ${client?.getId?.() ?? 'client'} (online: ${online})`);
});

server.on('error', (error) => {
  console.error('[signal] server error', error);
});

function shutdown() {
  console.log('\n[signal] shutting down…');
  try { server.close?.(); } catch { /* noop */ }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
