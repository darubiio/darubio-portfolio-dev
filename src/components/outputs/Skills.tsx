"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ChipList } from "@/components/outputs/ChipList";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Skills() {
  const { skills } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.skills}</Heading>
      {skills.map((group) => (
        <div className="skill-grp" key={group.group}>
          <div className="label">{group.group}</div>
          <ChipList items={group.items} />
        </div>
      ))}
    </OutputBlock>
  );
}
