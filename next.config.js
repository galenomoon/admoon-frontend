/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  env: {
    NEXT_GOOGLE_MAP_API_KEY: process.env.NEXT_GOOGLE_MAP_API_KEY,
  },
}

module.exports = nextConfig
