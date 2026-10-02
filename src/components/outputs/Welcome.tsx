"use client";

import { useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { StatusPill } from "@/components/outputs/StatusPill";
import { Typewriter } from "@/components/terminal/Typewriter";
import { TypeCycle } from "@/components/terminal/TypeCycle";
import { useTerminal } from "@/context/TerminalContext";
import { BANNER } from "@/lib/ascii";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";
import { useCommandLabel } from "@/hooks/useCommandLabel";

export function Welcome() {
  const { identity } = usePortfolio();
  const t = useMessages();
  const { run } = useTerminal();
  const label = useCommandLabel();
  const [question, setQuestion] = useState(t.welcome.aiQuestions[0]);
  const [paused, setPaused] = useState(false);
  const askCmd = `${label("ask")} "${question}"`;

  return (
    <OutputBlock>
      <div className="banner">{BANNER}</div>
      <div className="row">
        <span className="b">{identity.role}</span> <span className="muted">·</span>{" "}
        <span className="str">{identity.stack}</span>
      </div>
      <div className="row muted">
        <Typewriter key={identity.tagline} text={identity.tagline} /> <StatusPill label={identity.status.label} />
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <span className="cmt">{t.welcome.hintPre}</span>
        <CommandLink cmd={label("help")}>{label("help")}</CommandLink>
        <span className="cmt">{t.welcome.hintPost}</span>
      </div>
      <div
        className="ai-promo"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="row">
          <span className="ai-badge">✦ {t.welcome.aiLabel}</span> <span className="b">{t.welcome.aiTitle}</span>
        </div>
        <div className="row ai-try">
          <span className="cmt">{t.welcome.aiTry}</span>{" "}
          <button type="button" className="link" aria-label={askCmd} onClick={() => run(askCmd)}>
            <span aria-hidden>
              {label("ask")} &quot;
              <TypeCycle phrases={t.welcome.aiQuestions} paused={paused} onChange={setQuestion} />
              &quot;
            </span>
          </button>
        </div>
        <div className="row cmt">
          {t.welcome.fitPre}
          <CommandLink cmd={label("fit")}>{label("fit")}</CommandLink>
          {t.welcome.fitPost}
        </div>
      </div>
    </OutputBlock>
  );
}
