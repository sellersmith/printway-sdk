import type { HttpClient } from "../http-client";
import type { AuthCredentials, AuthTokenResponse, AuthRevokeResponse } from "../types";

export class Auth {
  constructor(private http: HttpClient) {}

  /** Generate a new access token. POST /auth/token */
  async generateToken(credentials: AuthCredentials): Promise<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>("/auth/token", credentials);
  }

  /** Regenerate/update access token. PUT /auth/token */
  async regenerateToken(credentials: AuthCredentials): Promise<AuthTokenResponse> {
    return this.http.put<AuthTokenResponse>("/auth/token", credentials);
  }

  /** Destroy/revoke access token. DELETE /auth/token */
  async destroyToken(): Promise<AuthRevokeResponse> {
    return this.http.delete<AuthRevokeResponse>("/auth/token");
  }

  /** Refresh access token using refresh token. GET /auth/refresh-token */
  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return this.http.get<AuthTokenResponse>("/auth/refresh-token", { refresh_token: refreshToken }, { skipAuth: true });
  }
}
