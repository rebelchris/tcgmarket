import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // async redirects() {
  //     return [
  //         {
  //             source: '/',
  //             destination: '/pokemon',
  //             permanent: false,
  //         },
  //     ]
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'en.onepiece-cardgame.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tcgmarket.co.za',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
