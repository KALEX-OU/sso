"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDashboard } from "../layout";
import { fetchWithAppCheck } from "@/lib/firebase/client";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import { Button, Card, CardContent, Input, Label, TextField, Modal, Checkbox, Chip } from "@/framework/components/ui";
import { Users, Plus, Shield, Trash2, Settings, Lock } from "lucide-react";
import { useI18n } from "@/locales/client";

interface RbacStructure {
  apps: Record<string, Record<string, number>>;
}

interface TeamItem {
  teamId: string;
  name: string;
  isTest: boolean;
  createdAt: string;
  memberCount?: number;
  rbac?: RbacStructure | null;
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

export default function TeamManagementPage() {
  const { user, showToast, hasPermission } = useDashboard();
  const t = useI18n();
  // Pattern tRef (regola i18n): le callback dei fetch leggono la traduzione dalla ref,
  // così il cambio lingua non ri-innesca i caricamenti.
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Permessi Team Modale
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null);
  const [editingRbac, setEditingRbac] = useState<RbacStructure>({ apps: { sso: {}, web: {} } });
  const [savingPerms, setSavingPerms] = useState(false);

  const loadTeams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck("/api/team/list", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTeams(data.items || []);
      } else {
        const errMsg = data.error
          ? (typeof data.error === "object" && "message" in data.error
              ? String(data.error.message)
              : String(data.error))
          : tRef.current("team.errList");
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : tRef.current("team.toastLoadErr"), "error");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTeams();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadTeams]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !user) return;

    setCreating(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ name: newTeamName, appId: "sso" })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("team.toastCreated", { name: newTeamName }), "success");
        setNewTeamName("");
        void loadTeams();
      } else {
        const errMsg = data.error
          ? (typeof data.error === "object" && "message" in data.error
              ? String(data.error.message)
              : String(data.error))
          : t("team.errCreate");
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("team.toastCreateErr"), "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!user) return;
    if (!confirm(t("team.confirmDelete", { name: teamName }))) return;

    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck(`/api/team/${teamId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("team.toastDeleted", { name: teamName }), "success");
        void loadTeams();
      } else {
        const errMsg = data.error
          ? (typeof data.error === "object" && "message" in data.error
              ? String(data.error.message)
              : String(data.error))
          : t("team.errDelete");
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("team.toastDeleteErr"), "error");
    }
  };

  const handleOpenPermModal = (team: TeamItem) => {
    setSelectedTeam(team);
    const initialRbac = team.rbac || {
      apps: {
        sso: {
          dashboard: 1,
          user: 1,
          team: 1,
          service: 1,
          product: 1,
          service_subscription: 1,
          product_subscription: 1,
          service_checkout: 0,
          product_checkout: 0,
          invoice: 1,
          compute: 1,
          apikey: 1,
          thing: 1
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
    if (!selectedTeam || !user) return;

    setSavingPerms(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetchWithAppCheck(`/api/team/${selectedTeam.teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: selectedTeam.name,
          rbac: editingRbac
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(t("team.toastPermsSaved"), "success");
        setIsPermModalOpen(false);
        void loadTeams();
      } else {
        const errMsg = data.error
          ? (typeof data.error === "object" && "message" in data.error
              ? String(data.error.message)
              : String(data.error))
          : t("team.errPerms");
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : t("team.toastPermsErr"), "error");
    } finally {
      setSavingPerms(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1 lg:col-span-1">
          <CardContent className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">{t("team.newTeamTitle")}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{t("team.newTeamDesc")}</p>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("team.teamNameLabel")}</Label>
                <Input
                  isRequired
                  placeholder={t("team.teamNamePlaceholder")}
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <Button
                unstyled
                type="submit"
                isDisabled={creating || !hasPermission("team", "create")}
                className="w-full py-5 font-bold bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {creating ? t("team.creating") : t("team.createBtn")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-1 lg:col-span-2">
          <CardContent className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">{t("team.activeTitle")}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{t("team.activeDesc")}</p>
            </div>

            {loading ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-secondary"></span></div>
            ) : teams.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">{t("team.emptyList")}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div key={team.teamId} className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{team.name}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {t("team.membersCount", { n: team.memberCount || 0 })}
                        </p>
                      </div>
                    </div>
                    {(hasPermission("team", "update") || hasPermission("team", "delete")) && (
                      <div className="flex gap-1">
                        <Button
                          unstyled
                          isIconOnly
                          variant="ghost"
                          isDisabled={!hasPermission("team", "update")}
                          className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                          onClick={() => handleOpenPermModal(team)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          unstyled
                          isIconOnly
                          variant="ghost"
                          isDisabled={!hasPermission("team", "delete")}
                          className="text-red-500 hover:bg-red-500/10 rounded-xl"
                          onClick={() => void handleDeleteTeam(team.teamId, team.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modale Matrice Permessi del Team */}
      <Modal isOpen={isPermModalOpen} onOpenChange={setIsPermModalOpen}>
        <Modal.Backdrop isDismissable={true} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Modal.Container className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <Modal.Dialog>
              <Modal.Header className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Shield className="text-secondary w-5 h-5" />
                  {t("team.permModalTitle")} - {selectedTeam?.name}
                </h2>
                <p className="text-slate-400 text-xs font-normal">
                  {t("team.permModalDesc")}
                </p>
              </Modal.Header>
              <Modal.Body className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200">{t("rbac.matrixTitle")}</h3>
                    <span className="text-[10px] text-secondary font-bold bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> {t("team.bitmaskBadge")}
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
