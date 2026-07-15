"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { useSidebarCollapsedPreference } from "@/framework/lib/use-profile-preferences";
import { UserSidebar, UserSidebarProps } from "@/framework/components/user/UserSidebar";
import { UserMain } from "@/framework/components/user/UserMain";
import { UserCommandPalette } from "@/framework/components/user/UserCommandPalette";
import { MfaEnrollmentGate } from "@/framework/components/settings/MfaEnrollmentGate";
import { ReauthProvider } from "@/framework/components/settings/ReauthProvider";
import { useUIStrings } from "@/framework/lib/ui.localization";
import { GlobalLoader, Drawer } from "@/framework/components/ui";
import { useClaimsSync } from "@/framework/components/layouts/hooks/useClaimsSync";
import { useOnboarding } from "@/framework/components/layouts/hooks/useOnboarding";
import { useRbacGuard } from "@/framework/components/layouts/hooks/useRbacGuard";
import type { ToastState } from "@/framework/lib/types";
import { DashboardContext } from "@/framework/components/layouts/DashboardContext";

export { useDashboard } from "@/framework/components/layouts/DashboardContext";

/**
 * L3.4 (DS_LAYOUTS_V1_1_PLAN) — UserLayout: shell delle aree autenticate.
 *
 * Assorbe il DashboardLayout storico (gli hook useClaimsSync/useOnboarding/
 * useRbacGuard restano invariati) e vi aggiunge:
 * - UserSidebar dockata da md in su; sotto md diventa ui/Drawer con hamburger
 *   in UserMain (L3.2);
 * - UserMain con banner errore, host toast, ErrorBoundary/Suspense (L3.3);
 * - Command Palette ⌘K per la navigazione tra i moduli del registry (L3.4).
 *
 * Le azioni applicative della sidebar (Notifiche/Messaggi/Stato) NON esistono
 * di default: l'app le attiva passando gli handler via `sidebarActions`.
 */

export interface UserLayoutProps {
  children: React.ReactNode;
  appId?: string;
  /** Handler opzionali delle azioni sidebar (Notifiche/Messaggi/Stato servizio). */
  sidebarActions?: Pick<UserSidebarProps, "onNotifications" | "hasUnreadNotifications" | "onMessages" | "onServiceStatus">;
}

export function UserLayout({ children, appId = "sso", sidebarActions }: UserLayoutProps) {
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
      <div className="h-screen overflow-hidden flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-all duration-300">

        {/* SIDEBAR DOCKATA (da md in su); sotto md la navigazione passa dal Drawer */}
        <UserSidebar
          appId={appId}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          className="hidden md:flex"
          {...sidebarActions}
        />

        {/* DRAWER DI NAVIGAZIONE MOBILE (L3.2) */}
        <Drawer isOpen={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <Drawer.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden">
            {/* placement left: il Drawer HeroUI espone solo direzioni fisiche
                (top/bottom/left/right) — eccezione RTL consapevole e documentata. */}
            <Drawer.Content placement="left" className="h-full w-72 max-w-[85vw] bg-transparent">
              <Drawer.Dialog aria-label={s.layout.openMenu} className="h-full">
                <UserSidebar
                  appId={appId}
                  collapsed={false}
                  setCollapsed={() => undefined}
                  inDrawer
                  onNavigate={() => setMobileNavOpen(false)}
                  className="w-72 max-w-[85vw]"
                  {...sidebarActions}
                />
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>

        {/* CONTENUTO PRINCIPALE (L3.3) */}
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

        {/* COMMAND PALETTE ⌘K (L3.4) */}
        <UserCommandPalette
          appId={appId}
          isOpen={paletteOpen}
          onOpenChange={setPaletteOpen}
          onNavigate={handlePaletteNavigate}
        />
      </div>
    </DashboardContext.Provider>
  );
}

export default UserLayout;
