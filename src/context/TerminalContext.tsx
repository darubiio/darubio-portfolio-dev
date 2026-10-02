"use client";

import { createContext, use } from "react";
import type { StaticImageData } from "next/image";

export interface TerminalActions {
  run: (command: string) => void;
  /**
   * Quick-access buttons: scrolls to the section if that command's output is already on
   * screen instead of printing it again; otherwise runs it like `run`.
   */
  open: (command: string) => void;
  openLightbox: (image: StaticImageData) => void;
  /** `ask` with no argument toggles this: every typed line becomes a question. */
  chatMode: boolean;
  /** Called by the AI output when an answer completes, so follow-ups get context. */
  rememberAiTurn: (question: string, answer: string) => void;
}

export const TerminalContext = createContext<TerminalActions | null>(null);

export function useTerminal(): TerminalActions {
  const ctx = use(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within a TerminalContext provider");
  return ctx;
}
