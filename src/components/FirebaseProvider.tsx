"use client";

import React, { useEffect, useState } from "react";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { onAuthStateChanged, User, setPersistence, inMemoryPersistence, signInWithCustomToken } from "firebase/auth";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper resiliente per recuperare il client token con tentativi multipli e backoff
  const fetchClientTokenWithRetry = async (retries = 3, delay = 500): Promise<Response> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          throw new Error("Rete momentaneamente offline.");
        }
        
        const res = await fetchWithAppCheck("/api/auth/client-token", { method: "POST" });
        
        // Se la richiesta è andata a buon fine o se l'utente non è autorizzato (sessione scaduta/401)
        // restituiamo immediatamente la risposta (inutile fare retry sul 401).
        if (res.ok || res.status === 401) {
          return res;
        }

        // Se è un errore temporaneo (429, 5xx), tentiamo il retry se abbiamo ancora tentativi disponibili
        if (attempt < retries) {
          console.warn(`[FirebaseProvider] Tentativo ${attempt} fallito con status ${res.status}. Riprovo tra ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Backoff esponenziale leggero
          continue;
        }
        return res;
      } catch (err) {
        if (attempt < retries) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[FirebaseProvider] Tentativo ${attempt} fallito causa errore (${errMsg}). Riprovo tra ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Impossibile recuperare il client token dopo tutti i tentativi.");
  };

  // Inizializza la persistenza in memory ed esegue il sync all'avvio se è presente il cookie
  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        await setPersistence(auth, inMemoryPersistence);
        
        if (!auth.currentUser && active) {
          // Tenta la sincronizzazione iniziale (Multi-Tab) con retry resiliente se la sessione HttpOnly è attiva
          try {
            const res = await fetchClientTokenWithRetry();
            if (res.ok && active) {
              const data = (await res.json()) as { success: boolean; customToken?: string };
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

  // Listener dello stato di autenticazione, Refresh periodico e Gestione offline
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Configura il timer di auto-refresh del token client (ogni 45 minuti)
    const refreshInterval = setInterval(async () => {
      // Se il dispositivo è offline, evitiamo di far fallire la richiesta ed essere buttati fuori
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        console.log("[FirebaseProvider] Browser offline, rinvio il refresh del client token.");
        return;
      }

      if (auth.currentUser) {
        try {
          console.log("[FirebaseProvider] Eseguo il refresh periodico del client token...");
          const res = await fetchClientTokenWithRetry();
          if (res.ok) {
            const data = (await res.json()) as { success: boolean; customToken?: string };
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

    // Listener per il ripristino della rete: se eravamo offline, sincronizza subito il token
    const handleOnline = async () => {
      console.log("[FirebaseProvider] Connessione ripristinata. Tento la sincronizzazione del client token...");
      if (auth.currentUser) {
        try {
          const res = await fetchClientTokenWithRetry();
          if (res.ok) {
            const data = (await res.json()) as { success: boolean; customToken?: string };
            if (data.success && data.customToken) {
              await signInWithCustomToken(auth, data.customToken);
              console.log("[FirebaseProvider] Client token sincronizzato dopo ripristino rete.");
            }
          } else if (res.status === 401) {
            await auth.signOut();
          }
        } catch (err) {
          console.warn("[FirebaseProvider] Errore sincronizzazione client token dopo ripristino rete:", err);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
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
