"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Education() {
  const { education } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.education}</Heading>
      <div className="row">
        <span className="b">{education.degree}</span>
      </div>
      <div className="row">
        <span className="fn">{education.school}</span> <span className="muted">· {education.place}</span>
      </div>
    </OutputBlock>
  );
}
