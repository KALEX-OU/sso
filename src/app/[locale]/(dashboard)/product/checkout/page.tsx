"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../../layout";
import { RefreshCw } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { fetchAuthed } from "@/lib/firebase/client";

interface ProductCheckoutItem {
  checkoutId: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  app: string;
  status: string;
  createdAt?: string;
  route?: string;
}

export default function ProductCheckoutPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [checkouts, setCheckouts] = useState<ProductCheckoutItem[]>([]);

  const loadData = useCallback(async (showNotification = false) => {
    try {
      if (showNotification) {
        setLoading(true);
      }
      const res = await fetchAuthed("/api/product/checkout/list");
      if (res.status === 200) {
        const data = await res.json();
        setCheckouts(data?.items || []);
        if (showNotification) {
          showToast("Storico ordini hardware aggiornato con successo.", "success");
        }
      } else {
        showToast("Errore durante il recupero dei checkout prodotti.", "error");
      }
    } catch (err) {
      console.error("Errore fetch checkout prodotti:", err);
      showToast("Impossibile caricare lo storico ordini.", "error");
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

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "active":
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
            Spedito
          </Chip>
        );
      case "pending":
      case "trialing":
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 animate-pulse">
            Elaborazione
          </Chip>
        );
      default:
        return (
          <Chip variant="soft" className="font-black uppercase text-[9px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10">
            Annullato
          </Chip>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Prodotti Acquistati (Checkout)</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Storico degli acquisti una tantum di terminali, gateway o sensori industriali.</p>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Storico Ordini Hardware</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => loadData(true)}
            className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Aggiorna
          </Button>
        </div>

        <div className="p-6">
          {checkouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xs text-slate-400 font-semibold">Nessun acquisto hardware effettuato.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-white/5">
              {checkouts.map((checkout) => {
                const productName = checkout.productId === "70c3f4ff-828e-4cd0-81d5-db603b70576d" ? "Gateway IoT Pro" : `Hardware ID: ${checkout.productId.substring(0, 8)}`;
                const checkoutDate = checkout.createdAt ? new Date(checkout.createdAt) : new Date();
                return (
                  <div key={checkout.checkoutId} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{productName}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        Data: {checkoutDate.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })} • ID: {checkout.checkoutId.substring(0, 8)} • Route: {checkout.route || "checkout"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Gestito via Stripe
                      </span>
                      {getStatusChip(checkout.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
