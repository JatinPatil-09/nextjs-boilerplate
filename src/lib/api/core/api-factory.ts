import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import type { HttpMethod, RequestConfig } from "@/types";

import { NoAuthStrategy } from "../auth/auth-strategies";

import type {
  ApiService,
  ApiServiceConfig,
  AuthenticationStrategy,
  HttpClient,
} from "./api-service-interface";

export abstract class BaseApiFactory implements ApiService, HttpClient {
  protected axiosInstance: AxiosInstance;
  protected config: ApiServiceConfig;
  protected authStrategy: AuthenticationStrategy;
  protected isHealthy: boolean = true;

  abstract readonly serviceName: string;

  constructor(config: ApiServiceConfig) {
    this.config = config;
    this.authStrategy = config.authStrategy || new NoAuthStrategy();

    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.config.defaultHeaders,
      },
    });
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const authConfig = await this.authStrategy.applyAuth(config);
        return authConfig as InternalAxiosRequestConfig;
      },
      (error) => {
        this.logError("Request interceptor error", error);
        return Promise.reject(this.handleError(error));
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logRequestDuration(response);
        return response;
      },
      async (error) => {
        this.logError("Response error", error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private logRequestDuration(response: AxiosResponse): void {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${this.serviceName}] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
  }

  protected handleError(error: AxiosError): Error {
    this.isHealthy = false;

    if (error.response) {
      const status = error.response.status;
      const message =
        (error.response.data as { message?: string })?.message || error.message;
      const serviceName = this.serviceName;

      const errorMessage = `[${serviceName}] HTTP ${status}: ${message}`;

      switch (status) {
        case 400:
          return new BadRequestError(errorMessage, error.response.data);
        case 401:
          return new UnauthorizedError(errorMessage, error.response.data);
        case 403:
          return new ForbiddenError(errorMessage, error.response.data);
        case 404:
          return new NotFoundError(errorMessage, error.response.data);
        case 422:
          return new ValidationError(errorMessage, error.response.data);
        case 429:
          return new RateLimitError(errorMessage, error.response.data);
        case 500:
          return new InternalServerError(errorMessage, error.response.data);
        default:
          return new ApiError(errorMessage, status, error.response.data);
      }
    } else if (error.request) {
      return new NetworkError(
        `[${this.serviceName}] Network Error: No response received`
      );
    } else {
      return new RequestError(
        `[${this.serviceName}] Request Error: ${error.message}`
      );
    }
  }

  private logError(context: string, error: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.error(`[${this.serviceName}] ${context}:`, error);
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("POST", url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("PUT", url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>("PATCH", url, data, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", url, undefined, config);
  }

  protected async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const retries = config?.retries || this.config.retries || 3;
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const requestConfig: AxiosRequestConfig = {
          method,
          url: endpoint,
          timeout: config?.timeout || this.config.timeout || 10000,
          headers: {
            ...config?.headers,
          },
        };

        if (
          data &&
          (method === "POST" || method === "PUT" || method === "PATCH")
        ) {
          requestConfig.data = data;
        }

        if (data && method === "GET") {
          requestConfig.params = data;
        }

        const response: AxiosResponse<T> =
          await this.axiosInstance.request(requestConfig);
        this.isHealthy = true;
        return response.data;
      } catch (error) {
        lastError = this.handleError(error as AxiosError);

        if (attempt < retries && this.shouldRetry(error as AxiosError)) {
          const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt);
          console.log(
            `[${this.serviceName}] Retrying request (attempt ${attempt + 1}/${retries}) in ${delay}ms`
          );
          await this.delay(delay);
          continue;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) {
      return true;
    }

    const status = error.response.status;
    return status >= 500 || status === 429; // Server errors or rate limiting
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isReady(): boolean {
    return this.authStrategy !== undefined && this.config.baseUrl.length > 0;
  }

  async getHealth(): Promise<{
    status: "healthy" | "unhealthy";
    details?: string;
  }> {
    try {
      const authValid = await this.authStrategy.isValid();

      if (!authValid) {
        return {
          status: "unhealthy",
          details: "Authentication is invalid",
        };
      }

      return {
        status: this.isHealthy ? "healthy" : "unhealthy",
        details: this.isHealthy
          ? "Service is operational"
          : "Service has encountered errors",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details:
          error instanceof Error ? error.message : "Unknown health check error",
      };
    }
  }

  updateConfig(newConfig: Partial<ApiServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.baseUrl) {
      this.axiosInstance = this.createAxiosInstance();
      this.setupInterceptors();
    }
  }

  updateAuthStrategy(authStrategy: AuthenticationStrategy): void {
    this.authStrategy = authStrategy;
  }

  getConfig(): Readonly<ApiServiceConfig> {
    return Object.freeze({ ...this.config });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 400, data);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 401, data);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 403, data);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 404, data);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 422, data);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 429, data);
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(message, 500, data);
    this.name = "InternalServerError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}
