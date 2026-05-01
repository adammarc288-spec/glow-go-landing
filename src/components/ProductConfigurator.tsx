import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldCheck, Smartphone, Briefcase, Link2, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import { CountdownTimer } from "./CountdownTimer";

// ─── ANLEITUNG: Ersetze die URLs hier mit deinen echten Shopify-Bildern pro Farbe ───
// Gehe in Shopify Admin → Produkte → Varianten → lade pro Farbe ein Bild hoch
// Dann kopiere die CDN-URL und trage sie hier ein.
const COLOR_IMAGE_MAP: Record<string, string> = {
  Schwarz:    "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Rosa:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Rot:        "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Königsblau: "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Grau:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Cognac:     "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Gelb:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Grün:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
};

const colorSwatches: Record<string, { dot: string; emoji: string; isNew?: boolean }> = {
  Rosa:        { dot: "bg-[oklch(0.82_0.07_10)]",   emoji: "🌸" },
  Rot:         { dot: "bg-[oklch(0.55_0.20_25)]",   emoji: "❤️" },
  Schwarz:     { dot: "bg-[oklch(0.22_0.005_0)]",   emoji: "🖤" },
  Königsblau:  { dot: "bg-[oklch(0.42_0.18_265)]",  emoji: "💙", isNew: true },
  Grau:        { dot: "bg-[oklch(0.55_0.01_240)]",  emoji: "🩶" },
  Cognac:      { dot: "bg-[oklch(0.55_0.12_45)]",   emoji: "🤎" },
  Gelb:        { dot: "bg-[oklch(0.85_0.16_95)]",   emoji: "💛", isNew: true },
  Grün:        { dot: "bg-[oklch(0.55_0.13_145)]",  emoji: "💚", isNew: true },
};

interface Props {
  product: ShopifyProduct;
}

