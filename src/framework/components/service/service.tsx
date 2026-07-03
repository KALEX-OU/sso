import React, { useState, useEffect, useCallback } from "react";
import { Cloud, CheckCircle2, ArrowRight, Hammer, Layout, Navigation, Camera } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";

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
    case "etics":
      return Hammer;
    case "stand":
      return Layout;
    case "drone":
      return Navigation;
    case "photogrammetry":
      return Camera;
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
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Servizi Cloud KALEX</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Abilita e gestisci le applicazioni SaaS verticali e le API di integrazione in produzione per la tua organizzazione.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const status = service.subscriptionStatus;
            const isActive = status === "active" || status === "trialing";
            const isPastDue = status === "past_due";
            const IconComponent = getServiceIcon(service.serviceId);

            return (
              <div key={service.serviceId} className="flex flex-col justify-between border border-divider rounded-2xl bg-content1 shadow-md hover:shadow-lg transition-all p-5 h-full">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-2.5 bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-secondary dark:text-violet-400" />
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-xl px-2.5 py-0.5 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attivo
                    </span>
                  )}
                  {isPastDue && (
                    <span className="inline-flex items-center gap-1 bg-danger-500/10 text-danger-600 dark:text-danger-400 border border-danger-500/20 rounded-xl px-2.5 py-0.5 text-xs font-semibold">
                      Insoluto
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2 mb-4">
                  <h3 className="font-bold text-base text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {service.description || "Nessuna descrizione disponibile per questo servizio."}
                  </p>
                  <div className="mt-2 flex flex-col gap-0.5 border-t border-divider/40 pt-3">
                    <span className="font-extrabold text-sm text-foreground">
                      {service.priceText || "Prezzo a consumo"}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {service.priceModel || "Tariffazione basata sull'utilizzo effettivo."}
                    </span>
                  </div>
                </div>

                <div className="border-t border-divider/40 pt-4 flex items-center w-full">
                  {isActive ? (
                    <button disabled className="w-full py-2 bg-success-500/10 text-success-600 dark:text-success-400 font-extrabold uppercase text-xs rounded-xl border border-success-500/20 cursor-not-allowed">
                      Già Abilitato
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateService(service.serviceId)}
                      disabled={activatingService !== null}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-violet-500 to-accent text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
