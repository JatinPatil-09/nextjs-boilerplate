/**
 * Posts Service
 *
 * API service for managing posts with authentication support.
 * Extends BaseApiFactory but does NOT implement CrudOperations.
 */

import { clientConfig } from "@/lib/config";
import type { RequestConfig } from "@/types";

import { AuthStrategyFactory } from "../auth/auth-strategies";
import { BaseApiFactory } from "../core/api-factory";
import type { ApiServiceConfig } from "../core/api-service-interface";

import type {
  BatchPostRequest,
  BatchPostResponse,
  CreatePostData,
  Post,
  PostFilters,
  PostListItem,
  PostStatistics,
  UpdatePostData,
} from "./post-types";

export class PostsService extends BaseApiFactory {
  readonly serviceName = "PostsService";
  private readonly POSTS_ENDPOINT = "/posts";
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Cache
  private postsCache: Post[] | null = null;
  private cacheTimestamp: number = 0;

  constructor(config?: ApiServiceConfig, token?: string, apiKey?: string) {
    super(PostsService.buildConfig(config, token, apiKey));
  }

  // Static Factory Methods
  static withBearerToken(token: string, baseUrl?: string): PostsService {
    return new PostsService(PostsService.getDefaultConfig(baseUrl), token);
  }

  static withApiKey(apiKey: string, baseUrl?: string): PostsService {
    return new PostsService(
      PostsService.getDefaultConfig(baseUrl),
      undefined,
      apiKey
    );
  }

  static withoutAuth(baseUrl?: string): PostsService {
    return new PostsService(PostsService.getDefaultConfig(baseUrl));
  }

  // Core Methods
  async getAllPosts(
    useCache: boolean = true,
    config?: RequestConfig
  ): Promise<Post[]> {
    if (useCache && this.isCacheValid()) {
      return this.postsCache!;
    }

    const posts = await this.get<Post[]>(this.POSTS_ENDPOINT, config);
    this.updateCache(posts);
    return posts;
  }

  async getPostById(id: number, config?: RequestConfig): Promise<Post> {
    return await this.get<Post>(`${this.POSTS_ENDPOINT}/${id}`, config);
  }

  async getPostsByUserId(
    userId: number,
    config?: RequestConfig
  ): Promise<Post[]> {
    return await this.get<Post[]>(
      `${this.POSTS_ENDPOINT}?userId=${userId}`,
      config
    );
  }

  async createPost(
    data: CreatePostData,
    config?: RequestConfig
  ): Promise<Post> {
    const newPost = await this.post<Post>(this.POSTS_ENDPOINT, data, config);
    this.clearCache();
    return newPost;
  }

  async updatePost(
    id: number,
    data: UpdatePostData,
    config?: RequestConfig
  ): Promise<Post> {
    const updatedPost = await this.put<Post>(
      `${this.POSTS_ENDPOINT}/${id}`,
      data,
      config
    );
    this.clearCache();
    return updatedPost;
  }

  // Enhanced Methods
  async getEnhancedPosts(config?: RequestConfig): Promise<PostListItem[]> {
    const posts = await this.getAllPosts(true, config);
    return posts.map((post) => this.enhancePost(post));
  }

