import type { BootLine } from "@/lib/types";

interface BootLogProps {
  /** Lines revealed so far. */
  bootLines: readonly BootLine[];
  /** The full sequence: unrevealed lines are laid out invisibly so nothing shifts as they appear. */
  lines: readonly BootLine[];
  booting: boolean;
}

function Line({ line, hidden }: { line: BootLine; hidden: boolean }) {
  const [timestamp, message, status] = line;
  return (
    <div className="boot-line row" style={hidden ? { visibility: "hidden" } : undefined} aria-hidden={hidden || undefined}>
      <span className="ts">[{timestamp.padStart(8)}]</span>
      <span className="msg">{message}</span>
      {status ? <span className="leader" aria-hidden /> : null}
      {status === "ok" ? <span className="ok">[ ok ]</span> : null}
      {status === "warn" ? <span className="warn">[warn]</span> : null}
    </div>
  );
}

export function BootLog({ bootLines, lines, booting }: BootLogProps) {
  if (bootLines.length === 0 && !booting) return null;
  const shown = bootLines.length;
  const all = shown >= lines.length ? bootLines : [...bootLines, ...lines.slice(shown)];

  // The caret lives on its own always-present row (hidden after boot) so adding
  // it never re-wraps a line: zero layout shift.
  return (
    <div className="out boot-log" style={{ marginBottom: 0 }}>
      {all.map((line, index) => (
        <Line key={line[1]} line={line} hidden={index >= shown} />
      ))}
      <div className="row type-caret muted" style={booting ? undefined : { visibility: "hidden" }} aria-hidden />
    </div>
  );
}
