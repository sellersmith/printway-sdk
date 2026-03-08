import { describe, it, expect, beforeEach } from "vitest";
import type { Printway } from "../../src";
import { mockFetch, createMockClient } from "../helpers/test-utils";

describe("Transactions (unit)", () => {
  let client: Printway;

  beforeEach(() => {
    client = createMockClient();
  });

  it("should list transactions", async () => {
    global.fetch = mockFetch({ success: true, limit: 10, page: 1, length: 0, totalPage: 0, data: [] });
    const result = await client.transactions.list({ created_at_min: "2025-01-01 00:00:00", created_at_max: "2026-12-31 23:59:59" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/transaction/list"), expect.anything());
  });

  it("should list order transactions", async () => {
    global.fetch = mockFetch({ success: true, limit: 10, page: 1, length: 0, totalPage: 0, data: [] });
    const result = await client.transactions.orderList({ pw_order_id: "PW123" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/transaction/order-list"), expect.anything());
  });
});
