"use client";

import { useEffect, useRef } from "react";

const RIPPLES = 8;
const EMIT_EVERY = 90; // px of pointer travel between ripples
const FOLLOW = 0.14; // lerp factor per frame
const IDLE_MS = 1400;

/**
 * Mouse-only, desktop-only. Everything moves through transform/opacity, so the
 * work stays on the compositor; React never re-renders for pointer events.
 */
export function PointerGlow() {
  const ringRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const pool = poolRef.current;
    if (!ring || !pool) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;

    const ripples = Array.from(pool.children) as HTMLElement[];
    let target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let last: { x: number; y: number } | null = null;
    let travelled = 0;
    let next = 0;
    let frame = 0;
    let idle = 0;
    let visible = false;

    const show = (value: boolean) => {
      if (value === visible) return;
      visible = value;
      ring.style.opacity = value ? "1" : "0";
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * FOLLOW;
      pos.y += (target.y - pos.y) * FOLLOW;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.4 ? requestAnimationFrame(tick) : 0;
    };

    const emit = (x: number, y: number) => {
      const el = ripples[next];
      next = (next + 1) % ripples.length;
      el.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(0.35) rotate(0deg)`, opacity: 0.95 },
          { transform: `translate3d(${x}px, ${y}px, 0) scale(1.9) rotate(120deg)`, opacity: 0 },
        ],
        { duration: 1200, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "forwards" },
      );
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if ((event.target as Element | null)?.closest(".window")) {
        show(false);
        last = null;
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      if (!visible && !last) {
        pos.x = x;
        pos.y = y;
      }
      target = { x, y };
      show(true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => show(false), IDLE_MS);
      if (!frame) frame = requestAnimationFrame(tick);
      if (last) {
        travelled += Math.hypot(x - last.x, y - last.y);
        if (travelled >= EMIT_EVERY) {
          travelled = 0;
          emit(x, y);
        }
      }
      last = { x, y };
    };

    const onLeave = () => {
      show(false);
      last = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-layer" aria-hidden>
      <div ref={ringRef} className="pointer-ring" />
      <div ref={poolRef}>
        {Array.from({ length: RIPPLES }, (_, i) => (
          <div key={i} className="ripple" />
        ))}
      </div>
    </div>
  );
}
