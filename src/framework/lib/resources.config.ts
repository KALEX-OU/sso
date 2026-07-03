// framework/src/lib/resources.config.ts
// Entry point pubblico della SSOT: importa le definizioni di modulo da ./resources/*
// ed espone registri, tipi e helper con API invariata.

// NB: import relativi SENZA estensione (obbligatorio per Turbopack, che non risolve .js→.ts).
// Il backend api (moduleResolution NodeNext) richiede invece estensioni .js esplicite:
// ci pensa sync-framework.js, che adatta gli specifier nelle copie destinate ad api.
import type * as LucideIcons from "lucide-react";
import type { RegistryApp } from "./resources/shared";
import { dashboardModule } from "./resources/dashboard.module";
import { userModule } from "./resources/user.module";
import { teamModule } from "./resources/team.module";
import { subscriptionModule } from "./resources/subscription.module";
import { checkoutModule } from "./resources/checkout.module";
import { invoiceModule } from "./resources/invoice.module";
import { paymentModule } from "./resources/payment.module";
import { computeModule } from "./resources/compute.module";
import { productConsumeModule } from "./resources/product-consume.module";
import { apikeyModule } from "./resources/apikey.module";
import { thingModule } from "./resources/thing.module";
import { productModule } from "./resources/product.module";
import { productpriceModule } from "./resources/productprice.module";
import { organizationModule } from "./resources/organization.module";

export type LucideIconName = keyof typeof LucideIcons;

// ==========================================
// REGISTRO GLOBAL DEGLI ELEMENTI (SSOT)
// ==========================================

export const MODULE_REGISTRY = {
  dashboard: dashboardModule,
  user: userModule,
  team: teamModule,
  subscription: subscriptionModule,
  checkout: checkoutModule,
  invoice: invoiceModule,
  payment: paymentModule,
  compute: computeModule,
  product_consume: productConsumeModule,
  apikey: apikeyModule,
  thing: thingModule,
  product: productModule,
  productprice: productpriceModule,
  organization: organizationModule
} as const;

export const APPLICATION_REGISTRY = {
  sso: {
    name: "KALEX SSO Console",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["dashboard", "user", "team", "subscription", "checkout", "invoice", "payment", "compute", "product_consume", "apikey", "thing", "product", "productprice", "organization"] as const
  },
  web: {
    name: "KALEX Web Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  etics: {
    name: "KALEX ETICS Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  stand: {
    name: "KALEX Stand Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  drone: {
    name: "KALEX Drone Flight Planner",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard", "thing"] as const
  },
  photogrammetry: {
    name: "KALEX Photogrammetry Processor",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  }
} as const;

// ==========================================
// PONTE DI RETROCOMPATIBILITÀ (RESOURCE_REGISTRY)
// ==========================================

