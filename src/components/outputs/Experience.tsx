"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { TimelineItem } from "@/components/outputs/TimelineItem";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Experience() {
  const { experience } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.experience}</Heading>
      <div className="tl">
        {experience.map((entry) => (
          <TimelineItem key={`${entry.company}-${entry.period}`} entry={entry} />
        ))}
      </div>
    </OutputBlock>
  );
}
