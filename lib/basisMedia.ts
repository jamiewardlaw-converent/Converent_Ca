import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BASIS_SCREENSHOT_PREFIX } from "./basisConstants";

const EXT = /\.(png|jpe?g|webp|avif|gif)$/i;

/**
 * Returns public URLs (e.g. `/brand/Screenshot_...png`) sorted by filename.
 * Add files under `public/brand/`; no restart needed in dev after adding files.
 */
export function getBasisScreenshots(): string[] {
  const dir = join(process.cwd(), "public", "brand");
  if (!existsSync(dir)) {
    return [];
  }
  try {
    return readdirSync(dir)
      .filter((name) => name.startsWith(BASIS_SCREENSHOT_PREFIX) && EXT.test(name))
      .sort()
      .map((name) => `/brand/${encodeURIComponent(name)}`);
  } catch {
    return [];
  }
}
