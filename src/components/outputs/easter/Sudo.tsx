"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Sudo() {
  const { identity } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="var">[sudo]</span> {t.easter.sudoPassword} {identity.handle}:{" "}
        <span className="muted">··········</span>
      </div>
      <div className="row" style={{ color: "var(--red)" }}>
        {identity.handle} {t.easter.sudoIncident}
      </div>
      <div className="row cmt">{t.easter.sudoHidden}</div>
    </OutputBlock>
  );
}
