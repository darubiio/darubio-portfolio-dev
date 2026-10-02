import { TrafficLights } from "@/components/terminal/TrafficLights";
import { TitleBarActions } from "@/components/terminal/TitleBarActions";
import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";

interface TitleBarProps {
  sound: boolean;
  theme: Theme;
  lang: Lang;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
}

export function TitleBar({ sound, theme, lang, onToggleSound, onToggleTheme, onToggleLang }: TitleBarProps) {
  return (
    <div className="titlebar">
      <TrafficLights />
      <div className="title">
        — <b>darubio@portfolio</b>: ~/shell —
      </div>
      <TitleBarActions
        sound={sound}
        theme={theme}
        lang={lang}
        onToggleSound={onToggleSound}
        onToggleTheme={onToggleTheme}
        onToggleLang={onToggleLang}
      />
    </div>
  );
}
