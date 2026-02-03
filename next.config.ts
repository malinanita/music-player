import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    domains: ["is1-ssl.mzstatic.com"],
  },
};

export default nextConfig;
