"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/framework/lib/auth";
import { RESOURCE_REGISTRY } from "@/framework/lib/resources.config";
import { useTheme } from "next-themes";
import { useCurrentLocale } from "@/locales/client";
import pkg from "@/../package.json";
import { SupportDialog } from "@/framework/components/user/SupportDialog";
import { AIDataDialog } from "@/framework/components/user/AIDataDialog";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CreditCard,
  ShoppingCart,
  FileText,
  DollarSign,
  Cpu,
  Activity,
  Key,
  Radio,
  AppWindow,
  Package,
  Tag,
  Bell,
  MessageSquare,
  ActivitySquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LifeBuoy
} from "lucide-react";

// Mappatura statica delle icone per i moduli del framework
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  user: Users,
  team: UserCog,
  subscription: CreditCard,
  checkout: ShoppingCart,
  invoice: FileText,
  payment: DollarSign,
  compute: Cpu,
  product_consume: Activity,
  apikey: Key,
  thing: Radio,
  application: AppWindow,
  product: Package,
  productprice: Tag
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

  const userRole = claims?.role || "viewer";
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Utente";
  const roleName = claims?.role ? claims.role.toUpperCase() : "VIEWER";
  
  // Recupera l'elenco moduli per l'appId corrente
  const registry = RESOURCE_REGISTRY as unknown as Record<string, RegistryApp>;
  const appConfig = registry[appId];
  const modules = appConfig ? Object.keys(appConfig.modules) : [];

  // Verifica l'accesso di lettura al modulo in base al ruolo RBAC
  const hasAccess = (moduleId: string) => {
    if (!appConfig) return false;
    const moduleConfig = appConfig.modules[moduleId];
    if (!moduleConfig) return false;
    
    // Bypass per l'owner
    if (userRole === "owner") return true;

    const roleKey = userRole.toLowerCase() as "owner" | "admin" | "member" | "viewer" | "device";
    const policy = moduleConfig.rolePolicies[roleKey] || moduleConfig.rolePolicies["viewer"];
    return policy ? (policy.canRead || policy.canList) : false;
  };

  const visibleModules = modules.filter(hasAccess);

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
    <aside
      className={`shrink-0 flex flex-col h-screen transition-all duration-300 ease-in-out z-30
        bg-slate-950/95 dark:bg-black/90 text-slate-100 border-r border-slate-900/60 backdrop-blur-xl
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* 1. HEADER (LOGO & TOGGLE SIDEBAR) */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900/50">
        {!collapsed && (
          <div className="flex items-center gap-2 select-none">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00ffff] via-[#ff00ff] to-[#ffff00] flex items-center justify-center font-black text-black text-xs">
              K
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#ff00ff]">
              KALEX
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#00ffff] via-[#ff00ff] to-[#ffff00] flex items-center justify-center font-black text-black text-xs mx-auto">
            K
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* BOTTONE ESPANSIONE (QUANDO COLLASSED) */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-slate-900/50">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MENU MODULI (Middle) */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1.5 scrollbar-none px-3">
        {visibleModules.map((moduleId) => {
          const Icon = ICON_MAP[moduleId] || LayoutDashboard;
          const config = appConfig.modules[moduleId];
          const label = config?.name || moduleId;
          
          const modulePath = moduleId === "dashboard" ? "/dashboard" : `/${moduleId}`;
          const localizedPath = `/${currentLocale}${modulePath}`;
          const isActive = pathname === localizedPath || pathname.startsWith(localizedPath + "/");

          return (
            <Link
              key={moduleId}
              href={localizedPath}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-[#ff00ff]/10 text-[#ff00ff] border-l-3 border-[#ff00ff]"
                    : "text-slate-400 hover:text-[#00ffff] hover:bg-[#00ffff]/5"
                }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#ff00ff]" : "text-slate-400 group-hover:text-[#00ffff]"}`} />
              
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}

              {/* Tooltip per modalità compatta */}
              {collapsed && (
                <div className="absolute left-18 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-slate-900 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER (NOTIFICHE, PROFILO, SUPPORTO & LOGOUT) */}
      <div className="p-3 border-t border-slate-900/60 bg-slate-950/40 space-y-3">
        {/* BOTTONI DI STATO E NOTIFICHE */}
        <div className={`flex items-center gap-1.5 ${collapsed ? "flex-col justify-center" : "justify-between"}`}>
          {/* Notifiche */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-[#ffff00] hover:bg-[#ffff00]/5 transition-all group cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ffff00]" />
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Notifiche
              </div>
            )}
          </button>

          {/* Messaggi */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all group cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Messaggi
              </div>
            )}
          </button>

          {/* Stato del Servizio */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-green-400 hover:bg-green-500/5 transition-all group cursor-pointer">
            <ActivitySquare className="w-4 h-4" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Stato Servizio: OK
              </div>
            )}
          </button>

          {/* Toggle Theme */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all group cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Tema: {theme === "dark" ? "Light" : "Dark"}
              </div>
            )}
          </button>
        </div>

        <div className={`flex items-center gap-3 p-1.5 rounded-xl bg-slate-900/30 ${collapsed ? "justify-center" : "justify-start"}`}>
          <Avatar className="w-8 h-8 text-xs cursor-pointer ring-1 ring-slate-800 ring-offset-1 ring-offset-slate-950 shrink-0">
            {user?.photoURL && <Avatar.Image src={user.photoURL} alt={displayName} />}
            <Avatar.Fallback className="text-white">{displayName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>

          {!collapsed && (
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-black text-slate-200 truncate uppercase tracking-wide">
                {displayName}
              </p>
              <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase truncate">
                {roleName}
              </p>
            </div>
          )}
        </div>

        {/* BOTTONI SUPPORTO & LOGOUT */}
        <div className={`flex ${collapsed ? "flex-col gap-1 items-center" : "justify-between"} gap-1.5`}>
          <button
            onClick={() => setSupportOpen(true)}
            className={`flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all group relative cursor-pointer
              ${collapsed ? "w-8 h-8" : "flex-1 gap-2 text-[10px] font-bold uppercase tracking-wider"}`}
          >
            <LifeBuoy className="w-4 h-4" />
            {!collapsed && <span>Supporto</span>}
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Supporto
              </div>
            )}
          </button>

          <button
            onClick={() => setAiOpen(true)}
            className={`flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all group relative cursor-pointer
               ${collapsed ? "w-8 h-8" : "flex-1 gap-2 text-[10px] font-bold uppercase tracking-wider"}`}
          >
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            {!collapsed && <span>AI Agent</span>}
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                AI Agent
              </div>
            )}
          </button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`flex items-center justify-center text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer min-w-0 h-auto
              ${collapsed ? "w-8 h-8" : "flex-1 gap-2 text-[10px] font-bold uppercase tracking-wider"}`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Esci</span>}
            {collapsed && (
              <div className="absolute left-12 bg-slate-950 text-white text-[10px] font-bold uppercase py-1 px-2 rounded border border-slate-900 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Disconnetti
              </div>
            )}
          </Button>
        </div>

        {/* COPYRIGHT E VERSIONE FOOTER */}
        {!collapsed && (
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900/60 text-[9px] text-slate-500 font-medium tracking-wide">
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
