import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ChipList } from "@/components/outputs/ChipList";
import { portfolio } from "@/lib/portfolio";

export function Skills() {
  return (
    <OutputBlock>
      <Heading>skills</Heading>
      {portfolio.skills.map((group) => (
        <div className="skill-grp" key={group.group}>
          <div className="label">{group.group}</div>
          <ChipList items={group.items} />
        </div>
      ))}
    </OutputBlock>
  );
}
