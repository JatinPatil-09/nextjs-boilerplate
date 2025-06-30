import { AuthStrategyFactory } from "../auth/auth-strategies";

import type {
  ApiClientInterface,
  ApiService,
  ApiServiceConfig,
  AuthenticationStrategy,
} from "./api-service-interface";

export class ServiceConfigBuilder {
  private config: Partial<ApiServiceConfig> = {};

  setBaseUrl(baseUrl: string): ServiceConfigBuilder {
    this.config.baseUrl = baseUrl;
    return this;
  }

  setTimeout(timeout: number): ServiceConfigBuilder {
    this.config.timeout = timeout;
    return this;
  }

  setHeaders(headers: Record<string, string>): ServiceConfigBuilder {
    this.config.defaultHeaders = headers;
    return this;
  }

  setAuthStrategy(authStrategy: AuthenticationStrategy): ServiceConfigBuilder {
    this.config.authStrategy = authStrategy;
    return this;
  }

  setRetries(retries: number): ServiceConfigBuilder {
    this.config.retries = retries;
    return this;
  }

  setRetryDelay(retryDelay: number): ServiceConfigBuilder {
    this.config.retryDelay = retryDelay;
    return this;
  }

  // Convenience methods for common auth strategies
  withNoAuth(): ServiceConfigBuilder {
    this.config.authStrategy = AuthStrategyFactory.createNoAuth();
    return this;
  }

  withBearerToken(
    token?: string,
    tokenGetter?: () => Promise<string | null>
  ): ServiceConfigBuilder {
    this.config.authStrategy = AuthStrategyFactory.createBearerToken(
      token,
      tokenGetter
    );
    return this;
  }

  withApiKey(
    apiKey: string,
    keyName?: string,
    location?: "header" | "query"
  ): ServiceConfigBuilder {
    this.config.authStrategy = AuthStrategyFactory.createApiKey(
      apiKey,
      keyName,
      location
    );
    return this;
  }

  withBasicAuth(username: string, password: string): ServiceConfigBuilder {
    this.config.authStrategy = AuthStrategyFactory.createBasicAuth(
      username,
      password
    );
    return this;
  }

  withCustomHeaders(headers: Record<string, string>): ServiceConfigBuilder {
    this.config.authStrategy = AuthStrategyFactory.createCustomHeader(headers);
    return this;
  }

  build(): ApiServiceConfig {
    if (!this.config.baseUrl) {
      throw new Error("Base URL is required for API service configuration");
    }

    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout || 10000,
      defaultHeaders: this.config.defaultHeaders || {},
      authStrategy:
        this.config.authStrategy || AuthStrategyFactory.createNoAuth(),
      retries: this.config.retries || 3,
      retryDelay: this.config.retryDelay || 1000,
    };
  }
}

interface ServiceFactory<T extends ApiService> {
  create(config: ApiServiceConfig): T;
  getServiceName(): string;
}

export class ApiClient implements ApiClientInterface {
  private services: Map<string, ApiService> = new Map();
  private serviceFactories: Map<string, ServiceFactory<ApiService>> = new Map();
  private globalConfig: Partial<ApiServiceConfig> = {};

  setGlobalConfig(config: Partial<ApiServiceConfig>): void {
    this.globalConfig = config;
  }

  registerServiceFactory<T extends ApiService>(
    name: string,
    factory: ServiceFactory<T>
  ): void {
    this.serviceFactories.set(name, factory);
  }

  registerService<T extends ApiService>(name: string, service: T): void {
    this.services.set(name, service);
  }

  getService<T extends ApiService>(name: string): T | null {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    const factory = this.serviceFactories.get(name);
    if (factory) {
      const config = this.mergeWithGlobalConfig({} as ApiServiceConfig);
      const service = factory.create(config);
      this.services.set(name, service);
      return service as T;
    }

    return null;
  }

  getServiceWithConfig<T extends ApiService>(
    name: string,
    config: ApiServiceConfig
  ): T | null {
    const factory = this.serviceFactories.get(name);
    if (!factory) {
      return null;
    }

    const mergedConfig = this.mergeWithGlobalConfig(config);
    return factory.create(mergedConfig) as T;
  }

  hasService(name: string): boolean {
    return this.services.has(name) || this.serviceFactories.has(name);
  }

  getRegisteredServices(): string[] {
    const serviceNames = new Set([
      ...this.services.keys(),
      ...this.serviceFactories.keys(),
    ]);
    return Array.from(serviceNames);
  }

  async getHealthStatus(): Promise<
    Record<string, { status: "healthy" | "unhealthy"; details?: string }>
  > {
    const healthStatus: Record<
      string,
      { status: "healthy" | "unhealthy"; details?: string }
    > = {};

    for (const serviceName of this.getRegisteredServices()) {
      try {
        const service = this.getService(serviceName);
        if (service && service.getHealth) {
          healthStatus[serviceName] = await service.getHealth();
        } else {
          healthStatus[serviceName] = {
            status: service?.isReady() ? "healthy" : "unhealthy",
            details: service?.isReady()
              ? "Service is ready"
              : "Service is not ready",
          };
        }
      } catch (error) {
        healthStatus[serviceName] = {
          status: "unhealthy",
          details:
            error instanceof Error
              ? error.message
              : "Unknown health check error",
        };
      }
    }

    return healthStatus;
  }

  updateServiceAuth(
    serviceName: string,
    authStrategy: AuthenticationStrategy
  ): boolean {
    const service = this.getService(serviceName);
    if (service && "updateAuthStrategy" in service) {
      (
        service as ApiService & {
          updateAuthStrategy: (auth: AuthenticationStrategy) => void;
        }
      ).updateAuthStrategy(authStrategy);
      return true;
    }
    return false;
  }

  updateServiceConfig(
    serviceName: string,
    config: Partial<ApiServiceConfig>
  ): boolean {
    const service = this.getService(serviceName);
    if (service && "updateConfig" in service) {
      (
        service as ApiService & {
          updateConfig: (config: Partial<ApiServiceConfig>) => void;
        }
      ).updateConfig(config);
      return true;
    }
    return false;
  }

  reset(): void {
    this.services.clear();
  }

  removeService(name: string): boolean {
    return this.services.delete(name);
  }

  static createConfigBuilder(): ServiceConfigBuilder {
    return new ServiceConfigBuilder();
  }

  private mergeWithGlobalConfig(config: ApiServiceConfig): ApiServiceConfig {
    return {
      ...config,
      timeout: config.timeout || this.globalConfig.timeout || 10000,
      defaultHeaders: {
        ...this.globalConfig.defaultHeaders,
        ...config.defaultHeaders,
      },
      retries: config.retries || this.globalConfig.retries || 3,
      retryDelay: config.retryDelay || this.globalConfig.retryDelay || 1000,
    };
  }
}

export const apiClient = new ApiClient();
