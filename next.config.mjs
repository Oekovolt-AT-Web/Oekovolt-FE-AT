/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,

  async redirects() {
    return [
      // RIDREJTIMET: Nga non-www tek www (kjo është ajo që duhet)
      {
        source: "/:path*",
        has: [{ type: "host", value: "oekovolt.de" }],
        destination: "https://www.oekovolt.de/:path*",
        permanent: true,
      },

      // Redirectet e tjera pa ndryshime
      {
        source: "/jobs",
        destination: "/uber-uns/jobs",
        permanent: true,
      },
      {
        source: "/faqs/",
        destination: "/faqs",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/dienstleistungen/photovoltaik",
        permanent: true,
      },
      {
        source: "/referenzkarte",
        destination: "/referenzen/referenzkarte",
        permanent: true,
      },
      {
        source: "/ravensburg-flachdach/",
        destination: "/referenzen/projekte/ravensburg-flachdach",
        permanent: true,
      },
      {
        source: "/buchloe-einfamilienhaus-satteldach/",
        destination: "/referenzen/projekte/buchloe-einfamilienhaus-satteldach",
        permanent: true,
      },
      {
        source: "/mering-flachdach-ost-west/",
        destination: "/referenzen/projekte/mering-flachdach-ost-west",
        permanent: true,
      },
      {
        source: "/salzburg-flachdach-blechfalzdach/",
        destination: "/referenzen/projekte/salzburg-flachdach-blechfalzdach",
        permanent: true,
      },
      {
        source: "/bad-woerishofen-flachdach-fassadenanlage/",
        destination: "/referenzen/projekte",
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
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
      {
        source: "/(.*)\\.(mp4|webm|ogg|mov|m4v)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, must-revalidate" },
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