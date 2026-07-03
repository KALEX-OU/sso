import { NextRequest } from "next/server";

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

/**
 * Verifica la validità di un session cookie di KALEX effettuando una chiamata server-to-server
 * verso l'API Gateway centralizzato.
 */
export async function verifySessionCookieServerSide(
  sessionCookie: string,
  request: NextRequest,
  apiBaseUrl?: string
): Promise<boolean> {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || "https://api.kalex.cloud";
  try {
    const verifyRes = await fetch(`${baseUrl}/auth/verify-session`, {
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
      return !!(verifyData && verifyData.success);
    }
    
    // Qualsiasi status diverso da 200 (401, 403, ma anche 5xx) => sessione NON considerata valida.
    // FAIL-CLOSED (T1.11): non si preserva la sessione su errore del server, per non lasciare
    // passare un cookie non verificato quando l'API è degradata.
    // Trade-off: un'indisponibilità temporanea dell'API può richiedere un nuovo login.
    console.warn(`[Framework Proxy] Verifica sessione non riuscita (Status: ${verifyRes.status}). Sessione NON validata (fail-closed).`);
    return false;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[Framework Proxy] Errore di rete/connessione durante la verifica sessione (fail-closed):", errMsg);
    // FAIL-CLOSED: in caso di errore di rete non si preserva la sessione.
    return false;
  }
}

