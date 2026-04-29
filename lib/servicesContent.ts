import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { ServiceTile } from "./serviceTiles";

type ServiceSectionFrontmatter = {
  title?: string;
  anchor?: string;
  position?: number;
  logoSrc?: string;
  excerpt?: string;
};

const SERVICES_DIR = path.join(process.cwd(), "content", "services");
const INDUSTRIES_DIR = path.join(process.cwd(), "content", "industries");

type NormalizedSection = ServiceTile & {
  position: number;
};

function normalizeSection(
  fallbackAnchor: string,
  frontmatter: ServiceSectionFrontmatter,
  body: string,
): NormalizedSection {
  const anchor = (frontmatter.anchor ?? fallbackAnchor).trim();
  const numericPosition =
    typeof frontmatter.position === "number" && Number.isFinite(frontmatter.position)
      ? frontmatter.position
      : Number.MAX_SAFE_INTEGER;
  return {
    title: (frontmatter.title ?? anchor).trim(),
    href: "/services",
    anchor,
    position: numericPosition,
    logoSrc: frontmatter.logoSrc?.trim() || undefined,
    excerpt: (frontmatter.excerpt ?? "").trim(),
    body: body.length > 0 ? body : undefined,
  };
}

async function readSectionDirectory(dir: string): Promise<ServiceTile[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.(md|mdoc|mdx)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const sections = await Promise.all(
    files.map(async (filename) => {
      const fullPath = path.join(dir, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const fallbackAnchor = path.basename(filename).replace(/\.(md|mdoc|mdx)$/i, "");
      const body = parsed.content.trim();
      return normalizeSection(
        fallbackAnchor,
        parsed.data as ServiceSectionFrontmatter,
        body,
      );
    }),
  );

  return sections
    .filter((section) => section.excerpt.length > 0)
    .sort((a, b) => {
      if (a.position !== b.position) return a.position - b.position;
      return a.title.localeCompare(b.title);
    })
    .map(({ position: _position, ...tile }) => tile);
}

const loadServiceSections = cache(async () => readSectionDirectory(SERVICES_DIR));
const loadIndustrySections = cache(async () => readSectionDirectory(INDUSTRIES_DIR));

export async function getServiceSections() {
  return loadServiceSections();
}

export async function getIndustrySections() {
  return loadIndustrySections();
}
