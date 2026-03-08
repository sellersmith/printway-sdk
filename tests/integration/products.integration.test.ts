import { describe, it, expect, beforeAll } from "vitest";
import { Printway } from "../../src";
import { createLiveClient, isApiReachable } from "../helpers/test-utils";

const canRun = await isApiReachable();

describe.runIf(canRun)("Products (integration)", () => {
  let client: Printway;

  beforeAll(() => {
    client = createLiveClient();
  });

  it("should list products", async () => {
    const result = await client.products.list({ limit: 2, page: 1 });
    expect(result.success).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    const product = result.data[0];
    expect(product).toHaveProperty("product_name");
    expect(product).toHaveProperty("code");
    expect(product).toHaveProperty("variants");
    expect(product.variants.length).toBeGreaterThan(0);
    expect(product.variants[0]).toHaveProperty("item_sku");
    expect(product.variants[0]).toHaveProperty("variant_id");
  });

  it("should get product detail", async () => {
    const list = await client.products.list({ limit: 1 });
    const code = list.data[0].code;

    const result = await client.products.detail(code);
    expect(result.success).toBe(true);
    expect(result.data.code).toBe(code);
    expect(result.data.variants.length).toBeGreaterThan(0);
  });

  it("should list SKU catalogs", async () => {
    const result = await client.products.listSkuCatalogs();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0]).toHaveProperty("code");
    expect(result.data[0].variants[0]).toHaveProperty("sku");
  });

  it("should retrieve shipping methods", async () => {
    const list = await client.products.list({ limit: 1 });
    const variantId = list.data[0].variants[0].variant_id;

    const result = await client.products.getShippingMethods({ variant_id: [variantId], sku: [] });
    expect(result.success).toBe(true);
    expect(result.data.product_data.length).toBeGreaterThan(0);
    const loc = result.data.product_data[0].locations[0];
    expect(loc.product_location[0].shipping_services.length).toBeGreaterThan(0);
    expect(loc.product_location[0].shipping_services[0]).toHaveProperty("shipping_code");
  });
});
