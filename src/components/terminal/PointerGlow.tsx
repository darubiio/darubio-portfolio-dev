"use client";

import { useEffect, useRef } from "react";

const RIPPLES = 8;
const EMIT_EVERY = 90; // px of pointer travel between ripples
const FOLLOW = 0.14; // lerp factor per frame
/** Travel over the background needed before leaving it adds a ring (no rings from a mere graze). */
const MIN_TRAVEL = 140;
/** Collected rings kept in the gyroscope; past this the oldest fades out. Each one costs GPU. */
const MAX_COLLECTED = 9;
const POINTER_RING_PX = 240;
const GLOWS = ["--glow-a", "--glow-b", "--glow-c"] as const;

const random = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Builds a ring like the three ambient ones, with its own size, tilt and tempo, so
 * each collected ring weaves through the others as the gyroscope turns.
 */
function createCollectedRing(index: number): { tilt: HTMLDivElement; ring: HTMLDivElement; diameterVmin: number } {
  const diameterVmin = random(42, 96);
  const tilt = document.createElement("div");
  tilt.className = "tilt";
  tilt.style.transform =
    `translate3d(${random(-30, 30)}vw, ${random(-26, 26)}vh, ${random(-120, 120)}px) ` +
    `rotateX(${random(-75, 75)}deg) rotateY(${random(-75, 75)}deg)`;

  const ring = document.createElement("div");
  ring.className = "ring";
  const vars: Record<string, string> = {
    "--d": `${diameterVmin}vmin`,
    "--t": `${Math.round(random(14, 48))}px`,
    "--glow": `var(${GLOWS[index % GLOWS.length]})`,
    "--spin": `${Math.round(random(70, 170))}s`,
    "--breathe": `${Math.round(random(9, 18))}s`,
    "--hue": `${Math.round(random(18, 30))}s`,
    "--reflect-spin": `${Math.round(random(24, 42))}s`,
  };
  for (const [name, value] of Object.entries(vars)) ring.style.setProperty(name, value);
  if (index % 2) ring.style.animationDirection = "reverse, alternate, alternate-reverse";

  tilt.appendChild(ring);
  return { tilt, ring, diameterVmin };
}

/**
 * Mouse-only, desktop-only. A ring follows the pointer while it is over the
 * background; when the pointer goes back into the window (or leaves the page) that
 * ring flies into the gyroscope and stays there, one more each time. Everything
 * moves through transform/opacity, so the work stays on the compositor; React never
 * re-renders for pointer events.
 */
export function PointerGlow() {
  const layerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const ring = ringRef.current;
    const pool = poolRef.current;
    const gyroPool = document.querySelector<HTMLElement>(".ring-pool");
    if (!layer || !ring || !pool || !gyroPool) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;

    const ripples = Array.from(pool.children) as HTMLElement[];
    const collected: HTMLElement[] = [];
    let collectedCount = 0;
    let target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let last: { x: number; y: number } | null = null;
    let travelled = 0;
    let sessionTravel = 0;
    let next = 0;
    let frame = 0;
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

    /** The pointer ring flies to the gyroscope's centre while its new ring fades in there. */
    const collect = () => {
      const { tilt, ring: newRing, diameterVmin } = createCollectedRing(collectedCount);
      collectedCount += 1;
      newRing.style.opacity = "0";
      gyroPool.appendChild(tilt);
      collected.push(tilt);
      newRing
        .animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, delay: 450, easing: "ease-out", fill: "forwards" })
        .finished.then(() => {
          newRing.style.opacity = "";
        })
        .catch(() => {});

      if (collected.length > MAX_COLLECTED) {
        const oldest = collected.shift()!;
        const oldRing = oldest.firstElementChild as HTMLElement | null;
        const fade = oldRing?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1200, fill: "forwards" });
        if (fade) fade.finished.then(() => oldest.remove()).catch(() => oldest.remove());
        else oldest.remove();
      }

      const centre = gyroPool.getBoundingClientRect();
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      const endScale = (diameterVmin * vmin) / POINTER_RING_PX;
      const flyer = ring.cloneNode(true) as HTMLElement;
      flyer.style.transition = "none";
      flyer.style.opacity = "1";
      layer.appendChild(flyer);
      flyer
        .animate(
          [
            { transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(1)`, opacity: 1 },
            { transform: `translate3d(${centre.left}px, ${centre.top}px, 0) scale(${endScale})`, opacity: 0 },
          ],
          { duration: 1100, easing: "cubic-bezier(0.5, 0, 0.2, 1)", fill: "forwards" },
        )
        .finished.then(() => flyer.remove())
        .catch(() => flyer.remove());

      // The follower hides at once: the flyer has taken its place.
      ring.style.transition = "none";
      show(false);
      void ring.offsetWidth;
      ring.style.transition = "";
    };

    /** The pointer stopped being over the background: keep its ring if it travelled there. */
    const leaveBackground = () => {
      if (visible && sessionTravel >= MIN_TRAVEL) collect();
      else show(false);
      last = null;
      sessionTravel = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if ((event.target as Element | null)?.closest(".window")) {
        if (visible || last) leaveBackground();
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      if (!visible && !last) {
        pos.x = x;
        pos.y = y;
        ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      target = { x, y };
      show(true);
      if (!frame) frame = requestAnimationFrame(tick);
      if (last) {
        const step = Math.hypot(x - last.x, y - last.y);
        sessionTravel += step;
        travelled += step;
        if (travelled >= EMIT_EVERY) {
          travelled = 0;
          emit(x, y);
        }
      }
      last = { x, y };
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", leaveBackground);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", leaveBackground);
      cancelAnimationFrame(frame);
      for (const tilt of collected) tilt.remove();
    };
  }, []);

  return (
    <div ref={layerRef} className="pointer-layer" aria-hidden>
      <div ref={ringRef} className="pointer-ring" />
      <div ref={poolRef}>
        {Array.from({ length: RIPPLES }, (_, i) => (
          <div key={i} className="ripple" />
        ))}
      </div>
    </div>
  );
}
