/**
 * Deterministic prompt-injection / jailbreak detection. The system prompt holds
 * only public portfolio data (no secrets), but a model that emits "HACKED",
 * role-plays, or dumps its instructions reads as broken to a technical visitor.
 * These egregious patterns are short-circuited to a fixed refusal before the
 * model is ever called — the model-level rules are only the second line.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+|your\s+|the\s+|previous\s+|prior\s+|above\s+)*(?:instructions|rules|prompt|context)/i,
  /disregard\s+(?:all\s+|your\s+|the\s+|previous\s+)*(?:instructions|rules|prompt)/i,
  /forget\s+(?:everything|all|your|the\s+previous|previous|prior)/i,
  /system\s*prompt/i,
  /\b(?:reveal|repeat|print|show|output|expose|leak|tell me)\b[\s\S]*\b(?:prompt|instructions|rules|guidelines)\b/i,
  /\bverbatim\b/i,
  /\b(?:you are now|act as|pretend to be|roleplay as|role-play as|behave as)\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bjailbreak/i,
  /\bD\.?A\.?N\.?\b/,
  /\bprompt\s+injection\b/i,
  /new\s+instructions?\s*:/i,
];

export function looksLikeInjection(question: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(question));
}
