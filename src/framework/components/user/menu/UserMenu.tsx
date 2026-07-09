"use client";

import React, { useSyncExternalStore } from "react";
import { useAuth } from "../../../lib/auth";
import { getSsoBaseUrl } from "../../../lib/urls";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "../../ui";
import { LogIn, UserPlus, LogOut, Settings, LayoutDashboard } from "lucide-react";

interface UserMenuProps {
  clientId?: string;
  className?: string;
}

const emptySubscribe = () => () => {};

export function UserMenu({ clientId = "web", className = "" }: UserMenuProps) {
  const { user, loading, claims, logout, loginRedirect, registerRedirect } = useAuth();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (isMounted && loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-divider animate-pulse" />
        <div className="w-20 h-4 bg-divider rounded animate-pulse hidden sm:block" />
      </div>
    );
  }

  // Flusso Utente NON autenticato: mostra pulsanti Accedi e Registrati
  if (!user) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Button
          onClick={() => loginRedirect(clientId)}
          variant="ghost"
          size="sm"
          className="font-extrabold uppercase tracking-wider rounded-2xl text-secondary dark:text-violet-400 hover:bg-violet-500/10 active:scale-95 transition-all flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Accedi
        </Button>
        <Button
          onClick={() => registerRedirect(clientId)}
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-wider rounded-2xl bg-gradient-to-r from-violet-500 to-accent text-slate-950 shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Registrati
        </Button>
      </div>
    );
  }

  // Calcola il nome da visualizzare (predilige display name, poi email)
  const displayName = user.displayName || user.email?.split("@")[0] || "Utente";
  const userEmail = user.email || "";
  const roleName = claims?.uRole ? String(claims.uRole).toUpperCase() : "UTENTE";

  const handleLogout = async () => {
    try {
      await logout();
      // Opzionalmente ricarica la pagina o effettua un redirect locale
      window.location.reload();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Errore sconosciuto";
      console.error("[UserMenu] Errore disconnessione:", errMsg);
    }
  };

  const redirectToSSO = (path = "") => {
    const ssoUrl = getSsoBaseUrl();
    window.location.href = `${ssoUrl}${path}`;
  };

  // Flusso Utente autenticato: mostra Avatar e Dropdown di gestione
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Dropdown>
        <DropdownTrigger>
          <span className="flex items-center gap-2 outline-none cursor-pointer group active:scale-98 transition-transform">
            <Avatar
              className="w-8 h-8 text-xs cursor-pointer ring-2 ring-violet-500/50 ring-offset-1 ring-offset-background"
            >
              {user.photoURL ? (
                React.createElement("img", { src: user.photoURL, alt: displayName, className: "w-full h-full object-cover rounded-full" })
              ) : (
                displayName.substring(0, 2).toUpperCase()
              )}
            </Avatar>
            <span className="text-left hidden md:block">
              <span className="text-xs font-black uppercase text-foreground group-hover:text-primary transition-colors block">
                {displayName}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase block">
                {roleName}
              </span>
            </span>
          </span>
        </DropdownTrigger>
        <DropdownMenu aria-label="Menu utente">
          <DropdownItem key="profile" className="h-14 gap-2 opacity-100 pointer-events-none">
            <div className="flex flex-col">
              <p className="font-semibold text-xs">{displayName}</p>
              <p className="font-normal text-[10px] text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownItem>
          
          <DropdownItem 
            key="dashboard" 
            onClick={() => redirectToSSO("/dashboard")}
            className="font-semibold"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Console Dashboard
            </span>
          </DropdownItem>

          <DropdownItem 
            key="settings" 
            onClick={() => redirectToSSO("/profile")}
            className="font-semibold"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Gestione Account
            </span>
          </DropdownItem>

          <DropdownItem
            key="logout"
            onClick={handleLogout}
            className="font-bold text-danger"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Esci
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
