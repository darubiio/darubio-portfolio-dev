"use client";

import { Fragment } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { CommandLink } from "@/components/outputs/CommandLink";
import { useMessages } from "@/hooks/useMessages";

export function Help() {
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.help}</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(110px,auto) 1fr", gap: "3px 16px" }}>
        {t.help.order.map((command) => (
          <Fragment key={command}>
            <div>
              <CommandLink cmd={command}>{command}</CommandLink>
            </div>
            <div className="muted">{t.help.commands[command]}</div>
          </Fragment>
        ))}
      </div>
      <div className="row cmt" style={{ marginTop: 10 }}>
        {t.help.hiddenNote}
      </div>
    </OutputBlock>
  );
}
