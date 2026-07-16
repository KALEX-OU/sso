"use client";

import React from "react";
import { Button, Chip, Checkbox, Modal, Label } from "../ui";
import { listAppModules, getApplicationInfo, AppIds } from "../../lib/resources.config";
import { Shield, Lock } from "lucide-react";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";

/**
 * Matrice permessi RBAC (bitmask CRUD) condivisa tra membri e team — modale
 * di UserTeam. I moduli arrivano dal registry SSOT (listAppModules), MAI da
 * elenchi cablati: la matrice segue automaticamente l'evoluzione del registro.
 */

export interface RbacStructure {
  apps: Record<string, Record<string, number>>;
}

export const getPermissionsFromMask = (mask: number) => ({
  read: (mask & 1) === 1,
  create: (mask & 2) === 2,
  update: (mask & 4) === 4,
  delete: (mask & 8) === 8
});

export const getMaskFromPermissions = (perms: { read: boolean; create: boolean; update: boolean; delete: boolean }) => {
  let mask = 0;
  if (perms.read) mask |= 1;
  if (perms.create) mask |= 2;
  if (perms.update) mask |= 4;
  if (perms.delete) mask |= 8;
  return mask;
};

/** App mostrate nella matrice (moduli dal registry). */
const MATRIX_APPS: readonly AppIds[] = ["sso", "web"] as const;

/** Rbac di default derivato dal registry: full (15) per ruoli privilegiati, read (1) altrimenti. */
export function buildDefaultRbac(privileged: boolean): RbacStructure {
  const apps: Record<string, Record<string, number>> = {};
  for (const appId of MATRIX_APPS) {
    apps[appId] = {};
    for (const moduleId of listAppModules(appId)) {
      apps[appId][moduleId] = privileged ? 15 : 1;
    }
  }
  return { apps };
}

const ROLES = ["owner", "admin", "member", "viewer"] as const;
const ACTIONS = ["read", "create", "update", "delete"] as const;

export interface UserTeamPermissionsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Titolo e sottotitolo del dialogo (membro o team, già localizzati). */
  title: string;
  description: string;
  rbac: RbacStructure;
  onToggle: (appKey: string, moduleKey: string, action: (typeof ACTIONS)[number]) => void;
  /** Editor del ruolo IAM (solo per i membri; i team non hanno ruolo). */
  roleEditor?: {
    role: string;
    onRoleChange: (role: string) => void;
  };
  saving: boolean;
  onSave: () => void;
}

export function UserTeamPermissions({
  isOpen,
  onOpenChange,
  title,
  description,
  rbac,
  onToggle,
  roleEditor,
  saving,
  onSave
}: UserTeamPermissionsProps) {
  const s = useUIStrings();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Modal.Container className="h-auto w-full max-w-3xl flex-none p-0 sm:w-full sm:p-0">
          <Modal.Dialog className="w-full rounded-3xl border border-line bg-surface-raised backdrop-blur-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 border-b border-line pb-4">
              <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
                <Shield className="text-secondary w-5 h-5" />
                {title}
              </h2>
              <p className="text-ink-muted text-xs font-normal">{description}</p>
            </Modal.Header>
            <Modal.Body className="py-6 space-y-6">
              {roleEditor && (
                <div className="bg-surface-2 p-4 rounded-2xl border border-line space-y-3">
                  <Label className="text-xs font-bold text-ink block">{s.team.mainRoleLabel}</Label>
                  <div className="flex gap-2">
                    {ROLES.map((r) => (
                      <Button
                        unstyled
                        key={r}
                        className={`flex-1 font-bold text-xs uppercase rounded-xl px-3 py-2.5 cursor-pointer transition-all border ${
                          roleEditor.role === r
                            ? "bg-secondary text-white border-secondary"
                            : "border-line text-ink-muted hover:bg-surface-2 hover:text-ink"
                        }`}
                        onClick={() => roleEditor.onRoleChange(r)}
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink">{s.team.matrixTitle}</h3>
                  <span className="text-[10px] text-secondary font-bold bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> {s.team.bitmaskBadge}
                  </span>
                </div>

                {MATRIX_APPS.map((appId) => {
                  const modules = listAppModules(appId);
                  const appName = getApplicationInfo(appId)?.name || appId;
                  return (
                    <div key={appId} className="border border-line rounded-2xl bg-surface-2 overflow-hidden">
                      <div className="bg-surface px-4 py-3 border-b border-line flex items-center justify-between">
                        <span className="text-xs font-extrabold text-ink">{appName}</span>
                        <Chip size="sm" variant="soft" color="default" className="font-bold text-[9px] uppercase">{appId}</Chip>
                      </div>

                      <div className="divide-y divide-line">
                        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-surface text-[10px] font-extrabold text-ink-muted uppercase">
                          <div className="col-span-4">{s.team.colModule}</div>
                          <div className="col-span-2 text-center">{s.team.colRead}</div>
                          <div className="col-span-2 text-center">{s.team.colCreate}</div>
                          <div className="col-span-2 text-center">{s.team.colUpdate}</div>
                          <div className="col-span-2 text-center">{s.team.colDelete}</div>
                        </div>

                        {modules.map((moduleKey) => {
                          const currentVal = rbac?.apps?.[appId]?.[moduleKey] || 0;
                          const perms = getPermissionsFromMask(currentVal);
                          return (
                            <div key={moduleKey} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-surface transition-colors">
                              <div className="col-span-4">
                                <p className="text-xs font-bold text-ink capitalize">{moduleKey.replace(/_/g, " ")}</p>
                              </div>
                              {ACTIONS.map((action) => (
                                <div key={action} className="col-span-2 flex justify-center">
                                  <Checkbox
                                    aria-label={fmtUI(s.team.permAria, { action, module: moduleKey })}
                                    isSelected={perms[action]}
                                    onChange={() => onToggle(appId, moduleKey, action)}
                                  >
                                    <Checkbox.Control>
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                  </Checkbox>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Modal.Body>
            <Modal.Footer className="pt-4 flex justify-end gap-2 border-t border-line">
              <Button unstyled variant="ghost" className="rounded-xl font-bold cursor-pointer px-4 py-2.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors" onClick={() => onOpenChange(false)}>
                {s.common.cancel}
              </Button>
              <Button unstyled className="rounded-xl font-bold cursor-pointer px-4 py-2.5 text-xs bg-secondary hover:bg-secondary/90 text-white transition-colors" isDisabled={saving} onClick={onSave}>
                {saving ? s.team.saving : s.common.save}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
