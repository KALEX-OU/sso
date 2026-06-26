"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "@heroui/react";
import { Cpu, Send, Bot, User, Sparkles, X } from "lucide-react";
import { useDashboard } from "@/framework/components/layouts/DashboardContext";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface AIDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "Analizza la mia organizzazione",
  "Mostra lo stato delle mie subscription",
  "Quali permessi ha il mio ruolo?"
];

export function AIDataDialog({ isOpen, onClose }: AIDataDialogProps) {
  const { dbData } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Ciao! Sono l'agente di Analisi AI di KALEX. Sono connesso in tempo reale ai tuoi dati di sessione e dell'organizzazione. Chiedimi pure un'analisi strutturata o informazioni sulle risorse attive.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const organization = dbData?.organization;
    const orgName = organization?.name || "Nessuna Organizzazione Associata";
    const orgRole = dbData?.userOrganizations_on_user?.[0]?.role || organization?.role || "Viewer";
    const subs = organization?.subscriptions_on_organization || [];

    // Risposta simulata basata sui dati reali del dashboard
    setTimeout(() => {
      let aiText = "Non ho elementi sufficienti per analizzare questa specifica richiesta. Prova a chiedermi un report dell'organizzazione o lo stato dei servizi.";
      const cleanText = text.toLowerCase();

      if (cleanText.includes("organizzazion") || cleanText.includes("azienda") || cleanText.includes("dati")) {
        aiText = `Ecco l'analisi dei dati per l'organizzazione **${orgName}**:\n` +
                 `- **Stato Onboarding**: ${organization?.confirmed ? "🟢 Confermato ed Attivo" : "🟡 In attesa / Da confermare"}\n` +
                 `- **Tipo Organizzazione**: ${organization?.type || "Standard"}\n` +
                 `- **Paese di Registrazione**: ${organization?.country || "Non Specificato"}\n` +
                 `- **Modalità Ambiente**: ${organization?.isTest ? "🧪 Test Environment" : "⚡ Production Live"}\n` +
                 `- **Verifica P.IVA (VIES)**: ${organization?.viesValidated ? "✅ Validata con successo" : "❌ Non validata o non presente"}\n\n` +
                 `*Il tuo ruolo all'interno di questa organizzazione è **${orgRole.toUpperCase()}**, che ti garantisce la visibilità delle risorse.*`;
      } else if (cleanText.includes("sub") || cleanText.includes("sottoscrizion") || cleanText.includes("abbonament") || cleanText.includes("serviz")) {
        if (subs.length === 0) {
          aiText = `Per l'organizzazione **${orgName}** non risultano licenze o abbonamenti attivi al momento. Puoi attivarne uno dalla sezione **Product** del nostro portale.`;
        } else {
          aiText = `Ho trovato **${subs.length}** abbonamenti attivi per **${orgName}**:\n\n` +
                   subs.map((sub, idx) => (
                     `${idx + 1}. **Servizio**: ${sub.appId.toUpperCase()}\n` +
                     `   - **Stato**: ${sub.status === "active" ? "🟢 Attivo" : "🟡 " + sub.status}\n` +
                     `   - **Rinnovo Automatico**: ${sub.cancelAtPeriodEnd ? "❌ Disattivato" : "✅ Attivo"}\n` +
                     `   - **Scadenza Periodo**: ${sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString("it-IT") : "N/D"}`
                   )).join("\n\n");
        }
      } else if (cleanText.includes("permess") || cleanText.includes("ruolo") || cleanText.includes("claims")) {
        aiText = `Analisi dei privilegi per l'utente loggato:\n` +
                 `- **Ruolo Assegnato**: \`${orgRole.toUpperCase()}\`\n` +
                 `- **Bypass RBAC/FLS**: ${orgRole.toLowerCase() === "owner" ? "✅ Abilitato (Bypass completo)" : "❌ Disabilitato (Soggetto a policy)"}\n\n` +
                 `I tuoi permessi operativi ti consentono di visualizzare e gestire le risorse in conformità con il registro statico di sicurezza di KALEX per l'applicazione corrente.`;
      } else if (cleanText.includes("ciao") || cleanText.includes("salve")) {
        aiText = `Ciao! Posso eseguire un'analisi dei tuoi dati in tempo reale. Chiedimi pure un riassunto dell'organizzazione o lo stato degli abbonamenti attivi.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiText,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable={true} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <Modal.Container className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          <Modal.Dialog className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Cpu className="w-5 h-5 text-slate-950 font-bold" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                    Analizzatore Dati AI KALEX
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                    Gemini Agent integrato
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 py-4 overflow-y-auto scrollbar-none flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-3.5 pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${
                      msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === "user"
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-900 border border-slate-800 text-cyan-400"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap text-left ${
                        msg.sender === "user"
                          ? "bg-cyan-600/90 text-white rounded-tr-none"
                          : "bg-slate-900/60 border border-slate-800 text-slate-300 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 self-start">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggerimenti rapidi */}
              {messages.length === 1 && (
                <div className="mt-2 text-left">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Suggerimenti rapidi:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] font-bold bg-slate-900/50 hover:bg-cyan-950/20 text-slate-300 hover:text-cyan-400 border border-slate-900 hover:border-cyan-900/40 py-1.5 px-3 rounded-full transition-all cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-900/60 pt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Chiedi un'analisi all'AI di KALEX..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(inputValue);
                }}
                className="flex-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-900/60 hover:border-slate-800 transition-colors text-xs text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl p-2.5 cursor-pointer shadow-lg transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
