import type { Language } from "@/lib/types";

export function ProficiencyBar({ language }: { language: Language }) {
  return (
    <div className="bar-wrap">
      <span className="b">{language.name}</span>
      <span className="bar">
        <i style={{ width: `${language.pct}%` }} />
      </span>
      <span className="muted" style={{ fontSize: 12 }}>
        {language.level}
      </span>
    </div>
  );
}
