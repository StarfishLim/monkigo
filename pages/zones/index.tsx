import Link from "next/link";
import { useEffect, useState } from "react";
import { ZoneProgressBadge } from "../../components/ZoneProgressBadge";
import { mockMonkeys, mockZones } from "../../lib/mockData";
import { monkeyBelongsToZone } from "../../lib/supabaseClient";
import { getLocalUnlockedMonkeyIds } from "../../lib/progress";

export default function ZonesPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const load = () => setUnlockedIds(getLocalUnlockedMonkeyIds());
    load();
    window.addEventListener("storage", load);
    window.addEventListener("monkey-progress-updated", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("monkey-progress-updated", load);
    };
  }, []);

  const zoneProgress: Record<string, { completed: number; total: number }> =
    Object.fromEntries(
      mockZones.map((z) => {
        const zoneMonkeys = mockMonkeys.filter((m) =>
          monkeyBelongsToZone(m, z.id)
        );
        const total = zoneMonkeys.length;
        const completed = zoneMonkeys.filter((m) =>
          unlockedIds.includes(m.id)
        ).length;
        return [z.id, { completed, total }];
      })
    );

  const totalCompleted = mockMonkeys.filter((m) =>
    unlockedIds.includes(m.id)
  ).length;
  const totalMonkeys = mockMonkeys.length;
  const progressPercent = totalMonkeys
    ? Math.min(100, (totalCompleted / totalMonkeys) * 100)
    : 0;

  // Scooter appears at the left of the 4th badge (index 3)
  const activeIndex = 3;

  return (
    <div className="flex flex-col pb-4">
      {/* Header: back arrow, logo + progress bar, badge — sticky at top */}
      <header className="sticky top-0 z-10 mt-3 flex shrink-0 items-center gap-3 bg-white px-2 py-3">
        <Link
          href="/"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 text-slate-600 transition active:scale-95"
          aria-label="Back"
        >
          <span className="text-lg font-semibold">←</span>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex justify-center">
            <img
              src="/logo.svg"
              alt="Monkey Hunt"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-jungle transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <img src="/Group 9.svg" alt="" className="h-5 w-auto" />
          <span className="w-full text-center text-base font-bold text-[#00C000]">
            {totalCompleted}/{totalMonkeys}
          </span>
        </div>
      </header>

      {/* Vertical progression map: nodes + scooter beside current */}
      <div className="relative mx-auto mt-0 w-full max-w-sm px-4 pb-5">
        {mockZones.map((zone, index) => {
          const progress = zoneProgress[zone.id] ?? {
            completed: 0,
            total: 0,
          };
          const completedInZone = progress.completed;
          const showGreenBadge = completedInZone >= 1;
          const percent = progress.total
            ? progress.completed / progress.total
            : 0;
          const staggerRight = index % 2 === 1;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={zone.id}
              className="relative flex items-center gap-3 py-1"
              style={{
                marginLeft: staggerRight ? "2.5rem" : "0",
                marginRight: staggerRight ? "0" : "2.5rem",
              }}
            >
              {/* Left: scooter character beside current zone (Group 6.svg), 130% size */}
              <div className="relative flex h-20 w-20 shrink-0 items-end justify-end pr-0.5">
                {isCurrent ? (
                  <img
                    src="/Group 6.svg"
                    alt=""
                    className="h-24 w-auto object-contain object-bottom"
                    style={{
                      transform: "scale(1.3) translate(-10px, 15px)",
                      transformOrigin: "bottom right",
                      paddingTop: "",
                      paddingBottom: "",
                    }}
                    aria-hidden
                  />
                ) : null}
              </div>

              {/* Node: unlocked (green + star + progress arc) or locked (grey + padlock) */}
              <div className="relative h-16 w-16 shrink-0">
                {showGreenBadge ? (
                  <ZoneProgressBadge progress={percent} locked={false} />
                ) : (
                  <img
                    src="/zone-node-locked.svg"
                    alt=""
                    className="h-full w-auto object-contain drop-shadow-md"
                  />
                )}
              </div>

              {/* Label: zone name + progress */}
              <div className="min-w-0 flex-1">
                <p
                  className={
                    "text-[16px] font-extrabold uppercase tracking-wide " +
                    (showGreenBadge ? "text-jungle" : "text-slate-400")
                  }
                >
                  {zone.name}
                </p>
                {showGreenBadge && progress.total > 0 ? (
                  <p className="mt-0.5 text-xs font-semibold text-jungle">
                    {progress.completed} / {progress.total}
                  </p>
                ) : null}
              </div>

              <Link
                href={`/zones/${zone.id}`}
                className="absolute inset-0 z-0"
                aria-label={`Open ${zone.name}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
