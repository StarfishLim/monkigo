import type { SupabaseClient } from "@supabase/supabase-js";

export const LOCAL_PROGRESS_KEY = "monkey-hunt-progress";

export function getLocalUnlockedMonkeyIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
  if (!raw) return [];
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function setLocalUnlockedMonkeyIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event("monkey-progress-updated"));
}

export function addLocalUnlockedMonkeyId(monkeyId: string) {
  const ids = getLocalUnlockedMonkeyIds();
  if (!ids.includes(monkeyId)) ids.push(monkeyId);
  setLocalUnlockedMonkeyIds(ids);
}

export async function fetchUnlockedMonkeyIdsFromSupabase(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return [];

  const { data: rows, error } = await supabase
    .from("user_progress")
    .select("monkey_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return (rows ?? []).map((r: any) => r.monkey_id).filter(Boolean);
}

export async function syncLocalFromSupabase(supabase: SupabaseClient): Promise<string[]> {
  const ids = await fetchUnlockedMonkeyIdsFromSupabase(supabase);
  setLocalUnlockedMonkeyIds(ids);
  return ids;
}

export async function unlockMonkey(supabase: SupabaseClient, monkeyId: string) {
  addLocalUnlockedMonkeyId(monkeyId);

  // Best-effort Supabase sync
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        monkey_id: monkeyId,
        unlocked_at: new Date().toISOString()
      },
      { onConflict: "user_id,monkey_id" }
    );
    if (error) throw error;
  } catch {
    // ignore; local progress still works
  }
}

