"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ProficiencyBar } from "@/components/outputs/ProficiencyBar";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Languages() {
  const { languages } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.languages}</Heading>
      {languages.map((language) => (
        <ProficiencyBar key={language.name} language={language} />
      ))}
    </OutputBlock>
  );
}
