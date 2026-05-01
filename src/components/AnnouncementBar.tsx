import { useEffect, useState } from "react";

const messages = [
  "🎁 Kaufe 2 Taschen – die 3. ist GRATIS",
  "🚚 Kostenloser Versand ab 35€ nach DE / AT / CH",
  "⏰ Nur noch heute: 40% Rabatt auf alle Farben",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gradient-rose text-foreground/90 text-xs sm:text-sm font-medium tracking-wide">
      <div className="container mx-auto px-4 h-9 flex items-center justify-center overflow-hidden">
        <div key={index} className="fade-up text-center">{messages[index]}</div>
      </div>
    </div>
  );
}
