"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import { Card, Button, Chip } from "@heroui/react";
import { Cloud, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Globe, Cpu } from "lucide-react";

interface ServiceCatalogItem {
  serviceId: string;
  name: string;
  description: string;
  type: "subscription" | "usage";
  priceText: string;
  priceModel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES_CATALOG: ServiceCatalogItem[] = [
  {
    serviceId: "safety",
    name: "KALEX Safety",
    description: "Piattaforma SaaS avanzata per la gestione della sicurezza sul lavoro, ispezioni digitali e adempimenti normativi in tempo reale.",
    type: "subscription",
    priceText: "€15 / Mese per Posto",
    priceModel: "Fatturazione mensile in base al numero di utenti attivi nell'organizzazione.",
    icon: ShieldCheck
  },
  {
    serviceId: "standlo",
    name: "KALEX Standlo",
    description: "Sistema di monitoraggio e telemetria IoT per chioschi automatizzati, stand promozionali e vending machine di nuova generazione.",
    type: "subscription",
    priceText: "€25 / Mese per Posto",
    priceModel: "Fatturazione mensile seat-based, include aggiornamenti firmware OTA e pannello analitico.",
    icon: Cpu
  },
  {
    serviceId: "vies-validator",
    name: "VIES Validator API",
    description: "API ad alta disponibilità per la validazione in tempo reale di Partite IVA intracomunitarie tramite il registro ufficiale della Commissione Europea.",
    type: "usage",
    priceText: "€0.01 / Chiamata",
    priceModel: "Pay-as-you-go addebitato a fine mese con soglia di esenzione per le prime 100 chiamate.",
    icon: Globe
  },
  {
    serviceId: "geocoding",
    name: "KALEX Geocoding",
    description: "Servizio di geocodifica diretta e inversa con correzione toponomastica e posizionamento spaziale ottimizzato.",
    type: "usage",
    priceText: "€0.005 / Richiesta",
    priceModel: "Tariffazione a consumo basata sulle richieste elaborate dal server API gateway.",
    icon: Globe
  },
  {
    serviceId: "altitude-service",
    name: "Altitude Service",
    description: "Fornisce l'altitudine esatta rispetto al livello del mare per qualsiasi coordinata geografica, ottimizzato per droni e cartografia.",
    type: "usage",
    priceText: "€0.008 / Richiesta",
    priceModel: "Calcolo volumetrico mensile integrato in Stripe Metered Billing.",
    icon: Cloud
  },
  {
    serviceId: "ai-translation",
    name: "AI Translation API",
    description: "Traduzione neurale e localizzazione di testi ad alta fedeltà con conservazione del contesto e formattazione markdown.",
    type: "usage",
    priceText: "€0.02 / 1K Token",
    priceModel: "Fatturazione basata sul volume di token elaborati dai modelli di linguaggio.",
    icon: Cpu
  }
];

export default function ServicePage() {
  const { dbData, showToast } = useDashboard();
  const [activatingService, setActivatingService] = useState<string | null>(null);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  // Estrae gli abbonamenti attivi dell'organizzazione dal dbData
  const activeSubscriptions = activeOrg?.serviceSubscriptions_on_organization || [];

  const getServiceStatus = (serviceId: string) => {
    const sub = activeSubscriptions.find(s => s.service.serviceId === serviceId);
    if (!sub) return { status: "not_active", tier: null };
    return { status: sub.status, tier: sub.tier };
  };

  const handleActivateService = async (serviceId: string) => {
    if (!activeOrg) return;
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast("Solo l'Owner o gli Admin possono attivare i servizi.", "error");
      return;
    }

    setActivatingService(serviceId);
    try {
      // Simulazione attivazione o Stripe Checkout redirect
      showToast(`Avvio attivazione per ${serviceId}...`, "info");
      
      // In un caso reale, qui chiameremmo l'endpoint per generare Stripe Checkout o per attivare direttamente se gratuito/test.
      // Simuliamo l'avvio del pagamento o attivazione asincrona 202.
      setTimeout(() => {
        showToast("Servizio preso in carico. L'attivazione avverrà a breve tramite webhook.", "success");
        setActivatingService(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      showToast("Impossibile attivare il servizio al momento.", "error");
      setActivatingService(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Servizi Cloud KALEX</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Abilita e gestisci le applicazioni verticali e le API di integrazione di KALEX per la tua organizzazione.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_CATALOG.map((service) => {
          const { status, tier } = getServiceStatus(service.serviceId);
          const isActive = status === "active" || status === "trialing";
          const IconComponent = service.icon;

          return (
            <Card
              key={service.serviceId}
              className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
            >
              <Card.Content className="p-0 flex flex-col h-full justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-pink-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isActive ? (
                        <Chip
                          size="sm"
                          color="success"
                          variant="soft"
                          className="font-bold text-[8px] uppercase flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 inline" /> {tier || "Attivo"}
                        </Chip>
                      ) : status === "past_due" ? (
                        <Chip
                          size="sm"
                          color="danger"
                          variant="soft"
                          className="font-bold text-[8px] uppercase flex items-center gap-1"
                        >
                          <AlertCircle className="w-2.5 h-2.5 inline" /> Insoluto
                        </Chip>
                      ) : (
                        <Chip
                          size="sm"
                          variant="soft"
                          className="font-bold text-[8px] uppercase text-slate-400"
                        >
                          Non Attivo
                        </Chip>
                      )}
                      
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mt-0.5">
                        {service.type === "subscription" ? "Abbonamento" : "A Consumo"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-2 group-hover:text-purple-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed min-h-[50px]">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tariffa</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-xl">
                      {service.priceText}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic leading-snug">
                    {service.priceModel}
                  </p>

                  <Button
                    onClick={() => handleActivateService(service.serviceId)}
                    isDisabled={isActive || activatingService !== null}
                    className={`w-full py-4 text-xs font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isActive
                        ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 shadow-md"
                    }`}
                  >
                    {activatingService === service.serviceId ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-950"></span>
                    ) : isActive ? (
                      "Servizio Abilitato"
                    ) : (
                      <>
                        Richiedi Attivazione <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
