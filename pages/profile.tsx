import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "../components/ProgressBar";
import { mockMonkeys, mockZones } from "../lib/mockData";
import { useSupabase } from "../lib/supabaseClient";
import { getLocalUnlockedMonkeyIds, setLocalUnlockedMonkeyIds } from "../lib/progress";
import { GameCard } from "../components/GameCard";

export default function ProfilePage() {
  const supabase = useSupabase();
  const [email, setEmail] = useState<string | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const total = mockMonkeys.length;
  const completed = unlockedIds.length;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setEmail(data.user?.email ?? null);
      } catch {
        setEmail(null);
      }
    })();
  }, [supabase]);

  const loadLocal = () => {
    if (typeof window === "undefined") return;
    setUnlockedIds(getLocalUnlockedMonkeyIds());
  };

  useEffect(() => {
    loadLocal();
  }, []);

  const unlockedByZone = useMemo(() => {
    const map = new Map<string, number>();
    for (const z of mockZones) map.set(z.id, 0);
    for (const id of unlockedIds) {
      const m = mockMonkeys.find((mm) => mm.id === id);
      if (!m) continue;
      map.set(m.zone_id, (map.get(m.zone_id) ?? 0) + 1);
    }
    return map;
  }, [unlockedIds]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setEmail(null);
    } finally {
      setSyncMessage("Logged out (local progress kept).");
      setTimeout(() => setSyncMessage(null), 2000);
    }
  };

  const handleSyncFromSupabase = async () => {
    setSyncMessage(null);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        setSyncMessage("Log in to sync progress.");
        return;
      }

      const { data: rows, error } = await supabase
        .from("user_progress")
        .select("monkey_id")
        .eq("user_id", user.id);
      if (error) throw error;

      const ids = (rows ?? []).map((r: any) => r.monkey_id).filter(Boolean);
      setLocalUnlockedMonkeyIds(ids);
      loadLocal();
      setSyncMessage("Synced from Supabase.");
    } catch {
      setSyncMessage("Could not sync right now.");
    } finally {
      setTimeout(() => setSyncMessage(null), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <GameCard className="mh-shine">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
          <Link
            href="/auth"
            className="min-h-11 rounded-2xl bg-cream px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft"
          >
            {email ? "Account" : "Sign in"}
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {email ? <>Signed in · {email}</> : "Play offline—sign in to sync"}
        </p>

        <div className="mt-5">
          <ProgressBar completed={completed} total={total} showMonkeyIcons />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSyncFromSupabase}
            className="mh-btn-bounce min-h-12 rounded-2xl bg-jungle/15 px-4 py-3 text-sm font-bold text-jungle-dark"
          >
            Sync
          </button>
          <button
            type="button"
            onClick={loadLocal}
            className="mh-btn-bounce min-h-12 rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-slate-700"
          >
            Refresh
          </button>
        </div>

        {email && (
          <button
            type="button"
            onClick={handleLogout}
            className="mh-btn-bounce mt-2 min-h-12 w-full rounded-2xl bg-slate-700 px-4 py-3 text-sm font-bold text-white"
          >
            Log out
          </button>
        )}
        {syncMessage && <p className="mt-2 text-sm font-semibold text-slate-600">{syncMessage}</p>}
      </GameCard>

      <section className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Keep exploring</p>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mockZones.map((z) => {
            const totalInZone = mockMonkeys.filter((m) => m.zone_id === z.id).length;
            const done = unlockedByZone.get(z.id) ?? 0;
            return (
              <Link
                key={z.id}
                href={`/zones/${z.id}`}
                className="w-[85%] shrink-0 snap-center rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-banana text-2xl ring-1 ring-black/5">
                    {z.icon}
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-900">{z.name}</p>
                    <p className="text-xs text-slate-600">Tap to hunt in this zone</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-jungle-dark">
                    {done}/{totalInZone}
                  </p>
                  <p className="text-xs text-slate-500">collected</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

