import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function MapPicker({ value, onChange, className }) {
  const boxRef = useRef(null);
  const [pos, setPos] = useState({ x: 120, y: 80 });

  useEffect(() => {
    if (value) {
      const x = ((value.lng + 180) / 360) * 100; // percent
      const y = ((-value.lat + 90) / 180) * 100; // percent
      setPos({ x, y });
    }
  }, [value]);

  const onDrag = (e) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, xPct)), y: Math.max(0, Math.min(100, yPct)) });
    const lng = (xPct / 100) * 360 - 180;
    const lat = 90 - (yPct / 100) * 180;
    onChange({ lat, lng });
  };

  return (
    <div
      ref={boxRef}
      onClick={onDrag}
      className={cn("relative h-56 w-full overflow-hidden rounded-xl border border-border/60 bg-[url('https://tile.openstreetmap.org/5/15/10.png')] bg-cover bg-center", className)}
      title="Drag to move the pin"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/10 pointer-events-none" />
      <div
        className="absolute -translate-x-1/2 -translate-y-full cursor-pointer"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 22s8-4.5 8-12a8 8 0 1 0-16 0c0 7.5 8 12 8 12Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    </div>
  );
}
