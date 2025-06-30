/**
 * Base API Types and Interfaces
 *
 * This module contains all the fundamental types used across the API layer
 * following the naming conventions: PascalCase for interfaces and types
 */

// HTTP Method Types
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Base API Response Structure
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// API Error Response
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// CRUD Operation Types
export interface CreateRequest<T> {
  data: Omit<T, "id">;
}

export interface UpdateRequest<T> {
  id: string | number;
  data: Partial<Omit<T, "id">>;
}

export interface DeleteRequest {
  id: string | number;
}

export interface GetByIdRequest {
  id: string | number;
}

export interface ListRequest extends PaginationParams {
  filters?: Record<string, unknown>;
  sort?: string;
  order?: "asc" | "desc";
}

// API Factory Configuration
export interface ApiFactoryConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}
