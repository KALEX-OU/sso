import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { parseLocalePath } from "./framework/lib/proxy";

const locales = ["it", "en", "es"] as const;
const defaultLocale = "en";

const I18nMiddleware = createI18nMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  urlMappingStrategy: "redirect"
});

const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

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
    try {
      const verifyRes = await fetch(`${API_BASE_URL}/auth/verify-session`, {
        method: "POST",
        headers: {
          "Cookie": `kalex_session=${sessionCookie}`,
          "X-Firebase-AppCheck": request.headers.get("x-firebase-appcheck") || "",
          "X-Firebase-AppCheck-Debug": request.headers.get("x-firebase-appcheck-debug") || ""
        },
        cache: "no-store"
      });
      if (verifyRes.status === 200) {
        const verifyData = await verifyRes.json();
        if (verifyData && verifyData.success) {
          isSessionValid = true;
        }
      }
    } catch (err) {
      console.error("[SSO Proxy] Errore verifica sessione server-side:", err);
    }
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
