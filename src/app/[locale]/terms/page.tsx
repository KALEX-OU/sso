"use client";

import React, { Suspense, useState } from "react";
import { Card, Button } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Globe, ArrowLeft, FileText } from "lucide-react";
import { useCurrentLocale, useChangeLocale } from "@/locales/client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function TermsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 dark:border-white/20 border-t-secondary dark:border-t-violet-400"></span>
      </div>
    }>
      <TermsContent />
    </Suspense>
  );
}

function TermsContent() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
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
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none bg-secondary/5 dark:bg-secondary/10 opacity-50"></div>

      {/* Floating Header per selezione Tema & Lingua */}
      <div className="absolute top-6 right-6 flex items-center gap-2.5 z-50">
        {/* Selettore Lingua a discesa */}
        <div className="relative">
          <Button
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
              <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-45 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    changeLocale("it");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "it"
                      ? "bg-violet-500/10 text-secondary dark:text-violet-400"
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "en"
                      ? "bg-violet-500/10 text-secondary dark:text-violet-400"
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    currentLocale === "es"
                      ? "bg-violet-500/10 text-secondary dark:text-violet-400"
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
            isIconOnly
            variant="ghost"
            size="sm"
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-500" />
            <span className="text-slate-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Documentazione Legale</span>
          </div>
        </div>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/35 backdrop-blur-2xl shadow-2xl p-8 rounded-3xl transition-all">
          <Card.Content className="space-y-6 text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Termini di Servizio</h1>
            <p className="text-slate-400 dark:text-gray-500 text-xs">Ultimo aggiornamento: 13 Giugno 2026</p>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Accettazione dei Termini</h2>
              <p>
                Creando un account o registrandoti su KALEX SSO, accetti di essere vincolato dai presenti Termini di Servizio. Se non accetti una qualsiasi delle clausole riportate, non puoi utilizzare la nostra piattaforma.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Descrizione del Servizio</h2>
              <p>
                KALEX fornisce un servizio di Single Sign-On (SSO) centralizzato che consente agli utenti registrati di accedere in modo sicuro alle proprie applicazioni dell&apos;ecosistema KALEX, differenziando gli account in base alla tipologia: Personal (B2C), Business (B2B), Government (B2G/PA) ed Education.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Obblighi dell&apos;Utente</h2>
              <p>
                Ti impegni a fornire informazioni accurate e complete in fase di registrazione, inclusi i dati relativi alla Partita IVA e ad altri codici richiesti per la fatturazione. Sei responsabile della riservatezza delle tue credenziali di accesso.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Limiti di Responsabilità</h2>
              <p>
                KALEX non potrà essere ritenuta responsabile per interruzioni temporanee del servizio, ritardi dovuti a sistemi di terze parti (come Stripe o VIES) o per qualsiasi perdita derivante da un uso non autorizzato del tuo account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Modifiche ai Termini</h2>
              <p>
                Ci riserviamo il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina e l&apos;uso continuato dei nostri servizi costituirà l&apos;accettazione di tali modifiche.
              </p>
            </section>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
