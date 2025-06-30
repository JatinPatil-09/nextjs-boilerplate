/**
 * User Types and Interfaces
 *
 * This module contains all user-related types based on JSONPlaceholder API structure
 * Following the naming conventions: PascalCase for interfaces and types
 */

// Geographic Location
export interface GeoLocation {
  lat: string;
  lng: string;
}

// User Address
export interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoLocation;
}

// User Company
export interface UserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

// Main User Entity
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: UserAddress;
  phone: string;
  website: string;
  company: UserCompany;
}

// User Creation Data (without ID)
export type CreateUserData = Omit<User, "id">;

// User Update Data (partial, without ID)
export type UpdateUserData = Partial<Omit<User, "id">>;

// User List Item (simplified for list views)
export interface UserListItem {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

// User Filter Parameters
export interface UserFilters {
  name?: string;
  username?: string;
  email?: string;
  city?: string;
  company?: string;
}

// User API Responses
export interface GetUsersResponse {
  users: User[];
  total: number;
}

export interface GetUserResponse {
  user: User;
}

export interface CreateUserResponse {
  user: User;
  success: boolean;
}

export interface UpdateUserResponse {
  user: User;
  success: boolean;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
