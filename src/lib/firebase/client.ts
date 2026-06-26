import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken, AppCheck } from "firebase/app-check";
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
      // In ambiente locale (sviluppo o localhost), usiamo un CustomProvider fittizio
      // che ritorna il debug token. Questo evita del tutto di caricare l'SDK di reCAPTCHA
      // in locale, rimuovendo alla radice crash ed errori sui placeholder DOM.
      if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // Impostiamo il debug token a livello globale prima dell'inizializzazione.
        // Questo istruisce l'SDK Firebase App Check a scambiare il debug token locale
        // con un vero token App Check (JWT) valido lato server senza caricare reCAPTCHA.
        (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN = "D8C27232-65AF-4C05-8528-595936C2DA78";
        
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider("6LerwBwtAAAAAOPo8crSA1U9lRXbvBPCYU9XKFNn"),
          isTokenAutoRefreshEnabled: true
        });
      } else {
        // In produzione usiamo ReCaptcha Enterprise
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider("6LerwBwtAAAAAOPo8crSA1U9lRXbvBPCYU9XKFNn"),
          isTokenAutoRefreshEnabled: true,
        });
      }
      (app as unknown as { appCheck: AppCheck }).appCheck = appCheckInstance;
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

export async function fetchWithAppCheck(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = await getAppCheckToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("X-Firebase-AppCheck", token);
  }
  if (process.env.NODE_ENV === "development") {
    headers.set("X-Firebase-AppCheck-Debug", "D8C27232-65AF-4C05-8528-595936C2DA78");
  }
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
  if (process.env.NODE_ENV === "development") {
    headers.set("X-Firebase-AppCheck-Debug", "D8C27232-65AF-4C05-8528-595936C2DA78");
  }
  if (idToken) {
    headers.set("Authorization", `Bearer ${idToken}`);
  }
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


