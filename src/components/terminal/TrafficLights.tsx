"use client";

import { useTerminal } from "@/context/TerminalContext";

export function TrafficLights() {
  const { run } = useTerminal();

  return (
    <div className="lights">
      <button type="button" className="light r" title="exit" aria-label="Clear screen" onClick={() => run("clear")} />
      <button type="button" className="light y" title="theme" aria-label="Toggle theme" onClick={() => run("theme")} />
      <button type="button" className="light g" title="neofetch" aria-label="Run neofetch" onClick={() => run("neofetch")} />
    </div>
  );
}
