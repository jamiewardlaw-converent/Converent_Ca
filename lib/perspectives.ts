import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { Perspective } from "./perspectiveTypes";

export type { Perspective } from "./perspectiveTypes";

const PERSPECTIVES_DIR = path.join(process.cwd(), "content", "perspectives");

type PerspectiveFrontmatter = Omit<Perspective, "content">;

function sortByPublishedDesc(items: Perspective[]): Perspective[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function normalizeFrontmatter(
  slug: string,
  frontmatter: Partial<PerspectiveFrontmatter>,
): PerspectiveFrontmatter {
  return {
    slug,
    title: frontmatter.title ?? slug,
    summary: frontmatter.summary ?? "",
    featured: Boolean(frontmatter.featured),
    image: frontmatter.image ?? "/brand/photo1.jpg",
    publishedAt: frontmatter.publishedAt ?? "1970-01-01",
  };
}

const loadPerspectives = cache(async (): Promise<Perspective[]> => {
  const entries = await fs.readdir(PERSPECTIVES_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.(md|mdoc|mdx)$/i.test(entry.name))
    .map((entry) => entry.name);

  const perspectives = await Promise.all(
    files.map(async (filename) => {
      const fullPath = path.join(PERSPECTIVES_DIR, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const slug = path.basename(filename).replace(/\.(md|mdoc|mdx)$/i, "");
      const frontmatter = normalizeFrontmatter(
        slug,
        parsed.data as Partial<PerspectiveFrontmatter>,
      );

      return {
        ...frontmatter,
        content: parsed.content.trim(),
      };
    }),
  );

  return sortByPublishedDesc(perspectives);
});

export async function getAllPerspectives() {
  return loadPerspectives();
}

export async function getPerspectiveSlugs() {
  const items = await loadPerspectives();
  return items.map((item) => item.slug);
}

export async function getPerspectiveBySlug(slug: string) {
  const items = await loadPerspectives();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getPerspectivesNewestFirst() {
  return loadPerspectives();
}

export async function getFeaturedPerspectives() {
  const sorted = await loadPerspectives();
  const featured = sorted.filter((i) => i.featured).slice(0, 4);
  if (featured.length >= 4) return featured;
  const used = new Set(featured.map((i) => i.slug));
  const rest = sorted.filter((i) => !used.has(i.slug));
  return [...featured, ...rest.slice(0, 4 - featured.length)];
}
