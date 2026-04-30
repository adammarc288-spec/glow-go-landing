import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";

export function useProduct() {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 1, query: null });
        if (cancelled) return;
        const edge = data?.data?.products?.edges?.[0];
        setProduct(edge ?? null);
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { product, loading };
}
