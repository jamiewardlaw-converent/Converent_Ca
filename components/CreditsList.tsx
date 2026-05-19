import { IMAGE_CREDIT_SECTIONS } from "../lib/imageCredits";

export default function CreditsList() {
  return (
    <div className="creditsList">
      {IMAGE_CREDIT_SECTIONS.map((section) => (
        <section key={section.id} className="creditsListSection" aria-labelledby={`credits-${section.id}`}>
          <h3 id={`credits-${section.id}`} className="creditsListSectionTitle">
            {section.title}
          </h3>
          {section.intro ? <p className="creditsListIntro">{section.intro}</p> : null}
          <ul className="creditsListEntries">
            {section.entries.map((entry) => (
              <li key={entry.label} className="creditsListItem">
                <div className="creditsListItemLabel">{entry.label}</div>
                {entry.href ? (
                  <a
                    href={entry.href}
                    className="creditsListLink"
                    target={entry.href.startsWith("/") ? undefined : "_blank"}
                    rel={entry.href.startsWith("/") ? undefined : "noopener noreferrer"}
                  >
                    {entry.linkText ?? entry.href}
                  </a>
                ) : null}
                {entry.detail ? <p className="creditsListDetail">{entry.detail}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
