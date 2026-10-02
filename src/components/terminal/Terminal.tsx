"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";
import { TerminalContext, type TerminalActions } from "@/context/TerminalContext";
import { AmbientBackground } from "@/components/terminal/AmbientBackground";
import { GlassFilter } from "@/components/terminal/GlassFilter";
import { TitleBar } from "@/components/terminal/TitleBar";
import { HistoryView } from "@/components/terminal/HistoryView";
import { CommandPalette } from "@/components/terminal/CommandPalette";
import { Lightbox } from "@/components/terminal/Lightbox";
import { LangHint } from "@/components/terminal/LangHint";
import { InputLine } from "@/components/terminal/InputLine";
import { readInitialCommand } from "@/lib/deeplink";
import { commandLabel } from "@/lib/commands";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/hooks/useLang";
import { useSound } from "@/hooks/useSound";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useTerminalShell } from "@/hooks/useTerminalShell";

const MatrixRain = dynamic(
  () => import("@/components/terminal/MatrixRain").then((mod) => mod.MatrixRain),
  { ssr: false },
);

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true afterwards: gates UI that reads browser-only state. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function Terminal() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { sound, toggleSound, playKey } = useSound();
  const { ref: termRef, scrollToLatest } = useAutoScroll<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<StaticImageData | null>(null);

  const shell = useTerminalShell({ theme, setTheme, lang, setLang });
  const { history, atLanding, run, clear, matrixActive, exitMatrix, commandHistory, chatMode, rememberAiTurn } = shell;

  // On touch devices focusing the input pops the virtual keyboard, so only the
  // input bar itself (or a real command) may focus it; pointer devices keep the
  // "click anywhere to type" behaviour.
  const focusInput = () => {
    if (matchMedia("(hover: none)").matches) return;
    inputRef.current?.focus();
  };

  const hydrated = useHydrated();

  // The landing view is server-rendered; a `?cmd=` deep-link replaces it with that command.
  const onMount = useEffectEvent(() => {
    const initial = readInitialCommand();
    if (initial) {
      clear();
      run(commandLabel(initial, lang));
    }
    focusInput();
  });

  useEffect(() => {
    onMount();
  }, []);

  const runCommand = (command: string) => {
    run(command);
    focusInput();
  };

  const actions: TerminalActions = { run: runCommand, openLightbox: setLightbox, chatMode, rememberAiTurn };

  // The landing view is read from the top; each new command scrolls its echo to the top of the view.
  useEffect(() => {
    if (!atLanding) scrollToLatest();
  }, [atLanding, history, scrollToLatest]);

  return (
    <TerminalContext value={actions}>
      <AmbientBackground />
      <div className="stage" onClick={focusInput}>
        <div className="window" ref={windowRef} onClick={(event) => event.stopPropagation()}>
          <TitleBar
            sound={sound}
            theme={theme}
            lang={lang}
            onToggleSound={toggleSound}
            onToggleTheme={() => runCommand("theme")}
            onToggleLang={() => runCommand("lang")}
          />
          <div className="term" ref={termRef} onClick={focusInput}>
            <HistoryView history={history} />
            {hydrated ? <LangHint /> : null}
          </div>
          <CommandPalette playKey={playKey} />
          <InputLine
            inputRef={inputRef}
            run={runCommand}
            clear={clear}
            playKey={playKey}
            commandHistory={commandHistory}
          />
        </div>
      </div>
      {/* After the window so its ref is attached before this layout effect runs. */}
      <GlassFilter target={windowRef} />
      {matrixActive ? <MatrixRain onExit={exitMatrix} /> : null}
      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </TerminalContext>
  );
}
