import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
