const GAME_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyR', 'KeyM', 'KeyF',
  'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'Space', 'Tab',
]);

function isEditable(target) {
  const tag = target?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable;
}

/**
 * Keyboard/mouse state used by the local simulation. Mouse deltas are only
 * collected while the pointer is locked, but keys can be consumed by tests or
 * by the pause menu while unlocked.
 */
export class Input {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.enabled = false;
    this.pointerLocked = false;
    this.keys = new Set();
    this.pressed = new Set();
    this.mouse = [false, false, false];
    this.mousePressed = new Set();
    this.lookX = 0;
    this.lookY = 0;
    this.wheel = 0;
    this.unlockedOverride = false;

    this._onKeyDown = (event) => this._handleKeyDown(event);
    this._onKeyUp = (event) => this._handleKeyUp(event);
    this._onMouseDown = (event) => this._handleMouseDown(event);
    this._onMouseUp = (event) => this._handleMouseUp(event);
    this._onMouseMove = (event) => this._handleMouseMove(event);
    this._onWheel = (event) => this._handleWheel(event);
    this._onContextMenu = (event) => {
      if (this._mouseActive) event.preventDefault();
    };
    this._onPointerLock = () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
      if (!this.pointerLocked) this._clearButtons();
    };
    this._onBlur = () => {
      this.keys.clear();
      this.pressed.clear();
      this._clearButtons();
    };
    this._onVisibility = () => {
      if (document.hidden) this._onBlur();
    };

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('wheel', this._onWheel, { passive: false });
    window.addEventListener('contextmenu', this._onContextMenu);
    window.addEventListener('blur', this._onBlur);
    document.addEventListener('pointerlockchange', this._onPointerLock);
    document.addEventListener('visibilitychange', this._onVisibility);
    this.pointerLocked = document.pointerLockElement === this.canvas;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.keys.clear();
      this.pressed.clear();
      this._clearButtons();
      this.lookX = 0;
      this.lookY = 0;
    }
  }

  /**
   * Test/automation hook: treat the pointer as locked while no real pointer
   * lock is available (headless Chrome, embedded browsers, iframes).
   */
  setUnlockedOverride(value) {
    this.unlockedOverride = Boolean(value);
    if (!this._mouseActive) this._clearButtons();
  }

  get _mouseActive() {
    return this.enabled && (this.pointerLocked || this.unlockedOverride);
  }

  _clearButtons() {
    this.mouse.fill(false);
    this.mousePressed.clear();
    this.wheel = 0;
  }

  _handleKeyDown(event) {
    if (!this.enabled || isEditable(event.target)) return;
    if (GAME_KEYS.has(event.code)) event.preventDefault();
    if (!this.keys.has(event.code)) this.pressed.add(event.code);
    this.keys.add(event.code);
  }

  _handleKeyUp(event) {
    if (isEditable(event.target)) return;
    this.keys.delete(event.code);
    if (GAME_KEYS.has(event.code)) event.preventDefault();
  }

  _handleMouseDown(event) {
    if (!this._mouseActive) return;
    if (event.button < 0 || event.button > 2) return;
    if (!this.mouse[event.button]) this.mousePressed.add(event.button);
    this.mouse[event.button] = true;
    if (event.button === 2) event.preventDefault();
  }

  _handleMouseUp(event) {
    if (event.button < 0 || event.button > 2) return;
    this.mouse[event.button] = false;
  }

  _handleMouseMove(event) {
    if (!this._mouseActive) return;
    this.lookX += event.movementX || 0;
    this.lookY += event.movementY || 0;
  }

  _handleWheel(event) {
    if (!this._mouseActive) return;
    event.preventDefault();
    this.wheel += Math.sign(event.deltaY);
  }

  isDown(code) {
    return this.keys.has(code);
  }

  anyDown(...codes) {
    return codes.some((code) => this.keys.has(code));
  }

  wasPressed(code) {
    return this.pressed.has(code);
  }

  consumeKey(code) {
    const had = this.pressed.has(code);
    this.pressed.delete(code);
    return had;
  }

  isMouseDown(button = 0) {
    return Boolean(this.mouse[button]);
  }

  consumeMousePress(button = 0) {
    const had = this.mousePressed.has(button);
    this.mousePressed.delete(button);
    return had;
  }

  takeLook() {
    const value = { x: this.lookX, y: this.lookY, wheel: this.wheel };
    this.lookX = 0;
    this.lookY = 0;
    this.wheel = 0;
    return value;
  }

  get moveForward() {
    return (this.isDown('KeyW') ? 1 : 0) - (this.isDown('KeyS') ? 1 : 0);
  }

  get moveRight() {
    return (this.isDown('KeyD') ? 1 : 0) - (this.isDown('KeyA') ? 1 : 0);
  }

  endFrame() {
    this.pressed.clear();
    this.mousePressed.clear();
    this.wheel = 0;
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('wheel', this._onWheel);
    window.removeEventListener('contextmenu', this._onContextMenu);
    window.removeEventListener('blur', this._onBlur);
    document.removeEventListener('pointerlockchange', this._onPointerLock);
    document.removeEventListener('visibilitychange', this._onVisibility);
  }
}
