// Crawler, die Metadaten nur im <head> lesen und kein JavaScript ausführen
// (SEO-Plan M02). Für sie rendert Next die Metadaten blockierend in den <head>,
// statt sie nachzustreamen. Next ERSETZT mit `htmlLimitedBots` seine eigene
// Liste – deshalb steht die Standardliste aus Next 15.5
// (next/dist/shared/lib/router/utils/html-bots.js) hier vollständig mit drin.
// Bei Next-Updates die Standardliste abgleichen. Googlebot fehlt bewusst: Er
// führt JavaScript aus und bekommt von Next die gestreamte Variante.
const NEXT_HTML_LIMITED_BOTS =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/;
// KI-Such- und Abruf-Crawler sowie kleinere Suchmaschinen. GPTBot und ClaudeBot
// sind per robots.txt gesperrt (E1); falls sie trotzdem abrufen, bekommen sie
// dieselbe Fassung wie alle anderen.
const WEITERE_HTML_LIMITED_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
  "SeznamBot",
  "Qwantbot",
  "MojeekBot",
  "Amazonbot",
];
// Next wertet das Muster ohnehin ohne Groß-/Kleinschreibung aus ("i").
const HTML_LIMITED_BOTS = new RegExp([NEXT_HTML_LIMITED_BOTS.source, ...WEITERE_HTML_LIMITED_BOTS].join("|"), "i");

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
    // Standort-Check: Schneelast-Richtwertraster (GeoSphere SNOWGRID-CL, eigene Auswertung), per fs gelesen
    "/api/standort": ["./data/schneelast/sk50-at.bin", "./data/schneelast/sk50-at.json"],
    // Schneelast-Karte: Punktabfrage liest das Raster zur Laufzeit per fs
    // (Seiten und karte.png sind statisch und lesen es nur beim Build)
    "/schneelast/richtwert": ["./data/schneelast/sk50-at.bin", "./data/schneelast/sk50-at.json"],
    // Bundesland-Hubseiten: Schneelast-Richtwerte per fs aus dem Raster (ISR über ladeProjekte)
    "/photovoltaik-bundesland/[land]": ["./data/schneelast/sk50-at.bin", "./data/schneelast/sk50-at.json"],
    // Kundenbühne: Social-Media-Bilder (next/og) lesen Schriften und das AT-Logo per fs
    "/referenzen/projekte/[title]/bild/[format]": ["./src/lib/analyse/fonts/**", "./public/logo-oekovolt-weiss.png"],
  },
  compress: true,
  poweredByHeader: false,
  htmlLimitedBots: HTML_LIMITED_BOTS,

  async redirects() {
    return [
      // RIDREJTIMET: Nga non-www tek www (kjo është ajo që duhet)
      {
        source: "/:path*",
        has: [{ type: "host", value: "oekovolt.com" }],
        destination: "https://www.oekovolt.com/:path*",
        permanent: true,
      },

      // Hinweisgebersystem: Solange HINWEIS_INTERN nicht "1" ist, bleibt IntegrityLine der
      // Meldekanal und /hinweisgebersystem leitet temporär (307) dorthin um – damit die Seite
      // später ohne Browser-Cache-Probleme zurückkommen kann. Mit HINWEIS_INTERN=1 entfallen die
      // Redirects und das eigene System (Formular + Postfach) ist erreichbar.
      // Wert zur BUILD-Zeit maßgeblich → nach Umschalten neu bauen. Zentraler Schalter und
      // Ziel-URL: src/data/hinweisgeber.js (HINWEIS_INTERN, INTEGRITYLINE_URL) – hier bewusst
      // dupliziert, weil next.config keine @/-Aliasse auflösen kann.
      ...(process.env.HINWEIS_INTERN === "1"
        ? []
        : [
            { source: "/hinweisgebersystem", destination: "https://oekovolt.integrityline.com/", permanent: false },
            { source: "/hinweisgebersystem/:path*", destination: "https://oekovolt.integrityline.com/", permanent: false },
          ]),

      // HINWEIS: trailingSlash ist false -> Next normalisiert "/x/" zu "/x",
      // BEVOR diese Redirects ausgewertet werden. Alle Quellen daher OHNE
      // abschliessenden Slash notieren, sonst greifen sie nie.

      // --- Weitere Domains der österreichischen Gesellschaft ---
      { source: "/:path*", has: [{ type: "host", value: "oekovolt.at" }], destination: "https://www.oekovolt.com/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.oekovolt.at" }], destination: "https://www.oekovolt.com/:path*", permanent: true },

      // --- Alte URLs der bisherigen oekovolt.com (Linkkraft erhalten) ---
      { source: "/dienstleistungen/agri-photovoltaik", destination: "/agri-pv", permanent: true },
      // Alte WordPress-Seiten (SEO-Plan M05). Ziele nach Thema und Keyword-Map
      // (genau eine Zielseite je Suchbegriff), nicht pauschal auf die Startseite:
      //   Unternehmen -> Firmenseite; Leasing -> Ratgeber „photovoltaik leasing“;
      //   Contracting -> Ratgeber „Mieten oder kaufen“ (Contracting/Pacht/Kauf im
      //   Vergleich); Lösungen -> Gewerbe-Hauptseite (erster Punkt im Menü „Lösungen“).
      // statusCode 301 statt permanent (308): Abnahme M05 fordert 301; für
      // Suchmaschinen sind beide gleichwertig.
      { source: "/unternehmen", destination: "/uber-uns", statusCode: 301 },
      { source: "/photovoltaik-leasing", destination: "/ratgeber/photovoltaik-leasing", statusCode: 301 },
      { source: "/photovoltaik-contracting", destination: "/ratgeber/photovoltaik-mieten-oder-kaufen", statusCode: 301 },
      { source: "/photovoltaik-loesungen", destination: "/gewerbe", statusCode: 301 },

      // --- Ratgeber: entfernte bzw. umbenannte Artikel ---
      { source: "/ratgeber/photovoltaik-mehrfamilienhaus", destination: "/ratgeber/gemeinschaftliche-erzeugungsanlage", permanent: true },
      { source: "/ratgeber/kfw-kredit-270", destination: "/service/finanzierung", permanent: true },
      { source: "/ratgeber/paragraf-14a-enwg", destination: "/ratgeber/smart-meter-pflicht", permanent: true },
      { source: "/ratgeber/solarspitzengesetz", destination: "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz", permanent: true },
      { source: "/ratgeber/balkonkraftwerk", destination: "/ratgeber/solaranlage-kosten", permanent: true },
      { source: "/ratgeber/heizstab-photovoltaik", destination: "/ratgeber/eigenverbrauch-erhoehen", permanent: true },
      // Dublette zur Service-Seite (Entscheidung E7, sofort freigegeben): gleiche
      // Suchabsicht „Reststrom-/Direktvermarktung“ -> eine Zielseite.
      { source: "/ratgeber/reststromvermarktung", destination: "/service/direktvermarktung", statusCode: 301 },

      // --- Kurz-URLs und Synonyme ---
      { source: "/agri-photovoltaik", destination: "/agri-pv", permanent: true },
      { source: "/freiflaeche", destination: "/freiflaechen-photovoltaik", permanent: true },
      { source: "/solarpark", destination: "/freiflaechen-photovoltaik", permanent: true },
      { source: "/eza-regler", destination: "/technik/parkregler", permanent: true },
      { source: "/parkregler", destination: "/technik/parkregler", permanent: true },
      { source: "/scada", destination: "/technik/scada", permanent: true },
      { source: "/wartung", destination: "/service/wartung", permanent: true },
      { source: "/e-check", destination: "/service/e-check", permanent: true },
      { source: "/reststromvermarktung", destination: "/service/direktvermarktung", permanent: true },
      { source: "/energiegemeinschaft", destination: "/energiegemeinschaften", permanent: true },
      { source: "/ehora", destination: "/standort-check", permanent: true },
      // /schneelast ist seit Welle 4 eine eigene Seite (Schneelast-Karte) – kein Redirect mehr
      { source: "/award", destination: "/pv-award", permanent: true },
      { source: "/elektriker-partner", destination: "/partner", permanent: true },
      { source: "/gemeinden", destination: "/kommunen", permanent: true },
      { source: "/hotellerie", destination: "/hotellerie-tourismus", permanent: true },
      { source: "/leasing", destination: "/service/finanzierung", permanent: true },
      { source: "/blackout", destination: "/service/notstrom", permanent: true },

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

      // --- Alte Hersteller-Detailseiten (Live-Sitemap oekovolt.com, Stand 2026-09-30) ---
      // Im neuen Code gibt es als echte Seite nur die statischen Speicher-Partner
      // (src/components/Hersteller/partner.js, Kontext "stromspeicher": huawei, byd,
      // sigenergy). Alle übrigen, bisher indexierten Slugs führen ohne Backoffice
      // zu 404 bzw. sind keine belegten Partner -> auf die jeweilige Übersicht.
      // /produkte/warmepumpe/[slug] hat keine statische Absicherung.
      // Gleiche Liste in src/app/sitemap.js (WEITERGELEITETE_HERSTELLER) pflegen.
      { source: "/produkte/stromspeicher/akcome", destination: "/produkte/stromspeicher", permanent: true },
      { source: "/produkte/stromspeicher/wuerth", destination: "/produkte/stromspeicher", permanent: true },
      { source: "/produkte/stromspeicher/solis", destination: "/produkte/stromspeicher", permanent: true },
      { source: "/produkte/warmepumpe/schrack", destination: "/produkte/warmepumpe", permanent: true },
      { source: "/produkte/warmepumpe/schweizer", destination: "/produkte/warmepumpe", permanent: true },
      { source: "/produkte/warmepumpe/fronius", destination: "/produkte/warmepumpe", permanent: true },
      { source: "/produkte/warmepumpe/trina", destination: "/produkte/warmepumpe", permanent: true },

      // --- Kategorie-Einstiege ohne eigene Seite ---
      {
        source: "/service",
        destination: "/service/wartung",
        permanent: true,
      },
      {
        source: "/dienstleistungen",
        destination: "/dienstleistungen/photovoltaik",
        permanent: true,
      },
      {
        source: "/produkte",
        destination: "/technik",
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
        destination: "/uber-uns",
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
        hostname: "backoffice.oekovolt.com",
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
        // Solar-Siegel auf Kunden-Websites: Zahlen können sich ändern → kein Jahres-Cache
        // (muss NACH der Bild-Regel stehen, damit dieser Wert gewinnt)
        source: "/siegel/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
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
      // Fediverse (ActivityPub): @oekovolt@oekovolt.com, @ratgeber@oekovolt.com
      { source: "/.well-known/webfinger", destination: "/api/ap/webfinger" },
      { source: "/.well-known/nodeinfo", destination: "/api/ap/nodeinfo" },
      { source: "/.well-known/host-meta", destination: "/api/ap/host-meta" },
    ];
  },
};

export default nextConfig;