import Link from "next/link";
import { useEffect, useState } from "react";
import { mockMonkeys } from "../lib/mockData";
import { getLocalUnlockedMonkeyIds } from "../lib/progress";

export const Navbar = () => {
  const [unlocked, setUnlocked] = useState(0);
  const total = mockMonkeys.length;

  useEffect(() => {
    const load = () => setUnlocked(getLocalUnlockedMonkeyIds().length);
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/60 bg-cream-light/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 rounded-2xl py-1.5 pr-2 transition active:scale-95">
          <span className="text-2xl">🐒</span>
          <span className="text-lg font-bold text-slate-800">Monkey Hunt</span>
        </Link>
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 shadow-soft">
          <span className="text-xl leading-none">🐵</span>
          <span className="text-sm font-bold text-jungle-dark">
            {unlocked === 0 ? "Get the unlock monkey" : `${unlocked}/${total}`}
          </span>
        </div>
      </nav>
    </header>
  );
};

