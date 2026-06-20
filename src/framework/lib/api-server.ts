// Determina l'URL di base dell'API centralizzata
const API_BASE_URL = process.env.KALEX_API_URL || "http://localhost:3001";
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "web";

/**
 * LATO SERVER (Next.js Proxy / Route Handlers)
 * forwardProxyRequest: riceve la richiesta in ingresso nel proxy di Next.js
 * e la inoltra in modo sicuro ed efficiente all'API Gateway centralizzato.
 */
export async function forwardProxyRequest(
  request: Request,
  moduleName: string,
  subPath: string[]
): Promise<Response> {
  const pathString = subPath.join("/");
  const targetUrl = new URL(`/${moduleName}/${pathString}`, API_BASE_URL);

  // Copia i parametri di ricerca (query params)
  const reqUrl = new URL(request.url);
  reqUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // Copia e imposta gli intestazioni di sicurezza
  const headers = new Headers();

  // Inoltra l'applicazione proprietaria
  const appIdHeader = request.headers.get("x-app-id") || APP_ID;
  headers.set("x-app-id", appIdHeader);

  // Inoltra l'Authorization (Token Firebase JWT)
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  // Inoltra App Check
  const appCheckHeader = request.headers.get("x-firebase-appcheck");
  if (appCheckHeader) {
    headers.set("x-firebase-appcheck", appCheckHeader);
  }
  const appCheckDebugHeader = request.headers.get("x-firebase-appcheck-debug");
  if (appCheckDebugHeader) {
    headers.set("x-firebase-appcheck-debug", appCheckDebugHeader);
  }

  // Inoltra l'IP reale del client per log, compliance e Geo-IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : realIp || "127.0.0.1";
  headers.set("x-forwarded-for", ip);

  headers.set("content-type", request.headers.get("content-type") || "application/json");

  // Inoltra l'User-Agent per tracciamento
  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  let body: string | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      // Ignora body vuoti o malformati
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

    const responseHeaders = new Headers();
    responseHeaders.set("content-type", response.headers.get("content-type") || "application/json");

    // Inoltra gli intestazioni CORS dall'API centralizzata
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

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error(`[KALEX API Proxy Server] Errore proxying verso ${targetUrl}:`, message);
    return new Response(
      JSON.stringify({ success: false, error: { message: "Impossibile connettersi al server API centralizzato." } }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}
