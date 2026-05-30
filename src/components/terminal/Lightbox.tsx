"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface LightboxProps {
  image: StaticImageData | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!image) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [image, onClose]);

  return (
    <div
      className={image ? "lightbox show" : "lightbox"}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Project screenshot"
      aria-hidden={image ? undefined : true}
    >
      {image ? <Image src={image} alt="Project screenshot" sizes="100vw" placeholder="blur" /> : null}
    </div>
  );
}
