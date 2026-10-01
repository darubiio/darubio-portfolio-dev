"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";

export function NotFound({ cmd }: { cmd: string }) {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="var">zsh:</span> {t.notfound.notFound}
        <span className="b">{cmd}</span>
      </div>
      <div className="row cmt">
        {t.notfound.tryPre}
        <span className="str">help</span>
        {t.notfound.tryPost}
      </div>
    </OutputBlock>
  );
}
