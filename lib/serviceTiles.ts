export type ServiceTile = {
  title: string;
  /** Base path (e.g. `/services`); home tiles link with `#${anchor}`. */
  href: string;
  /** In-page id on `/services` (e.g. `mbse` → `id="mbse"`). */
  anchor: string;
  logoSrc?: string;
  /** Short body copy for the Services page pillar. */
  excerpt: string;
  /** Optional longer markdown body shown in expandable card content. */
  body?: string;
};
