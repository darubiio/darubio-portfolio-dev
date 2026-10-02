"use client";

import { useCallback } from "react";
import { useLang } from "@/hooks/useLang";
import { commandLabel } from "@/lib/commands";

/** Maps an (English) command to the name shown and typed in the current language. */
export function useCommandLabel() {
  const { lang } = useLang();
  return useCallback((command: string) => commandLabel(command, lang), [lang]);
}
