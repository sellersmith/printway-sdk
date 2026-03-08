# Printway SDK

[![npm version](https://img.shields.io/npm/v/@sellersmith/printway-sdk.svg)](https://www.npmjs.com/package/@sellersmith/printway-sdk)
[![CI](https://github.com/sellersmith/printway-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/sellersmith/printway-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Node.js / TypeScript SDK for the [Printway](https://printway.io) Print-on-Demand Fulfillment API (v3).

## Installation

```bash
npm install @sellersmith/printway-sdk
```

## Quick Start

```typescript
import { Printway } from "@sellersmith/printway-sdk";

const printway = new Printway({
  accessToken: "your-pw-access-token",
  refreshToken: "your-refresh-token", // Optional — enables auto-refresh on 401
});

// List all products
const products = await printway.products.list();
console.log(products.data);
```

## Configuration

```typescript
const printway = new Printway({
  accessToken: "your-pw-access-token", // Required
  refreshToken: "your-refresh-token",  // Optional — auto-refresh on 401
  baseUrl: "https://apis.printway.io/v3", // Optional, default
  timeout: 30000,        // Optional, ms (default: 30000)
  enableLogging: false,  // Optional (default: false)
  useBearerAuth: false,  // Optional — use Authorization: Bearer header instead of pw-access-token
});

// Listen for token refresh events
printway.onTokenRefresh((newAccessToken, newRefreshToken) => {
  // Persist new tokens to your storage
});
```

## API Reference

### Authentication

```typescript
// Generate token with email/password
const auth = await printway.auth.generateToken({
  email: "your@email.com",
  password: "your-password",
});

// Regenerate token
const newAuth = await printway.auth.regenerateToken({
  email: "your@email.com",
  password: "your-password",
});

// Refresh access token
const refreshed = await printway.auth.refreshToken("your-refresh-token");

// Destroy/revoke token
await printway.auth.destroyToken();
```

### Products

```typescript
// List all products (paginated)
const products = await printway.products.list({ limit: 10, page: 1 });

// Get product detail by code
const product = await printway.products.detail("PRODUCT_CODE");

// List SKU catalogs
const catalogs = await printway.products.listSkuCatalogs();

// Get shipping methods for variants
const shipping = await printway.products.getShippingMethods({
  variant_id: ["10024433"],
  sku: [],
});
```

### Orders

```typescript
// List orders (date range required)
const orders = await printway.orders.list({
  created_at_min: "2025-01-01 00:00:00",
  created_at_max: "2025-12-31 23:59:59",
  limit: 10,
  page: 1,
});

// Get order detail
const order = await printway.orders.detail({
  order_id: "YOUR_ORDER_ID",
  date: "2025-01-01",
});

// Create order
const newOrder = await printway.orders.create({
  order_id: "ORDER-001",
  firstName: "John",
  lastName: "Doe",
  shipping_email: "john@example.com",
  shipping_phone: "1234567890",
  shipping_address1: "123 Main St",
  shipping_city: "Miami",
  shipping_zip: "33101",
  shipping_province: "Florida",
  shipping_province_code: "FL",
  shipping_country: "United States",
  shipping_country_code: "US",
  shipping_service: "US",
  order_items: [{
    product_name: "Suncatcher Night Light Box",
    variant_title: "8X8 INCHES/MONOCHROME",
    item_sku: "PW-SNLB-8X8 INCHES-MONOCHROME",
    variant_id: "10024433",
    made_in_location: "VN",
    product_location: "PW-2",
    unfulfill_quantity: 1,
    artwork_front: "https://example.com/front.png",
  }],
});

// Calculate price before ordering
const price = await printway.orders.calculatePrice({
  shipping_country_code: "US",
  shipping_province_code: "California",
  shipping_service: "US",
  order_items: [{
    item_sku: "PW-SNLB-8X8 INCHES-MONOCHROME",
    variant_id: "10024433",
    made_in_location: "VN",
    product_location: "PW-2",
    quantity: 1,
  }],
});

// Cancel, delete, or pay orders
await printway.orders.cancel({ order_id: "ORDER-001" });
await printway.orders.delete({ order_id: "ORDER-001" });
await printway.orders.pay({ order_id: "ORDER-001" });
```

### Webhooks

Supports two webhook types: `"tracking"` and `"order"`.

```typescript
// List webhooks
const trackingWebhooks = await printway.webhooks.list("tracking");
const orderWebhooks = await printway.webhooks.list("order");

// Create webhook
await printway.webhooks.create("tracking", {
  endpoint: "https://your-site.com/api/tracking-webhook",
  status: 1,
});

// Update webhook
await printway.webhooks.update("order", {
  endpoint: "https://your-site.com/api/order-webhook",
  status: 1,
});

// Delete webhook
await printway.webhooks.delete("tracking");
```

### Transactions

```typescript
// List transactions
const transactions = await printway.transactions.list({
  created_at_min: "2025-01-01 00:00:00",
  created_at_max: "2025-12-31 23:59:59",
  limit: 10,
  page: 1,
});

// List transactions for a specific order
const orderTransactions = await printway.transactions.orderList({
  order_id: "ORDER-001",
  date: "2025-01-01",
});
```

## Error Handling

```typescript
import { Printway, PrintwayError } from "@sellersmith/printway-sdk";

try {
  const products = await printway.products.list();
} catch (error) {
  if (error instanceof PrintwayError) {
    console.error(`API Error ${error.status}: ${error.message}`);
    console.error("Response:", error.responseBody);
  }
}
```

## Auto Token Refresh

When `refreshToken` is provided, the SDK automatically refreshes the access token on 401 responses and retries the request:

```typescript
const printway = new Printway({
  accessToken: "your-access-token",
  refreshToken: "your-refresh-token",
});

// Optionally listen for token updates to persist them
printway.onTokenRefresh((newAccessToken, newRefreshToken) => {
  // Save to database, env, etc.
});
```

## Requirements

- Node.js >= 18.0.0 (uses native `fetch`)
- Zero runtime dependencies

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE)
