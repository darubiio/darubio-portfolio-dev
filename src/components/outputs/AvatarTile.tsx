import Image from "next/image";
import avatar from "../../../public/assets/avatar.webp";
import { portfolio } from "@/lib/portfolio";

interface AvatarTileProps {
  size?: number;
  /** Above the fold (the landing's About): load right away instead of lazily. */
  eager?: boolean;
}

/**
 * Static import: Next knows the intrinsic size (no layout shift), generates the blur
 * placeholder at build time and serves AVIF/WebP. Fixed size and no `sizes`, so
 * the srcset is just 1x/2x of the tile: the 640px source never reaches the browser.
 */
export function AvatarTile({ size = 96, eager = false }: AvatarTileProps) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <Image
        src={avatar}
        alt={portfolio.identity.fullName}
        width={size}
        height={size}
        quality={85}
        placeholder="blur"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}
