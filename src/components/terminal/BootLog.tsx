import type { BootLine } from "@/lib/types";

interface BootLogProps {
  bootLines: readonly BootLine[];
  booting: boolean;
}

export function BootLog({ bootLines, booting }: BootLogProps) {
  if (bootLines.length === 0) return null;

  return (
    <div className="out" style={{ marginBottom: booting ? 0 : 14 }}>
      {bootLines.map(([timestamp, message, status]) => (
        <div className="boot-line row" key={message}>
          <span className="ts">[{timestamp.padStart(8)}]</span> {message}{" "}
          {status === "ok" && <span className="ok">[ ok ]</span>}
          {status === "warn" && <span className="warn">[warn]</span>}
        </div>
      ))}
      {booting && <div className="row type-caret muted" style={{ marginTop: 2 }} />}
    </div>
  );
}
