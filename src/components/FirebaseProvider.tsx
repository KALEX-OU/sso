"use client";

import React, { useEffect, useState } from "react";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { onAuthStateChanged, User, setPersistence, inMemoryPersistence, signInWithCustomToken } from "firebase/auth";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inizializza la persistenza in memory ed esegue il sync all'avvio se è presente il cookie
  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        await setPersistence(auth, inMemoryPersistence);
        
        // Verifica se esiste il cookie di sessione
        const hasSessionCookie = typeof document !== "undefined" && document.cookie.split(";").some(c => c.trim().startsWith("kalex_session="));
        
        if (hasSessionCookie && !auth.currentUser && active) {
          // Tenta la sincronizzazione iniziale (Multi-Tab)
          try {
            const res = await fetchWithAppCheck("/api/auth/client-token", { method: "POST" });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.customToken) {
                await signInWithCustomToken(auth, data.customToken);
              }
            }
          } catch (err) {
            console.warn("[FirebaseProvider] Impossibile recuperare il client token iniziale:", err);
          }
        }
      } catch (err) {
        console.error("[FirebaseProvider] Errore inizializzazione Auth:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    void initAuth();
    return () => {
      active = false;
    };
  }, []);

  // Listener dello stato di autenticazione e Refresh periodico
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Configura il timer di auto-refresh del token client (ogni 45 minuti)
    const refreshInterval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          console.log("[FirebaseProvider] Eseguo il refresh periodico del client token...");
          const res = await fetchWithAppCheck("/api/auth/client-token", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.customToken) {
              await signInWithCustomToken(auth, data.customToken);
              console.log("[FirebaseProvider] Client token rinfrescato in memoria.");
            }
          } else if (res.status === 401) {
            // Se il cookie è scaduto o revocato, disconnetti il client
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore durante il refresh del client token:", err);
        }
      }
    }, 45 * 60 * 1000); // 45 minuti

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/20"></span>
      </div>
    );
  }

  return <>{children}</>;
}
export { auth };
