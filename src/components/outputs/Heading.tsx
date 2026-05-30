import type { ReactNode } from "react";

export function Heading({ children }: { children: ReactNode }) {
  return (
    <div className="h">
      <span className="hash">#</span>
      {children}
      <span className="rule" />
    </div>
  );
}
