"use client";

import { useEffect } from "react";

import { useAnalytics } from "@/hooks";

interface PostsAnalyticsProps {
  totalPosts: number;
}

export function PostsAnalytics({ totalPosts }: PostsAnalyticsProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    // Track page view when component mounts
    track("posts_page_viewed", {
      page: "posts",
      total_posts: totalPosts,
      timestamp: new Date().toISOString(),
    });
  }, [track, totalPosts]);

  // This component doesn't render anything, it's just for analytics
  return null;
}
