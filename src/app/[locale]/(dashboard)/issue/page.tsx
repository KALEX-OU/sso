"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout";
import { AlertCircle, Send, HelpCircle, CheckCircle2, Clock } from "lucide-react";
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import { Button, Card, Input, TextArea, TextField, Label } from "@/framework/components/ui";
import { useI18n } from "@/locales/client";

interface TicketItem {
  id: string;
  title: string;
  category: string;
  status: "open" | "resolved" | "pending";
  date: string;
  message: string;
}

export default function SupportTicketsPage() {
  const { showToast } = useDashboard();
  const t = useI18n();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("billing");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTickets([
        { id: "t1", title: "Problema con pagamento carta credito", category: "Fatturazione", status: "resolved", date: "2026-06-14T10:00:00Z", message: "Il pagamento è andato in errore ma la carta è stata addebitata." },
        { id: "t2", title: "Configurazione sensore IoT in errore", category: "Dispositivi", status: "open", date: "2026-06-18T16:45:00Z", message: "Il firmware non carica le chiavi API all'avvio." }
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMessage) {
      showToast(t("issue.toastMissing"), "error");
      return;
    }
    const ticket: TicketItem = {
      id: "t" + (tickets.length + 1),
      title: newTitle,
      category: newCategory,
      status: "open",
      date: new Date().toISOString(),
      message: newMessage
    };
    setTickets([ticket, ...tickets]);
    setNewTitle("");
    setNewMessage("");
    showToast(t("issue.toastCreated"), "success");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl animate-pulse" />
          <div className="h-96 border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "open":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">{t("issue.title")}</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">{t("issue.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t("issue.myTickets")}</h3>
          {tickets.length === 0 ? (
            <Card className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-7 text-center shadow-xl">
              <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">{t("issue.emptyTitle")}</h4>
              <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto mt-1">{t("issue.emptyDesc")}</p>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-1 shadow-xl hover:scale-[1.005] transition-all">
                {/* Il body del wrapper Card è un contenitore unico: lo spacing verticale vive qui */}
                <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{ticket.category}</span>
                      <span className="text-slate-300 dark:text-white/10 font-bold text-xs">•</span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {new Date(ticket.date).toLocaleDateString("it-IT", { day: "numeric", month: "long" })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ticket.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-slate-600 dark:text-slate-300">
                    {getStatusIcon(ticket.status)} {ticket.status === "resolved" ? t("issue.statusResolved") : (ticket.status === "open" ? t("issue.statusOpen") : t("issue.statusPending"))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  {ticket.message}
                </p>
                </div>
              </Card>
            ))
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t("issue.newTicket")}</h3>
          <Card className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-1 shadow-xl">
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("issue.subjectLabel")}</Label>
                <Input
                  isRequired
                  placeholder={t("issue.subjectPlaceholder")}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-xl px-3.5 py-2 flex items-center h-[42px] text-xs text-slate-900 dark:text-white outline-none w-full transition-all"
                />
              </TextField>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("issue.categoryLabel")}</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-transparent border border-slate-200 dark:border-white/10 rounded-xl text-xs p-3 font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-slate-400"
                >
                  <option value="Fatturazione" className="bg-white dark:bg-slate-900">{t("issue.catBilling")}</option>
                  <option value="Dispositivi" className="bg-white dark:bg-slate-900">{t("issue.catHardware")}</option>
                  <option value="SSO" className="bg-white dark:bg-slate-900">{t("issue.catAccess")}</option>
                  <option value="Altro" className="bg-white dark:bg-slate-900">{t("issue.catOther")}</option>
                </select>
              </div>
              <TextField isRequired className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("issue.messageLabel")}</Label>
                <TextArea
                  isRequired
                  placeholder={t("issue.messagePlaceholder")}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  rows={4}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-secondary rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none w-full transition-all min-h-[100px]"
                />
              </TextField>
              <Button
                unstyled
                type="submit"
                className="w-full font-black text-xs rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 py-3 flex items-center justify-center gap-1.5"
              >
                {t("issue.submit")} <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
