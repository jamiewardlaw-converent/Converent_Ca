import { collection, config, fields } from "@keystatic/core";

export const showAdminUI = process.env.NODE_ENV === "development";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
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
        content: fields.markdoc({
          label: "Body",
        }),
      },
    }),
  },
});
