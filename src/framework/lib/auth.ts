"use client";

import { useEffect, useState, useCallback } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User, Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider } from "firebase/app-check";
import type { AppCheck } from "firebase/app-check";

import type { CustomClaims } from "./types.js";
import { decodeClaims } from "./claims-codec";

// Configurazione pubblica predefinita per Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAVJIh68g3ESxvd_0s2OhxixResOLq9wf4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kalex-cloud.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kalex-cloud",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kalex-cloud.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "827954142996",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:827954142996:web:21a4f51d94f10a1bbd2c01",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GBKY6Z6FQS"
};

// Inizializza l'istanza client-side Firebase (solo in ambiente browser/client)
let app: FirebaseApp;
let authInstance: Auth;
let storageInstance: FirebaseStorage;
let appCheckInstance: AppCheck | null = null;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);
  // Disabilita la verifica reCAPTCHA per login/enrollment MFA SOLO in sviluppo locale.
  // (T1.11) Rimosso l'escape via NEXT_PUBLIC_BYPASS_MFA_RECAPTCHA, che avrebbe potuto
  // disattivare il 2FA anche in produzione.
  const isLocalDev =
    process.env.NODE_ENV !== "production" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (isLocalDev) {
    authInstance.settings.appVerificationDisabledForTesting = true;
  }
  storageInstance = getStorage(app);
}

export const auth = typeof window !== "undefined" ? authInstance! : {} as Auth;
export const storage = typeof window !== "undefined" ? storageInstance! : {} as FirebaseStorage;

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "web";

/**
 * Forza la pulizia completa della sessione a livello client e server.
 * Rimuove i cookie, disconnette Firebase Auth, pulisce sessionStorage, notifica altre schede e reindirizza.
 */
export async function forceCleanSession(appId: string = APP_ID): Promise<void> {
  if (typeof window === "undefined") return;

  console.warn(`[forceCleanSession] Avvio pulizia forzata della sessione per appId: ${appId}`);

  // 1. Tenta di invalidare la sessione sul backend tramite POST /api/auth/logout
  try {
    const { fetchAuthedClient } = await import("./api");
    const response = await fetchAuthedClient("/api/auth/logout", {
      method: "POST"
    });
    if (!response.success) {
      console.warn("[forceCleanSession] Il server ha risposto con errore al logout:", response.error?.message);
    }
  } catch (err) {
    console.warn("[forceCleanSession] Impossibile contattare il server per il logout:", err);
  }

  // 2. Notifica le altre schede aperte tramite localStorage (per schede sullo stesso dominio)
  try {
    if (window.localStorage) {
      window.localStorage.setItem("kalex_logout_event", Date.now().toString());
    }
  } catch {
    // Silente
  }

  // 3. Notifica le altre schede aperte tramite BroadcastChannel (per app SPA multischeda)
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("kalex_auth_sync");
      channel.postMessage("logout");
      channel.close();
    }
  } catch {
    // Silente
  }

  // 4. Esegue il signOut locale da Firebase Auth
  try {
    if (authInstance) {
      await signOut(authInstance);
    }
  } catch (err) {
    console.error("[forceCleanSession] Errore durante il signOut di Firebase:", err);
  }

  // 5. Pulisce sessionStorage (stato CSRF dell'SSO e verifier PKCE)
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("sso_auth_state");
      sessionStorage.removeItem("sso_pkce_verifier");
    }
  } catch {
    // Silente
  }

  // 6. Elimina i cookie di sessione sia locali che sul dominio centralizzato .kalex.cloud
  try {
    if (typeof document !== "undefined") {
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.kalex.cloud";
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "kalex_csrf=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.kalex.cloud";
      document.cookie = "kalex_csrf=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } catch {
    // Silente
  }

  // 7. Esegue il reindirizzamento o ricaricamento finale della pagina
  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
  let currentUrlStr = window.location.href;
  if (currentUrlStr) {
    try {
      const url = new URL(currentUrlStr);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      currentUrlStr = url.toString();
    } catch {
      // Silente
    }
  }

  if (appId === "sso") {
    window.location.href = "/auth";
  } else {
    window.location.href = `${ssoUrl}/auth?client_id=${appId}&redirect_uri=${encodeURIComponent(currentUrlStr)}`;
  }
}

