import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["it", "en", "es"],
  defaultLocale: "en",
  urlMappingStrategy: "redirect" // Redirige a /it, /en o /es in base alla lingua del browser/preferenze
});

export function proxy(request: NextRequest) {
  // Ignora le chiamate API e le risorse statiche
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
