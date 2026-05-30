"use client";

import type { Theme } from "@/hooks/useTheme";

interface TitleBarActionsProps {
  sound: boolean;
  theme: Theme;
  onToggleSound: () => void;
  onToggleTheme: () => void;
}

export function TitleBarActions({ sound, theme, onToggleSound, onToggleTheme }: TitleBarActionsProps) {
  return (
    <div className="tb-actions">
      <button
        type="button"
        className={sound ? "tb-btn active" : "tb-btn"}
        title="key sounds"
        aria-label="Toggle key sounds"
        aria-pressed={sound}
        onClick={onToggleSound}
      >
        {sound ? "♪" : "♪̶"}
      </button>
      <button type="button" className="tb-btn" title="toggle theme" aria-label="Toggle theme" onClick={onToggleTheme}>
        {theme === "dark" ? "☾" : "☀"}
      </button>
    </div>
  );
}
