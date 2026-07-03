import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider, getToken, AppCheck } from "firebase/app-check";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@/lib/dataconnect-client";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAVJIh68g3ESxvd_0s2OhxixResOLq9wf4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kalex-cloud.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kalex-cloud",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kalex-cloud.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "827954142996",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:827954142996:web:21a4f51d94f10a1bbd2c01",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GBKY6Z6FQS"
};

// Inizializza l'app Firebase (evitando doppie inizializzazioni)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inizializza Firebase Auth
const auth = getAuth(app);

if (typeof window !== "undefined") {
  const isLocalDev =
    process.env.NODE_ENV !== "production" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (isLocalDev) {
    auth.settings.appVerificationDisabledForTesting = true;
  }
}

// Inizializza SQL Connect (Client SDK)
const dataConnect = getDataConnect(connectorConfig);

// Inizializza App Check (solo lato client e pigramente)
let appCheckInstance: AppCheck | null = null;

export function initAppCheck(): AppCheck | null {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  try {
    const existingAppCheck = (app as unknown as { appCheck?: AppCheck }).appCheck;
    if (existingAppCheck) {
      appCheckInstance = existingAppCheck;
    } else {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      // Debug provider consentito SOLO in sviluppo locale (mai in produzione), e senza token
      // hardcoded: richiede NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN. In produzione si usa SEMPRE
      // reCAPTCHA Enterprise reale: se manca la site key, NON si ripiega sul debug (fail-loud).
      const isLocalDev = process.env.NODE_ENV !== "production" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const debugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
      if (isLocalDev && debugToken) {
        (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;

        appCheckInstance = initializeAppCheck(app, {
          provider: new CustomProvider({
            getToken: () => Promise.resolve({
              token: debugToken,
              expireTimeMillis: Date.now() + 3600000
            })
          }),
          isTokenAutoRefreshEnabled: true
        });
      } else if (siteKey) {
        // Produzione/staging: reCAPTCHA Enterprise reale
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } else {
        console.error("[SSO Client] NEXT_PUBLIC_RECAPTCHA_SITE_KEY mancante: App Check reale non inizializzato (nessun fallback debug in produzione).");
      }
      if (appCheckInstance) {
        (app as unknown as { appCheck: AppCheck }).appCheck = appCheckInstance;
      }
    }
  } catch (e) {
    console.warn("[SSO Client] Impossibile inizializzare App Check:", e);
  }

  return appCheckInstance;
}

export async function getAppCheckToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const appCheck = initAppCheck();
    if (!appCheck) return null;
    const result = await getToken(appCheck, false);
    return result.token;
  } catch (err) {
    console.warn("[AppCheck] Failed to get token:", err);
    return null;
  }
}

/**
 * Token CSRF double-submit: sulle richieste che mutano stato, rispedisce il valore del cookie
 * non-HttpOnly `kalex_csrf` nell'header `X-CSRF-Token`. Il server lo esige solo quando la richiesta
 * è autenticata via cookie di sessione su endpoint dati (vedi middleware verifyCsrf lato api).
 */
function attachCsrfHeader(headers: Headers, method?: string): void {
  const m = (method || "GET").toUpperCase();
  if (m === "GET" || m === "HEAD") return;
  if (typeof document === "undefined" || headers.has("X-CSRF-Token")) return;
  const match = document.cookie.match(/(?:^|;\s*)kalex_csrf=([^;]+)/);
  if (match) {
    headers.set("X-CSRF-Token", decodeURIComponent(match[1]));
  }
}

export async function fetchWithAppCheck(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = await getAppCheckToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("X-Firebase-AppCheck", token);
  }
  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN) {
    headers.set("X-Firebase-AppCheck-Debug", process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN);
  }
  attachCsrfHeader(headers, init?.method);
  return fetch(input, {
    ...init,
    headers
  });
}

export async function fetchAuthed(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = await getAppCheckToken();
  const currentUser = auth.currentUser;
  const idToken = currentUser ? await currentUser.getIdToken() : null;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("X-Firebase-AppCheck", token);
  }
  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN) {
    headers.set("X-Firebase-AppCheck-Debug", process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN);
  }
  if (idToken) {
    headers.set("Authorization", `Bearer ${idToken}`);
  }
  attachCsrfHeader(headers, init?.method);
  if (!headers.has("x-app-id")) {
    headers.set("x-app-id", "sso");
  }
  if (!headers.has("Content-Type") && init?.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    headers
  });
}

export { app, auth, dataConnect };


