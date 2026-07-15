"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { getSsoBaseUrl } from "@/framework/lib/urls";
import { getVisibleModulesForSidebar, AppIds, LucideIconName, getModuleInfo } from "@/framework/lib/resources.config";
import { getModuleLabel } from "@/framework/lib/module-labels";
import { useTheme } from "next-themes";
import { useCurrentLocale } from "@/locales/client";
import pkg from "@/../package.json";
import { SupportDialog } from "@/framework/components/user/SupportDialog";
import { AIDataDialog } from "@/framework/components/user/AIDataDialog";
import { Avatar, Button, Tooltip, ScrollShadow } from "@/framework/components/ui";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { useUIStrings, fmtUI } from "@/framework/lib/ui.localization";
import * as LucideIcons from "lucide-react";
import {
  LayoutDashboard,
  Bell,
  MessageSquare,
  ActivitySquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LifeBuoy,
  Settings,
  Cpu
} from "lucide-react";

// L3.1 (DS_LAYOUTS_V1_1_PLAN) — UserSidebar: migrazione della Sidebar nella shell user.
// Differenze rispetto alla Sidebar storica:
// - le azioni senza backend (Notifiche, Messaggi, Stato servizio) sono OPZIONALI:
//   compaiono solo se l'app passa il rispettivo handler (niente bottoni finti di default);
// - `aria-current="page"` sulla voce di menu attiva;
// - `inDrawer`: variante per il Drawer mobile (sempre espansa, niente toggle collasso).

// Helper per risolvere l'icona del modulo dinamicamente dal registro SSOT
const getIconComponent = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> => {
  if (!iconName) return LayoutDashboard;
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return IconComponent || LayoutDashboard;
};

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
  const { user, claims, logout, loginRedirect } = useAuth();
  const brand = useBrand();
  const s = useUIStrings();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();

  const [supportOpen, setSupportOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);

  // Nel Drawer la sidebar è sempre espansa e i tooltip da collasso non servono.
  const isCollapsed = inDrawer ? false : collapsed;

  const userRole = (claims?.uRole || claims?.role || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
  const displayName = user?.displayName || user?.email?.split("@")[0] || s.common.user;
  const roleName = (claims?.uRole || claims?.role) ? String(claims?.uRole || claims?.role).toUpperCase() : "VIEWER";

  // Ottiene il ruolo dell'organizzazione per questa applicazione dai custom claims rbac.apps
  const orgRole = (claims?.rbac?.apps?.[appId]?.mode || "buyer") as "buyer" | "seller" | "both";

  // Estrae la lista dei moduli visibili sulla base del ruolo utente e ruolo organizzazione (SSOT)
  const visibleModules = getVisibleModulesForSidebar(appId as AppIds, userRole, orgRole);

  const ssoUrl = getSsoBaseUrl();
  const settingsUrl = appId === "sso" ? `/${currentLocale}/settings` : `${ssoUrl}/${currentLocale}/settings`;

  const handleLogout = async () => {
    try {
      await logout();
      if (appId === "sso") {
        window.location.href = `/${currentLocale}/auth`;
      } else {
        loginRedirect(appId);
      }
    } catch (err) {
      console.error("[UserSidebar] Errore logout:", err);
    }
  };

  return (
    <aside className={`klx-sidebar ${isCollapsed ? "klx-sidebar--collapsed" : ""} ${className}`}>
      {/* 1. HEADER (LOGO & TOGGLE SIDEBAR) */}
      <div className="klx-sidebar-header">
        {!isCollapsed && (
          <div className="klx-sidebar-logo-container">
            <div className="klx-sidebar-logo-mark">{brand.logoMark}</div>
            <span className="klx-sidebar-logo-text">{brand.name}</span>
          </div>
        )}
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

      {/* 3. FOOTER (AZIONI, PROFILO, SUPPORTO & LOGOUT) */}
      <div className="klx-sidebar-footer">
        {/* BOTTONI AZIONE — quelli applicativi compaiono SOLO con l'handler dell'app */}
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

          {/* Toggle Theme */}
          <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="klx-sidebar-action-btn"
                aria-label={s.sidebar.changeTheme}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              {fmtUI(s.sidebar.themeLabel, { mode: theme === "dark" ? "Light" : "Dark" })}
            </Tooltip.Content>
          </Tooltip>

          {/* Settings (solo per l'owner dell'organizzazione) */}
          {userRole === "owner" && (
            <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
              <Tooltip.Trigger>
                <Link
                  href={settingsUrl}
                  onClick={onNavigate}
                  className="klx-sidebar-action-btn klx-sidebar-action-btn--settings"
                  aria-label={s.sidebar.settings}
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                {s.sidebar.settings}
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>

        {/* Profilo utente */}
        <div className="klx-sidebar-profile-card">
          <Avatar className="klx-sidebar-profile-avatar">
            {(claims?.uAvatar || user?.photoURL) && (
              <Avatar.Image src={(claims?.uAvatar as string) || user?.photoURL || undefined} alt={displayName} />
            )}
            <Avatar.Fallback className="text-white">{displayName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>

          {!isCollapsed && (
            <div className="klx-sidebar-profile-info">
              <p className="klx-sidebar-profile-name">
                {displayName}
              </p>
              <p className="klx-sidebar-profile-role">
                {roleName}
              </p>
            </div>
          )}
        </div>

        {/* BOTTONI SUPPORTO & LOGOUT */}
        <div className="klx-sidebar-footer-buttons">
          <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
            <Tooltip.Trigger>
              <Button
                onClick={() => setSupportOpen(true)}
                variant="ghost"
                className="klx-sidebar-footer-btn"
                aria-label={s.sidebar.openSupport}
              >
                <LifeBuoy className="w-4 h-4" />
                {!isCollapsed && <span>{s.sidebar.support}</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              {s.sidebar.support}
            </Tooltip.Content>
          </Tooltip>

          <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
            <Tooltip.Trigger>
              <Button
                onClick={() => setAiOpen(true)}
                variant="ghost"
                className="klx-sidebar-footer-btn"
                aria-label={s.sidebar.aiAgent}
              >
                <Cpu className="w-4 h-4 text-secondary animate-pulse" />
                {!isCollapsed && <span>{s.sidebar.aiAgent}</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              {s.sidebar.aiAgent}
            </Tooltip.Content>
          </Tooltip>

          <Tooltip isDisabled={!isCollapsed} delay={0} closeDelay={0}>
            <Tooltip.Trigger>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="klx-sidebar-footer-btn klx-sidebar-footer-btn--logout"
                aria-label={s.sidebar.logout}
              >
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span>{s.sidebar.logout}</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              {s.sidebar.disconnect}
            </Tooltip.Content>
          </Tooltip>
        </div>

        {/* COPYRIGHT E VERSIONE FOOTER */}
        {!isCollapsed && (
          <div className="klx-sidebar-copyright">
            <span>{brand.copyright}</span>
            <span className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono text-[8px]">
              v{pkg.version}
            </span>
          </div>
        )}
      </div>

      <SupportDialog isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
      <AIDataDialog isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </aside>
  );
}
