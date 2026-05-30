"use client";

import { useEffect, useRef } from "react";
import { MATRIX_GLYPHS } from "@/lib/ascii";

const CELL = 16;

export function MatrixRain({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const glyphs = MATRIX_GLYPHS.split("");
    const drops = new Array(Math.floor(canvas.width / CELL)).fill(1);
    const green = getComputedStyle(document.documentElement).getPropertyValue("--green").trim() || "#98c379";

    let frame = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = green;
      ctx.font = "15px Fira Code, monospace";
      for (let i = 0; i < drops.length; i += 1) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(glyph, i * CELL, drops[i] * CELL);
        if (drops[i] * CELL > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    let armed = false;
    const arm = window.setTimeout(() => {
      armed = true;
    }, 100);
    const exit = () => {
      if (armed) onExit();
    };
    window.addEventListener("keydown", exit);
    window.addEventListener("pointerdown", exit);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(arm);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", exit);
      window.removeEventListener("pointerdown", exit);
    };
  }, [onExit]);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden />;
}
