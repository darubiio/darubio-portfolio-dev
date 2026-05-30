"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { TerminalProvider, type TerminalActions } from "@/context/TerminalContext";
import { AmbientBackground } from "@/components/terminal/AmbientBackground";
import { TitleBar } from "@/components/terminal/TitleBar";
import { BootLog } from "@/components/terminal/BootLog";
import { HistoryView } from "@/components/terminal/HistoryView";
import { CommandPalette } from "@/components/terminal/CommandPalette";
import { InputLine } from "@/components/terminal/InputLine";
import { Lightbox } from "@/components/terminal/Lightbox";
import { MatrixRain } from "@/components/terminal/MatrixRain";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useTerminalShell } from "@/hooks/useTerminalShell";

export function Terminal() {
  const { theme, setTheme } = useTheme();
  const { sound, toggleSound, playKey } = useSound();
  const { ref: termRef, scrollToBottom } = useAutoScroll<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<StaticImageData | null>(null);

  const shell = useTerminalShell({ theme, setTheme, scrollToBottom });
  const { history, run, clear, showWelcome, matrixActive, exitMatrix, commandHistory } = shell;

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const onReady = useCallback(() => {
    showWelcome();
    scrollToBottom();
    window.setTimeout(focusInput, 40);
  }, [showWelcome, scrollToBottom, focusInput]);

  const { bootLines, booting, skipNow } = useBootSequence(onReady);

  const runCommand = useCallback(
    (command: string) => {
      skipNow();
      run(command);
      focusInput();
    },
    [skipNow, run, focusInput],
  );

  const actions = useMemo<TerminalActions>(
    () => ({ run: runCommand, openLightbox: setLightbox }),
    [runCommand],
  );

  useEffect(() => {
    scrollToBottom();
  }, [bootLines, history, scrollToBottom]);

  return (
    <TerminalProvider value={actions}>
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
          {!booting && <CommandPalette playKey={playKey} />}
          <InputLine
            inputRef={inputRef}
            run={runCommand}
            clear={clear}
            playKey={playKey}
            commandHistory={commandHistory}
          />
        </div>
      </div>
      {matrixActive && <MatrixRain onExit={exitMatrix} />}
      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </TerminalProvider>
  );
}
