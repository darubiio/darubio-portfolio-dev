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

  /**
   * Scrolls an existing history entry to the top of the view (same placement as a new
   * command) and briefly highlights `flashId`'s output so the eye lands on it.
   */
  const scrollToEntry = useCallback((targetId: number, flashId: number) => {
    const el = ref.current;
    if (!el) return;
    const box = (id: number) => {
      const node = el.querySelector<HTMLElement>(`[data-entry="${id}"]`);
      // Output wrappers are `display: contents` (no box of their own): use their block.
      return node?.classList.contains("entry") ? (node.firstElementChild as HTMLElement | null) : node;
    };
    const target = box(targetId);
    if (!target) return;
    el.scrollTop += target.getBoundingClientRect().top - el.getBoundingClientRect().top - TOP_GAP;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    box(flashId)?.animate(
      [{ backgroundColor: "color-mix(in oklab, var(--accent) 14%, transparent)" }, { backgroundColor: "transparent" }],
      { duration: 1400, easing: "ease-out" },
    );
  }, []);

  return { ref, scrollToLatest, scrollToEntry };
}
