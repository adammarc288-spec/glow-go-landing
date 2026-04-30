import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface Props {
  product: ShopifyProduct | null;
}

export function StickyMobileCTA({ product }: Props) {
  const [visible, setVisible] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) return null;
  const variant = product.node.variants.edges[0]?.node;
  if (!variant) return null;

  const handleClick = async () => {
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 shadow-elegant">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground line-through">€49,95</span>
          <span className="font-serif text-xl text-cta leading-none">€29,95</span>
        </div>
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="flex-1 h-12 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "🛒 Jetzt sichern →"}
        </Button>
      </div>
    </div>
  );
}
