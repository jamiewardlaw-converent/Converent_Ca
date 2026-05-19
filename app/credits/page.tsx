import SiteHeader from "../../components/SiteHeader";
import CreditsList from "../../components/CreditsList";

export default function CreditsPage() {
  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="credits-page-heading">
        <div className="pageBannerInner">
          <h1 id="credits-page-heading" className="pageBannerTitle">
            Image credits
          </h1>
        </div>
      </header>
      <main className="site">
        <article className="section card prosePage creditsPage sectionToneDark">
          <p className="creditsPageLead">
            Third-party and stock imagery used on converent.ca. Add new rows in{" "}
            <code className="creditsPageCode">lib/imageCredits.ts</code> and mirror details in{" "}
            <code className="creditsPageCode">public/brand/IMAGE_ATTRIBUTIONS.md</code>.
          </p>
          <CreditsList />
          <p className="creditsPageRaw">
            <a href="/brand/IMAGE_ATTRIBUTIONS.md">Raw attributions file (Markdown)</a>
          </p>
          <p className="creditsPageBack">
            <a href="/">Home</a> · <a href="/contact">Contact</a>
          </p>
        </article>
      </main>
    </>
  );
}
