"use client";

import Image from "next/image";
import { useTerminal } from "@/context/TerminalContext";
import { SCREENSHOTS } from "@/lib/screenshots";
import type { Screenshot } from "@/lib/types";

export function ScreenshotStrip({ shots }: { shots: Screenshot[] }) {
  const { openLightbox } = useTerminal();

  return (
    <div className="shots">
      {shots.map((shot) => (
        <div className="shot" key={shot.src}>
          <button
            type="button"
            className="shot-img"
            onClick={() => openLightbox(SCREENSHOTS[shot.src])}
            aria-label={`View screenshot: ${shot.cap}`}
          >
            <Image
              src={SCREENSHOTS[shot.src]}
              alt={shot.cap}
              sizes="(max-width: 720px) 78vw, 260px"
              placeholder="blur"
              loading="lazy"
            />
          </button>
          <div className="cap">{shot.cap}</div>
        </div>
      ))}
    </div>
  );
}
