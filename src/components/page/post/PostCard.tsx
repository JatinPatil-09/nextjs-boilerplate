"use client";

import { useAnalytics } from "@/hooks";
import type { Post } from "@/lib/api/posts/post-types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { track } = useAnalytics();

  const handlePostClick = () => {
    track("post_clicked", {
      post_id: post.id,
      post_title: post.title,
      user_id: post.userId,
      page: "posts",
      timestamp: new Date().toISOString(),
    });
  };

  const handlePostHover = () => {
    track("post_hovered", {
      post_id: post.id,
      user_id: post.userId,
      page: "posts",
    });
  };

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handlePostClick}
      onMouseEnter={handlePostHover}
    >
      <div className="mb-2 text-sm text-gray-500">
        Post #{post.id} • User {post.userId}
      </div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900 capitalize">
        {post.title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{post.body}</p>
    </div>
  );
}
