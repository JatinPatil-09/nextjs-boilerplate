/**
 * User Domain Module
 *
 * Modular organization of all user-related functionality.
 * This includes services, types, and any user-specific logic.
 */

// User service
export { UsersService } from "./user-service";

// User types
export type {
  CreateUserData,
  CreateUserResponse,
  DeleteUserResponse,
  GeoLocation,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserData,
  UpdateUserResponse,
  User,
  UserAddress,
  UserCompany,
  UserFilters,
  UserListItem,
} from "./user-types";
