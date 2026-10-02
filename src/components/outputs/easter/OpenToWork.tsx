"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { CommandLink } from "@/components/outputs/CommandLink";
import { StatusPill } from "@/components/outputs/StatusPill";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";
import { useCommandLabel } from "@/hooks/useCommandLabel";

export function OpenToWork() {
  const { identity, contact } = usePortfolio();
  const t = useMessages();
  const label = useCommandLabel();

  return (
    <OutputBlock>
      <div className="row">
        <StatusPill label={identity.status.label} />
      </div>
      <div className="row">{t.easter.openToWork}</div>
      <div className="row">
        {t.easter.reachMe}
        <CommandLink cmd={label("contact")}>{label("contact")}</CommandLink> <span className="muted">·</span>{" "}
        <a className="link" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </div>
    </OutputBlock>
  );
}
