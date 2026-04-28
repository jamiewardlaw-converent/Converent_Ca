import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev: allow /_next assets when the site is opened via LAN host (e.g. 192.168.86.x) — see allowedDevOrigins in Next docs
  allowedDevOrigins: [
    "192.168.86.*",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
  ],
  images: {
    unoptimized: true, // needed if you're using next/image with static export
  },
  trailingSlash: true, // optional, often helpful for static hosting
};
export default nextConfig;
