"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { fetchAuthed } from "@/lib/firebase/client";
import { Card, Chip, Button, Spinner } from "@heroui/react";
import { 
  Package, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Coins, 
  Activity, 
  Info,
  HelpCircle,
  ShoppingCart
} from "lucide-react";
import { useI18n } from "@/locales/client";

interface ProductPrice {
  priceId: string;
  productId: string;
  amount: number;
  currency: string;
  type: string;
  billingScheme: string | null;
  recurringInterval: string | null;
  recurringUsageType: string | null;
  tier: string;
  isActive: boolean;
  isTest: boolean;
}

interface ProductItem {
  productId: string;
  orgId: string;
  appId: string;
  name: string;
  description: string | null;
  mode: string;
  type: string; // Stripe Tax Code
  route: string | null;
  sku: string | null;
  isActive: boolean;
  isTest: boolean;
  taxBehavior: string | null;
  metadata: Record<string, unknown> | null;
  prices?: ProductPrice[];
}

export default function ProductCatalogPage() {
  const { dbData, showToast } = useDashboard();
  const t = useI18n();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"service" | "product">("service");

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const organizationId = activeOrg?.orgId;
  const activeRole = activeOrgRelation?.role;

  // Verifica permessi amministrativi
  const canManage = activeRole === "owner" || activeRole === "admin";

  const loadCatalogData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, priceRes] = await Promise.all([
        fetchAuthed("/api/product/list?limit=100"),
        fetchAuthed("/api/price/list?limit=100")
      ]);

      if (!prodRes.ok || !priceRes.ok) {
        throw new Error("Errore durante il recupero dei dati delle API");
      }

      const prodData = await prodRes.json();
      const priceData = await priceRes.json();

      if (prodData.success && priceData.success) {
        setProducts(prodData.items || []);
        setPrices(priceData.items || []);
      } else {
        throw new Error(prodData.error || priceData.error || "Errore sconosciuto");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore generico";
      console.error("[Product Catalog Page] Errore nel caricamento del catalogo:", msg);
      showToast("Impossibile caricare il catalogo prodotti.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadCatalogData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadCatalogData]);

  // Formatta la valuta
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currencyCode || "EUR"
    }).format(amount);
  };

  // Ottieni il nome tradotto del Stripe Tax Code
  const getTaxCodeLabel = (taxCode: string) => {
    const translationKey = `product.category.${taxCode}`;
    const translated = t(translationKey as Parameters<typeof t>[0]);
    return translated !== translationKey ? translated : taxCode;
  };

  // Filtra prodotti per l'ambiente corrente dell'organizzazione (isTest)
  const isTestOrg = activeOrg?.isTest || false;
  const filteredProducts = products.filter(p => p.isTest === isTestOrg && p.mode === activeTab);

  // Unisce i prezzi a ciascun prodotto
  const productsWithPrices = filteredProducts.map(product => {
    const productPrices = prices.filter(pr => pr.productId === product.productId && pr.isTest === isTestOrg);
    return {
      ...product,
      prices: productPrices
    };
  });

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner color="warning" size="lg" />
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold mt-3">
            Caricamento organizzazione attiva...
          </p>
        </div>
      </div>
    );
  }

  // Costruiamo i componenti JSX fuori dai blocchi try/catch per conformità alle regole React/Next.js
  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-500" />
            {t("sidebar.product")}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Gestisci ed esplora i servizi digitali SaaS e i moduli hardware disponibili per la tua organizzazione.
          </p>
        </div>
        
        {/* Chip indicatore ambiente */}
        <div>
          {isTestOrg ? (
            <Chip size="sm" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 rounded-lg">
              SANDBOX / TEST ENV
            </Chip>
          ) : (
            <Chip size="sm" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 rounded-lg">
              PRODUCTION ENV
            </Chip>
          )}
        </div>
      </div>

      {/* Tabs di Navigazione Custom Premium */}
      <div className="flex justify-start border-b border-slate-200 dark:border-white/10 pb-px">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("service")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "service" 
                ? "text-purple-600 dark:text-purple-400" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              {t("product.tab.services")}
            </div>
            {activeTab === "service" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full animate-fade-in" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("product")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "product" 
                ? "text-purple-600 dark:text-purple-400" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t("product.tab.hardware")}
            </div>
            {activeTab === "product" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full animate-fade-in" />
            )}
          </button>
        </div>
      </div>

      {/* Sezione Caricamento */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner color="warning" />
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 font-medium">Caricamento in corso...</p>
          </div>
        </div>
      ) : productsWithPrices.length === 0 ? (
        <Card className="border border-dashed border-slate-200 dark:border-white/10 bg-transparent rounded-3xl p-10 text-center">
          <Card.Content className="flex flex-col items-center gap-3">
            <div className="p-4 bg-slate-500/10 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Nessun articolo trovato</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Non sono presenti articoli in catalogo per questo tipo di modulo nell&apos;ambiente {isTestOrg ? "Sandbox" : "Produzione"}.
            </p>
          </Card.Content>
        </Card>
      ) : (
        /* Grid dei Prodotti */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {productsWithPrices.map(item => {
            // Raggruppa i prezzi per tier
            const personalPrice = item.prices?.find(p => p.tier === "personal");
            const businessPrice = item.prices?.find(p => p.tier === "business");
            const govPrice = item.prices?.find(p => p.tier === "government");
            const eduPrice = item.prices?.find(p => p.tier === "education");

            const isSubscription = item.route === "subscription";

            return (
              <Card 
                key={item.productId}
                className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between"
              >
                <Card.Content className="space-y-4">
                  {/* Intestazione Card */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest">
                        {getTaxCodeLabel(item.type)}
                      </span>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {item.name}
                      </h2>
                    </div>

                    {/* Badge della rotta commerciale */}
                    <div className="flex gap-2">
                      {item.sku && (
                        <Chip size="sm" className="bg-slate-500/15 text-slate-600 dark:text-slate-300 font-bold border border-slate-500/20 rounded-lg">
                          SKU: {item.sku}
                        </Chip>
                      )}
                      {item.route && (
                        <Chip size="sm" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20 rounded-lg">
                          {isSubscription ? "Abbonamento" : "Usa & Getta"}
                        </Chip>
                      )}
                    </div>
                  </div>

                  {/* Descrizione */}
                  <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed">
                    {item.description || "Nessuna descrizione fornita."}
                  </p>

                  {/* Listino Prezzi / Tier */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2.5">
                    <h4 className="text-[10px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Coins className="w-3.5 h-3.5 text-purple-400" />
                      {t("product.price.tier")}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {personalPrice && (
                        <div className="p-3 rounded-2xl bg-slate-500/5 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400">Personal / B2C</span>
                          <span className="text-sm font-black text-slate-800 dark:text-white mt-1">
                            {formatCurrency(personalPrice.amount, personalPrice.currency)}
                            <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 ml-1">
                              {personalPrice.type === "recurring" ? "/mese" : ""}
                            </span>
                          </span>
                        </div>
                      )}

                      {businessPrice && (
                        <div className="p-3 rounded-2xl bg-purple-500/5 dark:bg-purple-500/5 border border-purple-500/10 dark:border-purple-500/10 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 flex items-center gap-1">
                            Business / B2B
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                          <span className="text-sm font-black text-slate-800 dark:text-white mt-1">
                            {formatCurrency(businessPrice.amount, businessPrice.currency)}
                            <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 ml-1">
                              {businessPrice.type === "recurring" ? "/mese" : ""}
                            </span>
                          </span>
                        </div>
                      )}

                      {govPrice && (
                        <div className="p-3 rounded-2xl bg-slate-500/5 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400">Government / B2G</span>
                          <span className="text-sm font-black text-slate-800 dark:text-white mt-1">
                            {formatCurrency(govPrice.amount, govPrice.currency)}
                            <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 ml-1">
                              {govPrice.type === "recurring" ? "/mese" : ""}
                            </span>
                          </span>
                        </div>
                      )}

                      {eduPrice && (
                        <div className="p-3 rounded-2xl bg-slate-500/5 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400">Education / EDU</span>
                          <span className="text-sm font-black text-slate-800 dark:text-white mt-1">
                            {formatCurrency(eduPrice.amount, eduPrice.currency)}
                            <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 ml-1">
                              {eduPrice.type === "recurring" ? "/mese" : ""}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Content>

                {/* Pulsante d'azione */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                  {canManage ? (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-500/20 transition-all text-xs"
                      onClick={() => {
                        showToast(`Procedura avviata per ${item.name}.`, "info");
                      }}
                    >
                      <Activity className="w-4 h-4 mr-1.5" />
                      {activeTab === "service" ? t("product.action.subscribe") : t("product.action.buy")}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        isDisabled
                        className="w-full bg-slate-800/50 text-slate-500 dark:text-slate-600 font-extrabold rounded-2xl border border-slate-800 cursor-not-allowed text-xs"
                      >
                        <Lock className="w-3.5 h-3.5 mr-1.5" />
                        {activeTab === "service" ? t("product.action.subscribe") : t("product.action.buy")}
                      </Button>
                      <p className="text-[9px] text-slate-500 dark:text-slate-600 font-medium text-center flex items-center justify-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {t("product.action.disabled")}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Disclaimer Stripe Tax in fondo alla pagina */}
      <Card className="border border-slate-200 dark:border-white/10 bg-slate-500/5 dark:bg-slate-950/20 backdrop-blur-xl rounded-3xl p-5 shadow-xl">
        <Card.Content className="flex gap-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl h-fit">
            <Info className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Indicazione sulle Imposte (Stripe Tax)</h3>
            <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
              {t("product.taxDisclaimer")}
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
