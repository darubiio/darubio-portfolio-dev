"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BootLine } from "@/lib/types";

const BOOTED_KEY = "rubio-booted";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Per-tab flag: the boot animation plays once per tab, reloads go straight to the shell. */
function alreadyBooted(): boolean {
  try {
    return sessionStorage.getItem(BOOTED_KEY) === "1";
  } catch {
    return false;
  }
}

function markBooted(): void {
  try {
    sessionStorage.setItem(BOOTED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function useBootSequence(onReady: () => void, boot: readonly BootLine[]) {
  const [bootLines, setBootLines] = useState<readonly BootLine[]>([]);
  const [booting, setBooting] = useState(true);
  const skipRef = useRef(false);
  const readyRef = useRef(false);
  // Snapshot the boot lines once so changing language mid-boot can't restart it.
  const bootRef = useRef(boot);

  const finish = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    markBooted();
    setBootLines(bootRef.current);
    setBooting(false);
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (alreadyBooted()) {
      finish();
      return;
    }

    let cancelled = false;
    const onSkip = () => {
      skipRef.current = true;
    };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("pointerdown", onSkip);

    void (async () => {
      const lines = bootRef.current;
      await sleep(120);
      for (let k = 0; k < lines.length; k += 1) {
        if (cancelled) return;
        if (skipRef.current) break;
        setBootLines(lines.slice(0, k + 1));
        await sleep(70 + Math.random() * 60);
      }
      if (cancelled) return;
      await sleep(skipRef.current ? 80 : 160);
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
