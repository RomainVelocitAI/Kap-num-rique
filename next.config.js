/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'digiqo.fr',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-navigation-menu'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimisations de performance
  webpack: (config, { isServer }) => {
    // Optimisations webpack
    if (!isServer) {
      // Split chunks pour meilleure mise en cache
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Séparer Three.js dans son propre chunk
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          // Séparer GSAP
          gsap: {
            name: 'gsap',
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          // Séparer les vendors
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
          },
          // Commons
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 0,
          },
        },
      }
    }
    return config
  },
  
  // Optimisations SEO et performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Headers de performance
          // Font preload désactivé car le fichier n'existe pas
          // {
          //   key: 'Link',
          //   value: '</fonts/inter-latin.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous'
          // },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig