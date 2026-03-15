import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { LOCAL_PROGRESS_KEY } from "../lib/progress";
import faq2Svg from "@ref/assets/faq2.svg";

const navItems = [
  { href: "/zones", label: "Zones", icon: "/zone.svg" },
  { href: "/faq", label: "FAQ", icon: faq2Svg },
  { href: "/feedback", label: "Feedback", icon: "/feedback.svg" }
];

export const BottomNav = () => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRestart = () => {
    setConfirmOpen(true);
  };

  const handleConfirmRestart = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LOCAL_PROGRESS_KEY);
    }
    router.push("/");
    setConfirmOpen(false);
  };

  const handleCancelRestart = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 bg-transparent">
        <div className="mx-auto flex max-w-md items-center justify-center px-4 pb-5 pt-1">
          <div className="flex h-[84px] w-[320px] items-center justify-between gap-3 rounded-full bg-white/95 px-4 py-3 shadow-soft-lg backdrop-blur-md [-webkit-tap-highlight-color:transparent]">
            {navItems.map((item) => {
              const isActive =
                router.pathname === item.href ||
                router.pathname.startsWith(item.href + "/") ||
                (item.href === "/zones" && router.pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={
                    "flex items-center justify-center rounded-2xl p-1.5 transition active:scale-95 " +
                    (isActive ? "bg-jungle/10" : "opacity-70 hover:opacity-100")
                  }
                >
                  <img
                    src={typeof item.icon === "string" ? item.icon : item.icon.src}
                    alt=""
                    className="h-[50px] w-[50px] object-contain"
                  />
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart and go to landing"
              className="flex items-center justify-center rounded-full p-1.5 active:scale-95"
            >
              <img
                src="/icon-restart.svg"
                alt=""
                className="h-[50px] w-[50px] object-contain"
              />
            </button>
          </div>
        </div>
      </nav>

      {confirmOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-soft-lg">
            <p className="text-lg font-bold text-slate-900">Restart your hunt?</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              This will reset your monkey progress for this device.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleCancelRestart}
                className="w-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 active:scale-95"
              >
                Keep progress
              </button>
              <button
                type="button"
                onClick={handleConfirmRestart}
                className="w-1/2 rounded-2xl bg-rose-500 px-3 py-3 text-sm font-bold text-white active:scale-95"
              >
                Reset & restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

