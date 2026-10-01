export const COMMAND_NAMES = [
  "welcome",
  "help",
  "about",
  "stats",
  "experience",
  "projects",
  "skills",
  "education",
  "languages",
  "contact",
  "resume",
  "share",
  "neofetch",
  "sudo",
  "whoami",
  "ls",
  "coffee",
  "joke",
  "open-to-work",
] as const;

export type CommandName = (typeof COMMAND_NAMES)[number];

const COMMAND_SET = new Set<string>(COMMAND_NAMES);

export const AUTOCOMPLETE = [...COMMAND_NAMES, "ask", "clear", "theme", "lang", "matrix"];

/** Extracts the question from an `ask <question>` input, stripping wrapping quotes. */
export function parseAsk(input: string): string | null {
  const match = input.match(/^ask\s+(.+)$/is);
  if (!match) return null;
  return match[1].trim().replace(/^["'](.*)["']$/s, "$1").trim();
}

/**
 * Returns the autocomplete match for the current input, or null. Shared by the
 * Tab handler and the inline ghost-text hint so the two never diverge. Suppressed
 * for empty input, anything with a space (free-text `ask …`, `theme dark`), and
 * inputs that already equal a command.
 */
export function ghostCompletion(value: string): string | null {
  const v = value.toLowerCase();
  if (!v || v.includes(" ")) return null;
  // An exactly-typed command needs no ghost — and this lets a full word like
  // "lang" win over the longer "languages" that shares its prefix.
  if (AUTOCOMPLETE.includes(v)) return null;
  const match = AUTOCOMPLETE.find((command) => command.startsWith(v));
  if (!match || match === v) return null;
  return match;
}

export function isCommandName(key: string): key is CommandName {
  return COMMAND_SET.has(key);
}

export function resolveCommand(key: string): CommandName | null {
  return isCommandName(key) ? key : null;
}

export function isClear(key: string): boolean {
  return key === "clear" || key === "cls";
}

export function isMatrix(key: string): boolean {
  return key === "matrix";
}

export function themeTarget(key: string): "dark" | "light" | "toggle" | null {
  if (key === "theme light") return "light";
  if (key === "theme dark") return "dark";
  if (key === "theme") return "toggle";
  return null;
}

export function langTarget(key: string): "en" | "es" | "toggle" | null {
  if (key === "lang en" || key === "lang english" || key === "lang ingles" || key === "lang inglés") return "en";
  if (key === "lang es" || key === "lang spanish" || key === "lang espanol" || key === "lang español") return "es";
  if (key === "lang") return "toggle";
  return null;
}
