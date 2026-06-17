import React, { useState, useEffect, useCallback } from "react";
import { FileText, Download } from "lucide-react";
import { BaseModuleLayout } from "../layout/BaseModuleLayout";
import { ListView, ActiveFilter } from "../ui/ListView";
import { Table, Column } from "../ui/Table";
import { Select } from "../ui/Select";
import styles from "./invoice.module.css";

interface InvoiceItem {
  invoiceId: string;
  amount: number;
  status: string;
  pdfUrl?: string | null;
  taxPercent?: number | null;
  taxAmount?: number | null;
  subtotal?: number | null;
  createdAt: string;
  type: "received" | "issued";
  buyer?: {
    orgId: string;
    name: string;
  } | null;
  seller?: {
    orgId: string;
    name: string;
  } | null;
}

interface InvoiceModuleProps {
  organizationId: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
}

export const InvoiceModule: React.FC<InvoiceModuleProps> = ({
  organizationId,
  fetchAuthed
}) => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "received" | "issued">("all");

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed("/api/invoice/list");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.items || data.invoices || []);
      } else {
        const errMsg = data.error && typeof data.error === "object" && "message" in data.error
          ? String(data.error.message)
          : typeof data.error === "string"
            ? data.error
            : "Impossibile recuperare lo storico fatture.";
        setError(errMsg);
      }
    } catch (err) {
      console.error("[InvoiceModule] Load Error:", err);
      setError("Errore di connessione durante il caricamento delle fatture.");
    } finally {
      setLoading(false);
    }
  }, [fetchAuthed]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadInvoices();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadInvoices]);

  const activeFilters: ActiveFilter[] = [];
  if (filterType !== "all") {
    activeFilters.push({
      id: "type",
      label: "Tipo",
      value: filterType,
      displayValue: filterType === "received" ? "Ricevute" : "Emesse"
    });
  }

  const handleRemoveFilter = (id: string) => {
    if (id === "type") setFilterType("all");
  };

  const handleClearAllFilters = () => {
    setFilterType("all");
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterType !== "all" && inv.type !== filterType) return false;

    const term = search.toLowerCase();
    const buyerName = inv.buyer?.name?.toLowerCase() || "";
    const sellerName = inv.seller?.name?.toLowerCase() || "";
    return (
      inv.invoiceId.toLowerCase().includes(term) ||
      buyerName.includes(term) ||
      sellerName.includes(term) ||
      inv.amount.toString().includes(term)
    );
  });

  const columns: Column<InvoiceItem>[] = [
    {
      key: "invoiceId",
      header: "Fattura ID / Riferimento",
      render: (item) => (
        <div className={styles.invoiceRef}>
          <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <div className={styles.refCode} title={item.invoiceId}>
            {item.invoiceId.substring(0, 8)}...{item.invoiceId.substring(item.invoiceId.length - 4)}
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: "type",
      header: "Flusso",
      render: (item) => (
        <span className={`${styles.typeBadge} ${item.type === "received" ? styles.badgeReceived : styles.badgeIssued}`}>
          {item.type === "received" ? "Ricevuta" : "Emessa"}
        </span>
      ),
      sortable: true
    },
    {
      key: "partner",
      header: "Controparte",
      render: (item) => (
        <div className={styles.partnerInfo}>
          {item.type === "received" ? (
            <span>Da: <strong>{item.seller?.name || "KALEX CLOUD"}</strong></span>
          ) : (
            <span>A: <strong>{item.buyer?.name || "Cliente Partner"}</strong></span>
          )}
        </div>
      )
    },
    {
      key: "createdAt",
      header: "Data",
      render: (item) => (
        <span className={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })}
        </span>
      ),
      sortable: true
    },
    {
      key: "amount",
      header: "Importo Lordo",
      render: (item) => (
        <div className={styles.amountInfo}>
          <span className={styles.mainAmount}>
            {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.amount)}
          </span>
          {item.taxAmount !== undefined && item.taxAmount !== null && (
            <span className={styles.subAmount}>
              (IVA {item.taxPercent}%: {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.taxAmount)})
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: "status",
      header: "Stato",
      render: (item) => (
        <span className={`${styles.statusBadge} ${item.status === "paid" ? styles.statusPaid : styles.statusPending}`}>
          {item.status}
        </span>
      ),
      sortable: true
    },
    {
      key: "download",
      header: "Azioni",
      render: (item) => {
        if (!item.pdfUrl) {
          return <span className={styles.noPdf}>Nessun PDF</span>;
        }
        return (
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadLink}
          >
            <Download className="w-3.5 h-3.5" />
            Scarica
          </a>
        );
      }
    }
  ];

  const filterContent = (
    <div className={styles.filterBar}>
      <Select
        options={[
          { value: "all", label: "Tutti i flussi" },
          { value: "received", label: "Fatture Ricevute" },
          { value: "issued", label: "Fatture Emesse" }
        ]}
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as "all" | "received" | "issued")}
        className={styles.filterSelect}
      />
    </div>
  );

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className={styles.invoiceModule}>
        <ListView
          title="Registro Fatture e Ricevute"
          description="Consulta lo storico cronologico di tutte le fatture ricevute per acquisti SaaS e delle fatture emesse verso clienti partner."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cerca fattura per ID o controparte..."
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          filterContent={filterContent}
        >
          <Table
            data={filteredInvoices}
            columns={columns}
            rowKey={(item) => item.invoiceId}
            emptyContent="Nessuna fattura corrisponde ai criteri impostati."
          />
        </ListView>
      </div>
    </BaseModuleLayout>
  );
};
export type { ActiveFilter };
