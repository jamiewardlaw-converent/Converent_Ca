import ReactMarkdown from "react-markdown";
import {
  getPerspectiveBySlug,
  getPerspectiveSlugs,
} from "../../../lib/perspectives";
import SiteHeader from "../../../components/SiteHeader";

type PerspectivePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPerspectiveSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PerspectivePage({ params }: PerspectivePageProps) {
  const { slug } = await params;
  const item = await getPerspectiveBySlug(slug);

  if (!item) {
    return (
      <>
        <SiteHeader />
        <main className="site">
          <section className="section card sectionToneDark">
            <div className="eyebrow">Perspective</div>
            <h2>Perspective not found</h2>
            <p>The requested perspective is not available.</p>
            <p>
              <a href="/">Back to home</a>
            </p>
          </section>
        </main>
      </>
    );
  }

  const articleBody = Array.isArray(item.content)
    ? item.content.join("\n\n")
    : item.content;

  return (
    <>
      <SiteHeader />
      <main className="site">
        <section className="perspectiveHero card sectionToneDark">
          <img
            src={item.image}
            alt={item.title}
            className="perspectiveHeroImage"
          />
          <div className="perspectiveHeroOverlay">
            <div className="eyebrow">Perspective</div>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </div>
        </section>

        <article className="section card perspectiveArticle sectionToneLight">
          <ReactMarkdown>{articleBody}</ReactMarkdown>
          <p>
            <a href="/perspectives">← Back to perspectives</a>
          </p>
        </article>
      </main>
    </>
  );
}
