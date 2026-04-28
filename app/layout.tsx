import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Converent | Clarity in Systems and Software",
  description:
    "Converent provides practical clarity in systems and software through architecture, delivery, and transformation support.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
