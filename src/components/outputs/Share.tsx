"use client";

import { useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";
import { SITE_URL } from "@/lib/site";

export function Share() {
  const [copied, setCopied] = useState(false);
  const t = useMessages();

  const link = typeof window !== "undefined" ? window.location.href : SITE_URL;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <OutputBlock>
      <div className="row">
        <span className="cmt">{t.share.intro}</span>
      </div>
      <div className="row" style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="str">{link}</span>
        <button type="button" className="link" onClick={copy}>
          {copied ? t.share.copied : t.share.copy}
        </button>
      </div>
    </OutputBlock>
  );
}
