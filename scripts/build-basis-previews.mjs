/**
 * Reads sharp BASIS screenshots in public/brand (Screenshot 2026-04-24 17*),
 * writes lightly blurred WebP previews (basis-safe-*.webp), then deletes sources.
 *
 * Run: npm run basis:previews
 *
 * After running, commit only basis-safe-*.webp — do not re-commit raw screenshots.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BRAND = path.join(process.cwd(), "public", "brand");
const SOURCE_PREFIX = "Screenshot 2026-04-24 17";
const OUT_PREFIX = "basis-safe-";
const EXT = /\.(png|jpe?g|webp|avif)$/i;

/** Tunable: stronger = more privacy, softer = more “product shot”. */
const MAX_WIDTH = 1040;
const BLUR_SIGMA = 12;
const WEBP_QUALITY = 72;

async function main() {
  if (!fs.existsSync(BRAND)) {
    console.error("Missing public/brand");
    process.exit(1);
  }

  const sources = fs
    .readdirSync(BRAND)
    .filter((name) => name.startsWith(SOURCE_PREFIX) && EXT.test(name))
    .sort();

  if (sources.length === 0) {
    console.log(
      `No source files matching "${SOURCE_PREFIX}*". Nothing to do.`,
    );
    return;
  }

  for (const name of fs.readdirSync(BRAND)) {
    if (name.startsWith(OUT_PREFIX) && /\.webp$/i.test(name)) {
      fs.unlinkSync(path.join(BRAND, name));
      console.log("Removed old", name);
    }
  }

  let idx = 0;
  for (const name of sources) {
    idx += 1;
    const inPath = path.join(BRAND, name);
    const outName = `${OUT_PREFIX}${String(idx).padStart(2, "0")}.webp`;
    const outPath = path.join(BRAND, outName);

    await sharp(inPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .blur(BLUR_SIGMA)
      .modulate({ brightness: 0.97, saturation: 0.88 })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(outPath);

    console.log("Wrote", outName);
  }

  for (const name of sources) {
    fs.unlinkSync(path.join(BRAND, name));
    console.log("Removed source", name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
