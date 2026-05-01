import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldCheck, Smartphone, Briefcase, Link2, Gift, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import { CountdownTimer } from "./CountdownTimer";
import { ZoomableImage } from "./ZoomableImage";

// ─── ANLEITUNG: Ersetze die URLs hier mit deinen echten Shopify-Bildern pro Farbe ───
// Gehe in Shopify Admin → Produkte → Varianten → lade pro Farbe ein Bild hoch
// Dann kopiere die CDN-URL und trage sie hier ein.
// Echte Variant-Bilder aus Shopify (Fallback, falls Storefront-API kein image am Variant liefert)
const COLOR_IMAGE_MAP: Record<string, string> = {
  Schwarz:    "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/42147cb6-8991-42f2-82cb-1f1054593ec8_afa33c4a-204d-4a41-8f2e-303e68a9ca1a.jpg?v=1777624605",
  Königsblau: "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/b1ebc19b-003a-4792-b6bd-8c3a6648c56f.jpg?v=1777624606",
  Cognac:     "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/84fe9670-efeb-4673-b17b-67a485ca2993.jpg?v=1777624605",
  Grün:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/6f219139-0c4e-4614-8d3f-0c1983aa4b0f_98a565a8-5950-4058-a20d-98818a406439.jpg?v=1777624605",
  Grau:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/272c3051-d869-4063-b2ca-0b87544f13d7.jpg?v=1777624605",
  Rosa:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605",
  Rot:        "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/d59c4869-166d-40b7-80f1-cea725539111.jpg?v=1777624605",
  Gelb:       "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/f342a474-bb9d-4cdd-ba22-b3fb2515c233_f3168d2a-a802-4aff-be3e-584d33a54d7e.jpg?v=1777624606",
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
  const [activeImageUrl, setActiveImageUrl] = useState<string>(() => {
    const opt = node.options.find((o) => o.name === "Farbe") ?? node.options[0];
    const firstColor = opt?.values?.[0] ?? "";
    const firstVariantImage =
      variants.find((v) =>
        v.selectedOptions.some((o) => o.name === "Farbe" && o.value === firstColor),
      )?.image?.url ?? "";
    return firstVariantImage || COLOR_IMAGE_MAP[firstColor] || images[0]?.url || "";
  });
  const [extraColors, setExtraColors] = useState<string[]>([]);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const colorOptionValues = useMemo(
    () => node.options.find((o) => o.name === "Farbe")?.values ?? [],
    [node.options],
  );

  // Sync extraColors length with quantity (default to main color)
  useEffect(() => {
    const needed = Math.max(0, quantity - 1);
    setExtraColors((prev) => {
      if (prev.length === needed) return prev;
      const next = [...prev];
      while (next.length < needed) next.push(selectedColor);
      next.length = needed;
      return next;
    });
  }, [quantity, selectedColor]);

  const selectedVariant = useMemo(
    () =>
      variants.find((v) =>
        v.selectedOptions.some((o) => o.name === "Farbe" && o.value === selectedColor),
      ) ?? variants[0],
    [variants, selectedColor],
  );

  // Bei Farbwechsel: passendes Bild aktivieren (COLOR_IMAGE_MAP > Varianten-Bild)
  useEffect(() => {
    if (!selectedColor) return;
    if (selectedVariant?.image?.url) {
      setActiveImageUrl(selectedVariant.image.url);
      return;
    }
    const mapUrl = COLOR_IMAGE_MAP[selectedColor];
    if (mapUrl) {
      setActiveImageUrl(mapUrl);
      return;
    }
    if (images[0]?.url) {
      setActiveImageUrl(images[0].url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedVariant?.image?.url]);

  const activeImage = useMemo(() => {
    const idx = images.findIndex((img) => img.url === activeImageUrl);
    return idx >= 0 ? idx : 0;
  }, [activeImageUrl, images]);

  const price = parseFloat(selectedVariant?.price.amount ?? "29.95");
  const compareAt = parseFloat(selectedVariant?.compareAtPrice?.amount ?? "49.95");
  const currency = selectedVariant?.price.currencyCode ?? "EUR";
  const savings = compareAt - price;
  const savingsPct = compareAt > 0 ? Math.round((savings / compareAt) * 100) : 0;

  // Bundle-Preise (Mengenrabatte)
  const subtotal = price * quantity;
  const bundleTotal = useMemo(() => {
    if (quantity === 2) return 49.95;
    if (quantity === 3) return 59.9;
    return subtotal;
  }, [quantity, subtotal]);
  const bundleDiscount = subtotal - bundleTotal;
  const bundleCode = quantity === 2 ? "BUNDLE2" : quantity === 3 ? "BUNDLE3" : null;

  const addItem = useCartStore((s) => s.addItem);
  const applyDiscountCodes = useCartStore((s) => s.applyDiscountCodes);
  const isLoading = useCartStore((s) => s.isLoading);

  const allColors = useMemo(
    () => [selectedColor, ...extraColors],
    [selectedColor, extraColors],
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    // Pro Farbe eine eigene Cart-Line: Farben gruppieren -> passende Variante finden
    const colorCounts = allColors.reduce<Record<string, number>>((acc, c) => {
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {});

    for (const [color, count] of Object.entries(colorCounts)) {
      const variantForColor =
        variants.find((v) =>
          v.selectedOptions.some((o) => o.name === "Farbe" && o.value === color),
        ) ?? selectedVariant;
      await addItem({
        product,
        variantId: variantForColor.id,
        variantTitle: variantForColor.title,
        price: variantForColor.price,
        quantity: count,
        selectedOptions: variantForColor.selectedOptions,
        attributes: [{ key: "Farbe", value: color }],
      });
    }

    // Bundle-Rabattcode auf den Cart anwenden
    await applyDiscountCodes(bundleCode ? [bundleCode] : []);
  };

  const handleQuantityChange = (q: number) => {
    setQuantity(q);
    if (q > 1) setColorModalOpen(true);
  };

  const colorOption = node.options.find((o) => o.name === "Farbe");

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Bildergalerie */}
      <div>
        <div className="relative group">
          <button
            type="button"
            onClick={() => activeImageUrl && setZoomOpen(true)}
            onTouchStart={(e) => {
              (e.currentTarget as HTMLButtonElement).dataset.tx = String(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              const startX = Number((e.currentTarget as HTMLButtonElement).dataset.tx ?? 0);
              const endX = e.changedTouches[0].clientX;
              const dx = endX - startX;
              if (Math.abs(dx) > 50) {
                const currentIdx = images.findIndex((img) => img.url === activeImageUrl);
                const safeIdx = currentIdx >= 0 ? currentIdx : activeImage;
                const next = dx < 0
                  ? (safeIdx + 1) % images.length
                  : (safeIdx - 1 + images.length) % images.length;
                if (images[next]) setActiveImageUrl(images[next].url);
              }
            }}
            className="flex w-full max-w-[350px] aspect-square max-h-[350px] items-center justify-center mx-auto bg-card rounded-3xl shadow-soft cursor-zoom-in md:max-w-none md:max-h-none"
            aria-label="Bild vergrößern"
          >
            {activeImageUrl && (
              <img
                key={activeImageUrl}
                src={activeImageUrl}
                alt={`Glow & Go™ – ${selectedColor}`}
                className="w-full h-full max-w-full max-h-full object-contain animate-fade-in"
                loading="lazy"
              />
            )}
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = images.findIndex((img) => img.url === activeImageUrl);
                  const safeIdx = currentIdx >= 0 ? currentIdx : activeImage;
                  const prev = (safeIdx - 1 + images.length) % images.length;
                  if (images[prev]) setActiveImageUrl(images[prev].url);
                }}
                aria-label="Vorheriges Bild"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/80 backdrop-blur shadow-soft flex items-center justify-center hover:bg-background transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = images.findIndex((img) => img.url === activeImageUrl);
                  const safeIdx = currentIdx >= 0 ? currentIdx : activeImage;
                  const next = (safeIdx + 1) % images.length;
                  if (images[next]) setActiveImageUrl(images[next].url);
                }}
                aria-label="Nächstes Bild"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/80 backdrop-blur shadow-soft flex items-center justify-center hover:bg-background transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium bg-background/80 backdrop-blur px-3 py-1 rounded-full shadow-soft">
                {(() => {
                  const idx = images.findIndex((img) => img.url === activeImageUrl);
                  return `${(idx >= 0 ? idx : activeImage) + 1} / ${images.length}`;
                })()}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto md:overflow-visible pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x [scrollbar-width:thin]">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => {
                  setActiveImageUrl(img.url);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                  img.url === activeImageUrl ? "border-cta" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom-Dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl p-2 sm:p-4 bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>Produktbild</DialogTitle>
            <DialogDescription>{`Glow & Go™ – ${selectedColor}`}</DialogDescription>
          </DialogHeader>
          {activeImageUrl && (
            <ZoomableImage src={activeImageUrl} alt={`Glow & Go™ – ${selectedColor}`} />
          )}
        </DialogContent>
      </Dialog>

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
                onClick={() => handleQuantityChange(q)}
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

          {/* Bundle-Preis Anzeige */}
          {quantity > 1 && bundleDiscount > 0 && (
            <div className="mt-3 rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-gold/10 to-cta/5 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-semibold text-gold-foreground/80 uppercase tracking-wide">
                    {quantity === 3 ? "🎁 Buy 2 Get 1 Free" : "🎉 Bundle-Rabatt"}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl text-cta tracking-tight">
                      €{bundleTotal.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-base text-muted-foreground line-through">
                      €{subtotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    Du sparst zusätzlich <strong>€{bundleDiscount.toFixed(2).replace(".", ",")}</strong>{" "}
                    im Bundle
                  </p>
                </div>
                <span className="bg-gold/20 text-gold-foreground border border-gold/40 rounded-full px-3 py-1 text-sm font-bold">
                  −{Math.round((bundleDiscount / subtotal) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Zusammenfassung der gewählten Farben */}
          {quantity > 1 && extraColors.length > 0 && (
            <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium">Deine {quantity} Taschen:</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    <li>1. Tasche: <span className="font-semibold text-foreground">{selectedColor}</span></li>
                    {extraColors.map((c, i) => (
                      <li key={i}>
                        {i + 2}. Tasche: <span className="font-semibold text-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setColorModalOpen(true)}
                  className="rounded-full"
                >
                  Bearbeiten
                </Button>
              </div>
            </div>
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

      {/* Modal: Farben für zusätzliche Taschen wählen */}
      <Dialog open={colorModalOpen} onOpenChange={setColorModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Farben für deine {quantity} Taschen
            </DialogTitle>
            <DialogDescription>
              Wähle für jede zusätzliche Tasche eine Farbe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm">
              <span className="text-muted-foreground">1. Tasche:</span>{" "}
              <span className="font-semibold">{selectedColor}</span>
            </div>

            {extraColors.map((bagColor, bagIdx) => (
              <div key={bagIdx}>
                <p className="text-sm font-medium mb-2">
                  {bagIdx + 2}. Tasche – Farbe wählen
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptionValues.map((value) => {
                    const swatch = colorSwatches[value];
                    const isSelected = value === bagColor;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setExtraColors((prev) =>
                            prev.map((c, i) => (i === bagIdx ? value : c)),
                          )
                        }
                        aria-label={`Tasche ${bagIdx + 2}: Farbe ${value} wählen`}
                        className={`relative flex flex-col items-center gap-1.5 rounded-2xl px-2.5 py-2 border transition-all cursor-pointer ${
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
                          className={`w-7 h-7 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all ${
                            swatch?.dot ?? "bg-muted"
                          } ${isSelected ? "ring-cta scale-110" : "ring-transparent"}`}
                        />
                        <span className="text-[11px] font-medium">{value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => setColorModalOpen(false)}
              className="w-full h-12 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold"
            >
              Auswahl bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
