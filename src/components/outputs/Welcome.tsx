import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { StatusPill } from "@/components/outputs/StatusPill";
import { BANNER } from "@/lib/ascii";
import { portfolio } from "@/lib/portfolio";

const { identity } = portfolio;

export function Welcome() {
  return (
    <OutputBlock>
      <div className="banner">{BANNER}</div>
      <div className="row">
        <span className="b">{identity.role}</span> <span className="muted">·</span>{" "}
        <span className="str">{identity.stack}</span>
      </div>
      <div className="row muted">
        {identity.tagline} <StatusPill label={identity.status.label} />
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <span className="cmt">{"// Type a command, or just click the buttons below. Try "}</span>
        <CommandLink cmd="help">help</CommandLink>
        <span className="cmt"> if you&apos;re lost.</span>
      </div>
    </OutputBlock>
  );
}
