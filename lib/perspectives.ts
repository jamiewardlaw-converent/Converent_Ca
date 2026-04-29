import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { Perspective } from "./perspectiveTypes";

export type { Perspective } from "./perspectiveTypes";

const PERSPECTIVES_DIR = path.join(process.cwd(), "content", "perspectives");

type PerspectiveFrontmatter = Omit<Perspective, "content" | "publishedAt"> & {
  publishedAt?: string;
};

function sortByPublishedDesc(items: Perspective[]): Perspective[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function hasValidPublishedDate(value: string | undefined): value is string {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function normalizeTags(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map((t) => {
        if (typeof t === "string") return t.trim();
        if (t && typeof t === "object") {
          const o = t as Record<string, unknown>;
          if (typeof o.slug === "string") return o.slug.trim();
          if (typeof o.id === "string") return o.id.trim();
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeHeroImagePosition(value: unknown): "center" | "top" {
  return value === "top" ? "top" : "center";
}

function normalizeFrontmatter(
  slug: string,
  frontmatter: Partial<PerspectiveFrontmatter>,
): PerspectiveFrontmatter {
  return {
    slug,
    title: frontmatter.title ?? slug,
    summary: frontmatter.summary ?? "",
    tags: normalizeTags(frontmatter.tags),
    featured: Boolean(frontmatter.featured),
    image: frontmatter.image ?? "/brand/photo1.jpg",
    heroImagePosition: normalizeHeroImagePosition(frontmatter.heroImagePosition),
    publishedAt: frontmatter.publishedAt,
  };
}

const loadPerspectives = cache(async (): Promise<Perspective[]> => {
  const entries = await fs.readdir(PERSPECTIVES_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.(md|mdoc|mdx)$/i.test(entry.name))
    .map((entry) => entry.name);

  const perspectives: Array<Perspective | null> = await Promise.all(
    files.map(async (filename) => {
      const fullPath = path.join(PERSPECTIVES_DIR, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const slug = path.basename(filename).replace(/\.(md|mdoc|mdx)$/i, "");
      const frontmatter = normalizeFrontmatter(
        slug,
        parsed.data as Partial<PerspectiveFrontmatter>,
      );

      if (!hasValidPublishedDate(frontmatter.publishedAt)) {
        return null;
      }

      return {
        ...frontmatter,
        publishedAt: frontmatter.publishedAt,
        content: parsed.content.trim(),
      };
    }),
  );

  const publishedPerspectives = perspectives.filter((item) => item !== null);

  return sortByPublishedDesc(publishedPerspectives);
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
