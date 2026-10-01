import OpenAI from "openai";

type ProviderName = "groq" | "openai";

interface ProviderConfig {
  baseURL?: string;
  apiKey: string | undefined;
  model: string;
}

const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
};

const active: ProviderName = process.env.AI_PROVIDER === "openai" ? "openai" : "groq";
const config = PROVIDERS[active];

/** Whether a live model is wired up. Cheap to call; guards every code path. */
export function aiEnabled(): boolean {
  return process.env.AI_ENABLED !== "false" && Boolean(config.apiKey);
}

const client = config.apiKey
  ? new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL })
  : null;

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

/** Streams the model's answer as text chunks. Single-turn, tightly capped. */
export async function streamChat(messages: ChatMessage[], signal?: AbortSignal): Promise<AsyncIterable<string>> {
  if (!client) throw new Error("AI client not configured");

  const completion = await client.chat.completions.create(
    { model: config.model, messages, stream: true, temperature: 0.3, max_tokens: 250 },
    { signal },
  );

  return (async function* () {
    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  })();
}
