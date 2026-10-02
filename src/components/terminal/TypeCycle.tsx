"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface TypeCycleProps {
  phrases: readonly string[];
  /** Freezes the cycle (e.g. while hovered) so the current phrase can be read and clicked. */
  paused?: boolean;
  onChange?: (phrase: string) => void;
}

const TYPE_MS = 45;
const DELETE_MS = 22;
const HOLD_MS = 2200;
const GAP_MS = 350;
const REDUCED_HOLD_MS = 4000;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

type Phase = "hold" | "delete" | "type";

/**
 * Types a phrase, holds it, erases it and types the next one, forever. Starts with the
 * first phrase fully written so the server HTML is complete; reduced motion swaps phrases
 * without the typing effect.
 */
export function TypeCycle({ phrases, paused = false, onChange }: TypeCycleProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(phrases[0]?.length ?? 0);
  const [phase, setPhase] = useState<Phase>("hold");

  const phrase = phrases[index % phrases.length] ?? "";

  useEffect(() => {
    onChange?.(phrase);
  }, [phrase, onChange]);

  useEffect(() => {
    if (paused || phrases.length < 2) return;

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        const next = (index + 1) % phrases.length;
        setIndex(next);
        setLength(phrases[next].length);
        setPhase("hold");
      }, REDUCED_HOLD_MS);
      return () => window.clearTimeout(timer);
    }

    let delay: number;
    let step: () => void;
    if (phase === "hold") {
      delay = HOLD_MS;
      step = () => setPhase("delete");
    } else if (phase === "delete") {
      delay = length === 0 ? GAP_MS : DELETE_MS;
      step = () => {
        if (length > 0) return setLength(length - 1);
        setIndex((index + 1) % phrases.length);
        setPhase("type");
      };
    } else {
      delay = TYPE_MS;
      step = () => {
        if (length < phrase.length) return setLength(length + 1);
        setPhase("hold");
      };
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [paused, reducedMotion, phase, length, index, phrase.length, phrases]);

  return <span className="type-caret">{phrase.slice(0, length)}</span>;
}
