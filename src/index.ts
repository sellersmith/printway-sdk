import { HttpClient } from "./http-client";
import { Auth } from "./resources/auth";
import { Orders } from "./resources/orders";
import { Products } from "./resources/products";
import { Transactions } from "./resources/transactions";
import { Webhooks } from "./resources/webhooks";
import type { PrintwayConfig } from "./types";

export class Printway {
  public readonly auth: Auth;
  public readonly products: Products;
  public readonly orders: Orders;
  public readonly webhooks: Webhooks;
  public readonly transactions: Transactions;

  private http: HttpClient;

  constructor(config: PrintwayConfig) {
    if (!config.accessToken) {
      throw new Error("Printway SDK: accessToken is required");
    }

    this.http = new HttpClient(config);

    this.auth = new Auth(this.http);
    this.products = new Products(this.http);
    this.orders = new Orders(this.http);
    this.webhooks = new Webhooks(this.http);
    this.transactions = new Transactions(this.http);
  }

  /** Register a callback invoked when tokens are auto-refreshed on 401. */
  onTokenRefresh(cb: (accessToken: string, refreshToken: string) => void): void {
    this.http.setTokenRefreshCallback(cb);
  }
}

export { PrintwayError } from "./http-client";
export * from "./types";
