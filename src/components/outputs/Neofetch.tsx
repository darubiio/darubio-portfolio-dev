"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AvatarTile } from "@/components/outputs/AvatarTile";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";

const SWATCHES = ["#e06c75", "#d19a66", "#e5c07b", "#98c379", "#56b6c2", "#61afef", "#c678dd"];

export function Neofetch() {
  const { identity } = usePortfolio();
  const t = useMessages();

  const rows: ReadonlyArray<[string, string]> = [
    [t.neofetch.os, "macOS · darwin (terminal portfolio v1.0)"],
    [t.neofetch.host, identity.fullName],
    [t.neofetch.role, identity.role],
    [t.neofetch.uptime, identity.uptime],
    [t.neofetch.shell, "fira-code zsh w/ ligatures"],
    [t.neofetch.theme, "One Dark Pro"],
    [t.neofetch.stack, identity.stack],
    [t.neofetch.location, identity.location],
    [t.neofetch.status, identity.status.label],
  ];

  return (
    <OutputBlock>
      <div className="about-grid">
        <AvatarTile size={110} />
        <div>
          <div className="row">
            <span className="fn b">{identity.handle}</span>
            <span className="muted">@</span>
            <span className="b" style={{ color: "var(--purple)" }}>
              portfolio
            </span>
          </div>
          <div className="row muted" style={{ marginBottom: 6 }}>
            {"─".repeat(28)}
          </div>
          {rows.map(([key, value]) => (
            <div className="row" key={key}>
              <span className="fn" style={{ display: "inline-block", minWidth: 90 }}>
                {key}
              </span>
              <span className="muted">: </span>
              <span>{value}</span>
            </div>
          ))}
          <div className="chips" style={{ marginTop: 10 }}>
            {SWATCHES.map((color) => (
              <span
                key={color}
                style={{ width: 18, height: 18, borderRadius: 4, background: color, display: "inline-block" }}
              />
            ))}
          </div>
        </div>
      </div>
    </OutputBlock>
  );
}
