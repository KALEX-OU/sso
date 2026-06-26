"use client";

import { useEffect, useState, useCallback } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User, Auth } from "firebase/auth";

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import type { AppCheck } from "firebase/app-check";

import type { CustomClaims } from "./types.js";

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
let appCheckInstance: AppCheck | null = null;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);
}

export const auth = typeof window !== "undefined" ? authInstance! : {} as Auth;

/**
 * Inizializza App Check in modo sicuro e pigro per evitare errori di caricamento precoce di reCAPTCHA.
 */
export function initAppCheck(): AppCheck | null {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
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
          isTokenAutoRefreshEnabled: true
        });
      }
      (app as unknown as { appCheck: AppCheck }).appCheck = appCheckInstance;
    }
  } catch (e) {
    console.warn("[Framework Auth] Impossibile inizializzare App Check:", e);
  }

  return appCheckInstance;
}

// Hook principale per monitorare lo stato di autenticazione e caricare i claims di KALEX
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
          const customClaims = tokenResult.claims as CustomClaims;
          setClaims({
            orgId: customClaims.orgId,
            role: customClaims.role,
            confirmed: customClaims.confirmed,
            loc: customClaims.loc,
            thm: customClaims.thm,
            seats: customClaims.seats || [],
            perms: customClaims.perms || {}
          });
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
    if (!authInstance) return;

    // 1. Invia la richiesta di logout autenticata al backend per eliminare il cookie HttpOnly ed invalidare la sessione
    try {
      const { fetchAuthedClient } = await import("./api");
      const response = await fetchAuthedClient("/api/auth/logout", {
        method: "POST"
      });
      if (!response.success) {
        console.warn("[Framework Auth] Errore risposta logout server:", response.error?.message);
      }
    } catch (err) {
      console.warn("[Framework Auth] Impossibile contattare il server per il logout:", err);
    }

    // 2. Notifica le altre schede aperte per innescare il logout simultaneo
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("kalex_logout_event", Date.now().toString());
    }

    // 3. Effettua il signOut lato client
    await signOut(authInstance);

    // 4. Pulisce anche i cookie non HttpOnly locali per sicurezza
    if (typeof document !== "undefined") {
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.kalex.cloud";
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  const loginRedirect = useCallback((clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    let currentUrlStr = typeof window !== "undefined" ? window.location.href : "";
    
    // Genera uno state univoco per prevenire attacchi CSRF
    const state = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
    
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
        console.error("Errore parsing URL in loginRedirect", e);
      }
    }
    window.location.href = `${ssoUrl}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrlStr)}&state=${state}`;
  }, []);

  const registerRedirect = useCallback((clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    let currentUrlStr = typeof window !== "undefined" ? window.location.href : "";
    
    // Genera uno state univoco per prevenire attacchi CSRF
    const state = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
    
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
        console.error("Errore parsing URL in registerRedirect", e);
      }
    }
    window.location.href = `${ssoUrl}/auth?register=true&client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrlStr)}&state=${state}`;
  }, []);

  const hasPermission = useCallback((resource: string, requiredLevel: number): boolean => {
    if (claims?.role === "owner") return true; // L'owner scavalca FLS/RBAC
    const userPerm = claims?.perms?.[resource];
    return userPerm !== undefined && userPerm >= requiredLevel;
  }, [claims]);

  return {
    user,
    loading,
    claims,
    orgId: claims?.orgId,
    role: claims?.role,
    confirmed: claims?.confirmed,
    locale: claims?.loc,
    theme: claims?.thm,
    seats: claims?.seats || [],
    perms: claims?.perms || {},
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
    role: claims?.role,
    confirmed: claims?.confirmed,
    perms: claims?.perms || {},
    seats: claims?.seats || [],
    hasPermission
  };
}
