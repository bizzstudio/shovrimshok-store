// next.config.js ללא תוספים
module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en-US", "es", "fr", "nl-NL", "he"],
    defaultLocale: "en-US",
    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
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
      "images.unsplash.com",
      "img.icons8.com",
      "i.ibb.co",
      "i.postimg.cc",
      "fakestoreapi.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.dashter.com",
    ],
  },
};
