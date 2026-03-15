import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] h-full w-full flex-1 flex-col items-center justify-center overflow-hidden overflow-x-hidden px-4 pb-0 pt-6 safe-top">
      <div className="flex w-full max-w-[420px] flex-shrink-0 flex-col items-center gap-6">
        <img
          src="/logo.svg"
          alt="Monkigo"
          className="relative z-10 h-10 w-auto max-w-full scale-150 select-none sm:h-12"
        />
        <div className="relative z-0 w-full max-w-full overflow-visible mb-2">
          <div className="mh-landing-illus-wrap relative flex items-end justify-start">
            <img
              src="/mrt.svg"
              alt="MRT train"
              className="mh-landing-mrt h-auto w-full select-none"
            />
            <img
              src="/scooter.svg"
              alt="Monkey on scooter"
              className="mh-landing-scooter absolute bottom-0 right-[10%] h-auto w-[45%] max-w-[240px] select-none"
            />
          </div>
        </div>
        <p className="relative z-10 mt-4 mt-[10vh] px-4 text-center text-xl font-bold leading-snug text-slate-800 sm:text-2xl">
          Hidden Monkeys of
          <br />
          Upper Thomson MRT
        </p>
        <div className="flex w-full max-w-xs flex-col gap-5">
          <Link
            href="/zones"
            className="mh-btn-duo mh-btn-bounce flex min-h-14 items-center justify-center rounded-2xl bg-jungle px-4 py-4 text-base font-extrabold uppercase tracking-wide text-white"
          >
            Start Now
          </Link>
          <Link
            href="/faq"
            className="text-center text-lg font-semibold text-slate-600"
          >
            How to play?
          </Link>
        </div>
      </div>
    </div>
  );
}

