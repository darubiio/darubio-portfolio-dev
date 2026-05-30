import { OutputBlock } from "@/components/outputs/OutputBlock";

export function Ls() {
  return (
    <OutputBlock>
      <div className="row muted">drwxr-xr-x about.md experience.log projects/ skills.json contact.vcf</div>
      <div className="row cmt">{"// run a command name to `cat` any of these."}</div>
    </OutputBlock>
  );
}