// --- Incapsulamento degli accessi a proprietà interne (App Check) ---
// Firebase non espone né una cache dell'istanza App Check sull'app né un setter tipizzato per il
// debug token globale del browser. Qui concentriamo e documentiamo gli UNICI cast necessari, così
// il resto del modulo (e initAppCheck) resta type-safe e leggibile.
interface AppCheckCache {
  appCheck?: AppCheck;
}
interface AppCheckDebugGlobal {
  FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
}

function getCachedAppCheck(firebaseApp: FirebaseApp): AppCheck | undefined {
  return (firebaseApp as unknown as AppCheckCache).appCheck;
}
function setCachedAppCheck(firebaseApp: FirebaseApp, instance: AppCheck): void {
  (firebaseApp as unknown as AppCheckCache).appCheck = instance;
}
function setAppCheckDebugToken(token: boolean | string): void {
  (window as unknown as AppCheckDebugGlobal).FIREBASE_APPCHECK_DEBUG_TOKEN = token;
}

/**
 * Inizializza App Check in modo sicuro e pigro per evitare errori di caricamento precoce di reCAPTCHA.
 */
export function initAppCheck(): AppCheck | null {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    const existingAppCheck = getCachedAppCheck(app);
    if (existingAppCheck) {
      appCheckInstance = existingAppCheck;
    } else {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      // Debug provider consentito SOLO in sviluppo locale (mai in produzione) e senza token
      // hardcoded: richiede NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN. In produzione si usa SEMPRE
      // reCAPTCHA Enterprise reale: se manca la site key NON si ripiega sul debug (fail-loud).
      const isLocalDev = process.env.NODE_ENV !== "production" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const debugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
      if (isLocalDev && debugToken) {
        // Impostiamo il debug token a livello globale prima dell'inizializzazione (evita di
        // caricare l'SDK reCAPTCHA in locale, rimuovendo crash ed errori sui placeholder DOM).
        setAppCheckDebugToken(debugToken);

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
          isTokenAutoRefreshEnabled: true
        });
      } else {
        console.error("[Framework Auth] NEXT_PUBLIC_RECAPTCHA_SITE_KEY mancante: App Check reale non inizializzato (nessun fallback debug in produzione).");
      }
      if (appCheckInstance) {
        setCachedAppCheck(app, appCheckInstance);
      }
    }
  } catch (e) {
    console.warn("[Framework Auth] Impossibile inizializzare App Check:", e);
  }

  return appCheckInstance;
}

