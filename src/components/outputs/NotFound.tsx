import { OutputBlock } from "@/components/outputs/OutputBlock";

export function NotFound({ cmd }: { cmd: string }) {
  return (
    <OutputBlock>
      <div className="row">
        <span className="var">zsh:</span> command not found: <span className="b">{cmd}</span>
      </div>
      <div className="row cmt">
        {"// try "}
        <span className="str">help</span>
        {" to see what I respond to."}
      </div>
    </OutputBlock>
  );
}
