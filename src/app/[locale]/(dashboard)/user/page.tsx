"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDashboard } from "../layout";
import { dataConnect, fetchWithAppCheck } from "@/lib/firebase/client";
import { listMembersByOrg } from "@/lib/dataconnect-client";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import {
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  TextField,
  Modal,
  Checkbox
} from "@/framework/components/ui";
import { Shield, Trash2, Settings, Lock, Copy } from "lucide-react";
import { useI18n } from "@/locales/client";

interface RbacStructure {
  apps: Record<string, Record<string, number>>;
}

interface MemberItem {
  role: string;
  joinedAt: string;
  rbac?: RbacStructure | null;
  user?: {
    userId: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    metadata?: Record<string, unknown> | null;
    teamMembers_on_user?: Array<{
      team: {
        teamId: string;
        name: string;
      };
    }> | null;
  } | null;
  status?: string;
}

const SSO_MODULES = [
  "dashboard",
  "user",
  "team",
  "service",
  "product",
  "service_subscription",
  "product_subscription",
  "service_checkout",
  "product_checkout",
  "invoice",
  "compute",
  "apikey",
  "thing"
];

const getPermissionsFromMask = (mask: number) => {
  return {
    read: (mask & 1) === 1,
    create: (mask & 2) === 2,
    update: (mask & 4) === 4,
    delete: (mask & 8) === 8
  };
};

const getMaskFromPermissions = (perms: { read: boolean; create: boolean; update: boolean; delete: boolean }) => {
  let mask = 0;
  if (perms.read) mask |= 1;
  if (perms.create) mask |= 2;
  if (perms.update) mask |= 4;
  if (perms.delete) mask |= 8;
  return mask;
};

