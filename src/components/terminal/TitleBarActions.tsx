"use client";

import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";

interface TitleBarActionsProps {
  sound: boolean;
  theme: Theme;
  lang: Lang;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
}

export function TitleBarActions({ sound, theme, lang, onToggleSound, onToggleTheme, onToggleLang }: TitleBarActionsProps) {
  return (
    <div className="tb-actions">
      <button
        type="button"
        className="tb-btn tb-lang"
        title={lang === "en" ? "cambiar a español" : "switch to English"}
        aria-label={lang === "en" ? "Switch language to Spanish" : "Switch language to English"}
        onClick={onToggleLang}
      >
        <span className={lang === "en" ? "on" : undefined}>EN</span>
        <span className="sep">/</span>
        <span className={lang === "es" ? "on" : undefined}>ES</span>
      </button>
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
