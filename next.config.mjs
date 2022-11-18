// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images:{
    domains:["cdn2.thecatapi.com","24.media.tumblr.com","25.media.tumblr.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '26.media.tumblr.com',
      }]
  }
};
export default config;
