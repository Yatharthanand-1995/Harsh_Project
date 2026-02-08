import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jiomart.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/products',
        has: [
          {
            type: 'query',
            key: 'category',
            value: 'festivals',
          },
        ],
        destination: '/products?category=hampers',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com; frame-src https://api.razorpay.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
