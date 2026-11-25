"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DamageGlassId } from "@/lib/glass";

interface Ctx {
  selected: DamageGlassId | null;
  select: (id: DamageGlassId | null) => void;
  /** Selecteert (optioneel) een ruit en scrollt naar het schadeformulier. */
  startRequest: (id?: DamageGlassId | null) => void;
}

const GlassSelectionContext = createContext<Ctx | null>(null);

export function GlassSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<DamageGlassId | null>(null);

  const startRequest = useCallback((id?: DamageGlassId | null) => {
    if (id) setSelected(id);
    const el = document.getElementById("schade");
    if (el) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => {
        const focusTarget = el.querySelector<HTMLElement>("[data-form-focus]");
        focusTarget?.focus({ preventScroll: true });
      }, reduce ? 0 : 700);
    }
  }, []);

  const value = useMemo(() => ({ selected, select: setSelected, startRequest }), [selected, startRequest]);
  return <GlassSelectionContext.Provider value={value}>{children}</GlassSelectionContext.Provider>;
}

export function useGlassSelection() {
  const ctx = useContext(GlassSelectionContext);
  if (!ctx) throw new Error("useGlassSelection moet binnen GlassSelectionProvider worden gebruikt");
  return ctx;
}
