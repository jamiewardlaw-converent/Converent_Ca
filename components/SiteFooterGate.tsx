"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

export default function SiteFooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/keystatic")) {
    return null;
  }
  return <SiteFooter />;
}
