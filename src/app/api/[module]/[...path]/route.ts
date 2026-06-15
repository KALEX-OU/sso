import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

async function handleProxy(request: NextRequest, context: { params: Promise<{ module: string; path: string[] }> }) {
  const resolvedParams = await context.params;
  const { module, path } = resolvedParams;
  const pathString = path.join("/");
  
  // Costruisce l'URL di destinazione sul server API Hono (es. http://localhost:3001/service/...)
  const targetUrl = new URL(`/${module}/${pathString}`, API_BASE_URL);
  
  // Copia i query parameters dalla richiesta originale
  const { searchParams } = new URL(request.url);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // Copia gli headers importanti
  const headers = new Headers();
  
  // Inoltra il token di autenticazione se presente
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }
  
  // Inoltra i token di App Check regolare e debug se presenti
  const appCheckHeader = request.headers.get("x-firebase-app-check") || request.headers.get("x-firebase-appcheck");
  if (appCheckHeader) {
    headers.set("x-firebase-app-check", appCheckHeader);
  }
  const appCheckDebugHeader = request.headers.get("x-firebase-app-check-debug") || request.headers.get("x-firebase-appcheck-debug");
  if (appCheckDebugHeader) {
    headers.set("x-firebase-app-check-debug", appCheckDebugHeader);
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

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (err) {
    console.error(`[SSO API Proxy Catch-All] Error proxying to ${targetUrl}:`, err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: { message: `Errore di connessione con il server API centralizzato per il modulo ${module}.` } },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ module: string; path: string[] }> }) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ module: string; path: string[] }> }) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ module: string; path: string[] }> }) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ module: string; path: string[] }> }) {
  return handleProxy(request, context);
}
