"use client";

import { useCallback, useSyncExternalStore } from "react";

// Store esterno per un flag booleano persistito in `localStorage`, compatibile con
// React 19 / `useSyncExternalStore`: legge lo stato senza `setState` dentro
// `useEffect` (evita il lint `react-hooks/set-state-in-effect`). Sincronizza tra
// tab diverse via l'evento nativo `storage` e, nello stesso tab, via una notifica
// esplicita ai subscriber dopo ogni scrittura (l'evento `storage` non si auto-emette
// nel tab che ha effettuato la modifica).

const listeners = new Map<string, Set<() => void>>();

function subscribeKey(key: string, cb: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);

  const onStorage = (e: StorageEvent): void => {
    if (e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    const current = listeners.get(key);
    current?.delete(cb);
    if (current && current.size === 0) listeners.delete(key);
    window.removeEventListener("storage", onStorage);
  };
}

function notify(key: string): void {
  listeners.get(key)?.forEach((cb) => cb());
}

/**
 * Hook `[value, setValue]` per un booleano persistito in `localStorage`.
 * In SSR (e durante l'idratazione) restituisce `defaultValue`, poi si allinea al
 * valore salvato lato client. Usa `useSyncExternalStore` per restare conforme alle
 * regole degli hook di React 19.
 */
/**
 * Hook `[value, setValue]` per una STRINGA persistita in `localStorage` (L4.5:
 * preferenza vista del ViewSwitcher e simili). Stessa meccanica del toggle:
 * store esterno + useSyncExternalStore, sync tra tab e default in SSR.
 */
export function usePersistentString(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const subscribe = useCallback((cb: () => void) => subscribeKey(key, cb), [key]);

  const getSnapshot = useCallback((): string => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? defaultValue : raw;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback((): string => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string): void => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // `localStorage` non disponibile (es. modalità privata) → nessuna persistenza.
      }
      notify(key);
    },
    [key]
  );

  return [value, setValue];
}

export function usePersistentToggle(
  key: string,
  defaultValue: boolean
): [boolean, (value: boolean) => void] {
  const subscribe = useCallback((cb: () => void) => subscribeKey(key, cb), [key]);

  const getSnapshot = useCallback((): boolean => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return raw === "true";
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback((): boolean => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean): void => {
      try {
        window.localStorage.setItem(key, next ? "true" : "false");
      } catch {
        // `localStorage` non disponibile (es. modalità privata) → nessuna persistenza.
      }
      notify(key);
    },
    [key]
  );

  return [value, setValue];
}
