"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";

export function Coffee() {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="var">HTTP 418</span> <span className="b">I&apos;m a teapot</span>{" "}
        <span className="cmt">{t.easter.coffee}</span>
      </div>
    </OutputBlock>
  );
}
