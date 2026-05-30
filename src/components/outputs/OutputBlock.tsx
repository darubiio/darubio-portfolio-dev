import type { ReactNode } from "react";

export function OutputBlock({ children }: { children: ReactNode }) {
  return <div className="out">{children}</div>;
}
