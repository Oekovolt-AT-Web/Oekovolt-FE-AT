// src/app/partner/page.js
//
// „Elektro-Partner werden“ – Elektrotechnik-Betriebe (Subunternehmer)
// registrieren sich für gemeinsame PV-Projekte. Formular:
// src/components/Partner/PartnerRegistrierung.js → /api/partner-registrierung

import { BadgeCheck, CalendarCheck2, ClipboardList, FileCheck2, GraduationCap, Handshake, HardHat, SearchCheck, ShieldCheck } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import PartnerRegistrierung from "@/components/Partner/PartnerRegistrierung";
import Zusammenarbeit from "@/components/Partner/Zusammenarbeit";
import Einzugsgebiet from "@/components/Team/Einzugsgebiet";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/partner`;
const TITEL = "Elektro-Partner werden – PV-Projekte in Österreich | Ökovolt";
const BESCHREIBUNG =
  "Elektrotechnik-Betriebe als Partner für PV-Projekte in Österreich: Projekte, Zentraleinkauf, Planung, Parkregler und SCADA von Ökovolt. Anforderungen und Registrierung.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Elektro-Partner werden bei Ökovolt" }],
  },
};

const ANFORDERUNGEN = [
  {
    titel: "Gewerbeberechtigung Elektrotechnik",
    text: "Reglementiertes Gewerbe nach der Gewerbeordnung 1994 mit gewerberechtlicher Geschäftsführung – nachgewiesen über die GISA-Zahl im Gewerbeinformationssystem Austria.",
  },
  {
    titel: "UID und Firmenbuch",
    text: "Gültige UID-Nummer; bei eingetragenen Unternehmen die Firmenbuchnummer. Beides prüfen wir über öffentliche Register.",
  },
  {
    titel: "Betriebshaftpflicht",
    text: "Aufrechte Betriebshaftpflichtversicherung mit ausreichender Deckung für Arbeiten an elektrischen Anlagen und auf Dächern.",
  },
  {
    titel: "Befähigungen im Team",
    text: "Elektrofachkräfte mit Erfahrung in Errichtung, Prüfung und Messung nach ÖVE/ÖNORM E 8101; für Mittelspannung entsprechende Schaltberechtigung.",
  },
  {
    titel: "Absturzsicherung & Höhenarbeit",
    text: "Unterwiesene Mitarbeiter:innen für PSA gegen Absturz, kollektive Absturzsicherungen nach Bauarbeiterschutzverordnung (BauV), Befähigung für Hubarbeitsbühnen.",
  },
  {
    titel: "Sozialversicherung & Auftraggeberhaftung",
    text: "Ordnungsgemäße Anmeldung aller Mitarbeiter:innen; idealerweise Eintrag in der HFU-Gesamtliste (Auftraggeberhaftung nach § 67a ASVG und § 82a EStG).",
  },
  {
    titel: "Referenzen",
    text: "Nachvollziehbare Referenzen aus PV, Gewerbe-Elektrotechnik, Speicher oder Ladeinfrastruktur – Größe, Jahr und Ihr Leistungsanteil genügen.",
  },
];

const ABLAUF = [
  { icon: ClipboardList, title: "Registrierung", text: "Sie registrieren Ihren Betrieb mit Leistungen, Einsatzgebiet und Kapazität – in rund zehn Minuten." },
  { icon: SearchCheck, title: "Prüfung", text: "Wir prüfen Gewerbeberechtigung, Register, Versicherung und Nachweise und melden uns für ein Kennenlerngespräch." },
  { icon: GraduationCap, title: "Onboarding", text: "Rahmenvereinbarung, Einweisung in Standards, Dokumentation, Parkregler und Fernwartung." },
  { icon: HardHat, title: "Projekte", text: "Sie erhalten Anfragen für Projekte in Ihrem Einsatzgebiet und bauen gemeinsam mit unserer Projektleitung." },
];

const FAQ = [
  {
    q: "Wer kann Elektro-Partner von Ökovolt werden?",
    a: "Elektrotechnik-Betriebe mit aufrechter Gewerbeberechtigung für Elektrotechnik in Österreich, Betriebshaftpflicht und Erfahrung in der Errichtung elektrischer Anlagen. Photovoltaik-Erfahrung ist von Vorteil, aber keine Voraussetzung für einzelne Leistungen wie Verteilerbau, Kabelverlegung oder Ladeinfrastruktur.",
  },
  {
    q: "Welche Leistungen übernehmen Partnerbetriebe?",
    a: "Je nach Profil DC-Montage, DC-Verkabelung, AC-Anschluss und Wechselrichter, Verteilerbau, Speicher, Ladeinfrastruktur, Blitz- und Überspannungsschutz, Erdung, Kabelverlegung, Mittelspannung sowie Prüfung und Messung nach ÖVE/ÖNORM E 8101.",
  },
  {
    q: "Wer stellt das Material?",
    a: "In der Regel beschaffen wir Module, Wechselrichter, Unterkonstruktion und Speicher über den Zentraleinkauf der Gruppe und liefern projektbezogen. Kleinmaterial und Werkzeug regelt die Rahmenvereinbarung.",
  },
  {
    q: "Wer trägt die Verantwortung gegenüber dem Kunden und dem Netzbetreiber?",
    a: `Vertragspartnerin des Kunden ist die ${FIRMA.name}; sie verantwortet Planung, Netzanschluss und Inbetriebnahme. Partnerbetriebe verantworten die fachgerechte Ausführung ihres Leistungsanteils und dokumentieren ihn nach unseren Vorgaben.`,
  },
  {
    q: "Wie wird abgerechnet?",
    a: "Nach den in der Rahmenvereinbarung und im Einzelauftrag vereinbarten Preisen – je Leistungsposition nach Aufmaß oder pauschal – mit im Vertrag festgelegten Zahlungszielen.",
  },
  {
    q: "Müssen wir in ganz Österreich arbeiten?",
    a: "Nein. Sie geben bei der Registrierung an, in welchen Bundesländern Sie tätig sind und welche Kapazität Sie pro Monat anbieten. Anfragen erhalten Sie passend zu diesem Profil.",
  },
];

export default function PartnerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: TITEL,
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    audience: { "@type": "BusinessAudience", audienceType: "Elektrotechnik-Betriebe in Österreich" },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: "Elektro-Partner werden" }]}
        eyebrow="Elektro-Partnerprogramm"
        title={<>Gemeinsam die <span className="ov-text-gradient-light">Energiewende bauen</span></>}
        lead="Sie sind ein Elektrotechnik-Betrieb in Österreich und wollen mehr Photovoltaik bauen? Ökovolt ist Ihre zentrale Plattform: Projekte, Material, Planung, Leittechnik und Support – Sie bringen Ihr Handwerk ein."
        image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Techniker montieren Solarmodule auf einem Dach, Luftaufnahme" }}
        points={["Projekte in Ihrem Einsatzgebiet", "Zentraleinkauf & Planung", "Parkregler, Fernwartung & SCADA", "Faire, vertraglich klare Abrechnung"]}
        actions={[
          { label: "Jetzt registrieren", href: "#registrierung" },
          { label: "Anforderungen", href: "#anforderungen", icon: FileCheck2 },
        ]}
      />

      {/* So arbeiten wir zusammen */}
      <Section tone="white" space="lg">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="So arbeiten wir zusammen" title={<>Eine Plattform, <span className="ov-text-gradient">klare Rollen</span></>} />
          <p className="text-[16.5px] leading-relaxed text-ink-600">
            Wir bringen Projekte, Material, Planung und Leittechnik – Sie bringen Ihr Handwerk. Die Verantwortung gegenüber Kunde und Netzbetreiber bleibt bei der {FIRMA.name}.
          </p>
        </div>
        <Zusammenarbeit />
      </Section>

      {/* Anforderungen */}
      <Section tone="sand" space="lg" id="anforderungen" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Anforderungen"
              title="Was Partnerbetriebe mitbringen"
              lead="Wir arbeiten nur mit Betrieben, die rechtlich und fachlich für Arbeiten an elektrischen Anlagen berechtigt sind. Das schützt unsere Kunden, Ihre Mitarbeiter:innen und uns."
            />
            <Reveal className="mt-8 flex items-start gap-4 rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <ShieldCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="text-[15px] leading-relaxed text-ink-700">
                <strong className="text-ink-900">Prüfung vor dem ersten Auftrag:</strong> Gewerbeberechtigung (GISA), UID, Firmenbuch und HFU-Liste gleichen wir mit den öffentlichen Registern ab.
              </p>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ANFORDERUNGEN.map((a, i) => (
              <Reveal
                as="li"
                key={a.titel}
                delay={(i % 2) * 80}
                className={`rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 ${i === ANFORDERUNGEN.length - 1 && ANFORDERUNGEN.length % 2 === 1 ? "sm:col-span-2" : ""}`}
              >
                <BadgeCheck aria-hidden="true" className="h-6 w-6 text-ov-600" />
                <h3 className="ov-h3 mt-4 text-ink-900">{a.titel}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{a.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Von der Registrierung zum ersten Projekt" align="center" className="mb-14" />
        <Steps items={ABLAUF} />
      </Section>

      {/* Einsatzgebiet */}
      <Section tone="navy" space="lg" id="einsatzgebiet" className="scroll-mt-20 overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Einsatzgebiet"
            title={<>Wo arbeiten Sie? <span className="ov-text-gradient-light">Markieren Sie Ihre Bundesländer.</span></>}
            lead="Wir suchen Partnerbetriebe in ganz Österreich. Tippen Sie die Bundesländer an, in denen Ihr Betrieb Aufträge übernimmt – die Auswahl landet direkt in Ihrer Registrierung."
            className="mb-12 max-w-3xl"
          />
          <Einzugsgebiet modus="auswahl" dunkel />
        </div>
      </Section>

      {/* Registrierung */}
      <Section tone="green" space="lg" id="registrierung" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Registrierung"
              title="Betrieb registrieren"
              lead="Drei Schritte: Betrieb, Leistungen und Ansprechperson. Nachweise fordern wir erst bei der Prüfung an."
            />
            <ul className="mt-8 space-y-3 text-[15px] text-ink-700">
              {[
                "UID-Nummer und GISA-Zahl bereithalten",
                "Leistungen und Einsatzgebiet (Bundesländer) wählen",
                "Kapazität pro Monat in kWp einschätzen",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Handshake aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Reveal dir="scale" className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-9">
            <PartnerRegistrierung />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Elektro-Partnerprogramm" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/partner" />
      <CtaBand
        eyebrow="Fragen zum Partnerprogramm?"
        title="Lieber zuerst sprechen? Wir nehmen uns Zeit."
        text="Rufen Sie uns an oder buchen Sie einen Termin – wir erklären Ihnen, wie die Zusammenarbeit mit Ökovolt abläuft."
        primary={{ label: "Jetzt registrieren", href: "#registrierung" }}
        secondary={{ label: "Termin buchen", href: "/termin", icon: CalendarCheck2 }}
      />
    </div>
  );
}
