import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ShieldCheck, Truck, RotateCcw, Gift, Lock, Star, Smartphone, Sparkles, Briefcase, Link2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { CountdownTimer } from "@/components/CountdownTimer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { useCartSync } from "@/hooks/useCartSync";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";

import giftSet from "@/assets/gift-set.jpg";

// Hero shows the actual Rosa/Pink TouchCarry product image from the connected Shopify store
const heroImage =
  "https://cdn.shopify.com/s/files/1/0993/5198/6560/files/19edccb2-cfbb-4ccc-b63e-bb8d86defd24.jpg?v=1777624605";

async function fetchLandingProduct(): Promise<ShopifyProduct | null> {
  try {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 1, query: null });
    return data?.data?.products?.edges?.[0] ?? null;
  } catch (e) {
    console.error("Failed to load product", e);
    return null;
  }
}

export const Route = createFileRoute("/")({
  component: Landing,
  loader: () => fetchLandingProduct(),
  staleTime: 60_000,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">Seite nicht gefunden</div>
  ),
  head: () => ({
    meta: [
      { title: "Glow & Go™ – Touchscreen Umhängetasche für Frauen | Smart. Stylisch." },
      {
        name: "description",
        content:
          "Die smarte Umhängetasche mit Touchscreen-Fenster. Telefoniere, bezahle und navigiere ohne die Tasche zu öffnen. RFID-Schutz · 30 Tage Rückgabe · Versand DE/AT/CH.",
      },
      { property: "og:title", content: "Glow & Go™ – Touchscreen Umhängetasche" },
      {
        property: "og:description",
        content:
          "Die smarte Umhängetasche mit Touchscreen-Fenster. Über 2.300 begeisterte Kundinnen.",
      },
      { property: "og:image", content: heroImage },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
});

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

function TrustBadges() {
  const items = [
    { i: <Lock className="h-4 w-4" />, t: "Sicher" },
    { i: <Truck className="h-4 w-4" />, t: "3–7 Tage" },
    { i: <RotateCcw className="h-4 w-4" />, t: "30 Tage" },
    { i: <Gift className="h-4 w-4" />, t: "Buy 2 Get 1 Free" },
  ];
  return (
    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
      {items.map((b) => (
        <div
          key={b.t}
          className="flex items-center gap-2 bg-card/70 backdrop-blur-sm border border-border/60 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-soft"
        >
          <span className="text-cta">{b.i}</span>
          <span>{b.t}</span>
        </div>
      ))}
    </div>
  );
}

function Hero({ onShopClick }: { onShopClick: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft-rose" />
      <div className="container mx-auto px-4 pt-12 md:pt-20 pb-20 md:pb-28 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-foreground/80 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Neue Kollektion · Made in Germany
            </span>
            <h1 className="mt-5 font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-balance">
              Dein Handy. <br className="hidden md:block" />
              <span className="italic text-cta">Immer griffbereit.</span> <br className="hidden md:block" />
              Nie wieder suchen.
            </h1>
            <p className="mt-6 text-lg text-foreground/75 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Die smarte Umhängetasche mit Touchscreen-Fenster – telefonieren, bezahlen und
              navigieren ohne die Tasche zu öffnen.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                onClick={onShopClick}
                className="h-14 px-8 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground text-base font-semibold pulse-cta shadow-elegant"
              >
                Jetzt kaufen – €29,95 →
              </Button>
              <span className="text-sm text-muted-foreground">
                <span className="line-through">€49,95</span> · spare 40%
              </span>
            </div>

            <div className="mt-7 flex items-center gap-2 justify-center lg:justify-start text-sm text-foreground/75">
              <span className="text-gold">⭐⭐⭐⭐⭐</span>
              <span>Über 2.300 Kundinnen lieben Glow & Go™</span>
            </div>

            <div className="mt-6">
              <TrustBadges />
            </div>
          </div>

          <div className="relative fade-up">
            <div className="absolute -inset-6 bg-gradient-rose opacity-30 blur-3xl rounded-full" />
            <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-3xl overflow-hidden shadow-elegant bg-gradient-soft-rose">
              <img
                src={heroImage}
                alt="Glow & Go™ Touchscreen Umhängetasche in Rosa"
                className="w-full h-full object-contain p-6 md:p-10"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card border border-border/60 rounded-2xl px-4 py-3 shadow-elegant flex items-center gap-3 max-w-[16rem]">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-lg">🎁</div>
              <div>
                <p className="text-xs font-semibold">3. Tasche GRATIS</p>
                <p className="text-xs text-muted-foreground">beim 3er-Set</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoShowcase({ onShopClick }: { onShopClick: () => void }) {
  return (
    <Section id="video" className="bg-card/40">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-gold text-sm font-medium tracking-widest uppercase">
          Live Demo
        </span>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl tracking-tight">
          Sieh Glow & Go™ in Aktion
        </h2>
        <p className="mt-4 text-foreground/70">
          6 elegante Farben. Touchscreen-Fenster. RFID-Schutz. Alles in einer Tasche.
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="absolute -inset-6 bg-gradient-rose opacity-30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-elegant border border-rose/30 bg-card">
          <video
            src="/product-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-8 text-center">
          <Button
            onClick={onShopClick}
            className="h-13 px-8 py-3 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold shadow-elegant pulse-cta"
          >
            Jetzt deine Farbe wählen →
          </Button>
        </div>
      </div>
    </Section>
  );
}

function GiftBanner({ onShopClick }: { onShopClick: () => void }) {
  const offers = [
    {
      title: "1 Tasche kaufen",
      price: "€29,95",
      badge: null,
      perks: ["✅ Gratis Versand", "✅ Farbe deiner Wahl"],
      cta: "Jetzt kaufen",
      qty: 1,
      highlight: false,
    },
    {
      title: "2 Taschen kaufen",
      price: "€49,95",
      compareAt: "€59,90",
      badge: null,
      perks: [
        "✅ Gratis Versand",
        "✅ 2 verschiedene Farben",
        "✅ Spare €9,95",
      ],
      cta: "2er-Set wählen",
      qty: 2,
      highlight: false,
    },
    {
      title: "3 Taschen kaufen",
      price: "€59,90",
      compareAt: "€89,85",
      badge: "⭐ BESTES ANGEBOT",
      perks: [
        "✅ Gratis Express-Versand",
        "✅ 3 verschiedene Farben",
        "🎁 Die 3. Tasche GRATIS",
        "✅ Du sparst €29,95",
      ],
      cta: "Buy 2 Get 1 Free →",
      qty: 3,
      highlight: true,
      footnote: '🔥 "Eine für dich, eine für die beste Freundin – die 3. gratis!"',
    },
  ];

  return (
    <Section id="geschenke" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-gold opacity-15" />
      <div className="relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-gold text-sm font-medium tracking-widest uppercase">
            Exklusiv
          </span>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl tracking-tight">
            🎁 Exklusives Geschenk-Angebot
          </h2>
          <p className="mt-4 text-foreground/70">
            Je mehr du kaufst, desto mehr Extras gibt's gratis dazu. Perfekt für dich oder als
            Geschenk für deine Liebsten.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {offers.map((o) => (
            <div
              key={o.title}
              className={`relative bg-card rounded-3xl p-7 border transition-all hover:-translate-y-1 ${
                o.highlight
                  ? "border-gold shadow-gold scale-[1.02]"
                  : "border-border shadow-soft"
              }`}
            >
              {o.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-foreground text-xs font-bold tracking-wide px-4 py-1.5 rounded-full shadow-gold">
                  {o.badge}
                </span>
              )}
              <h3 className="font-serif text-2xl">{o.title}</h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-serif text-4xl text-cta">{o.price}</span>
                {o.compareAt && (
                  <span className="text-sm text-muted-foreground line-through pb-1.5">
                    statt {o.compareAt}
                  </span>
                )}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                {o.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Button
                onClick={onShopClick}
                className={`mt-6 w-full h-12 rounded-full font-semibold ${
                  o.highlight
                    ? "bg-cta hover:bg-cta/90 text-cta-foreground"
                    : "bg-foreground hover:bg-foreground/90 text-background"
                }`}
              >
                {o.cta}
              </Button>
              {o.footnote && (
                <p className="mt-3 text-xs text-center text-muted-foreground italic">{o.footnote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProblemSolution() {
  const before = [
    "Ewig in der Tasche wühlen",
    "Handy rausnehmen für jeden Klick",
    "Angst vor Taschendiebstahl",
    "Unordnung und Chaos in der Tasche",
    "Keine passende Alltagstasche",
  ];
  const after = [
    "Handy durch das Fenster bedienen",
    "Zahlen ohne Tasche zu öffnen",
    "RFID-Schutz für alle Karten",
    "Alles perfekt organisiert",
    "Stilvoll für jeden Anlass",
  ];

  return (
    <Section className="bg-card/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Kennst du das Problem?</h2>
        <p className="mt-4 text-foreground/70">Wir auch. Deshalb haben wir Glow & Go™ entwickelt.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
        <div className="bg-background border border-border rounded-3xl p-8">
          <h3 className="font-serif text-2xl mb-5">❌ Vorher</h3>
          <ul className="space-y-3">
            {before.map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-0.5 text-destructive">✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-soft-rose border border-rose/40 rounded-3xl p-8 shadow-soft">
          <h3 className="font-serif text-2xl mb-5">✨ Nachher mit Glow & Go™</h3>
          <ul className="space-y-3">
            {after.map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground">
                <span className="mt-0.5 text-cta font-bold">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Features() {
  const features = [
    { i: <Smartphone className="h-6 w-6" />, t: "Touchscreen-Fenster", d: "Kompatibel mit ALLEN Smartphones. Bediene alles ohne die Tasche zu öffnen." },
    { i: <ShieldCheck className="h-6 w-6" />, t: "RFID-Schutz", d: "Schützt Kredit- & EC-Karten vor digitalem Diebstahl im Alltag." },
    { i: <Briefcase className="h-6 w-6" />, t: "7 clevere Fächer", d: "Für Handy, 8 Karten, Schlüssel, Lippenstift und mehr." },
    { i: <Sparkles className="h-6 w-6" />, t: "Premium Kunstleder", d: "Wasserabweisend, langlebig und pflegeleicht. Sieht immer neu aus." },
    { i: <Link2 className="h-6 w-6" />, t: "Verstellbarer Riemen", d: "55 bis 120 cm. Crossbody, Schulter oder Handtasche – du entscheidest." },
    { i: <Gift className="h-6 w-6" />, t: "Perfektes Geschenk", d: "Kommt in eleganter Geschenkbox. Ideal für Geburtstag & Weihnachten." },
  ];

  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-gold text-sm font-medium tracking-widest uppercase">Premium-Qualität</span>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl tracking-tight">
          Warum Tausende Frauen Glow & Go™ lieben
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.t}
            className="bg-card border border-border rounded-3xl p-7 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-rose flex items-center justify-center text-foreground/90 mb-4">
              {f.i}
            </div>
            <h3 className="font-serif text-xl mb-2">{f.t}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function UseCases() {
  const cases = [
    { e: "🛍️", t: "Shopping", d: "Bezahlen ohne Wühlen" },
    { e: "✈️", t: "Reisen", d: "Boarding Pass immer griffbereit" },
    { e: "👩‍👧", t: "Mama-Alltag", d: "Hände frei, Handy erreichbar" },
    { e: "🌆", t: "City Life", d: "Stil trifft Funktionalität" },
  ];
  return (
    <Section className="bg-card/40">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Für jeden Moment gemacht</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cases.map((c) => (
          <div
            key={c.t}
            className="aspect-square bg-gradient-soft-rose border border-rose/30 rounded-3xl p-6 flex flex-col justify-end shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
          >
            <div className="text-5xl mb-3">{c.e}</div>
            <h3 className="font-serif text-2xl">{c.t}</h3>
            <p className="text-sm text-foreground/70 mt-1">{c.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Reviews() {
  // Per policy: no fake reviews. Empty review structure with placeholder.
  return (
    <Section id="reviews">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Kundenbewertungen</h2>
        <div className="mt-3 flex items-center justify-center gap-2 text-foreground/70">
          <span className="text-gold text-xl">☆☆☆☆☆</span>
          <span className="text-sm">Noch keine verifizierten Bewertungen</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Sei eine der ersten Kundinnen und teile deine Erfahrung mit Glow & Go™.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-dashed border-border rounded-3xl p-6">
            <div className="flex items-center gap-1 text-muted-foreground/50 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-4 w-4" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Noch keine Bewertung vorhanden.
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function GiftReminder({ onShopClick }: { onShopClick: () => void }) {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft-rose" />
      <div className="relative max-w-5xl mx-auto bg-card/60 backdrop-blur-sm border border-rose/40 rounded-[2rem] p-8 md:p-14 shadow-elegant">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Solange Vorrat reicht
            </span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl tracking-tight">
              🎁 Vergiss nicht dein Angebot!
            </h2>
            <p className="mt-4 text-foreground/75">
              Kaufe heute 2 Glow & Go™ Taschen und erhalte die <strong>3. Tasche GRATIS</strong> dazu –
              perfekt für dich & deine Liebsten.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 bg-background/60 rounded-2xl px-4 py-3 border border-border">
              <span className="text-sm text-cta font-medium">⏰ Endet in:</span>
              <CountdownTimer className="text-cta font-semibold text-lg" />
            </div>
            <div className="mt-6">
              <Button
                onClick={onShopClick}
                className="h-13 px-7 py-3 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold shadow-elegant pulse-cta"
              >
                Angebot sichern →
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-gold opacity-30 blur-2xl rounded-full" />
            <img
              src={giftSet}
              alt="Glow & Go Taschen – Buy 2 Get 1 Free"
              className="relative rounded-3xl shadow-elegant w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Passt mein Smartphone?",
      a: "Ja! Kompatibel mit allen Smartphones bis 6,7 Zoll inkl. iPhone 15 Pro Max & Samsung Galaxy S24 Ultra.",
    },
    {
      q: "Wie lange dauert die Lieferung?",
      a: "3–7 Werktage nach DE/AT/CH. Express-Versand in 1–3 Tagen möglich.",
    },
    {
      q: "Was ist das Gratis-Angebot?",
      a: "Bei Kauf von 2 Glow & Go™ Taschen erhältst du die 3. Tasche komplett GRATIS dazu (Buy 2 Get 1 Free).",
    },
    {
      q: "Kann ich Farben kombinieren?",
      a: "Ja! Bei 2er- und 3er-Sets kannst du verschiedene Farben frei wählen.",
    },
    {
      q: "Rückgabe & Garantie?",
      a: "30 Tage kostenlose Rückgabe. 12 Monate Garantie auf alle Produkte.",
    },
    {
      q: "Welche Zahlungsmethoden?",
      a: "Klarna (Ratenkauf), PayPal, Kreditkarte und SEPA-Lastschrift.",
    },
  ];
  return (
    <Section id="faq" className="bg-card/40">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Häufige Fragen</h2>
          <p className="mt-3 text-foreground/70">Alles, was du wissen möchtest.</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="bg-background border border-border rounded-2xl px-5 data-[state=open]:shadow-soft"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75 pb-5 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

function FinalCTA({ onShopClick }: { onShopClick: () => void }) {
  return (
    <Section className="relative">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-balance">
          Bereit für deine neue Lieblingstasche?
        </h2>
        <p className="mt-4 text-cta font-semibold flex items-center justify-center gap-2">
          ⚡ Nur noch <span className="font-serif text-2xl">43</span> Stück verfügbar
        </p>
        <div className="mt-8">
          <Button
            onClick={onShopClick}
            className="h-16 px-10 rounded-full bg-cta hover:bg-cta/90 text-cta-foreground text-lg font-semibold pulse-cta shadow-elegant"
          >
            Jetzt Glow & Go™ sichern →
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-foreground/65">
          <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> SSL-Verschlüsselt</span>
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Kostenlos ab 35€</span>
          <span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> 30 Tage Rückgabe</span>
          <span className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" /> 3. Tasche gratis im 3er-Set</span>
          <span className="flex items-center gap-1.5 text-gold">⭐ 4.9 / 5 Sterne</span>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background mt-12">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-serif text-3xl">Glow & Go<span className="text-gold text-sm align-super">™</span></p>
            <p className="mt-2 text-background/70 italic">Smart. Stylish. Always Ready.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-3 text-background/70">Service</h4>
            <ul className="space-y-2 text-sm">
              {["Impressum", "Datenschutz", "AGB", "Widerrufsrecht", "Kontakt", "Größentabelle"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-background/85 hover:text-rose transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-3 text-background/70">Folge uns</h4>
            <div className="flex gap-3">
              {["Instagram", "TikTok", "Pinterest"].map((s) => (
                <a key={s} href="#" className="bg-background/10 hover:bg-rose/30 rounded-full px-4 py-2 text-xs font-medium transition-colors">
                  {s}
                </a>
              ))}
            </div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-3 mt-6 text-background/70">Zahlung</h4>
            <div className="flex flex-wrap gap-2">
              {["Klarna", "PayPal", "Visa", "Mastercard", "SEPA", "Apple Pay"].map((p) => (
                <span key={p} className="text-[11px] font-semibold tracking-wide bg-background/10 rounded-md px-2 py-1">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-background/10 text-center text-xs text-background/60">
          © 2026 Glow & Go™. Alle Rechte vorbehalten. Made with <span className="text-rose">❤</span> in Germany
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  useCartSync();
  const product = Route.useLoaderData();

  const scrollToProduct = () => {
    document.getElementById("kollektion")?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-add hint: if user navigates with #buy hash
  useEffect(() => {
    if (window.location.hash === "#buy") scrollToProduct();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <Hero onShopClick={scrollToProduct} />
      <VideoShowcase onShopClick={scrollToProduct} />
      <GiftBanner onShopClick={scrollToProduct} />

      <Section id="kollektion">
        {product ? (
          <ProductConfigurator product={product} />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Produkt konnte nicht geladen werden.</p>
          </div>
        )}
      </Section>

      <ProblemSolution />
      <Features />
      <UseCases />
      <Reviews />
      <GiftReminder onShopClick={scrollToProduct} />
      <FAQ />
      <FinalCTA onShopClick={scrollToProduct} />
      <Footer />

      <StickyMobileCTA product={product} />
      <Toaster position="top-center" />
    </div>
  );
}
