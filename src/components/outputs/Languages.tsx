import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ProficiencyBar } from "@/components/outputs/ProficiencyBar";
import { portfolio } from "@/lib/portfolio";

export function Languages() {
  return (
    <OutputBlock>
      <Heading>languages</Heading>
      {portfolio.languages.map((language) => (
        <ProficiencyBar key={language.name} language={language} />
      ))}
    </OutputBlock>
  );
}
