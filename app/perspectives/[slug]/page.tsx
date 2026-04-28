import { perspectives } from "../../../lib/perspectives";
import SiteHeader from "../../../components/SiteHeader";

type PerspectivePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return perspectives.map((item) => ({ slug: item.slug }));
}

export default async function PerspectivePage({ params }: PerspectivePageProps) {
  const { slug } = await params;
  const item = perspectives.find((p) => p.slug === slug);

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
          {item.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <a href="/perspectives">← Back to perspectives</a>
          </p>
        </article>
      </main>
    </>
  );
}
