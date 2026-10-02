"use client";

import type { CSSProperties } from "react";
import { useTerminal } from "@/context/TerminalContext";
import { useMessages } from "@/hooks/useMessages";
import { useCommandLabel } from "@/hooks/useCommandLabel";

interface PaletteButton {
  command: string;
  icon: string;
  variant?: "cv" | "ai";
  /** Visible label when it differs from the command (and needs translating). */
  text?: "ai";
  /** Dropped on small screens so the palette keeps to two rows. */
  desktopOnly?: boolean;
}

const BUTTONS: ReadonlyArray<PaletteButton> = [
  { command: "ask", icon: "✦", variant: "ai", text: "ai" },
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
  const { open } = useTerminal();
  const t = useMessages();
  const label = useCommandLabel();

  const activate = (command: string) => {
    playKey();
    open(command);
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
        {BUTTONS.map(({ command, icon, variant, text, desktopOnly }, index) => (
          <button
            key={command}
            type="button"
            className={["cbtn", variant, desktopOnly && "desktop-only"].filter(Boolean).join(" ")}
            style={{ "--i": index } as CSSProperties}
            onClick={() => activate(command)}
          >
            <span className="ic">{icon}</span>
            {text ? t.palette[text] : label(command)}
          </button>
        ))}
      </div>
    </div>
  );
}
