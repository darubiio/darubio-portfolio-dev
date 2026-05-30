import type { CSSProperties } from "react";
import { AVATAR } from "@/lib/ascii";

export function AvatarTile({ size }: { size?: number }) {
  const style: CSSProperties | undefined = size ? { width: size, height: size } : undefined;
  return (
    <div className="avatar" style={style} aria-hidden>
      {AVATAR}
    </div>
  );
}
