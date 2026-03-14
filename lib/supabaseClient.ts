import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const createBrowserSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export const useSupabase = (): SupabaseClient => {
  const client = useContext(SupabaseContext);
  if (!client) {
    throw new Error("Supabase client is not available in context");
  }
  return client;
};

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export type Zone = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Monkey = {
  id: string;
  zone_id: string;
  /** If set, this monkey appears in all these zones; collect once = collected in every zone. */
  zone_ids?: string[];
  name: string;
  number: number;
  artworkUrl: string;
  clue: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  icon: string;
};

/** True if this monkey is shown in the given zone (primary zone or in zone_ids). */
export function monkeyBelongsToZone(monkey: Monkey, zoneId: string): boolean {
  if (monkey.zone_id === zoneId) return true;
  if (monkey.zone_ids && monkey.zone_ids.includes(zoneId)) return true;
  return false;
}

export type UserProgress = {
  id: string;
  user_id: string;
  monkey_id: string;
  unlocked_at: string;
};

