import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { TimelineItem } from "@/components/outputs/TimelineItem";
import { portfolio } from "@/lib/portfolio";

export function Experience() {
  return (
    <OutputBlock>
      <Heading>experience</Heading>
      <div className="tl">
        {portfolio.experience.map((entry) => (
          <TimelineItem key={`${entry.company}-${entry.period}`} entry={entry} />
        ))}
      </div>
    </OutputBlock>
  );
}
