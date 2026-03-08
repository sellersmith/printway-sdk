import type { HttpClient } from "../http-client";
import type {
  ListTransactionsParams,
  ListTransactionsResponse,
  ListOrderTransactionsParams,
  ListOrderTransactionsResponse,
} from "../types";

export class Transactions {
  constructor(private http: HttpClient) {}

  /** List transactions. GET /transaction/list */
  async list(params?: ListTransactionsParams): Promise<ListTransactionsResponse> {
    return this.http.get<ListTransactionsResponse>(
      "/transaction/list",
      params as unknown as Record<string, unknown>,
    );
  }

  /** List order transactions. GET /transaction/order-list */
  async orderList(params?: ListOrderTransactionsParams): Promise<ListOrderTransactionsResponse> {
    return this.http.get<ListOrderTransactionsResponse>(
      "/transaction/order-list",
      params as unknown as Record<string, unknown>,
    );
  }
}
