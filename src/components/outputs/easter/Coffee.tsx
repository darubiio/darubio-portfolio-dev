import { OutputBlock } from "@/components/outputs/OutputBlock";

export function Coffee() {
  return (
    <OutputBlock>
      <div className="row">
        <span className="var">HTTP 418</span> <span className="b">I&apos;m a teapot</span>{" "}
        <span className="cmt">{"// ☕ brewing... runs on coffee & TypeScript."}</span>
      </div>
    </OutputBlock>
  );
}
