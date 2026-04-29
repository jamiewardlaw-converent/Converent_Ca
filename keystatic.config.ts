import { collection, config, fields } from "@keystatic/core";

export const showAdminUI = process.env.NODE_ENV === "development";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    tags: collection({
      label: "Tag library",
      slugField: "name",
      path: "content/tags/*/",
      schema: {
        name: fields.slug({
          name: { label: "Tag id" },
        }),
        title: fields.text({
          label: "Display name",
          validation: { isRequired: true },
        }),
      },
    }),
    perspectives: collection({
      label: "Perspectives",
      slugField: "title",
      path: "content/perspectives/*",
      format: { contentField: "content" },
      columns: ["title", "publishedAt", "featured"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
        }),
        tags: fields.array(
          fields.relationship({
            label: "Tag",
            collection: "tags",
            description:
              "Pick tags from the library only (stored as slugs). Free‑text labels break save/load.",
          }),
          {
            label: "Tags",
            itemLabel: (props) => props.value ?? "Select tag",
          },
        ),
        summary: fields.text({
          label: "Summary",
          multiline: true,
        }),
        publishedAt: fields.date({
          label: "Published date",
        }),
        featured: fields.checkbox({
          label: "Featured on homepage",
        }),
        image: fields.text({
          label: "Hero/tile image path",
          description: "Use a public path, e.g. /brand/photo1.jpg",
          validation: { isRequired: true },
        }),
        heroImagePosition: fields.select({
          label: "Hero image crop",
          description:
            "Use “Top” for tall photos (e.g. lighthouses) so the top stays visible; bottom may clip.",
          defaultValue: "center",
          options: [
            { label: "Center (default)", value: "center" },
            { label: "Top (show top of image)", value: "top" },
          ],
        }),
        content: fields.markdoc({
          label: "Body",
        }),
      },
    }),
    services: collection({
      label: "Expertise sections",
      slugField: "anchor",
      path: "content/services/*",
      format: { contentField: "content" },
      columns: ["position", "anchor", "title"],
      schema: {
        position: fields.number({
          label: "Order position",
          description: "Lower numbers appear first and drive left/right image alternation.",
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        anchor: fields.slug({
          name: { label: "Section id (anchor)" },
        }),
        title: fields.text({
          label: "Title",
          validation: { isRequired: true },
        }),
        logoSrc: fields.text({
          label: "Image path",
          description: "Optional public image path, e.g. /brand/mbse.png",
        }),
        excerpt: fields.text({
          label: "Excerpt",
          multiline: true,
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: "Body (optional)",
        }),
      },
    }),
    industries: collection({
      label: "Industries sections",
      slugField: "anchor",
      path: "content/industries/*",
      format: { contentField: "content" },
      columns: ["position", "anchor", "title"],
      schema: {
        position: fields.number({
          label: "Order position",
          description: "Lower numbers appear first and drive left/right image alternation.",
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        anchor: fields.slug({
          name: { label: "Section id (anchor)" },
        }),
        title: fields.text({
          label: "Title",
          validation: { isRequired: true },
        }),
        logoSrc: fields.text({
          label: "Image path",
          description: "Optional public image path, e.g. /brand/Automotive.png",
        }),
        excerpt: fields.text({
          label: "Excerpt",
          multiline: true,
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: "Body (optional)",
        }),
      },
    }),
  },
});
