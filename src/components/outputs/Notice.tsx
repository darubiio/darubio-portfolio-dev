import { OutputBlock } from "@/components/outputs/OutputBlock";

export function Notice({ text }: { text: string }) {
  return (
    <OutputBlock>
      <div className="row cmt">{text}</div>
    </OutputBlock>
  );
}
