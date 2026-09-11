import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: "milhamh.com",
    description: "Muhammad Ilham Hidayat's personal blog.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
