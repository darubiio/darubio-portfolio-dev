"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface TypewriterProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** delay before typing starts (ms) */
  delay?: number;
  className?: string;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** False on the server and during hydration, so server-rendered text never mismatches. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

export function Typewriter({ text, speed = 26, delay = 120, className }: TypewriterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);
  const shown = reducedMotion ? text.length : typed;
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current || reducedMotion) return;

    let timer = 0;
    let i = 0;

    const finish = () => {
      doneRef.current = true;
      setTyped(text.length);
    };

    const step = () => {
      i += 1;
      setTyped(i);
      if (i >= text.length) {
        doneRef.current = true;
        return;
      }
      timer = window.setTimeout(step, speed);
    };

    // Any interaction completes the line instantly — keep the 7s skim fast.
    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });
    timer = window.setTimeout(step, delay);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [text, speed, delay, reducedMotion]);

  const typing = shown < text.length;

  // The untyped remainder is laid out invisibly so the line keeps its final size (no layout shift).
  return (
    <span className={className}>
      <span className={typing ? "type-caret" : undefined}>{text.slice(0, shown)}</span>
      {typing ? (
        <span aria-hidden style={{ visibility: "hidden" }}>
          {text.slice(shown)}
        </span>
      ) : null}
    </span>
  );
}
