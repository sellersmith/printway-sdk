import type { HttpClient } from "../http-client";
import type {
  ApiResponse,
  CalculatePriceData,
  CancelOrderParams,
  CreateOrderData,
  DeleteOrderParams,
  DetailOrderParams,
  DetailOrderResponse,
  ListOrdersParams,
  ListOrdersResponse,
  PaidOrderParams,
} from "../types";

export class Orders {
  constructor(private http: HttpClient) {}

  /** List orders. GET /order/list */
  async list(params: ListOrdersParams): Promise<ListOrdersResponse> {
    return this.http.get<ListOrdersResponse>(
      "/order/list",
      params as unknown as Record<string, unknown>,
    );
  }

  /** Get order detail. GET /order/detail (body: {pw_order_id?, order_name?}) */
  async detail(params: DetailOrderParams): Promise<DetailOrderResponse> {
    return this.http.get<DetailOrderResponse>(
      "/order/detail",
      params as unknown as Record<string, unknown>,
    );
  }

  /** Create a new order. POST /order/create-new-order */
  async create(data: CreateOrderData): Promise<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>("/order/create-new-order", data);
  }

  /** Calculate order price. POST /order/calculate-price */
  async calculatePrice(data: CalculatePriceData): Promise<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>("/order/calculate-price", data);
  }

  /** Cancel an order. POST /order/cancel-order-api */
  async cancel(params: CancelOrderParams): Promise<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>("/order/cancel-order-api", params);
  }

  /** Delete an order. POST /order/delete-order-api */
  async delete(params: DeleteOrderParams): Promise<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>("/order/delete-order-api", params);
  }

  /** Pay an order. POST /order/paid */
  async pay(params: PaidOrderParams): Promise<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>("/order/paid", params);
  }
}
