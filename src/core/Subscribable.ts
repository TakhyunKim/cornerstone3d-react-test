type Listener = () => void;

/**
 * Class for useSyncExternalStore for connecting with react
 * useSyncExternalStore Docs: https://react.dev/reference/react/useSyncExternalStore
 */
export class Subscribable<TListener extends Function = Listener> {
  protected listeners: Set<TListener>;

  constructor() {
    this.listeners = new Set();
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: TListener): () => void {
    this.listeners.add(listener);

    this.onSubscribe();

    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }

  emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };

  onSubscribe(): void {
    // Do nothing
  }

  onUnsubscribe(): void {
    // Do nothing
  }
}
