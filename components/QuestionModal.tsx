import { useEffect, useMemo, useState } from "react";
import type { Monkey } from "../lib/supabaseClient";
import { CelebrationBurst } from "./CelebrationBurst";

type QuestionModalProps = {
  open: boolean;
  monkey: Monkey | null;
  alreadyUnlocked: boolean;
  onClose: () => void;
  onUnlock: (monkey: Monkey) => Promise<void>;
};

type Phase = "question" | "success";

export const QuestionModal = ({ open, monkey, alreadyUnlocked, onClose, onUnlock }: QuestionModalProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phase, setPhase] = useState<Phase>("question");
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedIndex(null);
    setWrong(false);
    setSaving(false);
    setPhase("question");
    setCelebrate(false);
  }, [open, monkey?.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const isCorrect = useMemo(() => {
    if (!monkey) return false;
    if (selectedIndex === null) return false;
    return selectedIndex === monkey.correctOptionIndex;
  }, [monkey, selectedIndex]);

  const handleUnlock = async () => {
    if (!monkey) return;
    if (alreadyUnlocked) {
      setPhase("success");
      setCelebrate(true);
      return;
    }
    if (!isCorrect) {
      setWrong(true);
      return;
    }
    setSaving(true);
    try {
      await onUnlock(monkey);
      setPhase("success");
      setCelebrate(true);
    } finally {
      setSaving(false);
    }
  };

  if (!open || !monkey) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-4xl bg-white p-6 shadow-soft-lg">
        <div className="flex items-center justify-between">
          <div className="min-h-11 min-w-11" />
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-6 flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-600 transition active:scale-95"
            aria-label="Close"
          >
            <span className="text-lg font-semibold">×</span>
          </button>
        </div>

        {/* Wrong answer: dedicated oops screen (like excellent screen), not under the choices */}
        {wrong && (
          <div className="relative mt-2 overflow-hidden rounded-3xl bg-white py-6">
            <div className="mb-4 flex justify-center">
              <img
                src="/Group 8.svg"
                alt="Monkey on scooter"
                className="h-32 w-auto"
              />
            </div>
            <p className="text-center text-xl font-bold text-slate-800">Oops, monkey ran away!</p>
            <p className="mt-1 text-center text-sm font-semibold text-slate-600">Try again!</p>
            <button
              type="button"
              onClick={() => setWrong(false)}
              className="mh-btn-duo mh-btn-bounce mx-auto mt-5 block rounded-2xl bg-jungle px-6 py-3.5 text-base font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {phase === "question" && !wrong && (
          <>
            <h3 className="mt-2 text-center text-lg font-bold text-slate-800">
              Where did you see this monkey?
            </h3>

            <div className="mt-5 flex flex-col gap-3">
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
                      "mh-btn-bounce w-full rounded-2xl border-2 px-4 py-4 text-left text-sm font-bold transition " +
                      (isSelected
                        ? "border-jungle bg-jungle/10 text-slate-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
                    }
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={saving || selectedIndex === null || alreadyUnlocked}
              onClick={handleUnlock}
              className={
                "mh-btn-bounce mt-5 w-full rounded-2xl px-4 py-4 text-base font-bold uppercase " +
                (alreadyUnlocked
                  ? "cursor-default bg-slate-200 text-slate-500"
                  : "mh-btn-duo bg-jungle text-white disabled:opacity-50")
              }
            >
              {saving ? "..." : alreadyUnlocked ? "You found it already" : "UNLOCK"}
            </button>
          </>
        )}

        {phase === "success" && (
          <div className="relative mt-4 overflow-hidden rounded-4xl bg-white p-6">
            <CelebrationBurst show={celebrate} onDone={() => setCelebrate(false)} />
            <div className="mb-3 flex justify-center">
              <img
                src="/Group 7.svg"
                alt=""
                className="h-24 w-auto"
              />
            </div>
            <p className="text-center text-2xl font-bold text-slate-800">Excellent!</p>
            <p className="mt-1 text-center text-sm font-semibold text-slate-600">
              You got one more monkey!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mh-btn-duo mh-btn-bounce mt-5 w-full rounded-2xl bg-jungle px-4 py-4 text-base font-bold text-white"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

