import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import { useCurrentLocale } from "@/locales/client";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { ListView, ActiveFilter } from "../layouts/ListView";
import { DataTable, type DataColumn } from "../layouts/DataTable";
import { SelectRoot, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "../ui";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { safeHttpHref } from "../../lib/safe-url";
import { useResourceList } from "../../lib/use-resource-list";
import {
  apiErrorMessage,
  invoiceListResponseSchema,
  type InvoiceItem
} from "../../lib/schemas/api";

interface InvoiceModuleProps {
  organizationId: string;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
}

export const InvoiceModule: React.FC<InvoiceModuleProps> = ({
  organizationId,
  fetchAuthed
}) => {
  const brand = useBrand();
  const locale = useCurrentLocale();
  const s = useUIStrings();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "received" | "issued">("all");

  // Fetch + Zod + loading/error via hook condiviso (S4): payload malformato → errore i18n.
  const { items: invoices, loading, error } = useResourceList({
    path: "/api/invoice/list",
    fetchAuthed,
    schema: invoiceListResponseSchema,
    select: (data) => data.items ?? data.invoices ?? [],
    errorMessage: apiErrorMessage,
    errLoad: s.modules.invoice.errLoad,
    errConnection: s.modules.invoice.errConnection,
    logTag: "InvoiceModule",
    enabled: Boolean(organizationId),
  });

  const activeFilters: ActiveFilter[] = [];
  if (filterType !== "all") {
    activeFilters.push({
      id: "type",
      label: s.modules.invoice.filterTypeLabel,
      value: filterType,
      displayValue: filterType === "received" ? s.modules.invoice.filterReceived : s.modules.invoice.filterIssued
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

  const columns: DataColumn<InvoiceItem>[] = [
    {
      key: "invoiceId",
      header: s.modules.invoice.colInvoiceId,
      render: (item) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
          <div className="font-mono text-[13px] font-semibold text-ink" title={item.invoiceId}>
            {item.invoiceId.substring(0, 8)}...{item.invoiceId.substring(item.invoiceId.length - 4)}
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: "type",
      header: s.modules.invoice.colFlow,
      render: (item) => (
        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          item.type === "received" 
            ? "bg-secondary/8 text-secondary border border-secondary/20" 
            : "bg-blue-500/8 text-blue-500 border border-blue-500/20"
        }`}>
          {item.type === "received" ? s.modules.invoice.flowReceived : s.modules.invoice.flowIssued}
        </span>
      ),
      sortable: true
    },
    {
      key: "partner",
      header: s.modules.invoice.colCounterparty,
      render: (item) => (
        <div className="text-[13px] text-ink-muted">
          {item.type === "received" ? (
            <span>{s.modules.invoice.fromPrefix} <strong className="text-ink">{item.seller?.name || brand.sellerName}</strong></span>
          ) : (
            <span>{s.modules.invoice.toPrefix} <strong className="text-ink">{item.buyer?.name || s.modules.invoice.partnerCustomer}</strong></span>
          )}
        </div>
      )
    },
    {
      key: "createdAt",
      header: s.modules.invoice.colDate,
      render: (item) => (
        <span className="text-[13px] text-slate-500">
          {new Date(item.createdAt).toLocaleDateString(locale, {
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
      header: s.modules.invoice.colGrossAmount,
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-ink">
            {new Intl.NumberFormat(brand.numberLocale, { style: "currency", currency: brand.currency }).format(item.amount)}
          </span>
          {item.taxAmount !== undefined && item.taxAmount !== null && (
            <span className="text-[11px] text-slate-500 mt-0.5">
              {fmtUI(s.modules.invoice.vatDetail, {
                percent: item.taxPercent ?? "",
                amount: new Intl.NumberFormat(brand.numberLocale, { style: "currency", currency: brand.currency }).format(item.taxAmount)
              })}
            </span>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: "status",
      header: s.modules.invoice.colStatus,
      render: (item) => (
        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          item.status === "paid" 
            ? "bg-success/8 text-success border border-success/20" 
            : "bg-amber-500/8 text-amber-500 border border-amber-500/20"
        }`}>
          {item.status}
        </span>
      ),
      sortable: true
    },
    {
      key: "download",
      header: s.modules.invoice.colActions,
      render: (item) => {
        if (!item.pdfUrl) {
          return <span className="text-xs text-slate-400 italic">{s.modules.invoice.noPdf}</span>;
        }
        return (
          <a
            href={safeHttpHref(item.pdfUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-secondary/20 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white hover:border-secondary transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {s.modules.invoice.download}
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
        onSelectionChange={(key) => {
          // Narrowing esplicito del Key (niente cast `as` su union di stringhe)
          if (key === "all" || key === "received" || key === "issued") setFilterType(key);
        }}
        aria-label={s.modules.invoice.filterAria}
      >
        <SelectTrigger className="bg-surface-2 border border-line rounded-2xl px-3.5 py-2 flex items-center justify-between h-[40px] w-full text-xs text-ink">
          <SelectValue />
        </SelectTrigger>
        <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-line rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
          <ListBox>
            <ListBoxItem id="all" textValue={s.modules.invoice.filterAllFlows}>{s.modules.invoice.filterAllFlows}</ListBoxItem>
            <ListBoxItem id="received" textValue={s.modules.invoice.filterReceivedInvoices}>{s.modules.invoice.filterReceivedInvoices}</ListBoxItem>
            <ListBoxItem id="issued" textValue={s.modules.invoice.filterIssuedInvoices}>{s.modules.invoice.filterIssuedInvoices}</ListBoxItem>
          </ListBox>
        </SelectPopover>
      </SelectRoot>
    </div>
  );

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className="w-full">
        <ListView
          title={s.modules.invoice.title}
          description={s.modules.invoice.description}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={s.modules.invoice.searchPlaceholder}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          filterContent={filterContent}
        >
          <DataTable
            ariaLabel={s.modules.invoice.tableAria}
            columns={columns}
            items={filteredInvoices}
            getRowId={(item) => item.invoiceId}
            emptyState={s.modules.invoice.emptyState}
          />
        </ListView>
      </div>
    </BaseModuleLayout>
  );
};
export type { ActiveFilter };
