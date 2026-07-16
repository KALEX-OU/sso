"use client";

import React from "react";
import { Button, Chip, Checkbox, Modal, Label, Spinner } from "../ui";
import { listAppModules, getApplicationInfo } from "../../lib/resources.config";
import { MATRIX_APPS, getPermissionsFromMask, type RbacStructure, type RbacTemplateRole } from "../../lib/rbac-templates";
import { Shield, Lock, Check, Minus, History } from "lucide-react";
import type { PermissionAuditItemData } from "../../lib/schemas/api";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";

/**
 * UserPermission — componente UNICO dei permessi (P1/P2 RBAC_ENTERPRISE_PLAN).
 *
 * Due modalità:
 * - **edit** (team): matrice bitmask CRUD+List editabile, con template
 *   "Parti da: admin/member/viewer" derivati dalle rolePolicies del REGISTRY
 *   (buildRbacFromRole) — mai default cablati.
 * - **readonly** (membro): permessi EFFETTIVI risolti dal server (ruolo ∪ team)
 *   con colonna Origine (provenienza di ogni riga), più editor del ruolo IAM e
 *   assegnazione ai team (le vere leve del modello group-based).
 *
 * I moduli arrivano SEMPRE dal registry (listAppModules): la matrice segue
 * l'evoluzione del registro senza elenchi cablati.
 */

export {
  getPermissionsFromMask,
  getMaskFromPermissions,
  buildEmptyRbac,
  buildRbacFromRole
} from "../../lib/rbac-templates";
export type { RbacStructure, RbacTemplateRole } from "../../lib/rbac-templates";

const ROLES = ["owner", "admin", "member", "viewer"] as const;
const TEMPLATE_ROLES: readonly RbacTemplateRole[] = ["admin", "member", "viewer"] as const;
const ACTIONS = ["read", "list", "create", "update", "delete"] as const;

/** Permessi effettivi dal server: app → modulo → { mask, sources }. */
export type EffectivePermissionsMap = Record<string, Record<string, { mask: number; sources: string[] }>>;

export interface UserPermissionTeamOption {
  teamId: string;
  name: string;
}

export interface UserPermissionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Titolo e sottotitolo del dialogo (membro o team, già localizzati). */
  title: string;
  description: string;
  /** Matrice EDIT (team). Assente in modalità readonly. */
  rbac?: RbacStructure;
  onToggle?: (appKey: string, moduleKey: string, action: (typeof ACTIONS)[number]) => void;
  /** Template "Parti da" (solo edit): applica buildRbacFromRole. */
  onApplyTemplate?: (role: RbacTemplateRole) => void;
  /** Permessi EFFETTIVI readonly (membro), con provenienza. */
  effective?: EffectivePermissionsMap | null;
  /** Caricamento della vista effective in corso. */
  effectiveLoading?: boolean;
  /** Editor del ruolo IAM (solo membri, MAI su sé stessi — anti lock-out). */
  roleEditor?: {
    role: string;
    onRoleChange: (role: string) => void;
    lockedRoles?: readonly string[];
  };
  /** Assegnazione ai team (solo membri): applicata subito al toggle. */
  teamsEditor?: {
    teams: UserPermissionTeamOption[];
    memberTeamIds: readonly string[];
    onToggleTeam: (teamId: string, join: boolean) => void;
    pendingTeamId?: string | null;
  };
  saving: boolean;
  onSave: () => void;
  /** Nasconde il footer di salvataggio (readonly puro senza ruolo). */
  hideSave?: boolean;
  /** Timeline audit del target (N3): ultime modifiche ai permessi da P3.3. */
  audit?: {
    items: PermissionAuditItemData[];
    loading: boolean;
    /** Risolve l'uid dell'attore in etichetta leggibile (email/nome dai membri caricati). */
    resolveActor: (uid: string) => string;
  };
  /** Dirty state della matrice (N7): false → Salva disabilitato, true → badge modifiche. */
  dirty?: boolean;
}

