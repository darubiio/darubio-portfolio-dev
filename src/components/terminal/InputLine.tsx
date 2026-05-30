"use client";

import { useState, type KeyboardEvent, type RefObject } from "react";
import { Prompt } from "@/components/terminal/Prompt";
import { AUTOCOMPLETE } from "@/lib/commands";
import type { useCommandHistory } from "@/hooks/useCommandHistory";

interface InputLineProps {
  inputRef: RefObject<HTMLInputElement>;
  run: (command: string) => void;
  clear: () => void;
  playKey: () => void;
  commandHistory: ReturnType<typeof useCommandHistory>;
}

export function InputLine({ inputRef, run, clear, playKey, commandHistory }: InputLineProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(true);

  const submit = () => {
    run(value);
    setValue("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1) playKey();

    if (event.key === "Enter") {
      event.preventDefault();
      submit();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previous = commandHistory.previous();
      if (previous !== null) setValue(previous);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = commandHistory.next();
      if (next !== null) setValue(next);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const match = value && AUTOCOMPLETE.find((command) => command.startsWith(value.toLowerCase()));
      if (match) setValue(match);
      return;
    }
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <form
      className={focused ? "input-bar" : "input-bar blurred"}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Prompt />
      <span className="cmd-echo" style={{ whiteSpace: "pre" }}>
        {value}
      </span>
      <span className="bcaret" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="terminal input"
      />
    </form>
  );
}
