# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-08

### Added

- Initial release of `@sellersmith/printway-sdk`
- **Auth**: `generateToken`, `regenerateToken`, `destroyToken`, `refreshToken`
- **Products**: `list`, `detail`, `listSkuCatalogs`, `getShippingMethods`
- **Orders**: `list`, `detail`, `create`, `calculatePrice`, `cancel`, `delete`, `pay`
- **Webhooks**: `list`, `create`, `update`, `delete` (tracking + order types)
- **Transactions**: `list`, `orderList`
- Auto token refresh on 401 responses with `onTokenRefresh` callback
- Dual CJS/ESM output with TypeScript declarations
- 26 unit tests + 9 integration tests

[1.0.0]: https://github.com/sellersmith/printway-sdk/releases/tag/v1.0.0
