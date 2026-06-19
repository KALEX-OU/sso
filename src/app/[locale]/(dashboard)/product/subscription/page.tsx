"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../layout";
import { CreditCard } from "lucide-react";
import { Button, Chip } from "@heroui/react";

export default function ProductSubscriptionPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  const mockSubscriptions = [
    { id: "ps1", productName: "Canone Manutenzione Gateway IoT", quantity: 2, status: "trialing", periodStart: "2026-06-15T00:00:00Z", periodEnd: "2026-07-15T00:00:00Z", price: "24.90" }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1].map((n) => (
            <div key={n} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Abbonamenti Prodotti Hardware</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Canoni ricorrenti per la manutenzione, noleggio o firmware dell&apos;hardware di sicurezza.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSubscriptions.length === 0 ? (
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center col-span-2">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-2">Nessun abbonamento hardware</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">Configura un abbonamento per i tuoi dispositivi IoT e sensori industriali.</p>
          </div>
        ) : (
          mockSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sub.productName}</h3>
                  <Chip variant="soft" className="font-black uppercase text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    In Prova
                  </Chip>
                </div>
                <div className="space-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                  <div>Quantità: <strong className="text-slate-800 dark:text-white">{sub.quantity} unità</strong></div>
                  <div>Periodo corrente: <strong className="text-slate-800 dark:text-white">
                    {new Date(sub.periodStart).toLocaleDateString("it-IT")} - {new Date(sub.periodEnd).toLocaleDateString("it-IT")}
                  </strong></div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Canone Mensile</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">€ {sub.price} / mese</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => showToast("Richiesta supporto manutenzione hardware inviata.", "info")}
                  className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
                >
                  Gestisci
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
