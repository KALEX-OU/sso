"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDashboard } from "../layout";
import { dataConnect, fetchWithAppCheck } from "@/lib/firebase/client";
import { listApiKeysByOrg } from "@/lib/dataconnect-client";
import {
  Button,
  Card,
  Chip,
  Modal
} from "@heroui/react";
import { AlertTriangle, Trash2, Copy } from "lucide-react";
import { Form } from "@/framework/components/layouts/Form";

interface ApiKeyItem {
  keyHash: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  expiresAt?: string | null;
  isTest: boolean;
  createdAt: string;
  appId?: string;
}

export default function ApiKeyManagementPage() {
  const { user, dbData, showToast, hasPermission } = useDashboard();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [generatedKeyVisible, setGeneratedKeyVisible] = useState("");

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;

  const apiKeyInitialData = useMemo(() => ({
    name: "",
    description: "",
    isTest: false,
    ipWhitelist: "",
    permissions: JSON.stringify([
      { moduleId: "thing", canCreate: true, canRead: true, canUpdate: true, canDelete: false, allowedFields: ["thingId", "name", "type", "status"] },
      { moduleId: "organization", canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name"] },
      { moduleId: "member", canCreate: false, canRead: true, canUpdate: false, canDelete: false, allowedFields: ["fullName", "email"] }
    ], null, 2)
  }), []);

  const loadApiKeys = useCallback(async (orgId: string) => {
    setLoadingData(true);
    try {
      const keyRes = await listApiKeysByOrg(dataConnect, { orgId, appId: "sso" });
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

  const handleGenerateApiKey = async (data: Record<string, unknown>, idempotencyKey: string) => {
    if (!activeOrg) return;

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const ipWhitelist = data.ipWhitelist
        ? String(data.ipWhitelist).split(",").map(ip => ip.trim()).filter(Boolean)
        : [];

      let permissionsArray = [];
      if (data.permissions) {
        try {
          permissionsArray = typeof data.permissions === "string" ? JSON.parse(data.permissions) : data.permissions;
        } catch {
          throw new Error("I permessi (permissions) non sono in un formato JSON valido.");
        }
      }

      const response = await fetchWithAppCheck("/api/apikey/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({
          orgId: activeOrg.orgId,
          name: data.name,
          description: data.description,
          ipWhitelist,
          isTest: !!data.isTest,
          expiresAt: null,
          permissions: permissionsArray
        })
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error?.message || "Errore generazione chiave API.");
      }

      setGeneratedKeyVisible(resJson.apiKey);
      setIsApiKeyModalOpen(true);
      
      await loadApiKeys(activeOrg.orgId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRevokeApiKey = async (keyHash: string) => {
    if (!activeOrg) return;

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const response = await fetchWithAppCheck(`/api/apikey/${keyHash}`, {
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

            <Form
              moduleId="apikey"
              initialData={apiKeyInitialData}
              fieldsOrder={["name", "description", "ipWhitelist", "isTest", "permissions"]}
              onSubmit={handleGenerateApiKey}
              submitLabel="Genera API Key"
            />
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
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Nome / Scopo</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Prefisso</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Environment</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">App</th>
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
                          <code className="bg-slate-200 dark:bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono text-secondary dark:text-violet-400">
                            {key.isTest ? "kalex_test_..." : "kalex_live_..."}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <Chip size="sm" variant="soft" color={key.isTest ? "warning" : "success"} className="text-[8px] font-bold uppercase tracking-wider">
                            {key.isTest ? "Sandbox" : "Production"}
                          </Chip>
                        </td>
                        <td className="px-4 py-4">
                          <Chip size="sm" color={key.appId === "sso" ? "default" : key.appId === "safety" ? "warning" : "accent"} variant="soft" className="uppercase font-bold text-[8px]">{key.appId || "sso"}</Chip>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            isDisabled={!hasPermission("apikey", "delete")}
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
                      <code className="text-xs font-mono select-all text-secondary dark:text-violet-400 break-all pr-8">
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
                    <Button onClick={close} className="font-bold rounded-xl px-5 py-2.5 bg-violet-500 hover:bg-secondary text-white transition-colors cursor-pointer text-sm">
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
