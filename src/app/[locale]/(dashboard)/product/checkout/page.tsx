"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../layout";
import { ShoppingBag, Box, Calendar } from "lucide-react";
import { Button, Chip } from "@heroui/react";

export default function ProductCheckoutPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  const mockOrders = [
    {
      id: "ord_1",
      productName: "Sensore IoT KALEX Multi-Protocol",
      quantity: 5,
      status: "completed",
      date: "2026-06-18T10:15:00Z",
      amount: "349.50",
      trackingCode: "TRK-98726354",
    },
    {
      id: "ord_2",
      productName: "Gateway Industriale Edge v2",
      quantity: 1,
      status: "completed",
      date: "2026-06-16T14:30:00Z",
      amount: "899.00",
      trackingCode: "TRK-10928374",
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
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
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Ordini Hardware</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Storico degli acquisti una tantum di terminali, sensori e dispositivi di sicurezza KALEX.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOrders.length === 0 ? (
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center col-span-2">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-2">Nessun ordine hardware</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">Acquista dispositivi o sensori IoT dal catalogo prodotti.</p>
          </div>
        ) : (
          mockOrders.map((order) => (
            <div
              key={order.id}
              className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{order.productName}</h3>
                  <Chip variant="soft" className="font-black uppercase text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    Spedito
                  </Chip>
                </div>
                <div className="space-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quantità: <strong className="text-slate-800 dark:text-white">{order.quantity} unità</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Data Ordine: <strong className="text-slate-800 dark:text-white">{new Date(order.date).toLocaleDateString("it-IT")}</strong></span>
                  </div>
                  {order.trackingCode && (
                    <div className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md inline-block font-mono mt-1 text-slate-600 dark:text-slate-300">
                      Tracking: {order.trackingCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Totale Pagato</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">€ {order.amount}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => showToast(`Dettaglio ordine ${order.id} non disponibile per la visualizzazione offline.`, "info")}
                  className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
                >
                  Fattura
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
