import type { Perspective } from "./perspectiveTypes";
import { aiForcesTheHandOfSystemsThinking } from "./perspectives/aiForcesTheHandOfSystemsThinking";
import { converentSystems } from "./perspectives/converentSystems";
import { templatePerspective3 } from "./perspectives/templatePerspective3";
import { templatePerspective4 } from "./perspectives/templatePerspective4";
import { templatePerspective5 } from "./perspectives/templatePerspective5";
import { templatePerspective6 } from "./perspectives/templatePerspective6";

export type { Perspective } from "./perspectiveTypes";

export const perspectives: Perspective[] = [
  aiForcesTheHandOfSystemsThinking,
  converentSystems,
  templatePerspective3,
  templatePerspective4,
  templatePerspective5,
  templatePerspective6,
];

/** Newest first */
function sortByPublishedDesc(items: Perspective[]): Perspective[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Up to 4 items for the homepage carousel: featured posts (newest first), then
 * fill remaining slots with the latest non-featured posts.
 */
export const featuredPerspectives = (() => {
  const sorted = sortByPublishedDesc(perspectives);
  const featured = sorted.filter((i) => i.featured).slice(0, 4);
  if (featured.length >= 4) return featured;
  const used = new Set(featured.map((i) => i.slug));
  const rest = sorted.filter((i) => !used.has(i.slug));
  return [...featured, ...rest.slice(0, 4 - featured.length)];
})();

export const perspectivesNewestFirst = sortByPublishedDesc(perspectives);
