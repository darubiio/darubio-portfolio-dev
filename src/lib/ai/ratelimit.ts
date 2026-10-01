import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Abuse + cost guardrails for the `ask` endpoint (guardrails #3 and #4).
 * Fails SAFE: when Upstash isn't configured the route serves the canned
 * fallback in production rather than hitting the model unprotected.
 */
/**
 * A missing or malformed env var (e.g. a rediss:// connection string instead of the
 * https REST URL) must degrade to "unconfigured", never crash module evaluation —
 * that would fail the whole build on Vercel.
 */
function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || !url.startsWith("https://")) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}
const redis = createRedis();

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
