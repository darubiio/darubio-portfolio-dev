export type Lang = "en" | "es";

export const LANGS: readonly Lang[] = ["en", "es"];

export const DEFAULT_LANG: Lang = "en";

export function decodeLang(raw: string | null): Lang {
  return raw === "es" ? "es" : "en";
}
