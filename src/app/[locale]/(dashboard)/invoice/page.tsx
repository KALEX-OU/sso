"use client";

import React, { useState } from "react";
import { useDashboard } from "../layout";
import { Card, Button, Chip } from "@heroui/react";
import { FileText, Download, FileCode } from "lucide-react";

interface InvoiceItem {
  invoiceId: string;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  type: "service" | "product";
  description: string;
  buyerOrgName: string;
  sellerOrgName: string;
  sdiStatus?: "delivered" | "failed" | "split_payment";
}

const MOCK_BUYER_INVOICES: InvoiceItem[] = [
  {
    invoiceId: "inv_01",
    invoiceNumber: "K-2026-00084",
    issueDate: "2026-06-01",
    amount: 15.00,
    status: "paid",
    type: "service",
    description: "Abbonamento Mensile KALEX Safety (1 Seat)",
    buyerOrgName: "La Mia Organizzazione",
    sellerOrgName: "KALEX SRL",
    sdiStatus: "delivered"
  },
  {
    invoiceId: "inv_02",
    invoiceNumber: "K-2026-00059",
    issueDate: "2026-05-15",
    amount: 298.00,
    status: "paid",
    type: "product",
    description: "Acquisto Hardware (1x Gateway Pro, 1x Antenna RF)",
    buyerOrgName: "La Mia Organizzazione",
    sellerOrgName: "KALEX SRL",
    sdiStatus: "delivered"
  },
  {
    invoiceId: "inv_03",
    invoiceNumber: "K-2026-00021",
    issueDate: "2026-05-01",
    amount: 75.00,
    status: "paid",
    type: "service",
    description: "Abbonamento Mensile KALEX Safety (5 Seats)",
    buyerOrgName: "La Mia Organizzazione",
    sellerOrgName: "KALEX SRL",
    sdiStatus: "delivered"
  }
];

const MOCK_SELLER_INVOICES: InvoiceItem[] = [
  {
    invoiceId: "inv_sel_01",
    invoiceNumber: "OUT-2026-00003",
    issueDate: "2026-06-05",
    amount: 1250.00,
    status: "paid",
    type: "service",
    description: "Servizi di Consulenza Edge Computing per Safety Integration",
    buyerOrgName: "Società Partner SpA",
    sellerOrgName: "La Mia Organizzazione",
    sdiStatus: "delivered"
  },
  {
    invoiceId: "inv_sel_02",
    invoiceNumber: "OUT-2026-00002",
    issueDate: "2026-05-20",
    amount: 490.00,
    status: "pending",
    type: "product",
    description: "Fornitura 10x Sensori Ambientali Smart (Stock)",
    buyerOrgName: "Cliente Beta SRL",
    sellerOrgName: "La Mia Organizzazione",
    sdiStatus: "split_payment"
  }
];

export default function InvoicePage() {
  const { showToast } = useDashboard();
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const invoices = activeTab === "buyer" ? MOCK_BUYER_INVOICES : MOCK_SELLER_INVOICES;

  const handleDownloadPDF = (invoiceId: string, invoiceNumber: string) => {
    setDownloadingId(invoiceId);
    showToast(`Generazione del PDF per la fattura ${invoiceNumber}...`, "info");
    
    setTimeout(() => {
      // Simula il download creando un file fittizio
      const blob = new Blob([`KALEX FATTURA ${invoiceNumber}\nImporto: €...\nStato: PAGATO`], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fattura-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast(`Fattura ${invoiceNumber} scaricata con successo.`, "success");
      setDownloadingId(null);
    }, 2000);
  };

  const handleExportSDI = (invoiceId: string, invoiceNumber: string) => {
    setExportingId(invoiceId);
    showToast(`Generazione XML per il Sistema di Interscambio (SDI)...`, "info");
    
    setTimeout(() => {
      const blob = new Blob([`<FatturaElettronica><Numero>${invoiceNumber}</Numero><EsigibilitaIVA>SPLIT_PAYMENT</EsigibilitaIVA></FatturaElettronica>`], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sdi-${invoiceNumber}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast(`File XML SDI per fattura ${invoiceNumber} generato correttamente.`, "success");
      setExportingId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Fatture & Amministrazione</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Visualizza e scarica le fatture d&apos;acquisto (Buyer) o emesse come fornitore/partner (Seller).
          </p>
        </div>
      </div>

      <div className="flex justify-start border-b border-slate-200 dark:border-white/5 pb-0.5">
        <button
          onClick={() => setActiveTab("buyer")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "buyer"
              ? "border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Acquisti (Buyer Scope)
        </button>
        <button
          onClick={() => setActiveTab("seller")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "seller"
              ? "border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Vendite / Partner (Seller Scope)
        </button>
      </div>

      <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
        <Card.Content className="p-2 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Numero / Data</th>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Descrizione</th>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">{activeTab === "buyer" ? "Fornitore" : "Cliente"}</th>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Importo</th>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl">Stato</th>
                  <th className="bg-slate-100 dark:bg-white/5 font-bold text-xs px-4 py-3 text-slate-500 dark:text-slate-400 first:rounded-l-xl last:rounded-r-xl text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
                {invoices.map((invoice, idx) => {
                  const isDownloading = downloadingId === invoice.invoiceId;
                  const isExporting = exportingId === invoice.invoiceId;

                  return (
                    <tr key={invoice.invoiceId || idx} className="border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-purple-500" />
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white max-w-xs truncate">{invoice.description}</p>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">
                            {invoice.type === "service" ? "Servizio Cloud" : "Hardware"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400">
                        {activeTab === "buyer" ? invoice.sellerOrgName : invoice.buyerOrgName}
                      </td>
                      <td className="px-4 py-4 text-xs font-black text-slate-900 dark:text-white">
                        €{invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          {invoice.status === "paid" && (
                            <Chip size="sm" color="success" variant="soft" className="font-bold text-[8px] uppercase">
                              Pagata
                            </Chip>
                          )}
                          {invoice.status === "pending" && (
                            <Chip size="sm" color="warning" variant="soft" className="font-bold text-[8px] uppercase">
                              In Attesa
                            </Chip>
                          )}
                          
                          {/* Stato SDI per conformità fatturazione elettronica italiana */}
                          {invoice.sdiStatus === "delivered" && (
                            <span className="text-[8px] text-emerald-500 font-extrabold uppercase">SDI Consegnata</span>
                          )}
                          {invoice.sdiStatus === "split_payment" && (
                            <span className="text-[8px] text-cyan-500 font-extrabold uppercase">Split Payment</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        {/* Esportazione XML SDI */}
                        <span title="Esporta XML per SDI" className="inline-block">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            isDisabled={isExporting}
                            className="rounded-xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer inline-flex items-center justify-center p-1.5"
                            onClick={() => handleExportSDI(invoice.invoiceId, invoice.invoiceNumber)}
                          >
                            {isExporting ? (
                              <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-slate-500"></span>
                            ) : (
                              <FileCode className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </span>

                        {/* Download PDF */}
                        <span title="Scarica PDF" className="inline-block">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            isDisabled={isDownloading}
                            className="rounded-xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer inline-flex items-center justify-center p-1.5"
                            onClick={() => handleDownloadPDF(invoice.invoiceId, invoice.invoiceNumber)}
                          >
                            {isDownloading ? (
                              <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-slate-500"></span>
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
