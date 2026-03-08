// ─── Configuration ───────────────────────────────────────────────────────────

export interface PrintwayConfig {
  accessToken: string;
  refreshToken?: string;
  baseUrl?: string; // defaults to https://apis.printway.io/v3
  timeout?: number;
  enableLogging?: boolean;
  useBearerAuth?: boolean; // use Authorization: Bearer instead of pw-access-token header
}

// ─── Common ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  limit: number;
  page: number;
  length: number;
  totalPage: number;
  data: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ─── Authentication ─────────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthTokenResponse = ApiResponse<AuthTokens>;

export type AuthRevokeResponse = Omit<ApiResponse<never>, 'data'>;

// ─── Products ────────────────────────────────────────────────────────────────

export interface ArtworkValidation {
  width: number;
  height: number;
  resolution: number;
  file_format: string;
}

export interface PrintArea {
  key: string;
  area: string;
  width: number;
  height: number;
  file_format: string;
  resolution: number;
  artwork_validations: ArtworkValidation[];
}

export interface Location {
  name: string;
  code: string;
  made_in_location: string;
  product_location: string[];
  base_cost: number;
  tier_cost: number;
  tik_tok_ship_by: string[];
  print_areas: PrintArea[];
}

export interface Attribute {
  name: string;
  value: string;
  hexColor: string | null;
}

export interface Variant {
  variant_title: string;
  item_old_sku: string[];
  item_sku: string;
  variant_id: string;
  locations: Location[];
  tik_tok_ship_by: string[];
  attributes: Attribute[];
  availability: string;
}

export interface Product {
  _id: string;
  product_name: string;
  code: string;
  mockup_url: string;
  template_mockup_url: string;
  variants: Variant[];
}

export type ListProductsResponse = PaginatedResponse<Product>;

export type DetailProductResponse = ApiResponse<Product>;

// ─── SKU Catalogs ────────────────────────────────────────────────────────────

export interface SkuCatalogVariant {
  sku: string;
  title: string;
  variant_id: string;
}

export interface SkuCatalog {
  product_name: string;
  code: string;
  variants: SkuCatalogVariant[];
}

export type ListSkuCatalogsResponse = ApiResponse<SkuCatalog[]>;

// ─── Shipping Methods ────────────────────────────────────────────────────────

export interface ShippingService {
  shipping_name: string;
  shipping_code: string;
  tax_fee: number;
  shipping_fee: number;
  shipping_extra_fee: number;
}

export interface ShippingProductLocation {
  code: string;
  shipping_services: ShippingService[];
}

export interface ShippingLocation {
  name: string;
  made_in_location: string;
  product_location: ShippingProductLocation[];
}

export interface ShippingProduct {
  product_name: string;
  product_code: string;
  variant_title: string;
  item_sku: string;
  variant_id: string;
  locations: ShippingLocation[];
}

export interface ShippingMethodsData {
  product_data: ShippingProduct[];
}

export interface RetrieveShippingMethodsParams {
  variant_id: string[];
  sku: string[];
}

export type ShippingMethodsResponse = ApiResponse<ShippingMethodsData>;

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderItemResponse {
  product_name: string;
  unfulfill_quantity: number;
  item_sku: string;
  artwork_front: string;
  artwork_back: string;
  url_mockup: string;
  order_status: string;
  payment_status: string;
}

export interface TrackingInfo {
  tracking_number: string;
  tracking_url: string;
  updated_at: string;
}

export interface Order {
  pw_order_id: string;
  order_name: string;
  dtime_entered: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_province: string;
  shipping_province_code: string;
  shipping_country: string;
  shipping_country_code: string;
  store_name: string;
  order_items: OrderItemResponse[];
  trackings: TrackingInfo[];
}

export interface ListOrdersParams extends PaginationParams {
  created_at_min?: string;
  created_at_max?: string;
}

export type ListOrdersResponse = PaginatedResponse<Order>;

