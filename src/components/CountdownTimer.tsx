import { useEffect, useState } from "react";

interface Props {
  hours?: number;
  minutes?: number;
  seconds?: number;
  className?: string;
}

export function CountdownTimer({ hours = 2, minutes = 47, seconds = 33, className }: Props) {
  const initial = hours * 3600 + minutes * 60 + seconds;
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => (s <= 0 ? initial : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [initial]);

  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");

  return (
    <div className={className}>
      <span className="font-serif tabular-nums">{h}</span>
      <span className="mx-1">:</span>
      <span className="font-serif tabular-nums">{m}</span>
      <span className="mx-1">:</span>
      <span className="font-serif tabular-nums">{s}</span>
    </div>
  );
}
