"use client";

/**
 * AUTH v1.2 (docs/AUTH_V1_2_PLAN.md) — glue app-specifico del portale auth.
 *
 * La cornice del portale (glow, toggle tema/lingua, white-label tenant §3-bis,
 * card con Logo, footer legale, pannello marketing) è promossa nel framework
 * come `components/auth/AuthArea` — speculare a `user/UserArea`. Qui resta SOLO
 * ciò che è business dell'app sso: la mappa estetica dei VERTICALI
 * (`client_id` → brand) e l'hook `useAuthBrand` che la risolve. Le pagine
 * compongono `<AuthArea brand={brand} brandName={brandName}>` direttamente.
 */

import { useSearchParams } from "next/navigation";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import {
  AUTH_AREA_DEFAULT_BRAND,
  type AuthAreaBrand,
} from "@/framework/components/auth/AuthArea";

// Re-export di comodo per le pagine auth (già importato da qui ovunque).
export { preserveAuthQuery } from "@/framework/components/auth/AuthArea";

// Configurazione estetica dei brand verticali (business sso).
// La voce `default` è quella white-label del framework (nessuna identità cablata).
const BRAND_CONFIGS: Record<string, AuthAreaBrand> = {
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
  default: AUTH_AREA_DEFAULT_BRAND,
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
