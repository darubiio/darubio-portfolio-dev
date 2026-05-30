import { ChipList } from "@/components/outputs/ChipList";
import type { ExperienceEntry } from "@/lib/types";

export function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className={entry.current ? "tl-item cur" : "tl-item"}>
      <span className="tl-dot" />
      <div className="tl-head">
        <span className="tl-role">{entry.role}</span>
        <span className="muted">@</span>
        <span className="tl-co">{entry.company}</span>
        <span className="tl-period">{entry.period}</span>
      </div>
      <div className="tl-sub">
        {entry.place} · {entry.sector}
        {entry.current ? " · now" : ""}
      </div>
      <ul className="tl-pts">
        {entry.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <ChipList items={entry.stack} />
    </div>
  );
}
