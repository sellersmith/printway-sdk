import { describe, it, expect, beforeAll } from "vitest";
import { Printway } from "../../src";
import { createLiveClient, isApiReachable } from "../helpers/test-utils";

const canRun = await isApiReachable();

describe.runIf(canRun)("Transactions (integration)", () => {
  let client: Printway;

  beforeAll(() => {
    client = createLiveClient();
  });

  it("should list transactions", async () => {
    const result = await client.transactions.list({
      created_at_min: "2025-01-01 00:00:00",
      created_at_max: "2026-12-31 23:59:59",
      limit: 10,
      page: 1,
    });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
