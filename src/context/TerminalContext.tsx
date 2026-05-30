"use client";

import { createContext, useContext } from "react";
import type { StaticImageData } from "next/image";

export interface TerminalActions {
  run: (command: string) => void;
  openLightbox: (image: StaticImageData) => void;
}

const TerminalContext = createContext<TerminalActions | null>(null);

export const TerminalProvider = TerminalContext.Provider;

export function useTerminal(): TerminalActions {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within a TerminalProvider");
  return ctx;
}
