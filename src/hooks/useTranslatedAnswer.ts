"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import type { AiRequest } from "@/lib/ai/protocol";
import type { Lang } from "@/lib/i18n/types";

/** Translations already fetched this session, keyed by target language + original text. */
const cache = new Map<string, string>();

interface Source {
  of: "ask" | "fit";
  question: string;
  /** The finished answer, in the language it was asked in. */
  text: string;
  from: Lang;
}

/**
 * Shows a finished AI answer in the site's current language. Answering again would
 * re-bill the full prompt and could change the content, so the answer itself is
 * translated (a small prompt), once per language, and switching back is free.
 * Until the translation arrives — or if it fails — the original is shown.
 */
export function useTranslatedAnswer(source: Source | null): { text: string; translating: boolean } {
  const { lang } = useLang();
  const original = source?.text ?? "";
  const of = source?.of ?? "ask";
  const question = source?.question ?? "";
  const needed = source !== null && original !== "" && lang !== source.from;
  const key = `${lang}\n${original}`;
  const [, setSettled] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    if (!needed || cache.has(key) || failed === key) return;
    const controller = new AbortController();
    const request: AiRequest = { mode: "translate", of, question, text: original, lang };

    void (async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const translated = (await res.text()).trim();
        if (!translated) throw new Error("empty");
        cache.set(key, translated);
        setSettled(key);
      } catch {
        if (!controller.signal.aborted) setFailed(key);
      }
    })();

    return () => controller.abort();
  }, [needed, key, failed, lang, original, of, question]);

  if (!needed) return { text: original, translating: false };
  const translated = cache.get(key);
  if (translated !== undefined) return { text: translated, translating: false };
  return { text: original, translating: failed !== key };
}
