"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User, Auth } from "firebase/auth";

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import type { AppCheck } from "firebase/app-check";

// Interfaccia forte per i Custom Claims di KALEX
export interface CustomClaims {
  orgId?: string;
  role?: string;
  confirmed?: boolean;
  loc?: string;
  thm?: string;
  seats?: string[];
  perms?: Record<string, number>;
}

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
let app;
let authInstance: Auth;
let appCheckInstance: AppCheck | null = null;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);

  if (process.env.NODE_ENV === "development") {
    // Configura il token di debug di App Check fornito per lo sviluppo locale
    ((window as unknown) as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN = "D8C27232-65AF-4C05-8528-595936C2DA78";
  }

  const existingAppCheck = (app as unknown as { appCheck?: AppCheck }).appCheck;
  if (existingAppCheck) {
    appCheckInstance = existingAppCheck;
  } else {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider("6LerwBwtAAAAAOPo8crSA1U9lRXbvBPCYU9XKFNn"),
        isTokenAutoRefreshEnabled: true
      });
      (app as unknown as { appCheck: AppCheck }).appCheck = appCheckInstance;
    } catch (e) {
      console.warn("[Framework Auth] App Check già inizializzato:", e);
    }
  }
}

export const auth = typeof window !== "undefined" ? authInstance! : {} as Auth;

// Hook principale per monitorare lo stato di autenticazione e caricare i claims di KALEX
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(typeof window !== "undefined" && !!authInstance);
  const [claims, setClaims] = useState<CustomClaims | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !authInstance) {
      return;
    }

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

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!authInstance) return;
    await signOut(authInstance);
    // Cancella il cookie di sessione globale al logout
    if (typeof document !== "undefined") {
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.kalex.cloud";
      document.cookie = "kalex_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const loginRedirect = (clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    let currentUrlStr = typeof window !== "undefined" ? window.location.href : "";
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
    window.location.href = `${ssoUrl}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrlStr)}`;
  };

  const registerRedirect = (clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    let currentUrlStr = typeof window !== "undefined" ? window.location.href : "";
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
    window.location.href = `${ssoUrl}/auth?register=true&client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrlStr)}`;
  };

  const hasPermission = (resource: string, requiredLevel: number): boolean => {
    if (claims?.role === "owner") return true; // L'owner scavalca FLS/RBAC
    const userPerm = claims?.perms?.[resource];
    return userPerm !== undefined && userPerm >= requiredLevel;
  };

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
