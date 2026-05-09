import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:9090";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendUrl.startsWith("https") ? "https" : "http",
        hostname: backendUrl.replace(/^https?:\/\//, "").split(":")[0],
        port: backendUrl.match(/:(\d+)/)?.[1] || undefined,
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
