"use client";

import { useCallback, useRef, useState } from "react";
import { isClear, isMatrix, resolveCommand, themeTarget } from "@/lib/commands";
import { triggerDownload } from "@/lib/download";
import { portfolio } from "@/lib/portfolio";
import { asset } from "@/lib/site";
import type { HistoryEntry } from "@/lib/history";
import type { Theme } from "@/hooks/useTheme";
import { useCommandHistory } from "@/hooks/useCommandHistory";

interface ShellDeps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  scrollToBottom: () => void;
}

export function useTerminalShell({ theme, setTheme, scrollToBottom }: ShellDeps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [matrixActive, setMatrixActive] = useState(false);
  const idRef = useRef(0);
  const commandHistory = useCommandHistory();

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const key = cmd.toLowerCase();

      if (cmd) commandHistory.push(cmd);

      if (isClear(key)) {
        setHistory([]);
        return;
      }

      const echo: HistoryEntry = { id: nextId(), kind: "input", input: cmd };

      const theming = themeTarget(key);
      if (theming) {
        const next: Theme = theming === "toggle" ? (theme === "dark" ? "light" : "dark") : theming;
        setTheme(next);
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "theme", theme: next } }]);
        scrollToBottom();
        return;
      }

      if (isMatrix(key)) {
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "matrix" } }]);
        setMatrixActive(true);
        scrollToBottom();
        return;
      }

      if (key === "") {
        setHistory((prev) => [...prev, echo]);
        scrollToBottom();
        return;
      }

      const name = resolveCommand(key);
      setHistory((prev) => [
        ...prev,
        echo,
        name
          ? { id: nextId(), kind: "output", spec: { type: "command", name } }
          : { id: nextId(), kind: "output", spec: { type: "notfound", cmd } },
      ]);
      scrollToBottom();

      if (key === "resume") {
        window.setTimeout(() => triggerDownload(asset(portfolio.contact.cv)), 200);
      }
    },
    [commandHistory, nextId, scrollToBottom, setTheme, theme],
  );

  const exitMatrix = useCallback(() => setMatrixActive(false), []);

  const clear = useCallback(() => setHistory([]), []);

  const showWelcome = useCallback(() => {
    setHistory((prev) =>
      prev.length ? prev : [{ id: nextId(), kind: "output", spec: { type: "command", name: "welcome" } }],
    );
  }, [nextId]);

  return { history, run, clear, showWelcome, matrixActive, exitMatrix, commandHistory };
}
