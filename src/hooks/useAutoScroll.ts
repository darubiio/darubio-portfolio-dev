"use client";

import { useCallback, useRef } from "react";

/** Breathing room kept above the command echo once it is scrolled to the top. */
const TOP_GAP = 8;

export function useAutoScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  /**
   * Brings the latest command echo to the top of the viewport, so its output is read
   * from the beginning instead of landing on its last lines. Short outputs that can't
   * fill the viewport simply end up at the bottom, as the scroll range allows.
   */
  const scrollToLatest = useCallback(() => {
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const echoes = el.querySelectorAll<HTMLElement>("[data-echo]");
      const latest = echoes[echoes.length - 1];
      if (!latest) {
        el.scrollTop = el.scrollHeight;
        return;
      }
      const offset = latest.getBoundingClientRect().top - el.getBoundingClientRect().top;
      el.scrollTop += offset - TOP_GAP;
    });
  }, []);

  return { ref, scrollToLatest };
}
