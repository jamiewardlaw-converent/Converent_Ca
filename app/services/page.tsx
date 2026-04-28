import SiteHeader from "../../components/SiteHeader";
import ServicesPillars from "../../components/ServicesPillars";
import { INDUSTRY_TILES } from "../../lib/industryTiles";
import { SERVICE_TILES } from "../../lib/serviceTiles";

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <header
        className="pageBanner"
        aria-labelledby="services-page-heading"
      >
        <div className="pageBannerInner">
          <h1 id="services-page-heading" className="pageBannerTitle">
            Services
          </h1>
        </div>
      </header>
      <main className="site">
        <article className="section card prosePage servicesIntro sectionToneDark">
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

        <ServicesPillars tiles={SERVICE_TILES} className="sectionToneLight" />

        <h2 className="servicesIndustriesHeading sectionToneLightHeading" id="industries-served">
          Industries served
        </h2>
        <ServicesPillars tiles={INDUSTRY_TILES} className="sectionToneLight" />
      </main>
    </>
  );
}
