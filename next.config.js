// shapira-store/next.config.js
const runtimeCaching = require("next-pwa/cache");
const nextTranslate = require("next-translate-plugin");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  scope: "/",
  sw: "service-worker.js",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    // locales: ["en-US", "es", "fr", "nl-NL","he"],
    locales: ["he"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "he",
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // domains: [
    //   {
    //     domain: "example.com",
    //     defaultLocale: "he",
    //     // other locales that should be handled on this domain
    //     locales: ["he"],
    //   },
    //   {
    //     domain: "example.en",
    //     defaultLocale: "en-US",
    //   },
    //   {
    //     domain: "example.fr",
    //     defaultLocale: "fr",
    //   },
    // ],
  },

  // images: {
  //   domains: [
  //     "images.unsplash.com",
  //     "img.icons8.com",
  //     "i.ibb.co",
  //     "i.postimg.cc",
  //     "fakestoreapi.com",
  //     "res.cloudinary.com",
  //     "lh3.googleusercontent.com",
  //     "res.cloudinary.com",
  //     "lh3.googleusercontent.com",
  //     "",
  //     "images.dashter.com",
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Generate sitemap after build
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  ...nextTranslate(),
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });


// module.exports = withBundleAnalyzer({});
