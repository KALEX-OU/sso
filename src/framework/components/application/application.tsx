"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Cloud, CheckCircle2, ArrowRight, UserCheck } from "lucide-react";
import { Card, Button, Chip, Spinner } from "../ui";
import { useAuth } from "@/framework/lib/auth";
import { stripeUrlResponseSchema } from "@/framework/lib/schemas";
import {
  apiErrorMessage,
  apiEnvelopeSchema,
  productListResponseSchema,
  type ProductItem
} from "@/framework/lib/schemas/api";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { resolveLucideIcon } from "../../lib/lucide-icon";
import { assignHttpUrl } from "../../lib/safe-url";
import type { LucideIconName } from "@/framework/lib/resources.config";

interface ApplicationModuleProps {
  organizationId: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

// Risolve l'icona dell'app dal catalogo del brand attivo (fallback: Cloud)
const getAppIcon = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> =>
  resolveLucideIcon(iconName, Cloud);

export const ApplicationModule: React.FC<ApplicationModuleProps> = ({
  organizationId,
  fetchAuthed,
  showToast
}) => {
  const { claims } = useAuth();
  const brand = useBrand();
  const s = useUIStrings();
  // Ref alle stringhe correnti: le callback leggono sempre l'ultima lingua
  // senza aggiungere `s` alle dipendenze (il cambio lingua non ri-innesca i fetch).
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(() => Date.now());
  const [error, setError] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      // Carica l'elenco dei prodotti dal backend
      const res = await fetchAuthed(`/api/product/list?orgId=${organizationId}`);
      // Validazione Zod della risposta (E3.5): gli item derivano dallo schema, niente cast `as`.
      const parsed = productListResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ApplicationModule] Risposta /product/list non conforme allo schema:", parsed.error);
        setError(sRef.current.modules.application.errSchema);
        return;
      }
      const data = parsed.data;
      if (data.success) {
        // Mostriamo solo i prodotti commerciali del brand con mode === "service", isActive === true,
        // e venduti dall'organizzazione di sistema del brand attivo
        const filtered = (data.items ?? []).filter(
          (p) => p.mode === "service" && p.isActive === true && p.orgId === brand.sellerOrgId
        );
        setProducts(filtered);
      } else {
        setError(apiErrorMessage(data) ?? sRef.current.modules.application.errLoad);
      }
    } catch (err) {
      console.error("[ApplicationModule] Load Error:", err);
      setError(sRef.current.modules.application.errConnection);
    } finally {
      setLoading(false);
    }
  }, [organizationId, fetchAuthed, brand.sellerOrgId]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (organizationId && active) {
        await loadProducts();
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [organizationId, loadProducts]);

  const handleSubscribe = async (productId: string) => {
    const userRole = claims?.uRole;
    if (userRole !== "owner" && userRole !== "admin") {
      showToast(s.modules.application.onlyAdminsSubscribe, "error");
      return;
    }

    setActionLoading(productId);
    try {
      showToast(s.modules.application.checkoutStarting, "info");
      
      const res = await fetchAuthed("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      const parsed = stripeUrlResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ApplicationModule] Risposta checkout non conforme allo schema:", parsed.error);
        showToast(s.modules.application.errSchema, "error");
        setActionLoading(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        assignHttpUrl(data.url);
      } else {
        showToast(data.error?.message || s.modules.application.errCheckoutSession, "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast(s.modules.application.errPaymentSession, "error");
      setActionLoading(null);
    }
  };

  const handleManageBilling = async (productId: string) => {
    const userRole = claims?.uRole;
    if (userRole !== "owner" && userRole !== "admin") {
      showToast(s.modules.application.onlyAdminsBilling, "error");
      return;
    }

    setActionLoading(`billing_${productId}`);
    try {
      showToast(s.modules.application.redirectPortal, "info");
      const res = await fetchAuthed("/api/stripe/portal", { method: "POST" });
      const parsed = stripeUrlResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ApplicationModule] Risposta portale non conforme allo schema:", parsed.error);
        showToast(s.modules.application.errSchema, "error");
        setActionLoading(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        assignHttpUrl(data.url);
      } else {
        showToast(data.error?.message || s.modules.application.errBillingPortal, "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast(s.modules.application.errStripeConnection, "error");
      setActionLoading(null);
    }
  };

  const handleCompleteOnboarding = async (appId: string) => {
    setActionLoading(`onboarding_${appId}`);
    try {
      showToast(s.modules.application.onboardingSaving, "info");
      const res = await fetchAuthed("/api/auth/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({ appId })
      });
      // Validazione Zod dell'ack di onboarding (envelope standard success/error)
      const parsed = apiEnvelopeSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ApplicationModule] Risposta onboarding non conforme allo schema:", parsed.error);
        showToast(sRef.current.modules.application.errSchema, "error");
        setActionLoading(null);
        return;
      }
      const data = parsed.data;
      if (data.success) {
        showToast(s.modules.application.onboardingSuccess, "success");
        // Ricarica la pagina per ottenere i claim aggiornati
        window.location.reload();
      } else {
        showToast(apiErrorMessage(data) ?? s.modules.application.errOnboardingSave, "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast(s.modules.application.errOnboardingRegister, "error");
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-danger-500/20 bg-danger-500/10 rounded-2xl text-danger-600 dark:text-danger-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-ink">{fmtUI(s.modules.application.title, { brand: brand.name })}</h2>
        <p className="text-xs text-ink-muted mt-1">
          {s.modules.application.description}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-line rounded-2xl text-ink-muted text-sm">
          {s.modules.application.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const appId = brand.catalog.productIdToAppId[product.productId] || product.productId;
            const appConfig = claims?.rbac?.apps?.[appId];
            
            const isSubscribed = !!appConfig && appConfig.expire * 1000 > now;
            const isOnboarded = isSubscribed && appConfig.onboarded === true;
            
            const IconComponent = getAppIcon(brand.catalog.serviceIcons[appId]);
            const priceInfo = product.prices?.[0];
            // `amount` non è garantito dal payload: fallback al prezzo standard del catalogo
            const priceFormatted = typeof priceInfo?.amount === "number"
              ? fmtUI(s.modules.application.priceMonthly, { amount: priceInfo.amount })
              : s.modules.application.standardPrice;

            return (
              <Card
                key={product.productId}
                className="hover:shadow-lg dark:hover:shadow-white/5 transition-all duration-300"
              >
                <div className="flex flex-col h-full justify-between gap-5 p-5">
                  {/* Intestazione Card */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl flex items-center justify-center border border-secondary/15">
                      <IconComponent className="w-5 h-5 text-secondary dark:text-secondary" />
                    </div>
                    {isSubscribed ? (
                      <Chip
                        variant="soft"
                        color="success"
                        className="text-xs font-semibold font-sans animate-fade-in"
                      >
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
                          {s.modules.application.statusSubscribed}
                        </span>
                      </Chip>
                    ) : (
                      <Chip
                        variant="soft"
                        color="default"
                        className="text-xs font-semibold font-sans"
                      >
                        {s.modules.application.statusInactive}
                      </Chip>
                    )}
                  </div>

                  {/* Info Principali */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-bold text-base text-ink">{product.name}</h3>
                    <p className="text-xs text-ink-muted line-clamp-3">
                      {product.description || s.modules.application.noDescription}
                    </p>
                    
                    {/* Visualizzazione Prezzo o Dettagli Scadenza */}
                    <div className="mt-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-3 flex flex-col gap-1">
                      {isSubscribed ? (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{s.modules.application.expiryLabel}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {new Date(appConfig.expire * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{s.modules.application.modeLabel}</span>
                            <span className="font-extrabold uppercase text-[10px] text-secondary dark:text-secondary tracking-wider">
                              {appConfig.mode}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-ink">
                            {priceFormatted}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            {s.modules.application.autoRenewMonthly}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sezione Onboarding (Se abbonato) */}
                  {isSubscribed && (
                    <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-ink-muted flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-secondary" />
                          {s.modules.application.onboardingLabel}
                        </span>
                        {isOnboarded ? (
                          <Chip
                            variant="soft"
                            color="success"
                            size="sm"
                            className="text-[10px] font-bold uppercase font-sans"
                          >
                            {s.modules.application.onboardingDone}
                          </Chip>
                        ) : (
                          <Chip
                            variant="soft"
                            color="warning"
                            size="sm"
                            className="text-[10px] font-bold uppercase font-sans"
                          >
                            {s.modules.application.onboardingTodo}
                          </Chip>
                        )}
                      </div>
                      
                      {!isOnboarded && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs font-bold uppercase"
                          isLoading={actionLoading === `onboarding_${appId}`}
                          onClick={() => handleCompleteOnboarding(appId)}
                        >
                          {s.modules.application.completeOnboarding}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Pulsante Azione Principale (Abbonamento/Billing) */}
                  <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3 flex items-center w-full">
                    {isSubscribed ? (
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full font-bold uppercase text-xs hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        isLoading={actionLoading === `billing_${product.productId}`}
                        onClick={() => handleManageBilling(product.productId)}
                      >
                        {s.modules.application.manageSubscription}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-accent text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all"
                        isLoading={actionLoading === product.productId}
                        onClick={() => handleSubscribe(product.productId)}
                        icon={<ArrowRight className="w-4 h-4 text-slate-950 rtl:-scale-x-100" />}
                        iconPosition="end"
                      >
                        {s.modules.application.subscribeNow}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
