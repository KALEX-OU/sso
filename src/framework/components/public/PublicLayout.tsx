"use client";

import React from "react";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * L1.1 (DS_LAYOUTS_V1_1_PLAN) — Shell pubblica white-label del framework.
 *
 * Scheletro semantico delle pagine NON autenticate (home marketing, legali,
 * error page pubbliche): landmark `header/nav/main/footer`, skip-to-content
 * come primo elemento focusabile (L1.2) e motion standard `klx-motion-page-in`
 * sul contenuto (L0.3). Identità e copyright arrivano SOLO dal brand attivo
 * (useBrand) e le stringhe della shell da useUIStrings: niente testi o colori
 * cablati nei consumer.
 *
 * Composizione tipica:
 *   <PublicLayout>
 *     <PublicLayout.Header brandSuffix="web" nav={…} actions={…} />
 *     <PublicLayout.Main width="narrow">…</PublicLayout.Main>
 *     <PublicLayout.Footer links={…} />
 *   </PublicLayout>
 */

export interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PublicLayoutBase: React.FC<PublicLayoutProps> = ({ children, className = "" }) => {
  const s = useUIStrings();
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${className}`}>
      {/* L1.2: skip-to-content — visibile solo al focus (klx-skip-link in globals.css). */}
      <a href="#klx-public-main" className="klx-skip-link">
        {s.layout.skipToContent}
      </a>
      {children}
    </div>
  );
};

PublicLayoutBase.displayName = "PublicLayout";

export interface PublicHeaderProps {
  /** Slot logo custom; default: monogramma a gradiente + nome dal brand attivo. */
  logo?: React.ReactNode;
  /** Suffisso accanto al nome del brand (es. "web", "docs"). */
  brandSuffix?: string;
  /** Link di navigazione, renderizzati dentro il landmark `<nav>` etichettato. */
  nav?: React.ReactNode;
  /** Azioni a fine riga (UserMenu, toggle tema/lingua, CTA…). */
  actions?: React.ReactNode;
  className?: string;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ logo, brandSuffix, nav, actions, className = "" }) => {
  const brand = useBrand();
  const s = useUIStrings();
  return (
    <header
      className={`w-full border-b border-divider bg-background/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between gap-4 ${className}`}
    >
      {logo ?? (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-secondary/20">
            {brand.logoMark}
          </div>
          <span className="font-display font-black text-xl tracking-wider text-foreground uppercase">
            {brand.name}
            {brandSuffix && (
              <span className="text-secondary font-extrabold text-sm tracking-widest lowercase ms-1.5">
                {brandSuffix}
              </span>
            )}
          </span>
        </div>
      )}
      {nav && (
        <nav aria-label={s.layout.mainNavAria} className="flex flex-1 items-center justify-center gap-1">
          {nav}
        </nav>
      )}
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </header>
  );
};

PublicHeader.displayName = "PublicLayout.Header";

export type PublicMainWidth = "default" | "narrow" | "full";

const MAIN_WIDTH_CLASSES = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  full: "max-w-none",
} as const satisfies Record<PublicMainWidth, string>;

export interface PublicMainProps {
  children: React.ReactNode;
  /** Larghezza massima del contenuto: `default` 7xl, `narrow` 3xl (pagine legali), `full`. */
  width?: PublicMainWidth;
  className?: string;
}

const PublicMain: React.FC<PublicMainProps> = ({ children, width = "default", className = "" }) => (
  // tabIndex -1: bersaglio programmatico dello skip-to-content senza entrare nel tab order.
  <main
    id="klx-public-main"
    tabIndex={-1}
    className={`flex-1 w-full mx-auto px-6 py-10 outline-none klx-motion-page-in ${MAIN_WIDTH_CLASSES[width]} ${className}`}
  >
    {children}
  </main>
);

PublicMain.displayName = "PublicLayout.Main";

export interface PublicFooterProps {
  /** Link a piè di pagina, dentro un landmark `<nav>` dedicato ed etichettato. */
  links?: React.ReactNode;
  /** Contenuto custom al posto della riga copyright di default. */
  children?: React.ReactNode;
  className?: string;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ links, children, className = "" }) => {
  const brand = useBrand();
  const s = useUIStrings();
  return (
    <footer
      className={`w-full border-t border-divider py-6 px-6 bg-background/50 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest ${className}`}
    >
      {children ?? (
        <span>
          {brand.copyright} · {s.layout.rightsReserved}
        </span>
      )}
      {links && (
        <nav aria-label={s.layout.footerNavAria} className="flex items-center gap-4">
          {links}
        </nav>
      )}
    </footer>
  );
};

PublicFooter.displayName = "PublicLayout.Footer";

// Re-export nominali + compound — pattern unico del framework: Object.assign
export { PublicHeader, PublicMain, PublicFooter };
export const PublicLayout = Object.assign(PublicLayoutBase, {
  Header: PublicHeader,
  Main: PublicMain,
  Footer: PublicFooter,
});
