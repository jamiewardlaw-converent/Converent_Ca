import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import SiteHeader from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Ready2Scale | Converent",
  description:
    "Structured fractional and embedded support to help startups ship systems-heavy products with clarity, traceability, and production readiness.",
};

export default function Ready2ScalePage() {
  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="ready2scale-page-heading">
        <div className="pageBannerInner">
          <h1 id="ready2scale-page-heading" className="pageBannerTitle">
            Ready2Scale
          </h1>
        </div>
      </header>
      <main className="site">
        <article
          id="ready2scale-intro"
          className="section card prosePage ready2scaleIntro sectionToneDark"
        >
          <div className="ready2scaleIntroGrid">
            <div className="ready2scaleIntroBody">
              <p className="aboutIntroLead">
                <strong>Ready2Scale</strong>{' '}is Converent&apos;s packaged path for startups
                and small teams that need serious systems and safety discipline without
                building a full program office overnight—fractional leadership,
                hands-on engineering support, and lifecycle deliverables you can take to
                investors, partners, and production.
              </p>
              <p>
                Reach out to us to learn more and get focussed and tailored support to
                accelerate the transition to production.
              </p>
            </div>
            <div className="ready2scaleIntroVisual">
              <img
                src="/brand/ready2scale-steps-hero.png"
                alt="Outdoor staircase rising toward a tower structure."
                width={1200}
                height={900}
                decoding="async"
              />
            </div>
          </div>
        </article>

        <section
          id="ready2scale-contact"
          className="section card homeBand sectionToneDark"
          aria-label="Contact"
        >
          <div className="homeBandInner">
            <div className="eyebrow">Contact</div>
            <div className="homeBandGrow">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
