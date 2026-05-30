import type { ReactNode } from "react";

export function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="crow">
      <span className="k">{label}</span>
      {children}
    </div>
  );
}
