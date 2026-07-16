"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { apiEnvelopeSchema, teamListResponseSchema, type TeamItemData } from "../../lib/schemas/api";
import { UserPageHeader } from "./UserMain";
import { UserCard } from "./UserCard";
import {
  Avatar,
  Button,
  Chip,
  Checkbox,
  Input,
  Label,
  TextField,
  TextArea,
  Modal,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  EmptyState,
  Spinner
} from "../ui";
import {
  UserTeamPermissions,
  buildDefaultRbac,
  getPermissionsFromMask,
  getMaskFromPermissions,
  type RbacStructure
} from "./UserTeamPermissions";
import { Users, Plus, Shield, Trash2, Settings2, Copy, UserPlus, AlertTriangle } from "lucide-react";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";

/**
 * Pagina TEAM (/team) — gestione UNIFICATA di membri e team dell'organizzazione
 * (fusione delle vecchie pagine sso "Gestione Utenti" e "Gestione Team"):
 * inviti, ruoli IAM, permessi RBAC per membro e per team, reset 2FA assistito
 * (P1-94), rimozioni. Raggiungibile dal UserMenu (owner), fuori dalla sidebar
 * (USER_MENU_MODULES).
 *
 * Rete: fetchAuthedClient del framework (Bearer + App Check + CSRF + dialogo
 * di riconferma step-up con retry sui 403). Unica dipendenza applicativa via
 * props: `listMembers` (Data Connect dell'app).
 */

interface MemberUser {
  userId: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  teamMembers_on_user?: Array<{ team: { teamId: string; name: string } }> | null;
}

export interface TeamMemberItem {
  role: string;
  joinedAt: string;
  rbac?: RbacStructure | null;
  user?: MemberUser | null;
  status?: string;
}

/** Item team validato dallo schema condiviso (Z1: tipo derivato da Zod, zero drift). */
export type TeamItem = TeamItemData;

export interface UserTeamProps {
  /** Elenco membri dell'organizzazione (Data Connect dell'app). */
  listMembers: (orgId: string) => Promise<TeamMemberItem[]>;
}

/** Stato del dialogo di conferma locale (rimozioni + reset MFA con motivo). */
interface ConfirmState {
  title: string;
  body: string;
  confirmLabel: string;
  /** Se presente, il dialogo chiede un motivo (textarea) con lunghezza minima. */
  reasonLabel?: string;
  onConfirm: (reason?: string) => void | Promise<void>;
}

const inputClass =
  "bg-surface-2 border border-line focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-ink outline-none w-full transition-all";

