import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {
  emit(event, ...args) {
    // Log the event for visibility/tracing (solid tracking)
    console.log(`[Event Bus] Emitting: ${event}`, ...args);
    return super.emit(event, ...args);
  }
}

const appEventEmitter = new AppEventEmitter();

export default appEventEmitter;
