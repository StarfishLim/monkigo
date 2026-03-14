import { useState } from "react";
import Link from "next/link";

const FORMSPREE_FEEDBACK_ID = process.env.NEXT_PUBLIC_FORMSPREE_FEEDBACK_ID ?? "xdawdppb";

export default function FeedbackPage() {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim() || !FORMSPREE_FEEDBACK_ID) return;
    setFeedbackStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FEEDBACK_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: feedbackMessage.trim(),
          email: feedbackEmail.trim() || undefined,
          rating: feedbackRating ?? undefined,
          _subject: "MonkiGo feedback",
        }),
      });
      if (res.ok) {
        setFeedbackStatus("success");
        setFeedbackMessage("");
        setFeedbackEmail("");
        setFeedbackRating(null);
      } else {
        setFeedbackStatus("error");
      }
    } catch {
      setFeedbackStatus("error");
    }
  };

  return (
    <div className="-mx-4 -mt-6 flex min-h-0 flex-1 flex-col px-3 pt-2">
      <header className="flex shrink-0 items-center gap-2 py-2">
        <Link
          href="/"
          className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 text-slate-600 transition active:scale-95"
          aria-label="Back to home"
        >
          <span className="text-lg font-semibold">←</span>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-center text-lg font-bold text-slate-800">
            Feedback
          </h1>
        </div>
        <div className="min-h-10 min-w-10 shrink-0" aria-hidden />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-44 pt-3">
        <div className="mx-auto max-w-md">
          <section className="rounded-3xl bg-white p-4" aria-labelledby="feedback-title">
            <h2
              id="feedback-title"
              className="text-lg font-bold text-slate-800"
            >
              Share your feedback
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Did you enjoy the monkey hunt? Tell us what you liked or how we can make MonkiGo even better.
            </p>
            {!FORMSPREE_FEEDBACK_ID && (
              <p className="mt-2 text-xs text-amber-700">
                To receive submissions, add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_FORMSPREE_FEEDBACK_ID</code> in <code className="rounded bg-amber-100 px-1">.env.local</code> (get a form ID at formspree.io).
              </p>
            )}
            <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <span className="block text-sm font-semibold text-slate-700">How was your monkey hunt?</span>
                <div className="flex gap-2" role="group" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const selected = feedbackRating !== null && n <= feedbackRating;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFeedbackRating(feedbackRating === n ? null : n)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg transition ${
                          selected
                            ? "border-jungle bg-jungle/15 text-jungle"
                            : "border-slate-200 bg-slate-50/80 text-slate-400"
                        }`}
                        aria-pressed={selected}
                        aria-label={`${n} star${n === 1 ? "" : "s"}`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500">Tap a star to rate your experience</p>
              </div>
              <div className="pt-1">
                <label htmlFor="feedback-email" className="block text-sm font-semibold text-slate-700">
                  Email <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <p className="mt-0.5 text-xs text-slate-500">Leave your email if you'd like us to reply.</p>
                <input
                  id="feedback-email"
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-jungle focus:outline-none focus:ring-2 focus:ring-jungle/20"
                />
              </div>
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-semibold text-slate-700">
                  Your feedback
                </label>
                <textarea
                  id="feedback-message"
                  required
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="What did you enjoy? Did you spot all the monkeys? Anything we could improve?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-jungle focus:outline-none focus:ring-2 focus:ring-jungle/20"
                />
              </div>
              {feedbackStatus === "success" && (
                <p className="text-sm font-semibold text-jungle">Thanks! Your feedback was sent.</p>
              )}
              {feedbackStatus === "error" && (
                <p className="text-sm font-semibold text-red-600">Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={!feedbackMessage.trim() || feedbackStatus === "sending" || !FORMSPREE_FEEDBACK_ID}
                className="mh-btn-duo mh-btn-bounce w-full min-h-12 rounded-2xl bg-jungle px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white disabled:opacity-50"
              >
                {feedbackStatus === "sending" ? "Sending…" : "Send feedback"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
