import { OutputBlock } from "@/components/outputs/OutputBlock";
import { AvatarTile } from "@/components/outputs/AvatarTile";
import { portfolio } from "@/lib/portfolio";

const { identity } = portfolio;

const ROWS: ReadonlyArray<[string, string]> = [
  ["OS", "macOS · darwin (terminal portfolio v1.0)"],
  ["Host", identity.fullName],
  ["Role", identity.role],
  ["Uptime", identity.uptime],
  ["Shell", "fira-code zsh w/ ligatures"],
  ["Theme", "One Dark Pro"],
  ["Stack", identity.stack],
  ["Location", identity.location],
  ["Status", identity.status.label],
];

const SWATCHES = ["#e06c75", "#d19a66", "#e5c07b", "#98c379", "#56b6c2", "#61afef", "#c678dd"];

export function Neofetch() {
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
          {ROWS.map(([key, value]) => (
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
