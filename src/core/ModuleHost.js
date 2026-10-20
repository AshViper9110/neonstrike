/**
 * Tiny ordered module host used by both the game session and stages.
 * Modules are plain objects with optional lifecycle hooks:
 *   init(host), update(dt, time, host), fixedUpdate(dt, host), resize(w,h,host), dispose(host)
 * Keeping this generic is what lets new gameplay systems / arena pieces
 * be added without editing a central god-object.
 */
export class ModuleHost {
  constructor(context = {}) {
    this.context = context;
    this.modules = [];
    this._byName = new Map();
    this._started = false;
    this._disposed = false;
  }

  add(name, module, { order = 0 } = {}) {
    if (this._disposed) throw new Error('ModuleHost is disposed');
    if (this._byName.has(name)) throw new Error(`Module "${name}" already exists`);
    const entry = { name, module, order, timer: 0 };
    this.modules.push(entry);
    this._byName.set(name, entry);
    this.modules.sort((a, b) => a.order - b.order);
    if (this._started) module.init?.(this.context, this);
    return module;
  }

  get(name) {
    return this._byName.get(name)?.module;
  }

  init() {
    if (this._started) return;
    this._started = true;
    for (const entry of this.modules) entry.module.init?.(this.context, this);
  }

  update(dt, time) {
    if (this._disposed) return;
    for (const entry of this.modules) {
      entry.module.update?.(dt, time, this.context);
    }
  }

  fixedUpdate(dt) {
    if (this._disposed) return;
    for (const entry of this.modules) {
      entry.module.fixedUpdate?.(dt, this.context);
    }
  }

  resize(width, height) {
    for (const entry of this.modules) entry.module.resize?.(width, height, this.context);
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    for (const entry of [...this.modules].reverse()) {
      try {
        entry.module.dispose?.(this.context);
      } catch (error) {
        console.error(`[ModuleHost] dispose failed for ${entry.name}`, error);
      }
    }
    this.modules.length = 0;
    this._byName.clear();
  }
}
