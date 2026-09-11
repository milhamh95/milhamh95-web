import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const posts = await getCollection("blog", ({ data }) => !data.draft);

// Card always uses Catppuccin Mocha, regardless of site mode — consistent everywhere
// a link preview renders (chat apps, social feeds), and it works whatever theme the
// person clicking the link happens to have.
const MOCHA_BASE: [number, number, number] = [30, 30, 46]; // #1e1e2e
const MOCHA_TEXT: [number, number, number] = [205, 214, 244]; // #cdd6f4
const MOCHA_MAUVE: [number, number, number] = [203, 166, 247]; // #cba6f7

const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

// Site-wide fallback card, served at /open-graph/home.png, used by pages that
// aren't a blog post (home, about, tags).
pages.home = {
  title: "milhamh.com",
  description: "Muhammad Ilham Hidayat's personal blog.",
  pubDate: new Date(),
  tags: [],
  draft: false,
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: (typeof posts)[number]["data"]) => ({
    title: page.title,
    description: page.description,
    bgGradient: [MOCHA_BASE],
    border: { color: MOCHA_MAUVE, width: 8 },
    font: {
      title: { color: MOCHA_TEXT, weight: "Bold" },
      description: { color: MOCHA_TEXT },
    },
  }),
});
