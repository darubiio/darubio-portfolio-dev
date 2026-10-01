"use client";

import { useTerminal } from "@/context/TerminalContext";

export function TrafficLights() {
  const { run } = useTerminal();

  return (
    <div className="lights">
      <button type="button" className="light r" title="clear" onClick={() => run("clear")}>
        <span className="sr-only">Clear screen</span>
      </button>
      <button type="button" className="light y" title="theme" onClick={() => run("theme")}>
        <span className="sr-only">Toggle theme</span>
      </button>
      <button type="button" className="light g" title="neofetch" onClick={() => run("neofetch")}>
        <span className="sr-only">Run neofetch</span>
      </button>
    </div>
  );
}
