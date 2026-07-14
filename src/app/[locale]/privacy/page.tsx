"use client";

import React, { Suspense, useState } from "react";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: il padding root è
// stato ridotto di conseguenza per mantenere l'ingombro precedente.
import { Card, CardContent, Button } from "@/framework/components/ui";
import { useSearchParams, useRouter } from "next/navigation";
import { Globe, ArrowLeft, Shield } from "lucide-react";
import { useCurrentLocale, useChangeLocale } from "@/locales/client";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function PrivacyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 dark:border-white/20 border-t-secondary dark:border-t-secondary"></span>
      </div>
    }>
      <PrivacyContent />
    </Suspense>
  );
}

function PrivacyContent() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  // Brand white-label attivo: il testo legale nomina l'operatore, non "KALEX" cablato (E5.1).
  const brand = useBrand();
  const { setTheme, resolvedTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Preserva client_id e redirect_uri se presenti per tornare indietro
  const clientId = searchParams.get("client_id") || "";
  const redirectUri = searchParams.get("redirect_uri") || "";
  const state = searchParams.get("state") || "";

  const handleBack = () => {
    let backUrl = `/${currentLocale}/auth`;
    const params = new URLSearchParams();
    if (clientId) params.set("client_id", clientId);
    if (redirectUri) params.set("redirect_uri", redirectUri);
    if (state) params.set("state", state);
    const queryString = params.toString();
    if (queryString) backUrl += `?${queryString}`;
    router.push(backUrl);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-800 dark:text-foreground relative overflow-hidden font-sans flex flex-col items-center p-6 sm:p-12 lg:p-20 transition-colors duration-500">
      {/* Ambient Glow — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none bg-secondary/5 dark:bg-secondary/10 opacity-50"></div>

      {/* Floating Header per selezione Tema & Lingua */}
      <div className="absolute top-6 end-6 flex items-center gap-2.5 z-50">
        {/* Selettore Lingua a discesa */}
        <div className="relative">
          <Button
            unstyled
            variant="ghost"
            size="sm"
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase text-[10px] tracking-wider">{currentLocale}</span>
          </Button>
          {langMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
              <div className="absolute end-0 mt-2 w-36 origin-top-right rtl:origin-top-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-45 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    changeLocale("it");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "it"
                      ? "bg-secondary/10 text-secondary"
                      : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm">🇮🇹</span> Italiano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeLocale("en");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "en"
                      ? "bg-secondary/10 text-secondary"
                      : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm">🇬🇧</span> English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeLocale("es");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "es"
                      ? "bg-secondary/10 text-secondary"
                      : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm">🇪🇸</span> Español
                </button>
              </div>
            </>
          )}
        </div>

        <Button
          unstyled
          isIconOnly
          variant="ghost"
          size="sm"
          className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>

      <div className="max-w-3xl w-full relative z-10 flex flex-col gap-6 mt-8">
        <div className="flex items-center gap-4">
          <Button
            unstyled
            isIconOnly
            variant="ghost"
            size="sm"
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            <span className="text-slate-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Centro Sicurezza</span>
          </div>
        </div>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/35 backdrop-blur-2xl shadow-2xl p-3 rounded-3xl transition-all">
          <CardContent className="space-y-6 text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400 dark:text-gray-500 text-xs">Ultimo aggiornamento: 13 Giugno 2026</p>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Informazioni Generali</h2>
              <p>
                La presente Privacy Policy descrive le modalità con cui {brand.name} raccoglie, utilizza e protegge i tuoi dati personali quando utilizzi il nostro portale di Single Sign-On (SSO). La sicurezza dei tuoi dati è di fondamentale importanza per noi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Dati che Raccogliamo</h2>
              <p>
                Raccogliamo solo i dati strettamente necessari all&apos;erogazione del servizio di autenticazione e fatturazione multi-tenant:
              </p>
              <ul className="list-disc ps-5 space-y-1.5">
                <li>Nome completo (se fornito) ed Indirizzo Email.</li>
                <li>Dati fiscali per aziende e PA (Partita IVA, SDI, Codice Ufficio PA, CIG, CUP).</li>
                <li>Identificativi relativi ai servizi di fatturazione Stripe (Stripe Customer ID).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Come Utilizziamo i Tuoi Dati</h2>
              <p>
                I tuoi dati personali vengono utilizzati esclusivamente per scopi legati all&apos;operatività del portale e all&apos;accesso sicuro:
              </p>
              <ul className="list-disc ps-5 space-y-1.5">
                <li>Consentire l&apos;autenticazione tramite Single Sign-On.</li>
                <li>Configurare la fatturazione sicura automatica e la gestione delle sottoscrizioni.</li>
                <li>Gestire l&apos;autenticazione a due fattori (MFA) tramite SMS o App di autenticazione.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Diritti dell&apos;Interessato</h2>
              <p>
                In conformità al GDPR, disponi del diritto di accedere, rettificare o cancellare i tuoi dati in qualsiasi momento. Puoi esercitare questi diritti direttamente dal tuo Identity Center o contattando il nostro supporto tecnico.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
