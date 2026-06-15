"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect, fetchWithAppCheck } from "@/lib/firebase/client";
import { listMembersByOrg } from "@/lib/dataconnect-client";
import {
  Button,
  Card,
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
  TextField
} from "@heroui/react";

interface MemberItem {
  role: string;
  joinedAt: string;
  user?: {
    uid: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
  status?: string;
}

export default function UserManagementPage() {
  const { user, dbData, showToast } = useDashboard();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [memberInviting, setMemberInviting] = useState(false);

  // Form Invito Membro
  const [memberForm, setMemberForm] = useState({
    fullName: "",
    email: "",
    role: "member",
    teamName: ""
  });

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  const loadMembers = useCallback(async (orgId: string) => {
    setLoadingData(true);
    try {
      const memRes = await listMembersByOrg(dataConnect, { orgId });
      setMembers((memRes.data.userOrganizations || []) as MemberItem[]);
    } catch (err) {
      console.error("Errore caricamento membri:", err);
      showToast("Impossibile caricare i membri.", "error");
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeOrg?.orgId) {
      const timer = setTimeout(() => {
        void loadMembers(activeOrg.orgId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrg?.orgId, loadMembers]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    setMemberInviting(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const response = await fetchWithAppCheck("/api/organization/member/create", {
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
          teamName: memberForm.teamName || undefined
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Errore invito membro.");
      }

      showToast("Invito preso in carico. Creazione dell'utente e invio email in background.", "success");

      // Aggiunge localmente il membro in stato pending per feedback reattivo
      const newMemberLocal: MemberItem = {
        role: memberForm.role,
        joinedAt: new Date().toISOString(),
        user: {
          uid: `temp_${Math.random().toString(36).substring(2, 9)}`,
          email: memberForm.email,
          fullName: memberForm.fullName,
          avatarUrl: null
        },
        status: "pending"
      };
      setMembers(prev => [newMemberLocal, ...prev]);
      setMemberForm({ fullName: "", email: "", role: "member", teamName: "" });
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore invito.", "error");
    } finally {
      setMemberInviting(false);
    }
  };

  const handleRetryOnboarding = async (email: string, fullName: string, role: string) => {
    if (!activeOrg) return;

    showToast("Tentativo di ri-accodamento task in corso...", "info");
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      await fetchWithAppCheck("/api/organization/member/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ email, fullName, role, orgId: activeOrg.orgId })
      });

      showToast("Task di onboarding ri-accodato con successo!", "success");
      await loadMembers(activeOrg.orgId);
    } catch (err) {
      console.error(err);
      showToast("Impossibile ri-accodare l'onboarding.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Invito */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Invita Membro</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{"Assegna un ruolo IAM ed inserisci l'utente nell'organizzazione."}</p>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nome Completo</Label>
                <Input
                  placeholder="Mario Rossi"
                  value={memberForm.fullName}
                  onChange={e => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Indirizzo Email</Label>
                <Input
                  type="email"
                  placeholder="mario.rossi@azienda.com"
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <Select
                selectedKey={memberForm.role}
                onSelectionChange={(key) => setMemberForm({ ...memberForm, role: (key as string) || "member" })}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Ruolo IAM</Label>
                <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-purple-500 rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                  <ListBox className="outline-none">
                    <ListBoxItem id="admin" textValue="Admin" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Admin
                    </ListBoxItem>
                    <ListBoxItem id="member" textValue="Member" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Member
                    </ListBoxItem>
                    <ListBoxItem id="viewer" textValue="Viewer" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Viewer
                    </ListBoxItem>
                  </ListBox>
                </SelectPopover>
              </Select>

              <Button
                type="submit"
                isDisabled={memberInviting || activeRole !== "owner" && activeRole !== "admin"}
                className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                {memberInviting ? "Invito in corso..." : "Invia Invito"}
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Elenco Membri */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Membri Organizzazione</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">La lista completa delle identità abilitate.</p>
            </div>

            {loadingData ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Membro</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Ruolo</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Stato</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
                    {members.map((member, idx) => {
                      const u = member.user;
                      const status = member.status || "active";
                      return (
                        <tr key={u?.uid || idx} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 text-xs font-bold bg-slate-200 dark:bg-white/10">
                                {u?.avatarUrl && <Avatar.Image src={u.avatarUrl} />}
                                <Avatar.Fallback className="text-white">{(u?.fullName || u?.email || "U").slice(0, 2)}</Avatar.Fallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{u?.fullName || "Invito Pendente"}</p>
                                <p className="text-[10px] text-slate-500">{u?.email}</p>
                              </div>
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
                          <td className="px-4 py-4 text-right">
                            {status === "error" && u && (
                              <Button
                                className="font-bold text-[9px] rounded-lg cursor-pointer px-2.5 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-500 transition-colors"
                                onClick={() => void handleRetryOnboarding(u.email, u.fullName || "", member.role)}
                              >
                                Riprova Onboarding
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
