"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../../layout";
import { CreditCard } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { fetchAuthed } from "@/lib/firebase/client";

interface ProductSubscriptionItem {
  productSubscriptionId: string;
  productId: string;
  buyerId: string;
  status: string;
  quantity?: number;
  seats?: number;
  products?: { productId: string; quantity: number }[];
  expiresAt?: string;
  createdAt?: string;
  route?: string;
}

export default function ProductSubscriptionPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<ProductSubscriptionItem[]>([]);

  const loadData = useCallback(async (showNotification = false) => {
    try {
      if (showNotification) {
        setLoading(true);
      }
      const res = await fetchAuthed("/api/product/subscription/list");
      if (res.status === 200) {
        const data = await res.json();
        setSubscriptions(data?.items || []);
        if (showNotification) {
          showToast("Abbonamenti hardware aggiornati con successo.", "success");
        }
      } else {
        showToast("Errore durante il recupero degli abbonamenti.", "error");
      }
    } catch (err) {
      console.error("Errore fetch abbonamenti prodotti:", err);
      showToast("Impossibile caricare gli abbonamenti hardware.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadData();
    });
  }, [loadData]);

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

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "trialing":
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
            {status.toLowerCase() === "trialing" ? "In Prova" : "Attivo"}
          </Chip>
        );
      case "past_due":
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10">
            In ritardo
          </Chip>
        );
      default:
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/10">
            Disattivo
          </Chip>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Prodotti Sottoscritti (Abbonamenti)</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Canoni ricorrenti per la manutenzione, noleggio o firmware dell&apos;hardware di sicurezza.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.length === 0 ? (
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center col-span-2 shadow-xl">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-2">Nessun abbonamento hardware</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">Configura un abbonamento per i tuoi dispositivi IoT e sensori industriali.</p>
          </div>
        ) : (
          subscriptions.map((sub) => {
            const productName = sub.productId === "70c3f4ff-828e-4cd0-81d5-db603b70576d" ? "Gateway IoT Pro" : `Abbonamento Hardware ID: ${sub.productSubscriptionId.substring(0, 8)}`;
            const qty = sub.quantity || sub.seats || 1;
            const expiresDate = sub.expiresAt ? new Date(sub.expiresAt) : null;
            return (
              <div
                key={sub.productSubscriptionId}
                className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{productName}</h3>
                    {getStatusChip(sub.status)}
                  </div>
                  <div className="space-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                    <div>Quantità: <strong className="text-slate-800 dark:text-white">{qty} unità</strong></div>
                    {expiresDate && (
                      <div>Scadenza: <strong className="text-slate-800 dark:text-white">
                        {expiresDate.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </strong></div>
                    )}
                    <div>Route: <strong className="text-slate-800 dark:text-white">{sub.route || "subscription"}</strong></div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Fatturazione Ricorrente</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">Gestita via Stripe</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showToast("Supporto tecnico per l'abbonamento hardware notificato.", "info")}
                    className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
                  >
                    Gestisci
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
