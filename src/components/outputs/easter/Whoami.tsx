import { OutputBlock } from "@/components/outputs/OutputBlock";
import { portfolio } from "@/lib/portfolio";

export function Whoami() {
  return (
    <OutputBlock>
      <div className="row">
        <span className="str">{portfolio.identity.handle}</span>{" "}
        <span className="cmt">{"// just a dev who likes shipping things that stay shipped."}</span>
      </div>
    </OutputBlock>
  );
}
