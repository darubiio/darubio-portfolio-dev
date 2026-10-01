"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";
import { asset } from "@/lib/site";

export function Resume() {
  const { contact } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="ok" style={{ color: "var(--green)" }}>
          ✓
        </span>{" "}
        {t.resume.downloading} <span className="b">Daniel-Rubio-CV.pdf</span> ...
      </div>
      <div className="row">
        <a className="link" href={asset(contact.cv)} download>
          {t.resume.fallback}
        </a>
      </div>
    </OutputBlock>
  );
}
