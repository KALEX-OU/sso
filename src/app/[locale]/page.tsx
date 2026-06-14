"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, dataConnect, getAppCheckToken } from "@/lib/firebase/client";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { Button, Card, Avatar, Chip, Tooltip } from "@heroui/react";
import { useTheme } from "next-themes";
import { useI18n, useChangeLocale, useCurrentLocale } from "@/locales/client";
import {
  updateUserPreferences,
  GetUserClaimsContextData,
  confirmOrganization
} from "@/lib/dataconnect-client";
import {
  Globe,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Shield,
  CreditCard,
  Smartphone,
  Laptop,
  Check,
  ShieldCheck,
  QrCode,
  AlertCircle,
  X,
  Sun,
  Moon
} from "lucide-react";

interface DeviceSession {
  id: string;
  name: string;
  ip: string;
  loc: string;
  active: boolean;
  type: "desktop" | "mobile";
}

interface ToastNotification {
  message: string;
  type: "success" | "error" | "info";
}

export default function DashboardPage() {
  const router = useRouter();
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [dbData, setDbData] = useState<GetUserClaimsContextData["user"] | null>(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // States per le funzionalità premium (Fase 2)
  const [toast, setToast] = useState<ToastNotification | null>(null);
  
  // Sessioni dispositivi attivi (con sessione corrente + 2 simulate)
  const [sessions, setSessions] = useState<DeviceSession[]>([
    { id: "1", name: "Chrome on macOS (Current)", ip: "85.20.14.99", loc: "Milano, IT", active: true, type: "desktop" },
    { id: "2", name: "Safari on iPhone 15", ip: "85.20.14.101", loc: "Milano, IT", active: false, type: "mobile" },
    { id: "3", name: "Chrome on Windows 11", ip: "93.45.109.12", loc: "Tallinn, EE", active: false, type: "desktop" }
  ]);

  // MFA Wizard state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaStep, setMfaStep] = useState<"idle" | "select" | "verify" | "active">("idle");
  const [mfaMethod, setMfaMethod] = useState<"sms" | "app">("sms");
  const [mfaPhone, setMfaPhone] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaCodesList] = useState<string[]>(["KX99-RT34", "PL82-HY90", "QW11-PO92", "MN88-VC01"]);

  // Forza il rendering client-side per evitare warning di mismatch idrati
  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMounted(true);
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  // Timer per auto-chiusura dei Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadUserData = React.useCallback(async (currentUser: User) => {
    setUserDataLoaded(true);
    try {
      const idToken = await currentUser.getIdToken(true); // Forza il refresh del token per garantire claims aggiornati
      
      const response = await fetch("/api/auth/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.error?.message || "Impossibile caricare la dashboard.";
        const errCode = data.error?.code;

        if (errCode === "auth/email-not-verified") {
          router.push(`/${currentLocale}/auth`);
          return;
        }

        throw new Error(errMsg);
      }

      if (data.user) {
        // Mappiamo i dati dell'API al formato atteso da dbData (compatibile con GetUserClaimsContextData["user"])
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
              serviceSubscriptions_on_organization: []
            }
          }] : []
        };

        setDbData(userData as GetUserClaimsContextData["user"]);

        if (data.user.locale && data.user.locale !== currentLocale) {
          changeLocale(data.user.locale as "it" | "en" | "es");
        }
        if (data.user.theme && data.user.theme !== theme) {
          setTheme(data.user.theme);
        }
      }
    } catch (err) {
      console.error("Errore nel caricamento dei dati PostgreSQL via API:", err);
      const msg = err instanceof Error ? err.message : "Impossibile caricare i dati relazionali dal database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentLocale, theme, changeLocale, setTheme, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push(`/${currentLocale}/auth`);
      } else {
        setUser(currentUser);
        setUserDataLoaded(false);
      }
    });

    return () => unsubscribe();
  }, [router, currentLocale]);

  useEffect(() => {
    if (user && !userDataLoaded) {
      setTimeout(() => {
        loadUserData(user);
      }, 0);
    }
  }, [user, userDataLoaded, loadUserData]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push(`/${currentLocale}/auth`);
    } catch (err) {
      console.error("Errore durante logout:", err);
    }
  };

  const handleStripeOnboarding = async (orgId: string) => {
    setStripeLoading(true);
    setError("");
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Utente non autenticato.");

      const appCheckToken = await getAppCheckToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      };

      if (appCheckToken) {
        headers["X-Firebase-App-Check"] = appCheckToken;
      }

      const response = await fetch("/api/stripe/connect/onboard", {
        method: "POST",
        headers,
        body: JSON.stringify({ orgId })
      });

      const data = await response.json();
      if (data.error) {
        const errMsg = (data.error && typeof data.error === "object" && "message" in data.error && typeof data.error.message === "string")
          ? data.error.message
          : String(data.error);
        throw new Error(errMsg);
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Errore durante onboarding Stripe:", err);
      const message = err instanceof Error ? err.message : "Errore durante il collegamento a Stripe.";
      setError(message);
      setStripeLoading(false);
    }
  };

  // Funzione per salvare le preferenze dell'utente sia in locale che sul database PostgreSQL
  const handlePreferenceChange = async (newLocale: string, newTheme: string) => {
    if (!user) return;
    setPrefLoading(true);
    try {
      // 1. Salva in PostgreSQL tramite mutazione client-side di SQL Connect
      await updateUserPreferences(dataConnect, {
        uid: user.uid,
        locale: newLocale,
        theme: newTheme
      });

      // 2. Aggiorna lo stato locale dell'app
      if (newLocale !== currentLocale) {
        changeLocale(newLocale as "it" | "en" | "es");
      }
      if (newTheme !== theme) {
        setTheme(newTheme);
      }

      // 3. Forza il refresh del token Firebase per aggiornare istantaneamente i Custom Claims (locale, tema)
      await user.getIdToken(true);

      setToast({ message: t("toast.prefsSaved"), type: "success" });
    } catch (err) {
      console.error("Errore salvataggio preferenze in Postgres:", err);
      setToast({ message: "Error saving preferences", type: "error" });
    } finally {
      setPrefLoading(false);
    }
  };

  // Revoca di una sessione di dispositivo
  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    setToast({ message: t("toast.sessionRevoked"), type: "success" });
  };

  // Completamento del flusso MFA
  const handleVerifyMFA = () => {
    if (mfaCode.length === 6) {
      setMfaStep("active");
      setMfaEnabled(true);
      setToast({ message: t("toast.mfaSuccess"), type: "success" });
    } else {
      setError("Please enter a valid 6-digit code.");
    }
  };

  const handleDisableMFA = () => {
    setMfaEnabled(false);
    setMfaStep("idle");
    setMfaCode("");
    setMfaPhone("");
    setToast({ message: "MFA disabled successfully", type: "info" });
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></span>
      </div>
    );
  }

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  // Calcolo della classe del tema per applicare le variabili CSS specifiche
  const activeThemeClass = theme && theme.startsWith("theme-") ? theme : "theme-amethyst";

  return (
    <div className={`min-h-screen ${activeThemeClass} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-foreground font-sans px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-stretch justify-start relative overflow-hidden transition-all duration-500`}>
      {/* Sfera luminosa di sfondo per ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none bg-[var(--accent-glow-primary)] transition-all duration-700"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none bg-[var(--accent-glow-secondary)] transition-all duration-700"></div>

      {/* Elegant Toast Alert Panel */}
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

      <div className="w-full relative z-10 space-y-6">
        {/* Barra Superiore - Profilo & Preferenze */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-4 transition-all">
          <Card.Content className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 text-xl font-bold uppercase text-slate-950">
                {dbData?.avatarUrl && <Avatar.Image src={dbData.avatarUrl} />}
                <Avatar.Fallback className="bg-gradient-to-tr from-purple-500 to-pink-500 w-full h-full flex items-center justify-center">
                  {(dbData?.fullName || dbData?.email || "K").slice(0, 2)}
                </Avatar.Fallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{dbData?.fullName || t("dashboard.profileDefault")}</h2>
                  <Chip variant="soft" className="border border-slate-200/50 dark:border-white/5 text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider px-2 py-0.5">
                    SSO Active
                  </Chip>
                </div>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">{dbData?.email}</p>
              </div>
            </div>

            {/* Controlli Interattivi ed Azioni */}
            <div className="flex items-center gap-3">
              {/* Toggle Tema (Light / Dark) */}
              <Tooltip>
                <Tooltip.Trigger>
                  <Button
                    isIconOnly
                    variant="ghost"
                    className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-white cursor-pointer flex items-center justify-center rounded-full"
                    onClick={() => handlePreferenceChange(currentLocale || "en", resolvedTheme === "dark" ? "light" : "dark")}
                  >
                    {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md">
                  {resolvedTheme === "dark" ? "Passa al Tema Chiaro" : "Passa al Tema Scuro"}
                </Tooltip.Content>
              </Tooltip>

              {/* Selettore Lingua a discesa */}
              <div className="relative">
                <Tooltip>
                  <Tooltip.Trigger>
                    <Button
                      isIconOnly
                      variant="ghost"
                      className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-white cursor-pointer flex items-center justify-center rounded-full"
                      onClick={() => setLangMenuOpen(!langMenuOpen)}
                      isDisabled={prefLoading}
                    >
                      {prefLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md">
                    {currentLocale === "it" ? "Seleziona Lingua" : currentLocale === "en" ? "Select Language" : "Seleccionar idioma"}
                  </Tooltip.Content>
                </Tooltip>

                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-40 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        type="button"
                        onClick={() => {
                          handlePreferenceChange("it", theme || "theme-amethyst");
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          currentLocale === "it"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm">🇮🇹</span> Italiano
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handlePreferenceChange("en", theme || "theme-amethyst");
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          currentLocale === "en"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm">🇬🇧</span> English
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handlePreferenceChange("es", theme || "theme-amethyst");
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          currentLocale === "es"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm">🇪🇸</span> Español
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Logout */}
              <Button
                variant="danger-soft"
                className="rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 px-3 py-1.5"
                onClick={handleSignOut}
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </Card.Content>
        </Card>

        {error && (
          <div className="bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-4 text-sm text-center font-medium shadow-lg flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-500 dark:text-red-300 hover:text-red-800 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Panel dei Temi (Fase 2) */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 transition-all">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{t("dashboard.themeTitle")}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">{t("dashboard.themeDesc")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Amethyst */}
              <Button
                variant="ghost"
                onClick={() => handlePreferenceChange(currentLocale || "en", "theme-amethyst")}
                className={`py-6 rounded-2xl font-bold text-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeThemeClass === "theme-amethyst" ? "border-purple-500 bg-purple-500/10 text-purple-950 dark:text-white" : "border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Neon Amethyst
              </Button>

              {/* Emerald */}
              <Button
                variant="ghost"
                onClick={() => handlePreferenceChange(currentLocale || "en", "theme-emerald")}
                className={`py-6 rounded-2xl font-bold text-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeThemeClass === "theme-emerald" ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-white" : "border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Emerald Forest
              </Button>

              {/* Ocean */}
              <Button
                variant="ghost"
                onClick={() => handlePreferenceChange(currentLocale || "en", "theme-ocean")}
                className={`py-6 rounded-2xl font-bold text-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeThemeClass === "theme-ocean" ? "border-cyan-500 bg-cyan-500/10 text-cyan-950 dark:text-white" : "border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                Ocean Breeze
              </Button>

              {/* Obsidian */}
              <Button
                variant="ghost"
                onClick={() => handlePreferenceChange(currentLocale || "en", "theme-obsidian")}
                className={`py-6 rounded-2xl font-bold text-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeThemeClass === "theme-obsidian" ? "border-zinc-500 bg-zinc-500/10 text-zinc-950 dark:text-white" : "border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-300"></span>
                Obsidian Dark
              </Button>
            </div>
          </Card.Content>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Gestione Organizzazione & Stripe Connect */}
          <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 flex flex-col justify-between transition-all">
            <Card.Content className="p-2 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-purple-600 dark:text-purple-400 font-extrabold block mb-1">
                      {t("dashboard.title")}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {activeOrg?.name || t("dashboard.noOrg")}
                    </h3>
                  </div>

                  {activeOrg && activeOrg.confirmed === false && (
                    <div className="mt-4 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl p-4 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                        <span>{t("dashboard.pendingApproval")}</span>
                      </div>
                      {process.env.NEXT_PUBLIC_ENVIRONMENT !== "production" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 font-bold rounded-lg px-3 py-1 cursor-pointer transition-all self-start sm:self-auto"
                          onClick={async () => {
                            try {
                              await confirmOrganization(dataConnect, { orgId: activeOrg.orgId, confirmed: true });
                              setToast({ message: t("dashboard.simulateSuccess"), type: "success" });
                              if (user) await loadUserData(user);
                            } catch (err) {
                              console.error("Simulation error:", err);
                              setToast({ message: "Error simulating approval", type: "error" });
                            }
                          }}
                        >
                          {t("dashboard.simulateApproval")}
                        </Button>
                      )}
                    </div>
                  )}

                  {activeRole && (
                    <Chip
                      variant="soft"
                      color={activeRole === "owner" ? "accent" : "default"}
                      className="font-bold uppercase tracking-wider text-[9px] text-slate-600 dark:text-gray-300 flex items-center gap-1 px-2 py-0.5 border border-slate-200/50 dark:border-white/5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {activeRole}
                    </Chip>
                  )}
                </div>

                {activeOrg && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <CreditCard className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200">{t("dashboard.stripeStatus")}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 leading-relaxed">{t("dashboard.stripeDesc")}</p>
                        </div>
                      </div>
                      {activeOrg.stripeConnectOnboarded ? (
                        <Chip
                          color="success"
                          variant="soft"
                          className="font-bold text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-2 py-0.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {t("dashboard.active")}
                        </Chip>
                      ) : (
                        <Chip
                          color="warning"
                          variant="soft"
                          className="font-bold text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1 px-2 py-0.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {t("dashboard.pending")}
                        </Chip>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {activeOrg && (activeRole === "owner" || activeRole === "admin") && !activeOrg.stripeConnectOnboarded && (
                <Button
                  isDisabled={stripeLoading || activeOrg.confirmed === false}
                  onClick={() => handleStripeOnboarding(activeOrg.orgId)}
                  className="w-full py-6 mt-4 font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  {stripeLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>}
                  {stripeLoading ? t("dashboard.stripeLoading") : t("dashboard.stripeBtn")}
                </Button>
              )}
            </Card.Content>
          </Card>

          {/* Box 2: Sottoscrizioni Attive */}
          <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 transition-all">
            <Card.Content className="p-2 space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-600 dark:text-purple-400 font-extrabold block mb-1">
                  {t("dashboard.subTitle")}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{t("dashboard.subDesc")}</h3>
              </div>

              <div className="space-y-3">
                {/* Satefy Card */}
                <div className="bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">SATEFY.ES</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">Sustainable Construction & Energy</p>
                    </div>
                  </div>
                  {activeOrg?.serviceSubscriptions_on_organization?.find((s) => s.serviceId === "satefy.es")?.status === "active" ? (
                    <Chip
                      color="success"
                      variant="soft"
                      className="font-bold text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 py-0.5"
                    >
                      {t("dashboard.active")}
                    </Chip>
                  ) : (
                    <Chip
                      variant="soft"
                      className="border border-slate-200 dark:border-white/5 text-[9px] uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold px-2 py-0.5"
                    >
                      {t("dashboard.noPlan")}
                    </Chip>
                  )}
                </div>

                {/* Standlo Card */}
                <div className="bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">STANDLO.COM</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">Smart Event Infrastructure</p>
                    </div>
                  </div>
                  {activeOrg?.serviceSubscriptions_on_organization?.find((s) => s.serviceId === "standlo.com")?.status === "active" ? (
                    <Chip
                      color="success"
                      variant="soft"
                      className="font-bold text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 py-0.5"
                    >
                      {t("dashboard.active")}
                    </Chip>
                  ) : (
                    <Chip
                      variant="soft"
                      className="border border-slate-200 dark:border-white/5 text-[9px] uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold px-2 py-0.5"
                    >
                      {t("dashboard.noPlan")}
                    </Chip>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 3: Autenticazione a Due Fattori (MFA Wizard) */}
          <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 transition-all">
            <Card.Content className="p-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("dashboard.mfaTitle")}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">{t("dashboard.mfaDesc")}</p>
                </div>
              </div>

              {/* MFA IDLE (Non Attiva) */}
              {mfaStep === "idle" && !mfaEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="bg-slate-100/50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                    {t("dashboard.mfaDescLong")}
                  </div>
                  <Button
                    onClick={() => setMfaStep("select")}
                    className="w-full py-5 rounded-xl font-bold bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  >
                    {t("dashboard.mfaSetupBtn")}
                  </Button>
                </div>
              )}

              {/* MFA Enabled (Stato Attivo) */}
              {mfaEnabled && mfaStep === "idle" && (
                <div className="space-y-4 pt-2">
                  <div className="bg-emerald-100/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        {t("dashboard.mfaEnabled")}
                      </p>
                      <p className="text-slate-500 dark:text-gray-500 text-[10px] mt-0.5">{t("dashboard.mfaMethodConfigured")}</p>
                    </div>
                    <Button
                      variant="danger-soft"
                      size="sm"
                      onClick={handleDisableMFA}
                      className="rounded-xl font-bold text-xs"
                    >
                      {t("dashboard.mfaDisable")}
                    </Button>
                  </div>
                </div>
              )}

              {/* MFA SELECT METHOD */}
              {mfaStep === "select" && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-gray-300">{t("dashboard.mfaSelectDesc")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setMfaMethod("sms");
                        setMfaStep("verify");
                      }}
                      className="p-4 border border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/20 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-2xl flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                    >
                      <Smartphone className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t("dashboard.mfaSms")}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500">{t("dashboard.mfaSmsDesc")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMfaMethod("app");
                        setMfaStep("verify");
                      }}
                      className="p-4 border border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/20 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-2xl flex flex-col items-center gap-2 text-center transition-all cursor-pointer"
                    >
                      <QrCode className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t("dashboard.mfaApp")}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500">{t("dashboard.mfaAppDesc")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MFA VERIFY (Simulazione) */}
              {mfaStep === "verify" && (
                <div className="space-y-4 pt-2">
                  {mfaMethod === "sms" ? (
                    <div className="w-full flex flex-col gap-1.5">
                      <label className="text-slate-700 dark:text-gray-300 text-xs font-semibold">{t("dashboard.mfaEnterPhone")}</label>
                      <input
                        type="tel"
                        required
                        value={mfaPhone}
                        onChange={(e) => setMfaPhone(e.target.value)}
                        placeholder="+39 345 678 9012"
                        className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-white rounded-xl flex items-center justify-center p-1 text-slate-950">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white text-xs font-bold">{t("dashboard.mfaScanQr")}</p>
                        <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-1">{t("dashboard.mfaOrEnterKey")} <code className="bg-slate-200 dark:bg-slate-950 px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-[9px]">K4LX SSO KEY</code></p>
                      </div>
                    </div>
                  )}
 
                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-gray-300 text-xs font-semibold">{t("dashboard.mfaEnterCode")}</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm text-center tracking-widest font-mono font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setMfaStep("select")}
                      className="w-1/3 py-4 rounded-xl font-bold border border-slate-200 dark:border-white/5 text-slate-500 dark:text-gray-400"
                    >
                      {t("dashboard.mfaBack")}
                    </Button>
                    <Button
                      onClick={handleVerifyMFA}
                      className="w-2/3 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 cursor-pointer animate-pulse"
                    >
                      {t("dashboard.mfaVerify")}
                    </Button>
                  </div>
                </div>
              )}

              {/* MFA ACTIVE (Successo) */}
              {mfaStep === "active" && (
                <div className="space-y-4 pt-2 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-bold">{t("dashboard.mfaSuccessTitle")}</p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-1">{t("dashboard.mfaSaveCodes")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/50 dark:bg-slate-950/50 p-3 rounded-2xl font-mono text-[10px] text-slate-700 dark:text-gray-300 text-center border border-slate-200/60 dark:border-white/5">
                    {mfaCodesList.map((code, idx) => (
                      <span key={idx}>{code}</span>
                    ))}
                  </div>
                  <Button
                    onClick={() => setMfaStep("idle")}
                    className="w-full py-4 rounded-xl font-bold bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 cursor-pointer"
                  >
                    {t("dashboard.mfaDone")}
                  </Button>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Box 4: Gestione Sessioni Dispositivi */}
          <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 transition-all">
            <Card.Content className="p-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("dashboard.deviceTitle")}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">{t("dashboard.deviceDesc")}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-gray-400">
                        {session.type === "desktop" ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{session.name}</h4>
                          {session.active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">{session.ip} • {session.loc}</p>
                      </div>
                    </div>
                    {!session.active && (
                      <Button
                        size="sm"
                        variant="danger-soft"
                        onClick={() => handleRevokeSession(session.id)}
                        className="font-bold text-[10px] cursor-pointer"
                      >
                        {t("dashboard.revokeSession")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
