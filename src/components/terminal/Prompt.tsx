import type { PromptMode } from "@/lib/history";

export function Prompt({ mode = "shell" }: { mode?: PromptMode }) {
  if (mode === "ai") {
    return (
      <span className="ps1 ai">
        <span className="prompt-ai">ai</span>
        <span> </span>
        <span className="caret">❯</span>
        <span> </span>
      </span>
    );
  }
  return (
    <span className="ps1">
      <span className="prompt-user">darubio</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">portfolio</span>
      <span> </span>
      <span className="prompt-tilde">~</span>
      <span> </span>
      <span className="caret">$</span>
      <span> </span>
    </span>
  );
}
