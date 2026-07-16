"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { useSidebarCollapsedPreference } from "@/framework/lib/use-profile-preferences";
import { UserLayout } from "@/framework/components/user/UserLayout";
import { UserSidebar, UserSidebarProps } from "@/framework/components/user/UserSidebar";
import { UserMain } from "@/framework/components/user/UserMain";
import { UserCommandPalette } from "@/framework/components/user/UserCommandPalette";
import { MfaEnrollmentGate } from "@/framework/components/settings/MfaEnrollmentGate";
import { ReauthProvider } from "@/framework/components/settings/ReauthProvider";
import { useUIStrings } from "@/framework/lib/ui.localization";
import { GlobalLoader } from "@/framework/components/ui";
import { useClaimsSync } from "@/framework/components/layouts/hooks/useClaimsSync";
import { useOnboarding } from "@/framework/components/layouts/hooks/useOnboarding";
import { useRbacGuard } from "@/framework/components/layouts/hooks/useRbacGuard";
import type { ToastState } from "@/framework/lib/types";
import { DashboardContext } from "@/framework/components/layouts/DashboardContext";

export { useDashboard } from "@/framework/components/layouts/DashboardContext";

/**
 * ORCHESTRATORE dell'area privata (ex UserLayout monolitico, L3.4).
 *
 * Nome: "UserArea" = l'area autenticata nel suo insieme — NON collide con la
 * pagina /dashboard (la cui vista è layouts/DashboardView) né con UserMain
 * (che resta il CONTENITORE dei contenuti dove vivono le viste modulo).
 *
 * Possiede sessione e gate — useClaimsSync/useOnboarding/useRbacGuard,
 * MfaEnrollmentGate (174), ReauthProvider (178), DashboardContext — e compone
 * la shell PRESENTAZIONALE `UserLayout` (sidebar dockata + drawer mobile +
 * UserMain + Command Palette ⌘K). Specularità con auth: le pagine/orchestratori
 * tengono la logica, i componenti famiglia restano editabili su Claude Design.
 */

export interface UserAreaProps {
  children: React.ReactNode;
  appId?: string;
  /** Handler opzionali delle azioni sidebar (Notifiche/Messaggi/Stato servizio). */
  sidebarActions?: Pick<UserSidebarProps, "onNotifications" | "hasUnreadNotifications" | "onMessages" | "onServiceStatus">;
}

export function UserArea({ children, appId = "sso", sidebarActions }: UserAreaProps) {
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  // Scorciatoia ⌘K / Ctrl+K per la Command Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // NB: il Drawer mobile si chiude via onNavigate della UserSidebar (click su
  // una voce) e via onOpenChange del Drawer stesso (backdrop/Escape) — nessun
  // effetto sul pathname (il lint react-hooks vieta setState sincrono in effect).

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

  // L3.5: collapsed della sidebar persistito sul profilo (Users.metadata.preferences)
  // con localStorage come fonte immediata/fallback; hydrate dal contratto dashboard.
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsedPreference(
    firebaseUser?.uid,
    dbData?.user?.preferences
  );

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
  // Resta nell'orchestratore (glue di composizione): dipende dallo stato di useClaimsSync (dbData) e di useOnboarding (loading, onboardingPending).
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

  const handlePaletteNavigate = useCallback((localizedPath: string) => {
    setPaletteOpen(false);
    router.push(localizedPath);
  }, [router]);

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
      <UserLayout
        sidebar={
          <UserSidebar
            appId={appId}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            {...sidebarActions}
          />
        }
        drawerSidebar={
          <UserSidebar
            appId={appId}
            collapsed={false}
            setCollapsed={() => undefined}
            inDrawer
            onNavigate={() => setMobileNavOpen(false)}
            className="w-72 max-w-[85vw]"
            {...sidebarActions}
          />
        }
        mobileNavOpen={mobileNavOpen}
        onMobileNavOpenChange={setMobileNavOpen}
        drawerAriaLabel={s.layout.openMenu}
        overlays={
          <UserCommandPalette
            appId={appId}
            isOpen={paletteOpen}
            onOpenChange={setPaletteOpen}
            onNavigate={handlePaletteNavigate}
          />
        }
      >
        <UserMain
          error={error || undefined}
          onErrorDismiss={() => setError("")}
          toast={toast}
          onToastClose={() => setToast(null)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        >
          {/* Gate MFA (174) attorno ai figli; il ReauthProvider (178) sta più all'esterno:
              mette a disposizione app-wide il modal di step-up per i 403
              `auth/reauth-required` sulle operazioni sensibili. */}
          <ReauthProvider>
            <MfaEnrollmentGate>{children}</MfaEnrollmentGate>
          </ReauthProvider>
        </UserMain>
      </UserLayout>
    </DashboardContext.Provider>
  );
}

export default UserArea;
