import { TrafficLights } from "@/components/terminal/TrafficLights";
import { TitleBarActions } from "@/components/terminal/TitleBarActions";
import type { Theme } from "@/hooks/useTheme";

interface TitleBarProps {
  booting: boolean;
  sound: boolean;
  theme: Theme;
  onToggleSound: () => void;
  onToggleTheme: () => void;
}

export function TitleBar({ booting, sound, theme, onToggleSound, onToggleTheme }: TitleBarProps) {
  return (
    <div className="titlebar">
      <TrafficLights />
      <div className="title">
        — <b>darubio@portfolio</b>: ~/{booting ? "boot" : "shell"} —
      </div>
      <TitleBarActions sound={sound} theme={theme} onToggleSound={onToggleSound} onToggleTheme={onToggleTheme} />
    </div>
  );
}
