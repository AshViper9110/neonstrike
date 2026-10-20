export class EventBus {
  constructor() {
    this._handlers = new Map();
  }

  on(type, handler) {
    if (!this._handlers.has(type)) this._handlers.set(type, new Set());
    this._handlers.get(type).add(handler);
    return () => this.off(type, handler);
  }

  once(type, handler) {
    const wrap = (...args) => {
      this.off(type, wrap);
      handler(...args);
    };
    return this.on(type, wrap);
  }

  off(type, handler) {
    this._handlers.get(type)?.delete(handler);
  }

  listenerCount(type) {
    return this._handlers.get(type)?.size ?? 0;
  }

  emit(type, ...args) {
    const set = this._handlers.get(type);
    if (!set) return;
    for (const handler of [...set]) {
      try {
        handler(...args);
      } catch (error) {
        console.error(`[EventBus] handler error for "${type}"`, error);
      }
    }
  }

  clear() {
    this._handlers.clear();
  }
}
