// src/app/foerdercheck/page.js

import { BadgeEuro, Clock, Database, FileSignature, Map, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import FoerderWizard from "@/components/Foerdercheck/FoerderWizard";
import { BUND, STAND, laenderFuerCheck } from "@/components/Foerdercheck/programme";
import { Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = "https://www.oekovolt.com/foerdercheck";
const TITLE = "Förder-Check 2026: PV, Speicher & Wärmepumpe | Ökovolt";
const DESCRIPTION = "Kostenloser Förder-Check: Bundesland und Vorhaben wählen – passende Programme für Photovoltaik, Speicher, Wallbox, Wärmepumpe und Sanierung in 30 Sekunden.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Förder-Check",
    "Förderrechner Photovoltaik",
    "Photovoltaik Förderung 2026",
    "Wärmepumpe Förderung 2026",
    "Förderung Stromspeicher",
    "Wallbox Förderung",
    "KfW 270",
    "KfW 458",
    "Förderung Bundesland",
  ],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Förder-Check" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["https://www.oekovolt.com/og-image.jpg"] },
};

const FAQ = [
  {
    q: "Wie genau ist der Förder-Check?",
    a: "Der Förder-Check ist eine Orientierung. Er kombiniert die bundesweiten Programme (KfW, BAFA, Steuer, EEG) mit den Landes- und Kommunalprogrammen, die wir für alle 16 Bundesländer pflegen und datieren. Kommunale Budgets können aber kurzfristig ausgeschöpft sein, und jedes Programm hat Detailbedingungen. Verbindlich sind die Richtlinien der Fördergeber – im Rahmen Ihres Angebots prüfen wir die Förderung konkret.",
  },
  {
    q: "Kann ich mehrere Förderprogramme kombinieren?",
    a: "Häufig ja: Steuervorteile und EEG-Vergütung gelten immer zusätzlich, der KfW-Kredit 270 lässt sich meist mit Zuschüssen von Land oder Kommune kombinieren. Ausgeschlossen ist in der Regel die Doppelförderung derselben Kosten – etwa BEG-Zuschuss und Steuerbonus nach § 35c EStG für dieselbe Maßnahme.",
  },
  {
    q: "Wann muss ich die Förderung beantragen?",
    a: "Zuschüsse und Förderkredite fast immer vor Vorhabenbeginn – als Beginn gilt meist der unterschriebene Liefer- oder Montagevertrag. Angebote einholen und planen ist erlaubt. Die Einspeisevergütung, der Nullsteuersatz und die Einkommensteuerbefreiung brauchen keinen Antrag.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Wärmepumpen?",
    a: "Ja. Über die Bundesförderung für effiziente Gebäude (KfW 458) gibt es 30 % Grundförderung; selbst nutzende Eigentümer erhalten zusätzlich Klimageschwindigkeits- und Einkommensbonus – zusammen bis 70 %, bei geringem Einkommen bis 80 %. Die Sätze wurden zum 21. Juli 2026 angepasst; maßgeblich ist der aktuelle Stand bei der KfW.",
  },
  {
    q: "Wird eine Wallbox 2026 gefördert?",
    a: "Für private Wallboxen am Einfamilienhaus gibt es keine bundesweite Förderung mehr. Möglich sind die Steuerermäßigung für Handwerkerleistungen (20 % der Arbeitskosten) und reduzierte Netzentgelte nach § 14a EnWG. Für Mehrparteienhäuser gibt es seit April 2026 ein eigenes Bundesprogramm für Ladepunkte.",
  },
  {
    q: "Speichert der Förder-Check meine Daten?",
    a: "Nein. Die Auswertung läuft vollständig in Ihrem Browser. Ihre Auswahl steht nur in der Adresszeile, damit Sie das Ergebnis teilen können – an Ökovolt wird dabei nichts übertragen.",
  },
];

