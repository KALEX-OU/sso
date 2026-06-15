import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["it", "en", "es"],
  defaultLocale: "en",
  urlMappingStrategy: "redirect"
});

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return "en";
  
  const languages = acceptLanguage
    .split(",")
    .map(lang => lang.split(";")[0].trim().toLowerCase().split("-")[0]);
    
  const matched = languages.find(lang => ["it", "en", "es"].includes(lang));
  return matched || "en";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignora le chiamate API e le risorse statiche
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  // Estraiamo il locale dal pathname per capire se siamo su una rotta localizzata
  const parts = pathname.split("/");
  const firstSegment = parts[1];
  const isLocalized = ["it", "en", "es"].includes(firstSegment);
  
  // Calcoliamo il locale da usare
  const locale = isLocalized ? firstSegment : getLocaleFromHeaders(request);
  
  // Calcoliamo la rotta relativa depurata dal locale
  const relativePath = isLocalized ? "/" + parts.slice(2).join("/") : pathname;

  // Rotte pubbliche che non richiedono login
  const isPublicRoute = 
    relativePath.startsWith("/auth") || 
    relativePath.startsWith("/privacy") || 
    relativePath.startsWith("/terms");

  // Leggiamo il cookie di sessione client-side/server-side
  const sessionCookie = request.cookies.get("sso_session")?.value;

  // Se l'URL non è localizzato, facciamo subito un redirect all'URL localizzato corretto
  if (!isLocalized) {
    const url = request.nextUrl.clone();
    if (!sessionCookie && !isPublicRoute) {
      url.pathname = `/${locale}/auth`;
    } else {
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    }
    return Response.redirect(url);
  }

  // Se l'URL è già localizzato, applichiamo il controllo di autenticazione per le rotte private
  if (!sessionCookie && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth`;
    return Response.redirect(url);
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
