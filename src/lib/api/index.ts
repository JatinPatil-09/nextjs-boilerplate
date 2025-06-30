/**
 * API Module Barrel Export
 *
 * Main entry point for the API layer following modular domain-driven design.
 * Each domain (user, product, etc.) is organized in its own folder with all related functionality.
 */

// Core API components
export { ApiClient, ServiceConfigBuilder, apiClient } from "./core/api-client";
export { BaseApiFactory } from "./core/api-factory";

// Authentication strategies (cross-cutting concern)
export {
  ApiKeyStrategy,
  AuthStrategyFactory,
  BasicAuthStrategy,
  BearerTokenStrategy,
  CustomHeaderStrategy,
  NoAuthStrategy,
} from "./auth/auth-strategies";

// Core API service interfaces
export type {
  ApiClientInterface,
  ApiService,
  ApiServiceConfig,
  AuthenticationStrategy,
  CrudOperations,
  HttpClient,
} from "./core/api-service-interface";

// Domain modules
export {
  UsersService,
  type CreateUserData,
  type UpdateUserData,
  // Re-export user types for convenience
  type User,
  type UserAddress,
  type UserCompany,
  type UserFilters,
  type UserListItem,
} from "./user";

export {
  PostsService,
  type BatchPostRequest,
  type BatchPostResponse,
  type CreatePostData,
  type Post,
  type PostFilters,
  type PostListItem,
  type PostStatistics,
  type UpdatePostData,
} from "./posts";

// Custom error classes
export {
  ApiError,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  RequestError,
  UnauthorizedError,
  ValidationError,
} from "./core/api-factory";
