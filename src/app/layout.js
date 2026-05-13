import "./globals.css";
import LayoutWrapper from "@/components/Reusable/LayoutWrapper";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://www.oekovolt.de/#organization",
      name: "Ökovolt Deutschland",
      url: "https://www.oekovolt.de",
      logo: {
        "@type": "ImageObject",
        url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp",
        width: 400,
        height: 100,
      },
      description:
        "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen für Privat und Gewerbe.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "DE",
      },
      priceRange: "€€",
      areaServed: "DE",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.oekovolt.de/#website",
      url: "https://www.oekovolt.de",
      name: "Ökovolt Deutschland",
      inLanguage: "de-DE",
      publisher: {
        "@id": "https://www.oekovolt.de/#organization",
      },
    },
  ],
};

export const metadata = {
  metadataBase: new URL("https://www.oekovolt.de"),
  title: {
    default: "Ökovolt Deutschland - Photovoltaik & Solartechnik",
    template: "%s | Ökovolt Deutschland",
  },
  description:
    "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen für Privat und Gewerbe.",
  keywords: [
    "Photovoltaik",
    "Solaranlagen",
    "Stromspeicher",
    "Wärmepumpe",
    "Smart Home",
    "Ökovolt",
    "Solarenergie Deutschland",
  ],
  authors: [{ name: "Ökovolt Deutschland" }],
  creator: "Ökovolt Deutschland",
  publisher: "Ökovolt Deutschland",
  icons: {
    icon: "/Logo_ov_4cDeutschland-removebg-preview.png",
    shortcut: "/Logo_ov_4cDeutschland-removebg-preview.png",
    apple: "/Logo_ov_4cDeutschland-removebg-preview.png",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.oekovolt.de",
    siteName: "Ökovolt Deutschland",
    title: "Ökovolt Deutschland - Photovoltaik & Solartechnik",
    description:
      "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen.",
    images: [
      {
        url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
        width: 1200,
        height: 630,
        alt: "Ökovolt Deutschland - Photovoltaik & Solartechnik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ökovolt Deutschland - Photovoltaik & Solartechnik",
    description:
      "Ihr Experte für Photovoltaik in Deutschland – Solaranlagen, Stromspeicher, Wärmepumpen & Smart Home Lösungen.",
    images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.oekovolt.de",
  },
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://backoffice.oekovolt.de" />
        <link rel="dns-prefetch" href="https://backoffice.oekovolt.de" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-white text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
