import type { APIRoute } from "astro";
import { getPublishedPosts } from "../lib/posts";

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    category: post.data.category,
    tags: post.data.tags,
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