export const RESOURCE_REGISTRY = {
  sso: {
    name: APPLICATION_REGISTRY.sso.name,
    enabled: APPLICATION_REGISTRY.sso.enabled,
    modules: {
      dashboard: dashboardModule,
      user: userModule,
      team: teamModule,
      subscription: subscriptionModule,
      checkout: checkoutModule,
      invoice: invoiceModule,
      payment: paymentModule,
      compute: computeModule,
      product_consume: productConsumeModule,
      apikey: apikeyModule,
      thing: thingModule,
      product: productModule,
      productprice: productpriceModule,
      organization: organizationModule
    }
  },
  web: {
    name: APPLICATION_REGISTRY.web.name,
    enabled: APPLICATION_REGISTRY.web.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  etics: {
    name: APPLICATION_REGISTRY.etics.name,
    enabled: APPLICATION_REGISTRY.etics.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  stand: {
    name: APPLICATION_REGISTRY.stand.name,
    enabled: APPLICATION_REGISTRY.stand.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  drone: {
    name: APPLICATION_REGISTRY.drone.name,
    enabled: APPLICATION_REGISTRY.drone.enabled,
    modules: {
      dashboard: dashboardModule,
      thing: thingModule
    }
  },
  photogrammetry: {
    name: APPLICATION_REGISTRY.photogrammetry.name,
    enabled: APPLICATION_REGISTRY.photogrammetry.enabled,
    modules: {
      dashboard: dashboardModule
    }
  }
} as const;

export type AppIds = keyof typeof RESOURCE_REGISTRY;
export type ModuleIds<A extends AppIds> = keyof typeof RESOURCE_REGISTRY[A]["modules"];

export interface SecurityPolicy {
  readonly canCreate: boolean;
  readonly canRead: boolean;
  readonly canUpdate: boolean;
  readonly canDelete: boolean;
  readonly canList: boolean;
  readonly allowedFields: readonly string[];
}

export interface FieldValidation {
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly email?: boolean;
  readonly enum?: readonly string[] | string[];
  readonly format?: "vat" | "personal_id" | "sdi";
  readonly positive?: boolean;
  readonly default?: unknown;
}

export interface FieldConfig {
  readonly type: "String" | "Boolean" | "Float" | "Timestamp" | "Any";
  readonly encrypted?: boolean;
  readonly render?: boolean;
  readonly hidden?: boolean;
  readonly order?: number;
  readonly colSpan?: 1 | 2;
  readonly label?: string;
  readonly placeholder?: string;
  readonly options?: readonly string[] | string[];
  readonly validation?: FieldValidation;
  readonly graphql?: {
    readonly nullable?: boolean;
    readonly directive?: string;
    readonly relation?: string;
    readonly dbName?: string;
    readonly dbType?: string;
    readonly dbIgnore?: boolean;
  };
}

export interface AppInfo {
  readonly id: AppIds;
  readonly name: string;
  readonly enabled: boolean;
}

export interface ModuleInfo {
  readonly id: keyof typeof MODULE_REGISTRY;
  readonly name: string;
  readonly icon?: LucideIconName;
  readonly fields: Record<string, FieldConfig>;
  readonly rolePolicies: Record<string, SecurityPolicy>;
  readonly formFields?: readonly string[];
  readonly listFields?: readonly string[];
}

// ==========================================
// METODI HELPER SSOT (SINGLE SOURCE OF TRUTH)
// ==========================================

export function listApplications(): AppInfo[] {
  return Object.entries(APPLICATION_REGISTRY).map(([id, app]) => ({
    id: id as AppIds,
    name: app.name,
    enabled: app.enabled
  }));
}

export function listModules(): ModuleInfo[] {
  return Object.entries(MODULE_REGISTRY).map(([id, mod]) => ({
    id: id as keyof typeof MODULE_REGISTRY,
    name: mod.name,
    icon: "icon" in mod ? (mod as { icon: LucideIconName }).icon : undefined,
    fields: mod.fields as Record<string, FieldConfig>,
    rolePolicies: mod.rolePolicies as Record<string, SecurityPolicy>
  }));
}

export function listAppModules(appId: AppIds): string[] {
  const app = APPLICATION_REGISTRY[appId];
  if (!app) return [];
  return [...app.modules];
}

export function getApplicationInfo(appId: AppIds): { readonly name: string; readonly enabled: boolean } | null {
  const app = APPLICATION_REGISTRY[appId];
  if (!app) return null;
  return {
    name: app.name,
    enabled: app.enabled
  };
}

export function getModuleInfo(moduleId: string): ModuleInfo | null {
  const mod = MODULE_REGISTRY[moduleId as keyof typeof MODULE_REGISTRY];
  if (!mod) return null;
  return {
    id: moduleId as keyof typeof MODULE_REGISTRY,
    name: mod.name,
    icon: "icon" in mod ? (mod as { icon: LucideIconName }).icon : undefined,
    fields: mod.fields as Record<string, FieldConfig>,
    rolePolicies: mod.rolePolicies as Record<string, SecurityPolicy>,
    formFields: "formFields" in mod ? (mod as { formFields: readonly string[] }).formFields : undefined,
    listFields: "listFields" in mod ? (mod as { listFields: readonly string[] }).listFields : undefined
  };
}

/**
 * Restituisce la configurazione tipizzata di un'applicazione dal registro (nome, enabled, moduli).
 * Concentra qui l'unica coercizione necessaria dalla forma `as const` di RESOURCE_REGISTRY,
 * così i consumer (Sidebar, layout) non devono più usare cast `as unknown as`.
 */
export function getRegistryApp(appId: string): RegistryApp | undefined {
  const app = RESOURCE_REGISTRY[appId as keyof typeof RESOURCE_REGISTRY];
  if (!app) return undefined;
  return app as unknown as RegistryApp;
}

export function hasModule(appId: AppIds, moduleId: string): boolean {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return false;
  return moduleId in app.modules;
}

interface PolicyRule {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canList: boolean;
  allowedFields: readonly string[];
}

type RolePolicyMap = Record<string, PolicyRule>;

interface ContextPolicyMap {
  buyer?: RolePolicyMap;
  seller?: RolePolicyMap;
}

export function getModulePolicyForContext(
  moduleId: keyof typeof MODULE_REGISTRY,
  userRole: "owner" | "admin" | "member" | "viewer" | "device",
  orgRole?: "buyer" | "seller" | "both"
): SecurityPolicy | null {
  const mod = MODULE_REGISTRY[moduleId];
  if (!mod) return null;

  // Se l'utente è "owner", ha sempre il bypass completo di lettura/scrittura
  if (userRole === "owner") {
    return {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canList: true,
      allowedFields: Object.keys(mod.fields)
    };
  }

  // 1. Se è specificato un ruolo organizzativo ed esiste contextPolicies
  if (orgRole && "contextPolicies" in mod) {
    const contextPolicies = mod.contextPolicies as unknown as ContextPolicyMap;
    
    if (orgRole === "both") {
      // In caso di "both", uniamo i permessi di buyer e seller (OR logico)
      const buyerPolicy = contextPolicies.buyer?.[userRole];
      const sellerPolicy = contextPolicies.seller?.[userRole];
      if (buyerPolicy && sellerPolicy) {
        return {
          canCreate: buyerPolicy.canCreate || sellerPolicy.canCreate,
          canRead: buyerPolicy.canRead || sellerPolicy.canRead,
          canUpdate: buyerPolicy.canUpdate || sellerPolicy.canUpdate,
          canDelete: buyerPolicy.canDelete || sellerPolicy.canDelete,
          canList: buyerPolicy.canList || sellerPolicy.canList,
          allowedFields: Array.from(new Set([...buyerPolicy.allowedFields, ...sellerPolicy.allowedFields]))
        };
      }
    } else {
      const context = contextPolicies[orgRole];
      if (context && userRole in context) {
        return context[userRole];
      }
    }
  }

  // 2. Fallback alle rolePolicies piatte
  if ("rolePolicies" in mod) {
    const rolePolicies = mod.rolePolicies as unknown as RolePolicyMap;
    if (userRole in rolePolicies) {
      return rolePolicies[userRole];
    }
  }

  return null;
}

export function getVisibleModulesForSidebar(
  appId: AppIds,
  userRole: "owner" | "admin" | "member" | "viewer" | "device",
  orgRole?: "buyer" | "seller" | "both"
): string[] {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return [];

  if (userRole === "owner") {
    return Object.keys(app.modules);
  }

  return Object.keys(app.modules).filter((moduleId) => {
    const policy = getModulePolicyForContext(
      moduleId as keyof typeof MODULE_REGISTRY,
      userRole,
      orgRole
    );
    return policy ? (policy.canRead || policy.canList) : false;
  });
}
