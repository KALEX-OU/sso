"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Cloud, CheckCircle2, ArrowRight, Hammer, Layout, Navigation, Camera, UserCheck } from "lucide-react";
import { Card, Button, Chip, Spinner } from "../ui";
import { useAuth } from "@/framework/lib/auth";
import { stripeUrlResponseSchema } from "@/framework/lib/schemas";

interface ProductItem {
  productId: string;
  name: string;
  description: string | null;
  mode: "service" | "addon";
  isActive: boolean;
  orgId: string;
  prices?: Array<{
    priceId: string;
    amount: number;
    currency: string;
    interval: "month" | "year";
  }>;
}

interface ApplicationModuleProps {
  organizationId: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const getAppIcon = (appId: string) => {
  switch (appId) {
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

const PRODUCT_ID_TO_APP_ID: Record<string, string> = {
  "prod_etics": "etics",
  "prod_stand": "stand",
  "prod_drone": "drone",
  "prod_photogrammetry": "photogrammetry"
};

export const ApplicationModule: React.FC<ApplicationModuleProps> = ({
  organizationId,
  fetchAuthed,
  showToast
}) => {
  const { claims } = useAuth();
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
      const data = await res.json();
      if (data.success) {
        // Mostriamo solo i prodotti commerciali KALEX con mode === "service", isActive === true, e venduti da KALEX_SYSTEM_ORG
        const items = (data.items || []) as ProductItem[];
        const filtered = items.filter(
          (p) => p.mode === "service" && p.isActive === true && p.orgId === "KALEX_SYSTEM_ORG"
        );
        setProducts(filtered);
      } else {
        setError(data.error?.message || "Impossibile caricare i servizi.");
      }
    } catch (err) {
      console.error("[ApplicationModule] Load Error:", err);
      setError("Errore di connessione durante il recupero delle applicazioni.");
    } finally {
      setLoading(false);
    }
  }, [organizationId, fetchAuthed]);

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
      showToast("Solo l'Owner o gli Admin possono abbonare l'organizzazione ai servizi.", "error");
      return;
    }

    setActionLoading(productId);
    try {
      showToast(`Avvio del checkout...`, "info");
      
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
        showToast("Risposta del server non conforme allo schema atteso.", "error");
        setActionLoading(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        showToast(data.error?.message || "Impossibile avviare la sessione di checkout Stripe.", "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast("Errore durante la creazione della sessione di pagamento.", "error");
      setActionLoading(null);
    }
  };

  const handleManageBilling = async (productId: string) => {
    const userRole = claims?.uRole;
    if (userRole !== "owner" && userRole !== "admin") {
      showToast("Solo l'Owner o gli Admin possono gestire la fatturazione.", "error");
      return;
    }

    setActionLoading(`billing_${productId}`);
    try {
      showToast("Reindirizzamento al portale Stripe...", "info");
      const res = await fetchAuthed("/api/stripe/portal", { method: "POST" });
      const parsed = stripeUrlResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ApplicationModule] Risposta portale non conforme allo schema:", parsed.error);
        showToast("Risposta del server non conforme allo schema atteso.", "error");
        setActionLoading(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        showToast(data.error?.message || "Impossibile avviare il portale di fatturazione.", "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast("Errore di connessione con Stripe.", "error");
      setActionLoading(null);
    }
  };

  const handleCompleteOnboarding = async (appId: string) => {
    setActionLoading(`onboarding_${appId}`);
    try {
      showToast("Registrazione dell'onboarding in corso...", "info");
      const res = await fetchAuthed("/api/auth/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({ appId })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Onboarding completato con successo!", "success");
        // Ricarica la pagina per ottenere i claim aggiornati
        window.location.reload();
      } else {
        showToast(data.error?.message || "Errore nel salvataggio dell'onboarding.", "error");
        setActionLoading(null);
      }
    } catch (err) {
      console.error(err);
      showToast("Impossibile registrare l'onboarding.", "error");
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
        <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Applicazioni Cloud KALEX</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gestisci gli abbonamenti SaaS ed avvia l&apos;onboarding per le piattaforme verticali della tua organizzazione.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 dark:text-slate-400 text-sm">
          Nessuna applicazione disponibile nel catalogo di sistema.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const appId = PRODUCT_ID_TO_APP_ID[product.productId] || product.productId;
            const appConfig = claims?.rbac?.apps?.[appId];
            
            const isSubscribed = !!appConfig && appConfig.expire * 1000 > now;
            const isOnboarded = isSubscribed && appConfig.onboarded === true;
            
            const IconComponent = getAppIcon(appId);
            const priceInfo = product.prices?.[0];
            const priceFormatted = priceInfo ? `${priceInfo.amount} € / mese` : "Prezzo standard";

            return (
              <Card
                key={product.productId}
                className="hover:shadow-lg dark:hover:shadow-white/5 transition-all duration-300"
              >
                <div className="flex flex-col h-full justify-between gap-5 p-5">
                  {/* Intestazione Card */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-violet-500/10 to-accent/10 rounded-xl flex items-center justify-center border border-violet-500/15">
                      <IconComponent className="w-5 h-5 text-secondary dark:text-violet-400" />
                    </div>
                    {isSubscribed ? (
                      <Chip
                        variant="soft"
                        color="success"
                        className="text-xs font-semibold font-sans animate-fade-in"
                      >
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
                          Abbonato
                        </span>
                      </Chip>
                    ) : (
                      <Chip
                        variant="soft"
                        color="default"
                        className="text-xs font-semibold font-sans"
                      >
                        Non Attivo
                      </Chip>
                    )}
                  </div>

                  {/* Info Principali */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-bold text-base text-slate-800 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                      {product.description || "Applicazione verticale integrata per la gestione cloud enterprise."}
                    </p>
                    
                    {/* Visualizzazione Prezzo o Dettagli Scadenza */}
                    <div className="mt-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-3 flex flex-col gap-1">
                      {isSubscribed ? (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Scadenza:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {new Date(appConfig.expire * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Modalità:</span>
                            <span className="font-extrabold uppercase text-[10px] text-secondary dark:text-violet-400 tracking-wider">
                              {appConfig.mode}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-white">
                            {priceFormatted}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Rinnovo automatico mensile
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sezione Onboarding (Se abbonato) */}
                  {isSubscribed && (
                    <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-violet-500" />
                          Onboarding Utente:
                        </span>
                        {isOnboarded ? (
                          <Chip
                            variant="soft"
                            color="success"
                            size="sm"
                            className="text-[10px] font-bold uppercase font-sans"
                          >
                            Completato
                          </Chip>
                        ) : (
                          <Chip
                            variant="soft"
                            color="warning"
                            size="sm"
                            className="text-[10px] font-bold uppercase font-sans"
                          >
                            Da completare
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
                          Completa Onboarding
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
                        Gestisci Abbonamento
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-accent text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all"
                        isLoading={actionLoading === product.productId}
                        onClick={() => handleSubscribe(product.productId)}
                        icon={<ArrowRight className="w-4 h-4 text-slate-950" />}
                        iconPosition="end"
                      >
                        Abbonati Ora
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
