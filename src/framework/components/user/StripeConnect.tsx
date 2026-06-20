"use client";

import React, { useEffect, useState } from "react";
import { useKalexAuth } from "../../lib/auth";
import { fetchAuthedClient } from "../../lib/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { Spinner } from "../ui/Spinner";
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
  const { claims, loading: authLoading } = useKalexAuth();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orgId = claims?.orgId;
  const role = claims?.role;
  const isOwner = role === "owner";

  useEffect(() => {
    if (authLoading || !orgId) return;

    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAuthedClient<ConnectStatus>("/api/stripe/connect/status");
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Errore durante il recupero dello stato dell'account.");
        }
        setStatus(res.data);
      } catch (err) {
        console.error("[StripeConnect] Fetch status error:", err);
        setError(err instanceof Error ? err.message : "Errore di rete durante la verifica dello stato.");
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
      });
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error(res.error?.message || "Impossibile generare il link di onboarding.");
      }
    } catch (err) {
      console.error("[StripeConnect] Onboarding error:", err);
      setError(err instanceof Error ? err.message : "Errore di connessione a Stripe.");
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
      });
      if (res.success && res.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      } else {
        throw new Error(res.error?.message || "Impossibile generare il link per la dashboard.");
      }
    } catch (err) {
      console.error("[StripeConnect] Login link error:", err);
      setError(err instanceof Error ? err.message : "Errore durante la generazione del link.");
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Stato di caricamento
  if (authLoading || loading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-2/3 rounded-xl bg-slate-800" />
        <Card className="p-8 bg-slate-900/40 border border-white/5 space-y-6 rounded-3xl">
          <Skeleton className="h-8 w-1/3 rounded-lg bg-slate-800" />
          <Skeleton className="h-20 w-full rounded-2xl bg-slate-800" />
          <Skeleton className="h-12 w-48 rounded-xl bg-slate-800" />
        </Card>
      </div>
    );
  }

  // 2. Controllo RBAC: Solo l'owner può gestire Connect
  if (!isOwner) {
    return (
      <div className="w-full">
        <Card className="p-8 bg-slate-950/40 backdrop-blur-md border border-red-500/10 rounded-3xl flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex-shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-400">Accesso Limitato</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Solo il proprietario dell&apos;organizzazione (**owner**) possiede le autorizzazioni necessarie per configurare i conti bancari, attivare Stripe Connect o gestire le impostazioni di incasso e payout per i partner.
            </p>
            <div className="p-4 bg-slate-900/40 border border-white/5 text-slate-500 text-xs rounded-xl">
              Il tuo ruolo attuale: <strong className="text-slate-300 capitalize">{role || "Membro"}</strong>
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
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Configurazione Stripe Connect
        </h1>
        <p className="text-slate-400 text-sm">
          Abilita la ricezione dei pagamenti e gestisci il split-billing per i progetti in cui collabori come organizzazione partner.
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
        <Card className="p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Stripe Connect Attivo</h3>
                  <Badge color="success" className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-emerald-500/20 bg-emerald-500/8 text-emerald-400">Attivo</Badge>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  ID Account: <code className="font-mono text-purple-400 font-semibold">{status?.stripeConnectAccountId}</code>
                </p>
              </div>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleLoginLink}
              className="px-5 py-2.5 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-purple-500/20"
            >
              {actionLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Console Express Stripe
            </Button>
          </div>

          <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Ricezione Pagamenti</span>
              <p className="text-sm font-bold text-slate-200">
                {status?.chargesEnabled ? "Abilitata - Puoi incassare split-billing" : "Sospesa o limitata"}
              </p>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Invio Bonifici (Payout)</span>
              <p className="text-sm font-bold text-slate-200">
                {status?.payoutsEnabled ? "Abilitato - Bonifici automatici attivi" : "Sospeso o in verifica"}
              </p>
            </div>
          </div>

          {/* Requisiti residui o futuri */}
          {eventuallyDueList.length > 0 && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-blue-400 text-xs">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold">Verifiche future previste:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Stripe potrebbe richiedere ulteriori informazioni in futuro qualora superassi determinate soglie di incasso (es. {eventuallyDueList.join(", ")}).
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STATO 2: Conto Configurato ma Onboarding Pendente / KYC richiesto */}
      {isConfigured && !isOnboarded && (
        <Card className="p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex-shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Configurazione Incompleta</h3>
                  <Badge color="warning" className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-amber-500/20 bg-amber-500/8 text-amber-400">KYC Richiesto</Badge>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  ID Account: <code className="font-mono text-amber-400 font-semibold">{status?.stripeConnectAccountId}</code>
                </p>
              </div>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleOnboard}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl hover:bg-amber-600 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-amber-500/10"
            >
              {actionLoading && <Spinner size="sm" color="current" />}
              Completa Configurazione
            </Button>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Stripe richiede ulteriori informazioni di identificazione (KYC) per attivare i payout:</span>
            </div>
            {currentlyDueList.length > 0 ? (
              <ul className="list-disc pl-5 text-slate-400 text-xs space-y-1.5">
                {currentlyDueList.map((req, i) => (
                  <li key={i} className="capitalize">{req.replace(/\./g, " ").replace(/_/g, " ")}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-xs">
                Completa i passaggi richiesti sul portale di Stripe Connect per poter abilitare i pagamenti.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* STATO 3: Non Configurata (Nessun account Connect associato) */}
      {!isConfigured && (
        <Card className="p-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl space-y-6 shadow-2xl flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex-shrink-0">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-6 flex-grow">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Abilita Stripe Connect per la tua Organizzazione</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connetti in sicurezza un conto corrente o carta di debito bancaria tramite Stripe Connect Express. Abilitando Connect, la tua organizzazione potrà vendere beni hardware, offrire licenze o configurare flussi di fatturazione ricorrente split-billing con altre organizzazioni partner all&apos;interno del network KALEX.
              </p>
            </div>

            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-slate-500 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Onboarding Semplice & Sicuro:</span>
              </div>
              <p className="leading-relaxed">
                Stripe Express gestisce direttamente i requisiti antiriciclaggio e fiscali (KYC). KALEX non memorizza in alcun modo i tuoi estremi bancari. La commissione sulla piattaforma per le transazioni split Connect è fissata all&apos;1%.
              </p>
            </div>

            <Button
              isDisabled={actionLoading}
              onClick={handleOnboard}
              className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-sm shadow-lg shadow-purple-500/20"
            >
              {actionLoading && <Spinner size="sm" color="current" />}
              Attiva Stripe Connect
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
