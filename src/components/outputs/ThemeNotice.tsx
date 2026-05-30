import { OutputBlock } from "@/components/outputs/OutputBlock";
import type { Theme } from "@/hooks/useTheme";

export function ThemeNotice({ theme }: { theme: Theme }) {
  return (
    <OutputBlock>
      <div className="row">
        <span className="ok" style={{ color: "var(--green)" }}>
          ✓
        </span>{" "}
        theme → <span className="b">{theme === "dark" ? "One Dark Pro" : "One Light"}</span>
      </div>
    </OutputBlock>
  );
}
