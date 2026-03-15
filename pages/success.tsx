import Link from "next/link";
import { LOCAL_PROGRESS_KEY } from "../lib/progress";

export default function SuccessPage() {
  const handlePlayAgain = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LOCAL_PROGRESS_KEY);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-6 safe-top">
        <div className="flex w-full max-w-[420px] flex-shrink-0 flex-col items-center gap-6 text-center">
          <div className="flex justify-center">
            <img
              src="/Group 7.svg"
              alt=""
              className="h-40 w-auto sm:h-48"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              You did it!
            </h1>
            <p className="text-base font-semibold text-slate-600 sm:text-lg">
              All monkeys collected. You’ve hunted every one at Upper Thomson MRT.
            </p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Link
              href="/feedback"
              className="mh-btn-duo mh-btn-bounce flex min-h-14 items-center justify-center rounded-2xl bg-jungle px-4 py-4 text-base font-extrabold text-white"
            >
              Share your feedback
            </Link>
            <Link
              href="/zones"
              onClick={handlePlayAgain}
              className="flex min-h-14 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-base font-bold text-slate-700 transition active:scale-95"
            >
              Play again
            </Link>
          </div>
        </div>
      </div>
  );
}
