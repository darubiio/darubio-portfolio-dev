"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT } from "@/lib/boot";
import type { BootLine } from "@/lib/types";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useBootSequence(onReady: () => void) {
  const [bootLines, setBootLines] = useState<readonly BootLine[]>([]);
  const [booting, setBooting] = useState(true);
  const skipRef = useRef(false);
  const readyRef = useRef(false);

  const finish = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setBootLines(BOOT);
    setBooting(false);
    onReady();
  }, [onReady]);

  useEffect(() => {
    let cancelled = false;
    const onSkip = () => {
      skipRef.current = true;
    };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    void (async () => {
      await sleep(340);
      for (let k = 0; k < BOOT.length; k += 1) {
        if (cancelled) return;
        if (skipRef.current) break;
        setBootLines(BOOT.slice(0, k + 1));
        await sleep(150 + Math.random() * 120);
      }
      if (cancelled) return;
      await sleep(skipRef.current ? 120 : 280);
      if (cancelled) return;
      finish();
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
    };
  }, [finish]);

  const skipNow = useCallback(() => {
    skipRef.current = true;
    finish();
  }, [finish]);

  return { bootLines, booting, skipNow };
}
