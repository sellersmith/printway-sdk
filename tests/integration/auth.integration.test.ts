import { describe, it, expect, beforeAll } from "vitest";
import { Printway } from "../../src";
import { createLiveClient, isApiReachable } from "../helpers/test-utils";

const canRun = await isApiReachable();

describe.runIf(canRun)("Auth (integration)", () => {
  let client: Printway;

  beforeAll(() => {
    client = createLiveClient();
  });

  it("should refresh token", async () => {
    const refreshToken = process.env.PRINTWAY_REFRESH_TOKEN;
    if (!refreshToken) {
      console.warn("PRINTWAY_REFRESH_TOKEN not set, skipping");
      return;
    }

    const result = await client.auth.refreshToken(refreshToken);
    expect(result.success).toBe(true);
    expect(result.data.accessToken).toBeTruthy();
    expect(result.data.refreshToken).toBeTruthy();
  });
});
