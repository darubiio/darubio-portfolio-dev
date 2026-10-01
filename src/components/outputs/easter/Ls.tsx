"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";

export function Ls() {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row muted">drwxr-xr-x about.md experience.log projects/ skills.json contact.vcf</div>
      <div className="row cmt">{t.easter.lsNote}</div>
    </OutputBlock>
  );
}
