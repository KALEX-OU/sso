import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { ListView } from "../layouts/ListView";
import { Table } from "../ui";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import {
  apiErrorMessage,
  productListResponseSchema,
  checkoutSessionResponseSchema,
  type ProductItem
} from "../../lib/schemas/api";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
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
  const brand = useBrand();
  const s = useUIStrings();
  // Ref alle stringhe correnti: le callback leggono sempre l'ultima lingua
  // senza aggiungere `s` alle dipendenze (il cambio lingua non ri-innesca i fetch).
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchAuthed(`/api/product/list?appId=sso&orgId=${organizationId}`);
      // Validazione Zod della risposta (E3.5): payload malformato → log + errore i18n, mai dato corrotto.
      const parsed = productListResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ProductModule] Risposta /product/list non conforme allo schema:", parsed.error);
        setError(sRef.current.modules.product.errLoad);
        return;
      }
      const data = parsed.data;
      if (data.success) {
        setProducts(data.items ?? []);
      } else {
        setError(apiErrorMessage(data) ?? sRef.current.modules.product.errLoad);
      }
    } catch (err) {
      console.error("[ProductModule] Load Error:", err);
      setError(sRef.current.modules.product.errConnection);
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
      showToast(s.modules.product.onlyAdminsBuy, "error");
      return;
    }

    setPurchasingProduct(productId);
    try {
      showToast(s.modules.product.purchaseInit, "info");
      
      const res = await fetchAuthed("/api/stripe/partner/checkout-session", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
          sellerOrgId: brand.sellerOrgId
        })
      });

      // Validazione Zod della risposta di checkout (riusa lo schema Stripe condiviso)
      const parsed = checkoutSessionResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[ProductModule] Risposta checkout non conforme allo schema:", parsed.error);
        showToast(sRef.current.modules.product.errCheckout, "error");
        setPurchasingProduct(null);
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data.error?.message || s.modules.product.errCheckout;
        showToast(errorMsg, "error");
        setPurchasingProduct(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      showToast(fmtUI(s.modules.product.errPurchaseStart, { message }), "error");
      setPurchasingProduct(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term)) ||
      (p.type ?? "").toLowerCase().includes(term)
    );
  });

  const columns: Column<ProductItem>[] = [
    {
      key: "name",
      header: s.modules.product.colProduct,
      render: (item: ProductItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-secondary" />
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
      header: s.modules.product.colSku,
      render: (item: ProductItem) => <code className="px-1.5 py-0.5 bg-default-100 rounded text-xs font-mono">{item.sku || s.modules.product.notAvailable}</code>,
      sortable: true
    },
    {
      key: "type",
      header: s.modules.product.colCategory,
      render: (item: ProductItem) => (
        <span className="text-xs font-semibold px-2.5 py-1 bg-default-100 rounded-xl border border-divider">
          {item.type}
        </span>
      ),
      sortable: true
    },
    {
      key: "price",
      header: s.modules.product.colPrice,
      render: (item: ProductItem) => (
        <span className="font-semibold text-sm">
          {/* `price` non è garantito dal registro SSOT: fallback esplicito invece di "NaN" */}
          {typeof item.price === "number"
            ? new Intl.NumberFormat(brand.numberLocale, { style: "currency", currency: brand.currency }).format(item.price)
            : s.modules.product.notAvailable}
        </span>
      ),
      sortable: true
    },
    {
      key: "action",
      header: s.modules.product.colAction,
      render: (item: ProductItem) => (
        <button
          onClick={() => handleBuyProduct(item.productId)}
          disabled={purchasingProduct !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-secondary to-accent text-slate-950 font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {purchasingProduct === item.productId ? (
            s.modules.product.processing
          ) : (
            <>
              {s.modules.product.buyButton}
              <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
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
          title={fmtUI(s.modules.product.title, { brand: brand.name })}
          description={fmtUI(s.modules.product.description, { brand: brand.name })}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={s.modules.product.searchPlaceholder}
        >
          <Table aria-label={s.modules.product.tableAria}>
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
                      {s.modules.product.emptyState}
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
