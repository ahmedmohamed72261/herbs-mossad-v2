/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Only use for static exports (e.g., vercel deployment)
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
