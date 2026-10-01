"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";

export function MatrixNotice() {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row cmt">{t.matrix.notice}</div>
    </OutputBlock>
  );
}
