"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";
import type { Theme } from "@/hooks/useTheme";

export function ThemeNotice({ theme }: { theme: Theme }) {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="ok" style={{ color: "var(--green)" }}>
          ✓
        </span>{" "}
        {t.theme.label}
        <span className="b">{theme === "dark" ? "One Dark Pro" : "One Light"}</span>
      </div>
    </OutputBlock>
  );
}
