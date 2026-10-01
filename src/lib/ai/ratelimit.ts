import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Abuse + cost guardrails for the `ask` endpoint (guardrails #3 and #4).
 * Fails SAFE: when Upstash isn't configured the route serves the canned
 * fallback in production rather than hitting the model unprotected.
 */
const configured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = configured ? Redis.fromEnv() : null;

const perMinute = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "60 s"), prefix: "ask:min", analytics: false })
  : null;
const perDay = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(25, "1 d"), prefix: "ask:day", analytics: false })
  : null;

const GLOBAL_DAILY_CAP = Number(process.env.AI_DAILY_CAP) || 500;

export type LimitResult = "ok" | "rate_limited" | "budget_exceeded" | "unconfigured";

function todayKey(): string {
  // App runtime — Date is available here (unlike workflow scripts).
  return `ask:global:${new Date().toISOString().slice(0, 10)}`;
}

/** `weight` = how many units of the daily budget this call spends (fit answers are longer). */
export async function checkLimits(ip: string, weight = 1): Promise<LimitResult> {
  if (!redis || !perMinute || !perDay) return "unconfigured";

  const [minute, day] = await Promise.all([perMinute.limit(ip), perDay.limit(ip)]);
  if (!minute.success || !day.success) return "rate_limited";

  const key = todayKey();
  const count = await redis.incrby(key, weight);
  if (count === weight) await redis.expire(key, 60 * 60 * 24);
  if (count > GLOBAL_DAILY_CAP) return "budget_exceeded";

  return "ok";
}
