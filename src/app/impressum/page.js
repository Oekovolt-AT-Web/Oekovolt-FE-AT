import Impressum from "@/components/Impressum/impressum";
import LegalShell from "@/components/Reusable/LegalShell";
import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/impressum`;
const TITEL = "Impressum & Offenlegung | Ökovolt";
const BESCHREIBUNG =
  "Impressum der Ökovolt Solartechnik GmbH, Ostermiething: Firmenbuch, UID, GISA, Gewerbebehörde, Offenlegung nach § 25 MedienG sowie Urheber- und Markenrechte.";

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

export default function ImpressumPage() {
  return (
    <LegalShell
      titel="Impressum"
      pfad="/impressum"
      lead={`Informationen nach § 5 ECG, § 14 UGB, § 63 GewO und Offenlegung nach § 25 MedienG zur ${FIRMA.name}.`}
    >
      <Impressum />
    </LegalShell>
  );
}
