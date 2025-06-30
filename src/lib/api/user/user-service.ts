/**
 * Enhanced Users Service
 *
 * A robust Users API service extending the Enhanced API Factory.
 * Implements CRUD operations with proper authentication handling and error management.
 *
 * Features:
 * - Extends EnhancedApiFactory for SOLID principles compliance
 * - Implements CrudOperations interface
 * - Supports authentication strategies
 * - Comprehensive error handling
 * - Health monitoring
 * - Configurable retry logic
 */

import { clientConfig } from "@/lib/config";
import type { RequestConfig } from "@/types";

import { AuthStrategyFactory } from "../auth/auth-strategies";
import { BaseApiFactory } from "../core/api-factory";
import type { ApiServiceConfig } from "../core/api-service-interface";

import type {
  CreateUserData,
  UpdateUserData,
  User,
  UserFilters,
} from "./user-types";

/**
 * Users Service Class
 * Extends BaseApiFactory and implements CrudOperations
 */
// Interface for CRUD operations to avoid conflict with BaseApiFactory.delete
interface UserCrudOperations {
  getAll(
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<User[]>;
  getById(id: string | number, config?: RequestConfig): Promise<User>;
  create(data: CreateUserData, config?: RequestConfig): Promise<User>;
  update(
    id: string | number,
    data: UpdateUserData,
    config?: RequestConfig
  ): Promise<User>;
  partialUpdate(
    id: string | number,
    data: Partial<UpdateUserData>,
    config?: RequestConfig
  ): Promise<User>;
  deleteUser(
    id: string | number,
    config?: RequestConfig
  ): Promise<{ success: boolean; message?: string }>;
}

export class UsersService extends BaseApiFactory implements UserCrudOperations {
  readonly serviceName = "UsersService";
  private readonly USERS_ENDPOINT = "/users";

  constructor(config?: ApiServiceConfig, token?: string, apiKey?: string) {
    super(UsersService.buildConfig(config, token, apiKey));
  }

  // Static Factory Methods
  static withBearerToken(token: string, baseUrl?: string): UsersService {
    return new UsersService(UsersService.getDefaultConfig(baseUrl), token);
  }

  static withApiKey(apiKey: string, baseUrl?: string): UsersService {
    return new UsersService(
      UsersService.getDefaultConfig(baseUrl),
      undefined,
      apiKey
    );
  }

  static withoutAuth(baseUrl?: string): UsersService {
    return new UsersService(UsersService.getDefaultConfig(baseUrl));
  }

  // CrudOperations Implementation

  /**
   * Get all users with optional filtering
   */
  async getAll(
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<User[]> {
    const filters = params?.filters as UserFilters | undefined;
    const users = await this.get<User[]>(this.USERS_ENDPOINT, config);

    // Apply client-side filtering since JSONPlaceholder doesn't support filtering
    if (filters) {
      return this.applyClientSideFilters(users, filters);
    }

    return users;
  }

  /**
   * Get user by ID
   */
  async getById(id: string | number, config?: RequestConfig): Promise<User> {
    return await this.get<User>(`${this.USERS_ENDPOINT}/${id}`, config);
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserData, config?: RequestConfig): Promise<User> {
    return await this.post<User>(this.USERS_ENDPOINT, data, config);
  }

  /**
   * Update an existing user (PUT - complete replacement)
   */
  async update(
    id: string | number,
    data: UpdateUserData,
    config?: RequestConfig
  ): Promise<User> {
    return await this.put<User>(`${this.USERS_ENDPOINT}/${id}`, data, config);
  }

  /**
   * Partially update a user (PATCH)
   */
  async partialUpdate(
    id: string | number,
    data: Partial<UpdateUserData>,
    config?: RequestConfig
  ): Promise<User> {
    return await this.patch<User>(`${this.USERS_ENDPOINT}/${id}`, data, config);
  }

  /**
   * Delete a user
   */
  async deleteUser(
    id: string | number,
    config?: RequestConfig
  ): Promise<{ success: boolean; message?: string }> {
    await super.delete<Record<string, never>>(
      `${this.USERS_ENDPOINT}/${id}`,
      config
    );
    return {
      success: true,
      message: `User with ID ${id} successfully deleted`,
    };
  }

  // Additional User-Specific Methods

  /**
   * Get users by company name
   */
  async getUsersByCompany(
    companyName: string,
    config?: RequestConfig
  ): Promise<User[]> {
    const allUsers = await this.getAll(undefined, config);
    return allUsers.filter((user) =>
      user.company.name.toLowerCase().includes(companyName.toLowerCase())
    );
  }

  /**
   * Get users by city
   */
  async getUsersByCity(city: string, config?: RequestConfig): Promise<User[]> {
    const allUsers = await this.getAll(undefined, config);
    return allUsers.filter((user) =>
      user.address.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  /**
   * Search users by name, username, or email
   */
  async searchUsers(
    searchTerm: string,
    config?: RequestConfig
  ): Promise<User[]> {
    const allUsers = await this.getAll(undefined, config);
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.username.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Check if a user exists by ID
   */
  async userExists(
    id: string | number,
    config?: RequestConfig
  ): Promise<boolean> {
    try {
      await this.getById(id, config);
      return true;
    } catch (error) {
      // If error is 404, user doesn't exist
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(config?: RequestConfig): Promise<{
    total: number;
    companies: number;
    cities: number;
    domains: number;
  }> {
    const users = await this.getAll(undefined, config);
    const companies = new Set(users.map((user) => user.company.name));
    const cities = new Set(users.map((user) => user.address.city));
    const domains = new Set(users.map((user) => user.email.split("@")[1]));

    return {
      total: users.length,
      companies: companies.size,
      cities: cities.size,
      domains: domains.size,
    };
  }

  // Health Check Override
  override async getHealth(): Promise<{
    status: "healthy" | "unhealthy";
    details?: string;
  }> {
    try {
      const parentHealth = await super.getHealth();
      if (parentHealth.status === "unhealthy") {
        return parentHealth;
      }

      const testUser = await this.getById(1, { timeout: 5000 });
      if (testUser.id === 1) {
        return {
          status: "healthy",
          details: "Users service is operational and can fetch data",
        };
      }

      return {
        status: "unhealthy",
        details: "Users service health check failed - invalid response",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details: `Users service health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  // Private Helper Methods
  private static getDefaultConfig(baseUrl?: string): ApiServiceConfig {
    return {
      baseUrl: baseUrl || clientConfig.api.jsonPlaceholder.baseUrl,
      timeout: 15000,
      defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      retries: 3,
      retryDelay: 1000,
    };
  }

  private static buildConfig(
    config?: ApiServiceConfig,
    token?: string,
    apiKey?: string
  ): ApiServiceConfig {
    const baseConfig = config || UsersService.getDefaultConfig();

    if (token) {
      return {
        ...baseConfig,
        authStrategy: AuthStrategyFactory.createBearerToken(token),
      };
    }

    if (apiKey) {
      return {
        ...baseConfig,
        authStrategy: AuthStrategyFactory.createApiKey(apiKey),
      };
    }

    return baseConfig;
  }

  private applyClientSideFilters(users: User[], filters: UserFilters): User[] {
    return users.filter((user) => {
      if (
        filters.name &&
        !user.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.username &&
        !user.username.toLowerCase().includes(filters.username.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.email &&
        !user.email.toLowerCase().includes(filters.email.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.city &&
        !user.address.city.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.company &&
        !user.company.name.toLowerCase().includes(filters.company.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
}
