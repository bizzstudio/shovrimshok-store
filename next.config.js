const runtimeCaching = require("next-pwa/cache");
const nextTranslate = require('next-translate');

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  scope: "/",
  sw: "service-worker.js",
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development",
  disable: true,
});

module.exports = withPWA({
  typescript: { ignoreBuildErrors: true, },
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["he"],
    // locales: ["he"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "he",

    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
        // other locales that should be handled on this domain
        locales: ["es"],
      },
      {
        domain: "example.nl",
        defaultLocale: "nl-NL",
      },
      {
        domain: "example.fr",
        defaultLocale: "fr",
      },
    ],
  },

  images: {
    domains: [
      // "images.unsplash.com",
      // "img.icons8.com",
      // "i.ibb.co",
      // "i.postimg.cc",
      // "fakestoreapi.com",
      "res.cloudinary.com",
      // "lh3.googleusercontent.com",
      // "res.cloudinary.com",
      // "lh3.googleusercontent.com",
      // "",
      // "images.dashter.com",
    ],
  },

  ...nextTranslate(),
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer({});
