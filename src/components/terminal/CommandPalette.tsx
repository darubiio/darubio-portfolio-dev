"use client";

import { useTerminal } from "@/context/TerminalContext";

interface PaletteButton {
  command: string;
  icon: string;
  variant?: "cv";
}

const BUTTONS: ReadonlyArray<PaletteButton> = [
  { command: "about", icon: "◆" },
  { command: "experience", icon: "❯" },
  { command: "projects", icon: "▤" },
  { command: "skills", icon: "⚙" },
  { command: "contact", icon: "✉" },
  { command: "resume", icon: "↓", variant: "cv" },
  { command: "neofetch", icon: "✦" },
  { command: "help", icon: "?" },
];

export function CommandPalette({ playKey }: { playKey: () => void }) {
  const { run } = useTerminal();

  const activate = (command: string) => {
    playKey();
    run(command);
  };

  return (
    <div className="palette">
      <div className="hint">
        <span className="status-pill">
          <span className="dot" />
        </span>{" "}
        not a terminal person? just click ↓
      </div>
      <div className="cmd-row">
        {BUTTONS.map(({ command, icon, variant }) => (
          <button
            key={command}
            type="button"
            className={variant === "cv" ? "cbtn cv" : "cbtn"}
            onClick={() => activate(command)}
          >
            <span className="ic">{icon}</span>
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
