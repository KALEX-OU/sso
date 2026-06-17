import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Cpu, Cloud, CheckCircle2, ArrowRight } from "lucide-react";
import { BaseModuleLayout } from "../layout/BaseModuleLayout";
import styles from "./service.module.css";

interface ServiceItem {
  serviceId: string;
  name: string;
  description: string | null;
  type: "subscription" | "usage";
  priceModel: string | null;
  priceText: string | null;
  subscriptionStatus: "active" | "trialing" | "past_due" | "inactive";
  subscriptionTier: string | null;
}

interface ServiceModuleProps {
  organizationId: string;
  activeRole: string | undefined;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const getServiceIcon = (serviceId: string) => {
  switch (serviceId) {
    case "3c16260a-9d62-4b2a-89a1-8d2a58b68832":
    case "safety":
      return ShieldCheck;
    case "975e52be-df86-455b-9f6e-cd3bfd12f170":
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
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activatingService, setActivatingService] = useState<string | null>(null);
  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed(`/api/service/list?appId=sso&orgId=${organizationId}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.items || []);
      } else {
        const errMsg = data.error && typeof data.error === "object" && "message" in data.error
          ? String(data.error.message)
          : typeof data.error === "string"
            ? data.error
            : "Impossibile caricare i servizi.";
        setError(errMsg);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[ServiceModule] Load Error:", message);
      setError("Errore di connessione durante il recupero del catalogo dei servizi.");
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
      showToast("Solo l'Owner o gli Admin possono attivare i servizi.", "error");
      return;
    }

    setActivatingService(serviceId);
    try {
      showToast(`Reindirizzamento al checkout Stripe...`, "info");
      
      const res = await fetchAuthed("/api/stripe/checkout-session", {
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
        const errorMsg = data.error?.message || "Impossibile avviare il pagamento.";
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(`Errore durante l'attivazione del servizio: ${message}`, "error");
      setActivatingService(null);
    }
  };

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className={styles.serviceModule}>
        <div className={styles.header}>
          <h2 className={styles.title}>Servizi Cloud KALEX</h2>
          <p className={styles.description}>
            Abilita e gestisci le applicazioni SaaS verticali e le API di integrazione in produzione per la tua organizzazione.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service) => {
            const status = service.subscriptionStatus;
            const isActive = status === "active" || status === "trialing";
            const isPastDue = status === "past_due";
            const IconComponent = getServiceIcon(service.serviceId);

            return (
              <div key={service.serviceId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <IconComponent className={styles.icon} />
                  </div>
                  {isActive && (
                    <span className={styles.statusActiveBadge}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attivo
                    </span>
                  )}
                  {isPastDue && (
                    <span className={styles.statusPastDueBadge}>
                      Insoluto
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <p className={styles.serviceDescription}>
                    {service.description || "Nessuna descrizione disponibile per questo servizio."}
                  </p>
                  <div className={styles.pricing}>
                    <span className={styles.priceText}>
                      {service.priceText || "Prezzo a consumo"}
                    </span>
                    <span className={styles.priceModel}>
                      {service.priceModel || "Tariffazione basata sull'utilizzo effettivo."}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  {isActive ? (
                    <button disabled className={styles.btnActive}>
                      Già Abilitato
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateService(service.serviceId)}
                      disabled={activatingService !== null}
                      className={styles.btnActivate}
                    >
                      {activatingService === service.serviceId ? (
                        "Attivazione..."
                      ) : (
                        <>
                          Attiva Servizio
                          <ArrowRight className="w-4 h-4" />
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
