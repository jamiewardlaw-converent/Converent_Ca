/**
 * Basename prefix for **sanitized** BASIS preview images in `public/brand/`.
 * Only commit blurred exports (`basis-safe-*.webp`). Raw UI captures must not
 * ship in `public/` (they would remain downloadable at `/brand/...`).
 *
 * Generate previews from raw shots: `npm run basis:previews` (see script).
 */
export const BASIS_SCREENSHOT_PREFIX = "basis-safe-";
