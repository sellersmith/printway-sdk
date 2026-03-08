import type { PrintwayConfig } from "./types";

const DEFAULT_BASE_URL = "https://apis.printway.io/v3";
const DEFAULT_TIMEOUT = 30000;

export class PrintwayError extends Error {
  constructor(
    public status: number,
    message: string,
    public responseBody?: unknown,
  ) {
    super(message);
    this.name = "PrintwayError";
  }
}

export class HttpClient {
  private baseUrl: string;
  private accessToken: string;
  private refreshToken?: string;
  private useBearerAuth: boolean;
  private timeout: number;
  private enableLogging: boolean;
  private isRefreshing = false;
  private onTokenRefresh?: (accessToken: string, refreshToken: string) => void;

  constructor(config: PrintwayConfig) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.useBearerAuth = config.useBearerAuth ?? false;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.enableLogging = config.enableLogging ?? false;
  }

  /** Register a callback invoked when tokens are auto-refreshed. */
  setTokenRefreshCallback(cb: (accessToken: string, refreshToken: string) => void): void {
    this.onTokenRefresh = cb;
  }

  private log(message: string, data?: unknown): void {
    if (this.enableLogging) {
      console.log(`[Printway SDK] ${message}`, data ?? "");
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.useBearerAuth) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    } else {
      headers["pw-access-token"] = this.accessToken;
    }

    return headers;
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: { params?: Record<string, unknown>; data?: unknown; skipAuth?: boolean },
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    this.log(method, { url, ...(options?.data ? { data: options.data } : {}) });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers = options?.skipAuth
      ? { "Content-Type": "application/json" }
      : this.getHeaders();

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(options?.data ? { body: JSON.stringify(options.data) } : {}),
        signal: controller.signal,
      });

      let body: Record<string, unknown>;
      try {
        body = await response.json();
      } catch {
        throw new PrintwayError(response.status, `Non-JSON response (HTTP ${response.status})`);
      }
      this.log("Response", { status: response.status, body });

      if (!response.ok) {
        // Auto-refresh on 401 if refreshToken is available
        if (response.status === 401 && this.refreshToken && !this.isRefreshing) {
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            return this.request<T>(method, path, options);
          }
        }
        throw new PrintwayError(response.status, (body.message as string) ?? "Request failed", body);
      }

      return body as T;
    } catch (error) {
      if (error instanceof PrintwayError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new PrintwayError(408, "Request timeout");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(path: string, params?: Record<string, unknown>, options?: { skipAuth?: boolean }): Promise<T> {
    return this.request<T>("GET", path, { params, ...options });
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>("POST", path, { data });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { data });
  }

  async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("DELETE", path, { params });
  }

  /** Attempt to refresh the access token using the stored refresh token. */
  private async tryRefreshToken(): Promise<boolean> {
    if (!this.refreshToken) return false;
    this.isRefreshing = true;
    this.log("Auto-refreshing access token...");

    try {
      const url = `${this.baseUrl}/auth/refresh-token?refresh_token=${encodeURIComponent(this.refreshToken)}`;
      // Don't send auth headers — refresh token in query param is the credential
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await response.json();

      if (body.success && body.data?.accessToken) {
        this.accessToken = body.data.accessToken;
        this.refreshToken = body.data.refreshToken;
        this.log("Token refreshed successfully");
        this.onTokenRefresh?.(body.data.accessToken, body.data.refreshToken);
        return true;
      }

      this.log("Token refresh failed", body);
      return false;
    } catch (error) {
      this.log("Token refresh error", error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }
}
