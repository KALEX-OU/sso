"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, X, Menu } from "lucide-react";
import { Breadcrumbs, BreadcrumbsItem, Button, Skeleton } from "@/framework/components/ui";
import { ToastNotification } from "@/framework/components/layouts/ToastNotification";
import { useUIStrings } from "@/framework/lib/ui.localization";
import type { ToastState } from "@/framework/lib/types";

/**
 * L3.3 (DS_LAYOUTS_V1_1_PLAN) — UserMain: colonna contenuti della shell user.
 *
 * Fornisce: landmark <main> scrollabile con motion standard, hamburger mobile
 * (visibile sotto md, solo se il layout passa onOpenMobileNav), banner errore
 * globale dismissibile, host dei toast, ErrorBoundary + Suspense con skeleton
 * standard attorno al contenuto, e il sub-componente PageHeader (titolo,
 * breadcrumbs via ui/Breadcrumbs, azioni).
 */

/* ------------------------------ PageHeader ------------------------------- */

export interface UserPageBreadcrumb {
  label: string;
  href?: string;
}

export interface UserPageHeaderProps {
  title: string;
  description?: string;
  /** Briciole: etichette (dal registry SSOT, localizzate al call site) + href opzionale. */
  breadcrumbs?: readonly UserPageBreadcrumb[];
  /** Azioni a fine riga (bottoni primari del modulo). */
  actions?: React.ReactNode;
  className?: string;
}

const UserPageHeader: React.FC<UserPageHeaderProps> = ({ title, description, breadcrumbs, actions, className = "" }) => (
  <header className={`flex flex-col gap-2 ${className}`}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <Breadcrumbs className="text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <BreadcrumbsItem key={`${crumb.label}-${idx}`}>
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
          </BreadcrumbsItem>
        ))}
      </Breadcrumbs>
    )}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  </header>
);

UserPageHeader.displayName = "UserMain.PageHeader";

/* --------------------------- Skeleton standard ---------------------------- */

const UserContentSkeleton: React.FC = () => (
  <div className="w-full space-y-6" aria-hidden>
    <Skeleton className="h-9 w-1/3 rounded-xl" />
    <Skeleton className="h-24 w-full rounded-3xl" />
    <Skeleton className="h-64 w-full rounded-3xl" />
  </div>
);

/* ----------------------------- ErrorBoundary ------------------------------ */

interface ContentErrorBoundaryProps {
  title: string;
  body: string;
  retryLabel: string;
  children: React.ReactNode;
}

interface ContentErrorBoundaryState {
  hasError: boolean;
}

// Class component: è l'unico modo React per un error boundary. Le stringhe
// i18n arrivano via props dal wrapper funzionale (i hook non sono usabili qui).
class ContentErrorBoundary extends React.Component<ContentErrorBoundaryProps, ContentErrorBoundaryState> {
  state: ContentErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ContentErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error("[UserMain] Errore nel contenuto:", error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{this.props.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{this.props.body}</p>
          </div>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })} className="rounded-2xl">
            {this.props.retryLabel}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------- UserMain -------------------------------- */

export interface UserMainProps {
  children: React.ReactNode;
  /** Messaggio del banner errore globale (dismissibile con onErrorDismiss). */
  error?: string;
  onErrorDismiss?: () => void;
  /** Toast corrente (host renderizzato qui) e chiusura. */
  toast?: ToastState | null;
  onToastClose?: () => void;
  /** Apertura del Drawer di navigazione mobile: l'hamburger compare solo se presente. */
  onOpenMobileNav?: () => void;
  /** Header di pagina standard (tipicamente <UserMain.PageHeader …/>). */
  header?: React.ReactNode;
  className?: string;
}

const UserMainBase: React.FC<UserMainProps> = ({
  children,
  error,
  onErrorDismiss,
  toast,
  onToastClose,
  onOpenMobileNav,
  header,
  className = ""
}) => {
  const s = useUIStrings();
  return (
    <main className={`flex-1 overflow-y-auto klx-scrollbar-minimalist h-full relative flex flex-col p-6 space-y-6 klx-motion-page-in ${className}`}>
      {/* Hamburger mobile (L3.2): visibile sotto md, solo se il layout gestisce il Drawer */}
      {onOpenMobileNav && (
        <div className="md:hidden flex items-center">
          <Button
            isIconOnly
            variant="ghost"
            onClick={onOpenMobileNav}
            aria-label={s.layout.openMenu}
            className="rounded-xl border border-slate-200 dark:border-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Banner di errore globale */}
      {error && (
        <div className="bg-danger/15 border border-danger/40 text-slate-900 dark:text-white rounded-2xl p-4 text-xs font-bold shadow-xl flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          <span className="flex-1">{error}</span>
          {onErrorDismiss && (
            <button
              onClick={onErrorDismiss}
              className="ms-auto p-1 rounded-lg hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {header}

      {/* Contenuto: ErrorBoundary + Suspense con skeleton standard */}
      <div className="flex-1">
        <ContentErrorBoundary
          title={s.layout.contentErrorTitle}
          body={s.layout.contentErrorBody}
          retryLabel={s.layout.retry}
        >
          <Suspense fallback={<UserContentSkeleton />}>{children}</Suspense>
        </ContentErrorBoundary>
      </div>

      {/* Host dei toast */}
      {toast && onToastClose && (
        <ToastNotification message={toast.message} type={toast.type} onClose={onToastClose} />
      )}
    </main>
  );
};

UserMainBase.displayName = "UserMain";

// Re-export nominali + compound — pattern unico del framework: Object.assign
export { UserPageHeader };
export const UserMain = Object.assign(UserMainBase, {
  PageHeader: UserPageHeader,
});
