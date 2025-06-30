/**
 * Authentication Strategies
 *
 * Concrete implementations of authentication strategies following the Strategy pattern.
 * This allows for flexible authentication handling across different APIs.
 */

import type { AxiosRequestConfig } from "axios";

import type { AuthenticationStrategy } from "../core/api-service-interface";

/**
 * No Authentication Strategy
 * For APIs that don't require authentication
 */
export class NoAuthStrategy implements AuthenticationStrategy {
  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    return config;
  }

  async isValid(): Promise<boolean> {
    return true;
  }
}

/**
 * Bearer Token Authentication Strategy
 * For APIs that use Bearer token authentication
 */
export class BearerTokenStrategy implements AuthenticationStrategy {
  private token: string | null = null;
  private tokenGetter: (() => Promise<string | null>) | undefined;

  constructor(token?: string, tokenGetter?: () => Promise<string | null>) {
    this.token = token || null;
    this.tokenGetter = tokenGetter;
  }

  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const token = await this.getToken();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  }

  async isValid(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token.length > 0;
  }

  async refresh(): Promise<void> {
    if (this.tokenGetter) {
      this.token = await this.tokenGetter();
    }
  }

  clear(): void {
    this.token = null;
  }

  setToken(token: string): void {
    this.token = token;
  }

  private async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }

    if (this.tokenGetter) {
      this.token = await this.tokenGetter();
      return this.token;
    }

    return null;
  }
}

/**
 * API Key Authentication Strategy
 * For APIs that use API key authentication
 */
export class ApiKeyStrategy implements AuthenticationStrategy {
  private apiKey: string;
  private keyName: string;
  private location: "header" | "query";

  constructor(
    apiKey: string,
    keyName: string = "X-API-Key",
    location: "header" | "query" = "header"
  ) {
    this.apiKey = apiKey;
    this.keyName = keyName;
    this.location = location;
  }

  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    if (this.location === "header") {
      config.headers = {
        ...config.headers,
        [this.keyName]: this.apiKey,
      };
    } else {
      // Add to query parameters
      const url = new URL(config.url || "", config.baseURL);
      url.searchParams.set(this.keyName, this.apiKey);
      config.url = url.pathname + url.search;
    }

    return config;
  }

  async isValid(): Promise<boolean> {
    return this.apiKey.length > 0;
  }

  clear(): void {
    this.apiKey = "";
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

/**
 * Basic Authentication Strategy
 * For APIs that use basic authentication
 */
export class BasicAuthStrategy implements AuthenticationStrategy {
  private username: string;
  private password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const credentials = btoa(`${this.username}:${this.password}`);

    config.headers = {
      ...config.headers,
      Authorization: `Basic ${credentials}`,
    };

    return config;
  }

  async isValid(): Promise<boolean> {
    return this.username.length > 0 && this.password.length > 0;
  }

  clear(): void {
    this.username = "";
    this.password = "";
  }

  setCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
  }
}

/**
 * Custom Header Strategy
 * For APIs that require custom headers for authentication
 */
export class CustomHeaderStrategy implements AuthenticationStrategy {
  private headers: Record<string, string>;

  constructor(headers: Record<string, string>) {
    this.headers = headers;
  }

  async applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    config.headers = {
      ...config.headers,
      ...this.headers,
    };

    return config;
  }

  async isValid(): Promise<boolean> {
    return Object.keys(this.headers).length > 0;
  }

  clear(): void {
    this.headers = {};
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.headers[key];
  }
}

/**
 * Authentication Strategy Factory
 * Factory class to create authentication strategies
 */
export class AuthStrategyFactory {
  static createNoAuth(): NoAuthStrategy {
    return new NoAuthStrategy();
  }

  static createBearerToken(
    token?: string,
    tokenGetter?: () => Promise<string | null>
  ): BearerTokenStrategy {
    return new BearerTokenStrategy(token, tokenGetter);
  }

  static createApiKey(
    apiKey: string,
    keyName: string = "X-API-Key",
    location: "header" | "query" = "header"
  ): ApiKeyStrategy {
    return new ApiKeyStrategy(apiKey, keyName, location);
  }

  static createBasicAuth(
    username: string,
    password: string
  ): BasicAuthStrategy {
    return new BasicAuthStrategy(username, password);
  }

  static createCustomHeader(
    headers: Record<string, string>
  ): CustomHeaderStrategy {
    return new CustomHeaderStrategy(headers);
  }
}
