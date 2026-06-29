"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { RESOURCE_REGISTRY, getVisibleModulesForSidebar, AppIds, MODULE_REGISTRY, LucideIconName } from "@/framework/lib/resources.config";
import { useTheme } from "next-themes";
import { useCurrentLocale } from "@/locales/client";
import pkg from "@/../package.json";
import { SupportDialog } from "@/framework/components/user/SupportDialog";
import { AIDataDialog } from "@/framework/components/user/AIDataDialog";
import { Avatar } from "@/framework/components/ui/Avatar";
import { Button } from "@/framework/components/ui/Button";
import { Tooltip } from "@/framework/components/ui/Tooltip";
import { ScrollShadow } from "@/framework/components/ui/ScrollShadow";
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

// Helper per risolvere l'icona del modulo dinamicamente dal registro SSOT
const getIconComponent = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> => {
  if (!iconName) return LayoutDashboard;
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return IconComponent || LayoutDashboard;
};

interface RegistryModule {
  name?: string;
  rolePolicies: Record<
    string,
    {
      canRead?: boolean;
      canList?: boolean;
      canCreate?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
    }
  >;
}

interface RegistryApp {
  name: string;
  enabled: boolean;
  modules: Record<string, RegistryModule>;
}

interface SidebarProps {
  appId: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ appId, collapsed, setCollapsed }: SidebarProps) {
  const { user, claims, logout, loginRedirect } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();

  const [supportOpen, setSupportOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);

  const userRole = (claims?.role || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Utente";
  const roleName = claims?.role ? claims.role.toUpperCase() : "VIEWER";
  
  // Recupera l'elenco moduli per l'appId corrente
  const registry = RESOURCE_REGISTRY as unknown as Record<string, RegistryApp>;
  const appConfig = registry[appId];
  
  interface ExtendedClaims {
    orgRoles?: Record<string, "buyer" | "seller" | "both">;
    role?: string;
  }
  
  // Ottiene il ruolo dell'organizzazione per questa applicazione dai custom claims (se configurato)
  const extendedClaims = claims as ExtendedClaims | undefined;
  const orgRole = (extendedClaims?.orgRoles?.[appId] || "buyer") as "buyer" | "seller" | "both";

  // Estrae la lista dei moduli visibili sulla base del ruolo utente e ruolo organizzazione (SSOT)
  const visibleModules = getVisibleModulesForSidebar(appId as AppIds, userRole, orgRole);

  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
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
      console.error("[Sidebar] Errore logout:", err);
    }
  };

  return (
    <aside className={`klx-sidebar ${collapsed ? "klx-sidebar--collapsed" : ""}`}>
      {/* 1. HEADER (LOGO & TOGGLE SIDEBAR) */}
      <div className="klx-sidebar-header">
        {!collapsed && (
          <div className="klx-sidebar-logo-container">
            <div className="klx-sidebar-logo-mark">K</div>
            <span className="klx-sidebar-logo-text">KALEX</span>
          </div>
        )}
        {collapsed && (
          <div className="klx-sidebar-logo-mark">K</div>
        )}
        {!collapsed && (
          <Button
            isIconOnly
            variant="ghost"
            onClick={() => setCollapsed(true)}
            className="klx-sidebar-toggle-btn"
            aria-label="Collassa Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* BOTTONE ESPANSIONE (QUANDO COLLASSED) */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-slate-900/50">
          <Button
            isIconOnly
            variant="ghost"
            onClick={() => setCollapsed(false)}
            className="klx-sidebar-toggle-btn"
            aria-label="Espandi Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 2. MENU MODULI (Middle) */}
      <ScrollShadow hideScrollBar className="klx-sidebar-menu">
        {visibleModules.map((moduleId) => {
          const moduleConfig = MODULE_REGISTRY[moduleId as keyof typeof MODULE_REGISTRY];
          const Icon = getIconComponent(moduleConfig?.icon);
          const config = appConfig.modules[moduleId];
          const label = config?.name || moduleId;
          
          const modulePath = moduleId === "dashboard" ? "/dashboard" : `/${moduleId}`;
          const localizedPath = `/${currentLocale}${modulePath}`;
          const isActive = pathname === localizedPath || pathname.startsWith(localizedPath + "/");

          return (
            <Tooltip
              key={moduleId}
              isDisabled={!collapsed}
              delay={0}
              closeDelay={0}
            >
              <Tooltip.Trigger>
                <Link
                  href={localizedPath}
                  className={`klx-sidebar-menu-item group ${isActive ? "klx-sidebar-menu-item--active" : ""}`}
                >
                  <Icon className="klx-sidebar-menu-item-icon" />
                  {!collapsed && (
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

      {/* 3. FOOTER (NOTIFICHE, PROFILO, SUPPORTO & LOGOUT) */}
      <div className="klx-sidebar-footer">
        {/* BOTTONI DI STATO E NOTIFICHE */}
        <div className="klx-sidebar-actions-grid">
          {/* Notifiche */}
          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                className="klx-sidebar-action-btn klx-sidebar-action-btn--notif"
                aria-label="Notifiche"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-warning" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Notifiche
            </Tooltip.Content>
          </Tooltip>

          {/* Messaggi */}
          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                className="klx-sidebar-action-btn klx-sidebar-action-btn--msg"
                aria-label="Messaggi"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Messaggi
            </Tooltip.Content>
          </Tooltip>

          {/* Stato del Servizio */}
          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                className="klx-sidebar-action-btn klx-sidebar-action-btn--status"
                aria-label="Stato del Servizio"
              >
                <ActivitySquare className="w-4 h-4" />
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Stato Servizio: OK
            </Tooltip.Content>
          </Tooltip>

          {/* Toggle Theme */}
          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="klx-sidebar-action-btn"
                aria-label="Cambia Tema"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Tema: {theme === "dark" ? "Light" : "Dark"}
            </Tooltip.Content>
          </Tooltip>

          {/* Settings (solo per l'owner dell'organizzazione) */}
          {userRole === "owner" && (
            <Tooltip
              isDisabled={!collapsed}
              delay={0}
              closeDelay={0}
            >
              <Tooltip.Trigger>
                <Link
                  href={settingsUrl}
                  className="klx-sidebar-action-btn klx-sidebar-action-btn--settings"
                  aria-label="Impostazioni"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
                Impostazioni
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>

        {/* Profilo utente */}
        <div className="klx-sidebar-profile-card">
          <Avatar className="klx-sidebar-profile-avatar">
            {user?.photoURL && <Avatar.Image src={user.photoURL} alt={displayName} />}
            <Avatar.Fallback className="text-white">{displayName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>

          {!collapsed && (
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
          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                onClick={() => setSupportOpen(true)}
                variant="ghost"
                className="klx-sidebar-footer-btn"
                aria-label="Apri Supporto"
              >
                <LifeBuoy className="w-4 h-4" />
                {!collapsed && <span>Supporto</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Supporto
            </Tooltip.Content>
          </Tooltip>

          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                onClick={() => setAiOpen(true)}
                variant="ghost"
                className="klx-sidebar-footer-btn"
                aria-label="AI Agent"
              >
                <Cpu className="w-4 h-4 text-secondary animate-pulse" />
                {!collapsed && <span>AI Agent</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              AI Agent
            </Tooltip.Content>
          </Tooltip>

          <Tooltip
            isDisabled={!collapsed}
            delay={0}
            closeDelay={0}
          >
            <Tooltip.Trigger>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="klx-sidebar-footer-btn klx-sidebar-footer-btn--logout"
                aria-label="Esci"
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Esci</span>}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right" className="klx-sidebar-tooltip">
              Disconnetti
            </Tooltip.Content>
          </Tooltip>
        </div>

        {/* COPYRIGHT E VERSIONE FOOTER */}
        {!collapsed && (
          <div className="klx-sidebar-copyright">
            <span>© KALEX CLOUDTECH OÜ</span>
            <span className="bg-slate-900/80 text-slate-400 px-1.5 py-0.5 rounded font-mono text-[8px]">
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