export function UserPermission({
  isOpen,
  onOpenChange,
  title,
  description,
  rbac,
  onToggle,
  onApplyTemplate,
  effective,
  effectiveLoading = false,
  roleEditor,
  teamsEditor,
  saving,
  onSave,
  hideSave = false,
  audit,
  dirty
}: UserPermissionProps) {
  const s = useUIStrings();
  const isEdit = !!rbac && !!onToggle;

  /** Etichetta leggibile di una fonte ("role" → Ruolo; "team:X" → X). */
  const sourceLabel = (src: string) => (src === "role" ? s.team.sourceRole : src.replace(/^team:/, ""));

  /** Descrizione i18n di un evento audit (N3) dal record P3. */
  const auditLabel = (item: PermissionAuditItemData): string => {
    const beforeRec = (item.before || {}) as Record<string, unknown>;
    const afterRec = (item.after || {}) as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    switch (item.action) {
      case "member.invite":
        return fmtUI(s.team.actInvite, { role: str(afterRec.role) });
      case "member.role_change":
        return fmtUI(s.team.actRoleChange, { from: str(beforeRec.role), to: str(afterRec.role) });
      case "member.remove":
        return s.team.actMemberRemove;
      case "member.mfa_reset":
        return s.team.actMfaReset;
      case "team.create":
        return s.team.actTeamCreate;
      case "team.update":
        return s.team.actTeamUpdate;
      case "team.delete":
        return s.team.actTeamDelete;
      case "team.member_add":
        return fmtUI(s.team.actTeamMemberAdd, { name: str(afterRec.teamName) });
      case "team.member_remove":
        return fmtUI(s.team.actTeamMemberRemove, { name: str(beforeRec.teamName) });
      case "ownership.transfer":
        return s.team.actOwnershipTransfer;
      default:
        return item.action;
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Modal.Container className="h-auto w-full max-w-4xl flex-none p-0 sm:w-full sm:p-0">
          <Modal.Dialog className="w-full rounded-3xl border border-line bg-surface shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 border-b border-line pb-4">
              <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
                <Shield className="text-secondary w-4 h-4 shrink-0" />
                <span className="truncate">{title}</span>
              </h2>
              <p className="text-ink-muted text-xs font-normal">{description}</p>
            </Modal.Header>
            <Modal.Body className="py-6 space-y-6">
              {roleEditor && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-ink block">{s.team.mainRoleLabel}</Label>
                  <div className="flex gap-2">
                    {ROLES.map((r) => {
                      const locked = roleEditor.lockedRoles?.includes(r) ?? false;
                      return (
                        <Button
                          unstyled
                          variant="ghost"
                          key={r}
                          isDisabled={locked}
                          className={`flex-1 font-bold text-xs uppercase rounded-xl px-3 py-2.5 transition-all border ${
                            roleEditor.role === r
                              ? "bg-secondary text-white border-secondary shadow-md cursor-pointer"
                              : locked
                                ? "border-line bg-surface-2 text-ink-muted opacity-40 cursor-not-allowed"
                                : "border-line bg-surface-2 text-ink-muted hover:text-ink hover:bg-surface cursor-pointer"
                          }`}
                          onClick={() => roleEditor.onRoleChange(r)}
                        >
                          {r}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {teamsEditor && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-ink block">{s.team.memberTeamsLabel}</Label>
                  {teamsEditor.teams.length === 0 ? (
                    <p className="text-xs text-ink-muted">{s.team.noTeams}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {teamsEditor.teams.map((team) => {
                        const joined = teamsEditor.memberTeamIds.includes(team.teamId);
                        const pending = teamsEditor.pendingTeamId === team.teamId;
                        return (
                          <Button
                            unstyled
                            variant="ghost"
                            key={team.teamId}
                            isDisabled={pending}
                            className={`inline-flex items-center gap-1.5 font-bold text-xs rounded-xl px-3 py-2 transition-all border cursor-pointer ${
                              joined
                                ? "bg-secondary/10 text-secondary border-secondary/30"
                                : "border-line bg-surface-2 text-ink-muted hover:text-ink hover:bg-surface"
                            } ${pending ? "opacity-60" : ""}`}
                            onClick={() => teamsEditor.onToggleTeam(team.teamId, !joined)}
                          >
                            {pending ? <Spinner className="w-3 h-3" /> : joined ? <Check className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 opacity-40" />}
                            {team.name}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm font-bold text-ink">{isEdit ? s.team.matrixTitle : s.team.effectiveTitle}</h3>
                  <div className="flex items-center gap-2">
                    {isEdit && onApplyTemplate && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-ink-muted uppercase">{s.team.templatesLabel}</span>
                        {TEMPLATE_ROLES.map((r) => (
                          <Button
                            unstyled
                            variant="ghost"
                            key={r}
                            className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border border-line bg-surface-2 text-ink-muted hover:text-ink hover:bg-surface cursor-pointer transition-colors"
                            onClick={() => onApplyTemplate(r)}
                          >
                            {r}
                          </Button>
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] text-secondary font-bold bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> {s.team.bitmaskBadge}
                    </span>
                  </div>
                </div>
                {!isEdit && <p className="text-xs text-ink-muted -mt-2">{s.team.effectiveDesc}</p>}

                {effectiveLoading && !isEdit ? (
                  <div className="flex justify-center p-8"><Spinner /></div>
                ) : (
                  MATRIX_APPS.map((appId) => {
                    const modules = listAppModules(appId);
                    const appName = getApplicationInfo(appId)?.name || appId;
                    return (
                      <div key={appId} className="border border-line rounded-2xl bg-surface-raised overflow-hidden">
                        <div className="bg-surface-2 px-4 py-3 border-b border-line flex items-center justify-between">
                          <span className="text-xs font-extrabold text-ink">{appName}</span>
                          <Chip size="sm" variant="soft" color="default" className="font-bold text-[9px] uppercase">{appId}</Chip>
                        </div>

                        {/* Tabella nativa: colonne dimensionate dalle intestazioni (nowrap),
                            allineamento checkbox/etichette garantito per costruzione.
                            Lo scroll orizzontale vive in un wrapper DEDICATO: sul genitore
                            overflow-hidden (per i rounded) azzererebbe lo scroll e
                            taglierebbe le ultime colonne. */}
                        <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-surface-2/60 border-b border-line">
                              <th scope="col" className="text-start px-4 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap w-full">{s.team.colModule}</th>
                              <th scope="col" className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colRead}</th>
                              <th scope="col" className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colList}</th>
                              <th scope="col" className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colCreate}</th>
                              <th scope="col" className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colUpdate}</th>
                              <th scope="col" className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colDelete}</th>
                              {!isEdit && (
                                <th scope="col" className="text-start px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colSource}</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line">
                            {modules.map((moduleKey) => {
                              const mask = isEdit
                                ? rbac?.apps?.[appId]?.[moduleKey] || 0
                                : effective?.[appId]?.[moduleKey]?.mask || 0;
                              const sources = !isEdit ? effective?.[appId]?.[moduleKey]?.sources || [] : [];
                              const perms = getPermissionsFromMask(mask);
                              return (
                                <tr key={moduleKey} className="hover:bg-surface-2/60 transition-colors">
                                  <th scope="row" className="text-start px-4 py-3 text-xs font-bold text-ink capitalize">{moduleKey.replace(/_/g, " ")}</th>
                                  {ACTIONS.map((action) => (
                                    <td key={action} className="px-3 py-3 text-center">
                                      {isEdit ? (
                                        <Checkbox
                                          aria-label={fmtUI(s.team.permAria, { action, module: moduleKey })}
                                          isSelected={perms[action]}
                                          onChange={() => onToggle?.(appId, moduleKey, action)}
                                          className="inline-flex"
                                        >
                                          <Checkbox.Control>
                                            <Checkbox.Indicator />
                                          </Checkbox.Control>
                                        </Checkbox>
                                      ) : perms[action] ? (
                                        <Check className="w-4 h-4 text-success inline-block" aria-label={fmtUI(s.team.permAria, { action, module: moduleKey })} />
                                      ) : (
                                        <Minus className="w-3.5 h-3.5 text-ink-muted/40 inline-block" aria-hidden />
                                      )}
                                    </td>
                                  ))}
                                  {!isEdit && (
                                    <td className="px-3 py-3">
                                      <div className="flex flex-wrap gap-1">
                                        {sources.map((src) => (
                                          <Chip key={src} size="sm" variant="soft" className={`text-[9px] font-semibold ${src === "role" ? "bg-secondary/10 text-secondary border border-secondary/30" : "border border-line"}`}>
                                            {sourceLabel(src)}
                                          </Chip>
                                        ))}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {audit && (
                <div className="space-y-3 border-t border-line pt-5">
                  <h3 className="text-xs font-extrabold text-ink flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-secondary" /> {s.team.auditTitle}
                  </h3>
                  {audit.loading ? (
                    <div className="flex justify-center p-4"><Spinner /></div>
                  ) : audit.items.length === 0 ? (
                    <p className="text-xs text-ink-muted">{s.team.auditEmpty}</p>
                  ) : (
                    <ol className="space-y-2">
                      {audit.items.map((item) => (
                        <li key={item.id} className="flex items-start gap-3 text-xs">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary/60 shrink-0" aria-hidden />
                          <div className="min-w-0">
                            <p className="text-ink font-semibold">{auditLabel(item)}</p>
                            <p className="text-ink-muted">
                              {fmtUI(s.team.auditBy, { actor: audit.resolveActor(item.actorUid) })} · {new Date(item.ts).toLocaleString()}
                              {item.reason ? ` — ${item.reason}` : ""}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="pt-4 flex items-center justify-end gap-3 border-t border-line">
              {isEdit && dirty && (
                <span className="me-auto inline-flex items-center gap-1.5 text-[10px] font-bold text-warning">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" aria-hidden />
                  {s.team.unsavedBadge}
                </span>
              )}
              <Button
                unstyled
                variant="ghost"
                className="px-4 py-2.5 text-xs font-bold border border-line hover:bg-surface-2 text-ink-muted rounded-xl cursor-pointer transition-colors"
                onClick={() => onOpenChange(false)}
              >
                {hideSave ? s.common.close : s.common.cancel}
              </Button>
              {!hideSave && (
                <Button unstyled className="klx-btn klx-btn--primary" isDisabled={saving || dirty === false} onClick={onSave}>
                  {saving ? s.team.saving : s.common.save}
                </Button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
