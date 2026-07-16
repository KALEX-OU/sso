"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button, Logo } from "../ui";
import { AuthLayout } from "./AuthLayout";
import { AuthCard } from "./AuthCard";
import { KALEX_BRAND } from "../../lib/brand.config";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";

/**
 * ORCHESTRATORE del portale di autenticazione — speculare a user/UserArea.
 *
 * Famiglia auth: AuthArea (quest'area nel suo insieme: glow ambient, toggle
 * tema/lingua, white-label tenant §3-bis, footer legale, pannello marketing)
 * → AuthLayout (shell presentazionale 40/60) → AuthCard → AuthForm*.
 * Come UserArea possiede la logica (router/query/fetch tenant) e per questo
 * NON è cardata su Claude Design: le card editabili sono i componenti
 * presentazionali che compone.
 *
 * L'estetica del verticale (gradiente logo/CTA, glow) arriva via prop `brand`:
 * la RISOLUZIONE verticale↔client_id resta all'app (sso: `_shared/auth-portal`,
 * `useAuthBrand`), qui vive solo il default white-label.
 */

/** Parametri da preservare navigando tra le route auth (OAuth + PKCE + post-login). */
const PRESERVED_PARAMS = ["client_id", "redirect_uri", "state", "code_challenge", "code_challenge_method", "redirectTo"] as const;

