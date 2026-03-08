import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

const TOKEN_CACHE_PATH = resolve(__dirname, "../../.tokens.json");
const ENV_PATH = resolve(__dirname, "../../.env");

/** Write new tokens back to .env so they persist across runs. */
function updateEnvFile(accessToken: string, refreshToken: string) {
  try {
    let envContent = readFileSync(ENV_PATH, "utf-8");
    envContent = envContent.replace(/^PRINTWAY_ACCESS_TOKEN=.*/m, `PRINTWAY_ACCESS_TOKEN=${accessToken}`);
    envContent = envContent.replace(/^PRINTWAY_REFRESH_TOKEN=.*/m, `PRINTWAY_REFRESH_TOKEN=${refreshToken}`);
    writeFileSync(ENV_PATH, envContent);
  } catch {
    // Non-critical — token cache still works
  }
}

/** Refresh access token once before all integration tests. */
export async function setup() {
  config(); // load .env

  const refreshToken = process.env.PRINTWAY_REFRESH_TOKEN;
  const baseUrl = process.env.PRINTWAY_BASE_URL || "https://apis.printway.io/v3";
  const accessToken = process.env.PRINTWAY_ACCESS_TOKEN || "";

  if (!refreshToken) {
    writeFileSync(TOKEN_CACHE_PATH, JSON.stringify({ accessToken, refreshToken: "" }));
    return;
  }

  try {
    // Don't send pw-access-token — refresh token in query param is the credential
    const response = await fetch(`${baseUrl}/auth/refresh-token?refresh_token=${refreshToken}`, {
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();

    if (body.success && body.data?.accessToken) {
      const newAccess = body.data.accessToken;
      const newRefresh = body.data.refreshToken;
      writeFileSync(TOKEN_CACHE_PATH, JSON.stringify({ accessToken: newAccess, refreshToken: newRefresh }));
      updateEnvFile(newAccess, newRefresh);
      console.log("[Integration Setup] Token refreshed successfully");
    } else {
      writeFileSync(TOKEN_CACHE_PATH, JSON.stringify({ accessToken, refreshToken }));
      console.warn("[Integration Setup] Token refresh failed, using existing tokens");
    }
  } catch {
    writeFileSync(TOKEN_CACHE_PATH, JSON.stringify({ accessToken, refreshToken }));
    console.warn("[Integration Setup] Token refresh error, using existing tokens");
  }
}

export async function teardown() {
  if (existsSync(TOKEN_CACHE_PATH)) unlinkSync(TOKEN_CACHE_PATH);
}
