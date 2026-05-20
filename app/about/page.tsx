import ContactForm from "../../components/ContactForm";
import SiteHeader from "../../components/SiteHeader";

const ABOUT_RAIL_IMAGES = [
  { src: "/brand/cnrl-horizon-custom.jpg", alt: "CNRL Horizon Oil Sands" },
  { src: "/brand/hms-sceptre-custom.jpg", alt: "HMS Sceptre" },
  { src: "/brand/westport-volvo-hpdi.jpg", alt: "Westport Volvo HPDI" },
  { src: "/brand/evs.jpg", alt: "Electric vehicles" },
  { src: "/brand/ford-motor-company.jpg", alt: "Ford Motor Company" },
  { src: "/brand/unifire.jpg", alt: "Unifire" },
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
                Incorporated in 2026 by Jamie Wardlaw, Converent was established to bring the principles and practices of systems engineering to a wider audience. Converent is a sole-contractor consulting firm focused on helping teams achieve convergence in the development of complex products. Drawing on nearly 30 years of experience in embedded systems development, its aim is simple: improve the quality of products delivered to market by engineering out systematic failure and managing residual risk through disciplined application of systems engineering.
              </p>
              <p>
              Over the course of my career, I have worked across a broad spectrum of products, from web‑based systems to highly complex and safety‑critical platforms. Across this range, a consistent pattern has emerged: systematic engineering practices are the key to successful outcomes. Whether enabling safe startup of large-scale industrial systems in the Canadian oil sands, delivering safety concepts for next-generation electric vehicles, or supporting prototype engine development with major OEMs, structured processes consistently deliver better results.
              </p>
              <p>
              Working across industries and domains led me repeatedly back to systems engineering as the unifying discipline. Today, emerging technologies are removing many of the historical barriers to adopting these principles. Products can reach market faster while being more fully defined, and the long-standing concern that “doing things right” introduces excessive overhead is steadily diminishing.
            </p>
              <p>
              This cross-industry perspective allows me to operate without bias toward specific tools, methods, or legacy practices, and instead focus on what matters most: enabling effective, fit-for-purpose development lifecycles. Combined with formal experience in standards and governance, this enables me to help organizations tailor their processes while ensuring that critical engineering principles are maintained.
              </p>
              <p>
              In addition to advisory work, I have built and led teams delivering products from the ground up. I welcome opportunities to support early-stage startups or established organizations in a fractional leadership capacity, helping to shape both systems and teams.
              </p>
              <p>If you have an emergent need for support in delivery of complex products or services I would welcome the opportunity to discuss how I can help. Look forward to working with you!</p>
              <p>JW</p>
            </div>
            <aside className="aboutIntroRail" aria-label="Project image highlights">
              {ABOUT_RAIL_IMAGES.map((item) => (
                <figure key={item.src} className="aboutIntroTile">
                  <img src={item.src} alt={item.alt} className="aboutIntroImage" />
                </figure>
              ))}
            </aside>
          </div>
        </article>

        <section
          id="about-contact"
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
