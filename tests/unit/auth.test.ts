import { describe, it, expect, beforeEach } from "vitest";
import type { Printway } from "../../src";
import { mockFetch, createMockClient } from "../helpers/test-utils";

describe("Auth (unit)", () => {
  let client: Printway;

  beforeEach(() => {
    client = createMockClient();
  });

  it("should generate token", async () => {
    const mockResponse = {
      success: true,
      message: "Access token has been generated.",
      data: { accessToken: "new-token", refreshToken: "new-refresh" },
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.auth.generateToken({ email: "test@test.com", password: "Pass@123456!" });
    expect(result.data.accessToken).toBe("new-token");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/token"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("should regenerate token", async () => {
    const mockResponse = {
      success: true,
      message: "Access token has been generated.",
      data: { accessToken: "regen-token", refreshToken: "regen-refresh" },
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.auth.regenerateToken({ email: "test@test.com", password: "Pass@123456!" });
    expect(result.data.accessToken).toBe("regen-token");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/token"),
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("should destroy token", async () => {
    global.fetch = mockFetch({ success: true, message: "Token destroyed" });
    const result = await client.auth.destroyToken();
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/token"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("should refresh token", async () => {
    const mockResponse = {
      success: true,
      message: "Access token has been generated.",
      data: { accessToken: "refreshed-token", refreshToken: "new-refresh" },
    };
    global.fetch = mockFetch(mockResponse);
    const result = await client.auth.refreshToken("old-refresh-token");
    expect(result.data.accessToken).toBe("refreshed-token");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("refresh_token=old-refresh-token"),
      expect.anything(),
    );
  });
});
