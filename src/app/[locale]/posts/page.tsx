import { PostCard } from "@/components/page/post/PostCard";
import { PostsAnalytics } from "@/components/page/post/PostsAnalytics";
import { PostsService } from "@/lib/api/posts";

export default async function PostsPage() {
  const postsService = PostsService.withoutAuth();

  // Add delay to see loading state (remove this in production)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Uncomment to test error page:
  //   throw new Error("Test error - API unavailable");

  const posts = await postsService.getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <PostsAnalytics totalPosts={posts.length} />

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="mt-2 text-gray-600">Browse all posts</p>
        </header>

        <div className="mb-6 text-sm text-gray-600">
          Showing {posts.length} posts
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
