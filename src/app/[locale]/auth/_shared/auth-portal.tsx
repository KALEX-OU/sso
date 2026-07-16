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
import { KALEX_BRAND } from "@/framework/lib/brand.config";
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
    glowColorLight: "bg-success/5",
    glowColorDark: "bg-success/10",
  },
  standlo: {
    name: "STANDLO",
    logoColor: "from-cyan-400 to-blue-500",
    glowColorLight: "bg-cyan-500/5",
    glowColorDark: "bg-cyan-500/10",
  },
  default: AUTH_AREA_DEFAULT_BRAND,
};

export function useAuthBrand() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id") || "default";
  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  return {
    clientId,
    brand,
    /** Nome statico del brand: verticale, altrimenti SEMPRE KALEX (il portale
     *  auth è l'identity provider dell'ecosistema — decisione owner 2026-07-16;
     *  il tenant white-label §3-bis resta prioritario dentro AuthArea). */
    brandName: brand.name ?? KALEX_BRAND.name,
    /** Gradiente della CTA/logo del verticale attivo. */
    gradient: brand.logoColor,
  };
}
