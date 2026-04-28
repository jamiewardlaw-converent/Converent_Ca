import SiteHeader from "../../components/SiteHeader";

const ABOUT_RAIL_IMAGES = [
  { src: "/brand/cnrl-horizon-custom.jpg", alt: "CNRL Horizon Oil Sands" },
  { src: "/brand/hms-sceptre-custom.jpg", alt: "HMS Sceptre" },
  { src: "/brand/westport-volvo-hpdi.jpg", alt: "Westport Volvo HPDI" },
  { src: "/brand/evs.jpg", alt: "Electric vehicles" },
  { src: "/brand/ford-motor-company.jpg", alt: "Ford Motor Company" },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="about-page-heading">
        <div className="pageBannerInner">
          <h1 id="about-page-heading" className="pageBannerTitle">
            About
          </h1>
        </div>
      </header>
      <main className="site">
        <article className="section card prosePage aboutIntro sectionToneDark">
          <p className="aboutIntroLead">
            <strong>Clarity in Systems and Software.</strong> Converent exists to
            help teams engineer convergence-when requirements, architecture,
            implementation, and verification stay aligned and the digital thread
            stays intact.
          </p>
          <div className="aboutIntroLayout">
            <div className="aboutIntroBody">
              <p className="aboutP2WithPortrait">
                <img
                  src="/brand/about-jamie-portrait.png"
                  alt="Jamie Wardlaw portrait"
                  className="aboutInlinePortrait"
                />
                Incorporated in 2026 by <strong>Jamie Wardlaw</strong> to deliver
                to a wider audience the principles and practices of systems
                engineering. <strong>Converent </strong>
                is a sole-contractor consulting firm focused on helping teams
                engineer convergence. Drawing on almost 30 years experience in the
                field of embedded systems development; it is the goal of Converent
                to improve systematically the quality of products that are delivered
                to market. Engineering out systematic failure and managing residual
                risk through the use of systems engineering principles and
                practices.
              </p>
              <p>
                Over the course of my career I have been lucky enough to work on
                products from as simple as a website to as complex as a nuclear
                submarine. A common theme throughout has been that systematic
                engineering practices are the key to success. Whether that be firing
                up safely the largest of heaters in the Canadian Oil Sands,
                delivering safety concepts on next generation EVs or prototype
                engine starts with the biggest OEMs; systematic processes always
                win.
              </p>
              <p>
                The mindset that develops through working across many Industries on
                a broad range of complex systems had me continually returning the
                domain of Systems Engineering. Most recently the opportunities that
                emerging technologies present are removing barriers to honoring the
                key tenets of systematic development. Products go to market faster
                but can be more wholly defined. The fear that persisted for many
                years of the extra time or overhead of 'doing things right'
                diminishes.
            </p>
              <p>
                The cross-industry appreciation that I have been able to gain
                allows me to remove bias and rhetoric and focus on what
                matters most to the development lifecycle. This experience,
                reinforced by formal training in governing processes and standards
                allows me to deliver a service that is if not completely complete
                at least as complete as possible. It enables me to help teams tailor the lifecycle while ensuring the key tenets are honored.
              </p>
              <p>
                In addition to guiding organizations on the key tenets of
                systematic development I have also been lucky enough to build and
                lead teams delivering products from the ground up. I welcome 
                opportunities with early stage startups or established companies who
                need fractional support in building and leading their teams.
              </p>
              <p>If you have an emergent need for support in delivery of complex products or services I would welcome the opportunity to discuss how I can help. Look forward to working with you!</p>
              <p>JW</p>
              <p className="aboutIntroLinks">
                <a href="/contact">Contact us</a> · <a href="/">Home</a>
              </p>
            </div>
            <aside className="aboutIntroRail" aria-label="Project image highlights">
              {ABOUT_RAIL_IMAGES.map((item) => (
                <img key={item.src} src={item.src} alt={item.alt} className="aboutIntroImage" />
              ))}
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
