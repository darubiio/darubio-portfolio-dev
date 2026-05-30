"use client";

import { useCallback, useRef } from "react";

export function useCommandHistory() {
  const entries = useRef<string[]>([]);
  const index = useRef<number>(0);

  const push = useCallback((command: string) => {
    entries.current.push(command);
    index.current = entries.current.length;
  }, []);

  const previous = useCallback((): string | null => {
    if (!entries.current.length) return null;
    index.current = Math.max(0, index.current - 1);
    return entries.current[index.current] ?? "";
  }, []);

  const next = useCallback((): string | null => {
    if (!entries.current.length) return null;
    index.current = Math.min(entries.current.length, index.current + 1);
    return entries.current[index.current] ?? "";
  }, []);

  return { push, previous, next };
}
