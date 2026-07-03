"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui";
import { LifeBuoy, Send, Bot, User, Sparkles, X } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "Come genero una chiave API?",
  "Come funziona l'onboarding Stripe?",
  "Cos'è la protezione FLS?",
  "Come cambio lingua o tema?"
];

export function SupportDialog({ isOpen, onClose }: SupportDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Ciao! Sono l'assistente virtuale di KALEX Cloud. Come posso aiutarti oggi con i nostri prodotti o servizi?",
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

    // Risposta simulata intelligente basata sul testo
    setTimeout(() => {
      let aiText = "Mi dispiace, non ho capito la richiesta. Puoi riformulare la domanda sui servizi KALEX?";
      const cleanText = text.toLowerCase();

      if (cleanText.includes("api") || cleanText.includes("chiave")) {
        aiText = "Per generare una chiave API su KALEX:\n1. Accedi alla sezione **API Key** dal menu laterale.\n2. Clicca su **Crea Chiave**.\n3. Specifica i permessi per ciascun modulo e clicca su Genera.\n\n*Nota: Ricorda di salvare la chiave subito, non verrà mostrata una seconda volta per ragioni di sicurezza.*";
      } else if (cleanText.includes("stripe") || cleanText.includes("onboarding") || cleanText.includes("pagament")) {
        aiText = "L'onboarding di Stripe ti consente di attivare i pagamenti. Puoi completarlo accedendo alla sezione **Payment** o dalla pagina del profilo dell'organizzazione, dove verrai reindirizzato su Stripe Connect per inserire i dati fiscali della tua azienda.";
      } else if (cleanText.includes("fls") || cleanText.includes("sicurezza") || cleanText.includes("rbac")) {
        aiText = "KALEX adotta una sicurezza a livello di singolo campo (Field-Level Security - FLS) e RBAC. Le politiche sono definite staticamente in `resources.config.ts`. Solo gli utenti con ruolo `owner` scavalcano questi controlli, mentre per gli altri ruoli le proprietà in ingresso e in uscita vengono filtrate automaticamente.";
      } else if (cleanText.includes("tema") || cleanText.includes("lingua") || cleanText.includes("esci")) {
        aiText = "Puoi cambiare il tema (chiaro/scuro) cliccando sull'icona del sole/luna in basso a sinistra della sidebar. La lingua viene gestita in base al locale impostato nell'URL (it/en/es) ed è modificabile dal pannello impostazioni utente.";
      } else if (cleanText.includes("ciao") || cleanText.includes("salve")) {
        aiText = "Ciao! Come posso esserti utile oggi? Posso spiegarti come funzionano le API Key, l'onboarding Stripe, o le nostre politiche di sicurezza.";
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-accent flex items-center justify-center shadow-lg">
                  <LifeBuoy className="w-5 h-5 text-slate-950 font-bold" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                    Supporto Virtuale KALEX
                  </h3>
                  <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">
                    AI Agent attivo
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
                          ? "bg-secondary text-white"
                          : "bg-slate-900 border border-slate-800 text-violet-400"
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
                          ? "bg-secondary/90 text-white rounded-tr-none"
                          : "bg-slate-900/60 border border-slate-800 text-slate-300 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 self-start">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggerimenti rapidi */}
              {messages.length === 1 && (
                <div className="mt-2 text-left">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Suggerimenti rapidi:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] font-bold bg-slate-900/50 hover:bg-violet-950/20 text-slate-300 hover:text-violet-400 border border-slate-900 hover:border-violet-900/40 py-1.5 px-3 rounded-full transition-all cursor-pointer"
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
                placeholder="Fai una domanda sul supporto KALEX..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(inputValue);
                }}
                className="flex-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-900/60 hover:border-slate-800 transition-colors text-xs text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none focus:border-violet-500"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="bg-secondary hover:bg-violet-500 text-white rounded-xl p-2.5 cursor-pointer shadow-lg transition-colors flex items-center justify-center shrink-0"
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
