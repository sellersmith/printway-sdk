import { describe, it, expect, beforeEach } from "vitest";
import type { Printway } from "../../src";
import { mockFetch, createMockClient } from "../helpers/test-utils";

describe("Orders (unit)", () => {
  let client: Printway;

  beforeEach(() => {
    client = createMockClient();
  });

  it("should list orders", async () => {
    const mockResponse = { success: true, message: "Get list orders completed!", limit: 10, page: 1, length: 0, totalPage: 0, data: [] };
    global.fetch = mockFetch(mockResponse);
    const result = await client.orders.list({ created_at_min: "2025-01-01 00:00:00", created_at_max: "2026-12-31 23:59:59" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/order/list"), expect.anything());
  });

  it("should get order detail", async () => {
    const mockResponse = { success: true, message: "Get detail order completed!", data: { pw_order_id: "PW123", order_name: "TEST" } };
    global.fetch = mockFetch(mockResponse);
    const result = await client.orders.detail({ pw_order_id: "PW123" });
    expect(result.data.pw_order_id).toBe("PW123");
  });

  it("should create an order", async () => {
    const mockResponse = { success: true, message: "Order created successfully!", data: {} };
    global.fetch = mockFetch(mockResponse);
    const result = await client.orders.create({
      order_id: "TEST-001",
      shipping_email: "test@test.com",
      firstName: "John",
      lastName: "Doe",
      shipping_phone: "123456789",
      shipping_address1: "123 Main St",
      shipping_city: "Miami",
      shipping_province: "Florida",
      shipping_province_code: "FL",
      shipping_zip: "33101",
      shipping_country: "United States",
      shipping_country_code: "US",
      shipping_service: "US",
      order_items: [{ product_name: "Test", item_sku: "PW-TST-S", quantity: 1 }],
    });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/order/create-new-order"), expect.objectContaining({ method: "POST" }));
  });

  it("should calculate price", async () => {
    const mockResponse = { success: true, message: "Calculate price completed!", data: {} };
    global.fetch = mockFetch(mockResponse);
    const result = await client.orders.calculatePrice({
      shipping_country_code: "US",
      shipping_province_code: "FL",
      shipping_service: "US",
      order_items: [{ item_sku: "PW-TST-S", quantity: 1 }],
    });
    expect(result.success).toBe(true);
  });

  it("should cancel an order", async () => {
    global.fetch = mockFetch({ success: true, message: "Order cancelled" });
    const result = await client.orders.cancel({ pw_order_id: "PW123" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/order/cancel-order-api"), expect.anything());
  });

  it("should delete an order", async () => {
    global.fetch = mockFetch({ success: true, message: "Order deleted" });
    const result = await client.orders.delete({ order_name: "TEST-001" });
    expect(result.success).toBe(true);
  });

  it("should pay an order", async () => {
    global.fetch = mockFetch({ success: true, message: "Order paid" });
    const result = await client.orders.pay({ order_id: "PW123" });
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/order/paid"), expect.anything());
  });
});
