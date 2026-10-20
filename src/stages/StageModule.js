/**
 * A stage module is a self-contained piece of arena content: geometry,
 * colliders, trigger handlers and update logic. Stages are just data lists
 * of modules. Adding a new gimmick = add a module class + register it.
 */
export class StageModule {
  constructor(config = {}) {
    this.config = config;
    this.id = config.id || `${this.constructor.moduleType || 'module'}-${Math.random().toString(36).slice(2, 7)}`;
    this.group = null;
  }

  build(_ctx, _stage) {}

  update(_dt, _time, _ctx, _stage) {}

  dispose(_ctx) {
    if (this.group) {
      this.group.removeFromParent();
      this.group = null;
    }
  }
}

export class StageModuleRegistry {
  constructor() {
    this.types = new Map();
  }

  register(type, ctor) {
    if (this.types.has(type)) throw new Error(`Stage module "${type}" already registered`);
    this.types.set(type, ctor);
    ctor.moduleType = type;
    return ctor;
  }

  create(spec) {
    const Ctor = this.types.get(spec.type);
    if (!Ctor) throw new Error(`Unknown stage module type "${spec.type}"`);
    return new Ctor(spec);
  }

  list() {
    return [...this.types.keys()];
  }
}

export const stageModules = new StageModuleRegistry();
