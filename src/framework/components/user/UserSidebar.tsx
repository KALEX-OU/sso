"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { getVisibleModulesForSidebar, AppIds, LucideIconName, getModuleInfo } from "@/framework/lib/resources.config";
import { getModuleLabel } from "@/framework/lib/module-labels";
import { useCurrentLocale } from "@/locales/client";
import { SupportDialog } from "@/framework/components/user/SupportDialog";
import { AIDataDialog } from "@/framework/components/user/AIDataDialog";
import { UserMenu } from "@/framework/components/user/menu/UserMenu";
import { Button, Tooltip, ScrollShadow, Logo } from "@/framework/components/ui";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { useUIStrings } from "@/framework/lib/ui.localization";
import {
  LayoutDashboard,
  Bell,
  MessageSquare,
  ActivitySquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// L3.1 (DS_LAYOUTS_V1_1_PLAN) — UserSidebar: migrazione della Sidebar nella shell user.
// Differenze rispetto alla Sidebar storica:
// - le azioni senza backend (Notifiche, Messaggi, Stato servizio) sono OPZIONALI:
//   compaiono solo se l'app passa il rispettivo handler (niente bottoni finti di default);
// - `aria-current="page"` sulla voce di menu attiva;
// - `inDrawer`: variante per il Drawer mobile (sempre espansa, niente toggle collasso).

// Helper per risolvere l'icona del modulo dinamicamente dal registro SSOT
const getIconComponent = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> =>
  resolveLucideIcon(iconName, LayoutDashboard);

export interface UserSidebarProps {
  appId: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  /** Notifiche: il bottone compare solo se l'app fornisce l'handler. */
  onNotifications?: () => void;
  /** Pallino di notifica non lette (ha senso solo con onNotifications). */
  hasUnreadNotifications?: boolean;
  /** Messaggi: il bottone compare solo se l'app fornisce l'handler. */
  onMessages?: () => void;
  /** Stato del servizio: il bottone compare solo se l'app fornisce l'handler. */
  onServiceStatus?: () => void;
  /** Variante per il Drawer mobile: sempre espansa, senza toggle di collasso. */
  inDrawer?: boolean;
  /** Callback di navigazione (es. per chiudere il Drawer dopo il click su una voce). */
  onNavigate?: () => void;
  className?: string;
}

export function UserSidebar({
  appId,
  collapsed,
  setCollapsed,
  onNotifications,
  hasUnreadNotifications,
  onMessages,
  onServiceStatus,
  inDrawer = false,
  onNavigate,
  className = ""
}: UserSidebarProps) {
  const { claims } = useAuth();
  const brand = useBrand();
  const s = useUIStrings();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();

  const [supportOpen, setSupportOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);

  // Nel Drawer la sidebar è sempre espansa e i tooltip da collasso non servono.
  const isCollapsed = inDrawer ? false : collapsed;

  const userRole = (claims?.uRole || claims?.role || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";

  // Ottiene il ruolo dell'organizzazione per questa applicazione dai custom claims rbac.apps
  const orgRole = (claims?.rbac?.apps?.[appId]?.mode || "buyer") as "buyer" | "seller" | "both";

  // Estrae la lista dei moduli visibili sulla base del ruolo utente e ruolo organizzazione (SSOT)
  const visibleModules = getVisibleModulesForSidebar(appId as AppIds, userRole, orgRole);

  return (
    <aside className={`klx-sidebar ${isCollapsed ? "klx-sidebar--collapsed" : ""} ${className}`}>
      {/* 1. HEADER (LOGO & TOGGLE SIDEBAR) — wordmark ui/Logo (M4), white-label:
          l'area privata segue il brand attivo, a differenza del portale auth. */}
      <div className="klx-sidebar-header">
        {!isCollapsed && <Logo size="sm" className="ms-1" />}
        {isCollapsed && (
          <div className="klx-sidebar-logo-mark">{brand.logoMark}</div>
        )}
        {!isCollapsed && !inDrawer && (
          <Button
            isIconOnly
            variant="ghost"
            onClick={() => setCollapsed(true)}
            className="klx-sidebar-toggle-btn"
            aria-label={s.sidebar.collapse}
          >
            {/* Chevron di collasso: direzionale, si specchia in RTL */}
            <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
          </Button>
        )}
      </div>

      {/* BOTTONE ESPANSIONE (QUANDO COLLASSED) */}
      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-slate-200/60 dark:border-slate-900/50">
          <Button
            isIconOnly
            variant="ghost"
            onClick={() => setCollapsed(false)}
            className="klx-sidebar-toggle-btn"
            aria-label={s.sidebar.expand}
          >
            {/* Chevron di espansione: direzionale, si specchia in RTL */}
            <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
          </Button>
        </div>
      )}

      {/* 2. MENU MODULI (Middle) */}
      <ScrollShadow hideScrollBar className="klx-sidebar-menu">
        {visibleModules.map((moduleId) => {
          const moduleInfo = getModuleInfo(moduleId);
          const Icon = getIconComponent(moduleInfo?.icon);
          const label = getModuleLabel(moduleId, currentLocale);

          const modulePath = moduleId === "dashboard" ? "/dashboard" : `/${moduleId}`;
          const localizedPath = `/${currentLocale}${modulePath}`;
          const isActive = pathname === localizedPath || pathname.startsWith(localizedPath + "/");

          return (
            <Tooltip
              key={moduleId}
              isDisabled={!isCollapsed}
              delay={0}
              closeDelay={0}
            >
              <Tooltip.Trigger>
                <Link
                  href={localizedPath}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={`klx-sidebar-menu-item group ${isActive ? "klx-sidebar-menu-item--active" : ""}`}
                >
                  <Icon className="klx-sidebar-menu-item-icon" />
                  {!isCollapsed && (
                    <span className="klx-sidebar-menu-item-label">{label}</span>
                  )}
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                {label}
              </Tooltip.Content>
            </Tooltip>
          );
        })}
      </ScrollShadow>

      {/* 3. FOOTER (AZIONI APP OPZIONALI + MENU UTENTE) — tema, impostazioni,
          supporto, AI agent, logout e versione vivono nel UserMenu (M2). */}
      <div className="klx-sidebar-footer">
        {/* BOTTONI AZIONE — compaiono SOLO con l'handler dell'app */}
        {(onNotifications || onMessages || onServiceStatus) && (
        <div className="klx-sidebar-actions-grid">
          {onNotifications && (
            <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  variant="ghost"
                  onClick={onNotifications}
                  className="klx-sidebar-action-btn klx-sidebar-action-btn--notif"
                  aria-label={s.sidebar.notifications}
                >
                  <Bell className="w-4 h-4" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-warning" />
                  )}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                {s.sidebar.notifications}
              </Tooltip.Content>
            </Tooltip>
          )}

          {onMessages && (
            <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  variant="ghost"
                  onClick={onMessages}
                  className="klx-sidebar-action-btn klx-sidebar-action-btn--msg"
                  aria-label={s.sidebar.messages}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                {s.sidebar.messages}
              </Tooltip.Content>
            </Tooltip>
          )}

          {onServiceStatus && (
            <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  variant="ghost"
                  onClick={onServiceStatus}
                  className="klx-sidebar-action-btn klx-sidebar-action-btn--status"
                  aria-label={s.sidebar.serviceStatus}
                >
                  <ActivitySquare className="w-4 h-4" />
                  <span className="absolute bottom-1 end-1 w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                {s.sidebar.serviceStatusOk}
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
        )}

        {/* MENU UTENTE (M1/M2): trigger avatar+nome+ruolo, pannello con tema,
            lingua, impostazioni, supporto, AI agent, logout e versione. */}
        <UserMenu
          variant="sidebar"
          clientId={appId}
          collapsed={isCollapsed}
          onSupport={() => setSupportOpen(true)}
          onAiAgent={() => setAiOpen(true)}
          onNavigate={onNavigate}
        />
      </div>

      {/* Dialoghi montati SOLO quando aperti: su mobile la sidebar dockata è
          display:none e i trigger inerti dei Modal (checkVisibility=false)
          farebbero scattare il warning Pressable di react-aria. */}
      {supportOpen && <SupportDialog isOpen={supportOpen} onClose={() => setSupportOpen(false)} />}
      {aiOpen && <AIDataDialog isOpen={aiOpen} onClose={() => setAiOpen(false)} />}
    </aside>
  );
}
import { resolveLucideIcon } from "../../lib/lucide-icon";
