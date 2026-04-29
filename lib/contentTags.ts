import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type ContentTag = {
  /** Stable id (matches relationship value / folder name). */
  id: string;
  /** Human-readable label for UI. */
  title: string;
};

const TAGS_DIR = path.join(process.cwd(), "content", "tags");

/** Parse minimal one-level `key: value` YAML (Keystatic tag index files). */
function parseSimpleYaml(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(trimmed);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

export const getAllContentTags = cache(async (): Promise<ContentTag[]> => {
  let entries;
  try {
    entries = await fs.readdir(TAGS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const tags: ContentTag[] = [];

  for (const dirName of dirs) {
    const yamlPath = path.join(TAGS_DIR, dirName, "index.yaml");
    try {
      const raw = await fs.readFile(yamlPath, "utf8");
      const data = parseSimpleYaml(raw);
      const id = data.name?.trim() || dirName;
      const title = data.title?.trim() || prettifySlug(id);
      tags.push({ id, title });
    } catch {
      tags.push({ id: dirName, title: prettifySlug(dirName) });
    }
  }

  return tags.sort((a, b) => a.title.localeCompare(b.title, "en"));
});

export async function getTagTitleMap(): Promise<Map<string, string>> {
  const list = await getAllContentTags();
  return new Map(list.map((t) => [t.id, t.title]));
}

export function prettifySlug(id: string): string {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