export function UserTeam({ listMembers }: UserTeamProps) {
  const { dbData, showToast, claims, hasPermission } = useDashboard();
  const s = useUIStrings();
  // Pattern sRef (regola i18n): le callback dei fetch leggono le stringhe dalla
  // ref, così il cambio lingua non ri-innesca i caricamenti.
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);

  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Invito membro (Modal)
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [memberForm, setMemberForm] = useState({ fullName: "", email: "", role: "member", teamIds: [] as string[] });

  // Creazione team (inline)
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  // Matrice permessi (membro O team)
  const [permTarget, setPermTarget] = useState<{ kind: "member"; member: TeamMemberItem } | { kind: "team"; team: TeamItem } | null>(null);
  const [editingRole, setEditingRole] = useState("member");
  const [editingRbac, setEditingRbac] = useState<RbacStructure>({ apps: {} });
  const [savingPerms, setSavingPerms] = useState(false);

  // Dialogo di conferma (rimozioni, reset MFA con motivo)
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [confirmPending, setConfirmPending] = useState(false);

  const activeOrg = dbData?.organization;
  const activeRole = claims?.uRole || claims?.role;
  const isManager = activeRole === "owner" || activeRole === "admin";

  const loadMembers = useCallback(async (orgId: string) => {
    setLoadingMembers(true);
    try {
      setMembers(await listMembers(orgId));
    } catch (err) {
      console.error("Errore caricamento membri:", err);
      showToast(sRef.current.team.loadMembersErr, "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [listMembers, showToast]);

  const loadTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      // fetchAuthedClient (framework): Bearer+App Check+CSRF automatici e, sui
      // 403 auth/reauth-required dello step-up, dialogo di riconferma + retry.
      const res = await fetchAuthedClient("/api/team/list", { method: "GET" }, { validate: (raw) => teamListResponseSchema.parse(raw) });
      if (res.success && res.data) {
        setTeams(res.data.items || []);
      } else {
        throw new Error(res.error?.message || sRef.current.team.loadTeamsErr);
      }
    } catch (err) {
      console.error("Errore caricamento team:", err);
      showToast(err instanceof Error ? err.message : sRef.current.team.loadTeamsErr, "error");
    } finally {
      setLoadingTeams(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!activeOrg?.orgId) return;
    const timer = setTimeout(() => {
      void loadMembers(activeOrg.orgId);
      void loadTeams();
    }, 0);
    return () => clearTimeout(timer);
  }, [activeOrg?.orgId, loadMembers, loadTeams]);

  /* ------------------------------- Membri -------------------------------- */

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;
    setInviting(true);
    try {
      const res = await fetchAuthedClient("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: memberForm.email,
          fullName: memberForm.fullName,
          role: memberForm.role,
          orgId: activeOrg.orgId,
          teamIds: memberForm.teamIds
        })
      }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
      if (!res.success) {
        throw new Error(res.error?.message || s.team.inviteErr);
      }
      showToast(s.team.inviteQueued, "success");
      // Feedback reattivo: membro pending in testa alla lista.
      setMembers((prev) => [
        {
          role: memberForm.role,
          joinedAt: new Date().toISOString(),
          user: { userId: `temp_${Math.random().toString(36).substring(2, 9)}`, email: memberForm.email, fullName: memberForm.fullName, avatarUrl: null },
          status: "pending"
        },
        ...prev
      ]);
      setMemberForm({ fullName: "", email: "", role: "member", teamIds: [] });
      setInviteOpen(false);
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : s.team.inviteErr, "error");
    } finally {
      setInviting(false);
    }
  };

  const handleRetryOnboarding = async (email: string, fullName: string, role: string) => {
    if (!activeOrg) return;
    showToast(s.team.retrying, "info");
    try {
      await fetchAuthedClient("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role, orgId: activeOrg.orgId })
      }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
      showToast(s.team.retryOk, "success");
      await loadMembers(activeOrg.orgId);
    } catch (err) {
      console.error(err);
      showToast(s.team.retryErr, "error");
    }
  };

  const requestDeleteMember = (targetUserId: string, email: string) => {
    setConfirmState({
      title: s.team.removeMemberTitle,
      body: fmtUI(s.team.confirmRemove, { email }),
      confirmLabel: s.team.removeConfirm,
      onConfirm: async () => {
        if (!activeOrg) return;
        const res = await fetchAuthedClient(`/api/user/${targetUserId}`, { method: "DELETE" }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
        if (res.success) {
          showToast(s.team.removed, "success");
          void loadMembers(activeOrg.orgId);
        } else {
          throw new Error(res.error?.message || s.team.removeErr);
        }
      }
    });
  };

  // Reset 2FA assistito (P1-94): motivo obbligatorio (≥10 caratteri) per l'audit.
  const requestMfaReset = (targetUserId: string, email: string) => {
    setConfirmState({
      title: s.team.mfaResetTitle,
      body: fmtUI(s.team.confirmMfaReset, { email }),
      confirmLabel: s.team.resetMfa,
      reasonLabel: s.team.mfaReasonLabel,
      onConfirm: async (reason) => {
        if (!activeOrg) return;
        const res = await fetchAuthedClient(`/api/user/${targetUserId}/mfa/admin-reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: (reason || "").trim() })
        }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
        if (res.success) {
          showToast(s.team.mfaResetOk, "success");
          void loadMembers(activeOrg.orgId);
        } else {
          throw new Error(res.error?.message || s.team.mfaResetErr);
        }
      }
    });
  };

  const openMemberPerms = (member: TeamMemberItem) => {
    setEditingRole(member.role);
    const privileged = member.role === "owner" || member.role === "admin";
    setEditingRbac(JSON.parse(JSON.stringify(member.rbac || buildDefaultRbac(privileged))));
    setPermTarget({ kind: "member", member });
  };

  /* -------------------------------- Team --------------------------------- */

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    try {
      const res = await fetchAuthedClient("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName, appId: "sso" })
      }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
      if (res.success) {
        showToast(fmtUI(s.team.teamCreated, { name: newTeamName }), "success");
        setNewTeamName("");
        void loadTeams();
      } else {
        throw new Error(res.error?.message || s.team.teamCreateErr);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : s.team.teamCreateErr, "error");
    } finally {
      setCreating(false);
    }
  };

  const requestDeleteTeam = (teamId: string, teamName: string) => {
    setConfirmState({
      title: s.team.deleteTeamTitle,
      body: fmtUI(s.team.confirmDeleteTeam, { name: teamName }),
      confirmLabel: s.team.removeConfirm,
      onConfirm: async () => {
        const res = await fetchAuthedClient(`/api/team/${teamId}`, { method: "DELETE" }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
        if (res.success) {
          showToast(fmtUI(s.team.teamDeleted, { name: teamName }), "success");
          void loadTeams();
        } else {
          throw new Error(res.error?.message || s.team.teamDeleteErr);
        }
      }
    });
  };

  const openTeamPerms = (team: TeamItem) => {
    setEditingRbac(JSON.parse(JSON.stringify(team.rbac || buildDefaultRbac(false))));
    setPermTarget({ kind: "team", team });
  };

  /* ------------------------ Salvataggio permessi ------------------------- */

  const handleToggleModulePerm = (appKey: string, moduleKey: string, actionKey: "read" | "create" | "update" | "delete") => {
    setEditingRbac((prev: RbacStructure) => {
      const copy = { ...prev, apps: { ...prev.apps } };
      if (!copy.apps[appKey]) copy.apps[appKey] = {};
      copy.apps[appKey] = { ...copy.apps[appKey] };
      const perms = getPermissionsFromMask(copy.apps[appKey][moduleKey] || 0);
      perms[actionKey] = !perms[actionKey];
      copy.apps[appKey][moduleKey] = getMaskFromPermissions(perms);
      return copy;
    });
  };

  const handleSavePermissions = async () => {
    if (!permTarget) return;
    setSavingPerms(true);
    try {
      const res =
        permTarget.kind === "member"
          ? await fetchAuthedClient(`/api/user/${permTarget.member.user?.userId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: editingRole, rbac: editingRbac })
            }, { validate: (raw) => apiEnvelopeSchema.parse(raw) })
          : await fetchAuthedClient(`/api/team/${permTarget.team.teamId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: permTarget.team.name, rbac: editingRbac })
            }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
      if (res.success) {
        showToast(s.team.permsSaved, "success");
        setPermTarget(null);
        if (permTarget.kind === "member" && activeOrg) void loadMembers(activeOrg.orgId);
        else void loadTeams();
      } else {
        throw new Error(s.team.permsErr);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : s.team.permsErr, "error");
    } finally {
      setSavingPerms(false);
    }
  };

  /* ------------------------- Dialogo di conferma -------------------------- */

  const closeConfirm = () => {
    setConfirmState(null);
    setConfirmReason("");
    setConfirmPending(false);
  };

  const submitConfirm = async () => {
    if (!confirmState) return;
    if (confirmState.reasonLabel && confirmReason.trim().length < 10) {
      showToast(s.team.reasonTooShort, "error");
      return;
    }
    setConfirmPending(true);
    try {
      await confirmState.onConfirm(confirmState.reasonLabel ? confirmReason : undefined);
      closeConfirm();
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : s.team.permsErr, "error");
      setConfirmPending(false);
    }
  };

  /* --------------------------------- UI ---------------------------------- */

  return (
    <div className="space-y-6">
      <UserPageHeader
        title={s.userPages.teamTitle}
        description={s.userPages.teamDesc}
        actions={
          isManager ? (
            <Button
              unstyled
              onClick={() => setInviteOpen(true)}
              className="klx-btn klx-btn--primary"
            >
              <UserPlus className="w-4 h-4" />
              {s.team.inviteBtn}
            </Button>
          ) : undefined
        }
      />

      {/* MEMBRI */}
      <UserCard title={s.team.membersTitle} description={s.team.membersDesc} icon={<Users className="w-4 h-4 text-secondary" />}>
        {loadingMembers ? (
          <div className="flex justify-center p-6"><Spinner /></div>
        ) : members.length === 0 ? (
          <EmptyState size="sm" title={s.team.membersEmpty} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr>
                  <th scope="col" className="bg-surface-2 font-bold text-xs px-4 py-3 text-ink-muted text-start first:rounded-s-xl last:rounded-e-xl">{s.team.colMember}</th>
                  <th scope="col" className="bg-surface-2 font-bold text-xs px-4 py-3 text-ink-muted text-start">{s.team.colTeam}</th>
                  <th scope="col" className="bg-surface-2 font-bold text-xs px-4 py-3 text-ink-muted text-start">{s.team.colRole}</th>
                  <th scope="col" className="bg-surface-2 font-bold text-xs px-4 py-3 text-ink-muted text-start">{s.team.colStatus}</th>
                  <th scope="col" className="bg-surface-2 font-bold text-xs px-4 py-3 text-ink-muted text-end first:rounded-s-xl last:rounded-e-xl">{s.team.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {members.map((member, idx) => {
                  const u = member.user;
                  const status = member.status || "active";
                  const memberTeams = u?.teamMembers_on_user || [];
                  const inviteLink =
                    u?.metadata && typeof u.metadata === "object" && "inviteLink" in u.metadata && typeof (u.metadata as { inviteLink: unknown }).inviteLink === "string"
                      ? (u.metadata as { inviteLink: string }).inviteLink
                      : undefined;

                  return (
                    <tr key={u?.userId || idx} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 text-xs font-bold shrink-0">
                            {u?.avatarUrl && <Avatar.Image src={u.avatarUrl} alt={u.fullName || u.email} />}
                            <Avatar.Fallback className="text-white">{(u?.fullName || u?.email || "U").slice(0, 2).toUpperCase()}</Avatar.Fallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink truncate">{u?.fullName || s.team.pendingInvite}</p>
                            <p className="text-[10px] text-ink-muted truncate">{u?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {memberTeams.length === 0 ? (
                            <span className="text-[10px] text-ink-muted italic">—</span>
                          ) : (
                            memberTeams.map((rel) => (
                              <Chip key={rel.team.teamId} size="sm" variant="soft" className="text-[9px] capitalize px-1 py-0.5 border border-secondary/30 text-secondary bg-secondary/5 font-semibold">
                                {rel.team.name}
                              </Chip>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Chip size="sm" variant="soft" className="uppercase font-bold text-[9px]">{member.role}</Chip>
                      </td>
                      <td className="px-4 py-3.5">
                        {status === "active" && <Chip size="sm" color="success" variant="soft" className="font-bold text-[9px]">{s.team.statusActive}</Chip>}
                        {status === "pending" && <Chip size="sm" color="warning" variant="soft" className="font-bold text-[9px]">{s.team.statusPending}</Chip>}
                        {status === "error" && <Chip size="sm" color="danger" variant="soft" className="font-bold text-[9px]">{s.team.statusError}</Chip>}
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {status === "pending" && u && inviteLink && (
                            <Button
                              unstyled
                              isIconOnly
                              variant="ghost"
                              aria-label={s.team.copyInviteLink}
                              className="p-2 text-ink-muted hover:text-ink hover:bg-surface-2 rounded-xl cursor-pointer transition-colors"
                              onClick={() => {
                                void navigator.clipboard.writeText(inviteLink);
                                showToast(s.team.linkCopied, "success");
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                          {status === "error" && u && (
                            <Button
                              unstyled
                              className="font-bold text-[9px] rounded-lg cursor-pointer px-2.5 py-1.5 border border-danger/30 hover:bg-danger/10 text-danger transition-colors"
                              onClick={() => void handleRetryOnboarding(u.email, u.fullName || "", member.role)}
                            >
                              {s.team.retryOnboarding}
                            </Button>
                          )}
                          {u && status === "active" && isManager && (
                            <>
                              <Button
                                unstyled
                                isIconOnly
                                variant="ghost"
                                aria-label={s.team.memberPermsTitle}
                                className="p-2 text-ink-muted hover:text-ink hover:bg-surface-2 rounded-xl cursor-pointer transition-colors"
                                onClick={() => openMemberPerms(member)}
                              >
                                <Settings2 className="w-4 h-4" />
                              </Button>
                              {activeRole === "owner" && member.role !== "owner" && (
                                <Button
                                  unstyled
                                  className="font-bold text-[9px] rounded-lg cursor-pointer px-2.5 py-1.5 border border-warning/30 hover:bg-warning/10 text-warning transition-colors"
                                  onClick={() => requestMfaReset(u.userId, u.email)}
                                >
                                  {s.team.resetMfa}
                                </Button>
                              )}
                              <Button
                                unstyled
                                isIconOnly
                                variant="ghost"
                                aria-label={s.team.removeConfirm}
                                className="p-2 text-danger hover:bg-danger/10 rounded-xl cursor-pointer transition-colors"
                                onClick={() => requestDeleteMember(u.userId, u.email)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </UserCard>

      {/* TEAM */}
      <UserCard
        title={s.team.teamsTitle}
        description={s.team.teamsDesc}
        icon={<Shield className="w-4 h-4 text-secondary" />}
        actions={
          hasPermission("team", "create") ? (
            <form onSubmit={handleCreateTeam} className="flex items-center gap-2">
              <Input
                aria-label={s.team.teamNameLabel}
                placeholder={s.team.teamNamePlaceholder}
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="bg-surface-2 border border-line focus:border-secondary rounded-xl px-3 h-9 text-xs text-ink outline-none w-44 transition-all"
              />
              <Button
                unstyled
                type="submit"
                isDisabled={creating || !newTeamName.trim()}
                className="inline-flex items-center gap-1.5 px-3 h-9 font-bold text-xs bg-secondary hover:bg-secondary/90 text-white rounded-xl cursor-pointer transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                {creating ? s.team.creating : s.team.createBtn}
              </Button>
            </form>
          ) : undefined
        }
      >
        {loadingTeams ? (
          <div className="flex justify-center p-6"><Spinner /></div>
        ) : teams.length === 0 ? (
          <EmptyState size="sm" title={s.team.teamsEmpty} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div key={team.teamId} className="flex justify-between items-center bg-surface-2 p-4 rounded-2xl border border-line">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{team.name}</p>
                    <p className="text-[10px] text-ink-muted flex items-center gap-1">
                      <Users className="w-3 h-3" /> {fmtUI(s.team.membersCount, { n: team.memberCount || 0 })}
                    </p>
                  </div>
                </div>
                {(hasPermission("team", "update") || hasPermission("team", "delete")) && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      unstyled
                      isIconOnly
                      variant="ghost"
                      aria-label={s.team.teamPermsTitle}
                      isDisabled={!hasPermission("team", "update")}
                      className="p-2 text-ink-muted hover:text-ink hover:bg-surface rounded-xl cursor-pointer transition-colors"
                      onClick={() => openTeamPerms(team)}
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button
                      unstyled
                      isIconOnly
                      variant="ghost"
                      aria-label={s.team.deleteTeamTitle}
                      isDisabled={!hasPermission("team", "delete")}
                      className="p-2 text-danger hover:bg-danger/10 rounded-xl cursor-pointer transition-colors"
                      onClick={() => requestDeleteTeam(team.teamId, team.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </UserCard>

      {/* MODAL INVITO MEMBRO */}
      {inviteOpen && (
        <Modal isOpen={inviteOpen} onOpenChange={setInviteOpen}>
          <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Modal.Container className="h-auto w-full max-w-md flex-none p-0 sm:w-full sm:p-0">
              <Modal.Dialog className="w-full rounded-3xl border border-line bg-surface-raised backdrop-blur-xl shadow-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-secondary" /> {s.team.inviteTitle}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">{s.team.inviteDesc}</p>
                </div>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <TextField isRequired className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-ink block mb-0.5">{s.team.fullNameLabel}</Label>
                    <Input isRequired placeholder={s.team.fullNamePlaceholder} value={memberForm.fullName} onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })} className={inputClass} />
                  </TextField>
                  <TextField isRequired className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-ink block mb-0.5">{s.team.emailLabel}</Label>
                    <Input isRequired type="email" placeholder={s.team.emailPlaceholder} value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} className={inputClass} />
                  </TextField>
                  <Select
                    selectedKey={memberForm.role}
                    onSelectionChange={(key) => setMemberForm({ ...memberForm, role: typeof key === "string" && key ? key : "member" })}
                    className="flex flex-col gap-1.5 w-full"
                  >
                    <Label className="text-xs font-bold text-ink block mb-0.5">{s.team.roleLabel}</Label>
                    <SelectTrigger className="bg-surface-2 border border-line focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-ink">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopover className="bg-surface-raised backdrop-blur-xl border border-line rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                      <ListBox className="outline-none">
                        {["admin", "member", "viewer"].map((r) => (
                          <ListBoxItem key={r} id={r} textValue={r} className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-ink hover:bg-surface-2 capitalize">
                            {r}
                          </ListBoxItem>
                        ))}
                      </ListBox>
                    </SelectPopover>
                  </Select>
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-ink block mb-0.5">{s.team.teamsLabel}</Label>
                    <div className="bg-surface-2 border border-line rounded-2xl p-3 max-h-[120px] overflow-y-auto space-y-2">
                      {teams.length === 0 ? (
                        <p className="text-[10px] text-ink-muted">{s.team.noTeams}</p>
                      ) : (
                        teams.map((team) => (
                          <div key={team.teamId} className="flex items-center gap-2">
                            <Checkbox
                              isSelected={memberForm.teamIds.includes(team.teamId)}
                              onChange={() => {
                                setMemberForm((prev) => {
                                  const ids = prev.teamIds.includes(team.teamId)
                                    ? prev.teamIds.filter((id) => id !== team.teamId)
                                    : [...prev.teamIds, team.teamId];
                                  return { ...prev, teamIds: ids };
                                });
                              }}
                              className="flex-row items-center gap-2"
                            >
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                              <span className="text-xs text-ink capitalize">{team.name}</span>
                            </Checkbox>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <Button unstyled variant="ghost" onClick={() => setInviteOpen(false)} className="px-4 py-2.5 text-xs font-bold border border-line hover:bg-surface-2 text-ink-muted rounded-xl cursor-pointer transition-colors">
                      {s.common.cancel}
                    </Button>
                    <Button
                      unstyled
                      type="submit"
                      isDisabled={inviting}
                      className="klx-btn klx-btn--primary"
                    >
                      {inviting ? s.team.inviting : s.team.inviteBtn}
                    </Button>
                  </div>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* MODAL CONFERMA (rimozioni / reset MFA con motivo) */}
      {confirmState && (
        <Modal isOpen={!!confirmState} onOpenChange={(open) => { if (!open) closeConfirm(); }}>
          <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Modal.Container className="h-auto w-full max-w-md flex-none p-0 sm:w-full sm:p-0">
              <Modal.Dialog className="w-full rounded-3xl border border-danger/30 bg-surface-raised backdrop-blur-xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-danger">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider">{confirmState.title}</h3>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">{confirmState.body}</p>
                {confirmState.reasonLabel && (
                  <TextField className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-ink block">{confirmState.reasonLabel}</Label>
                    <TextArea
                      value={confirmReason}
                      onChange={(e) => setConfirmReason(e.target.value)}
                      rows={3}
                      className="bg-surface-2 border border-line focus:border-secondary rounded-2xl px-3.5 py-2.5 text-sm text-ink outline-none w-full transition-all resize-none"
                    />
                  </TextField>
                )}
                <div className="flex gap-3 justify-end pt-1">
                  <Button unstyled variant="ghost" onClick={closeConfirm} className="px-4 py-2.5 text-xs font-bold border border-line hover:bg-surface-2 text-ink-muted rounded-xl cursor-pointer transition-colors">
                    {s.common.cancel}
                  </Button>
                  <Button
                    unstyled
                    isDisabled={confirmPending}
                    onClick={() => void submitConfirm()}
                    className="px-4 py-2.5 text-xs font-bold bg-danger hover:bg-danger/90 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-colors shadow-lg"
                  >
                    {confirmPending ? s.team.saving : confirmState.confirmLabel}
                  </Button>
                </div>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* MODAL MATRICE PERMESSI (membro o team) */}
      {permTarget && (
        <UserTeamPermissions
          isOpen={!!permTarget}
          onOpenChange={(open) => { if (!open) setPermTarget(null); }}
          title={permTarget.kind === "member" ? s.team.memberPermsTitle : `${s.team.teamPermsTitle} — ${permTarget.team.name}`}
          description={
            permTarget.kind === "member"
              ? fmtUI(s.team.memberPermsDesc, { name: permTarget.member.user?.fullName || permTarget.member.user?.email || "" })
              : s.team.teamPermsDesc
          }
          rbac={editingRbac}
          onToggle={handleToggleModulePerm}
          roleEditor={permTarget.kind === "member" ? { role: editingRole, onRoleChange: setEditingRole } : undefined}
          saving={savingPerms}
          onSave={() => void handleSavePermissions()}
        />
      )}
    </div>
  );
}

export default UserTeam;
