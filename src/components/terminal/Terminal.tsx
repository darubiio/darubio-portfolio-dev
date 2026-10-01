"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";
import { TerminalContext, type TerminalActions } from "@/context/TerminalContext";
import { AmbientBackground } from "@/components/terminal/AmbientBackground";
import { GlassFilter } from "@/components/terminal/GlassFilter";
import { TitleBar } from "@/components/terminal/TitleBar";
import { BootLog } from "@/components/terminal/BootLog";
import { HistoryView } from "@/components/terminal/HistoryView";
import { CommandPalette } from "@/components/terminal/CommandPalette";
import { LangHint } from "@/components/terminal/LangHint";
import { InputLine } from "@/components/terminal/InputLine";
import { Lightbox } from "@/components/terminal/Lightbox";
import { readInitialCommand } from "@/lib/deeplink";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { useSound } from "@/hooks/useSound";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useTerminalShell } from "@/hooks/useTerminalShell";

const MatrixRain = dynamic(
  () => import("@/components/terminal/MatrixRain").then((mod) => mod.MatrixRain),
  { ssr: false },
);

export function Terminal() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();
  const t = useMessages();
  const { sound, toggleSound, playKey } = useSound();
  const { ref: termRef, scrollToBottom } = useAutoScroll<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<StaticImageData | null>(null);

  const shell = useTerminalShell({ theme, setTheme, lang, setLang });
  const { history, run, clear, showWelcome, matrixActive, exitMatrix, commandHistory } = shell;

  const focusInput = () => inputRef.current?.focus();

  const onReady = () => {
    const initial = readInitialCommand();
    if (initial) run(initial);
    else showWelcome();
    scrollToBottom();
    window.setTimeout(focusInput, 40);
  };

  const { bootLines, booting, skipNow } = useBootSequence(onReady, t.boot);

  const runCommand = (command: string) => {
    skipNow();
    run(command);
    focusInput();
  };

  const actions: TerminalActions = { run: runCommand, openLightbox: setLightbox };

  useEffect(() => {
    scrollToBottom();
  }, [bootLines, history, scrollToBottom]);

  return (
    <TerminalContext value={actions}>
      <AmbientBackground />
      <div className="stage" onClick={focusInput}>
        <div className="window" ref={windowRef} onClick={(event) => event.stopPropagation()}>
          <TitleBar
            booting={booting}
            sound={sound}
            theme={theme}
            lang={lang}
            onToggleSound={toggleSound}
            onToggleTheme={() => runCommand("theme")}
            onToggleLang={() => runCommand("lang")}
          />
          <div className="term" ref={termRef} onClick={focusInput}>
            <BootLog bootLines={bootLines} booting={booting} />
            <HistoryView history={history} />
            {booting ? null : <LangHint />}
          </div>
          {booting ? null : <CommandPalette playKey={playKey} />}
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
