import type { AxiosRequestConfig } from "axios";

import type { RequestConfig } from "@/types";

export interface AuthenticationStrategy {
  applyAuth(config: AxiosRequestConfig): Promise<AxiosRequestConfig>;

  isValid(): Promise<boolean>;

  refresh?(): Promise<void>;

  clear?(): void;
}

export interface ApiServiceConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  authStrategy?: AuthenticationStrategy;
  retries?: number;
  retryDelay?: number;
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

export interface ApiService {
  readonly serviceName: string;

  isReady(): boolean;

  getHealth?(): Promise<{ status: "healthy" | "unhealthy"; details?: string }>;
}

export interface CrudOperations<
  T,
  CreateT = Omit<T, "id">,
  UpdateT = Partial<T>,
> {
  getAll(
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<T[]>;

  getById(id: string | number, config?: RequestConfig): Promise<T>;

  create(data: CreateT, config?: RequestConfig): Promise<T>;

  update(
    id: string | number,
    data: UpdateT,
    config?: RequestConfig
  ): Promise<T>;

  delete(
    id: string | number,
    config?: RequestConfig
  ): Promise<{ success: boolean; message?: string }>;
}

export interface ApiClientInterface {
  registerService<T extends ApiService>(name: string, service: T): void;

  getService<T extends ApiService>(name: string): T | null;

  hasService(name: string): boolean;

  reset(): void;
}