export function preserveAuthQuery(searchParams: URLSearchParams): string {
  const out = new URLSearchParams();
  for (const key of PRESERVED_PARAMS) {
    const value = searchParams.get(key);
    if (value) out.set(key, value);
  }
  const qs = out.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Estetica di un brand del portale auth (verticale o default).
 * `name: null` = wordmark KALEX: il portale di autenticazione è SEMPRE
 * brandizzato KALEX (identity provider dell'ecosistema — decisione owner
 * 2026-07-16). Il tenant white-label per-org (§3-bis) resta prioritario
 * sul nome, risolto a runtime dall'host.
 */
export interface AuthAreaBrand {
  name: string | null;
  logoColor: string;
  glowColorLight: string;
  glowColorDark: string;
}

/** Voce default (white-label): gradiente e glow sui token brand `--klx-*`. */
export const AUTH_AREA_DEFAULT_BRAND: AuthAreaBrand = {
  name: null,
  logoColor: "from-secondary to-accent",
  glowColorLight: "bg-secondary/5",
  glowColorDark: "bg-secondary/10",
};

export interface AuthAreaProps {
  children: React.ReactNode;
  /** Errore globale mostrato nel banner standard della card. */
  error?: string;
  /** Mostra il blocco brand pieno (logo+sottotitolo) in testa alla card. */
  showHeader?: boolean;
  /** Classi extra della card (es. "max-w-md" per l'avviso di verifica). */
  cardClassName?: string;
  /** Contenuto sotto la card (es. link login↔register). */
  belowCard?: React.ReactNode;
  /** Estetica del verticale attivo (default: white-label). */
  brand?: AuthAreaBrand;
  /** Nome statico del brand già risolto (default: brand.name ?? white-label). */
  brandName?: string;
}

export function AuthArea({
  children,
  error,
  showHeader = true,
  cardClassName = "",
  belowCard,
  brand = AUTH_AREA_DEFAULT_BRAND,
  brandName,
}: AuthAreaProps) {
  const s = useUIStrings();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const { setTheme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  // next-themes: `resolvedTheme` è indefinito in SSR — il gate `mounted` evita
  // l'hydration mismatch su icona del toggle e classi del glow (primo render
  // client identico al server: variante light, poi si allinea al tema reale).
  // Deferred per evitare setState sincrono nell'effect (regola react-hooks).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    void Promise.resolve().then(() => setMounted(true));
  }, []);
  // White-label (§3-bis): nome dell'org risolto dall'host (sottodominio o dominio custom).
  const [tenantName, setTenantName] = useState<string | null>(null);
  const redirectUri = searchParams.get("redirect_uri");
  const isDark = mounted && resolvedTheme === "dark";
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;
  // Il portale auth è SEMPRE KALEX (identity provider): niente white-label
  // runtime sul default; vincono solo il verticale (brand.name) e il tenant §3-bis.
  const staticBrandName = brandName ?? brand.name ?? KALEX_BRAND.name;
  const displayBrandName = tenantName || staticBrandName;
  const legalQuery = preserveAuthQuery(searchParams);

  // Il login gira sempre sull'host di sistema: l'host del tenant si ricava dal
  // redirect_uri (fallback: host corrente). Best-effort, nessun errore visibile.
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        let host = window.location.hostname;
        if (redirectUri) {
          try {
            host = new URL(redirectUri).hostname;
          } catch {
            // redirect_uri non è un URL valido: si usa l'host corrente.
          }
        }
        const res = await fetch(`/api/public/tenant?host=${encodeURIComponent(host)}`);
        if (!res.ok) return;
        const json = (await res.json()) as { found?: boolean; tenant?: { name?: string } };
        if (active && json.found && json.tenant?.name) {
          setTenantName(json.tenant.name);
        }
      } catch {
        // Nessun branding tenant: si resta sul brand statico.
      }
    })();
    return () => {
      active = false;
    };
  }, [redirectUri]);

  return (
    <AuthLayout>
      {/* Colonna form (40%) */}
      <AuthLayout.Form className="lg:p-16">
        {/* Ambient Glow — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none ${activeGlowColor} opacity-50`}></div>

        {/* Toggle tema & lingua */}
        <div className="absolute top-6 end-6 flex items-center gap-2 z-50">
          <div className="relative">
            <Button
              unstyled
              variant="ghost"
              size="sm"
              aria-label={s.auth.area.languageMenu}
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
                  {([["it", "🇮🇹", "Italiano"], ["en", "🇬🇧", "English"], ["es", "🇪🇸", "Español"]] as const).map(([code, flag, label]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        changeLocale(code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                        currentLocale === code
                          ? "bg-secondary/10 text-secondary"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">{flag}</span> {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button
            unstyled
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label={s.auth.area.themeToggle}
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
        </div>

        <AuthCard
          className={cardClassName}
          error={error}
          header={
            /* Logo del VERTICALE su ogni step: pieno con tagline sugli step
               principali, compatto (senza tagline) su MFA/verify. */
            <Logo
              name={displayBrandName}
              gradientClassName={brand.logoColor}
              size={showHeader ? "lg" : "md"}
              tagline={showHeader ? s.auth.area.subtitle : undefined}
            />
          }
        >
          {children}
          {belowCard}
        </AuthCard>

        {/* Footer legale */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-500 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <p>{KALEX_BRAND.copyright} · {s.auth.area.rightsReserved}</p>
          <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
          <div className="flex gap-3">
            <a href={`/${currentLocale}/privacy${legalQuery}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">{s.auth.area.legalPrivacy}</a>
            <a href={`/${currentLocale}/terms${legalQuery}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">{s.auth.area.legalTerms}</a>
          </div>
        </div>
      </AuthLayout.Form>

      {/* Pannello marketing (60%) */}
      <AuthLayout.Aside>
        {/* Radial glow — RTL: fisico voluto, centraggio simmetrico */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none ${activeGlowColor} opacity-75 transition-all duration-700`}></div>

        {/* Griglia vettoriale decorativa */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 my-auto max-w-lg space-y-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-300 transition-all">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
            {s.auth.area.ecosystemBadge}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            {s.auth.area.marketingTitle}
          </h1>

          <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed">
            {fmtUI(s.auth.area.marketingDesc, { brandName: displayBrandName })}
          </p>

          <div className="space-y-4 pt-4 w-full">
            {[
              { title: s.auth.area.feat1Title, desc: s.auth.area.feat1Desc },
              { title: s.auth.area.feat2Title, desc: s.auth.area.feat2Desc },
              { title: s.auth.area.feat3Title, desc: s.auth.area.feat3Desc },
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 w-full text-start">
                <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r ${brand.logoColor} flex items-center justify-center font-bold text-slate-950 dark:text-slate-950 text-sm shadow-sm`}>
                  {i + 1}
                </div>
                <div className="text-start">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-gray-500"></div>
      </AuthLayout.Aside>
    </AuthLayout>
  );
}

export default AuthArea;
