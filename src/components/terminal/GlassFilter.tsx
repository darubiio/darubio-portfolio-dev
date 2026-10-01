"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Liquid-glass edge refraction for the terminal window (Chromium only — see
 * html.lg in layout.tsx). A displacement map (R = dx, G = dy, 128 = neutral)
 * drives feDisplacementMap inside backdrop-filter, so the backdrop bends only
 * within a BEZEL-wide band along the rounded edge.
 *
 * The map is drawn on a canvas at the window's exact size and only rebuilt on
 * resize: Chromium's backdrop-filter path ignores feImage with
 * preserveAspectRatio="none", so a stretched static asset is not an option.
 * Only the bezel band is computed (perimeter × BEZEL pixels); the interior is
 * a single typed-array fill.
 */
const BEZEL = 32;
const RADIUS = 16; // keep in sync with .window border-radius
const SCALE = -72; // negative = sample inward → convex lens (edges magnify)
// The map is built at half resolution and upscaled by feImage: the bezel is a
// smooth gradient, so nothing is lost, and PNG encoding (the costly part) is 4× cheaper.
const MAP_SCALE = 0.5;
const SMALL_SCREEN = "(max-width: 720px)"; // refraction is off there (app.css)

function buildMap(cssW: number, cssH: number): string {
  const w = Math.ceil(cssW * MAP_SCALE);
  const h = Math.ceil(cssH * MAP_SCALE);
  const bezel = BEZEL * MAP_SCALE;
  const radius = RADIUS * MAP_SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const image = ctx.createImageData(w, h);
  new Uint32Array(image.data.buffer).fill(0xff808080); // neutral gray, opaque
  const d = image.data;
  const hw = w / 2;
  const hh = h / 2;
  // Signed distance to the rounded box: < 0 inside.
  const sdf = (x: number, y: number) => {
    const qx = Math.abs(x) - (hw - radius);
    const qy = Math.abs(y) - (hh - radius);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
  };
  const paint = (i: number, j: number) => {
    const x = i + 0.5 - hw;
    const y = j + 0.5 - hh;
    const t = Math.min(Math.max(-sdf(x, y) / bezel, 0), 1);
    const m = 1 - Math.pow(1 - Math.pow(1 - t, 4), 0.25); // convex squircle: 1 at edge → 0
    if (m <= 0) return;
    let nx = sdf(x + 0.5, y) - sdf(x - 0.5, y);
    let ny = sdf(x, y + 0.5) - sdf(x, y - 0.5);
    const len = Math.hypot(nx, ny) || 1;
    nx /= len;
    ny /= len;
    const o = (j * w + i) * 4;
    d[o] = Math.round(128 + nx * m * 127);
    d[o + 1] = Math.round(128 + ny * m * 127);
  };
  const b = Math.ceil(bezel);
  for (let j = 0; j < h; j += 1) {
    if (j < b || j >= h - b) {
      for (let i = 0; i < w; i += 1) paint(i, j);
    } else {
      for (let i = 0; i < b; i += 1) paint(i, j);
      for (let i = w - b; i < w; i += 1) paint(i, j);
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function GlassFilter({ target }: { target: RefObject<HTMLElement | null> }) {
  const filterRef = useRef<SVGFilterElement>(null);
  const imageRef = useRef<SVGFEImageElement>(null);

  useLayoutEffect(() => {
    const el = target.current;
    const filter = filterRef.current;
    const image = imageRef.current;
    if (!el || !filter || !image || !document.documentElement.classList.contains("lg")) return;
    const small = matchMedia(SMALL_SCREEN);

    let frame = 0;
    const sync = () => {
      if (small.matches) return; // no refraction on small screens: don't pay for the map
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      for (const node of [filter, image]) {
        node.setAttribute("width", String(w));
        node.setAttribute("height", String(h));
      }
      image.setAttribute("href", buildMap(w, h));
    };
    // No manual first call: ResizeObserver always fires once on observe (before paint).
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [target]);

  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <filter
        ref={filterRef}
        id="lg"
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        x="0"
        y="0"
        colorInterpolationFilters="sRGB"
      >
        <feImage ref={imageRef} x="0" y="0" preserveAspectRatio="xMidYMid slice" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={SCALE} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
