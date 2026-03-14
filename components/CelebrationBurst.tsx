import { useEffect, useMemo } from "react";

type CelebrationBurstProps = {
  show: boolean;
  onDone?: () => void;
};

const colors = ["#37B24D", "#2F9E44", "#FFE066", "#E3B341", "#0EA5E9", "#F97316"];

export const CelebrationBurst = ({ show, onDone }: CelebrationBurstProps) => {
  const pieces = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const x0 = `${(Math.random() * 20 - 10).toFixed(1)}px`;
      const x1 = `${(Math.random() * 220 - 110).toFixed(1)}px`;
      const size = `${Math.round(6 + Math.random() * 8)}px`;
      const delay = `${Math.round(Math.random() * 120)}ms`;
      const color = colors[i % colors.length];
      return { x0, x1, size, delay, color };
    });
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => onDone?.(), 950);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, idx) => (
        <span
          key={idx}
          className="mh-confetti-piece"
          style={{
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            // @ts-expect-error CSS variables
            ["--x0"]: p.x0,
            // @ts-expect-error CSS variables
            ["--x1"]: p.x1
          }}
        />
      ))}
    </div>
  );
};

