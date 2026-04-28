import { getBasisScreenshots } from "../lib/basisMedia";
import { getFeaturedPerspectives } from "../lib/perspectives";
import BasisSection from "../components/BasisSection";
import FeaturedPerspectivesCarousel from "../components/FeaturedPerspectivesCarousel";
import SiteHeader from "../components/SiteHeader";
import ServiceTiles from "../components/ServiceTiles";
import ContactForm from "../components/ContactForm";
import { INDUSTRY_TILES } from "../lib/industryTiles";
import { SERVICE_TILES } from "../lib/serviceTiles";

const BASIS_TAGLINE =
  "The lightweight solution to a traceable safety case!";

export default async function HomePage() {
  const basisImageSrcs = getBasisScreenshots();
  const featuredPerspectives = await getFeaturedPerspectives();
  return (
    <>
      <SiteHeader />
      <main className="site">
        <section
          id="about"
          className="section card homeBand sectionToneDark"
          aria-labelledby="home-intro-heading"
        >
          <div className="homeBandInner">
            <h2 id="home-intro-heading">Clarity in Systems & Software</h2>
            <p className="homeBandLead homeBandLeadOnTop">
              Converent provides tailored, hands-on experience in safety-related
              embedded systems development. We work alongside your team to turn
              intent into traceable design decisions, clear evidence, and
              shippable outcomes—without drowning in process for its own sake.
            </p>
            <a href="/about" className="learnMoreButton">
              Learn more
            </a>
          </div>
        </section>

        <section id="services" className="section card homeBand sectionToneLight">
          <div className="homeBandInner">
            <div className="eyebrow">Services</div>
            <h2>Embedded Systems &amp; Safety Engineering</h2>
            <p className="homeBandLead">
              Converent supports teams building safety-relevant embedded products
              with hands-on consulting, systems engineering, program leadership, and
              assurance from concept through production.
            </p>
            <ServiceTiles tiles={SERVICE_TILES} />
            <div className="industriesServedBlock">
              <h2 className="servicesIndustriesHeading">Industries served</h2>
              <ServiceTiles tiles={INDUSTRY_TILES} />
            </div>
            <a href="/services" className="learnMoreButton">
              Learn more
            </a>
          </div>
        </section>

        <section
          id="perspectives"
          className="section card homeBand sectionToneLight"
        >
          <div className="homeBandInner">
            <div className="eyebrow">Perspectives</div>
            <h2>
              Practical thinking on Systems, safety and complex product
              development
            </h2>
            <div className="homeBandCarousel">
              <FeaturedPerspectivesCarousel perspectives={featuredPerspectives} />
            </div>
          </div>
        </section>

        <section
          id="basis"
          className="section card homeBand basisHomeBand sectionToneLight"
          aria-labelledby="basis-heading"
        >
          <div className="homeBandInner basisHomeBandInner">
            <BasisSection
              imageSrcs={basisImageSrcs}
              tagline={BASIS_TAGLINE}
            />
          </div>
        </section>

        <section id="contact" className="section card homeBand sectionToneDark">
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
