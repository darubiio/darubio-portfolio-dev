import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { portfolio } from "@/lib/portfolio";

const { education } = portfolio;

export function Education() {
  return (
    <OutputBlock>
      <Heading>education</Heading>
      <div className="row">
        <span className="b">{education.degree}</span>
      </div>
      <div className="row">
        <span className="fn">{education.school}</span> <span className="muted">· {education.place}</span>
      </div>
    </OutputBlock>
  );
}
