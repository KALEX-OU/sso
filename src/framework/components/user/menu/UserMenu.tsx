"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { getSsoBaseUrl } from "../../../lib/urls";
import { Avatar, Button, Kbd } from "../../ui";
import { useBrand } from "../../providers/BrandProvider";
import { useUIStrings } from "../../../lib/ui.localization";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { useTheme } from "next-themes";
import pkg from "@/../package.json";
import {
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Building2,
  Users,
  KeyRound,
  Globe,
  SunMoon,
  LifeBuoy,
  Sparkles,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

/**
 * Menu utente unico dell'ecosistema — card DS `user/UserMenu`.
 *
 * Pannello in stile "account menu" (header email, gruppi separati, voci
 * sentence-case con icona, scorciatoie a lato, Esci in coda, micro-footer
 * copyright/versione) con due trigger:
 * - `variant="sidebar"`: riga avatar+nome+ruolo in fondo alla UserSidebar
 *   (pannello sopra il trigger; fly-out laterale quando collassata);
 * - `variant="header"`: avatar nell'header delle app (pannello sotto).
 *
 * Lingua e Tema si espandono in-place (niente popover annidati). Il pannello
 * è manuale (overlay + Escape, pattern del menu lingua di AuthArea): pieno
 * controllo estetico e nessun vincolo del Menu react-aria sui sottomenu.
 * Supporto/AI Agent compaiono solo se il consumer passa i rispettivi handler
 * (i dialoghi restano montati nel consumer: AIDataDialog usa DashboardContext).
 */

export interface UserMenuProps {
  /** App di provenienza (redirect login/logout e URL cross-app verso l'SSO). */
  clientId?: string;
  /** Trigger: avatar nell'header (default) o riga profilo della sidebar. */
  variant?: "header" | "sidebar";
  /** Con `variant="sidebar"`: la sidebar è collassata (solo avatar, fly-out). */
  collapsed?: boolean;
  /** Voce "Supporto": compare solo con l'handler (dialog del consumer). */
  onSupport?: () => void;
  /** Voce "AI Agent": compare solo con l'handler (dialog del consumer). */
  onAiAgent?: () => void;
  /** Callback di navigazione (es. chiusura del Drawer mobile). */
  onNavigate?: () => void;
  /** Apre il pannello al mount (solo per le card demo del DS). */
  defaultOpen?: boolean;
  className?: string;
}

type ExpandedSection = "language" | "theme" | null;

const LOCALES = [
  ["it", "Italiano"],
  ["en", "English"],
  ["es", "Español"],
] as const;

/** Riga standard del pannello: icona 16px + label + suffisso (kbd/valore/chevron). */
function MenuRow({
  icon,
  label,
  suffix,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium text-start transition-colors cursor-pointer ${
        danger ? "text-danger hover:bg-danger/10" : "text-ink hover:bg-surface-2"
      }`}
    >
      <span className={`shrink-0 ${danger ? "" : "text-ink-muted"}`}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {suffix}
    </button>
  );
}

export function UserMenu({
  clientId = "web",
  variant = "header",
  collapsed = false,
  onSupport,
  onAiAgent,
  onNavigate,
  defaultOpen = false,
  className = "",
}: UserMenuProps) {
  const { user, loading, claims, logout, loginRedirect, registerRedirect } = useAuth();
  const s = useUIStrings();
  const brand = useBrand();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState<ExpandedSection>(null);

  // Chiusura con Escape (l'overlay gestisce il click fuori).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (isMounted && loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-divider animate-pulse" />
        {variant === "header" && <div className="w-20 h-4 bg-divider rounded animate-pulse hidden sm:block" />}
      </div>
    );
  }

  // Utente NON autenticato (solo header pubblico): Accedi / Registrati.
  if (!user) {
    if (variant === "sidebar") return null;
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Button
          onClick={() => loginRedirect(clientId)}
          variant="ghost"
          size="sm"
          className="font-extrabold uppercase tracking-wider rounded-2xl text-secondary dark:text-secondary hover:bg-secondary/10 active:scale-95 transition-all flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {s.auth.signIn}
        </Button>
        <Button
          onClick={() => registerRedirect(clientId)}
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-wider rounded-2xl bg-gradient-to-r from-secondary to-accent text-slate-950 shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {s.auth.register.register}
        </Button>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || s.common.user;
  const userEmail = user.email || "";
  const roleName = (claims?.uRole || claims?.role) ? String(claims?.uRole || claims?.role).toUpperCase() : "";
  const isOwner = (claims?.uRole || claims?.role) === "owner";
  const claimAvatar = typeof claims?.uAvatar === "string" ? claims.uAvatar : undefined;
  const avatarSrc = claimAvatar || user.photoURL || undefined;

  const isSso = clientId === "sso";
  const ssoUrl = getSsoBaseUrl();
  const toSso = (path: string) => (isSso ? `/${currentLocale}${path}` : `${ssoUrl}/${currentLocale}${path}`);

  const navigate = (path: string) => {
    setOpen(false);
    onNavigate?.();
    window.location.href = toSso(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      if (variant === "sidebar") {
        if (isSso) {
          window.location.href = `/${currentLocale}/auth`;
        } else {
          loginRedirect(clientId);
        }
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("[UserMenu] Errore disconnessione:", err);
    }
  };

  const themeLabel = theme === "dark" ? s.userMenu.themeDark : theme === "light" ? s.userMenu.themeLight : s.userMenu.themeSystem;

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setExpanded(null);
  };

  /* Pannello — posizionamento per variante (sopra il trigger nella sidebar,
     fly-out laterale se collassata, sotto l'avatar nell'header). */
  const panelPosition =
    variant === "sidebar"
      ? collapsed
        ? "bottom-0 start-[calc(100%+0.5rem)]"
        : "bottom-[calc(100%+0.5rem)] start-0"
      : "top-[calc(100%+0.5rem)] end-0";

  const panel = open && (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div
        className={`absolute ${panelPosition} z-50 w-64 rounded-2xl border border-line bg-surface-raised backdrop-blur-xl shadow-2xl p-1.5 klx-motion-overlay-in`}
      >
        {/* Header account */}
        <p className="px-2.5 pt-1.5 pb-2 text-[11px] text-ink-muted truncate">{userEmail}</p>

        {/* Gruppo account — le voci di GESTIONE (org/team/chiavi) sono owner-only:
            i rispettivi moduli sono fuori dalla sidebar (USER_MENU_MODULES). */}
        <MenuRow icon={<UserIcon className="w-4 h-4" />} label={s.userMenu.profile} onClick={() => navigate("/user")} />
        {isOwner && (
          <>
            <MenuRow
              icon={<Building2 className="w-4 h-4" />}
              label={s.userMenu.organization}
              suffix={variant === "sidebar" ? <Kbd className="text-[10px]">⌘,</Kbd> : undefined}
              onClick={() => navigate("/settings")}
            />
            <MenuRow icon={<Users className="w-4 h-4" />} label={s.userMenu.team} onClick={() => navigate("/team")} />
            <MenuRow icon={<KeyRound className="w-4 h-4" />} label={s.userMenu.apiKeys} onClick={() => navigate("/apikey")} />
          </>
        )}
        <MenuRow
          icon={<Globe className="w-4 h-4" />}
          label={s.userMenu.language}
          suffix={
            <span className="flex items-center gap-1 text-[11px] text-ink-muted">
              <span className="uppercase">{currentLocale}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform rtl:-scale-x-100 ${expanded === "language" ? "rotate-90 rtl:rotate-90" : ""}`} />
            </span>
          }
          onClick={() => setExpanded(expanded === "language" ? null : "language")}
        />
        {expanded === "language" &&
          LOCALES.map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setOpen(false);
                changeLocale(code);
              }}
              className={`w-full flex items-center gap-2 ps-9 pe-2.5 py-1.5 rounded-xl text-[13px] text-start transition-colors cursor-pointer ${
                currentLocale === code ? "font-semibold text-secondary" : "font-medium text-ink hover:bg-surface-2"
              }`}
            >
              <span className="flex-1">{label}</span>
              {currentLocale === code && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        <MenuRow
          icon={<SunMoon className="w-4 h-4" />}
          label={s.userMenu.theme}
          suffix={
            <span className="flex items-center gap-1 text-[11px] text-ink-muted">
              {themeLabel}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform rtl:-scale-x-100 ${expanded === "theme" ? "rotate-90 rtl:rotate-90" : ""}`} />
            </span>
          }
          onClick={() => setExpanded(expanded === "theme" ? null : "theme")}
        />
        {expanded === "theme" &&
          ([["light", s.userMenu.themeLight], ["dark", s.userMenu.themeDark], ["system", s.userMenu.themeSystem]] as const).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setTheme(mode);
                setExpanded(null);
              }}
              className={`w-full flex items-center gap-2 ps-9 pe-2.5 py-1.5 rounded-xl text-[13px] text-start transition-colors cursor-pointer ${
                theme === mode ? "font-semibold text-secondary" : "font-medium text-ink hover:bg-surface-2"
              }`}
            >
              <span className="flex-1">{label}</span>
              {theme === mode && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}

        {(onSupport || onAiAgent || variant === "header") && <div className="h-px bg-line my-1.5 mx-1" />}

        {/* Gruppo strumenti */}
        {variant === "header" && (
          <MenuRow icon={<LayoutDashboard className="w-4 h-4" />} label={s.userMenu.dashboard} onClick={() => navigate("/dashboard")} />
        )}
        {onSupport && (
          <MenuRow
            icon={<LifeBuoy className="w-4 h-4" />}
            label={s.userMenu.support}
            onClick={() => {
              setOpen(false);
              onSupport();
            }}
          />
        )}
        {onAiAgent && (
          <MenuRow
            icon={<Sparkles className="w-4 h-4" />}
            label={s.userMenu.aiAgent}
            onClick={() => {
              setOpen(false);
              onAiAgent();
            }}
          />
        )}

        <div className="h-px bg-line my-1.5 mx-1" />

        <MenuRow icon={<LogOut className="w-4 h-4" />} label={s.userMenu.logout} danger onClick={() => void handleLogout()} />

        {/* Micro-footer */}
        <p className="px-2.5 pt-1.5 pb-1 text-[10px] text-ink-muted truncate">
          {brand.copyright} · v{pkg.version}
        </p>
      </div>
    </>
  );

  /* Trigger per variante */
  if (variant === "sidebar") {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={toggleOpen}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={s.common.userMenu}
          className={`w-full flex items-center gap-2.5 rounded-xl p-1.5 transition-colors cursor-pointer hover:bg-slate-200/40 dark:hover:bg-slate-900/50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="w-8 h-8 text-xs shrink-0 ring-1 ring-slate-300 dark:ring-slate-800 ring-offset-1 ring-offset-white dark:ring-offset-slate-950">
            {avatarSrc && <Avatar.Image src={avatarSrc} alt={displayName} />}
            <Avatar.Fallback className="text-white">{displayName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="flex-1 min-w-0 text-start">
                <span className="block text-[13px] font-semibold text-ink truncate">{displayName}</span>
                {roleName && <span className="block text-[10px] text-ink-muted truncate">{roleName}{brand.name ? ` · ${brand.name}` : ""}</span>}
              </span>
              <ChevronsUpDown className="w-4 h-4 text-ink-muted shrink-0" />
            </>
          )}
        </button>
        {panel}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={s.common.userMenu}
        className="flex items-center gap-2 outline-none cursor-pointer group active:scale-98 transition-transform"
      >
        <Avatar className="w-8 h-8 text-xs ring-2 ring-secondary/50 ring-offset-1 ring-offset-background">
          {avatarSrc && <Avatar.Image src={avatarSrc} alt={displayName} />}
          <Avatar.Fallback>{displayName.substring(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        <span className="text-start hidden md:block">
          <span className="text-xs font-semibold text-ink group-hover:text-secondary transition-colors block">{displayName}</span>
          {roleName && <span className="text-[10px] text-ink-muted tracking-wider uppercase block">{roleName}</span>}
        </span>
        <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {panel}
    </div>
  );
}
