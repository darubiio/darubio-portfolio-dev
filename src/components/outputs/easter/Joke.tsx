"use client";

import { useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";
import { useMessages } from "@/hooks/useMessages";

export function Joke() {
  const t = useMessages();
  // Pick an index once on mount; the message lookup stays reactive to language.
  const [index] = useState(() => Math.floor(Math.random() * t.easter.jokes.length));
  const joke = t.easter.jokes[index] ?? t.easter.jokes[0];

  return (
    <OutputBlock>
      <div className="row str">{joke}</div>
    </OutputBlock>
  );
}
