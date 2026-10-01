"use client";

import { useEffect, useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";

type Status = "loading" | "streaming" | "done" | "error";

export function Ask({ question }: { question: string }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const { lang } = useLang();
  const t = useMessages();

  // No started-guard ref: under React Strict Mode the effect mounts twice in
  // dev — the first run's fetch is aborted by cleanup and the second run must
  // be free to fire a fresh request, otherwise it hangs on "thinking" forever.
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 25000);

    void (async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lang }),
          signal: controller.signal,
        });

        if (!res.body) {
          setText(await res.text());
          setStatus("done");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        setStatus("streaming");
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setText(acc);
        }
        setStatus("done");
      } catch (error) {
        // Timeout-triggered abort surfaces as an error; unmount-triggered abort is silent.
        if ((error as Error).name !== "AbortError" || timedOut) setStatus("error");
      } finally {
        window.clearTimeout(timeout);
      }
    })();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [question, lang]);

  return (
    <OutputBlock>
      <div className="row">
        <span className="fn b">ai</span>
        <span className="muted"> · {question}</span>
      </div>
      <div className="row" style={{ marginTop: 4 }}>
        {status === "loading" ? (
          <span className="muted type-caret">{t.ask.thinking}</span>
        ) : status === "error" ? (
          <span className="var">{t.ask.unavailable}</span>
        ) : (
          <span className={status === "streaming" ? "type-caret" : undefined}>{text}</span>
        )}
      </div>
    </OutputBlock>
  );
}
