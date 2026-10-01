"use client";

import { useEffect, useRef } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AiChips } from "@/components/outputs/AiChips";
import { useTerminal } from "@/context/TerminalContext";
import { useAiStream } from "@/hooks/useAiStream";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { parseTrailer, visibleBody, type Turn } from "@/lib/ai/protocol";

export function Ask({ question, history, inChat }: { question: string; history: Turn[]; inChat: boolean }) {
  const { lang } = useLang();
  const t = useMessages();
  const { run, rememberAiTurn } = useTerminal();
  const { status, text } = useAiStream({ mode: "ask", question, lang, history });
  const settled = useRef(false);

  const done = status === "done";
  const trailer = done ? parseTrailer(text) : null;

  // Once per answer: remember the turn and honour a `run:` directive.
  useEffect(() => {
    if (!done || !trailer || settled.current) return;
    settled.current = true;
    if (trailer.body) rememberAiTurn(question, trailer.body);
    if (trailer.run) run(trailer.run);
  }, [done, trailer, question, rememberAiTurn, run]);

  return (
    <OutputBlock>
      {/* In chat mode the prompt echo already shows the question. */}
      {inChat ? null : (
        <div className="row">
          <span className="fn b">ai</span>
          <span className="muted"> · {question}</span>
        </div>
      )}
      <div className="row" style={{ marginTop: 4 }}>
        {status === "loading" ? (
          <span className="muted type-caret">{t.ask.thinking}</span>
        ) : status === "error" ? (
          <span className="var">{t.ask.unavailable}</span>
        ) : (
          <span className={status === "streaming" ? "type-caret" : undefined}>{visibleBody(text)}</span>
        )}
      </div>
      {trailer?.run ? (
        <div className="row muted" style={{ marginTop: 4 }}>
          ↳ {t.ask.running} <span className="str">{trailer.run}</span>
        </div>
      ) : null}
      {trailer ? <AiChips trailer={trailer} /> : null}
    </OutputBlock>
  );
}
