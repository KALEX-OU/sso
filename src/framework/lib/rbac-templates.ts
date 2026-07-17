import { listAppModules, getModulePolicyForContext, AppIds, MODULE_REGISTRY } from "./resources.config";

/**
 * Template e helper RBAC lato client (P2.1 RBAC_ENTERPRISE_PLAN) — modulo PURO
 * (niente React): usato da user/UserPermission e testabile in isolamento
 * (tests/unit/rbac-registry-roundtrip). Tutto deriva dal RESOURCE_REGISTRY:
 * mai maschere cablate.
 */

export interface RbacStructure {
  apps: Record<string, Record<string, number>>;
}

/** Mask CRUD+List allineata al server (api/src/lib/rbac.ts): 31 = tutto. */
export const getPermissionsFromMask = (mask: number) => ({
  read: (mask & 1) === 1,
  create: (mask & 2) === 2,
  update: (mask & 4) === 4,
  delete: (mask & 8) === 8,
  list: (mask & 16) === 16
});

export const getMaskFromPermissions = (perms: { read: boolean; create: boolean; update: boolean; delete: boolean; list: boolean }) => {
  let mask = 0;
  if (perms.read) mask |= 1;
  if (perms.create) mask |= 2;
  if (perms.update) mask |= 4;
  if (perms.delete) mask |= 8;
  if (perms.list) mask |= 16;
  return mask;
};

/** App mostrate nella matrice permessi (moduli dal registry). */
export const MATRIX_APPS: readonly AppIds[] = ["sso", "web"] as const;

/** Rbac VUOTO: i team sono ADDITIVI rispetto al ruolo — si parte da zero o da un template. */
export function buildEmptyRbac(): RbacStructure {
  const apps: Record<string, Record<string, number>> = {};
  for (const appId of MATRIX_APPS) {
    apps[appId] = {};
  }
  return { apps };
}

export type RbacTemplateRole = "admin" | "member" | "viewer";

/** Template dal REGISTRY: mask derivata dalle rolePolicies per ogni modulo. */
export function buildRbacFromRole(role: RbacTemplateRole): RbacStructure {
  const apps: Record<string, Record<string, number>> = {};
  for (const appId of MATRIX_APPS) {
    apps[appId] = {};
    for (const moduleId of listAppModules(appId)) {
      const policy = getModulePolicyForContext(moduleId as keyof typeof MODULE_REGISTRY, role, undefined);
      let mask = 0;
      if (policy?.canRead) mask |= 1;
      if (policy?.canCreate) mask |= 2;
      if (policy?.canUpdate) mask |= 4;
      if (policy?.canDelete) mask |= 8;
      if (policy?.canList) mask |= 16;
      apps[appId][moduleId] = mask;
    }
  }
  return { apps };
}

/* ── Team template dal registry (N9, RBAC_ENTERPRISE_PLAN) ─────────────────
   Preset DICHIARATIVI: niente maschere cablate — il grant deriva dalle
   rolePolicies del registry (policy admin) al momento della creazione, così
   i template seguono l'evoluzione della SSOT. */

export interface TeamTemplate {
  id: "administration" | "billing" | "readonly";
  /** Moduli inclusi per app; "all" = tutti i moduli del registry. */
  scope: "all" | Partial<Record<AppIds, readonly string[]>>;
  /** manage = mask della policy admin; read = soli bit Read+List di quella policy. */
  grant: "manage" | "read";
}

export const TEAM_TEMPLATES: readonly TeamTemplate[] = [
  { id: "administration", scope: "all", grant: "manage" },
  {
    id: "billing",
    scope: { sso: ["subscription", "checkout", "invoice", "payment", "product", "productprice"] },
    grant: "manage"
  },
  { id: "readonly", scope: "all", grant: "read" }
] as const;

export function buildRbacFromTemplate(template: TeamTemplate): RbacStructure {
  const adminRbac = buildRbacFromRole("admin");
  const apps: Record<string, Record<string, number>> = {};
  for (const appId of MATRIX_APPS) {
    const appModules = listAppModules(appId);
    // Intersezione con i moduli REALI dell'app: chiavi ignote non passerebbero
    // la validazione server (rbacStructureSchema strict).
    const wanted =
      template.scope === "all" ? appModules : (template.scope[appId] ?? []).filter((m) => appModules.some((real) => real === m));
    if (wanted.length === 0) continue;
    apps[appId] = {};
    for (const moduleId of wanted) {
      const adminMask = adminRbac.apps[appId]?.[moduleId] ?? 0;
      const mask = template.grant === "read" ? adminMask & (1 | 16) : adminMask;
      if (mask > 0) apps[appId][moduleId] = mask;
    }
  }
  return { apps };
}
