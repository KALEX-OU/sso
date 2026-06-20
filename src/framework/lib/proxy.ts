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
