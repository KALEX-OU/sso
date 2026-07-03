"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect } from "@/lib/firebase/client";
import { listPaymentsByOrg } from "@/lib/dataconnect-client";
import {
  Card,
  Chip
} from "@heroui/react";
import { 
  CreditCard, 
  ExternalLink, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  HelpCircle
} from "lucide-react";

interface PaymentItem {
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodType: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
  receiptUrl: string | null;
  createdAt: string;
  errorMessage: string | null;
  invoiceId: string | null;
}

export default function PaymentPage() {
  const { dbData, showToast } = useDashboard();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const organizationId = activeOrg?.orgId;

  const loadPayments = useCallback(async (orgId: string) => {
    setLoading(true);
    try {
      const res = await listPaymentsByOrg(dataConnect, { orgId });
      setPayments((res.data.payments || []) as PaymentItem[]);
    } catch (err) {
      console.error("Errore caricamento pagamenti:", err);
      showToast("Impossibile caricare lo storico dei pagamenti.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadPayments(organizationId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadPayments]);

  // Statistiche veloci
  const totalVolume = payments
    .filter(p => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  const succeededCount = payments.filter(p => p.status === "succeeded").length;
  const failedCount = payments.filter(p => p.status === "failed").length;

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currencyCode || "EUR"
    }).format(amount);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Chip size="sm" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 rounded-lg">
            SUCCESSO
          </Chip>
        );
      case "failed":
        return (
          <Chip size="sm" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 rounded-lg">
            FALLITO
          </Chip>
        );
      case "pending":
        return (
          <Chip size="sm" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 rounded-lg">
            IN CORSO
          </Chip>
        );
      case "refunded":
        return (
          <Chip size="sm" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20 rounded-lg">
            RIMBORSATO
          </Chip>
        );
      default:
        return (
          <Chip size="sm" className="bg-slate-500/10 text-slate-600 dark:text-gray-400 font-bold border border-slate-500/20 rounded-lg">
            {status.toUpperCase()}
          </Chip>
        );
    }
  };

  const getPaymentMethodLabel = (item: PaymentItem) => {
    if (item.cardBrand && item.cardLast4) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300">
          <CreditCard className="w-3.5 h-3.5 opacity-60" />
          <span className="capitalize">{item.cardBrand}</span>
          <span>•••• {item.cardLast4}</span>
        </div>
      );
    }
    return (
      <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
        {item.paymentMethodType === "card" ? "Carta di Credito" : item.paymentMethodType || "N/D"}
      </span>
    );
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500 inline-block mb-3"></span>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
            Caricamento organizzazione attiva...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Storico Transazioni</h1>
        <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
          Visualizza tutti i pagamenti effettuati o tentati per i servizi SaaS KALEX.
        </p>
      </div>

      {/* Grid delle Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-5 shadow-xl">
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-secondary dark:text-violet-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Volume Transato</p>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(totalVolume, "EUR")}
              </h2>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-5 shadow-xl">
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Transazioni Completate</p>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{succeededCount}</h2>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-5 shadow-xl">
          <Card.Content className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-2xl">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Transazioni Fallite</p>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{failedCount}</h2>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Sezione Lista Pagamenti */}
      <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-white/40 dark:bg-slate-950/20">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Storico Pagamenti</h3>

        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500 inline-block mb-3"></span>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold">Caricamento transazioni in corso...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Nessuna transazione trovata</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                Gli acquisti SaaS o di crediti a consumo effettuati per questa organizzazione appariranno in questo registro.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase bg-slate-50/50 dark:bg-slate-950/35">
                  <th className="px-6 py-4">ID Transazione</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Metodo</th>
                  <th className="px-6 py-4">Importo</th>
                  <th className="px-6 py-4">Stato</th>
                  <th className="px-6 py-4 text-right">Ricevuta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-white/5">
                {payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50/40 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-white family-mono">{p.paymentId}</span>
                        {p.errorMessage && (
                          <span className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {p.errorMessage}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">{getPaymentMethodLabel(p)}</td>
                    <td className="px-6 py-4 text-xs font-black text-slate-800 dark:text-white">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-6 py-4">{getStatusChip(p.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-secondary hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                        >
                          Apri <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-gray-500">Non disponibile</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
