import { OutputBlock } from "@/components/outputs/OutputBlock";
import { portfolio } from "@/lib/portfolio";

const { identity } = portfolio;

export function Sudo() {
  return (
    <OutputBlock>
      <div className="row">
        <span className="var">[sudo]</span> password for {identity.handle}:{" "}
        <span className="muted">··········</span>
      </div>
      <div className="row" style={{ color: "var(--red)" }}>
        {identity.handle} is not in the sudoers file. This incident will be reported. 🚨
      </div>
      <div className="row cmt">
        {"// nice try. hidden commands: whoami · ls · matrix · coffee · joke · open-to-work"}
      </div>
    </OutputBlock>
  );
}
