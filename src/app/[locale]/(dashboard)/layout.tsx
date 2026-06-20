"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, dataConnect, fetchWithAppCheck, db, fetchAuthed } from "@/lib/firebase/client";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Button, Avatar, Chip } from "@heroui/react";
import { useTheme } from "next-themes";
import { useI18n, useChangeLocale, useCurrentLocale } from "@/locales/client";
import {
  updateUserPreferences,
  GetUserClaimsContextData
} from "@/lib/dataconnect-client";
import {
  LogOut,
  CheckCircle,
  Shield,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  Key,
  Menu,
  AlertCircle,
  FileText,
  Coins,
  Server,
  Radio,
  RefreshCw,
  Package
} from "lucide-react";

interface ToastNotification {
  message: string;
  type: "success" | "error" | "info";
}

interface DashboardContextType {
  user: User | null;
  dbData: GetUserClaimsContextData["user"] | null;
  claims: {
    orgId?: string;
    role?: string;
    confirmed?: boolean;
    loc?: string;
    thm?: string;
    services?: Record<string, { status: string; tier: string | null }>;
    country?: string;
    perms?: Record<string, number>;
  } | null;
  loading: boolean;
  refreshClaims: (targetOrgId?: string) => Promise<void>;
  hasPermission: (module: string, action: "read" | "create" | "update" | "delete") => boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  setError: (msg: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardLayout");
  }
  return context;
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
async function fetchAndSyncUserData(
  currentUser: User,
  currentLocale: string,
  changeLocale: (locale: "it" | "en" | "es") => void,
  theme: string | undefined,
  setTheme: (theme: string) => void,
  setDbData: (data: GetUserClaimsContextData["user"] | null) => void
): Promise<boolean> {
  try {
    const idToken = await currentUser.getIdToken();
    const response = await fetchWithAppCheck("/api/auth/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      }
    });

    if (response.status === 202) {
      return true;
    }

    const data = await response.json();
    if (response.ok && data.success) {
      if (data.user) {
        const userData = {
          uid: data.user.uid,
          email: data.user.email,
          fullName: data.user.fullName,
          avatarUrl: data.user.avatarUrl,
          mobile: data.user.mobile,
          locale: data.user.locale,
          theme: data.user.theme,
          userOrganizations_on_user: data.organization ? [{
            role: data.organization.role,
            organization: {
              orgId: data.organization.orgId,
              name: data.organization.name,
              type: data.organization.type,
              country: data.organization.country,
              confirmed: data.organization.confirmed,
              isTest: data.organization.isTest || false,
              viesValidated: data.organization.viesValidated || false,
              vatNumber: data.organization.vatNumber,
              fiscalCode: data.organization.fiscalCode,
              sdiCode: data.organization.sdiCode,
              officeCode: data.organization.officeCode,
              cigCode: data.organization.cigCode,
              cupCode: data.organization.cupCode,
              address: data.organization.address,
              stripeCustomerId: data.organization.stripeCustomerId,
              stripeConnectAccountId: data.organization.stripeConnectAccountId,
              stripeConnectOnboarded: data.organization.stripeConnectOnboarded,
              subscriptions_on_organization: data.organization.subscriptions || [],
              serviceSeats_on_organization: data.organization.serviceSeats || []
            }
          }] : []
        };
        setDbData(userData as unknown as GetUserClaimsContextData["user"]);

        if (data.user.locale && data.user.locale !== currentLocale) {
          changeLocale(data.user.locale as "it" | "en" | "es");
        }
        if (data.user.theme && data.user.theme !== theme) {
          setTheme(data.user.theme);
        }
      }
      return false;
    }
    return false;
  } catch (err) {
    console.error("[Layout Load User Data] Errore:", err);
    return false;
  }
}
export default function DashboardLayout({ children, params }: LayoutProps) {
  const router = useRouter();
  const rawPathname = usePathname();
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Stati autenticazione e dati utente
  const [user, setUser] = useState<User | null>(null);
  const [dbData, setDbData] = useState<GetUserClaimsContextData["user"] | null>(null);
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [thingCount, setThingCount] = useState(0);
  const [computeCount, setComputeCount] = useState(0);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [localeParam, setLocaleParam] = useState("en");
  const [onboardingPending, setOnboardingPending] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState("");
  const isRefreshingRef = useRef(false);
  const refreshAttemptsRef = useRef(0);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  // Forza il rendering client-side per evitare hydration mismatches
  useEffect(() => {
    const initLayout = () => {
      setMounted(true);
      void params.then(p => setLocaleParam(p.locale));
    };
    const timer = setTimeout(initLayout, 0);
    return () => clearTimeout(timer);
  }, [params]);

  // Toast auto-chiusura
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!activeOrg?.orgId) {
      Promise.resolve().then(() => {
        setThingCount(0);
        setComputeCount(0);
      });
      return;
    }

    let active = true;
    const fetchCounts = async () => {
      try {
        const [thingRes, computeRes] = await Promise.all([
          fetchAuthed(`/api/thing/list?limit=1`),
          fetchAuthed(`/api/compute/list?limit=1`)
        ]);
        if (!active) return;
        
        if (thingRes.status === 200) {
          const thingText = await thingRes.text();
          const thingData = thingText ? JSON.parse(thingText) as { pagination?: { totalItems?: number } } : null;
          setThingCount(thingData?.pagination?.totalItems || 0);
        } else {
          setThingCount(0);
        }

        if (computeRes.status === 200) {
          const computeText = await computeRes.text();
          const computeData = computeText ? JSON.parse(computeText) as { pagination?: { totalItems?: number } } : null;
          setComputeCount(computeData?.pagination?.totalItems || 0);
        } else {
          setComputeCount(0);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei conteggi delle risorse:", err);
      }
    };

    void fetchCounts();
    return () => {
      active = false;
    };
  }, [activeOrg?.orgId]);

  const hasPermission = useCallback((module: string, action: "read" | "create" | "update" | "delete"): boolean => {
    if (!claims) return false;
    
    const rbac = claims.rbac as { apps?: { sso?: Record<string, number> } } | undefined;
    const ssoPerms = rbac?.apps?.sso || {};
    const mask = ssoPerms[module];
    
    // Se il modulo è esplicitamente disattivato (pari a 0) nei claims, blocchiamo l'accesso
    if (mask === 0) return false;
    
    if (claims.role === "owner") return true; // L'Owner scavalca tutto per i moduli attivi
    
    const activeMask = mask || 0;
    let bit = 0;
    if (action === "read") bit = 1;
    if (action === "create") bit = 2;
    if (action === "update") bit = 4;
    if (action === "delete") bit = 8;
    
    return (activeMask & bit) !== 0;
  }, [claims]);

  // Funzione per ricaricare le claims e sincronizzare con il backend
  const refreshClaims = useCallback(async (targetOrgId?: string) => {
    if (!auth.currentUser || isRefreshingRef.current) return;
    
    // Controlliamo se abbiamo superato i tentativi massimi (evita loop infiniti in caso di errore)
    if (refreshAttemptsRef.current >= 3) {
      console.warn("[Layout Refresh Claims] Raggiunto il limite massimo di tentativi di refresh. Onboarding incompleto.");
      setError("Impossibile caricare l'organizzazione del profilo. Contatta l'assistenza.");
      return;
    }
    
    isRefreshingRef.current = true;
    refreshAttemptsRef.current++;
    
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const res = await fetchWithAppCheck("/api/auth/claims/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ orgId: targetOrgId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Forza il refresh del token Firebase a livello client per recepire i nuovi claims
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        setClaims(tokenResult.claims);
        // Resettiamo il contatore dei tentativi in caso di successo
        refreshAttemptsRef.current = 0;
        // Ricarica i dati anagrafici dal backend
        await fetchAndSyncUserData(
          auth.currentUser,
          currentLocale || "en",
          changeLocale,
          theme,
          setTheme,
          setDbData
        );
      }
    } catch (err) {
      console.error("[Layout Refresh Claims] Errore:", err);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [currentLocale, changeLocale, theme, setTheme, setDbData, setError]);


  const syncRefs = useRef({ currentLocale, changeLocale, theme, setTheme, refreshClaims });
  useEffect(() => {
    syncRefs.current = { currentLocale, changeLocale, theme, setTheme, refreshClaims };
  });

  // Listener in tempo reale per la sincronizzazione delle claims remote con throttling e feedback visivo
  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "user_claims_metadata", user.uid);
    let lastUpdateProcessed = 0;

    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      const data = snapshot.data();
      if (data && data.updatedAt) {
        const updateTime = data.updatedAt.toMillis ? data.updatedAt.toMillis() : new Date(data.updatedAt.seconds * 1000).getTime();
        const now = Date.now();
        
        // Esegue il refresh solo se l'evento è fresco ed è passato almeno un cooldown di 10 secondi dall'ultimo refresh
        if (updateTime > lastUpdateProcessed && (now - lastUpdateProcessed) > 10000) {
          lastUpdateProcessed = now;
          console.log("[Auth Sync] Custom claims aggiornati in remoto. Avvio il refresh locale...");
          
          try {
            await refreshClaims(data.orgId);
            showToast("[Novità] I tuoi permessi sono stati aggiornati. Le nuove app e funzionalità sono pronte!", "success");
          } catch (err) {
            console.error("[Auth Sync] Impossibile aggiornare i claims locali:", err);
          }
        }
      }
    }, (err) => {
      console.warn("[Auth Sync] Connessione Firestore offline o permessi mancanti per i metadati dei claims:", err);
    });

    return () => unsubscribe();
  }, [user, refreshClaims, showToast]);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setClaims(null);
        setDbData(null);
        setLoading(false);
        setOnboardingPending(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        router.push(`/${localeParam}/auth`);
      } else {
        setUser(currentUser);
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          setClaims(tokenResult.claims);
          const isPending = await fetchAndSyncUserData(
            currentUser,
            syncRefs.current.currentLocale || "en",
            syncRefs.current.changeLocale,
            syncRefs.current.theme,
            syncRefs.current.setTheme,
            setDbData
          );

          if (isPending) {
            setOnboardingPending(true);
            setOnboardingMessage(t("onboarding.message"));
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }

            const intervalId = setInterval(async () => {
              try {
                const stillPending = await fetchAndSyncUserData(
                  currentUser,
                  syncRefs.current.currentLocale || "en",
                  syncRefs.current.changeLocale,
                  syncRefs.current.theme,
                  syncRefs.current.setTheme,
                  setDbData
                );
                
                if (!stillPending) {
                  if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                  }
                  setOnboardingPending(false);
                  refreshAttemptsRef.current = 0; // Reset tentativi
                  await syncRefs.current.refreshClaims();
                }
              } catch (pollErr) {
                console.error("Polling error in layout:", pollErr);
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
                }
                setOnboardingPending(false);
              }
            }, 3000);
            
            pollingIntervalRef.current = intervalId;
          }
        } catch (err) {
          console.error("Errore decodifica token:", err);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribe();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [mounted, localeParam, router, t]);


  // Effetto per innescare un refresh automatico dei claims se l'utente è loggato ma non ha ancora l'associazione dell'organizzazione
  useEffect(() => {
    if (user && claims && !claims.orgId && !onboardingPending) {
      console.log("[Layout] Custom claims non pronti o mancanti orgId. Inizio refresh automatico...");
      const timer = setTimeout(() => {
        void syncRefs.current.refreshClaims();
      }, 1000); // 1 secondo di debouncing
      return () => clearTimeout(timer);
    }
  }, [user, claims, onboardingPending]);

  // Definizione dinamica delle sezioni del menu in base all'RBAC ed alle risorse attive
  const menuSections = useMemo(() => [
    {
      id: "core",
      labelKey: "sidebar.section.core",
      items: [
        { id: "dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { id: "user", labelKey: "sidebar.user", icon: Users, path: "/user", requiredPermission: "user" },
        { id: "team", labelKey: "sidebar.team", icon: Shield, path: "/team", requiredPermission: "team" },
        { id: "apikey", labelKey: "sidebar.apikey", icon: Key, path: "/apikey", requiredPermission: "apikey" }
      ]
    },
    // Sezione dinamica Risorse
    ...(thingCount > 0 || computeCount > 0 ? [{
      id: "resources",
      labelKey: "sidebar.section.resources",
      items: [
        ...(thingCount > 0 ? [{ id: "thing", labelKey: "sidebar.thing", icon: Radio, path: "/thing", requiredPermission: "thing" }] : []),
        ...(computeCount > 0 ? [{ id: "compute", labelKey: "sidebar.compute", icon: Server, path: "/compute", requiredPermission: "compute" }] : [])
      ]
    }] : []),
    {
      id: "billing",
      labelKey: "sidebar.section.billing",
      items: [
        { id: "product", labelKey: "sidebar.product", icon: Package, path: "/product", requiredPermission: "product" },
        { id: "payment", labelKey: "sidebar.payment", icon: Coins, path: "/payment", requiredPermission: "payment" },
        { id: "invoice", labelKey: "sidebar.invoice", icon: FileText, path: "/invoice", requiredPermission: "invoice" },
        { id: "connect", labelKey: "sidebar.connect", icon: RefreshCw, path: "/connect", requiredPermission: "payment" },
        { id: "issue", labelKey: "sidebar.issue", icon: AlertCircle, path: "/issue" }
      ]
    }
  ], [thingCount, computeCount]);

  // Protezione proattiva delle rotte in base a RBAC (hasPermission)
  useEffect(() => {
    // Il controllo si attiva solo se l'autenticazione ha terminato il caricamento e i dati utente/claims sono pronti
    if (!loading && user && dbData && claims) {
      const relativePath = rawPathname.replace(new RegExp(`^\\/[a-z]{2}(\\/(dashboard)?)?`), "");
      const cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
      
      // Se l'utente tenta di accedere a una rotta diversa da dashboard o auth
      if (cleanPath && !cleanPath.startsWith("dashboard") && !cleanPath.startsWith("auth")) {
        // Cerca se esiste un menu item associato a questa rotta o che ne faccia da prefisso
        const matchedItem = menuSections
          .flatMap(s => s.items)
          .find(item => item.path && (cleanPath === item.id || cleanPath.startsWith(item.path.substring(1))));

        if (matchedItem && matchedItem.requiredPermission && !hasPermission(matchedItem.requiredPermission, "read")) {
          console.warn(`[RBAC Security] Accesso negato alla rotta '/${cleanPath}'. Permesso '${matchedItem.requiredPermission}' mancante. Reindirizzamento a /dashboard.`);
          router.push(`/${localeParam}/dashboard`);
        }
      }
    }
  }, [loading, user, dbData, claims, rawPathname, localeParam, router, hasPermission, menuSections]);




  const handlePreferenceChange = async (newLocale: string, newTheme: string) => {
    if (!user) return;
    try {
      if (newLocale !== currentLocale) {
        changeLocale(newLocale as "it" | "en" | "es");
      }
      if (newTheme !== theme && !newTheme.startsWith("theme-")) {
        setTheme(newTheme);
      }
      const actualTheme = newTheme.startsWith("theme-") ? newTheme : theme || "theme-amethyst";
      await updateUserPreferences(dataConnect, {
        uid: user.uid,
        locale: newLocale,
        theme: actualTheme
      });
      showToast("Preferenze aggiornate con successo.", "success");
    } catch (err) {
      console.error("Errore aggiornamento preferenze:", err);
      showToast("Impossibile salvare le preferenze.", "error");
    }
  };

  const handleSignOut = async () => {
    try {
      // Chiama il logout lato server per cancellare il cookie HttpOnly e revocare i token
      await fetchAuthed("/api/auth/logout", { method: "POST" }).catch(err => {
        console.warn("[Layout SignOut] Errore disconnessione server-side (proseguo comunque):", err);
      });
      await signOut(auth);
      router.push(`/${localeParam}/auth`);
    } catch (err) {
      console.error("Errore logout:", err);
    }
  };



  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></span>
      </div>
    );
  }

  if (onboardingPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-6 text-center">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-6"></span>
        <h2 className="text-lg font-bold mb-2">{t("onboarding.title")}</h2>
        <p className="text-slate-400 text-sm max-w-sm leading-relaxed">{onboardingMessage || t("onboarding.message.initial")}</p>
      </div>
    );
  }

  const activeThemeClass = theme && theme.startsWith("theme-") ? theme : "theme-amethyst";

  // Calcolo di hasPastDue
  const subscriptionsList = activeOrg?.subscriptions_on_organization || [];
  const hasPastDue = subscriptionsList.some((sub: { status?: string | null }) => sub.status === "past_due");

  // Identifica l'elemento di menu attivo in base all'URL corrente
  const getActiveView = () => {
    const relativePath = rawPathname.replace(new RegExp(`^\\/[a-z]{2}(\\/(dashboard)?)?`), "");
    if (!relativePath || relativePath === "/") return "dashboard";
    const cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
    
    for (const section of menuSections) {
      for (const item of section.items) {
        if (item.path && cleanPath.startsWith(item.path.substring(1))) {
          return item.id;
        }
      }
    }
    return "dashboard";
  };

  const activeView = getActiveView();

  return (
    <DashboardContext.Provider value={{ user, dbData, claims, loading, refreshClaims, hasPermission, showToast, setError }}>
      <div className={`min-h-screen ${activeThemeClass} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-foreground font-sans flex transition-all duration-500`}>
        {/* Glow di sfondo */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none bg-[var(--accent-glow-primary)] transition-all duration-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none bg-[var(--accent-glow-secondary)] transition-all duration-700"></div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm">
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
            {toast.type === "info" && <Shield className="w-5 h-5 text-cyan-500" />}
            <p className="text-slate-800 dark:text-white text-xs font-semibold">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* SIDEBAR */}
        <aside className={`relative z-20 shrink-0 border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}>
          <div className="flex flex-col gap-6 pt-6 overflow-y-auto max-h-[80vh]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0">
                K
              </div>
              {!sidebarCollapsed && (
                <span className="font-extrabold tracking-tight text-md bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent transition-opacity duration-200">
                  KALEX Console
                </span>
              )}
            </div>

            {/* Menu Navigazione */}
            <nav className="flex flex-col gap-4 px-2 select-none">
              {menuSections.map((section) => {
                const visibleItems = section.items.filter(item => {
                  return !item.requiredPermission || hasPermission(item.requiredPermission, "read");
                });

                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.id} className="flex flex-col gap-1">
                    {!sidebarCollapsed && (
                      <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {t(section.labelKey as Parameters<typeof t>[0])}
                      </span>
                    )}
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const active = activeView === item.id;
                      const hasAlert = (item as { showBadgeOnPastDue?: boolean }).showBadgeOnPastDue && hasPastDue;

                      return (
                        <button
                          key={item.id}
                          onClick={() => router.push(`/${localeParam}${item.path}`)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                            active
                              ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-l-4 border-purple-500"
                              : "text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 shrink-0" />
                            {!sidebarCollapsed && <span>{t(item.labelKey as Parameters<typeof t>[0])}</span>}
                          </div>
                          {hasAlert && !sidebarCollapsed && (
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" title="Pagamento insoluto!" />
                          )}
                          {hasAlert && sidebarCollapsed && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-3">
            {!sidebarCollapsed && (
              <div className="flex justify-between items-center gap-2">
                {/* Temi HSL */}
                <div className="flex items-center gap-1">
                  {["theme-amethyst", "theme-emerald", "theme-ocean", "theme-obsidian"].map((tName) => (
                    <button
                      key={tName}
                      onClick={() => void handlePreferenceChange(currentLocale || "en", tName)}
                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                        activeThemeClass === tName ? "scale-125 border-slate-900 dark:border-white" : "border-transparent opacity-60"
                      } ${
                        tName === "theme-amethyst" ? "bg-purple-500" : tName === "theme-emerald" ? "bg-emerald-500" : tName === "theme-ocean" ? "bg-cyan-500" : "bg-zinc-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Dark/Light mode */}
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                  onClick={() => void handlePreferenceChange(currentLocale || "en", resolvedTheme === "dark" ? "light" : "dark")}
                >
                  {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </Button>
              </div>
            )}

            <Button
              variant="danger-soft"
              className="w-full font-bold text-xs cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>{t("dashboard.logout")}</span>}
            </Button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative z-10 flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="h-16 shrink-0 border-b border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl px-6 flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="ghost"
                className="rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white hidden md:flex items-center justify-center cursor-pointer"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="w-4.5 h-4.5" />
              </Button>
              <h1 className="text-lg font-black tracking-tight uppercase text-slate-900 dark:text-white">
                {(() => {
                  for (const section of menuSections) {
                    for (const item of section.items) {
                      if (item.id === activeView) {
                        return t(item.labelKey as Parameters<typeof t>[0]);
                      }
                    }
                  }
                  return "Console";
                })()}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {activeOrg && (
                <Chip variant="soft" className="font-extrabold uppercase text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10">
                  {activeOrg.name} ({activeRole})
                </Chip>
              )}
              <Avatar className="w-9 h-9 text-sm font-bold uppercase text-slate-950">
                <Avatar.Fallback className="bg-gradient-to-tr from-purple-500 to-pink-500 w-full h-full flex items-center justify-center text-white">
                  {(dbData?.fullName || dbData?.email || "K").slice(0, 2)}
                </Avatar.Fallback>
              </Avatar>
            </div>
          </header>

          {/* Corpo Pagina */}
          <div className="flex-1 p-6 space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-4 text-sm text-center font-medium shadow-lg flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={() => setError("")} className="ml-auto text-red-500 dark:text-red-300 hover:text-red-800 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
