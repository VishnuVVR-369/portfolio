import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Two sliding windows applied per IP, both must pass:
//   - burst:  20 requests / 10 min  (cheap noise filter)
//   - daily: 100 requests / 24h     (cost ceiling)
//
// If Upstash env vars are missing (e.g. local dev without a Redis), the
// limiter degrades to allow-all. The route handler logs this explicitly
// so the lack of protection isn't silent.

type LimitResult = {
  success: boolean;
  reason?: "burst" | "daily" | "configured-off";
  retryAfterSec?: number;
};

const haveUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = haveUpstash ? Redis.fromEnv() : null;

const burst = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 m"),
      analytics: false,
      prefix: "vvr:chat:burst",
    })
  : null;

const daily = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 d"),
      analytics: false,
      prefix: "vvr:chat:daily",
    })
  : null;

export async function checkRateLimit(key: string): Promise<LimitResult> {
  if (!burst || !daily) return { success: true, reason: "configured-off" };
  const b = await burst.limit(key);
  if (!b.success) {
    return {
      success: false,
      reason: "burst",
      retryAfterSec: Math.max(1, Math.ceil((b.reset - Date.now()) / 1000)),
    };
  }
  const d = await daily.limit(key);
  if (!d.success) {
    return {
      success: false,
      reason: "daily",
      retryAfterSec: Math.max(1, Math.ceil((d.reset - Date.now()) / 1000)),
    };
  }
  return { success: true };
}

export const rateLimitConfigured = haveUpstash;
