// src/app/dossier/page.js – Business-Case-Dossier (noindex)
//
// Sammelt Ergebnisse aus Standort-Check, Förder-Check, Gewerbe-PV-Rechner, Lastgang-Analyse und
// Modellvergleich (sessionStorage, src/lib/dossier/ablage.js) und bereitet sie für Geschäftsführung,
// Bank oder Gemeinderat auf. Lead-Gate Stufe 2: Auswertung und PDF erst nach bestätigter E-Mail.

import PageHero from "@/components/ui/PageHero";
import DossierAnsicht from "@/components/Dossier/DossierAnsicht";
import { BASE_URL, SITE_NAME } from "@/lib/site";
import { DOSSIER_STAND } from "@/lib/dossier/rechnung";

const PFAD = "/dossier";
const TITEL = "Business-Case-Dossier für PV-Investitionen | Ökovolt";
const BESCHREIBUNG = "Ergebnisse aus Standort-Check, Förder-Check und Gewerbe-PV-Rechner sammeln und für Geschäftsführung, Bank oder Gemeinderat aufbereiten – Kapitalwert, Sensitivität, DSCR, Modellvergleich.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: `${BASE_URL}${PFAD}` },
  robots: { index: false, follow: true },
  openGraph: { type: "website", locale: "de_AT", url: `${BASE_URL}${PFAD}`, siteName: SITE_NAME, title: TITEL, description: BESCHREIBUNG },
};

export default function DossierPage() {
  return (
    <div>
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Business-Case-Dossier" }]}
        eyebrow="Business-Case-Dossier"
        title={
          <>
            Vom Rechenergebnis <span className="ov-text-gradient-light">zur Entscheidungsvorlage</span>
          </>
        }
        lead={`Sammeln Sie Ergebnisse aus unseren Werkzeugen und bereiten Sie sie für Geschäftsführung, Bank oder Gemeinderat auf: Kapitalwert, Sensitivität, Schuldendienstdeckung und ein neutraler Modellvergleich. Richtwerte zur Orientierung, Stand ${DOSSIER_STAND.label}.`}
        points={["Bis zu 10 Ergebnisse sammeln", "Drei Varianten: GF/CFO, Bank, Gemeinderat", "PDF mit Quellen und Stand"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />
      <section aria-label="Dossier" className="relative z-10 -mt-20 pb-16 md:-mt-28 md:pb-24">
        <div className="ov-container">
          <DossierAnsicht modus="dossier" />
        </div>
      </section>
    </div>
  );
}
