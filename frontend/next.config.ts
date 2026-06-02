import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /api/v1/* → FastAPI backend in development
  // This eliminates all CORS issues — the browser only talks to :3000
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
