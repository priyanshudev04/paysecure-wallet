import { Redis } from '@upstash/redis';

export const OTP_EXPIRY = 300; // 5 minutes
export const MAX_OTP_ATTEMPTS = 3;
export const RATE_LIMIT_WINDOW = 60; // 1 minute
export const MAX_OTP_REQUESTS = 3;

// In-memory fallback store for when Redis is unavailable
const memStore = new Map<string, { value: string; expiresAt: number }>();

function cleanExpired() {
  const now = Date.now();
  for (const [key, entry] of memStore) {
    if (entry.expiresAt <= now) memStore.delete(key);
  }
}

let redisClient: Redis | null = null;
let useMemory = false;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch {
  useMemory = true;
}

async function redisSet(key: string, value: string, exSec: number) {
  if (!useMemory && redisClient) {
    try {
      await redisClient.set(key, value, { ex: exSec });
      return;
    } catch {
      useMemory = true;
    }
  }
  memStore.set(key, { value, expiresAt: Date.now() + exSec * 1000 });
}

async function redisGet(key: string): Promise<string | null> {
  cleanExpired();
  if (!useMemory && redisClient) {
    try {
      const val = await redisClient.get(key);
      return val as string | null;
    } catch {
      useMemory = true;
    }
  }
  const entry = memStore.get(key);
  if (!entry || entry.expiresAt <= Date.now()) {
    memStore.delete(key);
    return null;
  }
  return entry.value;
}

async function redisDel(key: string) {
  memStore.delete(key);
  if (!useMemory && redisClient) {
    try {
      await redisClient.del(key);
    } catch {
      useMemory = true;
    }
  }
}

async function redisTtl(key: string): Promise<number> {
  cleanExpired();
  if (!useMemory && redisClient) {
    try {
      return await redisClient.ttl(key);
    } catch {
      useMemory = true;
    }
  }
  const entry = memStore.get(key);
  if (!entry) return -2;
  return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
}

async function redisIncr(key: string): Promise<number> {
  cleanExpired();
  if (!useMemory && redisClient) {
    try {
      return await redisClient.incr(key);
    } catch {
      useMemory = true;
    }
  }
  const entry = memStore.get(key);
  const current = entry && entry.expiresAt > Date.now() ? parseInt(entry.value || '0', 10) : 0;
  const next = current + 1;
  // Keep existing expiry if present, otherwise set later
  if (entry && entry.expiresAt > Date.now()) {
    entry.value = String(next);
  } else {
    memStore.set(key, { value: String(next), expiresAt: Date.now() + RATE_LIMIT_WINDOW * 1000 });
  }
  return next;
}

export async function setOtp(phone: string, hashedOtp: string) {
  const key = `otp:${phone}`;
  await redisSet(key, JSON.stringify({ otp: hashedOtp, attempts: 0 }), OTP_EXPIRY);
}

export async function getOtpData(phone: string) {
  const key = `otp:${phone}`;
  const data = await redisGet(key);
  return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
}

export async function incrementAttempts(phone: string, currentData: { otp: string; attempts: number }) {
  const key = `otp:${phone}`;
  const newData = { ...currentData, attempts: currentData.attempts + 1 };
  const ttl = await redisTtl(key);
  if (ttl > 0) {
    await redisSet(key, JSON.stringify(newData), ttl);
  }
}

export async function deleteOtp(phone: string) {
  await redisDel(`otp:${phone}`);
}

export async function checkRateLimit(phone: string) {
  const key = `ratelimit:otp:${phone}`;
  const count = await redisIncr(key);
  return count <= MAX_OTP_REQUESTS;
}
