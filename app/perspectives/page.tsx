import { perspectivesNewestFirst } from "../../lib/perspectives";
import SiteHeader from "../../components/SiteHeader";

export default function PerspectivesIndexPage() {
  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="perspectives-page-heading">
        <div className="pageBannerInner">
          <h1 id="perspectives-page-heading" className="pageBannerTitle">
            Perspectives
          </h1>
        </div>
      </header>
      <main className="site">
        <section className="section card perspectivesIndexMain sectionToneDark">
          <div className="perspectivesGrid" role="list">
            {perspectivesNewestFirst.map((item) => (
              <a
                key={item.slug}
                href={`/perspectives/${item.slug}`}
                className="perspectiveTile card"
                role="listitem"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="perspectiveTileImage"
                />
                <div className="eyebrow">Perspective</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="tileCta">Read full perspective →</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
