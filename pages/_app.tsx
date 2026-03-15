import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createBrowserSupabaseClient, isSupabaseConfigured, SupabaseContext } from "../lib/supabaseClient";
import { LockMainScrollProvider, useLockMainScroll } from "../lib/LockMainScrollContext";
import { BottomNav } from "../components/BottomNav";

function MainContent({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => (isSupabaseConfigured ? createBrowserSupabaseClient() : null));
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const ctx = useLockMainScroll();
  const lockMainScroll = ctx?.lockMainScroll ?? false;

  useEffect(() => {
    setIsReady(true);
  }, []);

  const isLanding = router.pathname === "/";
  const isZoneDetail = router.pathname === "/zones/[zoneId]";
  const isSuccess = router.pathname === "/success";
  const noVerticalScroll = isLanding || lockMainScroll;

  return (
    <SupabaseContext.Provider value={supabase}>
      {/* Fixed viewport: no outer scroll, background stays fixed */}
      <div className="fixed inset-0 flex overflow-hidden bg-slate-200">
        {/* On mobile: full bleed. On desktop: centered phone frame */}
        <div className="flex min-h-full w-full flex-1 items-center justify-center overflow-hidden p-0 sm:p-4">
          {/* Locked mobile screen: full viewport on mobile, max 420px frame on desktop */}
          <div className="relative flex min-h-[100dvh] h-[100dvh] max-h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden rounded-none bg-white shadow-none sm:max-h-[calc(100dvh-2rem)] sm:rounded-[2.25rem] sm:shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
            {/* Main: no vertical scroll on landing or in zone card view; scroll on other pages */}
            <main
              className={
                "flex min-h-0 w-full flex-1 flex-col gap-4 overflow-x-hidden overscroll-contain pb-28 " +
                (noVerticalScroll ? "overflow-y-hidden px-0" : "overflow-y-auto px-4")
              }
            >
              {!isSupabaseConfigured ? (
                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-banana-dark/30">
                  <h1 className="text-lg font-semibold text-slate-900">Supabase not configured</h1>
                  <p className="mt-2 text-sm text-slate-700">
                    Add <code className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                    <code className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
                    <code className="font-semibold">.env.local</code>, then restart the dev server.
                  </p>
                  <p className="mt-3 text-xs text-slate-600">
                    You can still browse zones and play offline; progress is saved locally.
                  </p>
                </div>
              ) : (
                isReady && <Component {...pageProps} />
              )}
            </main>

            {!isLanding && !isZoneDetail && !isSuccess && <BottomNav />}
          </div>
        </div>
      </div>
    </SupabaseContext.Provider>
  );
}

export default function MonkeyHuntApp(props: AppProps) {
  return (
    <LockMainScrollProvider>
      <MainContent {...props} />
    </LockMainScrollProvider>
  );
}

