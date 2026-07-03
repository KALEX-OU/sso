import React, { useState, useEffect, useCallback } from "react";
import { FileText, Download } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { ListView, ActiveFilter } from "../layouts/ListView";
import { Table, SelectRoot, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "../ui";

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
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <div className="font-mono text-[13px] font-semibold text-slate-900 dark:text-white" title={item.invoiceId}>
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
        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          item.type === "received" 
            ? "bg-violet-500/8 text-violet-500 border border-violet-500/20" 
            : "bg-blue-500/8 text-blue-500 border border-blue-500/20"
        }`}>
          {item.type === "received" ? "Ricevuta" : "Emessa"}
        </span>
      ),
      sortable: true
    },
    {
      key: "partner",
      header: "Controparte",
      render: (item) => (
        <div className="text-[13px] text-slate-600 dark:text-slate-400">
          {item.type === "received" ? (
            <span>Da: <strong className="text-slate-900 dark:text-white">{item.seller?.name || "KALEX CLOUD"}</strong></span>
          ) : (
            <span>A: <strong className="text-slate-900 dark:text-white">{item.buyer?.name || "Cliente Partner"}</strong></span>
          )}
        </div>
      )
    },
    {
      key: "createdAt",
      header: "Data",
      render: (item) => (
        <span className="text-[13px] text-slate-500">
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
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.amount)}
          </span>
          {item.taxAmount !== undefined && item.taxAmount !== null && (
            <span className="text-[11px] text-slate-500 mt-0.5">
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
        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          item.status === "paid" 
            ? "bg-emerald-500/8 text-emerald-500 border border-emerald-500/20" 
            : "bg-amber-500/8 text-amber-500 border border-amber-500/20"
        }`}>
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
          return <span className="text-xs text-slate-400 italic">Nessun PDF</span>;
        }
        return (
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-violet-500/20 bg-violet-500/5 text-violet-500 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Scarica
          </a>
        );
      }
    }
  ];

  const filterContent = (
    <div className="flex items-center gap-4">
      {/* SelectRoot (root nativo, senza contenitore di campo): filtro inline nella toolbar */}
      <SelectRoot
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
      </SelectRoot>
    </div>
  );

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className="w-full">
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
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  {columns.map(col => (
                    <Table.Column key={col.key} id={col.key} className="text-xs font-bold">{col.header}</Table.Column>
                  ))}
                </Table.Header>
                <Table.Body
                  renderEmptyState={() => (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Nessuna fattura corrisponde ai criteri impostati.
                    </div>
                  )}
                >
                  {filteredInvoices.map(item => (
                    <Table.Row key={item.invoiceId} id={item.invoiceId} className="border-b border-divider/40 last:border-0 hover:bg-default-50/50 transition-colors">
                      {columns.map(col => (
                        <Table.Cell key={col.key} id={`${item.invoiceId}-${col.key}`}>
                          {col.render ? col.render(item) : String(item[col.key as keyof InvoiceItem] || "")}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </ListView>
      </div>
    </BaseModuleLayout>
  );
};
export type { ActiveFilter };
