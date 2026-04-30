import { CartDrawer } from "./CartDrawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#top" className="font-serif text-2xl tracking-tight">
          Glow & Go<span className="text-gold text-sm align-super">™</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#kollektion" className="hover:text-cta transition-colors">Kollektion</a>
          <a href="#geschenke" className="hover:text-cta transition-colors">Geschenke</a>
          <a href="#reviews" className="hover:text-cta transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-cta transition-colors">FAQ</a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
