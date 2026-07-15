"use client";

import { useCurrentLocale } from "@/locales/client";
import { it } from "./i18n/ui.it";
import { en } from "./i18n/ui.en";
import { es } from "./i18n/ui.es";

import type { UIStrings } from "./i18n/ui.it";

export type { UIStrings };

/**
 * Localizzazione del layer UI del framework (E2 DS_REFACTORING_V1_PLAN).
 *
 * Gemello di `components/layouts/form.localization.ts` (che copre le etichette
 * dei form generate dal registry): qui vivono TUTTE le stringhe statiche dei
 * componenti del framework (layouts, moduli app-level, wrapper) nelle 3 lingue.
 *
 * Regole:
 * - L'italiano è la lingua sorgente: il tipo `UIStrings` è derivato da `it`,
 *   quindi `en`/`es` non compilano se manca una chiave (completezza garantita).
 * - Interpolazione con segnaposto `{nome}` tramite `fmtUI()` (es. `{brand}`).
 * - Nei componenti si accede SOLO via `useUIStrings()` (reattivo al locale):
 *   vietato importare direttamente i dizionari o cablare testo nel markup.
 * - Il DebugWidget (strumento di sviluppo) è volutamente fuori scope.
 *
 * AGGIUNGERE UNA LINGUA (es. "fr"):
 *   1. creare lib/i18n/ui.fr.ts: `export const fr: UIStrings = {...}` (copiare
 *      ui.en.ts e tradurre — il tipo segnala ogni chiave mancante);
 *   2. importarla qui e aggiungerla a UI_STRINGS (la union dei locale si aggiorna
 *      da sola via keyof);
 *   3. registrare il locale nel router i18n delle app (sso/web: src/locales).
 *   Se la lingua è RTL, aggiungerla a RTL_LOCALES qui sotto.
 */

export const UI_STRINGS: Readonly<Record<"it" | "en" | "es", UIStrings>> = { it, en, es };

export type UILocale = keyof typeof UI_STRINGS;

/** Normalizza un locale arbitrario su quelli supportati (fallback: it). */
export function resolveUILocale(locale: string | undefined | null): UILocale {
  return locale === "en" || locale === "es" ? locale : "it";
}

/**
 * Locale con direzione di scrittura right-to-left (E3.1 DS_REFACTORING_V1_PLAN).
 * NB: i locale oggi attivi (it/en/es) sono tutti LTR — il supporto RTL è
 * PREDISPOSTO per mercati futuri (arabo, ebraico, farsi, urdu): aggiungendo
 * uno di questi locale a next-international, `dir="rtl"` su <html> e le
 * logical properties di Tailwind (ms-/me-/ps-/pe-/start-/end-…) si attivano
 * automaticamente senza altri interventi.
 */
export const RTL_LOCALES: readonly string[] = ["ar", "he", "fa", "ur"];

/**
 * Direzione di scrittura per un locale arbitrario (anche regionale, es. "ar-EG").
 * Fallback prudente: "ltr" per locale sconosciuti/assenti.
 */
export function localeDirection(locale: string | null | undefined): "ltr" | "rtl" {
  if (!locale) return "ltr";
  const base = locale.toLowerCase().split(/[-_]/)[0];
  return RTL_LOCALES.includes(base) ? "rtl" : "ltr";
}

/** Interpolazione dei segnaposto `{nome}` (es. fmtUI(s.min, { n: 3 })). */
export function fmtUI(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  );
}

/**
 * Hook reattivo: restituisce il dizionario UI nella lingua corrente.
 * Cambiando locale (useChangeLocale) l'intera UI del framework si aggiorna
 * senza reload. Uso: `const s = useUIStrings(); … s.common.save`.
 */
export function useUIStrings(): UIStrings {
  const locale = useCurrentLocale();
  return UI_STRINGS[resolveUILocale(locale)];
}
