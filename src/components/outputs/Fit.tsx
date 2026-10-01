"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AiChips } from "@/components/outputs/AiChips";
import { useAiStream } from "@/hooks/useAiStream";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { parseTrailer, visibleBody } from "@/lib/ai/protocol";

/** `fit <job description>`: the model scores the match and explains it. */
export function Fit({ jd }: { jd: string }) {
  const { lang } = useLang();
  const t = useMessages();
  const { status, text } = useAiStream({ mode: "fit", question: jd, lang });

  const done = status === "done";
  const trailer = done ? parseTrailer(text) : null;
  const body = visibleBody(text).replace(/^score:.*\n?/i, "");

  return (
    <OutputBlock>
      <div className="row">
        <span className="fn b">fit</span>
        <span className="muted"> · {jd.length > 90 ? `${jd.slice(0, 90)}…` : jd}</span>
      </div>
      {trailer?.score !== undefined ? (
        <div className="fit-score" role="img" aria-label={`${t.fit.score} ${trailer.score}/10`}>
          <span className="fit-bar">
            <span className="fit-fill" style={{ width: `${trailer.score * 10}%` }} />
          </span>
          <span className="b">{trailer.score}/10</span>
        </div>
      ) : null}
      <div className="row" style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>
        {status === "loading" ? (
          <span className="muted type-caret">{t.ask.thinking}</span>
        ) : status === "error" ? (
          <span className="var">{t.ask.unavailable}</span>
        ) : (
          <span className={status === "streaming" ? "type-caret" : undefined}>{body}</span>
        )}
      </div>
      {trailer ? <AiChips trailer={trailer} /> : null}
    </OutputBlock>
  );
}
