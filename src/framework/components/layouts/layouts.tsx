"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { fetchAuthedClient } from "@/framework/lib/api";
import { getRegistryApp } from "@/framework/lib/resources.config";
import { Sidebar } from "@/framework/components/layouts/Sidebar";
import { ToastNotification } from "@/framework/components/layouts/ToastNotification";
import type {
  ToastState,
  DashboardData,
  RefreshClaimsResponse
} from "@/framework/lib/types";
import { AlertCircle, X } from "lucide-react";

// I tipi del Dashboard e del registro risorse sono importati da @/framework/lib/types

import { DashboardContext } from "@/framework/components/layouts/DashboardContext";
export { useDashboard } from "@/framework/components/layouts/DashboardContext";

interface LayoutProps {
  children: React.ReactNode;
  appId?: string;
}

export function DashboardLayout({ children, appId = "sso" }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: firebaseUser, loading: authLoading, claims: authClaims, loginRedirect } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [dbData, setDbData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [onboardingPending, setOnboardingPending] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState("");

  const isRefreshingRef = useRef(false);
  const refreshAttemptsRef = useRef(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  // Chiude automaticamente il toast dopo 4 secondi
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Controlla se il ruolo dell'utente ha i privilegi RBAC per compiere l'azione
  const hasPermission = useCallback((module: string, action: "read" | "create" | "update" | "delete"): boolean => {
    if (!authClaims) return false;
    
    const userRoleRaw = authClaims.uRole || authClaims.role;
    // Bypass completo per l'owner
    if (userRoleRaw === "owner") return true;

    // Recupera la policy definita staticamente nel registro (SSOT)
    const appConfig = getRegistryApp(appId);
    if (!appConfig) return false;
    const moduleConfig = appConfig.modules[module];
    if (!moduleConfig) return false;

    const userRole = (userRoleRaw?.toLowerCase() || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
    const policy = moduleConfig.rolePolicies[userRole] || moduleConfig.rolePolicies["viewer"];

    if (!policy) return false;

    switch (action) {
      case "read": return !!(policy.canRead || policy.canList);
      case "create": return !!policy.canCreate;
      case "update": return !!policy.canUpdate;
      case "delete": return !!policy.canDelete;
      default: return false;
    }
  }, [authClaims, appId]);

  // Sincronizza i dati anagrafici dal backend /api/auth/dashboard
  const fetchAndSyncUserData = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchAuthedClient<DashboardData>("/api/auth/dashboard");
      
      if (res.success && res.data) {
        const data = res.data;
        if (data.status === "pending") {
          setOnboardingMessage(data.message || "Onboarding dell'organizzazione in corso...");
          return true;
        }
        setDbData(data);
        return false;
      }
      
      return false;
    } catch (err) {
      console.error("[Layout Load User Data] Errore caricamento:", err);
      return false;
    }
  }, []);

  // Esegue il refresh dei custom claims dell'utente (dopo onboarding o cambio organizzazione)
  const refreshClaims = useCallback(async (targetOrgId?: string) => {
    if (isRefreshingRef.current) return;
    
    if (refreshAttemptsRef.current >= 3) {
      console.warn("[Layout Claims Refresh] Raggiunto limite tentativi. Onboarding incompleto.");
      setError("Impossibile allineare l'organizzazione del profilo. Contatta l'assistenza.");
      return;
    }
    
    isRefreshingRef.current = true;
    refreshAttemptsRef.current++;
    
    try {
      const res = await fetchAuthedClient<RefreshClaimsResponse>("/api/auth/claims/refresh", {
        method: "POST",
        body: JSON.stringify({ orgId: targetOrgId })
      });
      
      if (res.success && res.data?.success) {
        // Forza il refresh del token Firebase a livello client per recepire i nuovi claims
        const { auth, forceCleanSession } = await import("@/framework/lib/auth");
        if (auth.currentUser) {
          try {
            await auth.currentUser.getIdTokenResult(true);
            refreshAttemptsRef.current = 0; // Reset
          } catch (tokenErr) {
            console.warn("[Layout Claims Refresh] Token revocato o scaduto durante il refresh dei claims:", tokenErr);
            const authErr = tokenErr as { code?: string };
            if (authErr.code === "auth/user-token-expired" || authErr.code === "auth/token-expired" || authErr.code === "auth/requires-recent-login") {
              void forceCleanSession();
              return;
            }
            throw tokenErr;
          }
        }
        await fetchAndSyncUserData();
      }
    } catch (err) {
      console.error("[Layout Claims Refresh] Errore:", err);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [fetchAndSyncUserData]);

  // Gestione stato di autenticazione, reindirizzamenti e polling dell'onboarding
  useEffect(() => {
    if (authLoading) return;

    let redirectTimer: NodeJS.Timeout | null = null;

    if (!firebaseUser) {
      Promise.resolve().then(() => {
        setOnboardingPending(false);
        setLoading(false);
        setIsRedirecting(true);
      });
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      // Reindirizza al login se non autenticato con transizione fluida
      const locale = pathname.split("/")[1] || "en";
      redirectTimer = setTimeout(() => {
        if (appId === "sso") {
          router.push(`/${locale}/auth`);
        } else {
          loginRedirect(appId);
        }
      }, 300);
      return;
    }

    const initUserData = async () => {
      try {
        const isPending = await fetchAndSyncUserData();

        if (isPending) {
          setOnboardingPending(true);
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          // Polling ogni 3 secondi finché l'onboarding non è completato in background
          const intervalId = setInterval(async () => {
            const stillPending = await fetchAndSyncUserData();
            if (!stillPending) {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setOnboardingPending(false);
              refreshAttemptsRef.current = 0;
              await refreshClaims();
            }
          }, 3000);

          pollingIntervalRef.current = intervalId;
        }
      } catch (err) {
        console.error("[Layout Init] Errore inizializzazione:", err);
      } finally {
        setLoading(false);
      }
    };

    void initUserData();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [firebaseUser, authLoading, fetchAndSyncUserData, refreshClaims, pathname, router, appId, loginRedirect]);

  // Innesca il refresh se l'utente è loggato ma non ha claims associati a un'organizzazione
  useEffect(() => {
    if (!loading && firebaseUser && authClaims && !authClaims.orgId && !onboardingPending) {
      const timer = setTimeout(() => {
        void refreshClaims();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [firebaseUser, authClaims, onboardingPending, loading, refreshClaims]);

  // Sincronizzazione automatica dei claims in caso di disallineamento rilevato con il database (es. dopo acquisti Stripe o cambi ruolo)
  useEffect(() => {
    if (loading || authLoading || !firebaseUser || !authClaims || !dbData || onboardingPending) {
      return;
    }

    const activeOrg = dbData.userOrganizations_on_user?.[0]?.organization;
    if (!activeOrg) return;

    let needsClaimRefresh = false;

    // 1. Controllo ruoli
    const dbRole = dbData.userOrganizations_on_user?.[0]?.role;
    const tokenRole = authClaims.uRole || authClaims.role;
    if (dbRole && tokenRole && dbRole !== tokenRole) {
      needsClaimRefresh = true;
    }

    // 2. Controllo stato delle applicazioni commerciali
    if (!needsClaimRefresh) {
      const orgApps = (activeOrg.apps || {}) as Record<string, unknown>;
      for (const [appIdKey, appDetail] of Object.entries(orgApps)) {
        if (appDetail && typeof appDetail === "object") {
          const detail = appDetail as { status: string; mode: string };
          const isActive = detail.status === "active" || detail.status === "trialing" || detail.status === "past_due";
          const tokenApp = authClaims.rbac?.apps?.[appIdKey] as { mode?: string } | undefined;

          if (isActive) {
            if (!tokenApp || tokenApp.mode !== detail.mode) {
              needsClaimRefresh = true;
              break;
            }
          } else {
            if (tokenApp && tokenApp.mode === "seller") {
              needsClaimRefresh = true;
              break;
            }
          }
        }
      }
    }

    if (needsClaimRefresh) {
      console.log(`[Layout Claims Sync] Rilevato disallineamento nei claims dell'utente (Ruolo DB: ${dbRole}, Token: ${tokenRole}). Innesco refresh automatico...`);
      const timer = setTimeout(() => {
        void refreshClaims(activeOrg.orgId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, authLoading, firebaseUser, authClaims, dbData, onboardingPending, refreshClaims]);

  // Controllo proattivo dei permessi di accesso alle rotte (RBAC Security)
  useEffect(() => {
    if (loading || !firebaseUser || !authClaims) return;

    const locale = pathname.split("/")[1] || "en";
    const relativePath = pathname.replace(new RegExp(`^\\/[a-z]{2}`), "");
    const cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;

    // Se l'utente accede ad una sotto-rotta specifica che non sia dashboard o auth
    const isDashboardPath = appId === "sso"
      ? cleanPath.startsWith("dashboard")
      : (cleanPath === "" || cleanPath.startsWith("dashboard"));

    if (cleanPath && !isDashboardPath && !cleanPath.startsWith("auth") && !cleanPath.startsWith("support")) {
      const appConfig = getRegistryApp(appId);
      if (appConfig) {
        // Cerca se la rotta corrisponde a un modulo registrato
        const modulesList = Object.keys(appConfig.modules);
        const matchedModule = modulesList.find(mod => cleanPath === mod || cleanPath.startsWith(mod + "/"));

        if (matchedModule && !hasPermission(matchedModule, "read")) {
          console.warn(`[RBAC Guard] Accesso negato a '/${cleanPath}'. Ruolo '${authClaims.uRole}' non autorizzato. Reindirizzamento.`);
          const dashboardRedirectPath = appId === "sso" ? "dashboard" : "";
          router.push(`/${locale}/${dashboardRedirectPath}`);
        }
      }
    }
  }, [loading, firebaseUser, authClaims, pathname, appId, router, hasPermission]);

  // Schermata di caricamento globale o reindirizzamento premium in corso
  if (authLoading || loading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.2)] mb-4"></span>
        {isRedirecting && (
          <p className="text-xs text-slate-400 font-medium tracking-wide animate-pulse">
            {appId === "sso" ? "Verifica autenticazione..." : "Reindirizzamento sicuro al portale di autenticazione..."}
          </p>
        )}
      </div>
    );
  }

  // Schermata di onboarding pendente
  if (onboardingPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-6 text-center">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.2)] mb-6"></span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[#ff00ff] mb-2">Setup Organizzazione</h2>
        <p className="text-slate-400 text-xs max-w-sm leading-relaxed font-bold">{onboardingMessage}</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ user: firebaseUser, claims: authClaims, loading, dbData, refreshClaims, hasPermission, showToast, setError }}>
      <div className="h-screen overflow-hidden flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-all duration-300">
        
        {/* SIDEBAR A SINISTRA */}
        <Sidebar appId={appId} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* CONTENUTO PRINCIPALE A DESTRA */}
        <main className="flex-1 overflow-y-auto klx-scrollbar-minimalist h-full relative flex flex-col p-6 space-y-6">
          {/* Banner di errore globale */}
          {error && (
            <div className="bg-red-950/60 border border-[#ff00ff] text-white rounded-2xl p-4 text-xs font-bold shadow-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-[#ff00ff] shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="ml-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Rendering dei figli */}
          <div className="flex-1">
            {children}
          </div>
        </main>

        {/* NOTIFICHE TOAST */}
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardLayout;
