import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between overflow-hidden pb-4 pt-4">
      <div className="relative flex w-full min-w-0 flex-1 flex-col items-center justify-center overflow-hidden">
        <img
          src="/logo.svg"
          alt="Monkigo"
          className="relative z-10 mt-[50px] -mb-20 h-12 w-auto scale-150 select-none"
        />
        <div className="relative z-0 mt-2 h-[420px] w-full min-w-[420px] -mr-4 overflow-visible">
          <div className="relative flex items-end justify-start min-h-[380px]">
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
        <p className="relative z-10 mt-6 mb-6 px-6 text-center text-2xl font-bold leading-snug text-slate-800">
          Hidden Monkeys of
          <br />
          Upper Thomson MRT
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3 pt-5">
        <Link
          href="/zones"
          className="mh-btn-duo mh-btn-bounce flex min-h-14 items-center justify-center rounded-2xl bg-jungle px-4 py-4 text-base font-extrabold uppercase tracking-wide text-white"
        >
          Start Now
        </Link>
        <Link
          href="/faq"
          className="mt-1 text-center text-lg font-semibold text-slate-600"
        >
          How to play?
        </Link>
      </div>
    </div>
  );
}

