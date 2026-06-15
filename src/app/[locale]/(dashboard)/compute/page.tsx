"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import { Card, Button, Input, Chip, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem, Label, TextField } from "@heroui/react";
import { Cpu, Play, Terminal, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

interface SimulationResult {
  serviceId: string;
  usage: number;
  unit: string;
  stripeUsageRecordId?: string;
  isSandbox: boolean;
}

export default function ComputePage() {
  const { user, dbData, showToast } = useDashboard();
  
  // Dati dell'organizzazione
  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const isOrgSandbox = activeOrg?.isTest === true; // Indica se l'organizzazione è in modalità Test (Sandbox)

  // Stati del form
  const [form, setForm] = useState({
    serviceId: "compute/vm-micro",
    usage: 10,
    unit: "hour"
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Forza l'unità di misura in base al servizio selezionato al momento del cambio
  const handleServiceChange = (key: string) => {
    const serviceId = key || "compute/vm-micro";
    let unit = "request";
    if (serviceId === "compute/vm-micro") {
      unit = "hour";
    } else if (serviceId === "compute/ai-translation") {
      unit = "token";
    }
    setForm(prev => ({ ...prev, serviceId, unit }));
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    setLoading(true);
    setResult(null);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("Non autenticato.");

      const response = await fetch("/api/compute/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          serviceId: form.serviceId,
          usage: Number(form.usage),
          unit: form.unit
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Errore durante la simulazione.");
      }

      setResult(data.data as SimulationResult);
      showToast("Consumo simulato registrato correttamente su Stripe Sandbox!", "success");
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore simulazione.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Compute & Risorse a Consumo</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Monitora le istanze di calcolo in tempo reale e simula i consumi all&apos;interno dell&apos;ambiente di sviluppo.
          </p>
        </div>
        
        <div>
          {isOrgSandbox ? (
            <Chip color="warning" variant="soft" className="font-extrabold text-[9px] uppercase border border-warning/10">
              Ambiente Sandbox Attivo
            </Chip>
          ) : (
            <Chip color="success" variant="soft" className="font-extrabold text-[9px] uppercase border border-success/10">
              Produzione (Live Mode)
            </Chip>
          )}
        </div>
      </div>

      {/* Grafici fittizi dei consumi in SVG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Uso CPU (VM)</span>
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">142.5 ore</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Consumate questo mese</p>
            </div>
            
            {/* Grafico SVG mini */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                  d="M0 15 Q 15 5, 30 12 T 60 4 T 90 14 L 100 10 L 100 20 L 0 20 Z"
                  fill="url(#purple-gradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 15 Q 15 5, 30 12 T 60 4 T 90 14 L 100 10"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.8)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="purple-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Token Elaborati (AI)</span>
              <Cpu className="w-4 h-4 text-pink-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">1.2M token</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Traduzioni ed inferenze AI</p>
            </div>

            {/* Grafico SVG mini */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                  d="M0 10 Q 20 18, 40 8 T 70 12 T 100 3 L 100 20 L 0 20 Z"
                  fill="url(#pink-gradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 10 Q 20 18, 40 8 T 70 12 T 100 3"
                  fill="none"
                  stroke="rgba(236, 72, 153, 0.8)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="pink-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Costo Stimato Mese</span>
              <span className="text-xs font-bold text-slate-400">EUR</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">€59.40</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Esclusi sconti ed esenzioni</p>
            </div>

            {/* Grafico SVG mini */}
            <div className="h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                  d="M0 18 Q 20 10, 45 15 T 80 5 T 100 2 L 100 20 L 0 20 Z"
                  fill="url(#blue-gradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 18 Q 20 10, 45 15 T 80 5 T 100 2"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.8)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modulo Simulatore Sandbox */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
          <Card.Content className="p-2 space-y-4">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-500" />
                Simulatore Sandbox
              </h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">
                Simula i consumi delle VM o chiamate API nell&apos;organizzazione di test.
              </p>
            </div>

            {!isOrgSandbox ? (
              <div className="bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-2xl text-[10px] font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  La simulazione dei consumi è consentita esclusivamente in ambiente Sandbox (test mode). In produzione, i consumi reali vengono tracciati ed addebitati automaticamente via API Gateway.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSimulate} className="space-y-4">
                <Select
                  selectedKey={form.serviceId}
                  onSelectionChange={(key) => handleServiceChange(key as string)}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Servizio da Simulare</Label>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-purple-500 rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                    <ListBox className="outline-none">
                      <ListBoxItem id="compute/vm-micro" textValue="VM Micro Instance (compute/vm-micro)" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                        VM Micro Instance
                      </ListBoxItem>
                      <ListBoxItem id="compute/ai-translation" textValue="AI Translation Service (compute/ai-translation)" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                        AI Translation Service
                      </ListBoxItem>
                      <ListBoxItem id="vies-validator" textValue="VIES Validator API (vies-validator)" className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                        VIES Validator API
                      </ListBoxItem>
                    </ListBox>
                  </SelectPopover>
                </Select>

                <TextField isRequired className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Quantità Consumo</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="any"
                    value={form.usage}
                    onChange={e => setForm({ ...form, usage: Number(e.target.value) || 0 })}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-purple-500 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all"
                  />
                </TextField>

                <TextField isDisabled className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">Unità di Misura</Label>
                  <Input
                    value={form.unit}
                    className="bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-500 dark:text-gray-400 w-full"
                  />
                </TextField>

                <Button
                  type="submit"
                  isDisabled={loading}
                  className="w-full py-5 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-950"></span>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Simula Consumo
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card.Content>
        </Card>

        {/* Pannello Risultato Simulazione */}
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
          <Card.Content className="p-2 space-y-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Output del simulatore</h3>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">
                Qui apparirà la risposta inviata da Stripe Billing Meters in tempo reale.
              </p>
            </div>

            {result ? (
              <div className="space-y-4 flex-1 mt-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-semibold">
                    <p>Evento registrato ed inoltrato a Stripe Meters.</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Identificativo Stripe: {result.stripeUsageRecordId || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-purple-400 overflow-x-auto space-y-1">
                  <p className="text-slate-500">{"// Payload di risposta di Stripe Billing Meters"}</p>
                  <p>{"{"}</p>
                  <p className="pl-4">&quot;success&quot;: true,</p>
                  <p className="pl-4">&quot;message&quot;: &quot;Consumo registrato con successo.&quot;,</p>
                  <p className="pl-4">&quot;data&quot;: {"{"}</p>
                  <p className="pl-8">&quot;serviceId&quot;: &quot;{result.serviceId}&quot;,</p>
                  <p className="pl-8">&quot;usage&quot;: {result.usage},</p>
                  <p className="pl-8">&quot;unit&quot;: &quot;{result.unit}&quot;,</p>
                  <p className="pl-8">&quot;stripeUsageRecordId&quot;: &quot;{result.stripeUsageRecordId || "null"}&quot;,</p>
                  <p className="pl-8">&quot;isSandbox&quot;: {String(result.isSandbox)}</p>
                  <p className="pl-4">{"}"}</p>
                  <p>{"}"}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                <Terminal className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <p className="text-slate-400 dark:text-gray-500 text-xs font-bold mt-2">Nessun evento simulato</p>
                <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5 max-w-xs">Configura i parametri del simulatore a sinistra e premi &quot;Simula Consumo&quot; per iniziare.</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
