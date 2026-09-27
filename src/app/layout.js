import GoogleAnalytics from "@/components/Statistik/GoogleAnalytics";
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import LayoutWrapper from "@/components/Reusable/LayoutWrapper";

// Zwei Schriften, klar getrennte Rollen: Inter trägt den Fließtext (hohe
// Lesbarkeit auch bei langen deutschen Komposita), Manrope die Überschriften
// (geometrisch, markant, gute Umlaute). next/font hostet beide selbst.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const BASE_URL = "https://www.oekovolt.de";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "Electrician"],
      "@id": `${BASE_URL}/#organization`,
      name: "Ökovolt Deutschland",
      alternateName: ["ÖKOVOLT GmbH Solartechnik", "Oekovolt", "Ökovolt"],
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
        width: 400,
        height: 100,
        caption: "Ökovolt Deutschland Logo",
      },
      image: {
        "@type": "ImageObject",
        url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
      },
      description:
        "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen für Privat und Gewerbe. Über 15 Jahre Erfahrung.",
      slogan: "Solarenergie für alle – einfach, sicher, wirtschaftlich.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schlingener Str. 1a",
        addressLocality: "Türkheim",
        postalCode: "86842",
        addressCountry: "DE",
        addressRegion: "Bayern",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 48.03858,
        longitude: 10.62765,
      },
      hasMap: "https://www.google.com/maps?q=ÖKOVOLT+GmbH+Solartechnik,+Schlingener+Str.+1a,+86842+Türkheim",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "08:00",
          closes: "16:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Friday"],
          opens: "08:00",
          closes: "13:00",
        },
      ],
      telephone: "+49-8245-96788-0",
      email: "office@oekovolt.de",
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Credit Card, Bank Transfer",
      areaServed: {
        "@type": "Country",
        name: "Deutschland",
      },
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 51.1657,
          longitude: 10.4515,
        },
        geoRadius: "600000",
      },
      sameAs: [
        "https://www.facebook.com/oekovoltdeutschland",
        "https://www.instagram.com/oekovoltdeutschland/",
        "https://www.linkedin.com/company/%C3%B6kovoltdeutchland",
        "https://x.com/Oekovolt_De",
        "https://de.pinterest.com/oekovoltdeutschland/",
      ],
      knowsAbout: [
        "Photovoltaik",
        "Solaranlagen",
        "Stromspeicher",
        "Wärmepumpen",
        "Smart Home",
        "Wallbox",
        "Erneuerbare Energien",
        "Direktvermarktung Solarstrom",
        "Photovoltaik Repowering",
        "Mieterstrom",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photovoltaik & Energielösungen",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photovoltaikanlage Installation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Stromspeicher Installation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wärmepumpe Installation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wallbox Installation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Smart Home Lösungen" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photovoltaik Repowering" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Solarstrom Direktvermarktung" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Ökovolt Deutschland",
      description: "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen.",

      publisher: { "@id": `${BASE_URL}/#organization` },
      copyrightYear: new Date().getFullYear(),
      copyrightHolder: { "@id": `${BASE_URL}/#organization` },
    },
  ],
};

export const viewport = {
  themeColor: "#669933",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ökovolt Deutschland – Photovoltaik & Solaranlagen",
    template: "%s",
  },
  description:
    "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen für Privat und Gewerbe. Jetzt kostenlose Beratung sichern!",
  keywords: [
    "Photovoltaik",
    "Solaranlage kaufen",
    "Photovoltaikanlage Deutschland",
    "Stromspeicher",
    "Wärmepumpe",
    "Smart Home Solar",
    "Ökovolt",
    "Solarenergie Deutschland",
    "Photovoltaikanlage kaufen",
    "Solaranlage installieren",
    "Wallbox Ladestation",
    "Photovoltaik Gewerbe",
    "Photovoltaik Privat",
    "Solarstrom Eigenverbrauch",
    "Energiespeicher Batterie",
    "Wärmepumpe kaufen",
    "KfW Förderung Photovoltaik",
    "PV Anlage Kosten",
    "Solaranlage Förderung",
    "Repowering Photovoltaik",
  ],
  authors: [{ name: "Ökovolt Deutschland", url: BASE_URL }],
  creator: "Ökovolt Deutschland",
  publisher: "Ökovolt Deutschland",
  category: "Erneuerbare Energien",
  classification: "Photovoltaik & Solartechnik",
  icons: {
    icon: "/Logo_ov_4cDeutschland-removebg-preview.png",
    shortcut: "/Logo_ov_4cDeutschland-removebg-preview.png",
    apple: "/Logo_ov_4cDeutschland-removebg-preview.png",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: BASE_URL,
    siteName: "Ökovolt Deutschland",
    title: "Ökovolt Deutschland – Photovoltaik & Solaranlagen",
    description:
      "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen. Kostenlose Beratung!",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ökovolt Deutschland – Photovoltaik & Solartechnik",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@oekovolt",
    creator: "@oekovolt",
    title: "Ökovolt Deutschland – Photovoltaik & Solaranlagen",
    description:
      "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  //  verification: {
  //   google: "GTM-WR8PDT7V",
  // },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" dir="ltr" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Resource hints */}
        {/* <link rel="dns-prefetch" href="https://unpkg.com" /> */}
        {/* msapplication tile color for IE/Edge */}
        <meta name="msapplication-TileColor" content="#669933" />
        {/* Geo targeting */}
        <meta name="geo.region" content="DE" />
        <meta name="geo.placename" content="Türkheim, Bayern, Deutschland" />
        <meta name="geo.position" content="48.03858;10.62765" />
        <meta name="ICBM" content="48.03858, 10.62765" />
        {/* Language */}
        <meta httpEquiv="content-language" content="de-DE" />
        <meta name="ahrefs-site-verification" content="e1d71a17817647a67232c6d7f2943114c4d8bb7d08642c44ecc929d005be7401"></meta>
        {/* Keine Vorverbindungen zu Google: Verbindungen zu Drittanbietern erst nach Einwilligung */}
      </head>
      <body className="bg-white text-ink-900">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#669933] focus:text-white focus:rounded">Zum Hauptinhalt springen</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
