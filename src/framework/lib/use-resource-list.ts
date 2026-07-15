"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook condiviso per le LISTE risorsa dei moduli app-level (S4,
 * docs/DS_FOUNDATION_HARDENING_PLAN.md): incapsula il ciclo che ogni modulo
 * ripeteva a mano (~60 righe l'uno) — fetch autenticato → validazione Zod
 * (`safeParse`: payload malformato = errore i18n, mai dato corrotto) →
 * stati loading/error → reload.
 *
 * Le stringhe d'errore e le funzioni di supporto sono lette via ref
 * (aggiornate a ogni render): il cambio lingua NON ri-innesca il fetch
 * (stesso contratto del pattern `sRef` dei moduli).
 */

/** Sottoinsieme di SafeParseReturnType usato dall'hook (evita il vincolo sul tipo input). */
type SafeParsed<P> =
  | { success: true; data: P }
  | { success: false; error: unknown };

export interface UseResourceListOptions<P extends { success: boolean }, T> {
  /** URL della lista (già completo di query). Stringa vuota = fetch disabilitato. */
  path: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  /** Schema Zod della risposta (usato con safeParse). */
  schema: { safeParse: (data: unknown) => SafeParsed<P> };
  /** Estrae gli item dal payload validato (es. `(d) => d.items ?? []`). */
  select: (data: P) => T[];
  /** Estrae il messaggio dall'error-envelope quando success=false (es. apiErrorMessage). */
  errorMessage: (data: P) => string | undefined;
  /** Messaggi i18n correnti (ricalcolati a ogni render, letti via ref al momento dell'errore). */
  errLoad: string;
  errConnection: string;
  /** Tag per i log di diagnostica (es. "ProductModule"). */
  logTag: string;
  /** Il fetch parte solo se true (default: path non vuoto). */
  enabled?: boolean;
}

export interface UseResourceListResult<T> {
  items: T[];
  loading: boolean;
  error: string | undefined;
  reload: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

export function useResourceList<P extends { success: boolean }, T>(
  options: UseResourceListOptions<P, T>
): UseResourceListResult<T> {
  const { path, fetchAuthed } = options;
  const enabled = options.enabled ?? path.length > 0;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // Tutto ciò che può cambiare identità a ogni render vive in un ref: il
  // reload dipende SOLO da path/fetchAuthed (niente loop di useEffect).
  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  }, [options]);

  const reload = useCallback(async () => {
    const o = optsRef.current;
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed(path);
      const parsed = o.schema.safeParse(await res.json());
      if (!parsed.success) {
        console.error(`[${o.logTag}] Risposta non conforme allo schema:`, parsed.error);
        setError(o.errLoad);
        return;
      }
      if (parsed.data.success) {
        setItems(o.select(parsed.data));
      } else {
        setError(o.errorMessage(parsed.data) ?? o.errLoad);
      }
    } catch (err) {
      console.error(`[${o.logTag}] Load Error:`, err);
      setError(o.errConnection);
    } finally {
      setLoading(false);
    }
  }, [path, fetchAuthed]);

  useEffect(() => {
    if (!enabled) return;
    // Deferred: evita setState sincrono nell'effect (cascading renders).
    const timer = setTimeout(() => {
      void reload();
    }, 0);
    return () => clearTimeout(timer);
  }, [enabled, reload]);

  return { items, loading, error, reload, setItems };
}
