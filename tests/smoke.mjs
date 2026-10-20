/**
 * End-to-end smoke test for NEON//STRIKE.
 *
 *   node tests/smoke.mjs
 *
 * Starts an isolated Vite dev server and PeerJS signalling server, launches
 * headless Chrome via playwright-core, then verifies:
 *   - practice movement, jumping, all five weapons, reload, kill/respawn,
 *     health pickups and stage gimmicks
 *   - two-peer room join, state sync, damage both ways, healing, kill/respawn,
 *     guest leave handling and host-loss detection
 *
 * Environment:
 *   CHROME_PATH  override the Chrome executable
 *   SMOKE_HEAD   set to 1 to watch the browser
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HEADLESS = process.env.SMOKE_HEAD !== '1';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const results = [];
const pageErrors = [];

function check(name, passed, detail = null) {
  const ok = Boolean(passed);
  results.push({ name, ok, detail });
  const suffix = detail == null ? '' : ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${suffix}`);
  return ok;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function waitForPort(port, timeout = 15000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ port, host: '127.0.0.1' });
      socket.setTimeout(750);
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('timeout', () => {
        socket.destroy();
        retry();
      });
      socket.once('error', () => {
        socket.destroy();
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - started > timeout) reject(new Error(`Timed out waiting for port ${port}`));
      else setTimeout(attempt, 180);
    };
    attempt();
  });
}

async function waitForHttp(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* server not ready */ }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startProcess(label, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
  const log = [];
  const capture = (chunk) => {
    const text = chunk.toString();
    log.push(text);
    if (process.env.SMOKE_VERBOSE === '1') process.stdout.write(`[${label}] ${text}`);
  };
  child.stdout?.on('data', capture);
  child.stderr?.on('data', capture);
  child.once('exit', (code) => {
    if (code && code !== 0) console.warn(`[${label}] exited with code ${code}`);
  });
  return {
    child,
    tail: (lines = 12) => log.join('').split(/\r?\n/).slice(-lines).join('\n'),
  };
}

async function stopProcess(proc) {
  if (!proc?.child || proc.child.killed) return;
  try { proc.child.kill('SIGTERM'); } catch { /* noop */ }
  await sleep(250);
  if (proc.child.exitCode == null) {
    try { proc.child.kill('SIGKILL'); } catch { /* noop */ }
  }
}

