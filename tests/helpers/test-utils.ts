import { vi } from "vitest";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { Printway } from "../../src";

export const MOCK_TOKEN = "test-access-token";

const TOKEN_CACHE_PATH = resolve(__dirname, "../../.tokens.json");

export function mockFetch(response: object, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
  });
}

export function createMockClient(): Printway {
  return new Printway({ accessToken: MOCK_TOKEN });
}

// Integration test helpers — reads cached tokens from global setup, falls back to .env
function getCachedTokens(): { accessToken: string; refreshToken: string } {
  if (existsSync(TOKEN_CACHE_PATH)) {
    return JSON.parse(readFileSync(TOKEN_CACHE_PATH, "utf-8"));
  }
  return {
    accessToken: process.env.PRINTWAY_ACCESS_TOKEN || "",
    refreshToken: process.env.PRINTWAY_REFRESH_TOKEN || "",
  };
}

/** Persist refreshed tokens to cache file so subsequent test workers pick them up. */
function saveTokensToCache(accessToken: string, refreshToken: string) {
  writeFileSync(TOKEN_CACHE_PATH, JSON.stringify({ accessToken, refreshToken }));
}

export function createLiveClient(): Printway {
  const tokens = getCachedTokens();
  if (!tokens.accessToken) throw new Error("No access token available (check .env or global-setup)");
  const client = new Printway({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    baseUrl: process.env.PRINTWAY_BASE_URL,
    enableLogging: true,
  });
  // When auto-refresh triggers, persist new tokens for other test files
  client.onTokenRefresh((newAccess, newRefresh) => {
    saveTokensToCache(newAccess, newRefresh);
  });
  return client;
}

let _apiReachable: boolean | null = null;

export async function isApiReachable(): Promise<boolean> {
  if (_apiReachable !== null) return _apiReachable;
  const baseUrl = process.env.PRINTWAY_BASE_URL || "https://apis.printway.io/v3";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(`${baseUrl}/products/list?limit=1`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "pw-access-token": "ping" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    _apiReachable = true;
  } catch {
    console.warn("[Integration] Printway API unreachable - tests will be skipped");
    _apiReachable = false;
  }
  return _apiReachable;
}
