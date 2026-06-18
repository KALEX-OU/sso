import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Cpu, Cloud, CheckCircle2, ArrowRight } from "lucide-react";
import { BaseModuleLayout } from "../layout/BaseModuleLayout";
import { useI18n } from "@/locales/client";
import styles from "./service.module.css";

interface ApplicationItem {
  appId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  serviceId: string | null;
  purchasable: boolean;
  priceText: string | null;
  priceModel: string | null;
  subscriptionStatus: string;
  subscriptionTier: string | null;
}

interface ServiceModuleProps {
  organizationId: string;
  activeRole: string | undefined;
  organizationType?: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const getServiceIcon = (appId: string) => {
  switch (appId) {
    case "safety":
      return ShieldCheck;
    case "standlo":
      return Cpu;
    default:
      return Cloud;
  }
};

export const ServiceModule: React.FC<ServiceModuleProps> = ({
  organizationId,
  activeRole,
  organizationType,
  fetchAuthed,
  showToast
}) => {
  const t = useI18n();
  const [services, setServices] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activatingService, setActivatingService] = useState<string | null>(null);
  const [seatsMap, setSeatsMap] = useState<Record<string, number>>({});

  const handleSeatsChange = (appId: string, val: number) => {
    setSeatsMap(prev => ({
      ...prev,
      [appId]: Math.max(1, Math.min(100, val))
    }));
  };

  const getSeats = (appId: string) => {
    if (organizationType === "personal") {
      return 1;
    }
    return seatsMap[appId] || 1;
  };

  const renderTotalPrice = (priceText: string | null, seats: number) => {
    if (!priceText || seats <= 1) return null;
    const match = priceText.match(/(\d+)/);
    if (!match) return null;
    const unitPrice = parseInt(match[1]);
    const currencySymbol = priceText.replace(/[\d\s/a-zA-Z]/g, "") || "€";
    const period = priceText.includes("mese") ? "mese" : priceText.includes("anno") ? "anno" : "periodo";
    const total = unitPrice * seats;
    return `${t("application.total_price_text") || "Totale stimato:"} ${currencySymbol}${total} / ${period}`;
  };

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed("/api/application/list");
      const data = await res.json();
      if (data.success) {
        setServices(data.items || []);
      } else {
        const errMsg = data.error && typeof data.error === "object" && "message" in data.error
          ? String(data.error.message)
          : typeof data.error === "string"
            ? data.error
            : t("application.load_error");
        setError(errMsg);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[ServiceModule] Load Error:", message);
      setError(t("application.connection_error"));
    } finally {
      setLoading(false);
    }
  }, [fetchAuthed, t]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadServices();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadServices]);

  const handleActivateService = async (serviceId: string, seats: number) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast(t("application.only_owner_admin"), "error");
      return;
    }

    setActivatingService(serviceId);
    try {
      showToast(t("application.checkout_redirect"), "info");
      
      const res = await fetchAuthed("/api/stripe/subscription", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          seats
        })
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data.error?.message || t("application.payment_init_error");
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(`${t("application.activation_error")}: ${message}`, "error");
      setActivatingService(null);
    }
  };

  const handleResolvePayment = async () => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast(t("application.only_owner_admin"), "error");
      return;
    }

    setActivatingService("stripe_portal");
    try {
      showToast(t("application.portal_redirect"), "info");
      
      const res = await fetchAuthed("/api/stripe/subscription/portal", {
        method: "POST",
        body: JSON.stringify({
          returnUrl: window.location.href
        })
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data.error?.message || t("application.portal_init_error");
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(`${t("application.portal_error")}: ${message}`, "error");
      setActivatingService(null);
    }
  };

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className={styles.serviceModule}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("application.title")}</h2>
          <p className={styles.description}>
            {t("application.description")}
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((app) => {
            const isSubscribed = app.subscriptionStatus === "active" || app.subscriptionStatus === "trialing";
            const isPastDue = app.subscriptionStatus === "past_due";
            const activeTier = app.subscriptionTier;

            // Un servizio è attivo/abilitato se non è acquistabile (SSO, Web) o se c'è un abbonamento attivo o past_due (Grace Period)
            const isActive = !app.purchasable || isSubscribed || isPastDue;
            const IconComponent = getServiceIcon(app.appId);

            return (
              <div key={app.appId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <IconComponent className={styles.icon} />
                  </div>
                  <div className="flex gap-2 items-center">
                    {isPastDue ? (
                      <span className={styles.statusPastDueBadge}>
                        {t("application.past_due")}
                      </span>
                    ) : isActive ? (
                      <span className={styles.statusActiveBadge}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("application.active")}
                      </span>
                    ) : null}
                    {isActive && activeTier && (
                      <span className="bg-purple-100 dark:bg-purple-950/45 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-200 dark:border-purple-800/30">
                        {activeTier}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.serviceName}>{app.name}</h3>
                  <p className={styles.serviceDescription}>
                    {app.description || t("application.no_description")}
                  </p>
                  <div className={styles.pricing}>
                    <span className={styles.priceText}>
                      {app.priceText || t("application.price_included")}
                    </span>
                    <span className={styles.priceModel}>
                      {app.priceModel || t("application.base_plan_model")}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  {isPastDue ? (
                    <button
                      onClick={() => handleResolvePayment()}
                      disabled={activatingService !== null}
                      className={styles.btnPastDue}
                    >
                      {activatingService === "stripe_portal" ? (
                        t("application.loading")
                      ) : (
                        <>
                          {t("application.resolve_payment")}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : isActive ? (
                    <button disabled className={styles.btnActive}>
                      {t("application.already_enabled")}
                    </button>
                  ) : app.purchasable ? (
                    <div className="flex flex-col gap-4 w-full">
                      {organizationType === "personal" ? (
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 italic mb-1">
                          {t("application.personal_limit") || "Limite del piano Personal: max 1 licenza."}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                            {t("application.seats_label") || "Licenze:"}
                          </span>
                          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-900/50">
                            <button
                              type="button"
                              onClick={() => handleSeatsChange(app.appId, getSeats(app.appId) - 1)}
                              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={getSeats(app.appId)}
                              onChange={(e) => handleSeatsChange(app.appId, parseInt(e.target.value) || 1)}
                              className="w-10 text-center bg-transparent text-xs font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSeatsChange(app.appId, getSeats(app.appId) + 1)}
                              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {renderTotalPrice(app.priceText, getSeats(app.appId)) && (
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {renderTotalPrice(app.priceText, getSeats(app.appId))}
                        </div>
                      )}

                      <button
                        onClick={() => handleActivateService(app.serviceId!, getSeats(app.appId))}
                        disabled={activatingService !== null || !app.serviceId}
                        className={styles.btnActivate}
                      >
                        {activatingService === app.serviceId ? (
                          t("application.activating")
                        ) : (
                          <>
                            {t("application.activate")}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button disabled className={styles.btnActive}>
                      {t("application.base_plan")}
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
