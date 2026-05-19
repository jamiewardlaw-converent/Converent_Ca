/**
 * Shifts trouser-like pixels in the Ready2Scale hero toward Converent light blue
 * (`--accent` #1f9dff): yellow–greens (olive / “green” pants) and magenta / hot
 * pink pants. Run after replacing the source photo if you need to re-apply:
 *   node scripts/recolor-ready2scale-trousers.mjs
 */
import path from "node:path";
import sharp from "sharp";

const BRAND = path.join(process.cwd(), "public", "brand");
const FILE = path.join(BRAND, "ready2scale-steps-hero.png");

/** 0–255 → HSL: h 0–360, s/l 0–100 */
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = ((max + min) / 2) * 100;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 50 ? (d / (2 - max - min)) * 100 : (d / (max + min)) * 100;
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
    h *= 360;
  }
  return [h, s, l];
}

/** Converent light blue (globals --accent) */
const TR = 0x1f;
const TG = 0x9d;
const TB = 0xff;

function greenTrouserWeight(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l < 8 || l > 94) return 0;
  if (s < 14) return 0;
  // Exclude strong blues (jacket / sky)
  if (b > g + 35 && b > r + 20) return 0;
  // Green through yellow-green fabric
  if (h < 72 || h > 168) return 0;
  // Prefer pixels where green channel leads (avoids pink / purple)
  if (g < r - 8 && h > 130) return 0;
  const huePeak = 118;
  const hueFalloff = 1 - Math.min(1, Math.abs(h - huePeak) / 52);
  const satBoost = Math.min(1, (s - 14) / 55);
  const lumGate = 1 - Math.abs(l - 48) / 90;
  return Math.max(0, Math.min(1, hueFalloff * satBoost * (0.55 + 0.45 * lumGate)));
}

/** Hot pink / magenta clothing (reads “green” on some displays or user intent = colored trousers) */
function magentaPantWeight(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l < 22 || l > 92) return 0;
  if (s < 18) return 0;
  // Magenta / hot pink (avoid orange-brown wood: keep to magenta–pink sector)
  const inPinkHue = h >= 308 || h <= 20;
  if (!inPinkHue) return 0;
  if (r < 95 || r < b + 8) return 0;
  if (g > r + 25) return 0;
  const satBoost = Math.min(1, (s - 22) / 48);
  const lumGate = 1 - Math.abs(l - 52) / 85;
  return Math.max(0, Math.min(1, satBoost * (0.45 + 0.55 * lumGate)));
}

function trouserWeight(r, g, b) {
  return Math.min(1, Math.max(greenTrouserWeight(r, g, b), magentaPantWeight(r, g, b)));
}

async function main() {
  const img = sharp(FILE);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error(`Expected RGBA, got ${channels} channels`);

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const w = trouserWeight(r, g, b);
    if (w < 0.04) continue;
    const mix = 0.8 * w;
    out[i] = Math.round(r * (1 - mix) + TR * mix);
    out[i + 1] = Math.round(g * (1 - mix) + TG * mix);
    out[i + 2] = Math.round(b * (1 - mix) + TB * mix);
  }

  const tmp = path.join(BRAND, "ready2scale-steps-hero.tmp.png");
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp);

  const fs = await import("node:fs/promises");
  await fs.rename(tmp, FILE);

  console.log("Updated", path.relative(process.cwd(), FILE));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
