import { Prompt } from "@/components/terminal/Prompt";
import { CommandOutput } from "@/components/outputs/CommandOutput";
import type { HistoryEntry } from "@/lib/history";

export function HistoryView({ history }: { history: HistoryEntry[] }) {
  return (
    <>
      {history.map((item) =>
        item.kind === "input" ? (
          <div className="row" key={item.id}>
            <Prompt />
            <span className="cmd-echo">{item.input}</span>
          </div>
        ) : (
          <CommandOutput key={item.id} spec={item.spec} />
        ),
      )}
    </>
  );
}
