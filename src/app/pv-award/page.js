// src/app/pv-award/page.js
//
// Ökovolt PV Award – jährlicher Preis für die besten Anlagen und
// Nachhaltigkeitsinvestitionen unserer Kundinnen und Kunden.
// Inhalte: src/components/Award/awardDaten.js · Formular → /api/award
// Event-Schema nur, wenn TERMINE.fix (Datum und Ort feststehen).

import { CalendarClock, Clapperboard, FileCheck2, ListChecks, Scale, Send, Trophy } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { iconFor } from "@/components/ui/icons";
import Querverweise from "@/components/Reusable/Querverweise";
import Trophaee from "@/components/Award/Trophaee";
import AwardEinreichung from "@/components/Award/AwardEinreichung";
import { AWARD_JAHR, AWARD_NAME, JURY, KATEGORIEN, KRITERIEN, TEILNAHME, TERMINE, ZEITPLAN } from "@/components/Award/awardDaten";
import { BASE_URL, FIRMA, SITE_NAME, SOLENSA } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/pv-award`;
const TITEL = "Ökovolt PV Award – die besten PV-Anlagen | Ökovolt";
const BESCHREIBUNG =
  "Der Ökovolt PV Award zeichnet jährlich die besten Photovoltaikanlagen und Nachhaltigkeitsinvestitionen unserer Kunden aus: 7 Kategorien, Kriterien, Jury, Einreichung.";

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
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: AWARD_NAME }],
  },
};

const FAQ = [
  {
    q: "Was ist der Ökovolt PV Award?",
    a: `Der ${AWARD_NAME} ist ein jährlicher Preis der ${FIRMA.name} für die besten Photovoltaikanlagen und Nachhaltigkeitsinvestitionen ihrer Kundinnen und Kunden in Österreich – vergeben in ${KATEGORIEN.length} Kategorien von Gewerbe und Industrie bis zur Energiegemeinschaft des Jahres.`,
  },
  {
    q: "Wer kann teilnehmen?",
    a: "Kundinnen und Kunden von Ökovolt, deren Anlage in Österreich steht, in Betrieb ist und von Ökovolt errichtet, erweitert oder betreut wird. Einreichen können Anlagenbetreiber:innen oder bevollmächtigte Personen.",
  },
  {
    q: "Was kostet die Teilnahme?",
    a: "Nichts. Die Teilnahme ist kostenlos und unabhängig von künftigen Aufträgen.",
  },
  {
    q: "Wann ist Einreichschluss und wann die Verleihung?",
    a: `Die Termine für ${AWARD_JAHR} werden auf dieser Seite veröffentlicht. Sie können Ihr Projekt schon jetzt einreichen; wir informieren alle Einreichenden, sobald Einreichschluss und Verleihung feststehen.`,
  },
  {
    q: "Wie wird bewertet?",
    a: `Eine Fachjury aus Technik, Wirtschaft und Nachhaltigkeit bewertet nach sechs Kriterien: ${KRITERIEN.map((k) => `${k.titel} (${k.gewicht} %)`).join(", ")}.`,
  },
  {
    q: "Was passiert mit meinen Projektdaten und Fotos?",
    a: "Mit der Einreichung willigen Sie ein, dass Projektname, Betreiber, Ort, Beschreibung, Fotos und Kennzahlen im Rahmen des Awards veröffentlicht werden. Die Einwilligung können Sie bis zur Jurysitzung widerrufen; Betriebsdaten aus dem Monitoring verwenden wir nur mit Ihrer gesonderten Zustimmung.",
  },
];

export default function PvAwardPage() {
  const schemaGraph = [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}/#webpage`,
      url: PAGE_URL,
      name: TITEL,
      description: BESCHREIBUNG,
      inLanguage: "de-AT",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
    },
  ];
  // Event-Schema ausschließlich mit fixem Datum und Ort (siehe awardDaten.TERMINE).
  if (TERMINE.fix && TERMINE.verleihung?.datum && TERMINE.verleihung?.ort) {
    schemaGraph.push({
      "@type": "Event",
      name: `${AWARD_NAME} ${AWARD_JAHR} – Verleihung`,
      startDate: TERMINE.verleihung.datum,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: TERMINE.verleihung.ort, address: { "@type": "PostalAddress", addressCountry: "AT" } },
      organizer: { "@id": `${BASE_URL}/#organization` },
      url: PAGE_URL,
    });
  }

  const kategorien = KATEGORIEN.map((k) => ({ icon: iconFor(k.icon), title: k.titel, text: k.text }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: AWARD_NAME }]}
        eyebrow={`${AWARD_NAME} ${AWARD_JAHR}`}
        title={
          <>
            Ausgezeichnete Anlagen. <span className="ov-text-gradient-light">Ausgezeichnete Betriebe.</span>
          </>
        }
        lead={`Mit dem ${AWARD_NAME} zeichnen wir jedes Jahr die besten Photovoltaikanlagen und Nachhaltigkeitsinvestitionen unserer Kundinnen und Kunden in Österreich aus – in ${KATEGORIEN.length} Kategorien, bewertet von einer Fachjury aus Technik, Wirtschaft und Nachhaltigkeit.`}
        points={[`${KATEGORIEN.length} Kategorien`, "Fachjury aus Technik, Wirtschaft & Nachhaltigkeit", "Kostenlose Teilnahme für Ökovolt-Kunden"]}
        actions={[
          { label: "Projekt einreichen", href: "#einreichen" },
          { label: "Kriterien ansehen", href: "#kriterien", icon: ListChecks },
        ]}
      />

      {/* Was ist der Award */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Der Preis"
          title="Wofür der Ökovolt PV Award steht"
          text={[
            `Der ${AWARD_NAME} ist ein jährlicher Preis für Photovoltaikanlagen, die mehr leisten als Kilowattstunden: Sie senken Kosten, sparen CO₂, verbinden Sektoren, fügen sich in Gebäude und Landschaft ein – und zeigen anderen, dass es geht.`,
            "Ausgezeichnet werden nicht wir, sondern die Unternehmen, Höfe, Gemeinden, Hotels und Energiegemeinschaften, die investiert haben. Preisträger erhalten die Award-Trophäe und eine Urkunde; auf Wunsch stellen wir ihr Projekt auf oekovolt.com vor.",
          ]}
          aside={<Trophaee jahr={AWARD_JAHR} />}
          reverse
        />
      </Section>

      {/* Kategorien */}
      <Section tone="sand" space="lg" id="kategorien" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Kategorien"
          title={<>{KATEGORIEN.length} Kategorien für <span className="ov-text-gradient">ganz Österreich</span></>}
          lead="Jede Anlage tritt in genau einer Kategorie an. Welche passt, entscheiden Sie bei der Einreichung – die Jury kann ein Projekt in eine passendere Kategorie verschieben."
          className="mb-12"
        />
        <FeatureGrid items={kategorien} cols={4} />
      </Section>

      {/* Kriterien */}
      <Section tone="white" space="lg" id="kriterien" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Kriterien & Gewichtung"
            title="Bewertet wird, was eine Anlage wirklich leistet"
            lead="Die Jury bewertet jede nominierte Anlage nach sechs Kriterien. Die Gewichtung ist ein Vorschlag und wird mit den Teilnahmebedingungen verbindlich veröffentlicht."
          >
            <p className="mt-6 flex items-start gap-2 text-[14.5px] leading-relaxed text-ink-600">
              <Scale aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              Kennzahlen wie Leistung, Ertrag und Eigenverbrauch prüfen wir – mit Ihrer Zustimmung – anhand der Monitoring-Daten.
            </p>
          </SectionHeading>
          <Reveal className="overflow-hidden rounded-3xl ring-1 ring-ink-200/70">
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">Bewertungskriterien und Gewichtung des {AWARD_NAME}</caption>
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Kriterium</th>
                  <th scope="col" className="w-40 px-5 py-3.5 font-semibold">Gewichtung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {KRITERIEN.map((k) => (
                  <tr key={k.titel} className="align-top odd:bg-sand-50/60">
                    <th scope="row" className="px-5 py-4 font-normal">
                      <span className="block font-display text-[16px] font-bold text-ink-900">{k.titel}</span>
                      <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-600">{k.text}</span>
                    </th>
                    <td className="px-5 py-4">
                      <span className="font-display text-[20px] font-extrabold text-ov-700">{k.gewicht} %</span>
                      <span aria-hidden="true" className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-ink-100">
                        <span className="block h-full rounded-full bg-ov-500" style={{ width: `${k.gewicht * 4}%` }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-ov-50">
                  <th scope="row" className="px-5 py-3.5 font-semibold text-ink-900">Summe</th>
                  <td className="px-5 py-3.5 font-display text-[18px] font-extrabold text-ink-900">{KRITERIEN.reduce((s, k) => s + k.gewicht, 0)} %</td>
                </tr>
              </tfoot>
            </table>
          </Reveal>
        </div>
      </Section>

      {/* Jury */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-sun-400/15 blur-[120px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Jury"
            title="Eine Fachjury aus Technik, Wirtschaft und Nachhaltigkeit"
            lead="Die Jury besteht aus Fachleuten, die nicht an den eingereichten Projekten beteiligt waren. Die Besetzung veröffentlichen wir gemeinsam mit den Terminen."
            align="center"
            className="mb-12"
          />
          <FeatureGrid items={JURY.map((j) => ({ icon: iconFor(j.icon), title: j.titel, text: j.text }))} cols={3} tone="dark" />
        </div>
      </Section>

      {/* Zeitplan */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Zeitplan"
          title={`So läuft der ${AWARD_NAME} ab`}
          lead={TERMINE.fix ? undefined : `Die Termine für ${AWARD_JAHR} werden hier veröffentlicht. Einreichungen nehmen wir schon jetzt entgegen.`}
          align="center"
          className="mb-14"
        />
        <Steps
          items={ZEITPLAN.map((z, i) => ({ ...z, title: z.titel, icon: [Send, FileCheck2, Scale, Trophy][i] }))}
        />
        {!TERMINE.fix && (
          <Reveal className="mx-auto mt-12 flex max-w-2xl items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-ov-200">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[15px] leading-relaxed text-ink-700">
              <strong className="text-ink-900">Termine {AWARD_JAHR}:</strong> Einreichschluss, Jurysitzung und Verleihung stehen noch nicht fest. Alle Einreichenden erhalten die Termine per E-Mail, sobald sie feststehen.
            </p>
          </Reveal>
        )}
      </Section>

      {/* Teilnahme */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Teilnahmebedingungen"
            title="Wer mitmachen kann – und was gilt"
            lead="Kurzfassung der Teilnahmebedingungen. Die vollständige Fassung veröffentlichen wir mit den Terminen."
          />
          <ol className="space-y-3">
            {TEILNAHME.map((t, i) => (
              <Reveal as="li" key={t} delay={i * 60} className="flex gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
                <span className="text-[15.5px] leading-relaxed text-ink-700">{t}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Nachhaltigkeitsmarketing */}
      <Section tone="green" space="lg">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="Mehr Sichtbarkeit"
            title="Aus Ihrer Anlage eine Geschichte machen"
            lead={`Ob Preisträger oder nicht: Eine gute Anlage verdient ein Publikum. Mit der ${SOLENSA.name} produzieren wir Videos zur PV-Anlage und Nachhaltigkeits-Imagespots für Unternehmen – für Website, Social Media, Recruiting und Nachhaltigkeitsbericht.`}
          >
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/service/nachhaltigkeitsmarketing" pfeil>
                Nachhaltigkeitsmarketing
              </Button>
              <Button href={SOLENSA.web} variant="secondary" icon={Clapperboard}>
                {SOLENSA.name}
              </Button>
            </div>
          </SectionHeading>
          <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ov-200 md:p-8">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Für Einreichungen hilfreich</p>
            <ul className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-ink-700">
              {[
                "Fotos oder Drohnenaufnahmen der Anlage im Betrieb",
                "Jahresertrag und Eigenverbrauch aus dem Monitoring",
                "Ein Satz, warum Sie investiert haben",
                "Was sich seitdem verändert hat – Kosten, CO₂, Abläufe",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Einreichung */}
      <Section tone="sand" space="lg" id="einreichen" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Einreichung"
              title="Projekt einreichen"
              lead="Rund zehn Minuten: Projekt, Kennzahlen, Ansprechperson. Fotos können Sie per Link zu einem Cloud-Ordner teilen."
            />
            <p className="mt-6 text-[14.5px] leading-relaxed text-ink-600">
              Fragen zur Einreichung? <a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(AWARD_NAME)}`} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">{FIRMA.email}</a> oder{" "}
              <a href={FIRMA.telefonHref} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">{FIRMA.telefon}</a>
            </p>
          </div>
          <Reveal dir="scale" className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-9">
            <AwardEinreichung />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={AWARD_NAME} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/pv-award" />
      <CtaBand
        eyebrow="Noch keine Anlage?"
        title="Die Anlage für den nächsten Award planen wir gern mit Ihnen."
        text="Dach, Freifläche oder Gemeindeprojekt: Wir prüfen Flächen, Lastgang und Netzanschluss und melden uns mit einer ersten Einschätzung."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Referenzen ansehen", href: "/referenzen/projekte", icon: Trophy }}
      />
    </div>
  );
}
