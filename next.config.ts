import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dq7vegvkk/**',
      },
    ],
    // Cloudinary already handles image optimization (quality, format, resizing)
    // Disable Next.js re-optimization to avoid timeouts and reduce server load
    unoptimized: true,
  },
};

export default nextConfig;
