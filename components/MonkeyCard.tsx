import Link from "next/link";
import type { Monkey } from "../lib/supabaseClient";

type MonkeyCardProps = {
  monkey: Monkey;
  unlocked: boolean;
};

export const MonkeyCard = ({ monkey, unlocked }: MonkeyCardProps) => {
  return (
    <Link
      href={`/monkeys/${monkey.id}`}
      className={
        "group relative overflow-hidden rounded-3xl border bg-white p-4 shadow-sm shadow-banana-dark/30 transition " +
        (unlocked
          ? "border-jungle/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-jungle-dark/20"
          : "border-banana-dark/30 hover:-translate-y-0.5 hover:shadow-md")
      }
    >
      <div className={"absolute inset-0 opacity-0 transition group-hover:opacity-100 " + (unlocked ? "mh-shine" : "bg-banana-light/60")} />

      <div className="relative flex items-start gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-black/5">
          <img
            src={monkey.artworkUrl}
            alt={`${monkey.name} artwork preview`}
            className={
              "h-full w-full object-cover transition " +
              (unlocked ? "opacity-100" : "blur-md grayscale opacity-70")
            }
          />
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-extrabold text-slate-900 shadow-sm">
            #{monkey.number}
          </div>
          {!unlocked && (
            <div className="absolute inset-0 flex items-end justify-end p-2">
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                LOCKED
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-slate-900">{monkey.name}</h3>
            <span
              className={
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium " +
                (unlocked ? "bg-jungle/10 text-jungle-dark" : "bg-slate-100 text-slate-600")
              }
            >
              {unlocked ? "Collected" : "Hidden"}
            </span>
          </div>
          <p
            className={
              "mt-1 text-xs leading-relaxed " +
              (unlocked ? "text-slate-600 line-clamp-2" : "text-slate-500 line-clamp-2")
            }
          >
            {unlocked ? monkey.clue : "Artwork preview is hidden—find it in the station to reveal the clue."}
          </p>
        </div>
      </div>

      {unlocked && (
        <div className="relative mt-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-slate-500">MONKEY CARD</span>
          <span className="rounded-full bg-banana px-2 py-0.5 text-[11px] font-semibold text-slate-800">
            #{String(monkey.number).padStart(2, "0")}
          </span>
        </div>
      )}

      {unlocked && (
        <div className="pointer-events-none absolute right-3 top-3 rotate-12 rounded-xl border border-jungle/30 bg-white/80 px-2 py-1 text-[10px] font-extrabold tracking-wider text-jungle-dark shadow-sm">
          COLLECTED
        </div>
      )}
    </Link>
  );
};

