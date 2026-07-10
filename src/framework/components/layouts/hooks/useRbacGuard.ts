"use client";

import { useCallback, useEffect } from "react";
import type { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import { getRegistryApp } from "@/framework/lib/resources.config";
import type { CustomClaims } from "@/framework/lib/types";

// E4.3b — Hook estratto meccanicamente da layouts.tsx: route guard RBAC proattivo.
// Espone `hasPermission` (usato anche dal DashboardContext) e reindirizza alla dashboard
// quando l'utente accede a un modulo per cui il suo ruolo non ha permesso di lettura.

interface UseRbacGuardParams {
  appId: string;
  loading: boolean;
  firebaseUser: FirebaseUser | null;
  authClaims: CustomClaims | null;
  pathname: string;
  router: ReturnType<typeof useRouter>;
}

export interface RbacGuardApi {
  hasPermission: (module: string, action: "read" | "create" | "update" | "delete") => boolean;
}

export function useRbacGuard({
  appId,
  loading,
  firebaseUser,
  authClaims,
  pathname,
  router
}: UseRbacGuardParams): RbacGuardApi {
  // Controlla se il ruolo dell'utente ha i privilegi RBAC per compiere l'azione
  const hasPermission = useCallback((module: string, action: "read" | "create" | "update" | "delete"): boolean => {
    if (!authClaims) return false;

    const userRoleRaw = authClaims.uRole || authClaims.role;
    // Bypass completo per l'owner
    if (userRoleRaw === "owner") return true;

    // Recupera la policy definita staticamente nel registro (SSOT)
    const appConfig = getRegistryApp(appId);
    if (!appConfig) return false;
    const moduleConfig = appConfig.modules[module];
    if (!moduleConfig) return false;

    const userRole = (userRoleRaw?.toLowerCase() || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
    const policy = moduleConfig.rolePolicies[userRole] || moduleConfig.rolePolicies["viewer"];

    if (!policy) return false;

    switch (action) {
      case "read": return !!(policy.canRead || policy.canList);
      case "create": return !!policy.canCreate;
      case "update": return !!policy.canUpdate;
      case "delete": return !!policy.canDelete;
      default: return false;
    }
  }, [authClaims, appId]);

  // Controllo proattivo dei permessi di accesso alle rotte (RBAC Security)
  useEffect(() => {
    if (loading || !firebaseUser || !authClaims) return;

    const locale = pathname.split("/")[1] || "en";
    const relativePath = pathname.replace(new RegExp(`^\\/[a-z]{2}`), "");
    const cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;

    // Se l'utente accede ad una sotto-rotta specifica che non sia dashboard o auth
    const isDashboardPath = appId === "sso"
      ? cleanPath.startsWith("dashboard")
      : (cleanPath === "" || cleanPath.startsWith("dashboard"));

    if (cleanPath && !isDashboardPath && !cleanPath.startsWith("auth") && !cleanPath.startsWith("support")) {
      const appConfig = getRegistryApp(appId);
      if (appConfig) {
        // Cerca se la rotta corrisponde a un modulo registrato
        const modulesList = Object.keys(appConfig.modules);
        const matchedModule = modulesList.find(mod => cleanPath === mod || cleanPath.startsWith(mod + "/"));

        if (matchedModule && !hasPermission(matchedModule, "read")) {
          console.warn(`[RBAC Guard] Accesso negato a '/${cleanPath}'. Ruolo '${authClaims.uRole}' non autorizzato. Reindirizzamento.`);
          const dashboardRedirectPath = appId === "sso" ? "dashboard" : "";
          router.push(`/${locale}/${dashboardRedirectPath}`);
        }
      }
    }
  }, [loading, firebaseUser, authClaims, pathname, appId, router, hasPermission]);

  return { hasPermission };
}
