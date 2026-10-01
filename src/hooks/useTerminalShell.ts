"use client";

import { useCallback, useRef, useState } from "react";
import { isClear, isMatrix, langTarget, parseAsk, resolveCommand, themeTarget } from "@/lib/commands";
import { syncCommandToUrl } from "@/lib/deeplink";
import { triggerDownload } from "@/lib/download";
import { portfolio } from "@/lib/portfolio";
import { asset } from "@/lib/site";
import type { HistoryEntry } from "@/lib/history";
import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";
import { useCommandHistory } from "@/hooks/useCommandHistory";

interface ShellDeps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export function useTerminalShell({ theme, setTheme, lang, setLang }: ShellDeps) {
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
        syncCommandToUrl(null);
        return;
      }

      const echo: HistoryEntry = { id: nextId(), kind: "input", input: cmd };

      const theming = themeTarget(key);
      if (theming) {
        const next: Theme = theming === "toggle" ? (theme === "dark" ? "light" : "dark") : theming;
        setTheme(next);
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "theme", theme: next } }]);
        return;
      }

      const langing = langTarget(key);
      if (langing) {
        const next: Lang = langing === "toggle" ? (lang === "en" ? "es" : "en") : langing;
        setLang(next);
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "lang", lang: next } }]);
        return;
      }

      if (isMatrix(key)) {
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "matrix" } }]);
        setMatrixActive(true);
        return;
      }

      if (key === "") {
        setHistory((prev) => [...prev, echo]);
        return;
      }

      const askDefault =
        lang === "es" ? "¿Qué debería saber un reclutador sobre Daniel?" : "What should a recruiter know about Daniel?";
      const askQuestion = parseAsk(cmd) ?? (key === "ask" ? askDefault : null);
      if (askQuestion !== null) {
        const question = askQuestion.slice(0, 200);
        setHistory((prev) => [...prev, echo, { id: nextId(), kind: "output", spec: { type: "ask", question } }]);
        return;
      }

      const name = resolveCommand(key);
      if (name) syncCommandToUrl(name);
      setHistory((prev) => [
        ...prev,
        echo,
        name
          ? { id: nextId(), kind: "output", spec: { type: "command", name } }
          : { id: nextId(), kind: "output", spec: { type: "notfound", cmd } },
      ]);

      if (key === "resume") {
        window.setTimeout(() => triggerDownload(asset(portfolio.contact.cv)), 200);
      }
    },
    [commandHistory, nextId, setTheme, theme, setLang, lang],
  );

  const exitMatrix = useCallback(() => setMatrixActive(false), []);

  const clear = useCallback(() => setHistory([]), []);

  const showWelcome = useCallback(() => {
    setHistory((prev) =>
      prev.length
        ? prev
        : [
            { id: nextId(), kind: "output", spec: { type: "command", name: "welcome" } },
            { id: nextId(), kind: "output", spec: { type: "command", name: "stats" } },
          ],
    );
  }, [nextId]);

  return { history, run, clear, showWelcome, matrixActive, exitMatrix, commandHistory };
}
