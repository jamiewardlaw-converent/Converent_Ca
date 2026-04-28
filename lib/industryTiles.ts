import type { ServiceTile } from "./serviceTiles";

export const INDUSTRY_TILES: readonly ServiceTile[] = [
  {
    title: "Automotive",
    href: "/services",
    anchor: "automotive",
    logoSrc: "/brand/Automotive.png",
    excerpt:
      "ISO 26262–oriented work from concept through production: hazard analysis, safety goals, architecture and verification evidence, and integration discipline aligned with automotive release cycles.",
  },
  {
    title: "Energy",
    href: "/services",
    anchor: "energy",
    logoSrc: "/brand/Energy.png",
    excerpt:
      "Embedded products in oil & gas, power, and grid-adjacent domains—balancing reliability, regulation, and operational risk with clear system models, controls, and evidence through deployment.",
  },
  {
    title: "Industrial",
    href: "/services",
    anchor: "industrial",
    logoSrc: "/brand/Industrial.png",
    excerpt:
      "IEC 61508 and machinery functional safety: SIL targets, verification strategy, and traceability so controllers, drives, and safety devices ship with assurance that stands up to audit and field stress.",
  },
];
