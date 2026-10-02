import { Prompt } from "@/components/terminal/Prompt";
import { CommandOutput } from "@/components/outputs/CommandOutput";
import type { HistoryEntry } from "@/lib/history";

export function HistoryView({ history }: { history: HistoryEntry[] }) {
  return (
    <>
      {history.map((item) =>
        item.kind === "input" ? (
          <div className="row" key={item.id} data-echo data-entry={item.id}>
            <Prompt mode={item.prompt} />
            <span className="cmd-echo">{item.input}</span>
          </div>
        ) : (
          // `display: contents` wrapper: addressable for the palette's scroll-to, invisible to layout.
          <div className={item.instant ? "entry instant" : "entry"} key={item.id} data-entry={item.id}>
            <CommandOutput spec={item.spec} />
          </div>
        ),
      )}
    </>
  );
}
