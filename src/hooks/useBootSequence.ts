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
  // The first line is part of the server HTML, so the terminal paints real content
  // before hydration (it is the LCP element on slow devices).
  const [bootLines, setBootLines] = useState<readonly BootLine[]>(() => boot.slice(0, 1));
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

    // Small screens get a 2× faster boot: the welcome banner is the LCP element and
    // phones have less headroom before the 2.5 s threshold.
    const speed = matchMedia("(max-width: 720px)").matches ? 0.5 : 1;

    void (async () => {
      const lines = bootRef.current;
      await sleep(120 * speed);
      for (let k = 1; k < lines.length; k += 1) {
        if (cancelled) return;
        if (skipRef.current) break;
        setBootLines(lines.slice(0, k + 1));
        await sleep((70 + Math.random() * 60) * speed);
      }
      if (cancelled) return;
      await sleep((skipRef.current ? 80 : 160) * speed);
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
