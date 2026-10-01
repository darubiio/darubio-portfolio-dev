"use client";

import { useEffect, useState } from "react";
import type { AiRequest } from "@/lib/ai/protocol";

export type AiStatus = "loading" | "streaming" | "done" | "error";

/**
 * Streams `/api/ask` for one request (an output block never changes its question).
 * No started-guard ref: under React Strict Mode the effect mounts twice in dev —
 * the first run's fetch is aborted by cleanup and the second must fire fresh.
 */
export function useAiStream(request: AiRequest): { status: AiStatus; text: string } {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<AiStatus>("loading");
  const body = JSON.stringify(request);

  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 30000);

    void (async () => {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
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
  }, [body]);

  return { status, text };
}
