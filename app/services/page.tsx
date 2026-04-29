import SiteHeader from "../../components/SiteHeader";
import ServiceTiles from "../../components/ServiceTiles";
import ServicesPillars from "../../components/ServicesPillars";
import { getIndustrySections, getServiceSections } from "../../lib/servicesContent";

export default async function ServicesPage() {
  const [serviceTiles, industryTiles] = await Promise.all([
    getServiceSections(),
    getIndustrySections(),
  ]);

  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="expertise-page-heading">
        <div className="pageBannerInner">
          <h1 id="expertise-page-heading" className="pageBannerTitle">
            Expertise
          </h1>
        </div>
      </header>
      <main className="site">
        <article
          id="services-intro"
          className="section card prosePage servicesIntro sectionToneDark"
        >
          <p>
            Converent supports organizations developing safety-relevant embedded
            products by applying systems engineering principles in execution. We
            work with engineering teams to align requirements, architecture,
            implementation, verification, and risk into a single, traceable source
            of truth.
          </p>
          <p>
            From concept through production, we provide hands-on consulting,
            systems engineering, program leadership, and assurance support so teams
            can reach market readiness with confidence—across automotive,
            industrial, and adjacent safety-critical domains.
          </p>
          <p>
            <a href="/contact">Contact us</a> · <a href="/">Home</a>
          </p>
        </article>

        <ServicesPillars tiles={serviceTiles} className="sectionToneLight" />

        <section
          className="section card sectionToneLight servicesIndustriesStrip"
          id="industries-served"
          aria-labelledby="industries-served-heading"
        >
          <h2 className="servicesIndustriesHeading sectionToneLightHeading" id="industries-served-heading">
            Industries served
          </h2>
          <ServiceTiles tiles={industryTiles} linkMode="none" />
        </section>
      </main>
    </>
  );
}
