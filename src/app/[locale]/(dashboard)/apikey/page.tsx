"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect } from "@/lib/firebase/client";
import { listApiKeysByOrg } from "@/lib/dataconnect-client";
import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  TextField,
  Modal
} from "@heroui/react";
import { AlertTriangle, Trash2, Copy } from "lucide-react";

interface ApiKeyItem {
  keyHash: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  expiresAt?: string | null;
  isTest: boolean;
  createdAt: string;
}

interface ApiKeyPermissionDetail {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: string[];
}

interface ApiKeyFormState {
  name: string;
  description: string;
  isTest: boolean;
  ipWhitelistRaw: string;
  expiresAt: string;
  permissions: {
    thing: ApiKeyPermissionDetail;
    organization: ApiKeyPermissionDetail;
    member: ApiKeyPermissionDetail;
  };
}

export default function ApiKeyManagementPage() {
  const { user, dbData, showToast } = useDashboard();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [apiKeyGenerating, setApiKeyGenerating] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [generatedKeyVisible, setGeneratedKeyVisible] = useState("");

  const [apiKeyForm, setApiKeyForm] = useState<ApiKeyFormState>({
    name: "",
    description: "",
    isTest: false,
    ipWhitelistRaw: "",
    expiresAt: "",
    permissions: {
      thing: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, allowedFields: ["thingId", "name", "type", "status"] },
      organization: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name"] },
      member: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["fullName", "email"] }
    }
  });

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  const loadApiKeys = useCallback(async (orgId: string) => {
    setLoadingData(true);
    try {
      const keyRes = await listApiKeysByOrg(dataConnect, { orgId });
      setApiKeys((keyRes.data.apiKeys || []) as ApiKeyItem[]);
    } catch (err) {
      console.error("Errore caricamento api keys:", err);
      showToast("Impossibile caricare le chiavi API.", "error");
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeOrg?.orgId) {
      const timer = setTimeout(() => {
        void loadApiKeys(activeOrg.orgId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrg?.orgId, loadApiKeys]);

  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    setApiKeyGenerating(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const ipWhitelist = apiKeyForm.ipWhitelistRaw
        ? apiKeyForm.ipWhitelistRaw.split(",").map(ip => ip.trim())
        : [];

      const permissionsArray = Object.entries(apiKeyForm.permissions).map(([moduleId, policy]) => ({
        moduleId,
        canCreate: policy.canCreate,
        canRead: policy.canRead,
        canUpdate: policy.canUpdate,
        canDelete: policy.canDelete,
        allowedFields: policy.allowedFields
      }));

      const response = await fetch("/api/apikey/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          orgId: activeOrg.orgId,
          name: apiKeyForm.name,
          description: apiKeyForm.description,
          ipWhitelist,
          isTest: apiKeyForm.isTest,
          expiresAt: apiKeyForm.expiresAt || null,
          permissions: permissionsArray
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Errore generazione chiave API.");
      }

      setGeneratedKeyVisible(data.apiKey);
      setIsApiKeyModalOpen(true);
      
      await loadApiKeys(activeOrg.orgId);
      
      setApiKeyForm({
        name: "",
        description: "",
        isTest: false,
        ipWhitelistRaw: "",
        expiresAt: "",
        permissions: {
          thing: { canCreate: true, canRead: true, canUpdate: true, canDelete: false, allowedFields: ["thingId", "name", "type", "status"] },
          organization: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name"] },
          member: { canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["fullName", "email"] }
        }
      });
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore generazione.", "error");
    } finally {
      setApiKeyGenerating(false);
    }
  };

  const handleRevokeApiKey = async (keyHash: string) => {
    if (!activeOrg) return;

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const response = await fetch(`/api/apikey/${keyHash}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Errore durante la revoca della chiave API.");
      }

      showToast("Chiave API revocata con successo.", "success");
      await loadApiKeys(activeOrg.orgId);
    } catch (err) {
      console.error(err);
      showToast("Impossibile revocare la chiave API.", "error");
    }
  };

  const copyKey = () => {
    void navigator.clipboard.writeText(generatedKeyVisible);
    showToast("Chiave API copiata!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form di Creazione */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Genera API Key</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{"Crea una chiave di sviluppo con permessi CRUD limitati."}</p>
            </div>

            <form onSubmit={handleGenerateApiKey} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nome Chiave</Label>
                <Input
                  placeholder="Integrazione CRM"
                  value={apiKeyForm.name}
                  onChange={e => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Descrizione</Label>
                <Input
                  placeholder="Usata per caricare le info sui sensori"
                  value={apiKeyForm.description}
                  onChange={e => setApiKeyForm({ ...apiKeyForm, description: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">IP Whitelist (Separati da virgole)</Label>
                <Input
                  placeholder="192.168.1.1, 93.40.10.99"
                  value={apiKeyForm.ipWhitelistRaw}
                  onChange={e => setApiKeyForm({ ...apiKeyForm, ipWhitelistRaw: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              
              <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5 justify-between">
                <span className="text-xs font-semibold">Sandbox Test Key</span>
                <input
                  type="checkbox"
                  checked={apiKeyForm.isTest}
                  onChange={e => setApiKeyForm({ ...apiKeyForm, isTest: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Scopes dei Moduli */}
              <div className="space-y-2 border-t border-slate-200 dark:border-white/5 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Modulo Thing (IoT) Scopes</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={apiKeyForm.permissions.thing.canCreate}
                      onChange={e => setApiKeyForm({
                        ...apiKeyForm,
                        permissions: {
                          ...apiKeyForm.permissions,
                          thing: { ...apiKeyForm.permissions.thing, canCreate: e.target.checked }
                        }
                      })}
                    />
                    <span>Create</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={apiKeyForm.permissions.thing.canRead}
                      onChange={e => setApiKeyForm({
                        ...apiKeyForm,
                        permissions: {
                          ...apiKeyForm.permissions,
                          thing: { ...apiKeyForm.permissions.thing, canRead: e.target.checked }
                        }
                      })}
                    />
                    <span>Read</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                isDisabled={apiKeyGenerating || activeRole !== "owner" && activeRole !== "admin"}
                className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                {apiKeyGenerating ? "Generazione..." : "Genera API Key"}
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Elenco delle API Key */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Chiavi API Attive</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{"Gestisci e revoca le chiavi d'integrazione."}</p>
            </div>

            {loadingData ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Nome / Scopo</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Prefisso</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Environment</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl text-right">Revoca</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
                    {apiKeys.map((key, idx) => (
                      <tr key={key.keyHash || idx} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{key.name}</p>
                            <p className="text-[10px] text-slate-500">{key.description || "Nessuna descrizione"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <code className="bg-slate-200 dark:bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono text-purple-600 dark:text-purple-400">
                            {key.isTest ? "kalex_test_..." : "kalex_live_..."}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <Chip size="sm" variant="soft" color={key.isTest ? "warning" : "success"} className="text-[8px] font-bold uppercase tracking-wider">
                            {key.isTest ? "Sandbox" : "Production"}
                          </Chip>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            className="rounded-xl flex items-center justify-center cursor-pointer inline-flex"
                            onClick={() => void handleRevokeApiKey(key.keyHash)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Modal API Key in chiaro */}
      <Modal isOpen={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <Modal.Backdrop isDismissable={false} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Modal.Container className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <Modal.Dialog>
              {({ close }) => (
                <>
                  <Modal.Header className="flex flex-col gap-1 text-slate-900 dark:text-white font-black text-lg pb-3">
                    Copia la tua chiave API
                  </Modal.Header>
                  <Modal.Body className="space-y-4 py-3">
                    <div className="bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        {"Questa chiave API ti permette di connetterti ai servizi KALEX. Copiala subito: non potrai visualizzarla nuovamente per ragioni di sicurezza."}
                      </span>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5 relative flex justify-between items-center gap-3">
                      <code className="text-xs font-mono select-all text-purple-600 dark:text-purple-400 break-all pr-8">
                        {generatedKeyVisible}
                      </code>
                      <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        onClick={copyKey}
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="pt-4 flex justify-end">
                    <Button onClick={close} className="font-bold rounded-xl px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white transition-colors cursor-pointer text-sm">
                      Ho salvato la chiave
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
