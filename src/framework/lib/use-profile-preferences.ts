"use client";

import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import { usePersistentToggle } from "./use-persistent-toggle";
import { fetchAuthedClient } from "./api";

/**
 * L3.5 (DS_LAYOUTS_V1_1_PLAN) — Preferenze UI dell'utente persistite sul profilo.
 *
 * Strategia a due livelli:
 * - localStorage (via usePersistentToggle) è la fonte IMMEDIATA: zero flash al
 *   mount e funzionamento pieno anche offline/anonimo (fallback);
 * - il profilo (Users.metadata.preferences, via POST /api/user/{uid}/profile) è
 *   la fonte di ROAMING: la shell si idrata dal contratto dashboard già caricato
 *   da useClaimsSync (nessuna richiesta extra) e persiste i cambi con debounce.
 * L'hydrate dal server si applica solo finché l'utente non interviene nella
 * sessione corrente (il gesto locale vince sempre sul valore remoto).
 */

export const profilePreferencesSchema = z.object({
  sidebarCollapsed: z.boolean().optional(),
  tableDensity: z.enum(["comfortable", "compact"]).optional()
});

export type ProfilePreferences = z.infer<typeof profilePreferencesSchema>;

const profileUpdateResponseSchema = z.looseObject({
  success: z.boolean()
});

/** Estrae le preferenze tipizzate dal blocco `user.preferences` del contratto dashboard. */
export function parseProfilePreferences(raw: unknown): ProfilePreferences | undefined {
  const parsed = profilePreferencesSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

const PERSIST_DEBOUNCE_MS = 800;

export function useSidebarCollapsedPreference(
  userId: string | undefined,
  rawServerPreferences: unknown
): [boolean, (value: boolean) => void] {
  const [collapsed, setCollapsedLocal] = usePersistentToggle("klx-sidebar-collapsed", false);
  // Il gesto dell'utente in questa sessione vince sull'hydrate remoto.
  const dirtyRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const serverValue = parseProfilePreferences(rawServerPreferences)?.sidebarCollapsed;

  // Hydrate dal profilo: adotta il valore remoto (una volta disponibile) finché
  // l'utente non ha toccato il toggle nella sessione corrente.
  useEffect(() => {
    if (serverValue === undefined || dirtyRef.current) return;
    if (serverValue !== collapsed) setCollapsedLocal(serverValue);
  }, [serverValue, collapsed, setCollapsedLocal]);

  const setCollapsed = useCallback(
    (value: boolean) => {
      dirtyRef.current = true;
      setCollapsedLocal(value);
      if (!userId) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void fetchAuthedClient(`/api/user/${userId}/profile`, {
          method: "POST",
          body: JSON.stringify({ preferences: { sidebarCollapsed: value } })
        }, {
          validate: (raw) => profileUpdateResponseSchema.parse(raw)
        }).catch((err) => {
          // Fallback esplicito: localStorage resta la fonte locale, il roaming riproverà al prossimo cambio.
          console.warn("[Preferences] Persistenza sidebarCollapsed sul profilo non riuscita:", err);
        });
      }, PERSIST_DEBOUNCE_MS);
    },
    [userId, setCollapsedLocal]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return [collapsed, setCollapsed];
}
