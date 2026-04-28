export type ServiceTile = {
  title: string;
  /** Base path (e.g. `/services`); home tiles link with `#${anchor}`. */
  href: string;
  /** In-page id on `/services` (e.g. `mbse` → `id="mbse"`). */
  anchor: string;
  logoSrc?: string;
  /** Short body copy for the Services page pillar. */
  excerpt: string;
};

export const SERVICE_TILES: readonly ServiceTile[] = [
  {
    title: "Model Based Systems Engineering",
    href: "/services",
    anchor: "mbse",
    logoSrc: "/brand/mbse.png",
    excerpt:
      "Structure requirements, architecture, and verification as connected artifacts so intent stays traceable from concept to production. Model-based workflows that stay practical for delivery teams—not shelf-ware.",
  },
  {
    title: "Functional Safety",
    href: "/services",
    anchor: "functional-safety",
    logoSrc: "/brand/fusa.png",
    excerpt:
      "Hands-on support for hazard analysis, safety goals, evidence, and the assurance narrative your auditors expect—without burying the engineering team in paperwork for its own sake.",
  },
  {
    title: "Project & Program Management",
    href: "/services",
    anchor: "project-program",
    logoSrc: "/brand/pmp.png",
    excerpt:
      "Program leadership that keeps scope, risk, and integration visible: planning, milestones, cross-functional alignment, and the steady rhythm needed to reach production readiness with confidence.",
  },
];
