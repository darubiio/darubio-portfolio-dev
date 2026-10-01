"use client";

import { CommandLink } from "@/components/outputs/CommandLink";
import { useTerminal } from "@/context/TerminalContext";
import { useMessages } from "@/hooks/useMessages";
import type { Trailer } from "@/lib/ai/protocol";

/** Evidence commands and follow-up questions under an AI answer. */
export function AiChips({ trailer }: { trailer: Trailer }) {
  const { chatMode } = useTerminal();
  const t = useMessages();
  if (trailer.cmds.length === 0 && trailer.next.length === 0) return null;

  return (
    <div className="ai-chips">
      {trailer.cmds.map((cmd) => (
        <CommandLink key={cmd} cmd={cmd} className="chip cmd">
          ↳ {cmd}
        </CommandLink>
      ))}
      {trailer.next.length > 0 ? <span className="muted ai-chips-label">{t.ask.next}</span> : null}
      {trailer.next.map((question) => (
        <CommandLink key={question} cmd={chatMode ? question : `ask "${question}"`} className="chip">
          {question}
        </CommandLink>
      ))}
    </div>
  );
}
