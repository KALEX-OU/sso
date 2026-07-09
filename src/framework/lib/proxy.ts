import { NextRequest } from "next/server";
import { getApiBaseUrl } from "./urls";

/**
 * Estrae la lingua preferita del client analizzando l'header Accept-Language.
 */
export function getLocaleFromHeaders(
  request: NextRequest,
  locales: readonly string[],
  defaultLocale: string
): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;
  
  const languages = acceptLanguage
    .split(",")
    .map(lang => lang.split(";")[0].trim().toLowerCase().split("-")[0]);
    
  const matched = languages.find(lang => locales.includes(lang));
  return matched || defaultLocale;
}

/**
 * Analizza il pathname della richiesta per determinare se contiene già il segmento del locale
 * e calcola la rotta relativa ripulita.
 */
export function parseLocalePath(
  pathname: string,
  locales: readonly string[],
  defaultLocale: string,
  request?: NextRequest
): { locale: string; isLocalized: boolean; relativePath: string } {
  const parts = pathname.split("/");
  const firstSegment = parts[1];
  const isLocalized = locales.includes(firstSegment);
  
  let locale = defaultLocale;
  if (isLocalized) {
    locale = firstSegment;
  } else if (request) {
    locale = getLocaleFromHeaders(request, locales, defaultLocale);
  }
  
  const relativePath = isLocalized ? "/" + parts.slice(2).join("/") : pathname;
  
  return { locale, isLocalized, relativePath };
}

/**
 * Ricostruisce l'URL reale del client leggendo gli header del proxy GCP (x-forwarded-host e x-forwarded-proto)
 * con fallback sicuro sui valori originali di NextRequest.
 */
export function getRealRequestUrl(
  request: NextRequest,
  locale: string,
  relativePath: string
): string {
  const currentUrl = request.nextUrl.clone();
  const forwardedHost = request.headers.get("x-forwarded-host") || currentUrl.host;
  const forwardedProto = request.headers.get("x-forwarded-proto") || currentUrl.protocol.replace(":", "");
  return `${forwardedProto}://${forwardedHost}/${locale}${relativePath}`;
}

// Cache in-process della verifica sessione (piano Identity Center 2.3): il proxy chiama
// /auth/verify-session ad OGNI richiesta; con una cache short-TTL, N richieste ravvicinate
// della stessa sessione costano 1 sola verifica upstream (O(sessioni) invece di O(richieste)).
// Chiave = SHA-256 del cookie (non si conserva il valore in chiaro in una struttura long-lived).
// Trade-off DOCUMENTATO: una revoca lato server (logout globale, kill-switch admin) diventa
// effettiva sul proxy entro il TTL (default 30s, env VERIFY_SESSION_CACHE_TTL_MS). Il logout
// locale cancella il cookie → chiave diversa/assente, la cache è bypassata per costruzione.
// Gli errori upstream (5xx/rete) NON vengono cachati: restano fail-closed per singola richiesta.
const VERIFY_SESSION_CACHE_TTL_MS = parseInt(process.env.VERIFY_SESSION_CACHE_TTL_MS || "30000", 10);
const VERIFY_SESSION_NEGATIVE_TTL_MS = 5000; // 401/403: breve, evita martellamento con cookie morti
const VERIFY_SESSION_CACHE_MAX = 5000;
const verifySessionCache = new Map<string, { valid: boolean; expiresAt: number }>();

async function hashSessionCookieValue(value: string): Promise<string> {
  // Web Crypto: disponibile sia nel runtime Edge del middleware Next sia in Node 18+
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function pruneVerifySessionCache(now: number): void {
  if (verifySessionCache.size <= VERIFY_SESSION_CACHE_MAX) return;
  for (const [key, entry] of verifySessionCache.entries()) {
    if (entry.expiresAt < now) verifySessionCache.delete(key);
  }
  // Se ancora oltre il limite (tutte entry vive), si eliminano le più vecchie per inserzione
  if (verifySessionCache.size > VERIFY_SESSION_CACHE_MAX) {
    const excess = verifySessionCache.size - VERIFY_SESSION_CACHE_MAX;
    let removed = 0;
    for (const key of verifySessionCache.keys()) {
      verifySessionCache.delete(key);
      if (++removed >= excess) break;
    }
  }
}

/**
 * Verifica la validità di un session cookie di KALEX effettuando una chiamata server-to-server
 * verso l'API Gateway centralizzato, con cache short-TTL in-process (2.3).
 */
export async function verifySessionCookieServerSide(
  sessionCookie: string,
  request: NextRequest,
  apiBaseUrl?: string
): Promise<boolean> {
  const baseUrl = apiBaseUrl || getApiBaseUrl();

  const now = Date.now();
  const cacheKey = await hashSessionCookieValue(sessionCookie);
  const cached = verifySessionCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.valid;
  }

  try {
    const verifyRes = await fetch(`${baseUrl}/v1/auth/verify-session`, {
      method: "POST",
      headers: {
        "Cookie": `kalex_session=${sessionCookie}`,
        "X-Firebase-AppCheck": request.headers.get("x-firebase-appcheck") || "",
        "X-Firebase-AppCheck-Debug": request.headers.get("x-firebase-appcheck-debug") || ""
      },
      cache: "no-store"
    });

    if (verifyRes.status === 200) {
      const verifyData = (await verifyRes.json()) as { success: boolean };
      const valid = !!(verifyData && verifyData.success);
      pruneVerifySessionCache(now);
      verifySessionCache.set(cacheKey, { valid, expiresAt: now + VERIFY_SESSION_CACHE_TTL_MS });
      return valid;
    }

    // Verdetti espliciti di sessione invalida: cache breve per non martellare l'upstream
    if (verifyRes.status === 401 || verifyRes.status === 403) {
      pruneVerifySessionCache(now);
      verifySessionCache.set(cacheKey, { valid: false, expiresAt: now + VERIFY_SESSION_NEGATIVE_TTL_MS });
      console.warn(`[Framework Proxy] Sessione rifiutata dall'upstream (Status: ${verifyRes.status}).`);
      return false;
    }

    // Qualsiasi altro status (5xx) => sessione NON considerata valida, MA senza cache.
    // FAIL-CLOSED (T1.11): non si preserva la sessione su errore del server, per non lasciare
    // passare un cookie non verificato quando l'API è degradata.
    // Trade-off: un'indisponibilità temporanea dell'API può richiedere un nuovo login.
    console.warn(`[Framework Proxy] Verifica sessione non riuscita (Status: ${verifyRes.status}). Sessione NON validata (fail-closed).`);
    return false;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[Framework Proxy] Errore di rete/connessione durante la verifica sessione (fail-closed):", errMsg);
    // FAIL-CLOSED: in caso di errore di rete non si preserva la sessione (nessuna cache).
    return false;
  }
}

