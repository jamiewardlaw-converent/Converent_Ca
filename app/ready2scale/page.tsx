import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import SiteHeader from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Ready2Scale | Converent",
  description:
    "From concept to production. From production to scale. Defined outcomes, predictable cost, and a path built for startup timelines.",
};

const PACKAGES = [
  {
    id: "discovery",
    name: "Discovery",
    tagline: "Clarity and direction",
    summary:
      "A focused, fixed-cost engagement to establish where the product stands, what is missing and what needs to happen next.",
    points: [
      "Review the product roadmap, architecture and delivery plan",
      "Assess engineering, systems, safety and production readiness",
      "Identify critical risks, constraints and capability gaps",
      "Build a prioritized roadmap toward approval, production and scale",
      "Define the level of support required to execute it",
    ],
    outcome:
      "A clear, actionable path from the current product baseline to production readiness.",
  },
  {
    id: "ready",
    name: "Ready",
    tagline: "Structured leadership and execution",
    summary:
      "Fractional engineering and functional safety leadership to build the foundations, control delivery risk and move the product toward production.",
    points: [
      "Systems architecture and engineering leadership",
      "Requirements, functional safety and verification support",
      "Compliance and product-approval readiness",
      "Program-level prioritization and decision support",
      "Supplier, process and engineering-tool alignment",
      "Regular working cadence with technical and business leadership",
    ],
    outcome:
      "The structure, evidence and execution discipline needed to close gaps and get the product ready for launch.",
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Embedded capability and delivery ownership",
    summary:
      "Deeper fractional integration for startups that need experienced leadership and execution capability as the product, team and business scale.",
    points: [
      "Embedded leadership across engineering, systems and safety",
      "Delivery ownership and program acceleration",
      "Continuous development of architecture, safety cases and processes",
      "Support for customers, suppliers, auditors and external partners",
      "Technical input to executive, investor and stakeholder decisions",
      "Scalable fractional capacity without unnecessary permanent overhead",
    ],
    outcome:
      "Accelerated delivery, stronger organizational capability and continued support beyond Start of Production.",
  },
] as const;

function PackageIcon({ id }: { id: (typeof PACKAGES)[number]["id"] }) {
  const common = {
    className: "ready2scalePackageIcon",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (id === "discovery") {
    return (
      <svg {...common}>
        <circle cx="10.5" cy="10.5" r="5.25" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M14.6 14.6 20 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (id === "ready") {
    return (
      <svg {...common}>
        <path
          d="M4.5 12.5 10 18 19.5 6.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M4 18.5V13M10 18.5V9M16 18.5V4.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PATHWAY = [
  "Know the gaps",
  "Define the path",
  "Build the foundations",
  "Get to production",
  "Keep scaling",
] as const;

export default function Ready2ScalePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <h1 className="ready2scaleSr">READY2SCALE</h1>
        <figure className="ready2scaleHero">
          <img
            src="/brand/ready2scale-hero.jpg"
            alt="READY2SCALE. Staged solutions for startups to reach product-market fit. People walking up an outdoor staircase toward a tower."
            width={1024}
            height={553}
            decoding="async"
          />
        </figure>
        <div className="site">
          <article
            id="ready2scale-intro"
            className="section card prosePage ready2scaleIntro sectionToneDark"
          >
            <div className="ready2scaleIntroBody">
              <p className="ready2scaleLead">
                From concept to production. From production to scale.
              </p>
              <p className="ready2scalePreface">
                Moving a complex product from concept into production creates new challenges in
                engineering, functional safety, compliance, delivery and organizational capability.
                In a fast-moving startup, gaps in these areas can quickly become cost, delay and
                uncontrolled risk.
              </p>
              <p className="ready2scalePreface">
                READY2SCALE provides a structured path through that journey. Engagements combine
                clear planning with practical execution, scaling from a focused assessment through
                fractional leadership and embedded delivery support.
              </p>
              <p className="ready2scaleClose">
                Defined outcomes. Predictable cost. Built for startup timelines.
              </p>

              <div className="ready2scalePackages">
                {PACKAGES.map((pkg) => (
                  <details
                    key={pkg.id}
                    className="ready2scalePackage"
                    id={pkg.id}
                    name="ready2scale"
                  >
                    <summary>
                      <PackageIcon id={pkg.id} />
                      <span className="ready2scalePackageName">{pkg.name}</span>
                      <span className="ready2scalePackageTag">{pkg.tagline}</span>
                    </summary>
                    <div className="ready2scalePackageBody">
                      <p>{pkg.summary}</p>
                      <ul>
                        {pkg.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <p className="ready2scaleOutcome">
                        <strong>Outcome:</strong> {pkg.outcome}
                      </p>
                    </div>
                  </details>
                ))}
              </div>

              <h2 className="ready2scaleLead">One pathway. The right level of support.</h2>
              <p className="ready2scalePreface">
                READY2SCALE engagements are shaped around product maturity, delivery risk and the
                level of integration required:
              </p>
              <ul className="ready2scalePath">
                {PATHWAY.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <p className="ready2scalePreface">
                From a contained compliance or readiness assessment to an embedded fractional
                contribution, Converent provides the capability startups need, when they need it,
                to move forward with confidence.
              </p>
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
                <ContactForm
                  heading="Start with DISCOVERY"
                  intro=""
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
