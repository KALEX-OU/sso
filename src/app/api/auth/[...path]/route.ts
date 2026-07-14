import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/framework/lib/urls";

const API_BASE_URL = getApiBaseUrl();

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  sameSite?: "lax" | "strict" | "none";
}

function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(";").map(p => p.trim());
  if (parts.length === 0 || !parts[0].includes("=")) return null;
  
  const [name, ...valParts] = parts[0].split("=");
  const value = valParts.join("=");
  
  const options: CookieOptions = {};
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    
    if (part.toLowerCase() === "httponly") {
      options.httpOnly = true;
    } else if (part.toLowerCase() === "secure") {
      options.secure = true;
    } else if (part.includes("=")) {
      const [key, ...valParts] = part.split("=");
      const val = valParts.join("=");
      const lowKey = key.trim().toLowerCase();
      
      if (lowKey === "domain") {
        options.domain = val.trim();
      } else if (lowKey === "path") {
        options.path = val.trim();
      } else if (lowKey === "max-age") {
        options.maxAge = parseInt(val.trim(), 10);
      } else if (lowKey === "expires") {
        options.expires = new Date(val.trim());
      } else if (lowKey === "samesite") {
        const sSame = val.trim().toLowerCase();
        options.sameSite = sSame === "lax" ? "lax" : sSame === "strict" ? "strict" : sSame === "none" ? "none" : undefined;
      }
    }
  }
  return { name: name.trim(), value, options };
}

async function handleProxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  const pathString = resolvedParams.path.join("/");
  
  // Costruisce l'URL di destinazione sul gateway API versionato (es. http://localhost:3001/v1/auth/...)
  const targetUrl = new URL(`/v1/auth/${pathString}`, API_BASE_URL);
  
  // Copia i query parameters dalla richiesta originale
  const { searchParams } = new URL(request.url);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // Copia gli headers importanti
  const headers = new Headers();

  // Inoltra l'applicazione proprietaria
  const appIdHeader = request.headers.get("x-app-id") || "sso";
  headers.set("x-app-id", appIdHeader);
  
  // Inoltra il token di autenticazione se presente
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  // Inoltra il Cookie originale (es. per sessioni HttpOnly)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }
  
  // Inoltra i token di App Check regolare e debug se presenti
  const appCheckHeader = request.headers.get("x-firebase-appcheck");
  if (appCheckHeader) {
    headers.set("x-firebase-appcheck", appCheckHeader);
  }
  const appCheckDebugHeader = request.headers.get("x-firebase-appcheck-debug");
  if (appCheckDebugHeader) {
    headers.set("x-firebase-appcheck-debug", appCheckDebugHeader);
  }

  // Inoltra il token CSRF (double-submit cookie): senza questo header le mutation
  // cookie-auth protette dal middleware CSRF dell'api (logout, gestione sessioni)
  // fallirebbero con 403 auth/csrf-invalid pur avendo il cookie corretto.
  const csrfHeader = request.headers.get("x-csrf-token");
  if (csrfHeader) {
    headers.set("x-csrf-token", csrfHeader);
  }
  
  // Inoltra i dati dell'IP originale per il Geo-IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : realIp || "127.0.0.1";
  headers.set("x-forwarded-for", ip);
  
  headers.set("content-type", request.headers.get("content-type") || "application/json");

  // Inoltra l'User-Agent
  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  // Prepara l'opzione del body
  let body: string | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      // Ignora body malformati o assenti
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
      cache: "no-store"
    });

    const responseBody = await response.text();
    
    // Restituisce la risposta con gli stessi headers importanti (come content-type)
    const responseHeaders = new Headers();
    responseHeaders.set("content-type", response.headers.get("content-type") || "application/json");

    // Inoltra gli headers CORS dell'API centralizzata
    const corsHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
      "access-control-allow-credentials",
      "access-control-max-age"
    ];
    corsHeaders.forEach(header => {
      const val = response.headers.get(header);
      if (val) {
        responseHeaders.set(header, val);
      }
    });

    let status = response.status;
    let finalBody = responseBody;

    // Se stiamo richiedendo client-token e l'utente non è autenticato (401),
    // convertiamo in 200 OK con success: false per evitare errori 401 rossi in console
    if (pathString === "client-token" && status === 401) {
      status = 200;
      finalBody = JSON.stringify({ 
        success: false, 
        error: { 
          code: "auth/unauthorized", 
          message: "Utente non autenticato." 
        } 
      });
    }

    const nextResponse = new NextResponse(finalBody, {
      status,
      headers: responseHeaders
    });

    // Inoltra l'header Set-Cookie da Hono al client (browser) in modo sicuro tramite cookies.set
    const setCookieHeaders = response.headers.getSetCookie 
      ? response.headers.getSetCookie() 
      : response.headers.get("set-cookie");
      
    if (setCookieHeaders) {
      const cookiesArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
      cookiesArray.forEach(cookieStr => {
        const parsed = parseSetCookie(cookieStr);
        if (parsed) {
          nextResponse.cookies.set(parsed.name, parsed.value, parsed.options);
        }
      });
    }

    return nextResponse;
  } catch (err) {
    console.error(`[SSO API Proxy] Error proxying to ${targetUrl}:`, err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: { message: "Errore di connessione con il server API centralizzato." } },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
