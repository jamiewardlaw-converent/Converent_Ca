import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BASIS_SCREENSHOT_PREFIX } from "./basisConstants";

const EXT = /\.(png|jpe?g|webp|avif|gif)$/i;

/**
 * Returns public URLs for **sanitized** BASIS previews (e.g. `/brand/basis-safe-01.webp`)
 * sorted by filename. Only blurred assets should use this prefix in `public/brand/`.
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
