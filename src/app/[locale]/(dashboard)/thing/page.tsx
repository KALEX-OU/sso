"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect, fetchWithAppCheck } from "@/lib/firebase/client";
import { listThingsByOrg } from "@/lib/dataconnect-client";
import {
  Button,
  Card,
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
  TextArea,
  Modal
} from "@heroui/react";
import { AlertTriangle, Trash2, Copy } from "lucide-react";

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
  const [thingRegistering, setThingRegistering] = useState(false);
  const [isThingModalOpen, setIsThingModalOpen] = useState(false);
  const [generatedThingToken, setGeneratedThingToken] = useState("");

  const [thingForm, setThingForm] = useState({
    name: "",
    type: "sensor",
    metadataRaw: "{}"
  });

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

  const handleRegisterThing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    setThingRegistering(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      let metadata = {};
      try {
        metadata = JSON.parse(thingForm.metadataRaw);
      } catch {
        throw new Error("I metadati hardware non sono in un formato JSON valido.");
      }

      const response = await fetchWithAppCheck("/api/thing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: thingForm.name,
          type: thingForm.type,
          orgId: activeOrg.orgId,
          metadata
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Errore registrazione dispositivo.");
      }

      setGeneratedThingToken(data.deviceToken);
      setIsThingModalOpen(true);

      const newThingLocal: ThingItem = {
        thingId: data.thingId,
        name: thingForm.name,
        type: thingForm.type,
        status: "inactive",
        createdAt: new Date().toISOString(),
        isTest: false
      };
      setThings(prev => [newThingLocal, ...prev]);
      setThingForm({ name: "", type: "sensor", metadataRaw: "{}" });
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore registrazione.", "error");
    } finally {
      setThingRegistering(false);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Registrazione */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Registra Dispositivo Thing</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">{"Aggiungi un dispositivo IoT hardware all'organizzazione."}</p>
            </div>

            <form onSubmit={handleRegisterThing} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Nome Dispositivo</Label>
                <Input
                  placeholder="Sensore Temperatura A"
                  value={thingForm.name}
                  onChange={e => setThingForm({ ...thingForm, name: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <Select
                selectedKey={thingForm.type}
                onSelectionChange={(key) => setThingForm({ ...thingForm, type: (key as string) || "sensor" })}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Tipo Dispositivo</Label>
                <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-purple-500 rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                  <ListBox className="outline-none">
                    <ListBoxItem id="sensor" textValue="Sensore" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Sensore
                    </ListBoxItem>
                    <ListBoxItem id="camera" textValue="Telecamera" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Telecamera
                    </ListBoxItem>
                    <ListBoxItem id="gateway" textValue="Gateway" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Gateway
                    </ListBoxItem>
                    <ListBoxItem id="controller" textValue="Controller" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                      Controller
                    </ListBoxItem>
                  </ListBox>
                </SelectPopover>
              </Select>
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Metadati Hardware (JSON)</Label>
                <TextArea
                  placeholder='{"firmware": "v1.2.0", "hardware_rev": "B4"}'
                  value={thingForm.metadataRaw}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setThingForm({ ...thingForm, metadataRaw: e.target.value })}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center min-h-[80px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>

              <Button
                type="submit"
                isDisabled={thingRegistering || !hasPermission("thing", "create")}
                className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                {thingRegistering ? "Registrazione..." : "Registra Dispositivo"}
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Elenco Cose */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Dispositivi IoT Thing</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">Elenco e stato dei dispositivi configurati.</p>
            </div>

            {loadingData ? (
              <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></span></div>
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
                      <code className="text-xs font-mono select-all text-purple-600 dark:text-purple-400 break-all pr-8">
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
                    <Button onClick={close} className="font-bold rounded-xl px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white transition-colors cursor-pointer text-sm">
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
