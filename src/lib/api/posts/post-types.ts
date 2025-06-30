/**
 * Post Types
 *
 * Type definitions for the Posts API domain.
 * Based on JSONPlaceholder posts endpoint structure.
 */

/**
 * Core Post interface from JSONPlaceholder API
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Data for creating a new post
 * Note: id is auto-generated, so we exclude it
 */
export interface CreatePostData {
  userId: number;
  title: string;
  body: string;
}

/**
 * Data for updating a post
 * All fields are optional for partial updates
 */
export interface UpdatePostData {
  userId?: number;
  title?: string;
  body?: string;
}

/**
 * Post list item with additional computed properties
 */
export interface PostListItem extends Post {
  excerpt: string; // First 100 characters of body
  wordCount: number;
  readingTime: number; // Estimated reading time in minutes
}

/**
 * Post filters for searching/filtering
 */
export interface PostFilters {
  userId?: number;
  title?: string;
  body?: string;
  minWordCount?: number;
  maxWordCount?: number;
}

/**
 * Post statistics
 */
export interface PostStatistics {
  total: number;
  totalUsers: number;
  averageWordsPerPost: number;
  longestPost: {
    id: number;
    title: string;
    wordCount: number;
  };
  shortestPost: {
    id: number;
    title: string;
    wordCount: number;
  };
  postsByUser: Record<number, number>;
}

/**
 * Batch operation request
 */
export interface BatchPostRequest {
  postIds: number[];
  operation: "fetch" | "delete";
}

/**
 * Batch operation response
 */
export interface BatchPostResponse {
  success: boolean;
  processedCount: number;
  failedCount: number;
  data?: Post[];
  errors?: string[];
}
