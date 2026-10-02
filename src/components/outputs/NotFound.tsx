"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { useMessages } from "@/hooks/useMessages";
import { useCommandLabel } from "@/hooks/useCommandLabel";

export function NotFound({ cmd, suggestion }: { cmd: string; suggestion: string | null }) {
  const t = useMessages();
  const label = useCommandLabel();

  return (
    <OutputBlock>
      <div className="row">
        <span className="var">zsh:</span> {t.notfound.notFound}
        <span className="b">{cmd}</span>
      </div>
      {suggestion ? (
        <div className="row cmt">
          {t.notfound.didYouMean} <CommandLink cmd={suggestion}>{suggestion}</CommandLink>?
        </div>
      ) : (
        <div className="row cmt">
          {t.notfound.tryPre}
          <CommandLink cmd={label("help")}>{label("help")}</CommandLink>
          {t.notfound.tryPost}
        </div>
      )}
    </OutputBlock>
  );
}
