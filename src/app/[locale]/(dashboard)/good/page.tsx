"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout";
import { Package, Plus, Search, Filter } from "lucide-react";
import { Button, Chip } from "@heroui/react";

export default function GoodPage() {
  const { showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const mockGoods = [
    { id: "g1", name: "KALEX Gateway IoT v3", sku: "HW-GW-V3", status: "attivo", type: "gateway", location: "Sede Principale", serial: "SN-9821-A3" },
    { id: "g2", name: "Sensore Termico di Sicurezza", sku: "HW-TS-04", status: "attivo", type: "sensore", location: "Sede Esterna", serial: "SN-0491-B9" },
    { id: "g3", name: "Tag NFC Controllo Accessi", sku: "HW-NFC-88", status: "non_configurato", type: "nfc", location: "Magazzino", serial: "SN-8820-C1" }
  ];

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
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Merci e Hardware Fisico</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">Gestisci i dispositivi IoT, sensori ed hardware di sicurezza del tuo ecosistema.</p>
        </div>
        <Button
          onClick={() => showToast("Richiesta di nuovo hardware inoltrata all'amministratore.", "info")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shrink-0"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Richiedi Hardware
        </Button>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per nome, SKU o numero di serie..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"
          />
        </div>
        <Button variant="ghost" className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2.5 rounded-xl">
          <Filter className="w-4 h-4 inline mr-1" /> Filtra
        </Button>
      </div>

      {/* Grid delle merci */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockGoods.map((good) => (
          <div
            key={good.id}
            className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <Chip
                  variant="soft"
                  className={`font-black uppercase text-[9px] ${
                    good.status === "attivo"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {good.status === "attivo" ? "Attivo" : "Non Configurato"}
                </Chip>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{good.name}</h3>
              <p className="text-xs font-semibold text-slate-400 mb-4">SKU: {good.sku}</p>
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-400">Posizione:</span>
                <span className="text-slate-700 dark:text-slate-300">{good.location}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-400">S/N:</span>
                <span className="text-slate-700 dark:text-slate-300">{good.serial}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
