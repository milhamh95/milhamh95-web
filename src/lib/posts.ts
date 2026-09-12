import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

const WORDS_PER_MINUTE = 200;

export function getReadingTime(post: CollectionEntry<"blog">): string {
  const words = post.body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
