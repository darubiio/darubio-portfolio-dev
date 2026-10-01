"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** delay before typing starts (ms) */
  delay?: number;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Typewriter({ text, speed = 26, delay = 120, className }: TypewriterProps) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text.length : 0));
  const doneRef = useRef(shown >= text.length);

  useEffect(() => {
    if (doneRef.current) return;

    let timer = 0;
    let i = 0;

    const finish = () => {
      doneRef.current = true;
      setShown(text.length);
    };

    const step = () => {
      i += 1;
      setShown(i);
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
  }, [text, speed, delay]);

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
