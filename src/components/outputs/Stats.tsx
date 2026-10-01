"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useTerminal } from "@/context/TerminalContext";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

export function Stats() {
  const { stats } = usePortfolio();
  const { run } = useTerminal();
  const t = useMessages();

  return (
    <OutputBlock>
      <div className="stats-grid">
        {stats.map((stat) => (
          <button
            type="button"
            className="stat-card"
            key={stat.unit}
            onClick={() => run(stat.cmd)}
          >
            <span className="stat-see" aria-hidden>
              ↳ {stat.cmd}
            </span>
            <div className="stat-value">
              {stat.value}
              <span className="stat-unit">{stat.unit}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
            <span className="sr-only">
              — {t.stats.see} {stat.cmd}
            </span>
          </button>
        ))}
      </div>
    </OutputBlock>
  );
}
