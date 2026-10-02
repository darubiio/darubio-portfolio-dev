"use client";

import { useTerminal } from "@/context/TerminalContext";
import { useMessages } from "@/hooks/useMessages";

interface PaletteButton {
  command: string;
  icon: string;
  variant?: "cv" | "ai";
  /** Visible label when it differs from the command (and needs translating). */
  label?: "ai";
  /** Dropped on small screens so the palette keeps to two rows. */
  desktopOnly?: boolean;
}

const BUTTONS: ReadonlyArray<PaletteButton> = [
  { command: "ask", icon: "✦", variant: "ai", label: "ai" },
  { command: "about", icon: "◆" },
  { command: "experience", icon: "❯" },
  { command: "projects", icon: "▤" },
  { command: "skills", icon: "⚙" },
  { command: "contact", icon: "✉" },
  { command: "resume", icon: "↓", variant: "cv" },
  { command: "neofetch", icon: "✦", desktopOnly: true },
  { command: "help", icon: "?" },
];

export function CommandPalette({ playKey }: { playKey: () => void }) {
  const { run } = useTerminal();
  const t = useMessages();

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
        {t.palette.hint}
      </div>
      <div className="cmd-row">
        {BUTTONS.map(({ command, icon, variant, label, desktopOnly }) => (
          <button
            key={command}
            type="button"
            className={["cbtn", variant, desktopOnly && "desktop-only"].filter(Boolean).join(" ")}
            onClick={() => activate(command)}
          >
            <span className="ic">{icon}</span>
            {label ? t.palette[label] : command}
          </button>
        ))}
      </div>
    </div>
  );
}
