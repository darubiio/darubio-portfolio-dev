"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";
import { TerminalContext, type TerminalActions } from "@/context/TerminalContext";
import { AmbientBackground } from "@/components/terminal/AmbientBackground";
import { TitleBar } from "@/components/terminal/TitleBar";
import { BootLog } from "@/components/terminal/BootLog";
import { HistoryView } from "@/components/terminal/HistoryView";
import { CommandPalette } from "@/components/terminal/CommandPalette";
import { InputLine } from "@/components/terminal/InputLine";
import { Lightbox } from "@/components/terminal/Lightbox";
import { useTheme } from "@/hooks/useTheme";
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
  const { sound, toggleSound, playKey } = useSound();
  const { ref: termRef, scrollToBottom } = useAutoScroll<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<StaticImageData | null>(null);

  const shell = useTerminalShell({ theme, setTheme });
  const { history, run, clear, showWelcome, matrixActive, exitMatrix, commandHistory } = shell;

  const focusInput = () => inputRef.current?.focus();

  const onReady = () => {
    showWelcome();
    scrollToBottom();
    window.setTimeout(focusInput, 40);
  };

  const { bootLines, booting, skipNow } = useBootSequence(onReady);

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
        <div className="window" onClick={(event) => event.stopPropagation()}>
          <TitleBar
            booting={booting}
            sound={sound}
            theme={theme}
            onToggleSound={toggleSound}
            onToggleTheme={() => runCommand("theme")}
          />
          <div className="term" ref={termRef} onClick={focusInput}>
            <BootLog bootLines={bootLines} booting={booting} />
            <HistoryView history={history} />
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
      {matrixActive ? <MatrixRain onExit={exitMatrix} /> : null}
      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </TerminalContext>
  );
}
