import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { ListView } from "../layouts/ListView";
import { Table } from "../ui/Table";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface ProductItem {
  productId: string;
  name: string;
  description: string | null;
  type: string;
  sku: string | null;
  price: number;
  isActive: boolean;
}

interface ProductModuleProps {
  organizationId: string;
  activeRole: string | undefined;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const ProductModule: React.FC<ProductModuleProps> = ({
  organizationId,
  activeRole,
  fetchAuthed,
  showToast
}) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [purchasingProduct, setPurchasingProduct] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed(`/api/product/list?appId=sso&orgId=${organizationId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.items || []);
      } else {
        const errMsg = data.error && typeof data.error === "object" && "message" in data.error
          ? String(data.error.message)
          : typeof data.error === "string"
            ? data.error
            : "Impossibile caricare i prodotti.";
        setError(errMsg);
      }
    } catch (err) {
      console.error("[ProductModule] Load Error:", err);
      setError("Errore di connessione durante il recupero dei prodotti.");
    } finally {
      setLoading(false);
    }
  }, [organizationId, fetchAuthed]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadProducts();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadProducts]);

  const handleBuyProduct = async (productId: string) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast("Solo l'Owner o gli Admin possono acquistare prodotti.", "error");
      return;
    }

    setPurchasingProduct(productId);
    try {
      showToast(`Inizializzazione acquisto per il prodotto...`, "info");
      
      const res = await fetchAuthed("/api/stripe/partner/checkout-session", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
          sellerOrgId: "KALEX_SYSTEM_ORG" // KALEX OÜ
        })
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data.error?.message || "Impossibile avviare il checkout del prodotto.";
        showToast(errorMsg, "error");
        setPurchasingProduct(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(`Errore durante l'avvio dell'acquisto: ${message}`, "error");
      setPurchasingProduct(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term)) ||
      p.type.toLowerCase().includes(term)
    );
  });

  const columns: Column<ProductItem>[] = [
    {
      key: "name",
      header: "Prodotto",
      render: (item: ProductItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: "sku",
      header: "SKU / Codice",
      render: (item: ProductItem) => <code className="px-1.5 py-0.5 bg-default-100 rounded text-xs font-mono">{item.sku || "N/D"}</code>,
      sortable: true
    },
    {
      key: "type",
      header: "Categoria",
      render: (item: ProductItem) => (
        <span className="text-xs font-semibold px-2.5 py-1 bg-default-100 rounded-xl border border-divider">
          {item.type}
        </span>
      ),
      sortable: true
    },
    {
      key: "price",
      header: "Prezzo",
      render: (item: ProductItem) => (
        <span className="font-semibold text-sm">
          {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.price)}
        </span>
      ),
      sortable: true
    },
    {
      key: "action",
      header: "Azione",
      render: (item: ProductItem) => (
        <button
          onClick={() => handleBuyProduct(item.productId)}
          disabled={purchasingProduct !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {purchasingProduct === item.productId ? (
            "Elaborazione..."
          ) : (
            <>
              Acquista
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )
    }
  ];

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className="w-full">
        <ListView
          title="Prodotti e Hardware KALEX"
          description="Gestisci e acquista sensori IoT, gateway ed estensioni hardware ufficiali KALEX per la tua infrastruttura."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cerca prodotti per nome, SKU o tipo..."
        >
          <Table aria-label="Tabella Prodotti">
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  {columns.map(col => (
                    <Table.Column key={col.key} id={col.key} className="text-xs font-bold">{col.header}</Table.Column>
                  ))}
                </Table.Header>
                <Table.Body
                  renderEmptyState={() => (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      Nessun prodotto corrisponde ai criteri di ricerca.
                    </div>
                  )}
                >
                  {filteredProducts.map(item => (
                    <Table.Row key={item.productId} id={item.productId} className="border-b border-divider/40 last:border-0 hover:bg-default-50/50 transition-colors">
                      {columns.map(col => (
                        <Table.Cell key={col.key} id={`${item.productId}-${col.key}`}>
                          {col.render ? col.render(item) : String(item[col.key as keyof ProductItem] || "")}
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
export type { Column };