  async searchPosts(
    searchTerm: string,
    config?: RequestConfig
  ): Promise<Post[]> {
    const allPosts = await this.getAllPosts(true, config);
    const term = searchTerm.toLowerCase();

    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.body.toLowerCase().includes(term)
    );
  }

  async filterPosts(
    filters: PostFilters,
    config?: RequestConfig
  ): Promise<Post[]> {
    const allPosts = await this.getAllPosts(true, config);

    return allPosts.filter((post) => {
      if (filters.userId && post.userId !== filters.userId) {
        return false;
      }
      if (
        filters.title &&
        !post.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.body &&
        !post.body.toLowerCase().includes(filters.body.toLowerCase())
      ) {
        return false;
      }

      const wordCount = this.countWords(post.body);
      if (filters.minWordCount && wordCount < filters.minWordCount) {
        return false;
      }
      if (filters.maxWordCount && wordCount > filters.maxWordCount) {
        return false;
      }

      return true;
    });
  }

  async getTrendingPosts(
    limit: number = 10,
    config?: RequestConfig
  ): Promise<PostListItem[]> {
    const enhancedPosts = await this.getEnhancedPosts(config);
    return enhancedPosts
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, limit);
  }

  async getPostsStatistics(config?: RequestConfig): Promise<PostStatistics> {
    const posts = await this.getAllPosts(true, config);

    if (posts.length === 0) {
      throw new Error("No posts available for statistics");
    }

    const wordCounts = posts.map((post) => this.countWords(post.body));
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);

    const longestIndex = wordCounts.indexOf(Math.max(...wordCounts));
    const shortestIndex = wordCounts.indexOf(Math.min(...wordCounts));

    const postsByUser = posts.reduce(
      (acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    return {
      total: posts.length,
      totalUsers: Object.keys(postsByUser).length,
      averageWordsPerPost: Math.round(totalWords / posts.length),
      longestPost: {
        id: posts[longestIndex]!.id,
        title: posts[longestIndex]!.title,
        wordCount: wordCounts[longestIndex]!,
      },
      shortestPost: {
        id: posts[shortestIndex]!.id,
        title: posts[shortestIndex]!.title,
        wordCount: wordCounts[shortestIndex]!,
      },
      postsByUser,
    };
  }

  async batchFetchPosts(
    request: BatchPostRequest,
    config?: RequestConfig
  ): Promise<BatchPostResponse> {
    const results: Post[] = [];
    const errors: string[] = [];

    for (const postId of request.postIds) {
      try {
        const post = await this.getPostById(postId, config);
        results.push(post);
      } catch (error) {
        errors.push(
          `Failed to fetch post ${postId}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    const response: BatchPostResponse = {
      success: errors.length === 0,
      processedCount: results.length,
      failedCount: errors.length,
      data: results,
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  // Utility Methods
  clearCache(): void {
    this.postsCache = null;
    this.cacheTimestamp = 0;
  }

  override async getHealth(): Promise<{
    status: "healthy" | "unhealthy";
    details?: string;
  }> {
    try {
      const parentHealth = await super.getHealth();
      if (parentHealth.status === "unhealthy") {
        return parentHealth;
      }

      const testPost = await this.getPostById(1, { timeout: 3000 });
      if (testPost.id === 1) {
        return {
          status: "healthy",
          details: `Posts service operational. Cache: ${this.isCacheValid() ? "valid" : "invalid"}`,
        };
      }

      return {
        status: "unhealthy",
        details: "Posts service health check failed",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details: `Posts service health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  // Private Helper Methods
  private static getDefaultConfig(baseUrl?: string): ApiServiceConfig {
    return {
      baseUrl: baseUrl || clientConfig.api.jsonPlaceholder.baseUrl,
      timeout: 12000,
      defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      retries: 2,
      retryDelay: 800,
    };
  }

  private static buildConfig(
    config?: ApiServiceConfig,
    token?: string,
    apiKey?: string
  ): ApiServiceConfig {
    const baseConfig = config || PostsService.getDefaultConfig();

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

  private isCacheValid(): boolean {
    return (
      this.postsCache !== null &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    );
  }

  private updateCache(posts: Post[]): void {
    this.postsCache = posts;
    this.cacheTimestamp = Date.now();
  }

  private enhancePost(post: Post): PostListItem {
    const wordCount = this.countWords(post.body);
    const readingTime = Math.ceil(wordCount / 200);
    const excerpt =
      post.body.length > 100 ? post.body.substring(0, 97) + "..." : post.body;

    return {
      ...post,
      excerpt,
      wordCount,
      readingTime,
    };
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}
