import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { parseLocalePath, verifySessionCookieServerSide } from "./framework/lib/proxy";

const locales = ["it", "en", "es"] as const;
const defaultLocale = "en";

const I18nMiddleware = createI18nMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  urlMappingStrategy: "redirect"
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kalex.cloud";

export async function proxy(request: NextRequest) {
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
  const sessionCookie = request.cookies.get("kalex_session")?.value;

  let isSessionValid = false;
  if (sessionCookie) {
    isSessionValid = await verifySessionCookieServerSide(sessionCookie, request, API_BASE_URL);
  }

  // Se l'utente è autenticato ed accede alla root ("/"), reindirizza alla dashboard
  if (isSessionValid && relativePath === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return Response.redirect(url);
  }

  // Se l'URL non è localizzato, facciamo subito un redirect all'URL localizzato corretto
  if (!isLocalized) {
    const url = request.nextUrl.clone();
    if (!isSessionValid && !isPublicRoute) {
      url.pathname = `/${locale}/auth`;
      if (pathname !== "/") {
        url.searchParams.set("redirectTo", pathname);
      }
    } else {
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      if (isSessionValid && pathname === "/") {
        url.pathname = `/${locale}/dashboard`;
      }
    }
    return Response.redirect(url);
  }

  // Se l'URL è già localizzato, applichiamo il controllo di autenticazione per le rotte private
  if (!isSessionValid && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth`;
    if (relativePath !== "/") {
      url.searchParams.set("redirectTo", relativePath);
    }
    
    // Invia il redirect pulendo il cookie non valido
    const response = NextResponse.redirect(url.toString());
    if (sessionCookie) {
      const isProd = process.env.NODE_ENV === "production" || !request.headers.get("host")?.includes("localhost");
      response.cookies.delete("kalex_session");
      if (isProd) {
        response.cookies.set("kalex_session", "", {
          path: "/",
          domain: ".kalex.cloud",
          expires: new Date(0)
        });
      }
    }
    return response;
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
