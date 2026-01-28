/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/dashboard",
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    // For web3modal
    webpackConfig.externals.push("pino-pretty", "lokijs", "encoding")
    return webpackConfig
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'studio.openxai.org',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
