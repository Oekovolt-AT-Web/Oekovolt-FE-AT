/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ausgabeverzeichnis umschaltbar: Der Produktionsserver (next start) liest
  // dauerhaft aus .next. Ein Build oder ein zweiter Dev-Server im selben
  // Verzeichnis zieht ihm die Dateien unter den Fuessen weg -> 500er.
  // Mit NEXT_DIST_DIR=.next-verify laeuft beides gefahrlos nebeneinander.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: false,
  // PDF-Analyse: react-pdf serverseitig ungebündelt laden, Schriften & Logo ins Deployment aufnehmen
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/api/analyse/pdf": ["./src/lib/analyse/fonts/**", "./src/lib/analyse/logo-hell.png"],
    "/solarrechner/ergebnis/bild": ["./src/lib/analyse/fonts/**", "./src/lib/analyse/logo-hell.png"],
  },
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

      // HINWEIS: trailingSlash ist false -> Next normalisiert "/x/" zu "/x",
      // BEVOR diese Redirects ausgewertet werden. Alle Quellen daher OHNE
      // abschliessenden Slash notieren, sonst greifen sie nie.

      // --- Alte WordPress-Projektseiten (Referenzen) ---
      {
        source: "/ravensburg-flachdach",
        destination: "/referenzen/projekte/ravensburg-flachdach",
        permanent: true,
      },
      {
        source: "/buchloe-einfamilienhaus-satteldach",
        destination: "/referenzen/projekte/buchloe-einfamilienhaus-satteldach",
        permanent: true,
      },
      {
        source: "/mering-flachdach-ost-west",
        destination: "/referenzen/projekte/mering-flachdach-ost-west",
        permanent: true,
      },
      {
        source: "/salzburg-flachdach-blechfalzdach",
        destination: "/referenzen/projekte/salzburg-flachdach-blechfalzdach",
        permanent: true,
      },
      {
        source: "/bad-woerishofen-flachdach-fassadenanlage",
        destination: "/referenzen/projekte",
        permanent: true,
      },
      {
        source: "/mindelheim-3",
        destination: "/referenzen/projekte",
        permanent: true,
      },
      {
        source: "/logwin-solution-austria-gmbh-traiskirchen-wien",
        destination: "/referenzen/projekte",
        permanent: true,
      },

      // --- Foerderungen: Schreibfehler "ostallgau" -> "ostallgaeu" ---
      // generateSlug() bildet "Ostallgaeu" aus "Ostallgäu" (ae/oe/ue).
      {
        source:
          "/forderungen/landesforderungen/landesfoerderungen-in-bayern-landkreis-ostallgau",
        destination:
          "/forderungen/landesforderungen/landesfoerderungen-in-bayern-landkreis-ostallgaeu",
        permanent: true,
      },

      // --- Alte Einzelseiten ---
      {
        source: "/jobs",
        destination: "/uber-uns/jobs",
        permanent: true,
      },
      {
        source: "/referenzkarte",
        destination: "/referenzen/referenzkarte",
        permanent: true,
      },
      {
        source: "/smarthome",
        destination: "/dienstleistungen/smarthome",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/kontakt",
        permanent: true,
      },

      // --- Kategorie-Einstiege ohne eigene Seite ---
      {
        source: "/service",
        destination: "/dienstleistungen/photovoltaik",
        permanent: true,
      },
      {
        source: "/dienstleistungen",
        destination: "/dienstleistungen/photovoltaik",
        permanent: true,
      },
      {
        source: "/produkte",
        destination: "/produkte/photovoltaikanlage",
        permanent: true,
      },

      // --- Generische WordPress-Strukturen (Wildcards zuletzt) ---
      // ":x*" matcht auch null Segmente, deckt also "/team" bzw. "/referenz" mit ab.
      {
        source: "/team/:member*",
        destination: "/uber-uns/team",
        permanent: true,
      },
      {
        source: "/ueber-uns/:path*",
        destination: "/uber-uns/team",
        permanent: true,
      },
      {
        source: "/referenz/:slug*",
        destination: "/referenzen/projekte",
        permanent: true,
      },
      {
        source: "/foerderungen/:path*",
        destination: "/forderungen/landesforderungen",
        permanent: true,
      },
    ];
  },

  images: {
    // Ab Next.js 16 muessen auch LOKALE Bildquellen freigegeben werden, sonst
    // liefert der Optimizer sie nicht mehr aus. Der Dev-Server warnt bereits:
    // "Image with src /api/image?path=... is using a query string which is not
    //  configured in images.localPatterns."
    //
    // Ohne `search` ist jeder Query-String erlaubt - noetig, weil der
    // Backoffice-Proxy den Dateipfad als ?path= uebergibt (54 Bilder).
    // `search: ""` wuerde dagegen NUR Aufrufe ohne Query zulassen und damit
    // genau diese Bilder blockieren.
    localPatterns: [
      { pathname: "/api/image" },        // Bilder aus dem Frappe-Backoffice
      { pathname: "/Images/**" },        // statische Bilder aus /public/Images
      { pathname: "/**", search: "" },   // uebrige Dateien in /public (Logo etc.)
    ],
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
      // Info-Bildschirm und Feeds: Einbettung in SCADA-/Signage-Systeme erlauben
      // (frame-ancestors hat in modernen Browsern Vorrang vor X-Frame-Options).
      {
        source: "/tv/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      // Handy-Upload per QR-Code: nie indexieren, Token nicht per Referrer weitergeben
      // Fortsetzen-Link aus der Erinnerungs-E-Mail: gleiche Schutzmaßnahmen wie /scan
      {
        source: "/fortsetzen/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/scan/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/tv",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
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
      // Fediverse (ActivityPub): @oekovolt@oekovolt.de, @ratgeber@oekovolt.de
      { source: "/.well-known/webfinger", destination: "/api/ap/webfinger" },
      { source: "/.well-known/nodeinfo", destination: "/api/ap/nodeinfo" },
      { source: "/.well-known/host-meta", destination: "/api/ap/host-meta" },
      {
        source: '/api/backoffice/:path*',
        destination: 'https://backoffice.oekovolt.de/:path*',
      },
    ];
  },
};

export default nextConfig;