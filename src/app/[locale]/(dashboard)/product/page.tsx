"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDashboard } from "../layout";
import { fetchAuthed } from "@/lib/firebase/client";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import { Card, CardContent, Chip, Button, Spinner } from "@/framework/components/ui";
import { 
  Package, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Activity, 
  Info,
  HelpCircle,
  ShoppingCart,
  Cpu,
  Wrench,
  Smartphone,
  Globe,
  FileText,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  Key,
  Radio
} from "lucide-react";
import { useI18n, useCurrentLocale } from "@/locales/client";

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
  const { dbData, showToast, hasPermission } = useDashboard();
  const t = useI18n();
  // Pattern tRef (regola i18n): le callback dei fetch leggono la traduzione dalla ref,
  // così il cambio lingua non ri-innesca i caricamenti.
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);
  const currentLocale = useCurrentLocale();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab attiva con combinazione mode + route
  const [activeFilter, setActiveFilter] = useState({ mode: "service", route: "subscription" });
  
  // Quantità per prodotto
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Stato loading del checkout per singolo prodotto
  const [checkoutLoading, setCheckoutLoading] = useState<Record<string, boolean>>({});

  // Contratto /api/auth/dashboard: { user, organization } (org attiva con role).
  const activeOrg = dbData?.organization;
  const organizationId = activeOrg?.orgId;
  const orgType = activeOrg?.type || "personal";

  // Abilitazione basata su permessi di creazione o aggiornamento
  const canManage = hasPermission("product", "create") || hasPermission("product", "update");

  // Definizione delle 4 tab per combinazione mode + route
  const tabs = useMemo(() => [
    { id: "saas_sub", labelKey: "product.tab.saasSub", defaultLabel: "Abbonamenti SaaS", mode: "service", route: "subscription", icon: Layers },
    { id: "digital_spot", labelKey: "product.tab.spotServices", defaultLabel: "Servizi Una-Tantum", mode: "service", route: "payment", icon: FileText },
    { id: "hw_sub", labelKey: "product.tab.hwSub", defaultLabel: "Noleggio Hardware", mode: "product", route: "subscription", icon: RefreshCw },
    { id: "hw_buy", labelKey: "product.tab.hwBuy", defaultLabel: "Acquisto Hardware", mode: "product", route: "payment", icon: ShoppingCart }
  ], []);

  // Risolve l'etichetta della tab con fallback resiliente
  const getTabLabel = (tab: typeof tabs[0]) => {
    const translated = t(tab.labelKey as Parameters<typeof t>[0]);
    return translated !== tab.labelKey ? translated : tab.defaultLabel;
  };

  // Carica i dati delle API Hono
  const loadCatalogData = useCallback(async () => {
    setLoading(true);
    try {
      const prodRes = await fetchAuthed("/api/product/list?limit=100");

      if (!prodRes.ok) {
        throw new Error("Errore durante il recupero dei dati delle API");
      }

      const prodData = await prodRes.json();

      if (prodData.success) {
        setProducts(prodData.items || []);
      } else {
        throw new Error(prodData.error?.message || "Errore sconosciuto");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore generico";
      console.error("[Product Catalog Page] Errore nel caricamento del catalogo:", msg);
      showToast(tRef.current("product.toastLoadErr"), "error");
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
    return new Intl.NumberFormat(currentLocale || "it-IT", {
      style: "currency",
      currency: currencyCode || "EUR"
    }).format(amount);
  };

  // Traduce il codice fiscale fiscale Stripe
  const getTaxCodeLabel = (taxCode: string) => {
    const translationKey = `product.category.${taxCode}`;
    const translated = t(translationKey as Parameters<typeof t>[0]);
    return translated !== translationKey ? translated : taxCode;
  };

  // Mappatura delle icone tematiche del prodotto in stile Google Cloud / Stripe Connect
  const getProductIconInfo = (appId: string, productId: string) => {
    const id = (appId || productId || "").toLowerCase();
    if (id.includes("safety")) return { icon: ShieldCheck, color: "text-success bg-success/10 border-success/20" };
    if (id.includes("standlo")) return { icon: Activity, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" };
    if (id.includes("sso")) return { icon: Key, color: "text-secondary bg-secondary/10 border-secondary/20" };
    if (id.includes("web")) return { icon: Globe, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    if (id.includes("mobile")) return { icon: Smartphone, color: "text-accent bg-accent/10 border-accent/20" };
    if (id.includes("audit")) return { icon: FileText, color: "text-warning bg-warning/10 border-warning/20" };
    if (id.includes("consulting")) return { icon: HelpCircle, color: "text-primary bg-primary/10 border-primary/20" };
    if (id.includes("esp32")) return { icon: Cpu, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
    if (id.includes("terminal")) return { icon: Smartphone, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" };
    if (id.includes("gateway")) return { icon: Wrench, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
    if (id.includes("badge") || id.includes("rfid")) return { icon: Radio, color: "text-secondary bg-secondary/10 border-secondary/20" };
    if (id.includes("alarm") || id.includes("siren")) return { icon: AlertTriangle, color: "text-red-500 bg-red-500/10 border-red-500/20" };
    return { icon: Package, color: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
  };

  // Avvio checkout Stripe
  const handleStartCheckout = async (priceId: string, quantity: number, productId: string) => {
    if (!priceId) return;
    setCheckoutLoading(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await fetchAuthed("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priceId,
          quantity,
          successUrl: `${window.location.origin}/${currentLocale}/payment?success=true`,
          cancelUrl: `${window.location.origin}/${currentLocale}/product?canceled=true`
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.url) {
        window.location.assign(data.url);
      } else {
        throw new Error(data.error?.message || t("product.errCheckoutInit"));
      }
    } catch (err) {
      console.error("[Stripe Checkout] Errore:", err);
      showToast(err instanceof Error ? err.message : t("product.toastCheckoutErr"), "error");
    } finally {
      setCheckoutLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // Filtra prodotti per l'ambiente corrente dell'organizzazione (isTest) e per combinazione tab attiva
  const isTestOrg = activeOrg?.isTest || false;
  const filteredProducts = products.filter(
    p => p.isTest === isTestOrg && p.mode === activeFilter.mode && p.route === activeFilter.route
  );

  // I prezzi, lotti e consumi sono già inclusi relazionalmente a livello di API
  const productsWithPrices = filteredProducts;

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner color="warning" size="lg" />
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold mt-3">
            {t("common.loadingOrg")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-secondary" />
            {t("sidebar.product")}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            {t("product.subtitle")}
          </p>
        </div>
        
        {/* Chip indicatore ambiente */}
        <div>
          {isTestOrg ? (
            <Chip size="sm" className="bg-warning/10 text-warning font-bold border border-warning/20 rounded-lg">
              SANDBOX / TEST ENV
            </Chip>
          ) : (
            <Chip size="sm" className="bg-success/10 text-success font-bold border border-success/20 rounded-lg">
              PRODUCTION ENV
            </Chip>
          )}
        </div>
      </div>

      {/* Tabs di Navigazione Combinate Premium */}
      <div className="flex justify-start border-b border-slate-200 dark:border-white/10 pb-px overflow-x-auto">
        <div className="flex gap-6 whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeFilter.mode === tab.mode && activeFilter.route === tab.route;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter({ mode: tab.mode, route: tab.route })}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
                  active 
                    ? "text-secondary" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {getTabLabel(tab)}
                {active && (
                  <span className="absolute bottom-0 start-0 end-0 h-0.5 bg-secondary rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sezione Caricamento o Contenuto */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner color="warning" />
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 font-medium">{t("common.loading")}</p>
          </div>
        </div>
      ) : productsWithPrices.length === 0 ? (
        <Card className="border border-dashed border-slate-200 dark:border-white/10 bg-transparent rounded-3xl p-5 text-center">
          <CardContent className="flex flex-col items-center gap-3">
            <div className="p-4 bg-slate-500/10 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{t("product.emptyTitle")}</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {t("product.emptyDesc", { env: isTestOrg ? t("product.envSandbox") : t("product.envProduction") })}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Griglia dei Prodotti Compatta a 3 Colonne */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {productsWithPrices.map(item => {
            // Mappa direttamente il prezzo corretto per il tier dell'organizzazione attiva
            const activePrice = item.prices?.find(p => p.tier === orgType) || item.prices?.[0];
            const isSubscription = item.route === "subscription";
            const qty = quantities[item.productId] || 1;
            const isCheckingOut = checkoutLoading[item.productId] || false;

            const iconInfo = getProductIconInfo(item.appId, item.productId);
            const ProductIcon = iconInfo.icon;

            return (
              <Card
                key={item.productId}
                className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-0 shadow-lg hover:border-secondary/20 transition-all duration-300"
              >
                {/* Layout flex spostato sul CardContent: il body del wrapper Card è un contenitore unico */}
                <CardContent className="p-0 flex flex-col justify-between min-h-[180px]">
                <div className="space-y-3">
                  {/* Intestazione Card */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 flex items-center justify-center rounded-xl border shrink-0 ${iconInfo.color}`}>
                        <ProductIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h2>
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-wider block mt-0.5">
                          {getTaxCodeLabel(item.type)}
                        </span>
                      </div>
                    </div>

                    {item.sku && (
                      <Chip size="sm" className="bg-slate-500/15 text-slate-600 dark:text-slate-300 font-bold border border-slate-500/10 rounded-lg text-[8px] uppercase tracking-wider px-1">
                        {item.sku}
                      </Chip>
                    )}
                  </div>

                  {/* Descrizione */}
                  <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {item.description || t("product.noDescription")}
                  </p>
                </div>

                {/* Footer ed Azione d'Acquisto */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                  {activePrice ? (
                    <div className="flex justify-between items-center gap-4">
                      {/* Prezzo Unitario dell'Organizzazione */}
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {t("product.price.tier")} ({orgType})
                        </span>
                        <span className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                          {formatCurrency(activePrice.amount, activePrice.currency)}
                          <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 ms-1">
                            {activePrice.type === "recurring" ? "/mese" : ""}
                          </span>
                        </span>
                      </div>

                      {/* Selettore Quantità */}
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5 p-1 shrink-0">
                        <Button
                          unstyled
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="rounded-lg h-6 w-6 min-w-6 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 p-0"
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs font-black px-1 text-slate-800 dark:text-white w-6 text-center select-none">
                          {qty}
                        </span>
                        <Button
                          unstyled
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="rounded-lg h-6 w-6 min-w-6 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 p-0"
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-red-500 font-bold p-1">{t("product.noPriceList")}</div>
                  )}

                  {/* Pulsante d'acquisto/sottoscrizione E2E Stripe */}
                  {canManage ? (
                    <Button
                      unstyled
                      isDisabled={!activePrice || isCheckingOut}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-extrabold rounded-xl shadow-md transition-all text-xs flex justify-between items-center px-3.5 py-4 h-10"
                      onClick={() => activePrice && void handleStartCheckout(activePrice.priceId, qty, item.productId)}
                    >
                      <div className="flex items-center gap-1.5">
                        {isCheckingOut ? (
                          <Spinner size="sm" color="current" />
                        ) : (
                          <Activity className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isCheckingOut
                            ? t("product.initializing")
                            : (isSubscription ? t("product.action.subscribe") : t("product.action.buy"))
                          }
                        </span>
                      </div>
                      {activePrice && !isCheckingOut && (
                        <span className="bg-slate-950/25 px-2 py-0.5 rounded-lg font-black tracking-wide">
                          {formatCurrency(activePrice.amount * qty, activePrice.currency)}
                        </span>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-1.5">
                      <Button
                        unstyled
                        isDisabled
                        className="w-full bg-slate-800/40 text-slate-500 dark:text-slate-600 font-extrabold rounded-xl border border-slate-800/20 cursor-not-allowed text-xs h-10"
                      >
                        <Lock className="w-3.5 h-3.5 me-1.5" />
                        {isSubscription ? t("product.action.subscribe") : t("product.action.buy")}
                      </Button>
                      <p className="text-[8px] text-slate-500 dark:text-slate-600 font-medium text-center flex items-center justify-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {t("product.action.disabled")}
                      </p>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Disclaimer Stripe Tax in fondo alla pagina */}
      <Card className="border border-slate-200 dark:border-white/10 bg-slate-500/5 dark:bg-slate-950/20 backdrop-blur-xl rounded-2xl p-0 shadow-md">
        <CardContent className="flex gap-3">
          <div className="p-2.5 bg-secondary/10 rounded-xl h-fit">
            <Info className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">{t("product.taxTitle")}</h3>
            <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
              {t("product.taxDisclaimer")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
