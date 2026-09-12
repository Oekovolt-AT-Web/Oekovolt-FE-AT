// src/app/solarrechner/page.js

import Link from "next/link";
import { Calculator, CheckCircle2 } from "lucide-react";

import Breadcrumbs from "@/components/Ratgeber/Breadcrumbs";
import FaqAccordion from "@/components/Ratgeber/FaqAccordion";
import Solarrechner from "@/components/Solarrechner/Rechner";
import EndSection from "@/components/Reusable/end";
import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const BASE_URL = "https://www.oekovolt.de";
const PAGE_URL = `${BASE_URL}/solarrechner`;

// Deutschlandspezifisch (EEG-Vergütung, deutscher Strompreis) -> kein hreflang.
export const metadata = {
  title: "Solarrechner: Was bringt eine PV-Anlage? | Ökovolt",
  description:
    "Solarrechner kostenlos: Ertrag, Ersparnis, Autarkie und Amortisation Ihrer PV-Anlage in Sekunden berechnen – mit den Sätzen von 2026.",
  keywords: [
    "Solarrechner",
    "Photovoltaik Rechner",
    "PV Rechner",
    "Solaranlage Kosten berechnen",
    "Photovoltaik Ertrag berechnen",
    "Amortisation Photovoltaik",
    "Stromspeicher Größe berechnen",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: "Solarrechner: Was bringt eine PV-Anlage?",
    description:
      "Ertrag, Ersparnis, Autarkie und Amortisation Ihrer Photovoltaikanlage berechnen – mit aktuellen Einspeisesätzen.",
    images: [
      {
        url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
        width: 1200,
        height: 630,
        alt: "Ökovolt Solarrechner",
      },
    ],
  },
};

const FAQ = [
  {
    frage: "Wie genau ist der Solarrechner?",
    antwort:
      "Der Rechner liefert eine belastbare erste Orientierung auf Basis von Erfahrungswerten für Süddeutschland. Verschattung durch Bäume oder Nachbargebäude, der konkrete Dachaufbau und Ihr Verbrauchsverhalten über den Tag können das Ergebnis spürbar verschieben. Für eine verbindliche Aussage schauen wir uns Ihr Dach an.",
  },
  {
    frage: "Welche Anlagengröße passt zu meinem Verbrauch?",
    antwort:
      "Als Faustregel gilt rund 1 kWp je 1.000 kWh Jahresverbrauch. Eine deutlich größere Anlage produziert vor allem Strom, der zum niedrigen Einspeisesatz ins Netz geht – das rechnet sich langsamer. Der Rechner weist Sie darauf hin, wenn Ihre Eingabe stark über dem Bedarf liegt.",
  },
  {
    frage: "Lohnt sich ein Stromspeicher?",
    antwort:
      "Ein Speicher hebt die Autarkie typischerweise von rund 30 % auf 60 bis 80 %. Weil jede selbst genutzte Kilowattstunde rund 35 Cent Netzstrom ersetzt, die Einspeisung aber nur wenige Cent bringt, steigt der jährliche Nutzen deutlich. Gleichzeitig steigt die Investition – probieren Sie im Rechner beide Varianten durch.",
  },
  {
    frage: "Warum ist die Amortisation länger als früher?",
    antwort: `Die Einspeisevergütung ist über die Jahre stark gesunken und liegt aktuell bei ${ct(
      VERGUETUNG.saetze[0].teileinspeisung
    )} ct/kWh. Der wirtschaftliche Hebel liegt heute nicht mehr in der Einspeisung, sondern im Eigenverbrauch. Anlagen, die gut auf den eigenen Bedarf abgestimmt sind, amortisieren sich deshalb weiterhin zügig.`,
  },
];

export default function SolarrechnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${PAGE_URL}/#app`,
        name: "Ökovolt Solarrechner",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        description:
          "Berechnet Ertrag, Eigenverbrauch, Autarkie, Ersparnis und Amortisation einer Photovoltaikanlage.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Solarrechner", item: PAGE_URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}/#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.frage,
          acceptedAnswer: { "@type": "Answer", text: f.antwort },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-14">
          <Breadcrumbs
            className="mb-6"
            items={[{ name: "Startseite", href: "/" }, { name: "Solarrechner" }]}
          />
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[#669933]">
            <Calculator aria-hidden="true" className="h-4 w-4" />
            Kostenlos & ohne Anmeldung
          </h2>
          <h1 className="max-w-[22ch] text-[30px] font-semibold leading-tight text-gray-900 md:text-[44px]">
            Solarrechner: Was bringt Ihnen eine PV-Anlage?
          </h1>
          <p className="mt-5 max-w-[65ch] text-[18px] leading-relaxed text-gray-600">
            Anlagengröße, Verbrauch und Dach eingeben – Sie sehen sofort
            Jahresertrag, Ersparnis, Autarkie und Amortisation. Gerechnet wird
            mit den Einspeisesätzen, die seit dem{" "}
            {VERGUETUNG.gueltigAbLabel} gelten.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <Solarrechner />

        {/* Erläuterung – gibt der Seite Textsubstanz für die Suche */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
              Womit der Rechner arbeitet
            </h2>
            <ul className="space-y-3">
              {[
                `${ANNAHMEN.ertragProKwpSued} kWh Ertrag je kWp bei Südausrichtung – ein belastbarer Wert für das Allgäu und Schwaben.`,
                `Rund ${ANNAHMEN.qmProKwp} m² Dachfläche je kWp mit heutigen Modulen.`,
                `${String(ANNAHMEN.strompreis * 100).replace(".", ",")} ct/kWh als Netzstrompreis, den jede selbst genutzte Kilowattstunde ersetzt.`,
                `Einspeisevergütung nach EEG, gestaffelt nach Anlagengröße – aktuell ${ct(
                  VERGUETUNG.saetze[0].teileinspeisung
                )} ct/kWh bis 10 kWp.`,
                `${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung und Zählermiete.`,
              ].map((p) => (
                <li key={p} className="flex gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]"
                  />
                  <span className="text-[16px] leading-relaxed text-gray-700">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
              Warum der Eigenverbrauch entscheidet
            </h2>
            <p className="mb-4 max-w-[65ch] text-[16px] leading-relaxed text-gray-600">
              Eine Kilowattstunde, die Sie selbst verbrauchen, spart Ihnen den
              vollen Netzstrompreis. Dieselbe Kilowattstunde ins Netz gespeist
              bringt nur einen Bruchteil davon. Der Unterschied ist der Grund,
              warum sich ein Speicher heute für die meisten Haushalte rechnet –
              und warum eine sehr große Anlage ohne passenden Verbrauch nicht
              automatisch die bessere ist.
            </p>
            <p className="max-w-[65ch] text-[16px] leading-relaxed text-gray-600">
              Wie sich die Vergütung entwickelt und was ab 2027 geplant ist,
              erklären wir im{" "}
              <Link
                href="/ratgeber/einspeiseverguetung-2026"
                className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
              >
                Ratgeber zur Einspeisevergütung
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="mb-6 text-[24px] font-semibold text-gray-900 md:text-[28px]">
            Häufige Fragen zum Solarrechner
          </h2>
          <FaqAccordion items={FAQ} />
        </section>
      </div>

      <EndSection />
    </>
  );
}
