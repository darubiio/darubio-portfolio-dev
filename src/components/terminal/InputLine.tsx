"use client";

import { useState, type KeyboardEvent, type RefObject } from "react";
import { Prompt } from "@/components/terminal/Prompt";
import { ghostCompletion } from "@/lib/commands";
import type { useCommandHistory } from "@/hooks/useCommandHistory";

interface InputLineProps {
  inputRef: RefObject<HTMLInputElement | null>;
  run: (command: string) => void;
  clear: () => void;
  playKey: () => void;
  commandHistory: ReturnType<typeof useCommandHistory>;
}

export function InputLine({ inputRef, run, clear, playKey, commandHistory }: InputLineProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(true);

  const ghost = ghostCompletion(value);

  const submit = () => {
    run(value);
    setValue("");
  };

  const atLineEnd = (event: KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    return el.selectionStart === value.length && el.selectionEnd === value.length;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1) playKey();

    if (event.key === "Enter") {
      event.preventDefault();
      submit();
      return;
    }
    // Accept the ghost completion with → / End when the caret is at the line end.
    if ((event.key === "ArrowRight" || event.key === "End") && ghost && atLineEnd(event)) {
      event.preventDefault();
      setValue(ghost);
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
      if (ghost) setValue(ghost);
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
      {ghost ? <span className="cmd-ghost">{ghost.slice(value.length)}</span> : null}
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
