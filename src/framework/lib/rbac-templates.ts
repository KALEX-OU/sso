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
