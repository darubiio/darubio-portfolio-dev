"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { usePortfolio } from "@/hooks/usePortfolio";

export function Stats() {
  const { stats } = usePortfolio();

  return (
    <OutputBlock>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </OutputBlock>
  );
}
