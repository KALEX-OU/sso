"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/framework/lib/auth";
import { getVisibleModulesForSidebar, AppIds, LucideIconName, getModuleInfo } from "@/framework/lib/resources.config";
import { getModuleLabel } from "@/framework/lib/module-labels";
import { useCurrentLocale } from "@/locales/client";
import { Modal, ListBox, ListBoxItem, Kbd } from "@/framework/components/ui";
import { useUIStrings } from "@/framework/lib/ui.localization";
import * as LucideIcons from "lucide-react";
import { LayoutDashboard, Search } from "lucide-react";

/**
 * L3.4 (DS_LAYOUTS_V1_1_PLAN) — Command Palette ⌘K della shell user.
 *
 * Navigazione rapida tra i moduli visibili del registry SSOT (stessa fonte
 * della UserSidebar: ruolo utente + ruolo org). Presentazionale: la scorciatoia
 * da tastiera e il routing stanno nel chiamante (UserLayout passa onNavigate →
 * router.push), così il componente resta testabile senza next/navigation.
 */

const getIconComponent = (iconName?: LucideIconName): React.ComponentType<{ className?: string }> => {
  if (!iconName) return LayoutDashboard;
  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return IconComponent || LayoutDashboard;
};

export interface UserCommandPaletteProps {
  appId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Naviga al path localizzato selezionato (il chiamante fa router.push e chiude). */
  onNavigate: (localizedPath: string) => void;
}

export function UserCommandPalette({ appId, isOpen, onOpenChange, onNavigate }: UserCommandPaletteProps) {
  const { claims } = useAuth();
  const s = useUIStrings();
  const currentLocale = useCurrentLocale();
  const [query, setQuery] = useState("");

  const userRole = (claims?.uRole || claims?.role || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
  const orgRole = (claims?.rbac?.apps?.[appId]?.mode || "buyer") as "buyer" | "seller" | "both";

  const entries = useMemo(() => {
    const visibleModules = getVisibleModulesForSidebar(appId as AppIds, userRole, orgRole);
    return visibleModules.map((moduleId) => {
      const info = getModuleInfo(moduleId);
      const label = getModuleLabel(moduleId, currentLocale);
      const modulePath = moduleId === "dashboard" ? "/dashboard" : `/${moduleId}`;
      return { moduleId, label, icon: info?.icon, path: `/${currentLocale}${modulePath}` };
    });
  }, [appId, userRole, orgRole, currentLocale]);

  const filtered = query.trim()
    ? entries.filter((e) => e.label.toLowerCase().includes(query.trim().toLowerCase()))
    : entries;

  const handleSelect = (path: string) => {
    setQuery("");
    onNavigate(path);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        onOpenChange(open);
      }}
    >
      <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-start justify-center p-4 pt-[15vh]">
        <Modal.Container className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden klx-motion-overlay-in">
          <Modal.Dialog aria-label={s.layout.palette.title} className="flex flex-col">
            {/* Ricerca */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-900/60">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s.layout.palette.placeholder}
                aria-label={s.layout.palette.placeholder}
                className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <Kbd className="hidden sm:flex">esc</Kbd>
            </div>

            {/* Risultati */}
            <div className="max-h-[45vh] overflow-y-auto klx-scrollbar-minimalist p-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {s.layout.palette.noResults}
                </p>
              ) : (
                <ListBox
                  aria-label={s.layout.palette.title}
                  className="flex flex-col gap-0.5 outline-none"
                  onAction={(key) => handleSelect(String(key))}
                >
                  {filtered.map((entry) => {
                    const Icon = getIconComponent(entry.icon);
                    return (
                      <ListBoxItem
                        key={entry.path}
                        id={entry.path}
                        textValue={entry.label}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 data-[focused]:bg-primary/10 data-[focused]:text-primary hover:bg-primary/5 hover:text-primary cursor-pointer outline-none transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{entry.label}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {s.layout.palette.hint}
                        </span>
                      </ListBoxItem>
                    );
                  })}
                </ListBox>
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
