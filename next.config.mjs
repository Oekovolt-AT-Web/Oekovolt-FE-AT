/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.197.11",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
