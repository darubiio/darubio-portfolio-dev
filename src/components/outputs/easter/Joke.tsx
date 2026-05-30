"use client";

import { useState } from "react";
import { OutputBlock } from "@/components/outputs/OutputBlock";

const JOKES = [
  "There are 10 kinds of people: those who read binary and those who don't.",
  "It works on my machine. ¯\\_(ツ)_/¯  Ship the laptop then.",
  "A SQL query walks into a bar, sees two tables and asks: 'Can I JOIN you?'",
  "Why do Java devs wear glasses? Because they don't C#.",
  "99 little bugs in the code, take one down, patch it around... 127 little bugs in the code.",
];

export function Joke() {
  const [joke] = useState(() => JOKES[Math.floor(Math.random() * JOKES.length)]);
  return (
    <OutputBlock>
      <div className="row str">{joke}</div>
    </OutputBlock>
  );
}
