import { Prompt } from "@/components/terminal/Prompt";
import { CommandOutput } from "@/components/outputs/CommandOutput";
import type { HistoryEntry } from "@/lib/history";

export function HistoryView({ history }: { history: HistoryEntry[] }) {
  return (
    <>
      {history.map((item) =>
        item.kind === "input" ? (
          <div className="row" key={item.id}>
            <Prompt mode={item.prompt} />
            <span className="cmd-echo">{item.input}</span>
          </div>
        ) : item.instant ? (
          <div className="instant" key={item.id}>
            <CommandOutput spec={item.spec} />
          </div>
        ) : (
          <CommandOutput key={item.id} spec={item.spec} />
        ),
      )}
    </>
  );
}
