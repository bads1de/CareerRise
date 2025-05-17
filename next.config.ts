import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hl73ftqtkinootft.public.blob.vercel-storage.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-day-picker/dist/esm": "react-day-picker/dist",
    };
    return config;
  },
};

export default nextConfig;
