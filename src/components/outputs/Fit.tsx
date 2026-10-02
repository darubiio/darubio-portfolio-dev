"use client";

import { useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AiChips } from "@/components/outputs/AiChips";
import { useAiStream } from "@/hooks/useAiStream";
import { useTranslatedAnswer } from "@/hooks/useTranslatedAnswer";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { parseTrailer, visibleBody } from "@/lib/ai/protocol";

/** `fit <job description>`: the model scores the match and explains it. */
export function Fit({ jd }: { jd: string }) {
  // Assessed once, in the language the site had then; a later switch translates the result instead of re-running it.
  const [lang] = useState(useLang().lang);
  const t = useMessages();
  const { status, text } = useAiStream({ mode: "fit", question: jd, lang });

  const done = status === "done";
  const shown = useTranslatedAnswer(done ? { of: "fit", question: jd, text, from: lang } : null);
  const trailer = done ? parseTrailer(shown.text) : null;
  const body = visibleBody(shown.text).replace(/^score:.*\n?/i, "");

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
          <span className={status === "streaming" ? "type-caret" : shown.translating ? "muted" : undefined}>{body}</span>
        )}
      </div>
      {shown.translating ? (
        <div className="row muted type-caret" style={{ marginTop: 4 }}>
          {t.ask.translating}
        </div>
      ) : null}
      {trailer ? <AiChips trailer={trailer} /> : null}
    </OutputBlock>
  );
}
