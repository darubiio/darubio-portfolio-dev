import type { Lang } from "@/lib/i18n/types";

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

const AUTOCOMPLETE_EN = [...COMMAND_NAMES, "ask", "fit", "exit", "clear", "theme", "lang", "matrix"];

/**
 * Spanish names for the commands. Commands stay English internally (URLs, the AI
 * trailer, the registry); these are only what a Spanish visitor sees and types.
 * Both languages are always accepted as input.
 */
const ES_NAMES: Readonly<Record<string, string>> = {
  help: "ayuda",
  about: "sobre-mi",
  stats: "cifras",
  experience: "experiencia",
  projects: "proyectos",
  skills: "habilidades",
  education: "formacion",
  languages: "idiomas",
  contact: "contacto",
  resume: "cv",
  share: "compartir",
  ask: "preguntar",
  fit: "encaje",
  exit: "salir",
  clear: "limpiar",
  theme: "tema",
  lang: "idioma",
  coffee: "cafe",
  joke: "chiste",
  "open-to-work": "disponible",
};

const FROM_ES: Readonly<Record<string, string>> = {
  ...Object.fromEntries(Object.entries(ES_NAMES).map(([en, es]) => [es, en])),
  "sobre-mí": "about",
  sobremi: "about",
  sobremí: "about",
  formación: "education",
  café: "coffee",
};

const THEME_ARGS: Readonly<Record<string, string>> = { claro: "light", oscuro: "dark" };

const AUTOCOMPLETE_ES = AUTOCOMPLETE_EN.map((command) => ES_NAMES[command] ?? command);

const completions = (lang: Lang) => (lang === "es" ? AUTOCOMPLETE_ES : AUTOCOMPLETE_EN);

/** The name a visitor sees (and can type) for a command in the given language. */
export function commandLabel(command: string, lang: Lang): string {
  return lang === "es" ? (ES_NAMES[command] ?? command) : command;
}

/**
 * Rewrites a Spanish command word (and the theme argument) to its English form,
 * keeping the rest of the input untouched: "preguntar ¿Qué…?" → "ask ¿Qué…?".
 */
export function normalizeInput(input: string): string {
  const match = /^(\S+)(\s+[\s\S]*)?$/.exec(input);
  if (!match) return input;
  const word = match[1].toLowerCase();
  const command = FROM_ES[word] ?? word;
  let rest = match[2] ?? "";
  if (command === "theme") rest = rest.replace(/^\s+(\S+)$/, (all, arg: string) => ` ${THEME_ARGS[arg.toLowerCase()] ?? arg}`);
  return command === word ? input : command + rest;
}

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
export function suggestCommand(key: string, lang: Lang): string | null {
  if (key.length < 3) return null;
  let best: string | null = null;
  let bestDistance = 3;
  for (const command of completions(lang)) {
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

export function isCommandName(key: string): key is CommandName {
  return COMMAND_SET.has(key);
}

export function resolveCommand(key: string): CommandName | null {
  const command = FROM_ES[key] ?? key;
  return isCommandName(command) ? command : null;
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