export default function FoerdercheckPage() {
  const laender = laenderFuerCheck();

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${PAGE_URL}/#app`,
    name: "Ökovolt Förder-Check",
    url: PAGE_URL,
    description: DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "de-AT",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    dateModified: STAND.iso,
    provider: { "@id": "https://www.oekovolt.com/#organization" },
    featureList: [
      "Förderprogramme nach Bundesland und Postleitzahl",
      "Photovoltaik, Stromspeicher, Wallbox, Wärmepumpe, Sanierung",
      "Bundes-, Landes- und Kommunalprogramme",
      "Antragszeitpunkt je Programm",
    ],
  };

  const programmTabelle = BUND.filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i).map((p) => ({
    name: p.name,
    art: p.traeger,
    hoehe: p.hoehe,
    fuer: p.themen.map((t) => ({ pv: "PV", speicher: "Speicher", wallbox: "Wallbox", waermepumpe: "Wärmepumpe", sanierung: "Sanierung" })[t]).join(", "),
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/landesforderungen" }, { name: "Förder-Check" }]}
        eyebrow={`Förder-Check · Stand ${STAND.label}`}
        title={<>Welche Förderung <span className="ov-text-gradient-light">passt zu Ihnen</span>?</>}
        lead="Drei Fragen, 30 Sekunden: Der Förder-Check zeigt Ihnen Bundes-, Landes- und Kommunalprogramme für Photovoltaik, Speicher, Wallbox, Wärmepumpe und Sanierung – mit Höhe, Bedingungen und dem richtigen Antragszeitpunkt."
        points={["Alle 16 Bundesländer", "Kostenlos & ohne Anmeldung", "Keine Datenübertragung", "Mit Antrags-Fahrplan"]}
        actions={[{ label: "Jetzt prüfen", href: "#foerdercheck" }]}
      />

      <Section tone="sand" space="md" id="foerdercheck" className="scroll-mt-24">
        <Reveal dir="scale">
          <FoerderWizard laender={laender} />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="So funktioniert es"
          title="Ehrliche Orientierung statt Fördermittel-Versprechen"
          lead="Wir zeigen, was wir wissen – und sagen dazu, wo die Grenzen liegen."
          align="center"
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Database, title: "Gepflegte Datenbasis", text: "Bundesprogramme und alle 16 Bundesländer mit Landes- und Kommunalprogrammen – jeweils mit Prüfdatum." },
            { icon: FileSignature, title: "Antragszeitpunkt je Programm", text: "Sie sehen sofort, welche Förderung vor dem Vertrag beantragt werden muss – der häufigste Grund, warum Geld verloren geht." },
            { icon: ShieldCheck, title: "Keine Daten, kein Konto", text: "Die Auswertung läuft im Browser. Ergebnis per Link teilen – mit Partner, Bank oder Energieberater." },
            { icon: Map, title: "Standort per PLZ", text: "Die Postleitzahl wählt Ihr Bundesland vor und verweist auf regionale Förderseiten rund um Türkheim." },
            { icon: BadgeEuro, title: "Alle Förderarten", text: "Zuschüsse, Förderkredite, Steuervorteile, Einspeisevergütung und Netzentgelt-Rabatte in einer Übersicht." },
            { icon: Clock, title: "Laufend aktualisiert", text: `Konditionen wie die BEG-Anpassung vom 21. Juli 2026 sind eingepflegt. Datenstand: ${STAND.label}.` },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Datenbasis Bund"
          title="Bundesweite Programme im Förder-Check"
          lead="Diese Programme gelten unabhängig vom Bundesland. Landes- und Kommunalprogramme ergänzt der Check je nach Standort."
          className="mb-10"
        />
        <Reveal>
          <Tabelle
            dicht
            caption={`Bundesweite Förderprogramme für Photovoltaik, Speicher, Wallbox, Wärmepumpe und Sanierung (Stand ${STAND.label})`}
            spalten={[
              { key: "name", label: "Programm", breite: "w-[30%]" },
              { key: "art", label: "Träger / Grundlage" },
              { key: "hoehe", label: "Förderung", className: "font-semibold text-ov-700" },
              { key: "fuer", label: "Für", breite: "w-[18%]" },
            ]}
            zeilen={programmTabelle}
          />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Förderung 2026 – kurz beantwortet"
            lead="Sie möchten es konkret wissen? Im Rahmen des Angebots prüfen wir alle Programme für Ihre Adresse."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/foerdercheck" />
      <CtaBand
        eyebrow="Förderung sichern"
        title="Förderung gefunden? Jetzt das passende Angebot holen."
        text="Wir planen Ihre Anlage so, dass Zuschüsse, Kredit und Steuervorteile zusammenpassen – und stimmen Antrag und Vertrag zeitlich richtig ab."
        primary={{ label: "Angebot mit Förderprüfung", href: "/angebot" }}
        secondary={{ label: "Förderung nach Bundesland", href: "/forderungen/landesforderungen" }}
      />
    </div>
  );
}
