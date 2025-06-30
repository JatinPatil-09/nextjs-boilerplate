# API Handling Documentation

This guide explains how to use the API boilerplate structure with real-world examples and step-by-step instructions.

## Architecture Overview

The API layer follows a domain-driven design with modular services. Each domain (posts, users, etc.) has its own service that extends the base API factory.

```
src/lib/api/
├── core/           # Base infrastructure
├── auth/           # Authentication strategies
├── posts/          # Posts domain service
├── user/           # Users domain service
└── index.ts        # Main exports
```

## Quick Start

### Step 1: Import the Service

```typescript
import { PostsService, UsersService } from "@/lib/api";
```

### Step 2: Create Service Instance

```typescript
// Without authentication
const postsService = PostsService.withoutAuth();

// With Bearer token
const authService = PostsService.withBearerToken("your-jwt-token");

// With API key
const apiService = PostsService.withApiKey("your-api-key");
```

### Step 3: Use the Service

```typescript
const posts = await postsService.getAllPosts();
const user = await usersService.getById(1);
```

## Real-World Examples

### Example 1: Blog Post Management

```typescript
// pages/posts/page.tsx
import { PostsService } from '@/lib/api'

export default async function PostsPage() {
  const postsService = PostsService.withoutAuth()

  try {
    const posts = await postsService.getAllPosts()

    return (
      <div>
        <h1>All Posts ({posts.length})</h1>
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </article>
        ))}
      </div>
    )
  } catch (error) {
    return <div>Error loading posts: {error.message}</div>
  }
}
```

### Example 2: User Profile with Authentication

```typescript
// components/UserProfile.tsx
import { UsersService } from '@/lib/api'

export async function UserProfile({ userId, token }: { userId: number, token: string }) {
  const usersService = UsersService.withBearerToken(token)

  try {
    const user = await usersService.getById(userId)

    return (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Company: {user.company.name}</p>
        <p>Address: {user.address.city}, {user.address.zipcode}</p>
      </div>
    )
  } catch (error) {
    if (error.status === 401) {
      return <div>Unauthorized access</div>
    }
    return <div>Error loading user profile</div>
  }
}
```

### Example 3: Creating New Content

```typescript
// components/CreatePost.tsx
import { PostsService } from '@/lib/api'
import { useState } from 'react'

export function CreatePost({ token }: { token: string }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const postsService = PostsService.withBearerToken(token)

    try {
      const newPost = await postsService.createPost({
        userId: 1,
        title,
        body
      })

      console.log('Post created:', newPost)
      setTitle('')
      setBody('')
    } catch (error) {
      console.error('Failed to create post:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post content"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### Example 4: Search and Filter

```typescript
// components/PostSearch.tsx
import { PostsService } from '@/lib/api'
import { useState, useEffect } from 'react'

