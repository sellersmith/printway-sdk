import { describe, it, expect, beforeAll } from "vitest";
import { Printway } from "../../src";
import { createLiveClient, isApiReachable } from "../helpers/test-utils";

const canRun = await isApiReachable();

describe.runIf(canRun)("Orders (integration)", () => {
  let client: Printway;

  beforeAll(() => {
    client = createLiveClient();
  });

  it("should list orders", async () => {
    const result = await client.orders.list({
      created_at_min: "2025-01-01 00:00:00",
      created_at_max: "2026-12-31 23:59:59",
      limit: 10,
      page: 1,
    });
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("should calculate price", async () => {
    const products = await client.products.list({ limit: 1 });
    const variant = products.data[0].variants[0];
    const location = variant.locations[0];

    const result = await client.orders.calculatePrice({
      shipping_country_code: "US",
      shipping_province_code: "California",
      shipping_service: "US",
      order_items: [{
        item_sku: variant.item_sku,
        variant_id: variant.variant_id,
        made_in_location: location.made_in_location,
        product_location: location.product_location[0],
        quantity: 1,
      }],
    });
    expect(result.success).toBe(true);
  });
});
