"use client";

import { createContext, use } from "react";
import type { StaticImageData } from "next/image";

export interface TerminalActions {
  run: (command: string) => void;
  openLightbox: (image: StaticImageData) => void;
}

export const TerminalContext = createContext<TerminalActions | null>(null);

export function useTerminal(): TerminalActions {
  const ctx = use(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within a TerminalContext provider");
  return ctx;
}
