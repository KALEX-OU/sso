"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { BrandConfig, KALEX_BRAND, resolveBrand } from "../../lib/brand.config";

const BrandContext = createContext<BrandConfig>(KALEX_BRAND);

/**
 * Hook di accesso alla configurazione di brand attiva (white-label).
 * Da usare in OGNI componente che mostra identità, valute o catalogo:
 * mai cablare "KALEX"/valute/orgId di sistema nel markup.
 */
export function useBrand(): BrandConfig {
  return useContext(BrandContext);
}

interface BrandProviderProps {
  children: React.ReactNode;
  /**
   * Brand esplicito (ha precedenza). In assenza, il brand è risolto da
   * NEXT_PUBLIC_KALEX_BRAND (inlined a build-time dall'app consumer);
   * default: KALEX.
   */
  brand?: BrandConfig;
}

/**
 * Applica il brand attivo: espone la BrandConfig via context e imposta
 * l'attributo `data-brand` su <html>, attivando il blocco CSS
 * `[data-brand="<id>"]` dei token in globals.css (colori, glow, scrollbar).
 */
export function BrandProvider({ children, brand }: BrandProviderProps) {
  const active = useMemo(
    () => brand ?? resolveBrand(process.env.NEXT_PUBLIC_KALEX_BRAND),
    [brand]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.brand = active.id;
    return () => {
      delete root.dataset.brand;
    };
  }, [active.id]);

  return <BrandContext.Provider value={active}>{children}</BrandContext.Provider>;
}

export default BrandProvider;
