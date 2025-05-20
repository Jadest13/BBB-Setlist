import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  /* config options here */
};

export default nextConfig;
