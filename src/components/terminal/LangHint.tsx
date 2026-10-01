"use client";

import { useState } from "react";
import { useTerminal } from "@/context/TerminalContext";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";

const DISMISS_KEY = "rubio-lang-hint";

/**
 * One-time, dismissible nudge for Spanish-preferring visitors. Never switches
 * language on its own — it only suggests `lang es`. Only mounts after the boot
 * sequence (a client-only effect), long past hydration, so reading
 * navigator/localStorage in the initializer can't cause a hydration mismatch.
 */
export function LangHint() {
  const { run } = useTerminal();
  const { lang } = useLang();
  const t = useMessages();
  const [visible, setVisible] = useState(() => {
    try {
      if (typeof window === "undefined") return false;
      if (localStorage.getItem("rubio-lang") || localStorage.getItem(DISMISS_KEY)) return false;
      return lang === "en" && Boolean(navigator.language?.toLowerCase().startsWith("es"));
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const accept = () => {
    dismiss();
    run(t.langHint.cta);
  };

  return (
    <div className="out lang-hint row cmt">
      <span>{t.langHint.text}</span>
      <button type="button" className="link" onClick={accept}>
        {t.langHint.cta}
      </button>
      <button type="button" className="lang-hint-x" aria-label="dismiss" title="dismiss" onClick={dismiss}>
        ×
      </button>
    </div>
  );
}
