interface Listener<Event extends keyof Events> {
  (payload: Events[Event]): void;
}

export enum Event {
  NODE_SELECTED = 'node_selected',
  NODE_DESELECTED = 'node_deselected',
  STABILIZATION_START = 'stabilization_start',
  STABILIZATION_END = 'stabilization_end',
  RENDER_START = 'render_start',
  RENDER_END = 'render_end',
  PHYSICS_TICK = 'physics_tick',
  DRAG_START = 'drag_start',
  DRAG_END = 'drag_end',
  DRAGGING = 'dragging'
}

export type Events = {
  [Event.NODE_SELECTED]: string;
  [Event.NODE_DESELECTED]: string;
  [Event.STABILIZATION_START]: string;
  [Event.STABILIZATION_END]: string;
  [Event.PHYSICS_TICK]: string;
  [Event.RENDER_START]: string;
  [Event.RENDER_END]: string;
  [Event.DRAG_START]: string;
  [Event.DRAG_END]: string;
  [Event.DRAGGING]: string;
};

export class TypedEventEmitter {
  private listeners: Map<Event, Listener<Event>[]> = new Map();
  private listenersOnce: Map<Event, Listener<Event>[]> = new Map();

  public on<Event extends keyof Events>(
    event: Event,
    listener: (payload: Events[Event]) => void
  ) {
    const eventListeners = this.listeners.get(event);

    if (!eventListeners) {
      this.listeners.set(event, [listener]);
    } else {
      eventListeners.push(listener);
    }
    return {
      dispose: () => this.off(event, listener)
    };
  }

  public once<Event extends keyof Events>(
    event: Event,
    listener: Listener<Event>
  ) {
    const eventListeners = this.listenersOnce.get(event);

    if (!eventListeners) {
      this.listenersOnce.set(event, [listener]);
    } else {
      eventListeners.push(listener);
    }
  }

  public off<Event extends keyof Events>(
    event: Event,
    listener: Listener<Event>
  ) {
    const eventListeners = this.listeners.get(event);

    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  public emit<Event extends keyof Events>(
    event: Event,
    payload: Events[Event]
  ) {
    const eventListeners = this.listeners.get(event);
    const onceListeners = this.listenersOnce.get(event);

    if (eventListeners && eventListeners.length) {
      eventListeners.forEach(listener => listener(payload));
    }

    if (onceListeners && onceListeners.length) {
      onceListeners.forEach(listener => listener(payload));
      this.listenersOnce.clear();
    }
  }

  public addEventListener<Event extends keyof Events>(
    event: Event,
    listener: Listener<Event>
  ) {
    return this.on(event, listener);
  }

  public removeEventListener<Event extends keyof Events>(
    event: Event,
    listener: Listener<Event>
  ) {
    this.off(event, listener);
  }
}