// Hook principale per monitorare lo stato di autenticazione e caricare i claims di KALEX
// PKCE (piano Identity Center 3.1, RFC 7636): la Relying Party genera un code_verifier
// casuale (base64url, 43 caratteri) e ne deriva il challenge S256. Il verifier resta in
// sessionStorage della RP e viene presentato solo allo scambio /auth/token: un code
// intercettato sul redirect non è spendibile senza il verifier.
function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function redirectToSso(clientId: string, register: boolean): Promise<void> {
  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
  let currentUrlStr = typeof window !== "undefined" ? window.location.href : "";

  // State univoco anti-CSRF, conservato nella RP e confrontato al ritorno
  const state = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15);

  // Coppia PKCE: se Web Crypto non è disponibile si procede senza (il server accetta
  // ancora i code legacy senza challenge — retrocompatibilità durante il rollout)
  let challenge = "";
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      const verifier = base64UrlEncode(bytes);
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
      challenge = base64UrlEncode(new Uint8Array(digest));
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("sso_pkce_verifier", verifier);
      }
    }
  } catch (e) {
    console.warn("[SSO Redirect] PKCE non disponibile, procedo senza challenge:", e);
    challenge = "";
  }

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("sso_auth_state", state);
  }

  if (currentUrlStr) {
    try {
      const url = new URL(currentUrlStr);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      currentUrlStr = url.toString();
    } catch (e) {
      console.error("Errore parsing URL in redirectToSso", e);
    }
  }

  const registerParam = register ? "register=true&" : "";
  const pkceParams = challenge ? `&code_challenge=${challenge}&code_challenge_method=S256` : "";
  window.location.href = `${ssoUrl}/auth?${registerParam}client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrlStr)}&state=${state}${pkceParams}`;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(typeof window !== "undefined" && !!authInstance);
  const [claims, setClaims] = useState<CustomClaims | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !authInstance) {
      return;
    }

    // Pre-warm non bloccante di App Check dopo 1.5 secondi per ottimizzare l'INP/LCP
    const timer = setTimeout(() => {
      initAppCheck();
    }, 1500);

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Forza il refresh del token per ottenere i Custom Claims aggiornati
          const tokenResult = await currentUser.getIdTokenResult(true);
          // Confine di lettura tollerante v1↔v2: un token v2 (chiavi compatte) viene riespanso
          // nella forma lunga attesa dai componenti; un token v1 passa invariato.
          const customClaims = decodeClaims(tokenResult.claims) as CustomClaims;
          setClaims(customClaims);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Errore sconosciuto caricamento claims";
          console.error("[useKalexAuth] Errore caricamento claims:", errMsg);
          setClaims(null);
        }
      } else {
        setClaims(null);
      }
      setLoading(false);
    });

    // Listener per la sincronizzazione del logout multi-scheda (Multi-Tab Session Sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kalex_logout_event" && authInstance) {
        console.log("[Multi-Tab Sync] Rilevato logout da un'altra scheda. Disconnessione locale...");
        signOut(authInstance).then(() => {
          window.location.reload();
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = useCallback(async () => {
    await forceCleanSession(APP_ID);
  }, []);

  const loginRedirect = useCallback((clientId: string) => {
    void redirectToSso(clientId, false);
  }, []);

  const registerRedirect = useCallback((clientId: string) => {
    void redirectToSso(clientId, true);
  }, []);

  const hasPermission = useCallback((moduleId: string, actionOrLevel: "read" | "create" | "update" | "delete" | "list" | number): boolean => {
    const userRole = claims?.uRole || claims?.role;
    if (userRole === "owner") return true; // L'owner scavalca FLS/RBAC
    const appConfig = claims?.rbac?.apps?.[APP_ID];
    if (!appConfig) return false;

    const mask = appConfig[moduleId];
    if (typeof mask !== "number") return false;

    let requiredMask = 0;
    if (typeof actionOrLevel === "number") {
      if (actionOrLevel === 1) requiredMask = 1; // Read
      else if (actionOrLevel === 2) requiredMask = 2; // Create
      else if (actionOrLevel === 3) requiredMask = 4; // Update
      else if (actionOrLevel === 4) requiredMask = 8; // Delete
      else requiredMask = actionOrLevel;
    } else {
      if (actionOrLevel === "read") requiredMask = 1;
      else if (actionOrLevel === "create") requiredMask = 2;
      else if (actionOrLevel === "update") requiredMask = 4;
      else if (actionOrLevel === "delete") requiredMask = 8;
      else if (actionOrLevel === "list") requiredMask = 16;
    }

    return (mask & requiredMask) === requiredMask;
  }, [claims]);

  return {
    user,
    loading,
    claims,
    orgId: claims?.orgId,
    role: claims?.uRole,
    confirmed: claims?.confirmed,
    locale: claims?.loc,
    theme: claims?.thm,
    logout,
    loginRedirect,
    registerRedirect,
    hasPermission
  };
}

// Hook reattivo leggero specifico per accedere ai Custom Claims
export function useClaims() {
  const { claims, loading, user, hasPermission } = useAuth();
  return {
    claims,
    loading,
    isAuthenticated: !!user,
    orgId: claims?.orgId,
    role: claims?.uRole || claims?.role,
    confirmed: claims?.confirmed,
    hasPermission
  };
}
