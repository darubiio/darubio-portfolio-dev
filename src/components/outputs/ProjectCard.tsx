import { ChipList } from "@/components/outputs/ChipList";
import { ScreenshotStrip } from "@/components/outputs/ScreenshotStrip";
import { externalUrl } from "@/lib/site";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="proj">
      <div className="proj-head">
        <span className="proj-name">{project.name}</span>
        <span className="proj-kind">{project.kind}</span>
        <span className="proj-year">{project.year}</span>
      </div>
      <div className="proj-blurb">{project.blurb}</div>
      <ul className="proj-hi">
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      {project.shots.length > 0 ? <ScreenshotStrip shots={project.shots} /> : null}
      {project.placeholder ? <div className="proj-ph">{project.placeholder}</div> : null}
      <div className="proj-foot">
        <ChipList items={project.stack} accent />
        {project.link ? (
          <div style={{ marginTop: 8 }}>
            <span className="muted">↳ </span>
            <a className="link" href={externalUrl(project.link)} target="_blank" rel="noreferrer">
              {project.link}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
