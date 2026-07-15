/**
 * Sanificazione di schema per URL provenienti da dati esterni (risposte API,
 * campi record) prima di usarli in `href` o nei redirect (`location.assign`).
 * Difesa in profondità contro `javascript:`/`data:`: consente SOLO URL
 * assoluti http(s). Gemello del `safeUrl` inline di `components/email/
 * EmailTemplate.tsx` (che resta autonomo: il template email non importa nulla
 * a runtime per essere renderizzabile ovunque).
 */

/** Ritorna l'URL se è un http(s) assoluto, altrimenti `null`. */
export function toHttpUrl(url: string | null | undefined): string | null {
  const trimmed = String(url ?? "").trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

/** Variante per gli attributi `href`: degrada a "#" (mai stringa vuota). */
export function safeHttpHref(url: string | null | undefined): string {
  return toHttpUrl(url) ?? "#";
}

/**
 * Redirect sanificato: naviga SOLO se l'URL è http(s); altrimenti logga e non
 * fa nulla (un backend compromesso non deve poterci far navigare su schemi
 * arbitrari). Ritorna true se la navigazione è partita.
 */
export function assignHttpUrl(url: string | null | undefined): boolean {
  const safe = toHttpUrl(url);
  if (!safe) {
    console.error("[safe-url] Redirect bloccato: URL non http(s):", String(url ?? "").slice(0, 120));
    return false;
  }
  window.location.assign(safe);
  return true;
}
