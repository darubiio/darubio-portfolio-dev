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

export const AUTOCOMPLETE = [...COMMAND_NAMES, "ask", "fit", "exit", "clear", "theme", "lang", "matrix"];

/** Extracts the question from an `ask <question>` input, stripping wrapping quotes. */
export function parseAsk(input: string): string | null {
  const match = input.match(/^ask\s+(.+)$/is);
  if (!match) return null;
  return match[1].trim().replace(/^["'](.*)["']$/s, "$1").trim();
}

/** Extracts the job description from a `fit <text>` input (null when it is not a fit command). */
export function parseFit(input: string): string | null {
  const match = input.match(/^fit(?:\s+([\s\S]+))?$/i);
  if (!match) return null;
  return (match[1] ?? "").trim();
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Closest known command for a typo ("projetcs" → "projects"), or null when nothing is close. */
export function suggestCommand(key: string): string | null {
  if (key.length < 3) return null;
  let best: string | null = null;
  let bestDistance = 3;
  for (const command of AUTOCOMPLETE) {
    const distance = levenshtein(key, command);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = command;
    }
  }
  return best;
}

/** Free text that reads like a question rather than a mistyped command. */
export function looksLikeQuestion(input: string): boolean {
  return input.includes(" ") || /[?¿]$/.test(input);
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
