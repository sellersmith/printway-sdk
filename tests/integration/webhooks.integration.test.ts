import { describe, it, expect, beforeAll } from "vitest";
import { Printway } from "../../src";
import { createLiveClient, isApiReachable } from "../helpers/test-utils";

const canRun = await isApiReachable();

describe.runIf(canRun)("Webhooks (integration)", () => {
  let client: Printway;

  beforeAll(() => {
    client = createLiveClient();
  });

  it("should list tracking webhooks", async () => {
    const result = await client.webhooks.list("tracking");
    expect(result.success).toBe(true);
  });

  it("should list order webhooks", async () => {
    const result = await client.webhooks.list("order");
    expect(result.success).toBe(true);
  });
});
