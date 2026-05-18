/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation errors for client components using browser APIs
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
