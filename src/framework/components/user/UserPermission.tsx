"use client";

import React from "react";
import { Button, Chip, Checkbox, Modal, Label, Spinner, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "../ui";
import { listAppModules, getApplicationInfo, type AppIds } from "../../lib/resources.config";
import { MATRIX_APPS, getPermissionsFromMask, type RbacStructure, type RbacTemplateRole } from "../../lib/rbac-templates";
import { Shield, Lock, Check, Minus, History, Copy } from "lucide-react";
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
  /** N6: toggle di massa — intera riga (modulo) o intera colonna (azione). */
  onToggleRow?: (appKey: string, moduleKey: string) => void;
  onToggleColumn?: (appKey: string, action: (typeof ACTIONS)[number]) => void;
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
    /** N11: visibile solo quando il ruolo scelto è un DECLASSAMENTO reale. */
    downgradeRevoke?: {
      checked: boolean;
      onChange: (checked: boolean) => void;
    };
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
  onToggleRow,
  onToggleColumn,
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
  // Un'app per volta (richiesta owner): matrice sempre intera, niente scroll orizzontale.
  const isMatrixApp = (v: string): v is AppIds => MATRIX_APPS.some((a) => a === v);
  const [selectedApp, setSelectedApp] = React.useState<AppIds>(MATRIX_APPS[0]);
  const [effectiveCopied, setEffectiveCopied] = React.useState(false);

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
          {/* max-w esplicito sul Dialog: il default HeroUI (max-w-md, 448px) vince
              sul max-w del Container e strozzava la matrice tagliando le colonne. */}
          <Modal.Dialog className="w-full max-w-4xl rounded-3xl border border-line bg-surface shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
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
                  {roleEditor.downgradeRevoke && (
                    <Checkbox
                      isSelected={roleEditor.downgradeRevoke.checked}
                      onChange={(sel) => roleEditor.downgradeRevoke?.onChange(sel)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Label className="text-xs text-ink-muted cursor-pointer">{s.team.revokeOnDowngrade}</Label>
                    </Checkbox>
                  )}
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
                    <span
                      title={s.team.bitmaskTooltip}
                      className="text-[10px] text-secondary font-bold bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 cursor-help"
                    >
                      <Lock className="w-3 h-3" /> {s.team.bitmaskBadge}
                    </span>
                    {!isEdit && effective && (
                      <Button
                        unstyled
                        variant="ghost"
                        aria-label={s.team.copyEffective}
                        onClick={() => {
                          void navigator.clipboard.writeText(JSON.stringify(effective, null, 2)).then(() => {
                            setEffectiveCopied(true);
                            window.setTimeout(() => setEffectiveCopied(false), 2000);
                          });
                        }}
                        className="p-1.5 rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface-2 cursor-pointer transition-colors"
                      >
                        {effectiveCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    )}
                  </div>
                </div>
                {!isEdit && <p className="text-xs text-ink-muted -mt-2">{s.team.effectiveDesc}</p>}

                {effectiveLoading && !isEdit ? (
                  <div className="flex justify-center p-8"><Spinner /></div>
                ) : (
                  (() => {
                    const appId = selectedApp;
                    const modules = listAppModules(appId);
                    return (
                      <div key={appId} className="border border-line rounded-2xl bg-surface-raised overflow-hidden">
                        <div className="bg-surface-2 px-4 py-2.5 border-b border-line flex items-center justify-between gap-3">
                          <Select
                            selectedKey={appId}
                            onSelectionChange={(key) => { if (typeof key === "string" && isMatrixApp(key)) setSelectedApp(key); }}
                            aria-label={s.team.appSelectLabel}
                            className="min-w-0"
                          >
                            <SelectTrigger className="bg-surface border border-line rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-extrabold text-ink cursor-pointer hover:bg-surface-2 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectPopover className="bg-surface border border-line rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                              <ListBox className="outline-none">
                                {MATRIX_APPS.map((id) => (
                                  <ListBoxItem key={id} id={id} textValue={getApplicationInfo(id)?.name || id} className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-ink hover:bg-surface-2">
                                    {getApplicationInfo(id)?.name || id}
                                  </ListBoxItem>
                                ))}
                              </ListBox>
                            </SelectPopover>
                          </Select>
                          <Chip size="sm" variant="soft" color="default" className="font-bold text-[9px] uppercase">{appId}</Chip>
                        </div>

                        {/* Tabella nativa a piena larghezza: un'app per volta e NIENTE
                            width forzate sulle colonne (un w-full sul primo th spingeva
                            la tabella oltre il contenitore tagliando le ultime colonne).
                            Il wrapper overflow è solo salvagente per viewport minuscoli. */}
                        <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-surface-2/60 border-b border-line">
                              <th scope="col" className="text-start px-4 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">{s.team.colModule}</th>
                              {([
                                ["read", s.team.colRead],
                                ["list", s.team.colList],
                                ["create", s.team.colCreate],
                                ["update", s.team.colUpdate],
                                ["delete", s.team.colDelete]
                              ] as const).map(([action, label]) => (
                                <th key={action} scope="col" title={isEdit && onToggleColumn ? s.team.toggleColumnHint : undefined} className="text-center px-3 py-2 text-[10px] font-extrabold text-ink-muted uppercase whitespace-nowrap">
                                  {isEdit && onToggleColumn ? (
                                    <Button
                                      unstyled
                                      variant="ghost"
                                      aria-label={`${label} — ${s.team.toggleColumnHint}`}
                                      onClick={() => onToggleColumn(appId, action)}
                                      className="uppercase font-extrabold text-[10px] text-ink-muted hover:text-secondary cursor-pointer transition-colors"
                                    >
                                      {label}
                                    </Button>
                                  ) : (
                                    label
                                  )}
                                </th>
                              ))}
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
                                  <th scope="row" title={isEdit && onToggleRow ? s.team.toggleRowHint : undefined} className="text-start px-4 py-3 text-xs font-bold text-ink capitalize">
                                    {isEdit && onToggleRow ? (
                                      <Button
                                        unstyled
                                        variant="ghost"
                                        aria-label={`${moduleKey} — ${s.team.toggleRowHint}`}
                                        onClick={() => onToggleRow(appId, moduleKey)}
                                        className="font-bold text-xs text-ink capitalize hover:text-secondary cursor-pointer transition-colors"
                                      >
                                        {moduleKey.replace(/_/g, " ")}
                                      </Button>
                                    ) : (
                                      moduleKey.replace(/_/g, " ")
                                    )}
                                  </th>
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
                  })()
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
