"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect, fetchWithAppCheck } from "@/lib/firebase/client";
import { listThingsByOrg } from "@/lib/dataconnect-client";
import {
  Button,
  Card,
  Chip,
  Modal
} from "@heroui/react";
import { AlertTriangle, Trash2, Copy } from "lucide-react";
import { Form } from "@/framework/components/layouts/Form";

interface ThingItem {
  thingId: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  isTest: boolean;
  appId?: string;
}

export default function ThingManagementPage() {
  const { user, dbData, showToast, hasPermission } = useDashboard();
  const [things, setThings] = useState<ThingItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isThingModalOpen, setIsThingModalOpen] = useState(false);
  const [generatedThingToken, setGeneratedThingToken] = useState("");

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;

  const loadThings = useCallback(async (orgId: string) => {
    setLoadingData(true);
    try {
      const thingRes = await listThingsByOrg(dataConnect, { orgId, appId: "sso" });
      setThings((thingRes.data.things || []) as ThingItem[]);
    } catch (err) {
      console.error("Errore caricamento cose:", err);
      showToast("Impossibile caricare i dispositivi.", "error");
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeOrg?.orgId) {
      const timer = setTimeout(() => {
        void loadThings(activeOrg.orgId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrg?.orgId, loadThings]);

  const handleRegisterThing = async (data: Record<string, unknown>, idempotencyKey: string) => {
    if (!activeOrg) return;

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      let metadata = {};
      if (data.metadata) {
        try {
          metadata = typeof data.metadata === "string" ? JSON.parse(data.metadata) : data.metadata;
        } catch {
          throw new Error("I metadati hardware non sono in un formato JSON valido.");
        }
      }

      const response = await fetchWithAppCheck("/api/thing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          orgId: activeOrg.orgId,
          metadata
        })
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error?.message || "Errore registrazione dispositivo.");
      }

      setGeneratedThingToken(resJson.deviceToken);
      setIsThingModalOpen(true);

      const newThingLocal: ThingItem = {
        thingId: resJson.thingId,
        name: String(data.name || ""),
        type: String(data.type || ""),
        status: "inactive",
        createdAt: new Date().toISOString(),
        isTest: false
      };
      setThings(prev => [newThingLocal, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRemoveThing = async (thingId: string) => {
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const response = await fetchWithAppCheck(`/api/thing/${thingId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Errore durante la rimozione del dispositivo.");
      }

      showToast("Richiesta rimozione presa in carico in background.", "success");
      setThings(prev => prev.map(t => t.thingId === thingId ? { ...t, status: "deleting" } : t));
      
      // Ricarica dopo qualche secondo
      setTimeout(() => {
        if (activeOrg?.orgId) loadThings(activeOrg.orgId);
      }, 3000);
    } catch (err) {
      console.error(err);
      showToast("Impossibile rimuovere il dispositivo.", "error");
    }
  };

  const copyToken = () => {
    void navigator.clipboard.writeText(generatedThingToken);
    showToast("Token copiato!", "success");
  };

  const canCreate = hasPermission("thing", "create");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Registrazione */}
        {canCreate && (
          <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
            <Card.Content className="p-2 space-y-4">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Registra Dispositivo Thing</h3>
                <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{"Aggiungi un dispositivo IoT hardware all'organizzazione."}</p>
              </div>

              <Form
                moduleId="thing"
                fieldsOrder={["name", "type", "metadata"]}
                onSubmit={handleRegisterThing}
                submitLabel="Registra Dispositivo"
              />
            </Card.Content>
          </Card>
        )}

        {/* Elenco Cose */}
        <Card className={`border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 ${canCreate ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Dispositivi IoT Thing</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">Elenco e stato dei dispositivi configurati.</p>
            </div>

            {loadingData ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Nome / ID</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Tipo</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">App</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Stato</th>
                      <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl text-right">Rimuovi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
                    {things.map((thing, idx) => (
                      <tr key={thing.thingId || idx} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{thing.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono select-all">{thing.thingId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Chip size="sm" variant="soft" className="uppercase font-bold text-[8px]">{thing.type}</Chip>
                        </td>
                        <td className="px-4 py-4">
                          <Chip size="sm" color={thing.appId === "sso" ? "default" : thing.appId === "safety" ? "warning" : "accent"} variant="soft" className="uppercase font-bold text-[8px]">{thing.appId || "sso"}</Chip>
                        </td>
                        <td className="px-4 py-4">
                          {thing.status === "active" && <Chip size="sm" color="success" variant="soft" className="font-bold text-[8px] uppercase">Active</Chip>}
                          {thing.status === "inactive" && <Chip size="sm" color="warning" variant="soft" className="font-bold text-[8px] uppercase">Inactive</Chip>}
                          {thing.status === "deleting" && <Chip size="sm" color="danger" variant="soft" className="font-bold text-[8px] uppercase">Deleting</Chip>}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="danger-soft"
                            isDisabled={thing.status === "deleting" || !hasPermission("thing", "delete")}
                            className="rounded-xl flex items-center justify-center cursor-pointer inline-flex"
                            onClick={() => void handleRemoveThing(thing.thingId)}
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

      {/* Modal Token */}
      <Modal isOpen={isThingModalOpen} onOpenChange={setIsThingModalOpen}>
        <Modal.Backdrop isDismissable={false} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Modal.Container className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <Modal.Dialog>
              {({ close }) => (
                <>
                  <Modal.Header className="flex flex-col gap-1 text-slate-900 dark:text-white font-black text-lg pb-3">
                    Copia il token del dispositivo
                  </Modal.Header>
                  <Modal.Body className="space-y-4 py-3">
                    <div className="bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        {"Questo token dispositivo (device_...) serve per autenticare la Thing all'API Gateway. Ti viene mostrato in chiaro una sola volta."}
                      </span>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5 relative flex justify-between items-center gap-3">
                      <code className="text-xs font-mono select-all text-secondary dark:text-violet-400 break-all pr-8">
                        {generatedThingToken}
                      </code>
                      <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        onClick={copyToken}
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="pt-4 flex justify-end">
                    <Button onClick={close} className="font-bold rounded-xl px-5 py-2.5 bg-violet-500 hover:bg-secondary text-white transition-colors cursor-pointer text-sm">
                      Ho memorizzato il token
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
