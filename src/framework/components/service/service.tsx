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
  fetchAuthed,
  showToast
}) => {
  const t = useI18n();
  const [services, setServices] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activatingService, setActivatingService] = useState<string | null>(null);

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

  const handleActivateService = async (serviceId: string) => {
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
          seats: 1
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
                    <button
                      onClick={() => handleActivateService(app.serviceId!)}
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
