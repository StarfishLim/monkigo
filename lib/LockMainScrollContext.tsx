import React, { createContext, useContext, useState, useCallback } from "react";

type LockMainScrollContextValue = {
  lockMainScroll: boolean;
  setLockMainScroll: (lock: boolean) => void;
};

const LockMainScrollContext = createContext<LockMainScrollContextValue | null>(null);

export function LockMainScrollProvider({ children }: { children: React.ReactNode }) {
  const [lockMainScroll, setLockMainScroll] = useState(false);
  return (
    <LockMainScrollContext.Provider value={{ lockMainScroll, setLockMainScroll }}>
      {children}
    </LockMainScrollContext.Provider>
  );
}

export function useLockMainScroll() {
  const ctx = useContext(LockMainScrollContext);
  return ctx;
}
