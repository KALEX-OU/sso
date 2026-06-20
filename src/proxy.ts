import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";
import { parseLocalePath } from "./framework/lib/proxy";

const locales = ["it", "en", "es"] as const;
const defaultLocale = "en";

const I18nMiddleware = createI18nMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  urlMappingStrategy: "redirect"
});

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

  // Estrae il locale e la rotta relativa usando gli helper del framework
  const { locale, isLocalized, relativePath } = parseLocalePath(
    pathname,
    locales,
    defaultLocale,
    request
  );

  // Rotte pubbliche che non richiedono login
  const isPublicRoute = 
    relativePath.startsWith("/auth") || 
    relativePath.startsWith("/privacy") || 
    relativePath.startsWith("/terms");

  // Leggiamo il cookie di sessione client-side/server-side
  const sessionCookie = request.cookies.get("sso_session")?.value;

  // Se l'utente è autenticato ed accede alla root ("/"), reindirizza alla dashboard
  if (sessionCookie && relativePath === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return Response.redirect(url);
  }

  // Se l'URL non è localizzato, facciamo subito un redirect all'URL localizzato corretto
  if (!isLocalized) {
    const url = request.nextUrl.clone();
    if (!sessionCookie && !isPublicRoute) {
      url.pathname = `/${locale}/auth`;
      if (pathname !== "/") {
        url.searchParams.set("redirectTo", pathname);
      }
    } else {
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      if (sessionCookie && pathname === "/") {
        url.pathname = `/${locale}/dashboard`;
      }
    }
    return Response.redirect(url);
  }

  // Se l'URL è già localizzato, applichiamo il controllo di autenticazione per le rotte private
  if (!sessionCookie && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth`;
    if (relativePath !== "/") {
      url.searchParams.set("redirectTo", relativePath);
    }
    return Response.redirect(url);
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
