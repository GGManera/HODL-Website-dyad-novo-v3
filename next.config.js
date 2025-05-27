/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove the i18n configuration as it's not supported in App Router
  // i18n: {
  //   locales: ["en", "es", "pt"],
  //   defaultLocale: "en",
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
