"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../lib/auth";
import { fetchAuthedClient } from "../../lib/api";
import { assignHttpUrl } from "../../lib/safe-url";
import { stripeConnectStatusSchema, stripeUrlResponseSchema } from "../../lib/schemas";
import { Button, Card, Badge, Skeleton, Spinner } from "../ui";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { ShieldAlert, CreditCard, ExternalLink, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface ConnectStatus {
  success: boolean;
  stripeConnectAccountId?: string | null;
  stripeConnectOnboarded: boolean;
  detailsSubmitted?: boolean;
  payoutsEnabled?: boolean;
  chargesEnabled?: boolean;
  currentlyDue?: string[];
  eventuallyDue?: string[];
}

export function StripeConnect() {
  const { claims, loading: authLoading } = useAuth();
  const brand = useBrand();
  const s = useUIStrings();
  // Ref sincronizzata via effect (regola react-hooks/refs: niente scritture di ref nel render):
  // le callback di fetch leggono sRef.current senza aggiungere `s` alle dipendenze.
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orgId = claims?.orgId;
  const role = claims?.uRole;
  const isOwner = role === "owner";

  useEffect(() => {
    if (authLoading || !orgId) return;

    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAuthedClient<ConnectStatus>("/api/stripe/connect/status", undefined, {
          validate: (raw): ConnectStatus => stripeConnectStatusSchema.parse(raw)
        });
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || sRef.current.dialogs.stripeConnect.errStatusFetch);
        }
        setStatus(res.data);
      } catch (err) {
        console.error("[StripeConnect] Fetch status error:", err);
        setError(err instanceof Error ? err.message : sRef.current.dialogs.stripeConnect.errStatusNetwork);
      } finally {
        setLoading(false);
      }
    };

    void fetchStatus();
  }, [authLoading, orgId]);

  const handleOnboard = async () => {
    if (!isOwner) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetchAuthedClient<{ success: boolean; url?: string }>("/api/stripe/connect/onboard", {
        method: "POST",
        headers: {
          "Idempotency-Key": `connect_onboard_${orgId || "unknown"}_${Date.now()}`
        }
      }, {
        validate: (raw) => stripeUrlResponseSchema.parse(raw)
      });
      if (res.success && res.data?.url) {
        assignHttpUrl(res.data.url);
      } else {
        throw new Error(res.error?.message || sRef.current.dialogs.stripeConnect.errOnboardLink);
      }
    } catch (err) {
      console.error("[StripeConnect] Onboarding error:", err);
      setError(err instanceof Error ? err.message : sRef.current.dialogs.stripeConnect.errStripeConnection);
      setActionLoading(false);
    }
  };

  const handleLoginLink = async () => {
    if (!isOwner) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetchAuthedClient<{ success: boolean; url?: string }>("/api/stripe/connect/login-link", {
        method: "POST"
      }, {
        validate: (raw) => stripeUrlResponseSchema.parse(raw)
      });
      if (res.success && res.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      } else {
        throw new Error(res.error?.message || sRef.current.dialogs.stripeConnect.errDashboardLink);
      }
    } catch (err) {
      console.error("[StripeConnect] Login link error:", err);
      setError(err instanceof Error ? err.message : sRef.current.dialogs.stripeConnect.errLinkGeneration);
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Stato di caricamento
  if (authLoading || loading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Card className="p-8 bg-surface-raised border border-slate-200 dark:border-white/5 space-y-6 rounded-3xl">
          <Skeleton className="h-8 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-20 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-12 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </Card>
      </div>
    );
  }

  // 2. Controllo RBAC: Solo l'owner può gestire Connect
  if (!isOwner) {
    return (
      <div className="w-full">
        <Card className="p-8 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border border-red-500/20 dark:border-red-500/10 rounded-3xl flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex-shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-400">{s.dialogs.stripeConnect.accessDeniedTitle}</h2>
            <p className="text-ink-muted text-sm leading-relaxed">
              {s.dialogs.stripeConnect.accessDeniedBody}
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-500 text-xs rounded-xl">
              {s.dialogs.stripeConnect.currentRoleLabel} <strong className="text-slate-700 dark:text-slate-300 capitalize">{role || s.dialogs.stripeConnect.roleFallback}</strong>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const isConfigured = !!status?.stripeConnectAccountId;
  const isOnboarded = !!status?.stripeConnectOnboarded;
  const currentlyDueList = status?.currentlyDue || [];
  const eventuallyDueList = status?.eventuallyDue || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          {s.dialogs.stripeConnect.pageTitle}
        </h1>
        <p className="text-ink-muted text-sm">
          {s.dialogs.stripeConnect.pageDesc}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STATO 1: Conto Connesso & Verificato */}
      {isConfigured && isOnboarded && (
        <Card className="p-8 bg-surface-raised backdrop-blur-md border border-line rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-success/10 border border-success/20 text-success rounded-2xl flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-ink">{s.dialogs.stripeConnect.activeTitle}</h3>
                  <Badge color="success" className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-success/20 bg-success/8 text-success">{s.dialogs.stripeConnect.activeBadge}</Badge>
                </div>
                <p className="text-ink-muted text-xs mt-1">
                  {s.dialogs.stripeConnect.accountIdLabel} <code className="font-mono text-secondary font-semibold">{status?.stripeConnectAccountId}</code>
                </p>
              </div>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleLoginLink}
              className="px-5 py-2.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-secondary/20"
            >
              {actionLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              {s.dialogs.stripeConnect.expressConsole}
            </Button>
          </div>

          <div className="border-t border-slate-200 dark:border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{s.dialogs.stripeConnect.chargesLabel}</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {status?.chargesEnabled ? s.dialogs.stripeConnect.chargesEnabled : s.dialogs.stripeConnect.chargesDisabled}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{s.dialogs.stripeConnect.payoutsLabel}</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {status?.payoutsEnabled ? s.dialogs.stripeConnect.payoutsEnabled : s.dialogs.stripeConnect.payoutsDisabled}
              </p>
            </div>
          </div>

          {/* Requisiti residui o futuri */}
          {eventuallyDueList.length > 0 && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-blue-400 text-xs">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold">{s.dialogs.stripeConnect.futureChecksTitle}</strong>
                <p className="text-ink-muted leading-relaxed">
                  {fmtUI(s.dialogs.stripeConnect.futureChecksBody, { list: eventuallyDueList.join(", ") })}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STATO 2: Conto Configurato ma Onboarding Pendente / KYC richiesto */}
      {isConfigured && !isOnboarded && (
        <Card className="p-8 bg-surface-raised backdrop-blur-md border border-line rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex-shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-ink">{s.dialogs.stripeConnect.incompleteTitle}</h3>
                  <Badge color="warning" className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-amber-500/20 bg-amber-500/8 text-amber-400">{s.dialogs.stripeConnect.kycBadge}</Badge>
                </div>
                <p className="text-ink-muted text-xs mt-1">
                  {s.dialogs.stripeConnect.accountIdLabel} <code className="font-mono text-amber-400 font-semibold">{status?.stripeConnectAccountId}</code>
                </p>
              </div>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleOnboard}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl hover:bg-amber-600 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-amber-500/10"
            >
              {actionLoading && <Spinner size="sm" color="current" />}
              {s.dialogs.stripeConnect.completeSetup}
            </Button>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{s.dialogs.stripeConnect.kycNotice}</span>
            </div>
            {currentlyDueList.length > 0 ? (
              <ul className="list-disc ps-5 text-ink-muted text-xs space-y-1.5">
                {currentlyDueList.map((req, i) => (
                  <li key={i} className="capitalize">{req.replace(/\./g, " ").replace(/_/g, " ")}</li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted text-xs">
                {s.dialogs.stripeConnect.kycFallback}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* STATO 3: Non Configurata (Nessun account Connect associato) */}
      {!isConfigured && (
        <Card className="p-8 bg-surface-raised backdrop-blur-md border border-line rounded-3xl space-y-6 shadow-2xl flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl flex-shrink-0">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-6 flex-grow">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-ink">{s.dialogs.stripeConnect.enableTitle}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                {fmtUI(s.dialogs.stripeConnect.enableBody, { brand: brand.name })}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-500 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                <span>{s.dialogs.stripeConnect.safeOnboardingTitle}</span>
              </div>
              <p className="leading-relaxed">
                {fmtUI(s.dialogs.stripeConnect.safeOnboardingBody, { brand: brand.name })}
              </p>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleOnboard}
              className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-secondary/20"
            >
              {actionLoading && <Spinner size="sm" color="current" />}
              {s.dialogs.stripeConnect.enableCta}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