async function newPage(browser, baseUrl, label) {
  const context = await browser.newContext({ viewport: { width: 720, height: 405 } });
  await context.addInitScript(() => {
    try {
      localStorage.setItem('neonstrike.settings.v1', JSON.stringify({
        sensitivity: 1,
        fov: 82,
        volume: 0,
        quality: 'low',
        showFps: false,
        ambientAudio: false,
      }));
    } catch { /* storage disabled */ }
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => {
    pageErrors.push(`[${label}] ${error.message}`);
    console.log(`[${label}] pageerror: ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (text.includes('favicon')) return;
    pageErrors.push(`[${label}] console: ${text}`);
    console.log(`[${label}] console error: ${text}`);
  });
  await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => Boolean(window.__neonstrike), null, { timeout: 30000 });
  await page.waitForTimeout(300);
  return { context, page };
}

async function state(page) {
  return page.evaluate(() => window.__neonstrike.state());
}

async function practiceChecks(page) {
  const output = await page.evaluate(() => {
    const api = window.__neonstrike;
    const out = {};
    api.practice({ name: 'TESTER' });
    for (const controller of api.session.botControllers.values()) controller.update = () => {};
    api.advance(1.5);

    api.teleport(6, 0.05, 29);
    api.session.localRecord.yaw = 0;
    api.session.localRecord.pitch = 0;
    api.advance(0.1);

    const start = api.state().local.pos;
    api.key('KeyW', true);
    api.advance(0.5);
    api.key('KeyW', false);
    const end = api.state().local.pos;
    out.moved = +Math.hypot(end[0] - start[0], end[2] - start[2]).toFixed(2);

    api.tap('Space');
    api.advance(0.15);
    out.jumpHeight = api.state().local.pos[1];
    api.advance(0.9);

    api.key('Digit3', true);
    api.advance(0.06);
    api.key('Digit3', false);
    out.weaponSwitch = api.state().weapon;
    api.selectWeapon('pulse');

    const botId = api.state().records.find((record) => record.isBot)?.id;
    out.weapons = [];
    for (const id of ['pulse', 'volt', 'scatter', 'rail']) {
      api.placeAhead(botId, 6);
      api.selectWeapon(id);
      api.aimAt(botId);
      api.advance(0.06);
      const hpBefore = api.record(botId).health;
      const crosshair = api.state().crosshairTarget;
      api.fire();
      api.advance(0.06);
      out.weapons.push({
        id,
        hpBefore,
        hpAfter: api.record(botId).health,
        crosshair,
        ammo: api.state().ammo,
      });
    }

    // Nova direct hit + nearby splash target in a fresh clear lane.
    const secondBotId = api.state().records.find((record) => record.isBot && record.id !== botId)?.id;
    api.teleport(6, 0.05, 29);
    api.session.localRecord.yaw = 0;
    api.session.localRecord.pitch = 0;
    api.advance(0.1);
    api.placeAhead(botId, 8);
    api.placeAhead(secondBotId, 8, 2);
    api.selectWeapon('nova');
    api.aimAt(botId);
    const novaBefore = api.record(botId).health;
    const splashBefore = api.record(secondBotId).health;
    api.fire();
    api.advance(0.5);
    out.nova = {
      hpBefore: novaBefore,
      hpAfter: api.record(botId).health,
      splashBefore,
      splashAfter: api.record(secondBotId).health,
      ammo: api.state().ammo,
      projectiles: api.session.projectiles.projectiles.length,
    };

    // Reload: PULSE-9 magazine is 14.
    api.selectWeapon('pulse');
    api.fire();
    api.advance(0.05);
    const ammoAfterShot = api.state().ammo;
    out.reloadStarted = api.reload();
    api.advance(1.3);
    out.reload = {
      ammoAfterShot,
      ammoAfter: api.state().ammo,
      reloading: api.state().reloading,
    };

    out.death = api.record(secondBotId);
    api.kill(secondBotId);
    api.advance(0.05);
    out.kill = { alive: api.record(secondBotId).alive, kills: api.state().local.kills };
    api.advance(3.6);
    out.respawn = {
      alive: api.record(secondBotId).alive,
      deaths: api.record(secondBotId).deaths,
    };

    const pickup = api.session.stage.pickups.find((item) => item.available);
    api.setHealth('local', 40);
    api.teleport(pickup.pos.x, pickup.pos.y + 0.05, pickup.pos.z);
    api.advance(0.3);
    out.pickup = {
      id: pickup.id,
      before: 40,
      after: api.state().local.health,
      unavailable: api.state().pickups.filter((item) => !item.available).map((item) => item.id),
    };

    const pad = api.triggers('jumpPad')[0];
    if (pad) {
      api.teleport(pad.center[0], pad.center[1], pad.center[2]);
      api.advance(0.05);
      out.jumpPad = {
        vy: api.session.localRecord.body.vel.y,
        y: api.state().local.pos[1],
      };
    }

    const teleporter = api.triggers('teleporter')[0];
    out.teleporters = api.triggers('teleporter').map(({ data }) => ({
      channel: data.channel,
      label: data.label,
      targetLabel: data.targetLabel,
    }));
    if (teleporter) {
      api.teleport(teleporter.center[0], teleporter.center[1], teleporter.center[2]);
      api.advance(0.05);
      const now = api.state().local.pos;
      const target = teleporter.data.target;
      out.teleport = {
        distance: +Math.hypot(now[0] - target[0], now[1] - target[1], now[2] - target[2]).toFixed(2),
      };
    }

    const gravity = api.triggers('gravity')[0];
    if (gravity) {
      api.teleport(gravity.center[0], gravity.center[1], gravity.center[2]);
      api.advance(0.05);
      out.gravity = {
        gravityScale: api.session.localRecord.body.gravityScale,
        updraft: api.session.localRecord.body.updraft,
      };
    }

    out.hud = {
      canvas: Boolean(document.getElementById('game-canvas')),
      ammo: Boolean(document.getElementById('ammo-main')),
      health: Boolean(document.getElementById('health-value')),
    };

    // Enemy readability: hostile rim/marker exist, and distant nameplates grow
    // instead of shrinking into unreadable pixels.
    const visibilityAvatar = api.session.records.get(secondBotId)?.avatar;
    visibilityAvatar.setCameraDistance(9);
    const nearNameWidth = visibilityAvatar.nameSprite.scale.x;
    visibilityAvatar.setCameraDistance(30);
    const farNameWidth = visibilityAvatar.nameSprite.scale.x;
    out.visibility = {
      outlines: visibilityAvatar.outlineMaterials.length,
      marker: Boolean(visibilityAvatar.markerGroup),
      aura: Boolean(visibilityAvatar.aura),
      markerAlive: visibilityAvatar.markerGroup.visible === visibilityAvatar.alive,
      nearNameWidth,
      farNameWidth,
    };

    // Effects must be advanced by the simulation; otherwise tracers never
    // disappear and recoil/damage shake accumulates forever.
    api.session.effects.addShake(0.4);
    out.effects = { shakeBefore: api.session.effects.shake };
    api.advance(1.2);
    out.effects.shakeAfter = +api.session.effects.shake.toFixed(4);
    out.effects.transients = api.session.effects.transients.length;

    out.fps = Math.round(api.session.fps);
    return out;
  });

  check('practice: player moves', output.moved > 2, `${output.moved} m`);
  check('practice: jump leaves ground', output.jumpHeight > 0.7, `${output.jumpHeight.toFixed(2)} m`);
  check('practice: number key switches weapon', output.weaponSwitch === 'scatter', output.weaponSwitch);
  for (const weapon of output.weapons) {
    check(
      `practice: ${weapon.id} damages target`,
      weapon.hpAfter < weapon.hpBefore && weapon.crosshair,
      `${weapon.hpBefore} -> ${weapon.hpAfter}, crosshair=${weapon.crosshair}`,
    );
  }
  check(
    'practice: nova direct hit kills',
    output.nova.hpAfter === 0,
    `${output.nova.hpBefore} -> ${output.nova.hpAfter}`,
  );
  check(
    'practice: nova splash damages nearby target',
    output.nova.splashAfter < output.nova.splashBefore,
    `${output.nova.splashBefore} -> ${output.nova.splashAfter}`,
  );
  check('practice: nova projectile resolved', output.nova.projectiles === 0);
  check(
    'practice: reload completes',
    output.reloadStarted && !output.reload.reloading && output.reload.ammoAfter > output.reload.ammoAfterShot,
    output.reload,
  );
  check('practice: kill registers', output.kill.alive === false && output.kill.kills >= 1, output.kill);
  check('practice: bot respawns', output.respawn.alive === true && output.respawn.deaths >= 1, output.respawn);
  check(
    'practice: health pickup heals',
    output.pickup.after > output.pickup.before && output.pickup.unavailable.includes(output.pickup.id),
    output.pickup,
  );
  check('practice: jump pad launches', output.jumpPad?.vy > 10, output.jumpPad);
  check('practice: teleporter moves player', output.teleport?.distance < 1.2, output.teleport);
  check(
    'practice: teleporter pads link within their channel',
    output.teleporters?.length === 4
      && output.teleporters.every((pad) => pad.channel && pad.targetLabel?.startsWith(pad.channel)),
    output.teleporters,
  );
  check(
    'practice: gravity zone applies modifiers',
    output.gravity?.gravityScale < 1 && output.gravity?.updraft > 0,
    output.gravity,
  );
  check(
    'practice: screen shake decays to rest',
    output.effects.shakeBefore >= 0.3 && output.effects.shakeAfter < 0.01,
    output.effects,
  );
  check(
    'practice: tracers and effects expire',
    output.effects.transients === 0,
    output.effects,
  );
  check('practice: HUD mounted', output.hud.canvas && output.hud.ammo && output.hud.health, output.hud);
  check(
    'practice: enemy rim and marker render',
    output.visibility.outlines >= 8 && output.visibility.marker && output.visibility.aura && output.visibility.markerAlive,
    output.visibility,
  );
  check(
    'practice: enemy nameplate scales at range',
    output.visibility.farNameWidth > output.visibility.nearNameWidth * 1.5,
    output.visibility,
  );
}

async function networkChecks({ hostPage, guestPage, hostId, guestId }) {
  const hostStart = await state(hostPage);
  const guestStart = await state(guestPage);
  check('network: host deployed with two players', hostStart.deployedPlayers === 2 && hostStart.deployed);
  check('network: guest deployed with two players', guestStart.deployedPlayers === 2 && guestStart.deployed);
  check('network: host sees guest record', hostStart.records.some((record) => record.id === guestId), guestId);
  check('network: guest sees host record', guestStart.records.some((record) => record.id === hostId), hostId);

  // Deterministic arena positions: host and guest face each other in the clear
  // south lane. `invulnerableUntil` is zeroed to skip spawn protection.
  await hostPage.evaluate(() => {
    const api = window.__neonstrike;
    const session = api.session;
    const local = session.localRecord;
    api.teleport(6, 0.05, 29);
    local.yaw = 0;
    local.pitch = 0;
    local.body.yaw = 0;
    local.body.pitch = 0;
    local.invulnerableUntil = 0;
    for (const record of session.records.values()) {
      if (!record.isLocal) record.invulnerableUntil = 0;
    }
    api.selectWeapon('pulse');
    api.advance(0.1);
  });
  await guestPage.evaluate(() => {
    const api = window.__neonstrike;
    const session = api.session;
    const local = session.localRecord;
    api.teleport(6, 0.05, 24);
    local.yaw = Math.PI;
    local.pitch = 0;
    local.body.yaw = Math.PI;
    local.body.pitch = 0;
    local.invulnerableUntil = 0;
    session.records.get('host') && (session.records.get('host').invulnerableUntil = 0);
    api.selectWeapon('pulse');
    api.advance(0.2);
  });

  await sleep(700);
  await hostPage.evaluate(() => window.__neonstrike.advance(0.15));
  await guestPage.evaluate(() => window.__neonstrike.advance(0.15));
  await sleep(500);

  const synced = await hostPage.evaluate((id) => {
    const record = window.__neonstrike.session.records.get(id);
    return record ? record.pos.toArray() : null;
  }, guestId);
  const distance = synced ? Math.hypot(synced[0] - 6, synced[2] - 24) : Infinity;
  check('network: guest position reaches host', distance < 2.5, { pos: synced, distance: +distance.toFixed(2) });

  // Guest -> host hitscan damage (guest reports MSG.HIT, host validates/applies).
  const hostBefore = (await state(hostPage)).local.health;
  await guestPage.evaluate((id) => {
    const api = window.__neonstrike;
    api.aimAt(id);
    api.advance(0.06);
    api.fire();
    api.advance(0.1);
  }, hostId);
  await hostPage.waitForFunction(() => window.__neonstrike.state().local.health < 100, null, { timeout: 6000 })
    .catch(() => {});
  const hostAfter = (await state(hostPage)).local.health;
  check('network: guest shot damages host', hostAfter < hostBefore, `${hostBefore} -> ${hostAfter}`);

  // Host -> guest damage (host sends MSG.DAMAGE; guest health is client-local).
  const guestBefore = (await state(guestPage)).local.health;
  await hostPage.evaluate((id) => {
    const api = window.__neonstrike;
    api.aimAt(id);
    api.advance(0.06);
    api.fire();
    api.advance(0.1);
  }, guestId);
  await guestPage.waitForFunction(() => window.__neonstrike.state().local.health < 100, null, { timeout: 6000 })
    .catch(() => {});
  const guestAfter = (await state(guestPage)).local.health;
  check('network: host shot damages guest', guestAfter < guestBefore, `${guestBefore} -> ${guestAfter}`);

  // Guest pickup request -> host validates -> MSG.HEAL -> guest health.
  await guestPage.evaluate(() => {
    const api = window.__neonstrike;
    api.setHealth(api.state().localId, 40);
    api.advance(0.2);
  });
  await sleep(300);
  const pickup = await hostPage.evaluate(() => {
    const item = window.__neonstrike.session.stage.pickups.find((pickup) => pickup.available);
    return item ? { id: item.id, amount: item.amount, pos: [item.pos.x, item.pos.y, item.pos.z] } : null;
  });
  if (pickup) {
    await guestPage.waitForFunction(
      (id) => window.__neonstrike.state().pickups.find((item) => item.id === id)?.available,
      pickup.id,
      { timeout: 4000 },
    ).catch(() => {});
    await guestPage.evaluate((pos) => {
      const api = window.__neonstrike;
      api.teleport(pos[0], pos[1] + 0.05, pos[2]);
      api.advance(0.4);
    }, pickup.pos);
    await sleep(500);
    await guestPage.evaluate(() => window.__neonstrike.advance(1.4));
    await sleep(1000);
    const healed = (await state(guestPage)).local.health;
    const taken = (await state(hostPage)).pickups.find((item) => item.id === pickup.id);
    const expected = Math.min(100, 40 + pickup.amount);
    check(
      'network: host validates guest pickup',
      healed === expected && taken?.available === false,
      { healed, expected, taken },
    );
  } else {
    check('network: host validates guest pickup', false, 'no pickup available');
  }

  // Host kill -> guest death -> host respawn -> guest alive.
  await hostPage.evaluate((id) => {
    const api = window.__neonstrike;
    const record = api.session.records.get(id);
    if (record) record.invulnerableUntil = 0;
    api.damage(id, 999);
    api.advance(0.1);
  }, guestId);
  await guestPage.waitForFunction(() => !window.__neonstrike.state().local.alive, null, { timeout: 5000 })
    .catch(() => {});
  const deadState = await state(guestPage);
  check('network: guest receives kill', deadState.local.alive === false);

  await hostPage.evaluate(() => {
    window.__neonstrike.advance(3.6);
    window.__neonstrike.advance(0.2);
  });
  await guestPage.waitForFunction(() => {
    const local = window.__neonstrike.state().local;
    return local.alive && local.health === 100;
  }, null, { timeout: 6000 }).catch(() => {});
  const respawnState = await state(guestPage);
  check(
    'network: guest respawns from host message',
    respawnState.local.alive === true && respawnState.local.health === 100,
    respawnState.local,
  );

  // Guest projectile -> host damage. NOVA-6 is simulated by the guest owner,
  // while the host validates the reported hit and owns the kill/respawn.
  await hostPage.evaluate(() => {
    const api = window.__neonstrike;
    const local = api.session.localRecord;
    local.health = 100;
    local.invulnerableUntil = 0;
    api.teleport(6, 0.05, 29);
    local.yaw = 0;
    local.pitch = 0;
    api.advance(0.1);
  });
  await guestPage.evaluate(() => {
    const api = window.__neonstrike;
    const local = api.session.localRecord;
    local.health = 100;
    local.invulnerableUntil = 0;
    api.teleport(6, 0.05, 20);
    local.yaw = Math.PI;
    local.pitch = 0;
    api.selectWeapon('nova');
    api.advance(0.1);
  });
  await sleep(600);
  await hostPage.evaluate(() => window.__neonstrike.advance(0.1));
  await guestPage.evaluate(() => window.__neonstrike.advance(0.1));
  await sleep(400);
  await guestPage.evaluate(() => {
    const api = window.__neonstrike;
    api.aimAt('host');
    api.fire();
    api.advance(1.0);
  });
  await hostPage.waitForFunction(
    () => !window.__neonstrike.state().local.alive,
    null,
    { timeout: 6000 },
  ).catch(() => {});
  const hostNovaState = await state(hostPage);
  check('network: guest projectile kills host', hostNovaState.local.alive === false, hostNovaState.local);
  await guestPage.waitForFunction(
    () => window.__neonstrike.state().local.kills >= 1,
    null,
    { timeout: 4000 },
  ).catch(() => {});
  check('network: guest credited for projectile kill', (await state(guestPage)).local.kills >= 1);

  await hostPage.evaluate(() => {
    window.__neonstrike.advance(3.6);
    window.__neonstrike.advance(0.2);
  });
  await hostPage.waitForFunction(
    () => window.__neonstrike.state().local.alive && window.__neonstrike.state().local.health === 100,
    null,
    { timeout: 4000 },
  ).catch(() => {});
  const hostRespawn = await state(hostPage);
  check('network: host respawns after guest kill', hostRespawn.local.alive && hostRespawn.local.health === 100);

  // Guest leave -> host removes the record.
  await guestPage.evaluate(() => window.__neonstrike.leave());
  await hostPage.waitForFunction(
    (id) => !window.__neonstrike.state().records.some((record) => record.id === id),
    guestId,
    { timeout: 6000 },
  ).catch(() => {});
  const hostRoster = await state(hostPage);
  check('network: guest leave removes host record', !hostRoster.records.some((record) => record.id === guestId));

  // Rejoin, then close the host page and verify the guest disconnect overlay.
  const rejoinStart = Date.now();
  const rejoinResult = await guestPage.evaluate(async () => {
    try {
      const result = await window.__neonstrike.guest({ code: 'E2E1', name: 'GUEST', deploy: true });
      return {
        ok: Boolean(result),
        localId: result?.localId ?? null,
        status: document.getElementById('menu-status')?.textContent?.trim() || '',
        screen: document.getElementById('game-screen').classList.contains('hidden') ? 'menu' : 'game',
      };
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  });
  await hostPage.waitForFunction(
    () => {
      const state = window.__neonstrike.state();
      return state.records.some((record) => record.name === 'GUEST' && !record.isLocal);
    },
    null,
    { timeout: 8000 },
  ).catch(() => {});
  const rejoined = await state(hostPage);
  check(
    'network: guest can rejoin after leaving',
    rejoinResult.ok
      && rejoined.deployedPlayers === 2
      && rejoined.records.some((record) => record.name === 'GUEST' && !record.isLocal),
    {
      ok: rejoinResult.ok,
      players: rejoined.deployedPlayers,
      ms: Date.now() - rejoinStart,
      status: rejoinResult.status || rejoinResult.error || null,
    },
  );

  await hostPage.evaluate(() => window.__neonstrike.leave());
  await guestPage.waitForFunction(
    () => !document.getElementById('disconnect-overlay').classList.contains('hidden'),
    null,
    { timeout: 12000 },
  ).catch(() => {});
  const overlayHidden = await guestPage.evaluate(
    () => document.getElementById('disconnect-overlay').classList.contains('hidden'),
  );
  check('network: guest detects host loss', overlayHidden === false);
}

async function main() {
  const vitePort = await freePort();
  const peerPort = await freePort();
  const baseUrl = `http://127.0.0.1:${vitePort}/?unlocked=1&peerhost=127.0.0.1&peerport=${peerPort}&peerpath=/&peerkey=peerjs&peersecure=0`;

  let vite;
  let peer;
  let browser;
  let practice;
  let host;
  let guest;
  let artifacts = false;

  try {
    const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
    vite = startProcess('vite', process.execPath, [
      viteBin, '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort', '--clearScreen', 'false',
    ]);
    peer = startProcess('signal', process.execPath, [path.join(ROOT, 'server', 'peer-server.js')], {
      env: { ...process.env, PEER_PORT: String(peerPort) },
    });

    await Promise.all([waitForHttp(`http://127.0.0.1:${vitePort}/`), waitForPort(peerPort)]);
    console.log(`Vite ${vitePort} / PeerJS ${peerPort}`);

    browser = await chromium.launch({
      executablePath: CHROME,
      headless: HEADLESS,
      args: [
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
        '--ignore-gpu-blocklist',
        '--no-sandbox',
      ],
    });

    practice = await newPage(browser, baseUrl, 'PRACTICE');
    await practiceChecks(practice.page);
    await practice.context.close();
    practice = null;

    host = await newPage(browser, baseUrl, 'HOST');
    await host.page.evaluate(() => window.__neonstrike.host({ code: 'E2E1', name: 'HOST', deploy: true }));
    const hostState = await state(host.page);
    check('host: room created', hostState?.isHost === true && hostState.roomCode === 'E2E1', hostState?.roomCode);
    check('host: deployed', hostState?.deployed === true);

    guest = await newPage(browser, baseUrl, 'GUEST');
    const guestJoin = await guest.page.evaluate(async () => {
      const result = await window.__neonstrike.guest({ code: 'E2E1', name: 'GUEST', deploy: true });
      return {
        ok: Boolean(result),
        status: document.getElementById('menu-status')?.textContent || '',
        connectTitle: document.getElementById('connect-title')?.textContent || '',
        connectDetail: document.getElementById('connect-detail')?.textContent || '',
        screen: document.getElementById('game-screen').classList.contains('hidden') ? 'menu' : 'game',
      };
    });
    console.log('guest join:', guestJoin);
    await host.page.waitForFunction(
      (name) => window.__neonstrike.state().records.some((record) => record.name === name && !record.isLocal),
      'GUEST',
      { timeout: 10000 },
    ).catch(() => {});
    const hostAfterJoin = await state(host.page);
    const guestAfterJoin = await state(guest.page);
    if (!guestAfterJoin) {
      check('network: guest session started', false, guestJoin);
    }
    const hostGuest = hostAfterJoin.records.find((record) => record.name === 'GUEST' && !record.isLocal);
    const guestHost = guestAfterJoin?.records.find((record) => record.id === 'host');
    check('network: join handshake', Boolean(hostGuest && guestHost && guestAfterJoin?.isGuest));
    check('network: room counts two players', hostAfterJoin.deployedPlayers === 2 && guestAfterJoin?.deployedPlayers === 2);

    if (hostGuest && guestHost) {
      await networkChecks({ hostPage: host.page, guestPage: guest.page, hostId: guestHost.id, guestId: hostGuest.id });
    } else {
      check('network: skip checks', false, 'guest did not join');
    }
  } catch (error) {
    check('smoke: uncaught error', false, error?.stack || String(error));
    artifacts = true;
  } finally {
    if (vite?.child?.exitCode && vite.child.exitCode !== 0) console.log(vite.tail());
    if (peer?.child?.exitCode && peer.child.exitCode !== 0) console.log(peer.tail());

    if (artifacts) {
      try {
        await mkdir(path.join(ROOT, 'tests', 'artifacts'), { recursive: true });
        if (host) await host.page.screenshot({ path: path.join(ROOT, 'tests', 'artifacts', 'host-failure.png') }).catch(() => {});
        if (guest) await guest.page.screenshot({ path: path.join(ROOT, 'tests', 'artifacts', 'guest-failure.png') }).catch(() => {});
      } catch { /* noop */ }
    }

    try { await browser?.close(); } catch { /* noop */ }
    await stopProcess(vite);
    await stopProcess(peer);
  }

  const failed = results.filter((result) => !result.ok);
  if (pageErrors.length) {
    check('pages: no runtime errors', false, pageErrors.slice(0, 5));
  } else {
    check('pages: no runtime errors', true);
  }

  console.log('');
  console.log(`${results.filter((result) => result.ok).length}/${results.length} checks passed`);
  if (failed.length) {
    console.log('Failures:');
    for (const failure of failed) console.log(`  - ${failure.name}: ${JSON.stringify(failure.detail)}`);
    process.exitCode = 1;
  }
}

await main();