export default function UserManagementPage() {
  const { user, dbData, showToast, claims } = useDashboard();
  const t = useI18n();
  // Pattern tRef (regola i18n): le callback dei fetch leggono la traduzione dalla ref,
  // così il cambio lingua non ri-innesca i caricamenti.
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [teams, setTeams] = useState<{ teamId: string; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [memberInviting, setMemberInviting] = useState(false);

  // Form Invito Membro
  const [memberForm, setMemberForm] = useState({
    fullName: "",
    email: "",
    role: "member",
    teamIds: [] as string[]
  });

  // Stato Modale Gestione Permessi
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const [editingRole, setEditingRole] = useState<string>("member");
  const [editingRbac, setEditingRbac] = useState<RbacStructure>({ apps: { sso: {}, web: {} } });
  const [savingPerms, setSavingPerms] = useState(false);

  // Contratto /api/auth/dashboard: { user, organization } (org attiva con role).
  const activeOrg = dbData?.organization;
  const activeRole = claims?.role;

  const loadMembers = useCallback(async (orgId: string) => {
    setLoadingData(true);
    try {
      const memRes = await listMembersByOrg(dataConnect, { orgId });
      setMembers((memRes.data.userOrganizations || []) as MemberItem[]);
    } catch (err) {
      console.error("Errore caricamento membri:", err);
      showToast(tRef.current("user.toastLoadErr"), "error");
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  const loadTeams = useCallback(async () => {
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) return;

      const res = await fetchWithAppCheck("/api/team", {
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error("Errore caricamento team:", err);
    }
  }, [user]);

  useEffect(() => {
    if (activeOrg?.orgId) {
      const timer = setTimeout(() => {
        void loadMembers(activeOrg.orgId);
        void loadTeams();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrg?.orgId, loadMembers, loadTeams]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    setMemberInviting(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error(t("common.errNotAuth"));

      const response = await fetchWithAppCheck("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          email: memberForm.email,
          fullName: memberForm.fullName,
          role: memberForm.role,
          orgId: activeOrg.orgId,
          teamIds: memberForm.teamIds
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || t("user.errInvite"));
      }

      showToast(t("user.toastInviteQueued"), "success");

      // Aggiunge localmente il membro in stato pending per feedback reattivo
      const newMemberLocal: MemberItem = {
        role: memberForm.role,
        joinedAt: new Date().toISOString(),
        user: {
          userId: `temp_${Math.random().toString(36).substring(2, 9)}`,
          email: memberForm.email,
          fullName: memberForm.fullName,
          avatarUrl: null
        },
        status: "pending"
      };
      setMembers(prev => [newMemberLocal, ...prev]);
      setMemberForm({ fullName: "", email: "", role: "member", teamIds: [] });
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("user.toastInviteErr"), "error");
    } finally {
      setMemberInviting(false);
    }
  };

  const handleRetryOnboarding = async (email: string, fullName: string, role: string) => {
    if (!activeOrg) return;

    showToast(t("user.toastRetrying"), "info");
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error(t("common.errNotAuth"));

      await fetchWithAppCheck("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ email, fullName, role, orgId: activeOrg.orgId })
      });

      showToast(t("user.toastRetryOk"), "success");
      await loadMembers(activeOrg.orgId);
    } catch (err) {
      console.error(err);
      showToast(t("user.toastRetryErr"), "error");
    }
  };

  const handleDeleteMember = async (targetUserId: string, email: string) => {
    if (!activeOrg || !user) return;
    if (!confirm(t("user.confirmRemove", { email }))) return;

    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck(`/api/user/${targetUserId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("user.toastRemoved"), "success");
        void loadMembers(activeOrg.orgId);
      } else {
        throw new Error(data.error || t("user.errRemove"));
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("user.toastRemoveErr"), "error");
    }
  };

  // Reset 2FA assistito (P1-94): l'owner resetta la verifica in due passaggi di un membro
  // (recovery quando l'utente perde il dispositivo TOTP). Motivo obbligatorio per l'audit.
  const handleMfaReset = async (targetUserId: string, email: string) => {
    if (!activeOrg || !user) return;
    if (!confirm(t("user.confirmMfaReset", { email }))) return;
    const reason = prompt(t("user.promptMfaReason"), "");
    if (reason === null) return;
    if (reason.trim().length < 10) {
      showToast(t("user.toastReasonTooShort"), "error");
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck(`/api/user/${targetUserId}/mfa/admin-reset`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${idToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("user.toastMfaReset"), "success");
        void loadMembers(activeOrg.orgId);
      } else {
        throw new Error(data.error || t("user.errMfaReset"));
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("user.toastMfaResetErr"), "error");
    }
  };

  // Apertura modale di configurazione permessi
  const handleOpenPermModal = (member: MemberItem) => {
    setSelectedMember(member);
    setEditingRole(member.role);

    // Inizializza o carica la struttura RBAC esistente
    const initialRbac = member.rbac || {
      apps: {
        sso: {
          dashboard: member.role === "owner" || member.role === "admin" ? 15 : 1,
          user: member.role === "owner" || member.role === "admin" ? 15 : 1,
          team: member.role === "owner" || member.role === "admin" ? 15 : 1,
          service: member.role === "owner" || member.role === "admin" ? 15 : 1,
          product: member.role === "owner" || member.role === "admin" ? 15 : 1,
          service_subscription: member.role === "owner" || member.role === "admin" ? 15 : 1,
          product_subscription: member.role === "owner" || member.role === "admin" ? 15 : 1,
          service_checkout: member.role === "owner" || member.role === "admin" ? 15 : 0,
          product_checkout: member.role === "owner" || member.role === "admin" ? 15 : 0,
          invoice: member.role === "owner" || member.role === "admin" ? 15 : 1,
          compute: member.role === "owner" || member.role === "admin" ? 15 : 1,
          apikey: member.role === "owner" || member.role === "admin" ? 15 : 1,
          thing: member.role === "owner" || member.role === "admin" ? 15 : 1
        },
        web: {
          home: 1
        }
      }
    };
    setEditingRbac(JSON.parse(JSON.stringify(initialRbac)));
    setIsPermModalOpen(true);
  };

  const handleToggleModulePerm = (appKey: string, moduleKey: string, actionKey: "read" | "create" | "update" | "delete") => {
    setEditingRbac((prev: RbacStructure) => {
      const copy = { ...prev };
      if (!copy.apps) copy.apps = {};
      if (!copy.apps[appKey]) copy.apps[appKey] = {};
      
      const currentVal = copy.apps[appKey][moduleKey] || 0;
      const perms = getPermissionsFromMask(currentVal);
      
      perms[actionKey] = !perms[actionKey];
      copy.apps[appKey][moduleKey] = getMaskFromPermissions(perms);
      
      return copy;
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedMember?.user?.userId || !activeOrg || !user) return;

    setSavingPerms(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck(`/api/user/${selectedMember.user.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          role: editingRole,
          rbac: editingRbac
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("user.toastPermsSaved"), "success");
        setIsPermModalOpen(false);
        void loadMembers(activeOrg.orgId);
      } else {
        throw new Error(data.error || t("user.errPerms"));
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("user.toastPermsErr"), "error");
    } finally {
      setSavingPerms(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Invito */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1 lg:col-span-1">
          <CardContent className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">{t("user.inviteTitle")}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{t("user.inviteDesc")}</p>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("user.fullNameLabel")}</Label>
                <Input
                  isRequired
                  placeholder={t("user.fullNamePlaceholder")}
                  value={memberForm.fullName}
                  onChange={e => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("user.emailLabel")}</Label>
                <Input
                  isRequired
                  type="email"
                  placeholder={t("user.emailPlaceholder")}
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <Select
                selectedKey={memberForm.role}
                // Chiave normalizzata dal wrapper (string | number | null): niente cast `as`.
                onSelectionChange={(key) => setMemberForm({ ...memberForm, role: typeof key === "string" && key ? key : "member" })}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("user.roleLabel")}</Label>
                <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                  <ListBox className="outline-none">
                    <ListBoxItem id="admin" textValue="Admin" className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Admin
                    </ListBoxItem>
                    <ListBoxItem id="member" textValue="Member" className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Member
                    </ListBoxItem>
                    <ListBoxItem id="viewer" textValue="Viewer" className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Viewer
                    </ListBoxItem>
                  </ListBox>
                </SelectPopover>
              </Select>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("user.teamsLabel")}</Label>
                <div className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-2xl p-3 max-h-[120px] overflow-y-auto space-y-2">
                  {teams.length === 0 ? (
                    <p className="text-[10px] text-slate-500">{t("user.noTeams")}</p>
                  ) : (
                    teams.map(team => (
                      <div key={team.teamId} className="flex items-center gap-2">
                        <Checkbox
                          isSelected={memberForm.teamIds.includes(team.teamId)}
                          onChange={() => {
                            setMemberForm(prev => {
                              const ids = prev.teamIds.includes(team.teamId)
                                ? prev.teamIds.filter(id => id !== team.teamId)
                                : [...prev.teamIds, team.teamId];
                              return { ...prev, teamIds: ids };
                            });
                          }}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <span className="text-xs text-slate-700 dark:text-gray-300 capitalize">{team.name}</span>
                        </Checkbox>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Button
                unstyled
                type="submit"
                isDisabled={memberInviting || activeRole !== "owner" && activeRole !== "admin"}
                className="w-full py-5 font-bold bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                {memberInviting ? t("user.inviting") : t("user.inviteBtn")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Elenco Membri */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1 lg:col-span-2">
          <CardContent className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">{t("user.membersTitle")}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{t("user.membersDesc")}</p>
            </div>

            {loadingData ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-secondary"></span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">{t("user.colMember")}</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">{t("user.colTeam")}</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">{t("user.colRole")}</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">{t("user.colStatus")}</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl text-end">{t("user.colActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
                    {members.map((member, idx) => {
                      const u = member.user;
                      const status = member.status || "active";
                      const memberTeams = u?.teamMembers_on_user || [];
                      const inviteLink = (u?.metadata && typeof u.metadata === "object" && "inviteLink" in u.metadata && typeof (u.metadata as { inviteLink: unknown }).inviteLink === "string")
                        ? (u.metadata as { inviteLink: string }).inviteLink
                        : undefined;
                      
                      return (
                        <tr key={u?.userId || idx} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 text-xs font-bold bg-slate-200 dark:bg-white/10">
                                {u?.avatarUrl && <Avatar.Image src={u.avatarUrl} />}
                                <Avatar.Fallback className="text-white">{(u?.fullName || u?.email || "U").slice(0, 2)}</Avatar.Fallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{u?.fullName || t("user.pendingInvite")}</p>
                                <p className="text-[10px] text-slate-500">{u?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {memberTeams.length === 0 ? (
                                <span className="text-[10px] text-slate-500 italic">-</span>
                              ) : (
                                memberTeams.map((rel) => (                                   <Chip key={rel.team.teamId} size="sm" variant="soft" className="text-[9px] capitalize px-1 py-0.5 border border-secondary/30 text-secondary bg-secondary/5 font-semibold">
                                    {rel.team.name}
                                  </Chip>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Chip size="sm" variant="soft" className="uppercase font-bold text-[9px]">{member.role}</Chip>
                          </td>
                          <td className="px-4 py-4">
                            {status === "active" && <Chip size="sm" color="success" variant="soft" className="font-bold text-[9px]">Active</Chip>}
                            {status === "pending" && <Chip size="sm" color="warning" variant="soft" className="font-bold text-[9px]">Pending</Chip>}
                            {status === "error" && <Chip size="sm" color="danger" variant="soft" className="font-bold text-[9px]">Error</Chip>}
                          </td>
                          <td className="px-4 py-4 text-end">
                            <div className="flex items-center justify-end gap-2">
                              {status === "pending" && u && inviteLink && (
                                <Button
                                  unstyled
                                  isIconOnly
                                  variant="ghost"
                                  className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                                  onClick={() => {
                                    void navigator.clipboard.writeText(inviteLink);
                                    showToast(t("user.toastLinkCopied"), "success");
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              )}
                              {status === "error" && u && (
                                <Button
                                  unstyled
                                  className="font-bold text-[9px] rounded-lg cursor-pointer px-2.5 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-500 transition-colors"
                                  onClick={() => void handleRetryOnboarding(u.email, u.fullName || "", member.role)}
                                >
                                  {t("user.retryOnboarding")}
                                </Button>
                              )}
                              {u && status === "active" && (activeRole === "owner" || activeRole === "admin") && (
                                <>
                                  <Button
                                    unstyled
                                    isIconOnly
                                    variant="ghost"
                                    className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                                    onClick={() => handleOpenPermModal(member)}
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  {activeRole === "owner" && member.role !== "owner" && (
                                    <Button
                                      unstyled
                                      className="font-bold text-[9px] rounded-lg cursor-pointer px-2.5 py-1.5 border border-warning/30 hover:bg-warning/10 text-warning transition-colors"
                                      onClick={() => void handleMfaReset(u.userId, u.email)}
                                    >
                                      {t("user.resetMfa")}
                                    </Button>
                                  )}
                                  <Button
                                    unstyled
                                    isIconOnly
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                    onClick={() => void handleDeleteMember(u.userId, u.email)}
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
          </CardContent>
        </Card>
      </div>

      {/* Modale Gestione Permessi (Visual Permission Matrix) */}
      <Modal isOpen={isPermModalOpen} onOpenChange={setIsPermModalOpen}>
        <Modal.Backdrop isDismissable={true} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Modal.Container className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <Modal.Dialog>
              <Modal.Header className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Shield className="text-secondary w-5 h-5" />
                  {t("user.permModalTitle")}
                </h2>
                <p className="text-slate-400 text-xs font-normal">
                  {t("user.permModalDesc", { name: selectedMember?.user?.fullName || selectedMember?.user?.email || "" })}
                </p>
              </Modal.Header>
              <Modal.Body className="py-6 space-y-6">
                {/* Selezione Ruolo IAM */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <Label className="text-xs font-bold text-slate-300 block">{t("user.mainRoleLabel")}</Label>
                  <div className="flex gap-2">
                    {["owner", "admin", "member", "viewer"].map((r) => (
                      <Button
                        unstyled
                        key={r}
                        variant={editingRole === r ? "primary" : "outline"}
                        className="flex-1 font-bold text-xs uppercase rounded-xl"
                        onClick={() => {
                          setEditingRole(r);
                          // Aggiorna anche l'rbac di default se l'utente cambia ruolo
                          if (r === "owner" || r === "admin") {
                            setEditingRbac((prev: RbacStructure) => {
                              const copy = { ...prev };
                              if (!copy.apps) copy.apps = {};
                              if (!copy.apps.sso) copy.apps.sso = {};
                              SSO_MODULES.forEach(m => copy.apps.sso[m] = 15);
                              return copy;
                            });
                          }
                        }}
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Visual Permission Matrix */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">{t("rbac.matrixTitle")}</h3>
                    <span className="text-[10px] text-secondary font-bold bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> {t("user.bitmaskBadge")}
                    </span>
                  </div>

                  {/* SSO App Block */}
                  <div className="border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden">
                    <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{t("rbac.ssoBlock")}</span>
                      <Chip size="sm" variant="soft" color="default" className="font-bold text-[9px]">{t("rbac.defaultChip")}</Chip>
                    </div>

                    <div className="divide-y divide-white/5">
                      {/* Intestazione Colonne */}
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-900/50 text-[10px] font-extrabold text-slate-400 uppercase">
                        <div className="col-span-4">{t("rbac.colModule")}</div>
                        <div className="col-span-2 text-center">{t("rbac.colRead")}</div>
                        <div className="col-span-2 text-center">{t("rbac.colCreate")}</div>
                        <div className="col-span-2 text-center">{t("rbac.colUpdate")}</div>
                        <div className="col-span-2 text-center">{t("rbac.colDelete")}</div>
                      </div>

                      {SSO_MODULES.map((moduleKey) => {
                        const currentVal = editingRbac?.apps?.sso?.[moduleKey] || 0;
                        const perms = getPermissionsFromMask(currentVal);
                        return (
                          <div key={moduleKey} className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center hover:bg-white/[0.01] transition-colors">
                            <div className="col-span-4">
                              <p className="text-xs font-bold text-slate-100 capitalize">{moduleKey}</p>
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <Checkbox
                                isSelected={perms.read}
                                onChange={() => handleToggleModulePerm("sso", moduleKey, "read")}
                              >
                                <Checkbox.Control>
                                  <Checkbox.Indicator />
                                </Checkbox.Control>
                              </Checkbox>
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <Checkbox
                                isSelected={perms.create}
                                onChange={() => handleToggleModulePerm("sso", moduleKey, "create")}
                              >
                                <Checkbox.Control>
                                  <Checkbox.Indicator />
                                </Checkbox.Control>
                              </Checkbox>
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <Checkbox
                                isSelected={perms.update}
                                onChange={() => handleToggleModulePerm("sso", moduleKey, "update")}
                              >
                                <Checkbox.Control>
                                  <Checkbox.Indicator />
                                </Checkbox.Control>
                              </Checkbox>
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <Checkbox
                                isSelected={perms.delete}
                                onChange={() => handleToggleModulePerm("sso", moduleKey, "delete")}
                              >
                                <Checkbox.Control>
                                  <Checkbox.Indicator />
                                </Checkbox.Control>
                              </Checkbox>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WEB App Block */}
                  <div className="border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden">
                    <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{t("rbac.webBlock")}</span>
                      <Chip size="sm" variant="soft" color="default" className="font-bold text-[9px]">{t("rbac.defaultChip")}</Chip>
                    </div>

                    <div className="divide-y divide-white/5">
                      <div className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center hover:bg-white/[0.01] transition-colors">
                        <div className="col-span-4">
                          <p className="text-xs font-bold text-slate-100">{t("rbac.homePage")}</p>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            isSelected={getPermissionsFromMask(editingRbac?.apps?.web?.home || 0).read}
                            onChange={() => handleToggleModulePerm("web", "home", "read")}
                          >
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            isSelected={getPermissionsFromMask(editingRbac?.apps?.web?.home || 0).create}
                            onChange={() => handleToggleModulePerm("web", "home", "create")}
                          >
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            isSelected={getPermissionsFromMask(editingRbac?.apps?.web?.home || 0).update}
                            onChange={() => handleToggleModulePerm("web", "home", "update")}
                          >
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox
                            isSelected={getPermissionsFromMask(editingRbac?.apps?.web?.home || 0).delete}
                            onChange={() => handleToggleModulePerm("web", "home", "delete")}
                          >
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <Button unstyled variant="ghost" className="rounded-xl font-bold cursor-pointer text-slate-300 hover:text-white" onClick={() => setIsPermModalOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button unstyled className="rounded-xl font-bold cursor-pointer bg-secondary hover:bg-secondary/90 text-white" isDisabled={savingPerms} onClick={() => void handleSavePermissions()}>
                  {savingPerms ? t("common.saving") : t("common.save")}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
