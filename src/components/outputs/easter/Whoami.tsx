"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Whoami() {
  const { identity } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="str">{identity.handle}</span>{" "}
        <span className="cmt">{t.easter.whoami}</span>
      </div>
    </OutputBlock>
  );
}
