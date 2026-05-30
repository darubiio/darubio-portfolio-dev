"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

interface LightboxProps {
  image: StaticImageData | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <div className={image ? "lightbox show" : "lightbox"} onClick={onClose} role="presentation">
      {image && <Image src={image} alt="Project screenshot" sizes="100vw" placeholder="blur" />}
    </div>
  );
}
