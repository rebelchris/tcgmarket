import type {NextConfig} from "next";

const nextConfig: NextConfig = {
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
                hostname: 'images.pokemontcg.io',
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
