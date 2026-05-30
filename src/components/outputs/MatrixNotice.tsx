import { OutputBlock } from "@/components/outputs/OutputBlock";

export function MatrixNotice() {
  return (
    <OutputBlock>
      <div className="row cmt">{"// entering the matrix... press any key to exit."}</div>
    </OutputBlock>
  );
}
