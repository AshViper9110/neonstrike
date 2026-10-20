# NEON//STRIKE

Peer.js + Three.js で動く、ブラウザだけで遊べるネオン調 3D 対戦 FPS です。  
インストール後は `npm run dev` を実行し、Chrome / Edge で開くだけでプレイできます。

- **最大4人**のフリー・フォー・オール（ホスト1人 + ゲスト3人）
- **1〜4文字**のルームコードで接続（英数字、大文字小文字は区別なし）
- **5種類**の武器（ヒットスキャン4種 + ロケット1種）
- ジャンプパッド、テレポーター、動く足場、フェーズゲート、レーザーフェンス、低重力帯などの**ステージギミック**
- 3体のボットとオフライン練習ができる**練習モード**
- 武器定義とステージモジュールを追加できる**モジュラー設計**
- 日本語 UI / HUD / キルフィード / ミニマップ / スコアボード

---

## 目次

1. [必要環境](#必要環境)
2. [クイックスタート](#クイックスタート)
3. [遊び方](#遊び方)
4. [操作](#操作)
5. [武器](#武器)
6. [ステージギミック](#ステージギミック)
7. [ネットワーク](#ネットワーク)
8. [設定](#設定)
9. [アーキテクチャ](#アーキテクチャ)
10. [拡張ガイド](#拡張ガイド)
11. [テスト](#テスト)
12. [ビルドと配置](#ビルドと配置)
13. [トラブルシューティング](#トラブルシューティング)
14. [既知の制限](#既知の制限)

---

## 必要環境

| 項目 | 要件 |
| --- | --- |
| Node.js | `20.19.0` 以上（20系）、または `22.12.0` 以上（22系以降）（Vite 8 の要件） |
| ブラウザ | 最新の Chrome / Edge を推奨（WebGL2 + WebRTC が必要） |
| 入力 | キーボード + マウス（モバイル操作には未対応） |
| テスト | Google Chrome（`playwright-core` から使用） |

Three.js、PeerJS、Orbitron フォントは `npm install` で導入されます。外部の画像・音声アセットは使っておらず、モデル・テクスチャ・効果音はすべて実行時に生成されます。

---

## クイックスタート

### かんたん起動（Windows）

`start-game.bat` をダブルクリックしてください。依存パッケージが未インストールの場合は自動で `npm install` を実行し、開発サーバーを起動してブラウザを開きます。5173 が使用中の場合は、空いているポートを自動で選びます。

> **注意:** `index.html` をエクスプローラーから直接開かないでください。`file://` ではブラウザのセキュリティ制限により CSS と JavaScript が読み込まれず、画面が崩れたり操作できなくなります。必ずローカルサーバー経由で開いてください。

### 手動起動

```bash
npm install
npm run dev
```

表示された URL（既定は `http://localhost:5173`）をブラウザで開きます。`npm start` を使うと、サーバー起動後にブラウザが自動で開きます。

## 遊び方

### 練習モード

1. トップ画面で「**練習モード**」を押す
2. コールサインを確認して「**DEPLOY**」を押す
3. 3体のボットと自由に対戦

練習モードは完全にローカルで動作し、ネットワーク接続は不要です。ポーズ中はシミュレーションも停止します。

### マルチプレイ

1. ホストが名前と**ルームコード**（例: `A1`、`NEON`。4文字まで）を入力し、「**ルームを作成**」
2. ホストが「**DEPLOY**」で開始
3. ゲストは同じルームコードを入力して「**ルームに参加**」
4. ホストの開始を確認後、ゲストも「**DEPLOY**」

ルームコードは英数字 1〜4 文字です。小文字で入力しても大文字に変換されます。ホストが退出するとルームは終了し、ゲストには接続切断が表示されます。ホスト移行（host migration）はありません。

---

## 操作

| 入力 | 動作 |
| --- | --- |
| `W` `A` `S` `D` | 移動 |
| マウス | 照準 |
| 左クリック | 射撃 |
| 右クリック | ズーム / 精度向上 |
| `Space` | ジャンプ（コヨーテタイムあり） |
| `Shift` | スプリント |
| `Ctrl` | しゃがみ |
| `R` | リロード |
| `1`〜`5` / ホイール | 武器切替 |
| `Tab`（長押し） | スコアボード |
| `M` | ミュート切替 |
| `F` | フルスクリーン |
| `Esc` | ポーズ / マウスロック解除 |

マウスロックが使えない環境（埋め込みブラウザ、自動テストなど）では、URL に `?unlocked=1` を付けるとロックなしで入力できます。通常のプレイでは使用しないでください。

---

## 武器

全武器を最初から所持しており、武器ピックアップはありません。弾薬はリスポーン時に全回復します。

| Slot | 武器 | 種別 | ダメージ | 弾数 / 予備 | 連射間隔 | リロード | 射程 | 特徴 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **PULSE-9** | ヒットスキャン / フルオート | 16 | 14 / ∞ | 0.145 秒 | 1.05 秒 | 70 m | 予備弾薬無限の万能武器。ヘッドショット ×1.8 |
| 2 | **VOLT-AR** | ヒットスキャン / フルオート | 11.5 | 30 / 150 | 0.098 秒 | 1.45 秒 | 78 m | 高レートのアサルトライフル。中距離向け |
| 3 | **SCATTER-12** | ヒットスキャン / 8ペレット | 10.5 × 8 | 6 / 36 | 0.82 秒 | 2.05 秒 | 36 m | 近距離特化。8〜30 m で減衰（最低 42%） |
| 4 | **RAIL-7** | ヒットスキャン / 貫通 | 78 | 4 / 16 | 1.02 秒 | 2.2 秒 | 110 m | 最大2体貫通。ヘッドショット ×2.1、高精度 |
| 5 | **NOVA-6** | プロジェクタイル / ロケット | 直撃 55 / 爆発 58 | 2 / 10 | 0.92 秒 | 2.35 秒 | 120 m | 爆発半径 4.2 m。自爆ダメージは 55% |

補足:

- ヘッドショット判定あり。武器ごとに倍率が異なります。
- 移動・ジャンプ・しゃがみで拡散率が変化します。右クリックのズームで精度が上がります。
- SCATTER-12 は距離減衰あり。
- RAIL-7 は壁を貫通しませんが、最大2体の敵を貫通します。
- NOVA-6 のロケットは重力の影響を受けます。至近距離での自爆に注意してください。

---

## ステージギミック

ステージは **NEON FOUNDRY**（64 × 64、2 レベル構造）。中央の高台、四方の階段、左右のキャットウォークで構成されます。

| ギミック | 数 | 内容 |
| --- | --- | --- |
| **ジャンプパッド** | 2 | 約 17 m/s で打ち上げ。空中射撃が可能 |
| **動く足場（エレベーター）** | 2 | 地上とキャットウォーク（高さ約 4 m）を往復 |
| **テレポーター** | 4 | A / B の2ペア。クールダウンあり。地面とキャットウォークを接続 |
| **フェーズゲート** | 2 | 通過できる物体が異なるゲート。片方はプレイヤーだけ通し、もう片方は弾丸・ロケットだけ通す |
| **レーザーフェンス** | 2 | 警告 → 点灯 → 消灯を繰り返す。点灯中は 15 ダメージ |
| **低重力帯** | 1 | 重力 0.32 倍 + 上昇気流。浮遊しながら戦える |
| **体力ピックアップ** | 6 | 30〜50 HP 回復。14〜20 秒で再出現。ホストが取得を検証 |

フェーズゲートは汎用の「通過判定タグ」を使っています。`blocks: ['bullet', 'projectile']` ならプレイヤーは通過でき、射撃は遮られます。`blocks: ['player']` なら逆に、プレイヤーは通れず弾丸は通過します。新しいオブジェクト種別を追加する場合も、このタグの組み合わせで透過ルールを定義できます。

### ルール

- フリー・フォー・オール。試合終了条件はなく、退出するまで継続します。
- 最大 HP は 100。キル数とデス数はスコアボードに表示されます。
- 死亡後 **3.4 秒**でリスポーン。スポーン保護は **1.0 秒**。
- 落下（Y < -12）は VOID 扱いで死亡します。
- レーザーや落下などの環境ダメージもホストが処理します。

---

## ネットワーク

### トポロジ

```
Host (ブラウザ)
 ├─ PeerJS DataConnection ─ Guest A
 ├─ PeerJS DataConnection ─ Guest B
 └─ PeerJS DataConnection ─ Guest C
```

- ゲームデータはブラウザ間の **P2P（WebRTC DataChannel）** で直接送られます。
- PeerJS サーバーは**シグナリング（接続確立の仲介）だけ**に使われます。ゲームサーバーはありません。
- 既定では **PeerJS クラウド**（`0.peerjs.com`）を使用します。
- ホストの PeerJS ID は `neonstrike-v1-<ルームコード小文字>` です。同じコードのルームは同時に1つだけ作成できます。
- ルーム定員は **4人**（ホスト + ゲスト3人）。満員の場合は参加が拒否されます。

### 権限モデル

| 役割 | 担当 |
| --- | --- |
| **ゲスト** | 自分の移動・視点・射撃をローカルシミュレーション。20 Hz で状態を送信 |
| **ホスト** | 体力・キル・デス・リスポーン・ピックアップ・環境ダメージを管理。15 Hz でスナップショットを配信 |
| **ゲストの攻撃** | ヒットスキャン/爆発ダメージを `HIT` としてホストへ送信。ホストが距離・対象・体力を検証して反映 |
| **ホストの攻撃** | ホストが直接ダメージを適用し、`DAMAGE` / `KILL` を該当ゲストへ送信 |
| **回復** | ゲストは `HEAL` でピックアップ ID を要求。ホストが距離と再出現状態を検証し、絶対 HP を返送 |

主なメッセージ:

| メッセージ | 方向 | 用途 |
| --- | --- | --- |
| `hello` / `welcome` / `reject` | 双方向 | 参加ハンドシェイク、満員・拒否理由 |
| `state` | ゲスト → ホスト | 位置・視点・武器・体力・ping（20 Hz） |
| `snapshot` | ホスト → 全員 | プレイヤー、ピックアップ、開始状態（15 Hz） |
| `hit` / `hazard` / `heal` | ゲスト → ホスト | ダメージ・環境ダメージ・回復要求 |
| `damage` / `kill` / `respawn` | ホスト → ゲスト | 確定した体力、キル、リスポーン |
| `fire` / `projectile` | 全員 | 射撃・発射体の見た目と効果の同期 |
| `ping` / `pong` / `bye` | 双方向 | レイテンシ計測、退出通知 |

古いリモートプレイヤーは、スナップショットを4回連続で受信できなかった場合に削除されます。ゲストの位置はホスト側で物理演算せず、`state` の値を使用します。

### STUN / TURN

既定の PeerJS クラウド利用時は、NAT 越えのために Google の STUN を使用します。

```js
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]
```

ローカル PeerServer を指定した場合（詳細設定の HOST が空でない場合）は、LAN 内のホスト候補で直接接続できるため STUN を省略します。外部 STUN への通信が遅い・遮断されている環境でも、ローカル対戦が安定します。

TURN サーバーは設定していません。異なる NAT 間（特に symmetric NAT）では P2P 接続に失敗することがあります。その場合は同じ LAN で遊ぶか、`src/net/PeerRoom.js` の `iceServers` に TURN サーバーを追加するか、VPN を使用してください。

ゲスト参加時の DataConnection が ICE/DTLS の確立で停止することがあります。この場合に備え、1回の接続試行は **10 秒**で打ち切り、新しい Peer で**最大 3 回**まで自動再試行します。再試行中は接続オーバーレイに進捗が表示されます。TURN が必要な NAT 環境では、再試行しても接続できない場合があります。

### ローカル PeerServer を使う

インターネットに出ずに LAN 内だけで遊ぶ場合や、クラウドの調子が悪い場合に使います。

```bash
# ターミナル1: シグナリングサーバー（既定 ws://localhost:9000、key: peerjs）
npm run signal

# ターミナル2: アプリ
npm run dev
```

アプリの「**詳細ネットワーク設定**」で以下を入力するか、「**LOCAL PRESET**」を押します。

| 項目 | 値 |
| --- | --- |
| HOST | `127.0.0.1`（他 PC から接続する場合はホスト機の LAN IP） |
| PORT | `9000` |
| PATH | `/` |
| KEY | `peerjs` |
| SSL | オフ |

URL パラメータでも指定できます。

```
http://localhost:5173/?peerhost=127.0.0.1&peerport=9000&peerpath=/&peerkey=peerjs&peersecure=0
```

LAN 内の別 PC から接続する場合は、`peerhost` にホスト機の IP（例: `192.168.1.20`）を指定し、OS のファイアウォールで 5173 と 9000 を許可してください。PeerServer は `0.0.0.0` で待ち受けます。

便利な URL パラメータ:

| パラメータ | 例 | 内容 |
| --- | --- | --- |
| `room` | `?room=ABCD` | ルームコードを事前入力 |
| `name` | `?name=PLAYER` | コールサインを事前入力 |
| `peerhost` ほか | 上記 | シグナリングサーバーを上書き |
| `unlocked` | `?unlocked=1` | マウスロックなしで入力（自動テスト用） |

---

## 設定

メニューの「設定」から変更できます。設定は `localStorage` に保存されます。

- マウス感度（0.2〜3.0）
- 視野角 FOV（65〜110）
- マスター音量（0〜100%）
- 描画クオリティ（HIGH / LOW）
  - HIGH: ブルームなどのポストプロセス有効
  - LOW: 直接描画。重い環境向け
- FPS カウンター表示
- 環境音の有効 / 無効

マルチプレイ中に設定を開いてもゲームは停止しません。安全な場所で変更してください。練習モードのポーズはシミュレーションを停止します。

---

## アーキテクチャ

```
src/
├─ main.js                    メニュー、セッション生成、ホスト/ゲスト接続、UI 配線
├─ net/
│  └─ PeerRoom.js             PeerJS のルームライフサイクル、参加承認、リレー、レート制限
├─ game/
│  ├─ GameSession.js          固定ステップ更新、プレイヤーレコード、リスポーン、ピックアップ
│  ├─ Combat.js               ヒットスキャン、拡散、反動、ロケット、ボット射撃
│  ├─ NetSync.js              20 Hz state / 15 Hz snapshot、ホスト検証
│  ├─ Projectiles.js          発射体の移動・爆発・スプラッシュ
│  ├─ PhysicsWorld.js         AABB 衝突、トリガー、通過タグ
│  ├─ Bots.js                 練習モードのウェイポイント AI
│  ├─ HUD.js / Minimap.js     HUD、キルフィード、スコアボード、ミニマップ
│  ├─ ViewModel.js            武器ビューモデル、スウェイ、リロード演出
│  ├─ Effects.js             パーティクル、トレーサー、爆発
│  └─ Avatar.js               リモートプレイヤーのアバター
├─ stages/
│  ├─ StageBase.js            ステージの基底クラス、スポーン、トリガー登録
│  ├─ StageModule.js          モジュール基底クラス + レジストリ
│  ├─ NeonFoundry.js          NEON FOUNDRY の構成データ
│  ├─ stageKit.js             共有マテリアル、ネオン装飾ヘルパー
│  └─ modules/                環境、床、ブロック、スポーン、ジャンプパッド、…
├─ weapons/
│  ├─ WeaponRegistry.js       武器定義の登録・検証・ロードアウト生成
│  ├─ WeaponBase.js           弾薬、リロード、拡散、ダメージ計算
│  ├─ index.js                組み込み武器の登録
│  └─ defs/                   PULSE / VOLT / SCATTER / RAIL / NOVA
├─ core/
│  ├─ Settings.js             設定とネットワーク設定の永続化
│  ├─ AudioManager.js         Web Audio による効果音・環境音
│  ├─ EventBus.js / ModuleHost.js / utils.js
└─ styles/main.css            メニュー、HUD、モーダル
```

### 更新ループ

- シミュレーションは **60 Hz 固定ステップ**（1/60 秒、最大5ステップ/フレーム）。
- 描画は `requestAnimationFrame` で行い、レンダラー設定に応じてポストプロセスを切り替えます。
- トリガーは物理移動の**前**に処理されます。ジャンプパッド、テレポーター、低重力帯などはプレイヤー body の速度・重力倍率を直接変更します。
- 発射体は速度ベクトルを積分し、重力を加えながら移動します。NOVA-6 のロケットが床に突き刺さらないのはこのためです。

### 権限の実装

`GameSession.isAuthority` は練習モードまたはホストで `true` になります。ダメージは必ず `applyOutgoingDamage` を通り、権限がなければ `MSG.HIT`、あれば `applyDamage` が呼ばれます。体力・キル・リスポーン・ピックアップの状態はホストだけが確定させます。

---

## 拡張ガイド

### 1. 武器を追加する

`src/weapons/defs/myweapon.js` を作成します。

```js
import * as THREE from 'three';
import { makeWeaponRoot, box, mat, glow, addMuzzle } from '../modelKit.js';

export default {
  id: 'myweapon',
  name: 'ARC-3',
  slot: 6,                 // 6 番目以降は入力キーと HUD の拡張が必要
  type: 'hitscan',         // 'hitscan' または 'projectile'
  classLabel: 'ARC / BURST',
  description: '短いバーストで戦う試作武器。',
  damage: 24,
  headshotMult: 1.6,
  fireInterval: 0.3,
  auto: false,
  pellets: 1,
  spreadHip: 0.008,
  spreadAim: 0.003,
  magSize: 12,
  reserveMax: 60,
  reloadTime: 1.4,
  range: 80,
  color: '#00f6ff',
  icon: '⌁',
  zoomFov: 62,
  recoil: { pitch: 0.01, yaw: 0.002, kick: 0.03, recover: 12 },
  buildModel() {
    const root = makeWeaponRoot([0.3, -0.28, -0.58]);
    const pivot = root.userData.pivot;
    const body = box(0.09, 0.1, 0.4, mat(0x111827), 0, 0, -0.1);
    pivot.add(body);
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.008, 6, 18),
      glow(0x00f6ff, 0.9),
    );
    coil.position.set(0, 0.02, -0.32);
    pivot.add(coil);
    addMuzzle(root, 0, 0.02, -0.48);
    root.userData.muzzleColor = 0x74fbff;
    return root;
  },
};
```

`src/weapons/index.js` で登録します。既存の配列に追加してください。

```js
import myweapon from './defs/myweapon.js';

// registerBuiltinWeapons() 内
[pulse, volt, scatter, rail, nova, myweapon].forEach((def) => weaponRegistry.register(def));
```

必須フィールドは `id`、`name`、`slot`、`type`、`damage`、`magSize`、`reserveMax`、`fireInterval`、`reloadTime` です。`buildModel()` は必須で、三人称・一人称の表示に使われます。`addMuzzle()` を呼ぶとマズルフラッシュ位置が設定されます。

ロケット武器にしたい場合は `type: 'projectile'` と `projectile` 設定を追加します。

```js
projectile: {
  speed: 42,
  radius: 0.12,
  gravity: 1.8,
  ttl: 6,
  splashDamage: 50,
  splashRadius: 3.5,
  splashKnockback: 8,
  selfDamageScale: 0.5,
  directKnockback: 4,
},
```

弾薬・リロード・拡散・HUD・ネットワーク同期はデータ駆動なので、通常のヒットスキャン / プロジェクタイル武器なら追加コードは不要です。6番目以降の武器を数字キーで切り替える場合は、`Input.js` の `GAME_KEYS` と `GameSession` の `DigitN` 処理、HUD の weapon bar を拡張してください。

### 2. ステージモジュールを追加する

`src/stages/modules/MyModule.js` を作成します。

```js
import * as THREE from 'three';
import { StageModule, stageModules } from '../StageModule.js';

class WindLiftModule extends StageModule {
  build(ctx, stage) {
    this.group = new THREE.Group();
    this.group.position.set(...this.config.pos);
    ctx.scene.add(this.group);

    // 見た目（Three.js のメッシュ）
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.12, 24),
      ctx.materials.basic(`lift-${this.id}`, { color: 0x00f6ff, toneMapped: false }),
    );
    this.group.add(disc);

    // プレイヤーが触れたときの処理
    stage.registerTriggerHandler('windLift', (body, trigger, api) => {
      body.vel.y = Math.max(body.vel.y, 9);
      body.grounded = false;
      api.session.effects.spawnBurst(body.pos, 0x00f6ff);
    });

    // トリガー範囲
    const [x, y, z] = this.config.pos;
    this.trigger = stage.registerTrigger(
      new THREE.Box3(
        new THREE.Vector3(x - 1.5, y, z - 1.5),
        new THREE.Vector3(x + 1.5, y + 2, z + 1.5),
      ),
      { kind: 'windLift' },
    );
  }

  update(dt, time) {
    if (this.group) this.group.rotation.y += dt * 0.6;
  }
}

stageModules.register('windLift', WindLiftModule);
```

`NeonFoundry.js` でモジュールを読み込み、追加します。

```js
import './modules/WindLiftModule.js';

// build() 内
this.addModule({ type: 'windLift', pos: [10, 0, 10] });
```

モジュールの `build(ctx, stage)` では、`ctx.scene`、`ctx.materials`、`ctx.physics` が使えます。`uiState` や永続化が必要な場合は、モジュール内で完結させてください。`dispose(ctx)` をオーバーライドする場合は、`super.dispose(ctx)` を呼ぶか、生成したジオメトリ・マテリアルを破棄してください。

### 3. ステージを追加する

`StageBase` を継承し、`build(ctx)` でモジュールを並べます。

```js
import { StageBase } from './StageBase.js';
import './modules/EnvironmentModule.js';
import './modules/FloorModule.js';
// ...必要なモジュール

export class MyArena extends StageBase {
  constructor() {
    super({ id: 'my-arena', name: 'MY ARENA', subtitle: 'TEST SECTOR' });
  }

  build() {
    this.addModule({ type: 'environment' });
    this.addModule({ type: 'floor' });
    this.addModule({ type: 'spawn', spawns: [{ x: 0, z: 10, yaw: 0 }] });
    this.registerWaypoint(0, 0);
  }
}

export const myArena = () => new MyArena();
```

`GameSession` は現在 `NeonFoundry` を直接生成しています。別ステージを選べるようにするには、`GameSession` のコンストラクタに `stageFactory` を渡すか、`main.js` からステージ ID を渡してファクトリを切り替えてください。

### 4. 通過判定を拡張する

`PhysicsWorld` の `addSolid(box, { blocks })` は文字列タグの集合です。既定は `['player', 'bullet', 'projectile']` です。新しいエンティティ（例: `drone`、`vehicle`）を追加したら、その衝突判定で `blocks` に `'drone'` を追加し、フェーズゲートの `blocks` 設定と組み合わせます。

```js
this.addSolid(box, { blocks: ['player'] });                 // 弾丸は通す
this.addSolid(box, { blocks: ['bullet', 'projectile'] });   // プレイヤーは通す
```

---

## テスト

```bash
npm test
```

`tests/peerroom-guards.mjs` が接続管理の競合を先に検証し、続けて `tests/smoke.mjs` が以下を自動で行います。

- 接続前の `join-request` キュー、古い接続の close が現在のプレイヤーを消さないこと、拒否済み接続の再送、重複接続の遮断を検証
- 空きポートで Vite と PeerJS シグナリングサーバーを起動
- `playwright-core` でヘッドレス Chrome を起動
- 練習モードの移動、ジャンプ、武器切替、5武器のダメージ、リロード、キル/リスポーン、回復、ジャンプパッド、テレポーター、低重力帯、HUD を検証
- テレポーターの A/B ペアが同一チャンネル内で接続されていることを検証
- ホスト + ゲストの接続、状態同期、双方向ダメージ、ホスト検証付き回復、ゲストのロケットキル、ホストのリスポーン、退出、再参加、ホスト切断表示を検証
- ページ内の実行時エラーがないことを確認

スモークテストは現在 **44 項目**です。接続管理のガードテストは別途実行され、`npm run test:guards` でも単独実行できます。E2E のみ実行する場合は `npm run test:e2e` を使います。

環境変数:

```bash
# Chrome の場所を明示する場合（Windows 以外では必須）
CHROME_PATH="/usr/bin/google-chrome" npm test

# ブラウザを表示して確認する場合
SMOKE_HEAD=1 npm test
```

テストは一時的に専用のポートを使い、終了時にサーバーを停止します。既存の開発サーバーや PeerServer を停止する必要はありません。

> Windows PowerShell で `npm` がスクリプト実行ポリシーによりブロックされる場合は、`npm.cmd test`、`npm.cmd run dev` のように `npm.cmd` を使ってください。

---

## ビルドと配置

```bash
npm run build
npm run preview
```

`dist/` に静的ファイルが出力されます。Vite の `base` は `./` なので、サブディレクトリ配信にも対応します。HTTPS で配信すると、WebRTC とブラウザの各種権限が安定します。`localhost` は例外的に HTTP でも動作します。`dist/index.html` も `file://` で直接開かず、静的サーバー経由で配信してください。

ビルド成果物はサーバーではなくブラウザに配信されるだけです。マルチプレイのゲーム状態はホストのブラウザが保持します。

### GitHub Pages で公開する（インターネット対戦）

`.github/workflows/deploy.yml` を同梱しているため、GitHub に push すると GitHub Pages へ自動デプロイできます。

1. GitHub で新しいリポジトリを作成する
2. このフォルダを push する

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
   git push -u origin main
   ```

3. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定する（初回のみ）。push 後に設定した場合は、**Actions** タブから「Deploy to GitHub Pages」を再実行してください
4. **Actions** タブの「Deploy to GitHub Pages」が完了したら、`https://<ユーザー名>.github.io/<リポジトリ名>/` を開く
5. 全員が同じ URL を開き、ホストがルームコードを発行してゲストが参加する

招待 URL にルームコードと名前を入れておくと便利です。

```
https://<ユーザー名>.github.io/<リポジトリ名>/?room=ABCD&name=PLAYER
```

> **GitHub Pages は静的ファイルの配信のみ**です。シグナリングは PeerJS クラウド、ゲーム中の通信はブラウザ間の P2P（WebRTC）で行われ、GitHub のサーバーはゲーム通信に関与しません。
>
> HTTPS 配信なので WebRTC は利用できますが、TURN サーバーは未設定です。異なるネットワーク間では STUN で接続を試みるため、symmetric NAT や CGNAT の環境では接続できない場合があります。その場合は同じ LAN で遊ぶか、VPN を使うか、`src/net/PeerRoom.js` の `iceServers` に TURN を追加してください。ホストがタブを閉じるとルームは終了します。

---

## トラブルシューティング

### 画面が崩れる / CSS が当たらない

- `index.html` をダブルクリックして `file://` で開いていませんか。この構成ではブラウザのセキュリティ制限により CSS と JavaScript がブロックされます
- `start-game.bat` をダブルクリックするか、ターミナルで `npm.cmd run dev` を実行し、`http://localhost:5173` を開いてください
- 直接開いた場合は、起動方法を案内する画面が表示されます

### 「Port 5173 is already in use」と出る

- 既に別の開発サーバーが起動しています。`http://localhost:5173` を開くか、そのサーバーを起動したコンソールを閉じてください
- 最新の `start-game.bat` は、既存のゲームサーバーを検出するとブラウザだけを開きます。5173 が他の用途で使用中の場合は 5174 以降の空きポートで起動します
- 手動で起動する場合は `npm.cmd run dev -- --port 5174` のようにポートを変更してください

### ルームに参加できない

- ルームコードが 1〜4 文字の英数字か確認する（例: `A1`, `NEON`）
- ホストが先に「ルームを作成」しているか確認する
- 同じコードのルームが既に存在しないか確認する（ホスト ID が衝突します）
- 満員（4人）になっていないか確認する
- クラウドのシグナリングが不安定な場合は、ローカル PeerServer を試す

### 「ホストが見つかりません」と出る

- ホストが退出していないか確認する
- ルームコードの大文字小文字は自動変換されるが、余計な記号・空白が入っていないか確認する
- 企業ネットワークや VPN で WebRTC が遮断されていないか確認する

### 接続はできるが相手が見えない / 動かない

- 両方とも「DEPLOY」しているか確認する（ホストの開始後にゲストが参加した場合も、各自 DEPLOY が必要）
- タブがバックグラウンドでサスペンドされていないか確認する
- 15 Hz スナップショットが4回連続で途切れると、相手は削除されます。回線品質を確認する

### P2P 接続が確立できない

STUN だけでは symmetric NAT を越えられません。以下を試してください。

- 自動再試行（最大3回）が終わっても失敗する場合は、いったんメニューに戻ってから再度参加する
- 同じ LAN に接続する
- ローカル PeerServer + LAN IP を使う
- `src/net/PeerRoom.js` の `iceServers` に TURN サーバーを追加する
- VPN で同一ネットワーク扱いにする

### 動作が重い

- 設定で描画クオリティを **LOW** にする
- ブラウザのハードウェアアクセラレーションを有効にする
- 他のタブやアプリを閉じる
- 解像度を下げる（ブラウザのズーム / ウィンドウサイズ）

### マウスロックできない

- ページをクリックしてから「DEPLOY」を押す
- 埋め込みブラウザや iframe ではロックが拒否されることがあります。自動テストでは `?unlocked=1` を使用します

### 音が出ない

- ブラウザの自動再生制限により、最初のクリックまでは音が出ません。DEPLOY 後に有効になります
- 設定のマスター音量とミュート（`M`）を確認する

---

## 既知の制限

- ホスト移行（host migration）は未実装です。ホストが退出するとルームは終了します。
- ゲームサーバーはなく、ホストのブラウザが権限を持ちます。チート対策は限定的です。
- TURN サーバーは未設定です。厳しい NAT 環境では P2P 接続に失敗することがあります。
- モバイル / タッチ操作、ゲームパッドには未対応です。
- 試合終了条件、リマッチ、観戦モードは未実装です。
- ルームコードは 1〜4 文字のため、総当たりされやすい点に注意してください。身内での利用を想定しています。
- 外部アセットを使わないため、すべてのモデル・効果音は実行時生成です。見た目を差し替える場合は各モジュール / 武器の `buildModel()` を編集してください。

---

## クレジット

- [Three.js](https://threejs.org/) — 3D レンダリング
- [PeerJS](https://peerjs.com/) — WebRTC シグナリングと DataConnection
- [Orbitron](https://fonts.google.com/specimen/Orbitron) — UI フォント（`@fontsource/orbitron`）
- 効果音・モデル・テクスチャ — 本プロジェクト内でプロシージャル生成
