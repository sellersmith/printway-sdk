import type { HttpClient } from "../http-client";
import type {
  WebhookType,
  WebhookCreateParams,
  WebhookUpdateParams,
  WebhookGetResponse,
  WebhookMutationResponse,
  ApiResponse,
} from "../types";

export class Webhooks {
  constructor(private http: HttpClient) {}

  /** List registered webhook. GET /webhooks?type=tracking|order */
  async list(type: WebhookType): Promise<WebhookGetResponse> {
    return this.http.get<WebhookGetResponse>("/webhooks", { type });
  }

  /** Register a new webhook. POST /webhooks?type=tracking|order */
  async create(type: WebhookType, params: WebhookCreateParams): Promise<WebhookMutationResponse> {
    return this.http.post<WebhookMutationResponse>(`/webhooks?type=${type}`, params);
  }

  /** Update a webhook. PUT /webhooks?type=tracking|order */
  async update(type: WebhookType, params: WebhookUpdateParams): Promise<WebhookMutationResponse> {
    return this.http.put<WebhookMutationResponse>(`/webhooks?type=${type}`, params);
  }

  /** Delete a webhook. DELETE /webhooks?type=tracking|order */
  async delete(type: WebhookType): Promise<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>("/webhooks", { type });
  }
}
