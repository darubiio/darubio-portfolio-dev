"use client";

import { useId, useState, type KeyboardEvent, type RefObject } from "react";
import { Prompt } from "@/components/terminal/Prompt";
import { useTerminal } from "@/context/TerminalContext";
import { useLang } from "@/hooks/useLang";
import { useMessages } from "@/hooks/useMessages";
import { suggest, type Suggestion } from "@/lib/suggest";
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
  // Selection in the suggestion list; `navigated` once the visitor moved it with the arrows.
  const [selected, setSelected] = useState(0);
  const [navigated, setNavigated] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { chatMode } = useTerminal();
  const { lang } = useLang();
  const t = useMessages();
  const listId = useId();

  // In chat mode every line is free text: no command completion.
  const suggestions = chatMode || dismissed ? [] : suggest(value, lang, t);
  const open = suggestions.length > 0;
  const active = open ? suggestions[Math.min(selected, suggestions.length - 1)] : null;
  const ghost = active && active.value.startsWith(value.toLowerCase()) ? active.value.slice(value.length) : "";

  const update = (next: string) => {
    setValue(next);
    setSelected(0);
    setNavigated(false);
    setDismissed(false);
  };

  const submit = (line = value) => {
    run(line);
    update("");
  };

  const accept = (suggestion: Suggestion) => update(suggestion.value);

  /** Clicking a suggestion runs it, unless it still needs an argument (ask …, fit …). */
  const choose = (suggestion: Suggestion) => {
    playKey();
    if (suggestion.takesArgument) accept(suggestion);
    else submit(suggestion.value.trim());
    inputRef.current?.focus();
  };

  const move = (step: number) => {
    setSelected((current) => (current + step + suggestions.length) % suggestions.length);
    setNavigated(true);
  };

  const atLineEnd = (event: KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    return el.selectionStart === value.length && el.selectionEnd === value.length;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1) playKey();

    if (event.key === "Enter") {
      event.preventDefault();
      // Enter runs what was typed, or the suggestion picked with the arrows.
      submit(navigated && active ? active.value.trim() : value);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      if (!open || !active) return;
      // Tab completes; repeated Tab cycles through the list (Shift+Tab backwards).
      if (navigated || value.trimEnd() === active.value.trimEnd()) move(event.shiftKey ? -1 : 1);
      else accept(active);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setDismissed(true);
      return;
    }
    // Accept the ghost completion with → / End when the caret is at the line end.
    if ((event.key === "ArrowRight" || event.key === "End") && ghost && active && atLineEnd(event)) {
      event.preventDefault();
      accept(active);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (open) {
        move(event.key === "ArrowUp" ? -1 : 1);
        return;
      }
      const recalled = event.key === "ArrowUp" ? commandHistory.previous() : commandHistory.next();
      if (recalled !== null) {
        update(recalled);
        setDismissed(true);
      }
      return;
    }
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      clear();
    }
  };

  const optionId = (index: number) => `${listId}-${index}`;

  return (
    <form
      className={focused ? "input-bar" : "input-bar blurred"}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {open && focused ? (
        <div className="suggest" role="presentation">
          <ul id={listId} role="listbox" aria-label="commands">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.value}
                id={optionId(index)}
                role="option"
                aria-selected={suggestion === active}
                className={suggestion === active ? "on" : undefined}
                // Keep focus in the input: a mousedown elsewhere would blur it and close the list.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion)}
                onMouseEnter={() => setSelected(index)}
              >
                <span className="s-name">{suggestion.label}</span>
                <span className="s-desc">{suggestion.description}</span>
              </li>
            ))}
          </ul>
          <div className="s-hint">{t.suggest.hint}</div>
        </div>
      ) : null}
      <Prompt mode={chatMode ? "ai" : "shell"} />
      {/* Text, caret and ghost share one inline flow so long input wraps like a real terminal. */}
      <span className="cmd-line">
        <span className="cmd-echo">{value}</span>
        <span className="bcaret" />
        {ghost ? <span className="cmd-ghost">{ghost}</span> : null}
      </span>
      <input
        maxLength={3200}
        ref={inputRef}
        value={value}
        onChange={(event) => update(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        role="combobox"
        aria-label="terminal input"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active ? optionId(suggestions.indexOf(active)) : undefined}
      />
    </form>
  );
}
