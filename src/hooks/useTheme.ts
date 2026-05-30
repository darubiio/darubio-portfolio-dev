"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "rubio-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setTheme(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, hydrated]);

  const setThemeTo = useCallback((next: Theme) => setTheme(next), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return { theme, setTheme: setThemeTo, toggleTheme };
}
