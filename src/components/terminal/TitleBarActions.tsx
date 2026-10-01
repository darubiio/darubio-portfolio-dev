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
        onClick={onToggleLang}
      >
        <span aria-hidden>
          <span className={lang === "en" ? "on" : undefined}>EN</span>
          <span className="sep">/</span>
          <span className={lang === "es" ? "on" : undefined}>ES</span>
        </span>
        <span className="sr-only">{lang === "en" ? "Switch language to Spanish" : "Switch language to English"}</span>
      </button>
      <button
        type="button"
        className={sound ? "tb-btn active" : "tb-btn"}
        title="key sounds"
        aria-pressed={sound}
        onClick={onToggleSound}
      >
        <span aria-hidden>{sound ? "♪" : "♪̶"}</span>
        <span className="sr-only">Toggle key sounds</span>
      </button>
      <button type="button" className="tb-btn" title="toggle theme" onClick={onToggleTheme}>
        <span aria-hidden>{theme === "dark" ? "☾" : "☀"}</span>
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}