export function ProductConfigurator({ product }: Props) {
  const node = product.node;
  const variants = node.variants.edges.map((e) => e.node);
  const images = node.images.edges.map((e) => e.node);

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const opt = node.options.find((o) => o.name === "Farbe") ?? node.options[0];
    return opt?.values?.[0] ?? "";
  });
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const selectedVariant = useMemo(
    () =>
      variants.find((v) => v.selectedOptions.some((o) => o.value === selectedColor)) ??
      variants[0],
    [variants, selectedColor],
  );

  // ─── FIX: Bild wechseln wenn Farbe geändert wird ───
  useEffect(() => {
    if (!selectedColor) return;

    // 1. Versuche Varianten-Bild aus Shopify
    if (selectedVariant?.image?.url) {
      const idx = images.findIndex((img) => img.url === selectedVariant.image!.url);
      if (idx >= 0) {
        setActiveImage(idx);
        return;
      }
    }

    // 2. Fallback: COLOR_IMAGE_MAP
    const fallbackUrl = COLOR_IMAGE_MAP[selectedColor];
    if (fallbackUrl) {
      const idx = images.findIndex((img) => img.url === fallbackUrl);
      setActiveImage(idx >= 0 ? idx : 0);
    }
  }, [selectedColor, selectedVariant, images]);

  // Aktuelle Bild-URL (mit Fallback)
  const activeImageUrl = useMemo(() => {
    if (images[activeImage]?.url) return images[activeImage].url;
    return COLOR_IMAGE_MAP[selectedColor] ?? images[0]?.url ?? "";
  }, [activeImage, images, selectedColor]);

  const price = parseFloat(selectedVariant?.price.amount ?? "29.95");
  const compareAt = parseFloat(selectedVariant?.compareAtPrice?.amount ?? "49.95");
  const currency = selectedVariant?.price.currencyCode ?? "EUR";
  const savings = compareAt - price;
  const savingsPct = compareAt > 0 ? Math.round((savings / compareAt) * 100) : 0;

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const colorOption = node.options.find((o) => o.name === "Farbe");

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Bildergalerie */}
      <div>
        <div className="aspect-square bg-card rounded-3xl overflow-hidden shadow-soft">
          {activeImageUrl && (
            <img
              key={activeImageUrl}
              src={activeImageUrl}
              alt={`Glow & Go™ – ${selectedColor}`}
              className="w-full h-full object-cover animate-fade-in"
              loading="lazy"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3 mt-4">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeImage ? "border-cta" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Konfiguration */}
      <div className="lg:pt-4">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
          {node.title}
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-prose">
          Telefoniere, bezahle und navigiere – ohne deine Tasche je zu öffnen. Premium Kunstleder,
          RFID-Schutz und sieben durchdachte Fächer.
        </p>

        {/* Preis */}
        <div className="mt-7 flex items-end gap-4 flex-wrap">
          <span className="font-serif text-5xl md:text-6xl text-cta tracking-tight">
            €{price.toFixed(2).replace(".", ",")}
          </span>
          {compareAt > price && (
            <span className="text-2xl text-muted-foreground line-through pb-2">
              €{compareAt.toFixed(2).replace(".", ",")}
            </span>
          )}
          {savingsPct > 0 && (
            <span className="bg-gold/20 text-gold-foreground border border-gold/40 rounded-full px-3 py-1 text-sm font-medium pb-1">
              −{savingsPct}%
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          Du sparst: <strong>€{savings.toFixed(2).replace(".", ",")}</strong> · inkl. MwSt.
        </p>

        {/* Countdown */}
        <div className="mt-5 flex items-center gap-3 text-sm bg-cta/5 border border-cta/15 rounded-2xl px-4 py-3">
          <span className="text-cta font-medium">⏰ Angebot endet in:</span>
          <CountdownTimer className="text-cta font-semibold text-lg" />
        </div>

        {/* Farbauswahl */}
        {colorOption && (
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Farbe: <span className="text-muted-foreground font-semibold">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colorOption.values.map((value) => {
                const swatch = colorSwatches[value];
                const isSelected = value === selectedColor;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedColor(value)}
                    aria-label={`Farbe ${value} wählen`}
                    className={`relative group flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-cta bg-cta/5 shadow-sm"
                        : "border-border hover:border-cta/50 hover:bg-muted/50"
                    }`}
                  >
                    {swatch?.isNew && (
                      <span className="absolute -top-2 -right-2 bg-gradient-gold text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-gold">
                        NEU ✨
                      </span>
                    )}
                    <span
                      className={`w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all ${
                        swatch?.dot ?? "bg-muted"
                      } ${isSelected ? "ring-cta scale-110" : "ring-transparent"}`}
                    />
                    <span className="text-xs font-medium">{value}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menge */}
        <div className="mt-6">
          <span className="text-sm font-medium mb-2 block">Menge</span>
          <div className="inline-flex border border-border rounded-full overflow-hidden">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                className={`px-6 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  quantity === q ? "bg-cta text-cta-foreground" : "hover:bg-muted"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          {quantity === 2 && (
            <p className="mt-2 text-xs text-gold flex items-center gap-1.5 font-medium">
              <Gift className="h-3.5 w-3.5" /> Tipp: Nimm 3 – die 3. Tasche ist GRATIS!
            </p>
          )}
          {quantity === 3 && (
            <p className="mt-2 text-xs text-gold flex items-center gap-1.5 font-medium">
              <Gift className="h-3.5 w-3.5" /> 🎁 Buy 2 Get 1 Free – die 3. Tasche GRATIS
            </p>
          )}
        </div>

        {/* CTA-Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant}
          className="mt-7 w-full h-14 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground text-base font-semibold pulse-cta shadow-elegant"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>🛒 In den Warenkorb – Jetzt sichern</>
          )}
        </Button>

        {/* Feature-Liste */}
        <ul className="mt-6 grid grid-cols-1 gap-2.5 text-sm">
          {[
            { i: <Smartphone className="h-4 w-4" />, t: "Für alle Smartphones bis 6,7 Zoll" },
            { i: <ShieldCheck className="h-4 w-4" />, t: "RFID-Schutz integriert" },
            { i: <Briefcase className="h-4 w-4" />, t: "7 praktische Fächer" },
            { i: <Link2 className="h-4 w-4" />, t: "Verstellbarer Riemen (55–120 cm)" },
            { i: <Gift className="h-4 w-4" />, t: "Geschenkverpackung verfügbar" },
          ].map((f) => (
            <li key={f.t} className="flex items-center gap-3 text-foreground/85">
              <span className="text-gold">{f.i}</span>
              <span>{f.t}</span>
              <Check className="h-4 w-4 text-gold ml-auto" />
            </li>
          ))}
        </ul>

        {/* Zahlungsmethoden */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Zahlung:</span>
          {["Klarna", "PayPal", "Visa", "Mastercard", "SEPA"].map((p) => (
            <span
              key={p}
              className="text-xs font-semibold tracking-wide bg-muted border border-border rounded-md px-2.5 py-1"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
