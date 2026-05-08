/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backoffice.oekovolt.de",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
