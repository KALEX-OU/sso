import React, { useState, useEffect, useCallback } from "react";
import { FileText, Download } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { ListView, ActiveFilter } from "../layouts/ListView";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../ui/Table";
import { Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "@heroui/react";
import styles from "./invoice.module.css";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

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
        selectedKey={filterType}
        onSelectionChange={(key) => setFilterType(key as "all" | "received" | "issued")}
        aria-label="Filtro flusso fatture"
      >
        <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 flex items-center justify-between h-[40px] w-full text-xs text-slate-900 dark:text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
          <ListBox>
            <ListBoxItem id="all" textValue="Tutti i flussi">Tutti i flussi</ListBoxItem>
            <ListBoxItem id="received" textValue="Fatture Ricevute">Fatture Ricevute</ListBoxItem>
            <ListBoxItem id="issued" textValue="Fatture Emesse">Fatture Emesse</ListBoxItem>
          </ListBox>
        </SelectPopover>
      </Select>
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
          <Table aria-label="Tabella Fatture">
            <TableHeader>
              {columns.map(col => (
                <TableColumn key={col.key} className="text-xs font-bold">{col.header}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-xs">
                    Nessuna fattura corrisponde ai criteri impostati.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map(item => (
                  <TableRow key={item.invoiceId} className="border-b border-divider/40 last:border-0 hover:bg-default-50/50 transition-colors">
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item) : String(item[col.key as keyof InvoiceItem] || "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ListView>
      </div>
    </BaseModuleLayout>
  );
};
export type { ActiveFilter };
