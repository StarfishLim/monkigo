import Link from "next/link";
import type { Zone } from "../lib/supabaseClient";

type ZoneCardProps = {
  zone: Zone;
  completedCount: number;
  totalCount: number;
};

export const ZoneCard = ({ zone, completedCount, totalCount }: ZoneCardProps) => {
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Link
      href={`/zones/${zone.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-banana-dark/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-banana text-2xl">
        <span>{zone.icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{zone.name}</h3>
          <span className="text-xs text-slate-500">
            {completedCount}/{totalCount} monkeys
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-600">{zone.description}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-banana-light">
          <div
            className="h-1.5 rounded-full bg-jungle transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

