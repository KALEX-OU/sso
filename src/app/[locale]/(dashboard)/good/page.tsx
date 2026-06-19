"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { Package, Plus, Search, Filter, RefreshCw, ShoppingBag, Gauge } from "lucide-react";
import { Button, Chip, Tooltip } from "@heroui/react";
import { useI18n } from "@/locales/client";
import { fetchAuthed } from "@/lib/firebase/client";

interface GoodItem {
  goodId: string;
  name: string;
  description: string | null;
  sku: string;
  isActive: boolean | null;
  productId: string | null;
  purchasable: boolean | null;
  route: string | null;
}

export default function GoodPage() {
  const { showToast } = useDashboard();
  const t = useI18n();
  
  const [goods, setGoods] = useState<GoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRouteFilter, setActiveRouteFilter] = useState<string>("subscription");

  const loadGoods = useCallback(async () => {
    setLoading(true);
    try {
      // Chiamata globale per caricare tutti gli elementi del catalogo in un'unica volta
      const res = await fetchAuthed("/api/good/list?limit=100");
      if (res.status === 200) {
        const text = await res.text();
        const data = text ? JSON.parse(text) as { success: boolean; items?: GoodItem[] } : null;
        if (data?.success) {
          setGoods(data.items || []);
        } else {
          showToast(t("good.no_goods"), "error");
        }
      } else {
        showToast(t("good.no_goods"), "error");
      }
    } catch (err) {
      console.error("Errore durante il recupero dei prodotti hardware:", err);
      showToast(t("good.no_goods"), "error");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [showToast, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadGoods();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadGoods]);

  // Conteggi per i filtri delle route
  const subscriptionCount = goods.filter(g => g.route === "subscription").length;
  const checkoutCount = goods.filter(g => g.route === "checkout").length;
  const consumeCount = goods.filter(g => g.route === "consume").length;

  const filteredGoods = goods.filter(g => {
    const matchesRoute = g.route === activeRouteFilter;
    const matchesSearch = searchTerm === "" ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRoute && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Navigation Card Skeleton */}
        <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />

        {/* Filters Skeleton */}
        <div className="flex gap-3">
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
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
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">{t("good.title")}</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">{t("good.description")}</p>
        </div>
        <Button
          onClick={() => showToast("Richiesta di nuovo hardware inoltrata all'amministratore.", "info")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shrink-0 animate-pulse-slow"
        >
          <Plus className="w-4 h-4 inline mr-1" /> {t("good.request_btn")}
        </Button>
      </div>

      {/* Selettore Filtri Route Premium */}
      <div className="border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("good.nav_card_title")}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("good.nav_card_desc")}</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
          <Button
            onClick={() => setActiveRouteFilter("subscription")}
            className={`flex-1 md:flex-initial font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 ${
              activeRouteFilter === "subscription"
                ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            } border`}
          >
            <RefreshCw className={`w-3.5 h-3.5 inline mr-1.5 ${activeRouteFilter === "subscription" ? "animate-spin-slow" : ""}`} />
            {t("good.filter_subscription")} ({subscriptionCount})
          </Button>
          <Button
            onClick={() => setActiveRouteFilter("checkout")}
            className={`flex-1 md:flex-initial font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 ${
              activeRouteFilter === "checkout"
                ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            } border`}
          >
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1.5" />
            {t("good.filter_checkout")} ({checkoutCount})
          </Button>
          <Button
            onClick={() => setActiveRouteFilter("consume")}
            className={`flex-1 md:flex-initial font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-300 ${
              activeRouteFilter === "consume"
                ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            } border`}
          >
            <Gauge className="w-3.5 h-3.5 inline mr-1.5" />
            {t("good.filter_consume")} ({consumeCount})
          </Button>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("good.search_placeholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white transition-all duration-300"
          />
        </div>
        <Button variant="ghost" className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2.5 rounded-xl">
          <Filter className="w-4 h-4 inline mr-1" /> {t("good.filter_btn")}
        </Button>
      </div>

      {/* Grid delle merci */}
      {filteredGoods.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/10 rounded-3xl animate-fade-in">
          <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("good.no_goods")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGoods.map((good) => (
            <div
              key={good.goodId}
              className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 animate-fade-in"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Chip
                      variant="soft"
                      className={`font-black uppercase text-[9px] ${
                        good.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {good.isActive ? t("good.status_active") : t("good.status_inactive")}
                    </Chip>
                    {good.route && (
                      <Tooltip>
                        <Tooltip.Trigger>
                          <span>
                            <Chip
                              variant="soft"
                              className={`font-black uppercase text-[8px] border cursor-help ${
                                good.route === "subscription"
                                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                                  : good.route === "checkout"
                                  ? "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400"
                                  : "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400"
                              }`}
                            >
                              {good.route === "subscription" ? t("good.filter_subscription") :
                               good.route === "checkout" ? t("good.filter_checkout") :
                               t("good.filter_consume")}
                            </Chip>
                          </span>
                        </Tooltip.Trigger>
                        <Tooltip.Content placement="top" showArrow>
                          <span className="text-[10px] font-semibold px-1 py-0.5">
                            {good.route === "subscription" ? t("good.tooltip_subscription") :
                             good.route === "checkout" ? t("good.tooltip_checkout") :
                             t("good.tooltip_consume")}
                          </span>
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{good.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mb-2">{good.description || ""}</p>
                <p className="text-xs font-semibold text-slate-400 mb-4">{t("good.sku_label")}: {good.sku}</p>
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-700 dark:text-slate-300">{good.goodId}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">Tipo:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {good.purchasable ? t("good.purchasable_yes") : t("good.purchasable_no")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
