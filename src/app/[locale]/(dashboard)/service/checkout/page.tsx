"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../layout";
import { RefreshCw } from "lucide-react";
import { Button, Chip } from "@heroui/react";

export default function ServiceCheckoutPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const mockCheckouts = [
    { id: "c1", serviceName: "Pacchetto Start-Up Setup", amount: 450.00, status: "completed", date: "2026-06-12T14:30:00Z", receipt: "#1092-AA" },
    { id: "c2", serviceName: "Integrazione API Custom B2B", amount: 1200.00, status: "completed", date: "2026-05-28T09:15:00Z", receipt: "#0981-CC" }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Checkout e Acquisti Servizi</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Consulta lo storico dei checkout dei moduli verticali una tantum acquistati dall&apos;organizzazione.</p>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Storico Ordini</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => showToast("Storico aggiornato.", "info")}
            className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Aggiorna
          </Button>
        </div>

        <div className="p-6">
          {mockCheckouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xs text-slate-400 font-semibold">Nessun acquisto singolo effettuato.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-white/5">
              {mockCheckouts.map((checkout) => (
                <div key={checkout.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{checkout.serviceName}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Data: {new Date(checkout.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })} • Ricevuta: {checkout.receipt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      € {checkout.amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    </span>
                    <Chip variant="soft" className="font-black uppercase text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                      Completato
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
