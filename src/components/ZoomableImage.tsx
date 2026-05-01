import { useRef, useState, useCallback, type PointerEvent as RPointerEvent, type WheelEvent as RWheelEvent } from "react";

interface Props {
  src: string;
  alt: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export function ZoomableImage({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // Pointer tracking for pan + pinch
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const clampPan = useCallback((nextScale: number, x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const rect = el.getBoundingClientRect();
    const maxX = (rect.width * (nextScale - 1)) / 2;
    const maxY = (rect.height * (nextScale - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      pinchStart.current = { dist, scale };
      panStart.current = null;
    } else if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const next = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, (pinchStart.current.scale * dist) / pinchStart.current.dist),
      );
      setScale(next);
      const clamped = clampPan(next, tx, ty);
      setTx(clamped.x);
      setTy(clamped.y);
    } else if (pointers.current.size === 1 && panStart.current && scale > 1) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      const clamped = clampPan(scale, panStart.current.tx + dx, panStart.current.ty + dy);
      setTx(clamped.x);
      setTy(clamped.y);
    }
  };

  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
  };

  const onWheel = (e: RWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta * scale));
    setScale(next);
    if (next === 1) {
      setTx(0);
      setTy(0);
    } else {
      const clamped = clampPan(next, tx, ty);
      setTx(clamped.x);
      setTy(clamped.y);
    }
  };

  const onDoubleClick = () => {
    if (scale > 1) reset();
    else setScale(2);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-card touch-none select-none"
      style={{ height: "min(85vh, 80svh)" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-contain will-change-transform"
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transition: pointers.current.size === 0 ? "transform 0.18s ease-out" : "none",
        }}
      />
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1 rounded-full">
        Pinch · Doppeltippen · Ziehen
      </div>
    </div>
  );
}
