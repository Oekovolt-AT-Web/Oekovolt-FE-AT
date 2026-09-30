import AGComponent, { AGB_STAND } from "@/components/Agb/agb";
import LegalShell from "@/components/Reusable/LegalShell";
import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/agb`;
const TITEL = "Allgemeine Geschäftsbedingungen (AGB) | Ökovolt";
const BESCHREIBUNG =
  "AGB der Ökovolt Solartechnik GmbH für Lieferung, Montage und Wartung von PV-Anlagen, Speichern und Ladeinfrastruktur – für Unternehmen und Verbraucher.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: LOCALE,
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function AgbPage() {
  return (
    <LegalShell
      titel="Allgemeine Geschäftsbedingungen"
      pfad="/agb"
      lead={`Vertragsbedingungen der ${FIRMA.name} für Photovoltaik, Speicher, Ladeinfrastruktur, Wartung und Service. Stand: ${AGB_STAND}.`}
    >
      <AGComponent />
    </LegalShell>
  );
}