export function PostSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      const postsService = PostsService.withoutAuth()

      try {
        const posts = await postsService.searchPosts(searchTerm)
        setResults(posts)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search posts..."
      />

      {loading && <p>Searching...</p>}

      <div>
        {results.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Authentication Strategies

### No Authentication

```typescript
const service = PostsService.withoutAuth();
```

### Bearer Token (JWT)

```typescript
const service = PostsService.withBearerToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);
```

### API Key

```typescript
// In header (default)
const service = PostsService.withApiKey("sk_live_123abc");

// In query parameter
const config = ServiceConfigBuilder()
  .setBaseUrl("https://api.example.com")
  .withApiKey("sk_live_123abc", "api_key", "query")
  .build();
const service = new PostsService(config);
```

### Custom Configuration

```typescript
import {
  ApiClient,
  ServiceConfigBuilder,
  AuthStrategyFactory,
} from "@/lib/api";

const config = ApiClient.createConfigBuilder()
  .setBaseUrl("https://api.myapp.com")
  .setTimeout(15000)
  .setRetries(5)
  .withBearerToken("your-token")
  .build();

const service = new PostsService(config);
```

## Error Handling

The API services throw typed errors that you can handle specifically:

```typescript
import {
  PostsService,
  NotFoundError,
  UnauthorizedError,
  NetworkError,
} from "@/lib/api";

try {
  const post = await postsService.getPostById(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Post not found");
  } else if (error instanceof UnauthorizedError) {
    console.log("Please log in");
  } else if (error instanceof NetworkError) {
    console.log("Check your internet connection");
  } else {
    console.log("Unexpected error:", error.message);
  }
}
```

## Available Services

### PostsService Methods

```typescript
// Basic CRUD
await postsService.getAllPosts();
await postsService.getPostById(1);
await postsService.createPost({ userId: 1, title: "Title", body: "Content" });
await postsService.updatePost(1, { title: "New Title" });

// Enhanced methods
await postsService.searchPosts("javascript");
await postsService.filterPosts({ userId: 1, minWordCount: 50 });
await postsService.getTrendingPosts(10);
await postsService.getPostsStatistics();
```

### UsersService Methods

```typescript
// Basic CRUD
await usersService.getAll()
await usersService.getById(1)
await usersService.create({ name: 'John', email: 'john@example.com', ... })
await usersService.update(1, { name: 'John Updated' })
await usersService.deleteUser(1)

// Enhanced methods
await usersService.searchUsers('john')
await usersService.getUsersByCompany('Acme Corp')
await usersService.getUsersByCity('New York')
await usersService.userExists(1)
```

## API Client Registry

For managing multiple services centrally:

```typescript
import { apiClient } from "@/lib/api";

// Register services
apiClient.registerService("posts", PostsService.withBearerToken("token"));
apiClient.registerService("users", UsersService.withBearerToken("token"));

// Get services
const postsService = apiClient.getService<PostsService>("posts");
const usersService = apiClient.getService<UsersService>("users");

// Health check all services
const healthStatus = await apiClient.getHealthStatus();
console.log(healthStatus); // { posts: { status: 'healthy' }, users: { status: 'healthy' } }
```

## Step-by-Step: Adding a New Service

### Step 1: Create Types

```typescript
// src/lib/api/products/product-types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  description: string;
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  description?: string;
}
```

### Step 2: Create Service

```typescript
// src/lib/api/products/product-service.ts
import { BaseApiFactory } from "../core/api-factory";
import type { ApiServiceConfig } from "../core/api-service-interface";
import { AuthStrategyFactory } from "../auth/auth-strategies";
import { clientConfig } from "@/lib/config";

export class ProductsService extends BaseApiFactory {
  readonly serviceName = "ProductsService";
  private readonly PRODUCTS_ENDPOINT = "/products";

  constructor(config?: ApiServiceConfig, token?: string) {
    super(ProductsService.buildConfig(config, token));
  }

  static withBearerToken(token: string, baseUrl?: string): ProductsService {
    return new ProductsService(
      ProductsService.getDefaultConfig(baseUrl),
      token
    );
  }

  static withoutAuth(baseUrl?: string): ProductsService {
    return new ProductsService(ProductsService.getDefaultConfig(baseUrl));
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.get<Product[]>(this.PRODUCTS_ENDPOINT);
  }

  async getProductById(id: number): Promise<Product> {
    return await this.get<Product>(`${this.PRODUCTS_ENDPOINT}/${id}`);
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return await this.post<Product>(this.PRODUCTS_ENDPOINT, data);
  }

  private static getDefaultConfig(baseUrl?: string): ApiServiceConfig {
    return {
      baseUrl: baseUrl || clientConfig.api.baseUrl,
      timeout: 10000,
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
    token?: string
  ): ApiServiceConfig {
    const baseConfig = config || ProductsService.getDefaultConfig();

    if (token) {
      return {
        ...baseConfig,
        authStrategy: AuthStrategyFactory.createBearerToken(token),
      };
    }

    return baseConfig;
  }
}
```

### Step 3: Create Index File

```typescript
// src/lib/api/products/index.ts
export { ProductsService } from "./product-service";
export type {
  Product,
  CreateProductData,
  UpdateProductData,
} from "./product-types";
```

### Step 4: Add to Main Export

```typescript
// src/lib/api/index.ts
export {
  ProductsService,
  type Product,
  type CreateProductData,
} from "./products";
```

### Step 5: Use the New Service

```typescript
import { ProductsService } from "@/lib/api";

const productsService = ProductsService.withBearerToken("your-token");
const products = await productsService.getAllProducts();
```

## Best Practices

### Use Environment Variables

```typescript
// Configure base URLs through environment variables
const config = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
};
```

### Handle Loading States

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await service.getData();
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Implement Retry Logic

The services automatically retry failed requests, but you can customize:

```typescript
const config = ApiClient.createConfigBuilder()
  .setRetries(5) // Number of retries
  .setRetryDelay(2000) // Base delay in ms
  .build();
```

### Cache Management

PostsService includes built-in caching. To clear cache:

```typescript
const postsService = PostsService.withoutAuth();
await postsService.createPost(newPost); // Automatically clears cache
```

This API structure provides type safety, error handling, authentication flexibility, and maintainable code organization for your Next.js application.
