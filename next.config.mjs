/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [

      {
        source: "/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de",
        permanent: true,
      },
      {
        source: "/faqs",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/faqs",
        permanent: true,
      },
      {
        source: "/faqs/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/faqs",
        permanent: true,
      },
      {
        source: "/referenzkarte",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/referenzkarte",
        permanent: true,
      },
      {
        source: "/jobs",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/uber-uns/jobs",
        permanent: true,
      },
      {
        source: "/service",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/dienstleistungen/photovoltaik",
        permanent: true,
      },
      {
        source: "/kontakt",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/kontakt",
        permanent: true,
      },
      {
        source: "/agb",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/agb",
        permanent: true,
      },


      {
        source: "/referenzkarte",
        has: [{ type: "host", value: "www.oekovolt.de" }],
        destination: "/referenzen/referenzkarte",
        permanent: true,
      },
      {
        source: "/jobs",
        has: [{ type: "host", value: "www.oekovolt.de" }],
        destination: "/uber-uns/jobs",
        permanent: true,
      },
      {
        source: "/service",
        has: [{ type: "host", value: "www.oekovolt.de" }],
        destination: "/dienstleistungen/photovoltaik",
        permanent: true,
      },


      {
        source: "/ravensburg-flachdach/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/projekte/ravensburg-flachdach",
        permanent: true,
      },
      {
        source: "/buchloe-einfamilienhaus-satteldach/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/projekte/buchloe-einfamilienhaus-satteldach",
        permanent: true,
      },
      {
        source: "/mering-flachdach-ost-west/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/projekte/mering-flachdach-ost-west",
        permanent: true,
      },
      {
        source: "/salzburg-flachdach-blechfalzdach/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/projekte/salzburg-flachdach-blechfalzdach",
        permanent: true,
      },
      {
        // Old WordPress project URL with no exact 1:1 match → safe redirect to the projects list.
        source: "/bad-woerishofen-flachdach-fassadenanlage/",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/referenzen/projekte",
        permanent: true,
      },


      {
        source: "/:path*",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backoffice.oekovolt.de",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(js|css)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // --- VIDEO OPTIMIZATION ADDITIONS ---
      {
        // Target all common background video formats
        source: "/(.*)\\.(mp4|webm|ogg|mov|m4v)",
        headers: [
          // 1. Long-term static asset caching
          { key: "Cache-Control", value: "public, max-age=31536000, must-revalidate" },
          // 2. Explicitly allow byte-range streaming requests
          { key: "Accept-Ranges", value: "bytes" }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/backoffice/:path*',
        destination: 'https://backoffice.oekovolt.de/:path*',
      },
    ];
  },
};

export default nextConfig;
