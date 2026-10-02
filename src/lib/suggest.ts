import { commandLabel, normalizeInput } from "@/lib/commands";
import type { Messages } from "@/lib/i18n/messages";
import type { Lang } from "@/lib/i18n/types";

export interface Suggestion {
  /** What the input becomes when the suggestion is accepted. */
  value: string;
  /** What the list shows. */
  label: string;
  description: string;
  /** Accepting it leaves room for an argument instead of running it (ask …, fit …). */
  takesArgument: boolean;
}

const MAX = 6;
/** Commands that read the rest of the line: completing them adds a space and waits. */
const WITH_ARGUMENT = new Set(["ask", "fit", "theme", "lang"]);
/** Typed alone they do something useful too, so a click may still run them. */
const RUNS_ALONE = new Set(["theme", "lang"]);

function argumentSuggestions(command: string, typedWord: string, partial: string, lang: Lang, t: Messages): Suggestion[] {
  const options =
    command === "theme"
      ? [
          { arg: lang === "es" ? "claro" : "light", description: t.suggest.light },
          { arg: lang === "es" ? "oscuro" : "dark", description: t.suggest.dark },
        ]
      : command === "lang"
        ? [
            { arg: "en", description: t.lang.en },
            { arg: "es", description: t.lang.es },
          ]
        : [];
  return options
    .filter(({ arg }) => arg.startsWith(partial))
    .map(({ arg, description }) => ({
      value: `${typedWord} ${arg}`,
      label: `${typedWord} ${arg}`,
      description,
      takesArgument: false,
    }));
}

/** Nothing left to complete once the only match is exactly what was typed. */
const complete = (list: Suggestion[], typed: string) => (list.length === 1 && list[0].label === typed ? [] : list);

/**
 * Warp-style completions for the shell input: the visitor-facing commands (hidden
 * easter eggs stay hidden) in the current language, prefix matches first, then
 * names that merely contain what was typed; English names match in Spanish too.
 * After `theme`/`lang` (or tema/idioma) it completes their argument.
 */
export function suggest(value: string, lang: Lang, t: Messages): Suggestion[] {
  const typed = value.toLowerCase();
  if (!typed.trim()) return [];

  const withArgument = /^(\S+)\s+(\S*)$/.exec(typed);
  if (withArgument) {
    const command = normalizeInput(withArgument[1]);
    return complete(argumentSuggestions(command, withArgument[1], withArgument[2], lang, t), typed);
  }
  if (/\s/.test(typed)) return [];

  const prefix: Suggestion[] = [];
  const contains: Suggestion[] = [];
  for (const command of t.help.order) {
    const label = commandLabel(command, lang);
    const takesArgument = WITH_ARGUMENT.has(command) && !RUNS_ALONE.has(command);
    const item: Suggestion = {
      value: WITH_ARGUMENT.has(command) ? `${label} ` : label,
      label,
      description: t.help.commands[command] ?? "",
      takesArgument,
    };
    if (label.startsWith(typed) || command.startsWith(typed)) prefix.push(item);
    else if (typed.length >= 2 && (label.includes(typed) || command.includes(typed))) contains.push(item);
  }

  return complete([...prefix, ...contains].slice(0, MAX), typed);
}
