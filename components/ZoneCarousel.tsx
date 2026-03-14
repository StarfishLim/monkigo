import Link from "next/link";
import type { Zone } from "../lib/supabaseClient";

type ZoneCarouselProps = {
  zones: Zone[];
  zoneProgress: Record<string, { completed: number; total: number }>;
};

const zoneBgColors: Record<string, string> = {
  "upper-thomson-platform": "bg-sky-light",
  "ticket-hall": "bg-banana-light",
  "exits": "bg-jungle-light"
};

export const ZoneCarousel = ({ zones, zoneProgress }: ZoneCarouselProps) => {
  return (
    <div className="-mx-4">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {zones.map((zone) => {
          const p = zoneProgress[zone.id] ?? { completed: 0, total: 0 };
          const bg = zoneBgColors[zone.id] ?? "bg-cream";
          return (
            <Link
              key={zone.id}
              href={`/zones/${zone.id}`}
              className="group relative w-[85%] shrink-0 snap-center rounded-4xl border-0 bg-white p-5 shadow-soft-lg transition active:scale-[0.98]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-4xl opacity-0 transition group-hover:opacity-100 mh-shine" />
              <div className="relative flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`mh-float flex h-16 w-16 items-center justify-center rounded-3xl text-3xl shadow-soft ${bg}`}
                  >
                    {zone.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-slate-800">{zone.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">{zone.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {Array.from({ length: Math.min(p.total, 6) }).map((_, i) => (
                    <span
                      key={i}
                      className="text-xl transition-transform"
                      style={{ opacity: i < p.completed ? 1 : 0.3 }}
                      aria-hidden
                    >
                      {i < p.completed ? "🐵" : "🐒"}
                    </span>
                  ))}
                  {p.total > 6 && (
                    <span className="text-sm font-bold text-slate-500">
                      +{p.total - 6}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-center text-sm font-bold text-jungle">Tap to explore →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
