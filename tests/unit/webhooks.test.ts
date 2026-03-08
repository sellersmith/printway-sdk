import { describe, it, expect, beforeEach } from "vitest";
import type { Printway } from "../../src";
import { mockFetch, createMockClient } from "../helpers/test-utils";

describe("Webhooks (unit)", () => {
  let client: Printway;

  beforeEach(() => {
    client = createMockClient();
  });

  it("should list tracking webhooks", async () => {
    global.fetch = mockFetch({ success: true, message: "Get webhook information completed!", data: null });
    const result = await client.webhooks.list("tracking");
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=tracking"), expect.anything());
  });

  it("should list order webhooks", async () => {
    global.fetch = mockFetch({ success: true, message: "Get webhook information completed!", data: null });
    const result = await client.webhooks.list("order");
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=order"), expect.anything());
  });

  it("should create tracking webhook", async () => {
    global.fetch = mockFetch({ success: true, message: "Webhook registered!", data: { endpoint: "https://test.com/hook" } });
    const result = await client.webhooks.create("tracking", { endpoint: "https://test.com/hook" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=tracking"), expect.objectContaining({ method: "POST" }));
  });

  it("should update webhook", async () => {
    global.fetch = mockFetch({ success: true, message: "Webhook updated!", data: { endpoint: "https://test.com/hook-v2" } });
    const result = await client.webhooks.update("order", { endpoint: "https://test.com/hook-v2" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=order"), expect.objectContaining({ method: "PUT" }));
  });

  it("should delete webhook", async () => {
    global.fetch = mockFetch({ success: true, message: "Webhook deleted!" });
    const result = await client.webhooks.delete("tracking");
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("type=tracking"), expect.objectContaining({ method: "DELETE" }));
  });
});
