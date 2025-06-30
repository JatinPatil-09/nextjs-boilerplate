/**
 * Posts Domain Module
 *
 * Barrel export for posts domain functionality.
 * This module demonstrates a service that doesn't use CrudOperations.
 */

// Posts service
export { PostsService } from "./post-service";

// Posts types
export type {
  BatchPostRequest,
  BatchPostResponse,
  CreatePostData,
  Post,
  PostFilters,
  PostListItem,
  PostStatistics,
  UpdatePostData,
} from "./post-types";
