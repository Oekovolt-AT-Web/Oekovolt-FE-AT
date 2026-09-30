import PrivacyPolicy from "@/components/Datenschutz/datenschutz";
import LegalShell from "@/components/Reusable/LegalShell";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/datenschutz`;
const TITEL = "Datenschutzerklärung | Ökovolt";
const BESCHREIBUNG =
  "Datenschutz bei Ökovolt Österreich: welche Daten wir nach DSGVO, DSG und TKG 2021 verarbeiten, wofür, wie lange – und Ihre Rechte bei der Datenschutzbehörde.";

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

export default function DatenschutzPage() {
  return (
    <LegalShell
      titel="Datenschutzerklärung"
      pfad="/datenschutz"
      lead="Wie wir Ihre personenbezogenen Daten verarbeiten und welche Rechte Ihnen nach der DSGVO und dem österreichischen Datenschutzgesetz zustehen."
    >
      <PrivacyPolicy />
    </LegalShell>
  );
}
