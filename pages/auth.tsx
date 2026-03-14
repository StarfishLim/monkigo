import { FormEvent, useState } from "react";
import { useSupabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

type Mode = "login" | "signup";

export default function AuthPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage("Account created. If email confirmation is enabled, check your inbox.");
      }
      router.push("/zones");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "login" ? "Welcome back, explorer" : "Join Monkey Hunt"}
        </h1>
        <p className="text-sm text-slate-700">
          Create an account or log in to sync your monkey discoveries with Supabase.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded-2xl border border-banana-dark/40 bg-banana-light px-3 py-2 text-sm focus:border-jungle focus:outline-none focus:ring-1 focus:ring-jungle"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            minLength={6}
            required
            className="w-full rounded-2xl border border-banana-dark/40 bg-banana-light px-3 py-2 text-sm focus:border-jungle focus:outline-none focus:ring-1 focus:ring-jungle"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {message && <p className="text-xs text-slate-600">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-jungle px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-jungle-dark/40 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-center text-xs font-medium text-jungle-dark"
      >
        {mode === "login"
          ? "New here? Create a Monkey Hunt account"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}

