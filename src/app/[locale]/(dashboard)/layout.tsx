"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { usePersistentToggle } from "@/framework/lib/use-persistent-toggle";
import { Sidebar } from "@/framework/components/layouts/Sidebar";
import { MfaEnrollmentGate } from "@/framework/components/settings/MfaEnrollmentGate";
import { ReauthProvider } from "@/framework/components/settings/ReauthProvider";
import { useUIStrings } from "@/framework/lib/ui.localization";
import { ToastNotification } from "@/framework/components/layouts/ToastNotification";
import { GlobalLoader } from "@/framework/components/ui";
import { useClaimsSync } from "@/framework/components/layouts/hooks/useClaimsSync";
import { useOnboarding } from "@/framework/components/layouts/hooks/useOnboarding";
import { useRbacGuard } from "@/framework/components/layouts/hooks/useRbacGuard";
import type { ToastState } from "@/framework/lib/types";
import { AlertCircle, X } from "lucide-react";

// I tipi del Dashboard e del registro risorse sono importati da @/framework/lib/types
// E4.3b: la logica di claims/onboarding/RBAC è estratta negli hook in ./hooks
// (useClaimsSync, useOnboarding, useRbacGuard) e composta qui.

import { DashboardContext } from "@/framework/components/layouts/DashboardContext";
export { useDashboard } from "@/framework/components/layouts/DashboardContext";

interface LayoutProps {
  children: React.ReactNode;
  appId?: string;
}

export function DashboardLayout({ children, appId = "sso" }: LayoutProps) {
  const s = useUIStrings();
  // Ref per usare le stringhe correnti dentro callback/effetti senza aggiungerle
  // alle dipendenze (il cambio lingua non deve ri-innescare fetch/refresh).
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);
  const router = useRouter();
  const pathname = usePathname();
  const { user: firebaseUser, loading: authLoading, claims: authClaims, loginRedirect } = useAuth();

  const [toast, setToast] = useState<ToastState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentToggle("klx-sidebar-collapsed", false);

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

  // Refresh dei custom claims con retry/ref + sync dei dati anagrafici (hook estratto)
  const {
    dbData,
    error,
    setError,
    onboardingMessage,
    fetchAndSyncUserData,
    refreshClaims,
    refreshAttemptsRef
  } = useClaimsSync({ sRef });

  // Stato auth/redirect + polling dell'onboarding (hook estratto)
  const { loading, isRedirecting, onboardingPending } = useOnboarding({
    appId,
    firebaseUser,
    authLoading,
    authClaims,
    pathname,
    router,
    loginRedirect,
    fetchAndSyncUserData,
    refreshClaims,
    refreshAttemptsRef
  });

  // Route guard RBAC + redirect (hook estratto); espone hasPermission per il context
  const { hasPermission } = useRbacGuard({ appId, loading, firebaseUser, authClaims, pathname, router });

  // Sincronizzazione automatica dei claims in caso di disallineamento rilevato con il database (es. dopo acquisti Stripe o cambi ruolo)
  // Resta nel layout (glue di composizione): dipende dallo stato di useClaimsSync (dbData) e di useOnboarding (loading, onboardingPending).
  useEffect(() => {
    if (loading || authLoading || !firebaseUser || !authClaims || !dbData || onboardingPending) {
      return;
    }

    // Contratto /api/auth/dashboard: { user, organization } (org attiva con role e subscriptions).
    const activeOrg = dbData.organization;
    if (!activeOrg) return;

    let needsClaimRefresh = false;

    // 1. Controllo ruoli
    const dbRole = activeOrg.role;
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

  // Gate a schermo intero: SEMPRE GlobalLoader (loader unico, theme-aware) —
  // niente schermate custom per-gate, così i passaggi tra gate non sfarfallano.
  if (authLoading || loading || isRedirecting) {
    return (
      <GlobalLoader
        message={isRedirecting ? (appId === "sso" ? s.layout.authCheck : s.layout.secureRedirect) : undefined}
      />
    );
  }

  // Schermata di onboarding pendente (stesso loader, cambia solo il testo)
  if (onboardingPending) {
    return <GlobalLoader message={s.layout.orgSetupTitle} subMessage={onboardingMessage} />;
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
            <div className="bg-danger/15 border border-danger/40 text-white rounded-2xl p-4 text-xs font-bold shadow-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-danger shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="ms-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Rendering dei figli — avvolti dal gate MFA (174): se l'org richiede il TOTP e l'utente
              non è enrollato, blocca l'app e forza l'attivazione. Il ReauthProvider (178) sta più
              all'esterno: mette a disposizione app-wide il modal di step-up per i 403
              `auth/reauth-required` sulle operazioni sensibili. */}
          <div className="flex-1">
            <ReauthProvider>
              <MfaEnrollmentGate>{children}</MfaEnrollmentGate>
            </ReauthProvider>
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
