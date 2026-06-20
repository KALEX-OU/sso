import { getApp } from "firebase/app";
import { getToken, AppCheck } from "firebase/app-check";

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
    const firebaseApp = getApp();
    if (!firebaseApp) return null;
    
    // Inizializza o recupera l'istanza App Check.
    // In produzione usiamo ReCaptcha Enterprise, in locale il token di debug.
    // L'istanza è tipicamente inizializzata in auth.ts o client.ts
    // Se non è inizializzata, evitiamo di far fallire la chiamata.
    const appCheck = (firebaseApp as unknown as { appCheck?: unknown }).appCheck;
    if (!appCheck) return null;
    
    const tokenResult = await getToken(appCheck as AppCheck, false);
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

  // 2. Inserisce il token di autenticazione Firebase se l'utente è loggato
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

  // 3. Inserisce il token App Check
  const appCheckToken = await getClientAppCheckToken();
  if (appCheckToken) {
    headers.set("X-Firebase-AppCheck", appCheckToken);
  }
  
  if (process.env.NODE_ENV === "development") {
    headers.set("X-Firebase-AppCheck-Debug", "D8C27232-65AF-4C05-8528-595936C2DA78");
  }

  // 4. Inserisce l'App ID proprietario
  headers.set("x-app-id", APP_ID);

  if (!headers.has("Content-Type") && init?.method !== "GET" && init?.method !== "HEAD") {
    headers.set("Content-Type", "application/json");
  }

  const targetUrl = pathname.startsWith("/") ? pathname : `/${pathname}`;

  try {
    const response = await fetch(targetUrl, {
      ...init,
      headers
    });

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


