import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mockMonkeys, mockZones } from "../../lib/mockData";
import { useSupabase } from "../../lib/supabaseClient";
import { CelebrationBurst } from "../../components/CelebrationBurst";
import { getLocalUnlockedMonkeyIds, unlockMonkey } from "../../lib/progress";

type Step = "preview" | "question" | "success";

export default function MonkeyDetailPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const monkeyId = typeof router.query.monkeyId === "string" ? router.query.monkeyId : "";

  const monkey = useMemo(() => mockMonkeys.find((m) => m.id === monkeyId) ?? null, [monkeyId]);
  const zone = useMemo(
    () => (monkey ? mockZones.find((z) => z.id === monkey.zone_id) ?? null : null),
    [monkey]
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("preview");
  const [wrong, setWrong] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUnlocked(getLocalUnlockedMonkeyIds().includes(monkeyId));
  }, [monkeyId]);

  const persistUnlock = async () => {
    if (!monkey) return;
    await unlockMonkey(supabase, monkey.id);
  };

  const isAnswerCorrect = selectedIndex === monkey?.correctOptionIndex;

  const onUnlock = async () => {
    if (!monkey) return;
    if (selectedIndex === null) return;
    if (!isAnswerCorrect) {
      setWrong(true);
      return;
    }

    setSaving(true);
    try {
      if (!unlocked) {
        await persistUnlock();
        setUnlocked(true);
      }
      setCelebrate(true);
      setStep("success");
    } finally {
      setSaving(false);
    }
  };

  if (!monkeyId) return null;

  if (!monkey) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30">
        <h1 className="text-lg font-semibold">Monkey not found</h1>
        <p className="mt-2 text-sm text-slate-700">Try going back to Zones.</p>
        <Link href="/zones" className="mt-3 inline-flex text-sm font-medium text-jungle-dark">
          ← Back to Zones
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header
        className={
          "relative space-y-2 rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30 " +
          (celebrate ? "mh-pop" : "")
        }
      >
        <CelebrationBurst show={celebrate} onDone={() => setCelebrate(false)} />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={
                "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl " +
                (unlocked ? "bg-jungle text-white" : "bg-banana text-slate-800")
              }
            >
              {monkey.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                #{String(monkey.number).padStart(2, "0")} • {monkey.name}
              </h1>
              {zone && (
                <p className="text-xs text-slate-600">
                  Zone:{" "}
                  <Link href={`/zones/${zone.id}`} className="font-medium text-jungle-dark">
                    {zone.name}
                  </Link>
                </p>
              )}
            </div>
          </div>
          <Link
            href={zone ? `/zones/${zone.id}` : "/zones"}
            className="text-sm font-medium text-jungle-dark"
          >
            Back
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={
              "rounded-full px-2 py-1 text-xs " +
              (unlocked ? "bg-jungle/10 text-jungle-dark" : "bg-slate-100 text-slate-600")
            }
          >
            {unlocked ? "Collected" : "Locked"}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            Step{" "}
            {step === "preview" ? "1/3" : step === "question" ? "2/3" : "3/3"}
          </span>
        </div>
      </header>

      {step === "preview" && (
        <section className="rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30">
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
            <img
              src={monkey.artworkUrl}
              alt={`${monkey.name} artwork`}
              className={"h-56 w-full object-cover " + (unlocked ? "" : "blur-[2px] grayscale")}
            />
          </div>
          <div className="mt-4 rounded-2xl bg-banana-light p-4">
            <p className="text-xs font-semibold text-slate-700">Clue</p>
            <p className="mt-1 text-sm text-slate-800">{monkey.clue}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("question");
              setWrong(false);
            }}
            className="mt-4 w-full rounded-full bg-jungle px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-jungle-dark/40"
          >
            Continue to question
          </button>
          <p className="mt-2 text-center text-xs text-slate-600">
            Hint: match the artwork with what you see at the station.
          </p>
        </section>
      )}

      {step === "question" && (
        <section className="rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30">
          <h2 className="text-sm font-semibold text-slate-900">{monkey.question}</h2>
          <div className="mt-3 flex flex-col gap-2">
            {monkey.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(idx);
                    setWrong(false);
                  }}
                  className={
                    "w-full rounded-2xl border px-4 py-4 text-left text-sm transition " +
                    (isSelected
                      ? "border-jungle bg-jungle/10"
                      : "border-banana-dark/40 bg-banana-light hover:border-jungle/70")
                  }
                >
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-800">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {wrong && <p className="mt-3 text-sm font-medium text-red-600">Not quite—try again.</p>}

          <button
            type="button"
            disabled={saving || selectedIndex === null || !isAnswerCorrect}
            onClick={onUnlock}
            className="mt-4 w-full rounded-full bg-jungle px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-jungle-dark/40 disabled:opacity-60"
          >
            {saving ? "Unlocking..." : unlocked ? "Unlock (already collected)" : "Unlock monkey"}
          </button>

          <button
            type="button"
            onClick={() => setStep("preview")}
            className="mt-3 w-full rounded-full border border-banana-dark/40 bg-banana-light px-4 py-3 text-sm font-semibold text-slate-800"
          >
            Back to clue
          </button>
        </section>
      )}

      {step === "success" && (
        <section className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm shadow-banana-dark/30">
          <CelebrationBurst show={celebrate} onDone={() => setCelebrate(false)} />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jungle text-2xl text-white">
              {monkey.icon}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Monkey collected!</h2>
              <p className="text-xs text-slate-600">
                #{String(monkey.number).padStart(2, "0")} added to your collection.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/5">
            <img src={monkey.artworkUrl} alt={`${monkey.name} artwork`} className="h-56 w-full object-cover" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href={zone ? `/zones/${zone.id}` : "/zones"}
              className="flex min-h-12 items-center justify-center rounded-2xl bg-jungle px-4 py-3 text-sm font-semibold text-white"
            >
              Return to zone
            </Link>
            <Link
              href="/profile"
              className="flex min-h-12 items-center justify-center rounded-2xl border border-jungle/30 bg-white px-4 py-3 text-sm font-semibold text-jungle-dark"
            >
              View collection
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

