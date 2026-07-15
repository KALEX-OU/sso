"use client";

/**
 * AUTH v1.2 (docs/AUTH_V1_2_PLAN.md) — pezzi condivisi del portale di autenticazione.
 *
 * - `preserveAuthQuery`: whitelisting dei parametri OAuth/PKCE da propagare tra le
 *   route auth (login ↔ register ↔ redirect di /auth).
 * - `useAuthBrand`: brand del verticale da `client_id` (gradiente CTA, glow, nome).
 * - `AuthPortalShell`: cornice comune delle pagine auth — AuthLayout 40/60, glow,
 *   toggle tema/lingua, AuthCard con header brand (+ tenant white-label), footer
 *   legale e pannello marketing. I form sono `children`.
 */

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button, Logo } from "@/framework/components/ui";
import { AuthLayout } from "@/framework/components/auth/AuthLayout";
import { AuthCard } from "@/framework/components/auth/AuthCard";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { useI18n, useChangeLocale, useCurrentLocale } from "@/locales/client";

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

// Configurazione estetica dei brand verticali.
// `name: null` = il nome segue il brand white-label attivo (useBrand):
// niente identità cablata nel markup per la voce di default.
export interface AuthBrandConfig {
  name: string | null;
  logoColor: string;
  bgGradientLight: string;
  bgGradientDark: string;
  glowColorLight: string;
  glowColorDark: string;
}

const BRAND_CONFIGS: Record<string, AuthBrandConfig> = {
  satefy: {
    name: "SATEFY",
    logoColor: "from-success to-teal-500",
    bgGradientLight: "from-success/10 via-slate-50 to-teal-100/20",
    bgGradientDark: "from-success/10 via-slate-950 to-teal-950/15",
    glowColorLight: "bg-success/5",
    glowColorDark: "bg-success/10",
  },
  standlo: {
    name: "STANDLO",
    logoColor: "from-cyan-400 to-blue-500",
    bgGradientLight: "from-cyan-100/40 via-slate-50 to-blue-100/20",
    bgGradientDark: "from-cyan-950/25 via-slate-950 to-blue-950/15",
    glowColorLight: "bg-cyan-500/5",
    glowColorDark: "bg-cyan-500/10",
  },
  default: {
    name: null,
    logoColor: "from-secondary to-accent",
    bgGradientLight: "from-secondary/10 via-slate-50 to-accent/20",
    bgGradientDark: "from-secondary/15 via-slate-950 to-accent/15",
    glowColorLight: "bg-secondary/5",
    glowColorDark: "bg-secondary/10",
  },
};

export function useAuthBrand() {
  const searchParams = useSearchParams();
  const wlBrand = useBrand();
  const clientId = searchParams.get("client_id") || "default";
  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  return {
    clientId,
    brand,
    /** Nome statico del brand (verticale o white-label). */
    brandName: brand.name ?? wlBrand.name,
    /** Gradiente della CTA/logo del verticale attivo. */
    gradient: brand.logoColor,
  };
}

export interface AuthPortalShellProps {
  children: React.ReactNode;
  /** Errore globale mostrato nel banner standard della card. */
  error?: string;
  /** Mostra il blocco brand (logo+sottotitolo) in testa alla card. */
  showHeader?: boolean;
  /** Classi extra della card (es. "max-w-md" per l'avviso di verifica). */
  cardClassName?: string;
  /** Contenuto sotto la card (es. link login↔register). */
  belowCard?: React.ReactNode;
}

export function AuthPortalShell({
  children,
  error,
  showHeader = true,
  cardClassName = "",
  belowCard,
}: AuthPortalShellProps) {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const { setTheme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const wlBrand = useBrand();
  const { brand, brandName } = useAuthBrand();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  // White-label (§3-bis): nome dell'org risolto dall'host (sottodominio o dominio custom).
  const [tenantName, setTenantName] = useState<string | null>(null);
  const redirectUri = searchParams.get("redirect_uri");
  const isDark = resolvedTheme === "dark";
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;
  const displayBrandName = tenantName || brandName;
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
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
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
              tagline={showHeader ? t("auth.subtitle") : undefined}
            />
          }
        >
          {children}
          {belowCard}
        </AuthCard>

        {/* Footer legale */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-500 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <p>{wlBrand.copyright} · {t("auth.rightsReserved")}</p>
          <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
          <div className="flex gap-3">
            <a href={`/${currentLocale}/privacy${legalQuery}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href={`/${currentLocale}/terms${legalQuery}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">Termini</a>
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
            {t("auth.ecosystemBadge")}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            {t("auth.marketingTitle")}
          </h1>

          <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed">
            {t("auth.marketingDesc", { brandName: displayBrandName })}
          </p>

          <div className="space-y-4 pt-4 w-full">
            {[
              { title: t("auth.feat1Title"), desc: t("auth.feat1Desc") },
              { title: t("auth.feat2Title"), desc: t("auth.feat2Desc") },
              { title: t("auth.feat3Title"), desc: t("auth.feat3Desc") },
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
