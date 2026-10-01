"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persistedState";
import { DEFAULT_LANG, decodeLang, type Lang } from "@/lib/i18n/types";

const store = createPersistedStore<Lang>(
  "rubio-lang",
  DEFAULT_LANG,
  decodeLang,
  (lang) => document.documentElement.setAttribute("lang", lang),
);

export function useLang() {
  const lang = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const setLang = useCallback((next: Lang) => store.set(next), []);
  const toggleLang = useCallback(() => store.set(store.getSnapshot() === "en" ? "es" : "en"), []);

  return { lang, setLang, toggleLang };
}
