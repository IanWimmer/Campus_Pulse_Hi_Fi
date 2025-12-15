import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "blob.vercel-storage.com" }],
  },
};

export default nextConfig;
