import { describe, it, expect } from "vitest";
import { Printway, PrintwayError } from "../../src";
import { MOCK_TOKEN, mockFetch, createMockClient } from "../helpers/test-utils";

describe("Printway Client", () => {
  it("should throw if accessToken is missing", () => {
    expect(() => new Printway({ accessToken: "" })).toThrow("accessToken is required");
  });

  it("should initialize with valid config", () => {
    const client = new Printway({ accessToken: MOCK_TOKEN });
    expect(client.auth).toBeDefined();
    expect(client.products).toBeDefined();
    expect(client.orders).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.transactions).toBeDefined();
  });
});

describe("Error Handling", () => {
  it("should throw PrintwayError on 401", async () => {
    const client = createMockClient();
    global.fetch = mockFetch({ success: false, message: "Not authenticated" }, 401);
    await expect(client.products.list()).rejects.toThrow(PrintwayError);
  });

  it("should include responseBody in PrintwayError", async () => {
    const client = createMockClient();
    const errorBody = { success: false, message: "Invalid request" };
    global.fetch = mockFetch(errorBody, 400);
    try {
      await client.products.list();
    } catch (err) {
      expect(err).toBeInstanceOf(PrintwayError);
      expect((err as PrintwayError).responseBody).toEqual(errorBody);
    }
  });
});
