"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";
import type { Lang } from "@/lib/i18n/types";

export function LangNotice({ lang }: { lang: Lang }) {
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="row">
        <span className="ok" style={{ color: "var(--green)" }}>
          ✓
        </span>{" "}
        {t.lang.label}
        <span className="b">{lang === "es" ? t.lang.es : t.lang.en}</span>
      </div>
    </OutputBlock>
  );
}
