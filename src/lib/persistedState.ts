type Listener = () => void;

export interface PersistedStore<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
}

export function createPersistedStore<T extends string>(
  key: string,
  defaultValue: T,
  decode: (raw: string | null) => T,
  onChange?: (value: T) => void,
): PersistedStore<T> {
  const listeners = new Set<Listener>();
  let cache: T | null = null;

  const read = (): T => {
    if (cache !== null) return cache;
    cache = typeof window === "undefined" ? defaultValue : decode(localStorage.getItem(key));
    return cache;
  };

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: read,
    getServerSnapshot: () => defaultValue,
    set: (value) => {
      cache = value;
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore */
      }
      onChange?.(value);
      listeners.forEach((listener) => listener());
    },
  };
}
