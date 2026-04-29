export type Perspective = {
  slug: string;
  title: string;
  summary: string;
  /** Topic labels (freeform); empty when unset in frontmatter. */
  tags: string[];
  content: string | string[];
  featured: boolean;
  image: string;
  /** Hero crop: `top` anchors `object-position` to show the top of tall photos. */
  heroImagePosition: "center" | "top";
  publishedAt: string;
};
