import { isCommandName, type CommandName } from "@/lib/commands";
import type { Lang } from "@/lib/i18n/types";

/**
 * Wire format shared by `/api/ask` and the terminal.
 *
 * The model answers in plain text and ends with a structured trailer:
 *
 *   ---
 *   run: projects              (optional — a command to execute right away)
 *   cmd: experience, contact   (commands holding the evidence → chips)
 *   next: question one | question two   (follow-ups → chips)
 *
 * `fit` answers additionally start with `score: N/10`.
 */
export type AiMode = "ask" | "fit" | "translate";

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface AiRequest {
  mode: AiMode;
  question: string;
  lang: Lang;
  history?: Turn[];
  /** translate only: the answer to translate into `lang`, and the mode that produced it. */
  text?: string;
  of?: "ask" | "fit";
}

export interface Trailer {
  body: string;
  run?: CommandName;
  cmds: CommandName[];
  next: string[];
  score?: number;
}

export const TRAILER_MARK = "\n---";

/** Text before the trailer: what the visitor sees while the answer streams. */
export function visibleBody(text: string): string {
  const i = text.indexOf(TRAILER_MARK);
  return (i === -1 ? text : text.slice(0, i)).trimEnd();
}

const commands = (value: string): CommandName[] =>
  value
    .split(/[,\s]+/)
    .map((c) => c.trim().toLowerCase())
    .filter(isCommandName)
    .slice(0, 3);

export function parseTrailer(text: string): Trailer {
  const i = text.indexOf(TRAILER_MARK);
  const body = visibleBody(text);
  const out: Trailer = { body, cmds: [], next: [] };
  const score = /^score:\s*(\d{1,2})\s*\/\s*10/i.exec(body);
  if (score) out.score = Math.min(10, Number(score[1]));
  if (i === -1) return out;
  for (const line of text.slice(i + TRAILER_MARK.length).split("\n")) {
    const m = /^\s*(run|cmd|next):\s*(.+)$/i.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === "run") out.run = commands(m[2])[0];
    else if (key === "cmd") out.cmds = commands(m[2]);
    else out.next = m[2].split("|").map((q) => q.trim()).filter((q) => q.length > 3 && q.length <= 120).slice(0, 3);
  }
  // A command the visitor is about to see needn't also be a chip.
  if (out.run) out.cmds = out.cmds.filter((c) => c !== out.run);
  return out;
}
