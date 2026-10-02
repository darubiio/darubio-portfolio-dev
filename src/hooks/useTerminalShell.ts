"use client";

import { useCallback, useRef, useState } from "react";
import {
  isClear,
  isMatrix,
  langTarget,
  looksLikeQuestion,
  parseAsk,
  parseFit,
  resolveCommand,
  suggestCommand,
  themeTarget,
} from "@/lib/commands";
import { syncCommandToUrl } from "@/lib/deeplink";
import { triggerDownload } from "@/lib/download";
import { portfolio } from "@/lib/portfolio";
import { asset } from "@/lib/site";
import { messages } from "@/lib/i18n/messages";
import type { HistoryEntry, OutputSpec } from "@/lib/history";
import type { Turn } from "@/lib/ai/protocol";
import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";
import { useCommandHistory } from "@/hooks/useCommandHistory";

interface ShellDeps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const ASK_MAX = 200;
const FIT_MAX = 3000;
const MEMORY_TURNS = 6;
const MEMORY_CHARS = 400;

/** Server-rendered landing view: who I am, then the bio. `instant` skips the fade-in so it paints immediately. */
const LANDING: HistoryEntry[] = [
  { id: 1, kind: "output", spec: { type: "command", name: "welcome" }, instant: true },
  { id: 2, kind: "output", spec: { type: "command", name: "about" }, instant: true },
];

export function useTerminalShell({ theme, setTheme, lang, setLang }: ShellDeps) {
  const [history, setHistory] = useState<HistoryEntry[]>(LANDING);
  const [matrixActive, setMatrixActive] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const idRef = useRef(LANDING.length);
  // Last few AI turns, sent with each question so follow-ups keep their context.
  const aiHistoryRef = useRef<Turn[]>([]);
  const commandHistory = useCommandHistory();

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

  const rememberAiTurn = useCallback((question: string, answer: string) => {
    aiHistoryRef.current = [
      ...aiHistoryRef.current,
      { role: "user" as const, content: question.slice(0, MEMORY_CHARS) },
      { role: "assistant" as const, content: answer.slice(0, MEMORY_CHARS) },
    ].slice(-MEMORY_TURNS);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const key = cmd.toLowerCase();
      const t = messages[lang];

      if (cmd) commandHistory.push(cmd);

      if (isClear(key)) {
        setHistory([]);
        syncCommandToUrl(null);
        return;
      }

      const echo: HistoryEntry = { id: nextId(), kind: "input", input: cmd, prompt: chatMode ? "ai" : "shell" };
      const push = (...specs: OutputSpec[]) =>
        setHistory((prev) => [...prev, echo, ...specs.map((spec) => ({ id: nextId(), kind: "output" as const, spec }))]);
      const askSpec = (question: string): OutputSpec => ({
        type: "ask",
        question: question.slice(0, ASK_MAX),
        history: aiHistoryRef.current,
        inChat: chatMode,
      });

      const theming = themeTarget(key);
      if (theming) {
        const next: Theme = theming === "toggle" ? (theme === "dark" ? "light" : "dark") : theming;
        setTheme(next);
        push({ type: "theme", theme: next });
        return;
      }

      const langing = langTarget(key);
      if (langing) {
        const next: Lang = langing === "toggle" ? (lang === "en" ? "es" : "en") : langing;
        setLang(next);
        push({ type: "lang", lang: next });
        return;
      }

      if (isMatrix(key)) {
        push({ type: "matrix" });
        setMatrixActive(true);
        return;
      }

      if (key === "") {
        setHistory((prev) => [...prev, echo]);
        return;
      }

      // Chat mode: `ask` alone enters, exit/quit leaves, real commands still run.
      if (key === "ask") {
        setChatMode(true);
        push({ type: "notice", text: t.ask.modeOn });
        return;
      }
      if (chatMode && (key === "exit" || key === "quit")) {
        setChatMode(false);
        push({ type: "notice", text: t.ask.modeOff });
        return;
      }

      const name = resolveCommand(key);
      if (name) {
        syncCommandToUrl(name);
        push({ type: "command", name });
        if (key === "resume") window.setTimeout(() => triggerDownload(asset(portfolio.contact.cv)), 200);
        return;
      }

      const jd = parseFit(cmd);
      if (jd !== null) {
        if (!jd) push({ type: "notice", text: t.fit.hint });
        else push({ type: "fit", jd: jd.slice(0, FIT_MAX) });
        return;
      }

      const asked = parseAsk(cmd);
      if (asked !== null) {
        push(askSpec(asked));
        return;
      }

      // In chat mode, or when the input reads like a sentence, it is a question for the AI.
      if (chatMode || looksLikeQuestion(cmd)) {
        push(askSpec(cmd));
        return;
      }

      push({ type: "notfound", cmd, suggestion: suggestCommand(key) });
    },
    [commandHistory, nextId, setTheme, theme, setLang, lang, chatMode],
  );

  const exitMatrix = useCallback(() => setMatrixActive(false), []);

  const clear = useCallback(() => setHistory([]), []);

  const atLanding = history === LANDING;

  return { history, atLanding, run, clear, matrixActive, exitMatrix, commandHistory, chatMode, rememberAiTurn };
}
