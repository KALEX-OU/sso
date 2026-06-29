import { getToken } from "firebase/app-check";
import { setCorrelationId } from "./logger";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "web";

// Struttura standard delle risposte d'errore di KALEX
export interface KalexError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface KalexResponse<T> {
  success: boolean;
  data?: T;
  error?: KalexError;
}

/**
 * Recupera in modo sicuro il token App Check se l'SDK è inizializzato ed è lato client.
 */
async function getClientAppCheckToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    // Inizializza o recupera in modo sicuro l'istanza App Check tramite la funzione centralizzata.
    const { initAppCheck } = await import("./auth");
    const appCheck = initAppCheck();
    if (!appCheck) return null;
    
    const tokenResult = await getToken(appCheck, false);
    return tokenResult.token;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Errore sconosciuto App Check";
    console.warn("[KALEX API Client] Impossibile recuperare il token App Check:", errMsg);
    return null;
  }
}

/**
 * 1. LATO CLIENT (Browser)
 * fetchAuthedClient: effettua chiamate dal browser verso il proxy locale di Next.js.
 * Inserisce automaticamente l'Authorization header (ID Token JWT di Firebase) e i token App Check.
 */
export async function fetchAuthedClient<T>(
  pathname: string,
  init?: RequestInit
): Promise<KalexResponse<T>> {
  if (typeof window === "undefined") {
    throw new Error("fetchAuthedClient può essere invocato esclusivamente lato client.");
  }

  const headers = new Headers(init?.headers);

  // 1. Genera un Correlation ID univoco (UUIDv4) per la tracciabilità distribuita nei log
  const correlationId = typeof crypto !== "undefined" && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
  headers.set("x-correlation-id", correlationId);
  setCorrelationId(correlationId);

  // 2. Inietta automaticamente l'Idempotency-Key per richieste di scrittura (POST, PUT, DELETE) se non presente
  const method = init?.method?.toUpperCase() || "GET";
  if (["POST", "PUT", "DELETE"].includes(method) && !headers.has("Idempotency-Key")) {
    const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    headers.set("Idempotency-Key", idempotencyKey);
  }

  // 3. Inserisce il token di autenticazione Firebase se l'utente è loggato
  const { auth } = await import("./auth");
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const idToken = await currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${idToken}`);
    } catch (err) {
      console.warn("[KALEX API Client] Impossibile ottenere l'ID Token Firebase:", err);
    }
  }

  // 4. Inserisce il token App Check
  const appCheckToken = await getClientAppCheckToken();
  if (appCheckToken) {
    headers.set("X-Firebase-AppCheck", appCheckToken);
  }
  
  const debugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
  if (debugToken) {
    headers.set("X-Firebase-AppCheck-Debug", debugToken);
  }

  // 5. Inserisce l'App ID proprietario
  headers.set("x-app-id", APP_ID);

  if (!headers.has("Content-Type") && init?.method !== "GET" && init?.method !== "HEAD") {
    headers.set("Content-Type", "application/json");
  }

  const targetUrl = pathname.startsWith("/") ? pathname : `/${pathname}`;

  try {
    let response = await fetch(targetUrl, {
      ...init,
      headers
    });

    // 6. Se lo stato è 401 o 403 e l'utente è loggato, forza il refresh dei Custom Claims e riprova una singola volta
    if ((response.status === 401 || response.status === 403) && currentUser) {
      console.warn(`[KALEX API Client] Ricevuto status ${response.status}. Tentativo di refresh del token e retry...`);
      try {
        const newIdToken = await currentUser.getIdToken(true);
        headers.set("Authorization", `Bearer ${newIdToken}`);
        
        // Manteniamo intatta l'Idempotency-Key per permettere al server di dedurre la ripetizione dell'azione
        response = await fetch(targetUrl, {
          ...init,
          headers
        });
      } catch (refreshErr) {
        console.error("[KALEX API Client] Fallito il refresh del token durante il retry:", refreshErr);
      }
    }

    // 7. Se lo stato finale è 401 Unauthorized, non è la chiamata di logout/client-token, e non siamo già nella pagina di auth, esegue l'auto-clean session
    const isAuthPage = typeof window !== "undefined" && window.location.pathname.includes("/auth");
    if (
      response.status === 401 && 
      !pathname.includes("/api/auth/logout") && 
      !pathname.includes("/api/auth/client-token") &&
      !isAuthPage
    ) {
      console.warn(`[KALEX API Client] Ricevuto status 401 non risolvibile su ${pathname}. Avvio Auto-Clean Session...`);
      try {
        const { forceCleanSession } = await import("./auth");
        void forceCleanSession(APP_ID);
      } catch (cleanErr) {
        console.error("[KALEX API Client] Errore durante l'auto-clean della sessione:", cleanErr);
      }
    }

    const text = await response.text();
    let json: Record<string, unknown> & { error?: KalexError; message?: string } = {};
    try {
      json = JSON.parse(text) as Record<string, unknown> & { error?: KalexError; message?: string };
    } catch {
      return {
        success: false,
        error: { 
          message: `Risposta non valida dal server (Status: ${response.status})`, 
          details: { text, correlationId } 
        }
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: json.error || { 
          message: json.message || "Errore sconosciuto nella chiamata API.",
          details: { correlationId }
        }
      };
    }

    return {
      success: json.success !== false,
      data: json as unknown as T,
      error: json.error as KalexError | undefined
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore di rete durante la connessione.";
    return {
      success: false,
      error: { 
        message, 
        code: "api/network-error",
        details: { correlationId } 
      }
    };
  }
}


