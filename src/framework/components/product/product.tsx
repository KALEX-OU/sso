import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { BaseModuleLayout } from "../layout/BaseModuleLayout";
import { ListView } from "../ui/ListView";
import { Table, Column } from "../ui/Table";
import styles from "./product.module.css";

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
      
      const res = await fetchAuthed("/api/stripe/checkout/partner", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
          sellerOrgId: "e8d2bb2d-7206-4b8a-9c76-ec551b9cf3d2" // KALEX OÜ
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
      render: (item) => (
        <div className={styles.productInfo}>
          <div className={styles.productIconContainer}>
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className={styles.productName}>{item.name}</div>
            <div className={styles.productDesc}>{item.description}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: "sku",
      header: "SKU / Codice",
      render: (item) => <code className={styles.skuCode}>{item.sku || "N/D"}</code>,
      sortable: true
    },
    {
      key: "type",
      header: "Categoria",
      render: (item) => (
        <span className={styles.typeBadge}>
          {item.type}
        </span>
      ),
      sortable: true
    },
    {
      key: "price",
      header: "Prezzo",
      render: (item) => (
        <span className={styles.productPrice}>
          {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.price)}
        </span>
      ),
      sortable: true
    },
    {
      key: "action",
      header: "Azione",
      render: (item) => (
        <button
          onClick={() => handleBuyProduct(item.productId)}
          disabled={purchasingProduct !== null}
          className={styles.buyButton}
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
      <div className={styles.productModule}>
        <ListView
          title="Prodotti e Hardware KALEX"
          description="Gestisci e acquista sensori IoT, gateway ed estensioni hardware ufficiali KALEX per la tua infrastruttura."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cerca prodotti per nome, SKU o tipo..."
        >
          <Table
            data={filteredProducts}
            columns={columns}
            rowKey={(item) => item.productId}
            emptyContent="Nessun prodotto corrisponde ai criteri di ricerca."
          />
        </ListView>
      </div>
    </BaseModuleLayout>
  );
};
