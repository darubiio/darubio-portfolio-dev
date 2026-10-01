import Image from "next/image";
import avatar from "../../../public/assets/avatar.webp";
import { portfolio } from "@/lib/portfolio";

export function AvatarTile({ size = 96 }: { size?: number }) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <Image src={avatar} alt={portfolio.identity.fullName} width={size} height={size} sizes={`${size}px`} placeholder="blur" priority />
    </div>
  );
}
