import type { NextConfig } from "next";

const API_UPSTREAM = process.env.API_UPSTREAM_URL ?? "https://composed-light-crayfish.ngrok-free.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_UPSTREAM}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
