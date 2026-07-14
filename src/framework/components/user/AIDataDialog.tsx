"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui";
import { Cpu, Send, Bot, User, Sparkles, X } from "lucide-react";
import { useDashboard } from "@/framework/components/layouts/DashboardContext";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface AIDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIDataDialog({ isOpen, onClose }: AIDataDialogProps) {
  const { dbData } = useDashboard();
  const brand = useBrand();
  const s = useUIStrings();
  const suggestedPrompts = [
    s.dialogs.ai.promptOrg,
    s.dialogs.ai.promptSubs,
    s.dialogs.ai.promptRole
  ];
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: fmtUI(s.dialogs.ai.greeting, { brand: brand.name }),
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
    const orgName = organization?.name || s.dialogs.ai.orgNone;
    const orgRole = organization?.role || "Viewer";
    const subs = organization?.subscriptions || [];

    // Risposta simulata basata sui dati reali del dashboard
    setTimeout(() => {
      let aiText = s.dialogs.ai.answerFallback;
      const cleanText = text.toLowerCase();

      if (cleanText.includes("organizzazion") || cleanText.includes("azienda") || cleanText.includes("dati")) {
        aiText = fmtUI(s.dialogs.ai.orgReport, {
          org: orgName,
          onboarding: organization?.confirmed ? s.dialogs.ai.orgConfirmed : s.dialogs.ai.orgPending,
          type: organization?.type || s.dialogs.ai.orgTypeStandard,
          country: organization?.country || s.dialogs.ai.orgCountryUnknown,
          env: organization?.isTest ? s.dialogs.ai.envTest : s.dialogs.ai.envProd,
          vies: organization?.viesValidated ? s.dialogs.ai.viesOk : s.dialogs.ai.viesKo,
          role: orgRole.toUpperCase()
        });
      } else if (cleanText.includes("sub") || cleanText.includes("sottoscrizion") || cleanText.includes("abbonament") || cleanText.includes("serviz")) {
        if (subs.length === 0) {
          aiText = fmtUI(s.dialogs.ai.subsEmpty, { org: orgName });
        } else {
          aiText = fmtUI(s.dialogs.ai.subsFound, { count: subs.length, org: orgName }) + "\n\n" +
                   subs.map((sub, idx) => fmtUI(s.dialogs.ai.subItem, {
                     index: idx + 1,
                     service: sub.appId.toUpperCase(),
                     status: sub.status === "active" ? s.dialogs.ai.subStatusActive : fmtUI(s.dialogs.ai.subStatusOther, { status: sub.status }),
                     renewal: sub.cancelAtPeriodEnd ? s.dialogs.ai.renewalOff : s.dialogs.ai.renewalOn,
                     expiry: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString("it-IT") : s.dialogs.ai.notAvailable
                   })).join("\n\n");
        }
      } else if (cleanText.includes("permess") || cleanText.includes("ruolo") || cleanText.includes("claims")) {
        aiText = fmtUI(s.dialogs.ai.roleReport, {
          role: orgRole.toUpperCase(),
          bypass: orgRole.toLowerCase() === "owner" ? s.dialogs.ai.bypassOn : s.dialogs.ai.bypassOff,
          brand: brand.name
        });
      } else if (cleanText.includes("ciao") || cleanText.includes("salve")) {
        aiText = s.dialogs.ai.answerGreeting;
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
        <Modal.Container className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          <Modal.Dialog className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-900/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
                  <Cpu className="w-5 h-5 text-slate-950 font-bold" />
                </div>
                <div className="text-start">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    {fmtUI(s.dialogs.ai.title, { brand: brand.name })}
                  </h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    {s.dialogs.ai.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 py-4 overflow-y-auto scrollbar-none flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-3.5 pe-1">
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
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap text-start ${
                        msg.sender === "user"
                          ? "bg-primary/90 text-white rounded-se-none"
                          : "bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-ss-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 self-start">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-ss-none p-3.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggerimenti rapidi */}
              {messages.length === 1 && (
                <div className="mt-2 text-start">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> {s.dialogs.ai.suggestionsLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900/50 hover:bg-primary/10 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary border border-slate-200 dark:border-slate-900 hover:border-primary/30 dark:hover:border-primary/30 py-1.5 px-3 rounded-full transition-all cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-900/60 pt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder={fmtUI(s.dialogs.ai.inputPlaceholder, { brand: brand.name })}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(inputValue);
                }}
                className="flex-1 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200/70 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900/60 hover:border-slate-300 dark:hover:border-slate-800 transition-colors text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl p-2.5 cursor-pointer shadow-lg transition-colors flex items-center justify-center shrink-0"
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
