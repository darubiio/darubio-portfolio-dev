"use client";

import { useCallback, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  return { ref, scrollToBottom };
}
