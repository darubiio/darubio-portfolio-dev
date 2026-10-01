"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { StatusPill } from "@/components/outputs/StatusPill";
import { Typewriter } from "@/components/terminal/Typewriter";
import { BANNER } from "@/lib/ascii";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Welcome() {
  const { identity } = usePortfolio();
  const t = useMessages();
  const askCmd = `ask "${t.welcome.askQuestion}"`;

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
        <CommandLink cmd="help">{t.welcome.hintHelp}</CommandLink>
        <span className="cmt">{t.welcome.hintPost}</span>
      </div>
      <div className="row cmt">
        {t.welcome.askNew}
        <CommandLink cmd={askCmd}>{askCmd}</CommandLink>
      </div>
    </OutputBlock>
  );
}
