import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { AvatarTile } from "@/components/outputs/AvatarTile";
import { AboutBioLine } from "@/components/outputs/AboutBioLine";
import { StatusPill } from "@/components/outputs/StatusPill";
import { portfolio } from "@/lib/portfolio";

const { identity, about } = portfolio;

export function About() {
  return (
    <OutputBlock>
      <Heading>about</Heading>
      <div className="about-grid">
        <AvatarTile />
        <div>
          {about.map((line, index) => (
            <AboutBioLine key={`${index}-${line}`} line={line} />
          ))}
          <div className="about-meta" style={{ marginTop: 12 }}>
            <div>
              <span className="muted">{"name   "}</span> <span className="b">{identity.fullName}</span>
            </div>
            <div>
              <span className="muted">{"role   "}</span> <span className="fn">{identity.role}</span>
            </div>
            <div>
              <span className="muted">{"based  "}</span> <span className="str">{identity.location}</span>
            </div>
            <div>
              <span className="muted">{"status "}</span> <StatusPill label={identity.status.label} />
            </div>
          </div>
        </div>
      </div>
    </OutputBlock>
  );
}
