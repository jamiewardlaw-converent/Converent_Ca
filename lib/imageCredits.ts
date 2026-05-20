/**
 * Image credits shown in the footer dialog and `/credits/` page.
 * When you add Vecteezy or other third-party assets, update this list and
 * `public/brand/IMAGE_ATTRIBUTIONS.md` together.
 */

export type CreditEntry = {
  /** Short description of where the asset is used */
  label: string;
  /** Link text is optional; defaults to hostname or "Source" */
  linkText?: string;
  href?: string;
  /** Plain line under the link (license, author, etc.) */
  detail?: string;
};

export type CreditSection = {
  id: string;
  title: string;
  intro?: string;
  entries: CreditEntry[];
};

export const IMAGE_CREDIT_SECTIONS: readonly CreditSection[] = [
  {
    id: "vecteezy",
    title: "Vecteezy",
    intro:
      "Stock photography used on this site under Vecteezy’s terms for the license tier of each download.",
    entries: [
      {
        label: "Medical Device industry tile (home & expertise pages)",
        linkText: "Medical Device Stock photos by Vecteezy",
        href: "https://www.vecteezy.com/free-photos/medical-device",
        detail:
          "License: follow Vecteezy’s requirements for your tier (see vecteezy.com/free-license).",
      },
      {
        label: "Aerospace industry tile (home & expertise pages)",
        linkText: "Aerospace Stock photos by Vecteezy",
        href: "https://www.vecteezy.com/free-photos/aerospace",
        detail:
          "License: follow Vecteezy’s requirements for your tier (see vecteezy.com/free-license).",
      },
    ],
  },
  {
    id: "commons-industry",
    title: "Wikimedia Commons — industry tiles",
    intro:
      "These industry tiles use compressed derivatives in `/brand/industries/`; originals and authors are on Wikimedia Commons (medical and aerospace use Vecteezy instead — see above).",
    entries: [
      {
        label: "Energy — wind turbines",
        linkText: "File on Commons",
        href: "https://commons.wikimedia.org/wiki/File:Wind_turbines_in_southern_California_2016.jpg",
        detail: "Erik Wilde — CC BY-SA 2.0",
      },
      {
        label: "Industrial — CNC milling",
        linkText: "File on Commons",
        href: "https://commons.wikimedia.org/wiki/File:CNC_milling_machine.jpg",
        detail: "Impressionmanufacturer — CC BY-SA 4.0",
      },
      {
        label: "Robotics — humanoid robots in a factory",
        linkText: "File on Commons",
        href: "https://commons.wikimedia.org/wiki/File:Humanoid_robots_standing_in_a_factory.png",
        detail:
          "Uploaded by Neriex89 — CC0 1.0 (public domain dedication); AI-generated media per Wikimedia Commons file page.",
      },
    ],
  },
  {
    id: "in-repo",
    title: "In-repo marketing",
    entries: [
      {
        label: "Automotive industry tile — `automotiveBrz.png`",
        detail: "Supplied by Converent (not from Commons or Vecteezy).",
      },
      {
        label: "Embedded Software expertise tile — `embedded-software.svg`",
        detail: "Supplied by Converent (not from Commons or Vecteezy).",
      },
      {
        label: "Ready2Scale page hero — `ready2scale-steps-hero.png`",
        detail:
          "Supplied by Converent (not from Commons or Vecteezy); shown on `/ready2scale` beside copy with a light CSS color treatment.",
      },
    ],
  },
  {
    id: "commons-other",
    title: "Other Wikimedia Commons photography",
    intro:
      "Additional photos (About page rail, services hero, Ready2Scale hero, etc.) are listed with authors and licenses in the repository file below.",
    entries: [
      {
        label: "Full file-by-file list",
        linkText: "IMAGE_ATTRIBUTIONS.md (raw)",
        href: "/brand/IMAGE_ATTRIBUTIONS.md",
        detail:
          "Opens the Markdown source in the browser; same content is maintained in the repo under public/brand/.",
      },
    ],
  },
] as const;
