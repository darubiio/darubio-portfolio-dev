"use client";

import { useEffect, useRef, useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AiChips } from "@/components/outputs/AiChips";
import { useTerminal } from "@/context/TerminalContext";
import { useAiStream } from "@/hooks/useAiStream";
import { useTranslatedAnswer } from "@/hooks/useTranslatedAnswer";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { parseTrailer, visibleBody, type Turn } from "@/lib/ai/protocol";
import { useCommandLabel } from "@/hooks/useCommandLabel";

export function Ask({ question, history, inChat }: { question: string; history: Turn[]; inChat: boolean }) {
  // Asked once, in the language the site had then; a later switch translates the answer instead of asking again.
  const [lang] = useState(useLang().lang);
  const t = useMessages();
  const label = useCommandLabel();
  const { run, rememberAiTurn } = useTerminal();
  const { status, text } = useAiStream({ mode: "ask", question, lang, history });
  const settled = useRef(false);

  const done = status === "done";
  // The original drives the one-off effects; what is shown follows the site language.
  const trailer = done ? parseTrailer(text) : null;
  const shown = useTranslatedAnswer(done ? { of: "ask", question, text, from: lang } : null);
  const shownTrailer = done ? parseTrailer(shown.text) : null;

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
        ) : done ? (
          <span className={shown.translating ? "muted" : undefined}>{visibleBody(shown.text)}</span>
        ) : (
          <span className="type-caret">{visibleBody(text)}</span>
        )}
      </div>
      {shown.translating ? (
        <div className="row muted type-caret" style={{ marginTop: 4 }}>
          {t.ask.translating}
        </div>
      ) : null}
      {trailer?.run ? (
        <div className="row muted" style={{ marginTop: 4 }}>
          ↳ {t.ask.running} <span className="str">{label(trailer.run)}</span>
        </div>
      ) : null}
      {shownTrailer ? <AiChips trailer={shownTrailer} /> : null}
    </OutputBlock>
  );
}
