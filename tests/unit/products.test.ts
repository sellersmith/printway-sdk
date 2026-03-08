import { describe, it, expect, beforeEach } from "vitest";
import type { Printway } from "../../src";
import { MOCK_TOKEN, mockFetch, createMockClient } from "../helpers/test-utils";

describe("Products (unit)", () => {
  let client: Printway;

  beforeEach(() => {
    client = createMockClient();
  });

  it("should list products", async () => {
    const mockResponse = {
      success: true,
      message: "Get data products completed!",
      limit: 10,
      page: 1,
      length: 1,
      totalPage: 1,
      data: [{ _id: "abc", product_name: "Test", code: "TST", mockup_url: "", template_mockup_url: null, variants: [] }],
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.products.list({ limit: 10, page: 1 });
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/list"),
      expect.objectContaining({ headers: expect.objectContaining({ "pw-access-token": MOCK_TOKEN }) }),
    );
  });

  it("should get product detail", async () => {
    const mockResponse = {
      success: true,
      message: "Get detail product completed!",
      data: { _id: "abc", product_name: "Test", code: "TST", mockup_url: "", template_mockup_url: null, variants: [] },
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.products.detail("TST");
    expect(result.data.code).toBe("TST");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/detail"),
      expect.objectContaining({ method: "POST", body: JSON.stringify({ code: "TST" }) }),
    );
  });

  it("should list SKU catalogs", async () => {
    const mockResponse = {
      success: true,
      message: "Get data sku of product completed!",
      data: [{ product_name: "Test", code: "TST", variants: [{ sku: "PW-TST-S", title: "S", variant_id: "123" }] }],
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.products.listSkuCatalogs();
    expect(result.data[0].variants[0].sku).toBe("PW-TST-S");
  });

  it("should retrieve shipping methods", async () => {
    const mockResponse = {
      success: true,
      message: "Get shipping info success.",
      data: { product_data: [{ product_name: "Test", product_code: "TST", variant_title: "S", item_sku: "PW-TST-S", variant_id: "123", locations: [] }] },
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.products.getShippingMethods({ variant_id: ["123"], sku: [] });
    expect(result.data.product_data[0].product_code).toBe("TST");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/retrieved-shipping-methods"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});
