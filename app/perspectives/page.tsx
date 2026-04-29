import {
  getPerspectivesNewestFirst,
} from "../../lib/perspectives";
import {
  getAllContentTags,
  getTagTitleMap,
  prettifySlug,
} from "../../lib/contentTags";
import SiteHeader from "../../components/SiteHeader";

type PerspectivesIndexPageProps = {
  searchParams?: Promise<{ tag?: string | string[] }>;
};

export default async function PerspectivesIndexPage({
  searchParams,
}: PerspectivesIndexPageProps) {
  const perspectivesNewestFirst = await getPerspectivesNewestFirst();
  const allTags = await getAllContentTags();
  const tagTitles = await getTagTitleMap();

  const sp = searchParams ? await searchParams : {};
  const rawTag = sp.tag;
  const activeTag =
    typeof rawTag === "string"
      ? rawTag
      : Array.isArray(rawTag)
        ? rawTag[0]
        : undefined;

  const filtered = activeTag
    ? perspectivesNewestFirst.filter((p) => p.tags.includes(activeTag))
    : perspectivesNewestFirst;

  const activeTagLabel =
    activeTag && (tagTitles.get(activeTag) ?? prettifySlug(activeTag));

  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="perspectives-page-heading">
        <div className="pageBannerInner">
          <h1 id="perspectives-page-heading" className="pageBannerTitle">
            Perspectives
          </h1>
          {activeTag ? (
            <p className="perspectivesFilterLine" id="perspectives-filter-status">
              Showing posts tagged &ldquo;{activeTagLabel}&rdquo;.{" "}
              <a href="/perspectives" className="perspectivesFilterClear">
                Show all
              </a>
            </p>
          ) : null}
        </div>
      </header>
      <main className="site">
        <section className="section card perspectivesIndexMain sectionToneDark">
          {allTags.length > 0 ? (
            <nav
              className="perspectivesTagBrowse"
              aria-label="Browse by tag"
            >
              {allTags.map((t) => (
                <a
                  key={t.id}
                  href={`/perspectives?tag=${encodeURIComponent(t.id)}`}
                  className={
                    activeTag === t.id
                      ? "perspectivesTagBrowseLink isActive"
                      : "perspectivesTagBrowseLink"
                  }
                >
                  {t.title}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="perspectivesGrid" role="list">
            {filtered.length === 0 ? (
              <p className="perspectivesEmptyFilter" role="status">
                No perspectives with this tag yet.{" "}
                <a href="/perspectives">Show all perspectives</a>
              </p>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.slug}
                  className="perspectiveTile card"
                  role="listitem"
                >
                  <a
                    className="perspectiveTileMain"
                    href={`/perspectives/${item.slug}`}
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
                  {item.tags.length > 0 ? (
                    <ul
                      className="perspectiveTileTagList"
                      aria-label="Tags for this perspective"
                    >
                      {item.tags.map((tagId) => (
                        <li key={tagId}>
                          <a
                            className="perspectiveTag perspectiveTag--tile"
                            href={`/perspectives?tag=${encodeURIComponent(tagId)}`}
                          >
                            {tagTitles.get(tagId) ?? prettifySlug(tagId)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
