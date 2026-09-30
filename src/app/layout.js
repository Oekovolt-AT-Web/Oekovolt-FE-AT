import GoogleAnalytics from "@/components/Statistik/GoogleAnalytics";
import Umami from "@/components/Statistik/Umami";
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import LayoutWrapper from "@/components/Reusable/LayoutWrapper";

// Zwei Schriften, klar getrennte Rollen: Inter trägt den Fließtext (hohe
// Lesbarkeit auch bei langen deutschen Komposita), Manrope die Überschriften
// (geometrisch, markant, gute Umlaute). next/font hostet beide selbst.
// Performance: nur das Subset „latin“ wird vorab geladen (enthält ä ö ü ß € –
// alles, was deutsche Texte brauchen). Die latin-ext-Dateien bleiben per
// unicode-range deklariert und kommen nur, wenn ein Zeichen sie braucht
// (z. B. Č, ő in Namen). Beide Schriften sind variable Fonts: eine Datei deckt
// alle Stärken ab, daher bei Manrope keine Einzelgewichte (vorher 4 identische
// @font-face-Blöcke je Subset).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

import { BASE_URL, FIRMA, SCHWESTER } from "@/lib/site";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "Electrician"],
      "@id": `${BASE_URL}/#organization`,
      name: FIRMA.name,
      legalName: FIRMA.name,
      alternateName: ["Ökovolt Österreich", "Oekovolt", "Ökovolt", "ÖKOVOLT Solartechnik"],
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/logo-oekovolt.png`,
        // Tatsächliche Pixelmaße von public/logo-oekovolt.png (PNG-Header, geprüft 2026-09-30)
        width: 1066,
        height: 234,
        caption: "Ökovolt Österreich Logo",
      },
      image: { "@type": "ImageObject", url: `${BASE_URL}/og-image.jpg` },
      description:
        "Photovoltaik für Gewerbe, Industrie, Landwirtschaft, Gemeinden und anspruchsvolle Privatobjekte in ganz Österreich: Dach- und Freiflächenanlagen, Agri-PV, Gewerbespeicher, Ladeinfrastruktur, Energiegemeinschaften, eigener Parkregler (EZA-Regler), Fernwartung und SCADA – geplant, gebaut und betreut aus einer Hand.",
      slogan: "Wir bauen, was wir selbst betreiben würden.",
      foundingDate: "2012-02-16",
      founder: { "@type": "Person", name: "Andreas Wegscheider" },
      taxID: FIRMA.uid,
      vatID: FIRMA.uid,
      identifier: [
        { "@type": "PropertyValue", propertyID: "Firmenbuchnummer", value: FIRMA.firmenbuch },
        { "@type": "PropertyValue", propertyID: "EUID", value: FIRMA.euid },
        { "@type": "PropertyValue", propertyID: "GISA-Zahl", value: FIRMA.gisa },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: FIRMA.strasse,
        addressLocality: FIRMA.ort,
        postalCode: FIRMA.plz,
        addressRegion: FIRMA.bundesland,
        addressCountry: "AT",
      },
      geo: { "@type": "GeoCoordinates", latitude: FIRMA.geo.lat, longitude: FIRMA.geo.lng },
      hasMap: "https://www.google.com/maps?q=%C3%96kovolt+Solartechnik+GmbH,+Gewerbegebiet+10,+5121+Ostermiething",
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "16:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "08:00", closes: "13:00" },
      ],
      telephone: FIRMA.telefon,
      email: FIRMA.email,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: FIRMA.telefon,
        email: FIRMA.email,
        contactType: "customer service",
        areaServed: "AT",
        availableLanguage: ["German"],
      },
      priceRange: "€€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Bank Transfer, Leasing, Financing",
      areaServed: [
        { "@type": "Country", name: "Österreich" },
        ...["Wien", "Niederösterreich", "Oberösterreich", "Salzburg", "Tirol", "Vorarlberg", "Kärnten", "Steiermark", "Burgenland"].map((n) => ({ "@type": "State", name: n })),
      ],
      memberOf: [{ "@type": "Organization", name: FIRMA.kammer, url: "https://www.wko.at/ooe" }],
      // Bewusst KEINE parentOrganization: Gesellschafter sind A. Wegscheider (51 %)
      // und die Salzburg AG (49 %); die deutsche ÖKOVOLT GmbH Solartechnik ist
      // Schwester-, nicht Muttergesellschaft. Markenbezug nur über "brand".
      brand: { "@type": "Brand", name: "ÖKOVOLT" },
      // Nur verifizierte Profile: Facebook/LinkedIn werden von der bisherigen
      // oekovolt.com verlinkt (die .de nutzt eigene Profile), dazu WKO und FirmenABC.
      sameAs: [FIRMA.social.facebook, FIRMA.social.linkedin, FIRMA.social.instagram, FIRMA.wko, FIRMA.firmenabc],
      knowsAbout: [
        "Photovoltaik Gewerbe", "Photovoltaik Industrie", "Freiflächen-Photovoltaik", "Agri-Photovoltaik",
        "Gewerbespeicher", "Batteriespeicher", "Peak Shaving", "Ladeinfrastruktur", "Energiegemeinschaften",
        "Erneuerbare-Energie-Gemeinschaft", "Bürgerenergiegemeinschaft", "Reststromvermarktung", "PPA",
        "EZA-Regler", "Parkregler", "SCADA", "Fernüberwachung Photovoltaik", "TOR Erzeuger",
        "Schneelast ÖNORM B 1991-1-3", "Blackout-Vorsorge", "Notstrom", "Thermografie Drohne",
        "EAG-Investitionszuschuss", "OeMAG", "Investitionsfreibetrag",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photovoltaik & Energielösungen für Österreich",
        itemListElement: [
          "Photovoltaik für Gewerbe und Industrie", "Freiflächen-Photovoltaik", "Agri-PV", "Gewerbespeicher",
          "Ladeinfrastruktur", "Energiegemeinschaften", "Parkregler (EZA-Regler)", "Fernwartung", "SCADA",
          "Wartungsvertrag", "Anlagenprüfung (E-Check)", "PV-Reinigung", "Drohnen-Thermografie",
          "PV-Versicherung", "Energieberatung", "Notstrom & Blackout-Vorsorge", "Reststromvermarktung",
          "Finanzierung & Leasing", "Photovoltaik für Luxus-Chalets",
        ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Ökovolt Österreich",
      inLanguage: "de-AT",
      description: "Photovoltaik für Gewerbe, Industrie, Landwirtschaft und Gemeinden in ganz Österreich.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      copyrightYear: new Date().getFullYear(),
      // Website- und Markenrechte liegen bei der deutschen Schwestergesellschaft
      copyrightHolder: { "@type": "Organization", name: SCHWESTER.name, url: SCHWESTER.web },
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
    default: "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt",
    template: "%s",
  },
  description:
    "Photovoltaik für Gewerbe, Industrie, Landwirtschaft und Gemeinden in ganz Österreich: Dach- und Freiflächenanlagen, Agri-PV, Speicher, Ladeinfrastruktur, eigener Parkregler & SCADA. Seit 2012.",
  keywords: [
    "Photovoltaik Gewerbe Österreich",
    "PV-Anlage Unternehmen",
    "Photovoltaik Industrie",
    "Freiflächen-Photovoltaik Österreich",
    "Agri-PV Österreich",
    "Gewerbespeicher",
    "Energiegemeinschaft",
    "Reststromvermarktung",
    "EZA-Regler",
    "Parkregler Photovoltaik",
    "SCADA Photovoltaik",
    "PV Wartungsvertrag",
    "EAG Investitionszuschuss",
    "Investitionsfreibetrag Photovoltaik",
    "Photovoltaik Oberösterreich",
    "Photovoltaik Salzburg",
    "Ökovolt",
  ],
  authors: [{ name: "Ökovolt Österreich", url: BASE_URL }],
  creator: "Ökovolt Österreich",
  publisher: "Ökovolt Österreich",
  category: "Erneuerbare Energien",
  classification: "Photovoltaik & Solartechnik",
  icons: {
    icon: "/logo_blue.png",
    shortcut: "/logo_blue.png",
    apple: "/logo_blue.png",
  },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: BASE_URL,
    siteName: "Ökovolt Österreich",
    title: "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt",
    description:
      "Photovoltaik für Gewerbe, Industrie, Landwirtschaft und Gemeinden in ganz Österreich – geplant, gebaut und betreut aus einer Hand.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ökovolt Österreich – Photovoltaik & Solartechnik",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@oekovolt",
    creator: "@oekovolt",
    title: "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt",
    description:
      "Photovoltaik für Gewerbe, Industrie, Landwirtschaft und Gemeinden in ganz Österreich.",
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
    <html lang="de-AT" dir="ltr" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Resource hints */}
        {/* <link rel="dns-prefetch" href="https://unpkg.com" /> */}
        {/* msapplication tile color for IE/Edge */}
        <meta name="msapplication-TileColor" content="#669933" />
        {/* Geo targeting */}
        <meta name="geo.region" content="AT-4" />
        <meta name="geo.placename" content="Ostermiething, Oberösterreich, Österreich" />
        <meta name="geo.position" content="48.0428;12.8417" />
        <meta name="ICBM" content="48.0428, 12.8417" />
        {/* Language */}
        <meta httpEquiv="content-language" content="de-AT" />
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
        {/* Cookielose Reichweitenmessung (selbst gehostet) – rendert nur, wenn UMAMI_SCRIPT_URL und UMAMI_WEBSITE_ID gesetzt sind */}
        <Umami />
      </body>
    </html>
  );
}
