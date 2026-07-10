import React, { useState, useEffect, useCallback, useRef } from "react";
import { Cloud, CheckCircle2, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import type { LucideIconName } from "../../lib/resources.config";
import {
  apiErrorMessage,
  serviceListResponseSchema,
  checkoutSessionResponseSchema,
  type ServiceItem
} from "../../lib/schemas/api";

interface ServiceModuleProps {
  organizationId: string;
  activeRole: string | undefined;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

// Risolve l'icona del servizio dal catalogo del brand attivo (fallback: Cloud)
const getServiceIcon = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> => {
  if (!iconName) return Cloud;
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return IconComponent || Cloud;
};

export const ServiceModule: React.FC<ServiceModuleProps> = ({
  organizationId,
  activeRole,
  fetchAuthed,
  showToast
}) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activatingService, setActivatingService] = useState<string | null>(null);
  const brand = useBrand();
  const s = useUIStrings();
  // Ref alle stringhe correnti: le callback leggono sempre l'ultima lingua
  // senza aggiungere `s` alle dipendenze (il cambio lingua non ri-innesca i fetch).
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed(`/api/service/list?appId=sso&orgId=${organizationId}`);
      // Validazione Zod della risposta (E3.5): payload malformato → log + errore i18n, mai dato corrotto.
      const parsed = serviceListResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ServiceModule] Risposta /service/list non conforme allo schema:", parsed.error);
        setError(sRef.current.modules.service.errLoad);
        return;
      }
      const data = parsed.data;
      if (data.success) {
        setServices(data.items ?? []);
      } else {
        setError(apiErrorMessage(data) ?? sRef.current.modules.service.errLoad);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[ServiceModule] Load Error:", message);
      setError(sRef.current.modules.service.errConnection);
    } finally {
      setLoading(false);
    }
  }, [organizationId, fetchAuthed]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadServices();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadServices]);

  const handleActivateService = async (serviceId: string) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast(s.modules.service.onlyAdminsActivate, "error");
      return;
    }

    setActivatingService(serviceId);
    try {
      showToast(s.modules.service.redirectCheckout, "info");
      
      const res = await fetchAuthed("/api/stripe/checkout-session", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          seats: 1
        })
      });

      // Validazione Zod della risposta di checkout (riusa lo schema Stripe condiviso)
      const parsed = checkoutSessionResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ServiceModule] Risposta checkout non conforme allo schema:", parsed.error);
        showToast(sRef.current.modules.service.errPayment, "error");
        setActivatingService(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data.error?.message || s.modules.service.errPayment;
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(fmtUI(s.modules.service.errActivation, { message }), "error");
      setActivatingService(null);
    }
  };

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">{fmtUI(s.modules.service.title, { brand: brand.name })}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {s.modules.service.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const status = service.subscriptionStatus;
            const isActive = status === "active" || status === "trialing";
            const isPastDue = status === "past_due";
            const IconComponent = getServiceIcon(brand.catalog.serviceIcons[service.serviceId]);

            return (
              <div key={service.serviceId} className="flex flex-col justify-between border border-divider rounded-2xl bg-content1 shadow-md hover:shadow-lg transition-all p-5 h-full">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-2.5 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-secondary dark:text-secondary" />
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-xl px-2.5 py-0.5 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {s.modules.service.statusActive}
                    </span>
                  )}
                  {isPastDue && (
                    <span className="inline-flex items-center gap-1 bg-danger-500/10 text-danger-600 dark:text-danger-400 border border-danger-500/20 rounded-xl px-2.5 py-0.5 text-xs font-semibold">
                      {s.modules.service.statusPastDue}
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2 mb-4">
                  <h3 className="font-bold text-base text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {service.description || s.modules.service.noDescription}
                  </p>
                  <div className="mt-2 flex flex-col gap-0.5 border-t border-divider/40 pt-3">
                    <span className="font-extrabold text-sm text-foreground">
                      {service.priceText || s.modules.service.usagePrice}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {service.priceModel || s.modules.service.usagePriceModel}
                    </span>
                  </div>
                </div>

                <div className="border-t border-divider/40 pt-4 flex items-center w-full">
                  {isActive ? (
                    <button disabled className="w-full py-2 bg-success-500/10 text-success-600 dark:text-success-400 font-extrabold uppercase text-xs rounded-xl border border-success-500/20 cursor-not-allowed">
                      {s.modules.service.alreadyEnabled}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateService(service.serviceId)}
                      disabled={activatingService !== null}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-secondary to-accent text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {activatingService === service.serviceId ? (
                        s.modules.service.activating
                      ) : (
                        <>
                          {s.modules.service.activateButton}
                          <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseModuleLayout>
  );
};
