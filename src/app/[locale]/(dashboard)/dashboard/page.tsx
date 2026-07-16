"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboard } from "../layout";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import { Card, CardContent, Chip } from "@/framework/components/ui";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { multiFactor } from "firebase/auth";
import {
  ShieldCheck,
  Laptop,
  Building2,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { DashboardView } from "@/framework/components/layouts/DashboardView";
import { fetchAuthedClient } from "@/framework/lib/api";
import { useUIStrings } from "@/framework/lib/ui.localization";
import { deviceSessionsResponseSchema, type DeviceSessionData } from "@/framework/lib/schemas/api";

interface SubscriptionItem {
  productId?: string | null;
  priceId?: string | null;
  seats?: number | null;
  quantity?: number | null;
  assignedSeats?: Array<{ uid: string; assignedAt: string }> | null;
}

interface SubscriptionData {
  subscriptionId: string;
  appId: string;
  status: string;
  items?: SubscriptionItem[] | null;
  expiresAt?: string | null;
}

export default function DashboardPage() {
  const t = useI18n();
  const s = useUIStrings();
  const currentLocale = useCurrentLocale();
  const { user, dbData } = useDashboard();

  // Stato MFA REALE: fattori iscritti sull'utente Firebase (stesso segnale di
  // SettingsMfa) — la gestione (enroll/unenroll TOTP, backup codes) vive nei settings.
  const mfaEnabled = user ? multiFactor(user).enrolledFactors.length > 0 : false;

  // Sessioni dispositivi REALI (/api/auth/sessions, come SettingsSecurity):
  // qui in sola lettura, la revoca vive nei settings.
  const [sessions, setSessions] = useState<DeviceSessionData[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const loadDeviceSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetchAuthedClient("/api/auth/sessions", { method: "GET" }, { validate: (raw) => deviceSessionsResponseSchema.parse(raw) });
      if (res.success && res.data && Array.isArray(res.data.sessions)) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.warn("[Dashboard] Impossibile caricare le sessioni attive:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Deferred per evitare setState sincrono nell'effect (cascading renders)
    void Promise.resolve().then(() => loadDeviceSessions());
  }, [loadDeviceSessions]);

  // Etichetta leggibile del device dallo user agent (best-effort, solo display —
  // stessa euristica di SettingsSecurity, che la tiene locale).
  const describeDevice = (userAgent: string): string => {
    const ua = userAgent.toLowerCase();
    const os = ua.includes("android") ? "Android"
      : (ua.includes("iphone") || ua.includes("ipad")) ? "iOS"
        : ua.includes("mac os") ? "macOS"
          : ua.includes("windows") ? "Windows"
            : ua.includes("linux") ? "Linux" : s.settings.deviceFallback;
    const browser = ua.includes("edg/") ? "Edge"
      : ua.includes("chrome/") ? "Chrome"
        : ua.includes("safari/") && !ua.includes("chrome/") ? "Safari"
          : ua.includes("firefox/") ? "Firefox" : s.settings.browserFallback;
    return `${browser} · ${os}`;
  };

  // Contratto /api/auth/dashboard: { user, organization } (org attiva con role).
  const activeOrg = dbData?.organization;
  // Conteggio piatto degli item di sottoscrizione (stessa logica della sezione sotto).
  const subsCount = ((activeOrg?.subscriptions as unknown as SubscriptionData[] | undefined) ?? [])
    .reduce((n, sub) => n + (Array.isArray(sub.items) ? sub.items.length : 0), 0);

  const settingsHref = `/${currentLocale}/settings`;

  return (
    <div className="animate-fade-in font-sans">
    {/* Vista dashboard (layouts/DashboardView): KPI in testa + sezioni come children */}
    <DashboardView
      stats={[
        {
          id: "org",
          label: t("dashboard.title"),
          value: activeOrg?.name || t("dashboard.noOrg"),
          hint: activeOrg?.confirmed ? t("dashboard.statusApproved") : t("dashboard.statusInReview"),
          tone: activeOrg?.confirmed ? "success" : "warning",
          icon: <Building2 className="w-5 h-5" />
        },
        {
          id: "subs",
          label: t("dashboard.suiteSubs"),
          value: String(subsCount),
          icon: <CreditCard className="w-5 h-5" />
        },
        {
          id: "mfa",
          label: t("dashboard.mfaTitle"),
          value: mfaEnabled ? t("dashboard.mfaActive") : t("dashboard.mfaInactive"),
          tone: mfaEnabled ? "success" : "warning",
          icon: <ShieldCheck className="w-5 h-5" />
        },
        {
          id: "devices",
          label: t("dashboard.deviceTitle"),
          value: sessionsLoading ? "—" : String(sessions.length),
          icon: <Laptop className="w-5 h-5" />
        }
      ]}
    >
      {/* 1. Anagrafica Organizzazione Info & Sottoscrizioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1">
          <CardContent className="p-2 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold block">
              {t("dashboard.title")}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeOrg?.name || t("dashboard.noOrg")}
            </h3>
            <div className="flex gap-2">
              <Chip size="sm" variant="soft" className="text-xs font-semibold">{t("dashboard.orgTypeLabel")}: {activeOrg?.type || "N/D"}</Chip>
              <Chip size="sm" color="success" variant="soft" className="text-xs font-semibold">{t("dashboard.orgStatusLabel")}: {activeOrg?.confirmed ? t("dashboard.statusApproved") : t("dashboard.statusInReview")}</Chip>
              {activeOrg?.viesValidated && (
                <Chip size="sm" color="success" variant="soft" className="text-xs font-semibold">{t("dashboard.viesValidated")}</Chip>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1">
          <CardContent className="p-2 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold block">
              {t("dashboard.suiteSubs")}
            </span>
            <div className="space-y-2">
              {activeOrg?.subscriptions && activeOrg.subscriptions.length > 0 ? (
                (activeOrg.subscriptions as unknown as SubscriptionData[]).flatMap((sub) => {
                  const itemsList = Array.isArray(sub.items) ? sub.items : [];
                  return itemsList.map((item) => ({
                    serviceId: item.productId || sub.appId,
                    status: sub.status,
                    tier: item.priceId || "default"
                  }));
                }).map((srvItem) => (
                  <div key={srvItem.serviceId} className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                    <span className="text-xs font-bold">{srvItem.serviceId}</span>
                    <Chip size="sm" color={srvItem.status === "active" ? "success" : "warning"} variant="soft">
                      {srvItem.status.toUpperCase()} ({srvItem.tier})
                    </Chip>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">{t("dashboard.noSubs")}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Sicurezza: stato MFA reale & sessioni dispositivi reali (gestione nei settings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1">
          <CardContent className="p-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white">{t("dashboard.mfaTitle")}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs">{t("dashboard.mfaDesc")}</p>
              </div>
            </div>

            {mfaEnabled ? (
              <div className="flex justify-between items-center gap-3 bg-success/10 p-3.5 rounded-2xl border border-success/40 dark:border-success/20">
                <div className="min-w-0">
                  <p className="text-success text-xs font-bold">{t("dashboard.mfaEnabled")}</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">{t("dashboard.mfaMethodConfigured")}</p>
                </div>
                <Link href={settingsHref} className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                  {t("dashboard.manageInSettings")}
                  <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
                </Link>
              </div>
            ) : (
              <Link
                href={settingsHref}
                className="w-full font-bold text-xs bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white py-3.5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                {t("dashboard.mfaSetupBtn")}
                <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1">
          <CardContent className="p-2 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-slate-900 dark:text-white">{t("dashboard.deviceTitle")}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs">{t("dashboard.deviceDesc")}</p>
                </div>
              </div>
              <Link href={settingsHref} className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                {t("dashboard.manageInSettings")}
                <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
              </Link>
            </div>

            {sessionsLoading && sessions.length === 0 ? (
              <div className="space-y-2">
                <div className="h-12 w-full rounded-2xl klx-skeleton" />
                <div className="h-12 w-full rounded-2xl klx-skeleton" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t("settings.sessions.empty")}</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center gap-3 bg-slate-100/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold flex items-center gap-2">
                        {describeDevice(session.userAgent)}
                        {session.current && (
                          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full">
                            {t("settings.sessions.thisDevice")}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {t("settings.sessions.ipLine", { ip: session.ip, when: session.lastSeenAt ? new Date(session.lastSeenAt).toLocaleString() : "—" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardView>
    </div>
  );
}
