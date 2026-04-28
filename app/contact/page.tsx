import ContactForm from "../../components/ContactForm";
import SiteHeader from "../../components/SiteHeader";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <header className="pageBanner" aria-labelledby="contact-page-heading">
        <div className="pageBannerInner">
          <h1 id="contact-page-heading" className="pageBannerTitle">
            Contact
          </h1>
        </div>
      </header>
      <main className="site">
        <section className="section card sectionToneDark">
          <ContactForm />
        </section>
      </main>
    </>
  );
}
