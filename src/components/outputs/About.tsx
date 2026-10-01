"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { AvatarTile } from "@/components/outputs/AvatarTile";
import { AboutBioLine } from "@/components/outputs/AboutBioLine";
import { StatusPill } from "@/components/outputs/StatusPill";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function About() {
  const { identity, about } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.about}</Heading>
      <div className="about-grid">
        <AvatarTile />
        <div>
          {about.map((line, index) => (
            <AboutBioLine key={`${index}-${line}`} line={line} />
          ))}
          <div className="about-meta" style={{ marginTop: 12 }}>
            <div>
              <span className="muted">{t.about.name}</span> <span className="b">{identity.fullName}</span>
            </div>
            <div>
              <span className="muted">{t.about.role}</span> <span className="fn">{identity.role}</span>
            </div>
            <div>
              <span className="muted">{t.about.based}</span> <span className="str">{identity.location}</span>
            </div>
            <div>
              <span className="muted">{t.about.status}</span> <StatusPill label={identity.status.label} />
            </div>
          </div>
        </div>
      </div>
    </OutputBlock>
  );
}
