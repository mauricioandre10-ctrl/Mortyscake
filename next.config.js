
/** @type {import('next').NextConfig} */

// Define la Content Security Policy (CSP)
const ContentSecurityPolicy = `
  default-src 'self' https://*.mortyscake.es https://*.google.com;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.youtube.com https://*.stripe.com https://*.vercel.live;
  script-src-elem 'self' 'unsafe-inline' https://*.stripe.com https://*.vercel.live https://*.googletagmanager.com;
  child-src 'self' https://*.youtube.com https://*.youtube-nocookie.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https: http://localhost:*;
  frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.stripe.com https://*.vercel.live;
`;


const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
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
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.mortyscake.es',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  env: {
    WP_USER: 'Tienda mortyscake',
    WP_APP_PASSWORD: 'UOSY OxwW rNb7 xauP D0Lf D9D7',
    ADMIN_EMAIL: 'info@mortyscake.com',
    NEXT_PUBLIC_WOOCOMMERCE_STORE_URL: 'https://cms.mortyscake.es',
    NEXT_PUBLIC_WOOCOMMERCE_CHECKOUT_URL: 'https://cms.mortyscake.es/checkout',
    NEXT_PUBLIC_SITE_URL: 'https://mortyscake.com'
  }
};

module.exports = nextConfig;
