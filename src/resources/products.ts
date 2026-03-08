import type { HttpClient } from "../http-client";
import type {
  DetailProductResponse,
  ListProductsResponse,
  ListSkuCatalogsResponse,
  PaginationParams,
  RetrieveShippingMethodsParams,
  ShippingMethodsResponse,
} from "../types";

export class Products {
  constructor(private http: HttpClient) {}

  /** List all products. GET /products/list */
  async list(params?: PaginationParams): Promise<ListProductsResponse> {
    return this.http.get<ListProductsResponse>(
      "/products/list",
      params as unknown as Record<string, unknown>,
    );
  }

  /** Get product detail by code. POST /products/detail (body: {code}) */
  async detail(code: string): Promise<DetailProductResponse> {
    return this.http.post<DetailProductResponse>("/products/detail", { code });
  }

  /** List all SKU catalogs. GET /products/list-sku-catalogs */
  async listSkuCatalogs(): Promise<ListSkuCatalogsResponse> {
    return this.http.get<ListSkuCatalogsResponse>("/products/list-sku-catalogs");
  }

  /** Retrieve shipping methods for variants. POST /products/retrieved-shipping-methods */
  async getShippingMethods(params: RetrieveShippingMethodsParams): Promise<ShippingMethodsResponse> {
    return this.http.post<ShippingMethodsResponse>("/products/retrieved-shipping-methods", params);
  }
}
