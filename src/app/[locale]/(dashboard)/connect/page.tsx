"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout";
import { CheckCircle, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Button, Card, Chip } from "@heroui/react";

export default function StripeConnectPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Stripe Connect Integration</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Configura la tua organizzazione per ricevere ed emettere pagamenti split nel partner network di KALEX.</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => showToast("Sincronizzazione in corso...", "info")}
          className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Sincronizza
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Stato Account</span>
              <Chip variant="soft" color="success" size="sm" className="font-black text-[9px] uppercase">Connesso</Chip>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Custom Connect</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">acct_1OpK49Lsd90KjA</p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-4">
            <CheckCircle className="w-4 h-4" /> Bonifici Attivi
          </div>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Volume Split (Mese)</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">€ 12.450,00</span>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-4">
            Commissioni KALEX trattenute: <strong>1.5%</strong>
          </div>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Tasse e KYC</span>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Verificato al 100%</span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => showToast("Apertura portale Stripe Express...", "info")}
            className="w-full font-black text-xs rounded-xl mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center gap-1"
          >
            Modifica Dati <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Card>
      </div>

      <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl p-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Documentazione e Integrazione</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">KALEX utilizza Stripe Connect per instradare i flussi di pagamento. Assicurati che il tuo conto bancario business sia costantemente aggiornato sul portale Stripe.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rapporto Fiscale 2026</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Disponibile per il download. Include il resoconto IVA intracomunitaria.</p>
            <Button size="sm" onClick={() => showToast("Download avviato.", "success")} className="text-xs font-bold mt-3 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">Scarica Report PDF</Button>
          </div>
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Configurazione webhook</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Stato endpoint webhook KALEX per eventi Stripe Connect.</p>
            <Chip size="sm" variant="soft" color="success" className="font-bold text-[9px] mt-3 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">Webhook Attivo</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}