export interface DetailOrderParams {
  pw_order_id?: string;
  order_name?: string;
}

export type DetailOrderResponse = ApiResponse<Order>;

// ─── Create Order ────────────────────────────────────────────────────────────

export interface CreateOrderItem {
  product_location?: string;
  made_in_location?: string;
  product_name: string;
  item_sku: string;
  variant_id?: string;
  quantity: number;
  variant_note?: string;
  mockup_url?: string;
  artwork_front?: string;
  artwork_back?: string;
  artwork_right?: string;
  artwork_left?: string;
  artwork_hood?: string;
  artwork_bothsides?: string;
  artwork_right_upper_sleeves?: string;
  artwork_right_lower_sleeves?: string;
  artwork_left_upper_sleeves?: string;
  artwork_left_lower_sleeves?: string;
  artwork_left_chest?: string;
  artwork_right_chest?: string;
  artwork_front_bottom_right?: string;
  artwork_center_upper_back?: string;
  artwork_across_chest?: string;
  artwork_across_back?: string;
}

export interface CreateOrderData {
  order_id: string;
  store_code?: string;
  tiktok_order_type?: string;
  shipping_email: string;
  firstName: string;
  lastName: string;
  shipping_phone: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_city: string;
  shipping_province: string;
  shipping_province_code: string;
  shipping_zip: string;
  shipping_country: string;
  shipping_country_code: string;
  shipping_service: string;
  discount_code?: string[];
  taxNumber?: string;
  order_items: CreateOrderItem[];
}

// ─── Calculate Price ─────────────────────────────────────────────────────────

export interface CalculatePriceItem {
  made_in_location?: string;
  product_location?: string;
  variant_id?: string;
  item_sku?: string;
  quantity: number;
}

export interface CalculatePriceData {
  discount_code?: string[];
  shipping_country_code: string;
  shipping_province_code: string;
  shipping_service: string;
  order_items: CalculatePriceItem[];
}

// ─── Order Actions ───────────────────────────────────────────────────────────

export interface CancelOrderParams {
  pw_order_id?: string;
  order_name?: string;
}

export interface DeleteOrderParams {
  pw_order_id?: string;
  order_name?: string;
}

export interface PaidOrderParams {
  order_id: string; // pw_order_id format
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export type WebhookType = 'tracking' | 'order';

export interface WebhookData {
  endpoint: string;
  access_key?: string;
  access_token?: string;
}

export interface WebhookCreateParams {
  endpoint: string;
  access_key?: string;
  access_token?: string;
}

export interface WebhookUpdateParams {
  endpoint?: string;
  access_key?: string;
  access_token?: string;
}

export type WebhookGetResponse = ApiResponse<WebhookData | null>;

export type WebhookMutationResponse = ApiResponse<WebhookData>;

// Tracking webhook payload (sent to your endpoint when tracking updates)
export interface WebhookTrackingPayload {
  order_id: string;
  tracking_number: string;
  tracking_url: string;
}

// Order status webhook payload (sent to your endpoint when order status changes)
export interface WebhookOrderStatusPayload {
  order_id: string;
  order_items: {
    item_sku: string;
    order_status: string;
    message_error: string;
  }[];
}

// ─── Transactions ────────────────────────────────────────────────────────────

export interface Transaction {
  [key: string]: unknown;
}

export interface ListTransactionsParams extends PaginationParams {
  created_at_min?: string;
  created_at_max?: string;
  invoice?: string;
  paymentGateway?: string;
  status?: string;
  type?: string;
}

export interface ListOrderTransactionsParams extends PaginationParams {
  created_at_min?: string;
  created_at_max?: string;
  pw_order_id?: string;
  order_name?: string;
}

export type ListTransactionsResponse = PaginatedResponse<Transaction>;

export type ListOrderTransactionsResponse = PaginatedResponse<Transaction>;
