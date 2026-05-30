import type { CommandName } from "@/lib/commands";
import type { Theme } from "@/hooks/useTheme";

export type OutputSpec =
  | { type: "command"; name: CommandName }
  | { type: "notfound"; cmd: string }
  | { type: "theme"; theme: Theme }
  | { type: "matrix" };

export type HistoryEntry =
  | { id: number; kind: "input"; input: string }
  | { id: number; kind: "output"; spec: OutputSpec };
