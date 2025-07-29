/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.200.192",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
