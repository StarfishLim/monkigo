import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import type { Monkey } from "../lib/supabaseClient";

const OVERLAP = 48; // negative gap: cards overlap by 48px so center stacks on top
const CARD_WIDTH = 280;
const CARD_HEIGHT = 320;

type MonkeyCarouselProps = {
  monkeys: Monkey[];
  unlockedIds: string[];
  onFound: (monkey: Monkey) => void;
  /** When set, open with this monkey centered (e.g. from grid thumbnail click). */
  initialMonkeyId?: string | null;
};

export const MonkeyCarousel = ({ monkeys, unlockedIds, onFound, initialMonkeyId }: MonkeyCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialIndex =
    initialMonkeyId != null ? monkeys.findIndex((m) => m.id === initialMonkeyId) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const isJumpingRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const targetIndexForScroll = initialIndex >= 0 ? initialIndex : 0;

  // Loop: show [last, ...all, first] so we can scroll infinitely
  const displayList = [
    monkeys[monkeys.length - 1],
    ...monkeys,
    monkeys[0]
  ].filter(Boolean) as Monkey[];

  const getCardWidth = useCallback(() => CARD_WIDTH, []);

  const getSegment = useCallback(() => getCardWidth() - OVERLAP, [getCardWidth]);

  const getScrollPosition = useCallback(
    (index: number) => {
      return index * getSegment();
    },
    [getSegment]
  );

  const jumpIfNeeded = useCallback(() => {
    const el = scrollRef.current;
    if (!el || monkeys.length <= 1 || isJumpingRef.current) return;
    const segment = getSegment();
    const scrollLeft = el.scrollLeft;

    // Jump in clone zones so first/last real cards can stay active, but trigger wrap early
    // so "swipe left from last" and "swipe right from first" feel responsive.
    const startCloneThreshold = segment * 0.5;
    // Trigger jump to first when just past the last card (~25% into the gap to clone).
    const endCloneThreshold = segment * (monkeys.length + 0.25);

    // At clone of last (start): jump to real last
    if (scrollLeft < startCloneThreshold) {
      isJumpingRef.current = true;
      el.scrollTo({ left: segment * monkeys.length, behavior: "auto" });
      setCurrentIndex(monkeys.length - 1);
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
      return;
    }
    // At clone of first (end): jump to real first
    if (scrollLeft > endCloneThreshold) {
      isJumpingRef.current = true;
      el.scrollTo({ left: segment, behavior: "auto" });
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
      return;
    }
  }, [monkeys.length, getSegment]);

  const updateIndex = useCallback(() => {
    if (isJumpingRef.current || programmaticScrollRef.current) return;
    const el = scrollRef.current;
    if (!el || monkeys.length === 0) return;
    const segment = getSegment();
    const scrollLeft = el.scrollLeft;

    // Map scroll position to real index 0..monkeys.length-1.
    // Use floor((scrollLeft + segment/2) / segment) so each card has a full segment of "active" range.
    const slot = Math.floor((scrollLeft + segment / 2) / segment);
    let realIndex: number;
    if (slot <= 0) realIndex = monkeys.length - 1;
    else if (slot >= monkeys.length + 1) realIndex = 0;
    else realIndex = slot - 1;
    setCurrentIndex(realIndex);
  }, [monkeys.length, getSegment]);

  const handleScroll = useCallback(() => {
    updateIndex();
    jumpIfNeeded();
  }, [updateIndex, jumpIfNeeded]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || monkeys.length === 0) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, monkeys.length]);

  // Scroll to initialMonkeyId card (grid click or ?monkey=). Use scrollLeft + multiple passes so it sticks after layout.
  const applyScrollToInitial = useCallback(() => {
    if (monkeys.length === 0) return;
    const idx = initialMonkeyId != null ? monkeys.findIndex((m) => m.id === initialMonkeyId) : 0;
    const targetIndex = idx >= 0 ? idx : 0;
    const segment = getSegment();
    const targetScroll = segment * (targetIndex + 1);
    const el = scrollRef.current;
    if (!el) return;
    programmaticScrollRef.current = true;
    el.scrollLeft = targetScroll;
    setCurrentIndex(targetIndex);
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = targetScroll;
      }
      setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 400);
    });
  }, [initialMonkeyId, monkeys.length, getSegment]);

  useLayoutEffect(() => {
    if (monkeys.length === 0) return;
    const idx = initialMonkeyId != null ? monkeys.findIndex((m) => m.id === initialMonkeyId) : 0;
    const targetIndex = idx >= 0 ? idx : 0;
    setCurrentIndex(targetIndex);
    const segment = getSegment();
    const targetScroll = segment * (targetIndex + 1);
    const el = scrollRef.current;
    if (el) {
      programmaticScrollRef.current = true;
      el.scrollLeft = targetScroll;
    }
    const raf = requestAnimationFrame(() => applyScrollToInitial());
    const t1 = setTimeout(applyScrollToInitial, 50);
    const t2 = setTimeout(applyScrollToInitial, 150);
    const t3 = setTimeout(applyScrollToInitial, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [monkeys.length, getSegment(), initialMonkeyId, applyScrollToInitial]);

  if (monkeys.length === 0) return null;

  const current = monkeys[currentIndex];
  const isUnlocked = current ? unlockedIds.includes(current.id) : false;

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col justify-start items-center px-2 pb-44">
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth bg-transparent pb-4 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {displayList.map((monkey, i) => {
          const unlocked = unlockedIds.includes(monkey.id);
          const isClone = i === 0 || i === displayList.length - 1;
          const isCentered = i === currentIndex + 1;
          return (
            <article
              key={isClone ? `${monkey.id}-clone-${i}` : monkey.id}
              className={
                "mh-card flex shrink-0 snap-center flex-col transition-all duration-300 ease-out origin-center " +
                (isCentered
                  ? "z-10 scale-100"
                  : "z-0 scale-[0.85] opacity-90 blur-[2px]")
              }
              style={{
                width: CARD_WIDTH,
                scrollSnapAlign: "center",
                marginRight: i < displayList.length - 1 ? -OVERLAP : 0,
                boxShadow: "none"
              }}
            >
              <div
                className="relative shrink-0"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <img
                  src={monkey.artworkUrl}
                  alt={unlocked ? `${monkey.name} artwork` : "Hidden artwork"}
                  className="h-full w-full object-cover transition-all duration-500"
                  style={{ color: "rgba(30, 41, 59, 0)" }}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                />
                {unlocked && isCentered && (
                  <div className="absolute right-3 top-3 rounded-xl border-2 border-jungle bg-white px-2.5 py-1.5 text-xs font-bold text-jungle">
                    Collected
                  </div>
                )}
                {unlocked && (
                  <span
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-white/90 line-through drop-shadow-sm"
                    aria-hidden
                  >
                    HUNTED
                  </span>
                )}
              </div>
            </article>
          );
        })}
        {/* Spacer so we can scroll past last card into clone zone and trigger wrap to first */}
        <div
          style={{
            width: getSegment(),
            minWidth: getSegment(),
            flexShrink: 0,
            scrollSnapAlign: "none"
          }}
          aria-hidden
        />
      </div>

      <div className="flex justify-center gap-2 pb-2">
        {monkeys.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to card ${i + 1}`}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              el.scrollTo({ left: getSegment() * (i + 1), behavior: "smooth" });
            }}
            className={
              "h-2 rounded-full transition-all " +
              (i === currentIndex ? "w-6 bg-jungle" : "w-2 bg-slate-300")
            }
          />
        ))}
      </div>

      {/* Fixed bar just above Cards/Grid toggle: monkey name, clue, I FOUND IT button */}
      {current && (
        <div
          className="safe-bottom fixed left-0 right-0 z-20"
          style={{ bottom: "5rem" }}
        >
          <div className="mx-auto w-full max-w-[420px] px-4">
            <div className="rounded-3xl bg-white/95 px-4 py-3 backdrop-blur-md">
              <p className="text-center text-xs text-slate-500">#{current.number}</p>
              <h3 className="mt-0.5 text-center text-lg font-bold text-slate-900">
                {current.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-center text-sm leading-snug text-slate-600">
                {isUnlocked
                  ? current.clue
                  : "Find this artwork in the station to reveal the clue and collect the card."}
              </p>
              <button
                type="button"
                disabled={isUnlocked}
                onClick={() => {
                  if (!isUnlocked) onFound(current);
                }}
                className={
                  "mh-btn-bounce mx-auto mt-3 flex min-h-12 w-full max-w-[320px] items-center justify-center rounded-2xl py-3 text-base font-bold transition " +
                  (isUnlocked
                    ? "cursor-default bg-slate-200 text-slate-500"
                    : "mh-btn-duo bg-jungle text-white disabled:opacity-50")
                }
              >
                {isUnlocked ? "You got this one" : "I FOUND IT!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
