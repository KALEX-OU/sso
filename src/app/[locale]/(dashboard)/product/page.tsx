"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import { Card, Button, Chip } from "@heroui/react";
import { Package, ShoppingBag, Truck } from "lucide-react";

interface ProductCatalogItem {
  productId: string;
  name: string;
  description: string;
  sku: string;
  type: "hardware" | "accessory";
  price: number;
}

const PRODUCTS_CATALOG: ProductCatalogItem[] = [
  {
    productId: "gateway-pro",
    name: "KALEX IoT Gateway Pro",
    description: "Hub industriale per il controllo, la telemetria e la sincronizzazione locale dei sensori Thing con supporto Edge Computing, 4G LTE e Wi-Fi.",
    sku: "HW-GTW-PRO-01",
    type: "hardware",
    price: 249.00
  },
  {
    productId: "sensor-ambient",
    name: "Sensore Ambientale Smart",
    description: "Dispositivo IoT wireless a bassissimo consumo per il rilevamento di temperatura, umidità, pressione e qualità dell'aria (CO2/VOC).",
    sku: "HW-SNS-AMB-02",
    type: "hardware",
    price: 49.00
  },
  {
    productId: "badge-reader",
    name: "Smart Badge Reader",
    description: "Terminale NFC/RFID per il controllo accessi e il tracciamento presenze integrato nativamente con l'applicazione KALEX Safety.",
    sku: "HW-BDG-RDR-03",
    type: "hardware",
    price: 129.00
  },
  {
    productId: "antenna-lora",
    name: "Antenna RF Lungo Raggio",
    description: "Antenna omnidirezionale ad alto guadagno (+8dBi) per estendere la copertura wireless della rete locale LoRaWAN fino a 5km.",
    sku: "AC-ANT-LRA-04",
    type: "accessory",
    price: 35.00
  }
];

export default function ProductPage() {
  const { dbData, showToast } = useDashboard();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "gateway-pro": 1,
    "sensor-ambient": 5,
    "badge-reader": 1,
    "antenna-lora": 1
  });
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  const handleQuantityChange = (productId: string, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) return;
    setQuantities(prev => ({ ...prev, [productId]: num }));
  };

  const handlePurchase = (productId: string) => {
    if (!activeOrg) return;
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast("Solo l'Owner o gli Admin dell'organizzazione possono completare acquisti.", "error");
      return;
    }

    const qty = quantities[productId] || 1;
    const prod = PRODUCTS_CATALOG.find(p => p.productId === productId);
    if (!prod) return;

    setPurchasingId(productId);
    showToast(`Inizializzazione ordine per ${qty}x ${prod.name}...`, "info");

    // Simuliamo un pagamento asincrono tramite Stripe Checkout o acquisto diretto hardware
    setTimeout(() => {
      showToast(`Acquisto di ${qty}x ${prod.name} completato con successo! Riceverai i dettagli di spedizione e la fattura via email.`, "success");
      setPurchasingId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Prodotti Fisici & Accessori</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Acquista hardware certificato KALEX pre-configurato e pronto all&apos;uso da associare alla tua console.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTS_CATALOG.map((product) => {
          const qty = quantities[product.productId] || 1;
          const totalCost = product.price * qty;

          return (
            <Card
              key={product.productId}
              className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 group"
            >
              <Card.Content className="p-0 flex flex-col md:flex-row gap-6">
                {/* Icona/Immagine hardware */}
                <div className="w-full md:w-32 shrink-0 h-32 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-pink-500/10 flex flex-col items-center justify-center text-purple-500 border border-purple-500/10">
                  <Package className="w-12 h-12" />
                  <span className="text-[8px] font-mono text-slate-400 mt-2 font-bold select-all">{product.sku}</span>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                      <Chip
                        size="sm"
                        variant="soft"
                        className="font-bold text-[8px] uppercase text-slate-400"
                      >
                        {product.type === "hardware" ? "Dispositivo" : "Accessorio"}
                      </Chip>
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase mb-1">Prezzo unit.</span>
                        <span className="text-md font-black text-slate-900 dark:text-white">
                          €{product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-20">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase mb-1">Qtà</span>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                          className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-xl px-2 py-1 text-xs text-center font-bold text-slate-900 dark:text-white outline-none w-full transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase mb-0.5">Totale</span>
                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                          €{totalCost.toFixed(2)}
                        </span>
                      </div>

                      <Button
                        onClick={() => handlePurchase(product.productId)}
                        isDisabled={purchasingId !== null || activeRole !== "owner" && activeRole !== "admin"}
                        className="flex-1 sm:flex-none py-3 px-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 text-xs"
                      >
                        {purchasingId === product.productId ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-950"></span>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Acquista
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Info Spedizione / Garanzia */}
      <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
        <Card.Content className="p-2 flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-slate-500 dark:text-gray-400">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">Spedizione Espressa Gratuita & Garanzia KALEX 24 Mesi</p>
            <p className="mt-0.5">I dispositivi hardware vengono configurati in magazzino con i certificati crittografici della tua organizzazione e spediti entro 48 ore lavorative.</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
