"use client";

import React from "react";
import { Drawer } from "../ui";

/**
 * Shell PRESENTAZIONALE dell'area privata — card DS `user/UserLayout`.
 *
 * Famiglia user speculare ad auth (AuthLayout → AuthCard → AuthForm*):
 * UserLayout è la struttura pura — sidebar dockata da md in su, drawer di
 * navigazione mobile, area contenuti, overlay globali — con tutto via slot.
 * NIENTE hook di auth/router/claims qui: l'orchestrazione (session sync,
 * gate RBAC/MFA/onboarding, DashboardContext) vive in `UserArea`,
 * che compone questa shell. È ciò che rende la shell editabile su Claude
 * Design con i mock demo, come le card auth.
 */
export interface UserLayoutProps {
  /** Sidebar dockata (da md in su) — tipicamente UserSidebar. */
  sidebar: React.ReactNode;
  /** Sidebar del drawer mobile (variante inDrawer). Se assente, niente drawer. */
  drawerSidebar?: React.ReactNode;
  /** Stato controllato del drawer di navigazione mobile. */
  mobileNavOpen?: boolean;
  onMobileNavOpenChange?: (open: boolean) => void;
  /** Nome accessibile del drawer (già localizzato dal consumer). */
  drawerAriaLabel?: string;
  /** Contenuto principale (tipicamente UserMain già composto). */
  children: React.ReactNode;
  /** Overlay globali della shell (command palette, dialoghi app-wide). */
  overlays?: React.ReactNode;
  className?: string;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  sidebar,
  drawerSidebar,
  mobileNavOpen = false,
  onMobileNavOpenChange,
  drawerAriaLabel,
  children,
  overlays,
  className = "",
}) => (
  <div
    className={`h-screen overflow-hidden flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-all duration-300 ${className}`}
  >
    {/* SIDEBAR DOCKATA (da md in su); sotto md la navigazione passa dal Drawer.
        NB: .klx-sidebar è CSS fuori layer e vincerebbe su `hidden` — il wrapper
        (hidden ↔ md:contents) governa la visibilità senza toccare la cascata. */}
    <div className="hidden md:contents">{sidebar}</div>

    {/* DRAWER DI NAVIGAZIONE MOBILE (L3.2) — Backdrop STANDALONE controllato
        (ModalOverlay react-aria): nessun DialogTrigger, nessun PressResponder. */}
    {drawerSidebar && (
      <Drawer.Backdrop
        isOpen={mobileNavOpen}
        onOpenChange={onMobileNavOpenChange}
        isDismissable
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
      >
        {/* placement left: il Drawer HeroUI espone solo direzioni fisiche
            (top/bottom/left/right) — eccezione RTL consapevole e documentata. */}
        <Drawer.Content placement="left" className="h-full w-72 max-w-[85vw] bg-transparent">
          <Drawer.Dialog aria-label={drawerAriaLabel} className="h-full">
            {drawerSidebar}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    )}

    {/* CONTENUTO PRINCIPALE */}
    {children}

    {/* OVERLAY GLOBALI (command palette ⌘K, dialoghi app-wide) */}
    {overlays}
  </div>
);

UserLayout.displayName = "UserLayout";

export default UserLayout;
