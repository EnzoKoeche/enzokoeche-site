"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import type { Bi, Lang } from "@/lib/content";

const STORAGE_KEY = "ekc-lang";

/**
 * Language lives in a tiny external store rather than in component state.
 * useSyncExternalStore gives us the one thing plain useState can't: a server
 * snapshot ("pt") that hydrates cleanly, then an immediate swap to whatever the
 * visitor actually stored or their browser prefers — no effect, no flash of
 * mismatched markup.
 */
const listeners = new Set<() => void>();
let current: Lang | null = null;

function resolve(): Lang {
  if (current) return current;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "pt" || stored === "en") {
      current = stored;
      return current;
    }
  } catch {
    // private mode / storage disabled — fall through to the browser preference
  }
  current = navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
  return current;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getServerSnapshot(): Lang {
  return "pt";
}

function write(next: Lang) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // non-fatal: the choice just won't survive a reload
  }
  listeners.forEach((f) => f());
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** pick the current language out of a bilingual value */
  t: <T>(v: Record<Lang, T>) => T;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, resolve, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => write(l), []);
  const toggle = useCallback(() => write(resolve() === "pt" ? "en" : "pt"), []);
  const t = useCallback(<T,>(v: Record<Lang, T>) => v[lang], [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** Convenience for the common `Bi` case. */
export function useT() {
  return useLang().t as (v: Bi) => string;
}
