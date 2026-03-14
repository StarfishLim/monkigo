import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mockMonkeys, mockZones } from "../../lib/mockData";
import { monkeyBelongsToZone } from "../../lib/supabaseClient";
import { getLocalUnlockedMonkeyIds, unlockMonkey } from "../../lib/progress";
import { MonkeyCarousel } from "../../components/MonkeyCarousel";
import { QuestionModal } from "../../components/QuestionModal";
import { useSupabase } from "../../lib/supabaseClient";
import { useLockMainScroll } from "../../lib/LockMainScrollContext";

export default function ZoneDetailPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const lockMainScroll = useLockMainScroll();
  const zoneId = typeof router.query.zoneId === "string" ? router.query.zoneId : "";

  const zone = useMemo(() => mockZones.find((z) => z.id === zoneId) ?? null, [zoneId]);
  const monkeys = useMemo(
    () => mockMonkeys.filter((m) => monkeyBelongsToZone(m, zoneId)),
    [zoneId]
  );

  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMonkeyId, setActiveMonkeyId] = useState<string | null>(null);
  const queryMonkey = typeof router.query.monkey === "string" ? router.query.monkey : null;
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("grid");
  const [carouselMonkeyId, setCarouselMonkeyId] = useState<string | null>(null);

  // Single list: zone monkeys sorted by number (same order for grid and carousel)
  const sortedMonkeysForResolve = useMemo(
    () => monkeys.slice().sort((a, b) => a.number - b.number),
    [monkeys]
  );
  // Resolve ?monkey= to a monkey id (by id or by number e.g. "4" -> monkey with number 4 in this zone)
  const resolvedCarouselMonkeyId = useMemo(() => {
    if (!queryMonkey) return null;
    const byId = sortedMonkeysForResolve.find((m) => m.id === queryMonkey);
    if (byId) return byId.id;
    const num = parseInt(queryMonkey, 10);
    if (!Number.isNaN(num)) {
      const byNumber = sortedMonkeysForResolve.find((m) => m.number === num);
      return byNumber?.id ?? null;
    }
    return null;
  }, [queryMonkey, sortedMonkeysForResolve]);

  // Single source of truth for "which monkey to show in carousel": URL first, then state (from grid click before URL updates)
  const selectedMonkeyIdForCarousel = resolvedCarouselMonkeyId ?? carouselMonkeyId;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const load = () => setUnlockedIds(getLocalUnlockedMonkeyIds());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // When URL has ?monkey=, open carousel and sync state
  useEffect(() => {
    if (resolvedCarouselMonkeyId) {
      setViewMode("carousel");
      setCarouselMonkeyId(resolvedCarouselMonkeyId);
    }
  }, [resolvedCarouselMonkeyId]);

  // In card (carousel) view, disable main vertical scroll so user can't scroll up
  useEffect(() => {
    lockMainScroll?.setLockMainScroll(viewMode === "carousel");
    return () => lockMainScroll?.setLockMainScroll(false);
  }, [viewMode, lockMainScroll]);

  if (!zoneId) return null;

  if (!zone) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30">
        <h1 className="text-lg font-semibold">Zone not found</h1>
        <p className="mt-2 text-sm text-slate-700">Try going back to Zones.</p>
        <Link href="/zones" className="mt-3 inline-flex text-sm font-medium text-jungle-dark">
          ← Back to Zones
        </Link>
      </div>
    );
  }

  const completed = monkeys.filter((m) => unlockedIds.includes(m.id)).length;
  const sortedMonkeys = sortedMonkeysForResolve;
  const activeMonkey = activeMonkeyId ? sortedMonkeys.find((m) => m.id === activeMonkeyId) ?? null : null;
  const progressPercent = monkeys.length ? Math.min(100, (completed / monkeys.length) * 100) : 0;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Sticky block: header + toggle stay together, solid background when scrolling */}
      <div className="sticky top-0 z-10 flex shrink-0 flex-col border-b border-slate-200/80 bg-white shadow-none">
        <header className="flex shrink-0 items-center gap-3 px-2 pb-3 pt-6">
          <Link
            href="/zones"
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 text-slate-600 transition active:scale-95"
            aria-label="Close"
          >
            <span className="text-lg font-semibold">×</span>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-center text-xl font-bold text-slate-800">{zone.name}</h1>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-jungle transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <img
              src="/Group 9.svg"
              alt=""
              className="h-5 w-auto"
            />
            <span className="w-full text-center text-base font-bold text-[#00C000]">
              {completed}/{monkeys.length}
            </span>
          </div>
        </header>

        {/* Toggle: carousel (cards) vs grid (thumbnails) — sticks with header */}
        <div className="flex shrink-0 justify-center gap-0.5 px-2 py-2">
        <button
          type="button"
          onClick={() => setViewMode("carousel")}
          aria-pressed={viewMode === "carousel"}
          aria-label="Cards view"
          className={
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition " +
            (viewMode === "carousel"
              ? "border border-jungle bg-[rgba(88,204,2,0.1)] text-slate-700"
              : "bg-slate-100 text-slate-600 active:bg-slate-200")
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="4" width="14" height="16" rx="2" />
            <rect x="8" y="2" width="14" height="16" rx="2" />
          </svg>
          Cards
        </button>
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          aria-pressed={viewMode === "grid"}
          aria-label="Grid view"
          className={
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition " +
            (viewMode === "grid"
              ? "border border-jungle bg-[rgba(88,204,2,0.1)] text-slate-700"
              : "bg-slate-100 text-slate-600 active:bg-slate-200")
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Grid
        </button>
      </div>
      </div>

      {viewMode === "carousel" && (
        <MonkeyCarousel
          key={selectedMonkeyIdForCarousel ?? "carousel"}
          monkeys={sortedMonkeys}
          unlockedIds={unlockedIds}
          onFound={(monkey) => {
            setActiveMonkeyId(monkey.id);
            setModalOpen(true);
          }}
          initialMonkeyId={selectedMonkeyIdForCarousel}
        />
      )}

      {viewMode === "grid" && (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-44 px-2">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3 py-2 sm:grid-cols-3">
            {sortedMonkeys.map((monkey) => {
              const unlocked = unlockedIds.includes(monkey.id);
              return (
                <button
                  key={monkey.id}
                  type="button"
                  onClick={() => {
                    setCarouselMonkeyId(monkey.id);
                    setViewMode("carousel");
                    router.replace(
                      { pathname: router.pathname, query: { ...router.query, monkey: monkey.id } },
                      undefined,
                      { shallow: true }
                    );
                  }}
                  className={"mh-card flex flex-col overflow-hidden rounded-2xl bg-white text-left transition active:scale-[0.98] " + (unlocked ? "border border-slate-200/80" : "border-2 border-slate-300")}
                >
                  <div className="relative aspect-[280/320] w-full overflow-hidden">
                    <img
                      src={monkey.artworkUrl}
                      alt={unlocked ? `${monkey.name} artwork` : "Hidden artwork"}
                      className={"h-full w-full object-cover transition " + (unlocked ? "grayscale opacity-30" : "")}
                    />
                    {unlocked && (
                      <span className="absolute right-1.5 top-1.5 rounded-lg border border-jungle bg-white px-1.5 py-0.5 text-[10px] font-bold text-jungle">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className={"text-xs font-semibold text-slate-500 " + (unlocked ? "opacity-30" : "")}>#{monkey.number}</p>
                    <p className={"truncate text-sm font-bold text-slate-800 " + (unlocked ? "opacity-30" : "")}>{monkey.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <QuestionModal
        open={modalOpen}
        monkey={activeMonkey}
        alreadyUnlocked={activeMonkey ? unlockedIds.includes(activeMonkey.id) : false}
        onClose={() => setModalOpen(false)}
        onUnlock={async (monkey) => {
          await unlockMonkey(supabase, monkey.id);
          setUnlockedIds(getLocalUnlockedMonkeyIds());
        }}
      />
    </div>
  );
}

