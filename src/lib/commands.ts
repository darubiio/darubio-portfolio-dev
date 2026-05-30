export const COMMAND_NAMES = [
  "welcome",
  "help",
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "languages",
  "contact",
  "resume",
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

export const AUTOCOMPLETE = [...COMMAND_NAMES, "clear", "theme", "matrix"];

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
