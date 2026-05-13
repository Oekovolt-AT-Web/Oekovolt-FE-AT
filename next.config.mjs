/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/:path*",
        permanent: true,
      },
    ];
  },
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
