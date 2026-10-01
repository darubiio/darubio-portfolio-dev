import type { CommandName } from "@/lib/commands";
import type { Turn } from "@/lib/ai/protocol";
import type { Theme } from "@/hooks/useTheme";
import type { Lang } from "@/lib/i18n/types";

export type PromptMode = "shell" | "ai";

export type OutputSpec =
  | { type: "command"; name: CommandName }
  | { type: "ask"; question: string; history: Turn[]; inChat: boolean }
  | { type: "fit"; jd: string }
  | { type: "notice"; text: string }
  | { type: "notfound"; cmd: string; suggestion: string | null }
  | { type: "theme"; theme: Theme }
  | { type: "lang"; lang: Lang }
  | { type: "matrix" };

export type HistoryEntry =
  | { id: number; kind: "input"; input: string; prompt: PromptMode }
  | { id: number; kind: "output"; spec: OutputSpec };
