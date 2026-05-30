"use client";

import type { ReactNode } from "react";
import { useTerminal } from "@/context/TerminalContext";

interface CommandLinkProps {
  cmd?: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  children: ReactNode;
}

export function CommandLink({ cmd, href, external = false, download = false, children }: CommandLinkProps) {
  const { run } = useTerminal();

  if (href) {
    const rel = external ? "noreferrer" : undefined;
    const target = external ? "_blank" : undefined;
    return (
      <a className="link" href={href} target={target} rel={rel} download={download || undefined}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className="link" onClick={() => run(cmd ?? "")}>
      {children}
    </button>
  );
}
