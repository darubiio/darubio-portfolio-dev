import type { CommandName } from "@/lib/commands";
import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";

export type OutputSpec =
  | { type: "command"; name: CommandName }
  | { type: "ask"; question: string }
  | { type: "notfound"; cmd: string }
  | { type: "theme"; theme: Theme }
  | { type: "lang"; lang: Lang }
  | { type: "matrix" };

export type HistoryEntry =
  | { id: number; kind: "input"; input: string }
  | { id: number; kind: "output"; spec: OutputSpec };
