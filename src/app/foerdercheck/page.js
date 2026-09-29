// src/app/foerdercheck/page.js

import Link from "next/link";
import { ArrowRight, BadgeEuro, CalendarClock, Clock, Database, FileSignature, Map, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import FoerderWizard from "@/components/Foerdercheck/FoerderWizard";
import { BUND, laenderFuerCheck } from "@/components/Foerdercheck/programme";
import { Quellen, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { Fachdetails, Glow } from "@/components/Forderungen/Shared/Premium";
import { EAG_IZ, KPC_BEENDET, STAND, STEUER } from "@/components/Forderungen/Shared/bund";
import { VORHABEN, ZIELGRUPPEN } from "@/data/bundeslaender";
import { callPhase } from "@/lib/foerdercall";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/foerdercheck`;
const TITLE = "Förder-Check 2026: PV-Förderung Österreich | Ökovolt";
const DESCRIPTION = "Kostenloser Förder-Check Österreich: Bundesland, Zielgruppe und Vorhaben wählen – EAG-Zuschuss, Marktprämie, KPC und Landesprogramme mit Links in 30 Sekunden.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Förder-Check Photovoltaik", "PV Förderung Österreich 2026", "EAG Investitionszuschuss Rechner", "Förderung Stromspeicher Österreich", "Förderung Agri-PV", "Förderung Energiegemeinschaft", "PV Förderung Unternehmen"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Förder-Check" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Wie genau ist der Förder-Check?",
    a: `Der Förder-Check ist eine Orientierung. Er kombiniert die Bundesprogramme (EAG-Investitionszuschuss, Marktprämie, KPC, Klima- und Energiefonds, Steuer) mit den Landesprogrammen aller neun Bundesländer, die wir mit Prüfdatum pflegen (Stand ${STAND.label}). Budgets können kurzfristig ausgeschöpft sein, und jedes Programm hat Detailbedingungen. Verbindlich sind die Richtlinien der Förderstellen.`,
  },
  {
    q: "Welche Förderung bekommt ein Unternehmen für eine PV-Anlage?",
    a: `Bundesweit den EAG-Investitionszuschuss (bis 1.000 kWp, Kategorie C max. 130 €/kWp, D max. 120 €/kWp) oder alternativ die Marktprämie, dazu den Investitionsfreibetrag von ${STEUER.ifb.satzOekoTemp} % bei Anschaffung bis 31.12.2026 und die Befreiung von der Elektrizitätsabgabe. Landesprogramme für Betriebe gibt es 2026 vor allem in Kärnten; Salzburg, Wien, die Steiermark, Tirol und Vorarlberg fördern gezielt.`,
  },
  {
    q: "Wann muss ich die Förderung beantragen?",
    a: "Den EAG-Investitionszuschuss im Zeitfenster eines Fördercalls und vor der Inbetriebnahme; Bestellung und Baubeginn davor schaden nicht. Landesprogramme sind unterschiedlich: Wien verlangt den Antrag vor der Bestellung, Kärnten und Tirol nach Fertigstellung bzw. Inbetriebnahme. Die Marktprämie gibt es nur über ein Gebot zu festen Gebotsterminen.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Wallbox und Ladeinfrastruktur?",
    a: "Die Bundesförderungen eRide für Betriebe und für Private sind wegen ausgeschöpfter Budgets vorzeitig beendet. Unternehmen können Ladestationen aber mit dem Investitionsfreibetrag von 22 % absetzen; einzelne Länder – etwa Tirol für E-Carsharing in Gemeinden – und Gemeinden fördern regional.",
  },
  {
    q: "Wird Agri-PV gesondert gefördert?",
    a: "Ein eigenes Agri-PV-Programm gibt es 2026 weder beim Bund noch bei den Ländern. Agri-PV wird über den EAG-Investitionszuschuss gefördert: ohne den 25-%-Abschlag für Grünland, wenn die landwirtschaftliche Nutzung auf mindestens 75 % der Fläche Hauptnutzung bleibt, und mit 30 % Innovationszuschlag bei vertikalen Modulen oder mindestens 2 m Modulunterkante.",
  },
  {
    q: "Speichert der Förder-Check meine Daten?",
    a: "Nein. Die Auswertung läuft vollständig in Ihrem Browser. Ihre Auswahl steht nur in der Adresszeile, damit Sie das Ergebnis teilen können – an Ökovolt wird dabei nichts übertragen.",
  },
];

export default function FoerdercheckPage() {
  const laender = laenderFuerCheck();
  const vorhabenLabel = Object.fromEntries(VORHABEN.map((v) => [v.id, v.label]));
  const zgLabel = Object.fromEntries(ZIELGRUPPEN.map((z) => [z.id, z.label]));

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${PAGE_URL}/#app`,
    name: "Ökovolt Förder-Check Österreich",
    url: PAGE_URL,
    description: DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "de-AT",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    dateModified: STAND.iso,
    provider: { "@id": `${BASE_URL}/#organization` },
    featureList: ["Förderprogramme nach Bundesland", "Zielgruppen Unternehmen, Landwirtschaft, Gemeinde, Privat, Energiegemeinschaft", "PV Dach, Freifläche, Agri-PV, Speicher, Ladeinfrastruktur, Wärmepumpe", "Antragszeitpunkt je Programm"],
  };

  const programmTabelle = BUND.map((p) => ({
    name: p.name,
    traeger: p.traeger,
    hoehe: p.hoehe,
    fuer: `${p.zielgruppen.map((z) => zgLabel[z]).join(", ")} · ${p.themen.map((t) => vorhabenLabel[t]).join(", ")}`,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Förder-Check" }]}
        eyebrow={`Förder-Check Österreich · Stand ${STAND.kurz}`}
        title={<>Welche Förderung <span className="ov-text-gradient-light">passt zu Ihrem Projekt</span>?</>}
        lead="Drei Fragen, 30 Sekunden: Der Förder-Check zeigt Bundes- und Landesprogramme für PV auf dem Dach, Freifläche, Agri-PV, Speicher, Ladeinfrastruktur und Wärmepumpe – für Unternehmen, Landwirtschaft, Gemeinden, Private und Energiegemeinschaften."
        points={["Alle 9 Bundesländer", "5 Zielgruppen, 6 Vorhaben", "Keine Datenübertragung", `Nächster EAG-Call ${EAG_IZ.naechsterCall.zeitraum}`]}
        className="pb-28 md:pb-36"
      />

      <section id="foerdercheck" className="relative flow-root scroll-mt-24 bg-sand-50 pb-16 md:pb-24">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-navy-950 md:h-48" />
        <div className="ov-container relative -mt-24 md:-mt-32">
          <Reveal dir="scale">
            <FoerderWizard laender={laender} />
          </Reveal>
          {/* Hinweis auf den Oktober-Call – entfällt beim ersten Rendern nach Call-Ende */}
          {callPhase(Date.now()) !== "nach" && (
            <Link href="/forderungen/eag-foerdercall" className="group mt-5 flex flex-col gap-3 rounded-3xl bg-white p-5 ring-1 ring-ov-200 transition-colors hover:bg-ov-50 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <span className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-600 text-white">
                  <CalendarClock aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-[17px] font-bold text-ink-900">3. EAG-Fördercall: {EAG_IZ.naechsterCall.zeitraum}</span>
                  <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-600">Ticketziehung am 08.10. um 17 Uhr – Checkliste, Countdown und Schnellrechner für Ihre Einreichung.</span>
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-700">
                Zum Fördercall
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="So funktioniert es" title="Ehrliche Orientierung statt Fördermittel-Versprechen" lead="Wir zeigen, was wir wissen – und sagen dazu, wo die Grenzen liegen." align="center" className="mb-12" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Database, title: "Gepflegte Datenbasis", text: "Bundesprogramme und alle neun Bundesländer mit Landesprogrammen – jeweils mit Prüfdatum und Quelle." },
            { icon: FileSignature, title: "Antragszeitpunkt je Programm", text: "Vor Bestellung, vor Inbetriebnahme oder zum Gebotstermin – der häufigste Grund, warum Förderung verloren geht." },
            { icon: ShieldCheck, title: "Keine Daten, kein Konto", text: "Die Auswertung läuft im Browser. Ergebnis per Link teilen – mit Geschäftsführung, Bank oder Steuerberatung." },
            { icon: Map, title: "Nach Bundesland", text: "Landesprogramme, Gemeindeförderungen und Anlaufstellen für Energiegemeinschaften je Land." },
            { icon: BadgeEuro, title: "Alle Förderarten", text: "Zuschüsse, Marktprämie, Steuervorteile und Netzentgelt-Reduktion in einer Übersicht." },
            { icon: Clock, title: "Laufend aktualisiert", text: `Datenstand ${STAND.label}: inklusive der Fördercalls 2026 und der ElWG-Termine.` },
          ]}
        />
      </Section>

      <Section tone="navy" space="md" className="ov-noise overflow-hidden">
        <Glow />
        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading dark eyebrow="Datenbasis Bund" title="Bundesweite Programme im Förder-Check" lead="Diese Programme gelten unabhängig vom Bundesland. Landesprogramme ergänzt der Check je nach Standort." />
          <div className="space-y-3">
            <ul className="grid gap-3 sm:grid-cols-2">
              {BUND.slice(0, 4).map((p) => (
                <li key={p.id} className="ov-glass rounded-2xl p-4">
                  <p className="text-[12.5px] text-white/55">{p.traeger}</p>
                  <p className="mt-0.5 font-semibold leading-snug text-white">{p.name}</p>
                  <p className="mt-2 text-[14px] font-semibold text-ov-300">{p.hoehe}</p>
                </li>
              ))}
            </ul>
            <Fachdetails dark titel={`Alle ${BUND.length} Bundesprogramme als Tabelle`} untertitel="Träger, Förderhöhe, Zielgruppen und Vorhaben – plus beendete Programme">
              <Tabelle
                dicht
                caption={`Bundesweite Förderprogramme für Photovoltaik und verwandte Vorhaben in Österreich (Stand ${STAND.label})`}
                spalten={[
                  { key: "name", label: "Programm", breite: "w-[26%]" },
                  { key: "traeger", label: "Träger / Grundlage" },
                  { key: "hoehe", label: "Förderung", className: "font-semibold text-ov-700" },
                  { key: "fuer", label: "Für" },
                ]}
                zeilen={programmTabelle}
              />
              <div className="mt-5 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <p className="font-display text-[17px] font-bold text-ink-900">Beendet – wird aber noch häufig gesucht</p>
                <ul className="mt-3 grid gap-2 md:grid-cols-2">
                  {KPC_BEENDET.map((b) => (
                    <li key={b.name} className="text-[14.5px] text-ink-600"><strong className="text-ink-900">{b.name}</strong> – {b.ende}</li>
                  ))}
                </ul>
              </div>
            </Fachdetails>
          </div>
        </div>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Förderung 2026 – kurz beantwortet" lead="Sie möchten es konkret wissen? Im Rahmen Ihres Projekts prüfen wir alle Programme für den Standort." />
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={STAND.label} quellen={[...EAG_IZ.quellen.slice(0, 3), ...STEUER.quellen.slice(0, 1), ...KPC_BEENDET.map((b) => ({ label: `KPC – ${b.name}`, url: b.url }))]} hinweis="Orientierung ohne Gewähr. Keine Rechts- oder Steuerberatung. Alle Landesquellen stehen auf den jeweiligen Landesseiten." />
      </Section>


      <Querverweise pfad="/foerdercheck" />
      <CtaBand
        eyebrow="Förderung sichern"
        title="Förderung gefunden? Jetzt das Projekt planen."
        text="Wir planen Ihre Anlage so, dass EAG-Zuschuss, Landesprogramm und Investitionsfreibetrag zusammenpassen – und stimmen Netzantrag, Förderantrag und Inbetriebnahme zeitlich ab."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förderung nach Bundesland", href: "/forderungen/landesforderungen" }}
      />
    </div>
  );
}
