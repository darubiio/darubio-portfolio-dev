"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persistedState";

export type Theme = "dark" | "light";

const store = createPersistedStore<Theme>(
  "rubio-theme",
  "dark",
  (raw) => (raw === "light" ? "light" : "dark"),
  (theme) => document.documentElement.setAttribute("data-theme", theme),
);

export function useTheme() {
  const theme = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const setTheme = useCallback((next: Theme) => store.set(next), []);
  const toggleTheme = useCallback(() => store.set(store.getSnapshot() === "dark" ? "light" : "dark"), []);

  return { theme, setTheme, toggleTheme };
}
