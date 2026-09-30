// src/app/kommunen/vergabe-foerderung/page.js
//
// Vergabe & Förderung für Gemeinden: Schwellenwerte nach BVergG 2018 idF Vergaberechtsgesetz 2026
// (BGBl. I Nr. 8/2026), interaktiver Vergabe-Wegweiser, Ablauf bis zum Gemeinderatsbeschluss,
// Förderungen und Mittel (EAG, KIG 2025, Klimafonds, KPC), Energiegemeinschaft der Gemeinde, Bürgerbeteiligung,
// Checkliste „Unterlagen für den Gemeinderat“, FAQ, Quellen. Stand 30.09.2026.
//
// Zahlen: src/lib/kommunen/vergabe.js (Schwellenwerte) und src/components/KommunenVergabe/inhalte.js.
// Keine Rechtsberatung – Hinweise auf der Seite.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CalendarCheck2, CircleAlert, ClipboardList, Landmark, Users } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Fachdetails, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Hinweis, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import VergabeWegweiser from "@/components/KommunenVergabe/VergabeWegweiser";
import GemeinderatCheckliste from "@/components/KommunenVergabe/GemeinderatCheckliste";
import { CHECKLISTE, ENERGIEGEMEINSCHAFT, FAQ, FOERDERUNGEN, NEU, QUELLEN, SCHRITTE, TABELLE_KLASSISCH, TABELLE_SEKTOREN } from "@/components/KommunenVergabe/inhalte";
import { DREI_ANGEBOTE_AB, SCHWELLEN, VERGABE_STAND, euro } from "@/lib/kommunen/vergabe";
import { BASE_URL } from "@/lib/site";

const PFAD = "/kommunen/vergabe-foerderung";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "PV-Vergabe & Förderung für Gemeinden 2026 | Ökovolt";
const BESCHREIBUNG =
  "PV-Vergabe für Gemeinden: Schwellenwerte 2026, Direktvergabe bis 200.000 €, Weg zum Gemeinderatsbeschluss, EAG, KIG 2025 und Bürgerbeteiligung.";
const HERO_BILD = "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg";
const STAND = VERGABE_STAND;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: [
    "Direktvergabe Photovoltaik Gemeinde",
    "Vergaberechtsgesetz 2026 Schwellenwerte",
    "BVergG 2026 Direktvergabe 200.000",
    "PV Gemeinde Förderung",
    "Gemeinderatsbeschluss Photovoltaik",
    "KIG 2025 Photovoltaik",
    "Energiegemeinschaft Gemeinde 10 Prozent",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik für Gemeinden: Vergabe und Förderung" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";
const K = SCHWELLEN.klassisch;

export default function KommunenVergabeFoerderung() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Vergabe und Förderung von Photovoltaik für Gemeinden in Österreich",
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    audience: { "@type": "Audience", audienceType: "Gemeinden, Bürgermeisterinnen und Bürgermeister, Amtsleitung, Bauamt" },
    about: [
      {
        "@type": "Legislation",
        name: "Bundesvergabegesetz 2018 (BVergG 2018)",
        legislationIdentifier: "BGBl. I Nr. 65/2018",
        legislationJurisdiction: "AT",
        url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010295",
      },
      {
        "@type": "Legislation",
        name: "Vergaberechtsgesetz 2026",
        legislationIdentifier: "BGBl. I Nr. 8/2026",
        legislationJurisdiction: "AT",
        legislationDate: "2026-02-27",
      },
    ],
    mainEntity: {
      "@type": "Service",
      name: "Photovoltaik für Gemeinden – technische Unterlagen für Vergabe, Förderung und Gemeinderat",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Österreich" },
      audience: { "@type": "Audience", audienceType: "Gemeinden und Gemeindeverbände" },
    },
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gemeinden, Länder & Stadtwerke", href: "/kommunen" }, { name: "Vergabe & Förderung" }]}
        eyebrow={`Für Bürgermeister, Amtsleitung & Bauamt · Stand ${STAND.label}`}
        title={
          <>
            Photovoltaik für Gemeinden: <span className="ov-text-gradient-light">Vergabe und Förderung 2026</span>
          </>
        }
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">PV für die Gemeinde: richtig vergeben, gezielt fördern</span><span className="mt-3 block">Welche Vergabe seit dem Vergaberechtsgesetz 2026 zulässig ist, was der Gemeinderat für seinen Beschluss braucht und welche Mittel von Bund und Klimafonds Gemeinden nutzen können – kompakt, mit Quellen und einem Wegweiser für Ihren Auftragswert.</span></>}
        image={{ src: HERO_BILD, alt: "Gemeindeamt in Fresach in Kärnten mit Photovoltaikanlage auf dem Dach" }}
        actions={[
          { label: "Vergabeweg prüfen", href: "#wegweiser" },
          { label: "Checkliste Gemeinderat", href: "#checkliste", icon: ClipboardList },
        ]}
        points={[`Direktvergabe Bau unter ${euro(K.bau.direkt)}`, "Ablauf bis zum Beschluss", "EAG, KIG 2025, Klimafonds, KPC", "Energiegemeinschaft ab 01.10.2026"]}
      />

      <KennzahlenBand
        items={[
          { text: euro(K.bau.direkt), label: "Direktvergabe Bau – Grenze seit 01.03.2026 (netto)" },
          { text: euro(K.lieferDl.direkt), label: "Direktvergabe Lieferung und Dienstleistung (netto)" },
          { text: euro(DREI_ANGEBOTE_AB), label: "darüber um drei Angebote oder Preisauskünfte bemühen" },
          { value: 10, suffix: " %", label: "Anteil für schutzbedürftige Haushalte in Energiegemeinschaften ab 01.10.2026" },
        ]}
      />

      {/* Rechtlicher Hinweis + Wegweiser */}
      <Section tone="white" space="md" id="wegweiser" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Vergabe-Wegweiser · interaktiv"
            title="Welches Verfahren passt zu Ihrem Auftragswert?"
            lead="Auftraggeber, Auftragsart und geschätzten Nettowert wählen – der Wegweiser zeigt die zulässigen Verfahren und die Pflichten nach dem Bundesvergabegesetz."
          />
          <Hinweis ton="warn" titel="Keine Rechtsberatung">
            Diese Seite gibt einen Überblick nach dem Stand {STAND.label}. Sie ersetzt keine Prüfung im Einzelfall. Die Wahl des Verfahrens verantwortet die
            Gemeinde als Auftraggeberin – bei Unklarheiten helfen Gemeindebund, Landesverwaltung oder eine Rechtsberatung.
          </Hinweis>
        </div>
        <VergabeWegweiser />
      </Section>

      {/* Schwellenwerte */}
      <Section tone="sand" space="md" id="schwellenwerte" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Bundesvergabegesetz 2018 idF 2026"
            title="Schwellenwerte für Gemeinden"
            lead="Für Gemeinden, Gemeindeverbände und Länder als öffentliche Auftraggeber im Unterschwellenbereich. Alle Werte netto, maßgeblich ist der geschätzte Auftragswert."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Vergaberechtsgesetz 2026, in Kraft seit 01.03.2026</StandPille>
        </div>
        <Tabelle
          dicht
          caption="Schwellenwerte für öffentliche Auftraggeber nach dem Vergaberechtsgesetz 2026"
          spalten={[
            { key: "verfahren", label: "Verfahren", breite: "w-[38%]" },
            { key: "bau", label: "Bauauftrag", breite: "w-[26%]" },
            { key: "liefer", label: "Liefer- / Dienstleistung" },
          ]}
          zeilen={TABELLE_KLASSISCH}
        />
        <p className="mt-4 max-w-4xl text-[13px] leading-relaxed text-ink-500">
          Quellen: §§ 43, 44, 46, 47 BVergG 2018 idF BGBl. I Nr. 8/2026; Übersicht der Bundeskammer der ZiviltechnikerInnen (Stand 01.03.2026); EU-Schwellenwerte laut WKO,
          gültig 01.01.2026–31.12.2027. Der Liefer-/Dienstleistungswert für die Direktvergabe folgt dem EU-Schwellenwert für zentrale Auftraggeber (§ 12 Abs. 1 Z 1).
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Fachdetails titel="Für Stadtwerke: Werte für Sektorenauftraggeber" untertitel="Gilt nur für Aufträge im Rahmen der Sektorentätigkeit (z. B. Energie, Wasser, Verkehr)">
            <Tabelle
              dicht
              caption="Schwellenwerte für Sektorenauftraggeber"
              spalten={[
                { key: "verfahren", label: "Verfahren", breite: "w-[44%]" },
                { key: "bau", label: "Bau" },
                { key: "liefer", label: "Liefer / DL" },
              ]}
              zeilen={TABELLE_SEKTOREN}
            />
            <p className="mt-3 text-[13px] text-ink-500">Quelle: WKO, Vergaberecht 2026 im Überblick; EU-Schwellenwert Sektoren laut WKO ab 01.01.2026.</p>
          </Fachdetails>
          <Fachdetails titel="Auftragswert richtig schätzen" untertitel="§ 13 BVergG – bevor ein Verfahren gewählt wird">
            <ul className="space-y-3 text-[15px] leading-relaxed text-ink-700">
              <li>
                <strong className="text-ink-900">Gesamtwert ohne Umsatzsteuer:</strong> alle zum Vorhaben gehörigen Leistungen einschließlich Optionen und vorgesehener
                Vertragsverlängerungen (§ 13 Abs. 1).
              </li>
              <li>
                <strong className="text-ink-900">Sachkundig und vorab:</strong> maßgeblich ist der Zeitpunkt, zu dem das Verfahren eingeleitet wird (§ 13 Abs. 3).
              </li>
              <li>
                <strong className="text-ink-900">Keine Umgehung:</strong> Die Berechnungsmethode darf nicht den Zweck verfolgen, das Vergaberecht zu umgehen (§ 13 Abs. 5).
              </li>
              <li>
                <strong className="text-ink-900">Bau oder Lieferung:</strong> Entscheidend ist der Hauptgegenstand – die Begründung gehört in den Vergabevermerk.
              </li>
            </ul>
          </Fachdetails>
        </div>
      </Section>

      {/* Was ist neu – dunkle Kontrastsektion */}
      <Section tone="navy" space="md" id="neu" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Vergaberechtsgesetz 2026"
            title="Was sich für Gemeinden geändert hat"
            lead="Kundgemacht am 27.02.2026 im BGBl. I Nr. 8/2026, großteils in Kraft seit 01.03.2026."
            className="mb-10"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NEU.map((n, i) => (
              <Reveal as="li" key={n.titel} delay={i * 70} className="flex">
                <div className="ov-glass flex w-full flex-col rounded-3xl p-6">
                  <span className="ov-num font-display text-[13px] font-bold text-ov-300">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-[18px] font-bold leading-snug text-white">{n.titel}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{n.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Ablauf Gemeinderatsbeschluss */}
      <Section tone="white" space="md" id="ablauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ablauf"
          title="Vom Grundsatzbeschluss zur laufenden Anlage"
          lead="Sechs Schritte, in denen Gemeinderat, Amtsleitung, Bauamt und Finanzverwaltung zusammenspielen. Zuständigkeiten und Wertgrenzen regelt die Gemeindeordnung Ihres Bundeslandes."
          className="mb-10"
        />
        <Prozess
          name="Photovoltaik-Projekt der Gemeinde: vom Grundsatzbeschluss zur Anlage"
          beschreibung="Ablauf für Gemeinden in Österreich: Potenzial, Projekt, Auftragswert und Vergabeverfahren, Bedeckung und Förderung, Beschluss, Umsetzung."
          schritte={SCHRITTE.map((s) => ({ ...s, dauer: `Federführung: ${s.dauer}` }))}
        />
      </Section>

      {/* Förderungen */}
      <Section tone="sand" space="md" id="foerderung" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Förderung & Mittel"
            title="Womit Gemeinden PV-Projekte finanzieren"
            lead="Nur Programme mit belegtem Stand. Budgets und Fristen ändern sich – verbindlich sind die Unterlagen der jeweiligen Förderstelle."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Prüfdatum {STAND.label}</StandPille>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FOERDERUNGEN.map((f, i) => (
            <Reveal as="li" key={f.id} delay={(i % 3) * 70} className="flex">
              <article className="ov-card-hover flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{f.traeger}</p>
                <h3 className="mt-2 font-display text-[20px] font-bold leading-snug text-ink-900">{f.titel}</h3>
                <p className={`mt-3 inline-flex self-start rounded-full px-3 py-1 text-[12.5px] font-semibold ring-1 ${f.offen ? "bg-ov-50 text-ov-800 ring-ov-200" : "bg-ink-50 text-ink-600 ring-ink-200"}`}>{f.status}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {f.punkte.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-700">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {f.link.intern ? (
                  <Link href={f.link.href} className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                    {f.link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                ) : (
                  <a href={f.link.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                    {f.link.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(externer Link, neues Fenster)</span>
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
        <Hinweis className="mt-8" titel="Reihenfolge entscheidet">
          Förderanträge haben eigene Fristen: Den EAG-Investitionszuschuss beantragen Sie vor der Inbetriebnahme, bei manchen Programmen der KPC muss der Antrag vor der
          ersten verbindlichen Bestellung liegen. Legen Sie den Förderplan deshalb schon vor dem Gemeinderatsbeschluss fest. Mehr in der{" "}
          <Link href="/forderungen/bundesfoerderung" className={LINK}>
            Übersicht Bundesförderung
          </Link>
          .
        </Hinweis>
      </Section>

      {/* Energiegemeinschaft */}
      <Section tone="white" space="md" id="energiegemeinschaft" className="scroll-mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal dir="left" className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)]">
              <Image
                src="/Images/AT/loesungen-a/gem-schule-flachdach.jpg"
                alt="Photovoltaikanlage auf dem Flachdach einer Schule in Hard am Bodensee mit Bergen im Hintergrund"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-navy-950 p-5 text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-[300px]">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
                <Users aria-hidden="true" className="h-4 w-4" />
                ElWG ab 01.10.2026
              </p>
              <p className="mt-2 font-display text-[28px] font-extrabold leading-none">
                <span className="ov-num">mind. 10 %</span>
              </p>
              <p className="mt-2 text-[13.5px] leading-snug text-white/70">des gemeinsam genutzten Stroms aus Gemeindeanlagen für schutzbedürftige Haushalte</p>
            </div>
          </Reveal>
          <div className="pt-6 lg:pt-0">
            <SectionHeading
              eyebrow="Energiegemeinschaft der Gemeinde"
              title="Strom vom Gemeindedach für Bürger und Betriebe"
              lead="Überschüsse von Schule, Bauhof oder Kläranlage lassen sich in einer Energiegemeinschaft im Ort nutzen – mit neuen Regeln ab 1. Oktober 2026."
            />
            <ul className="mt-8 space-y-5">
              {ENERGIEGEMEINSCHAFT.map((e) => (
                <li key={e.titel} className="flex gap-4">
                  <span aria-hidden="true" className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ov-100 text-ov-700">
                    <Landmark className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block font-display text-[17px] font-bold text-ink-900">{e.titel}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-600">{e.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/energiegemeinschaften" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition hover:bg-ov-700">
                Energiegemeinschaften
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/rechner/energiegemeinschaft" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50">
                Energiegemeinschafts-Rechner
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Bürgerbeteiligung – nur belegte, qualitative Aussagen, keine Schwellenwerte ohne geprüfte Quelle */}
      <Section tone="white" space="md" id="buergerbeteiligung" className="scroll-mt-24">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Bürgerbeteiligung"
            title="Wie Bürgerinnen und Bürger an der Gemeinde-PV teilhaben"
            lead="Zwei Wege: Strom teilen oder Kapital beteiligen. Das Teilen regelt das ElWG, die finanzielle Beteiligung das Bank- und Kapitalmarktrecht – sie gehört vor dem Beschluss rechtlich geprüft."
          />
          <Hinweis ton="warn" titel="Geld von Bürgern ist kein Formular">
            Nimmt eine Gemeinde oder ihre Gesellschaft gewerblich Geld mit unbedingtem Rückzahlungsanspruch an, kann das nach Ansicht der FMA ein konzessionspflichtiges
            Einlagengeschäft sein. Öffentliche Angebote können zudem Prospekt- oder Informationspflichten auslösen. Lassen Sie das Modell von einer Rechtsberatung prüfen.
          </Hinweis>
        </div>
        <Tabelle
          dicht
          caption="Modelle der Bürgerbeteiligung an Photovoltaik der Gemeinde"
          spalten={[
            { key: "modell", label: "Modell", breite: "w-[26%]" },
            { key: "wie", label: "So funktioniert es" },
            { key: "achten", label: "Worauf achten", breite: "w-[34%]" },
          ]}
          zeilen={[
            {
              modell: "Energiegemeinschaft (EEG oder BEG)",
              wie: "Die Gemeinde liefert Überschuss von Schule, Bauhof oder Kläranlage an Haushalte und Betriebe im Ort.",
              achten: "Rechtsträger (z. B. Verein, Genossenschaft), Verträge, Abrechnung; ab 01.10.2026 mind. 10 % für schutzbedürftige Haushalte (§ 68 Abs. 6 ElWG).",
            },
            {
              modell: "Genossenschaft",
              wie: "Bürgerinnen und Bürger zeichnen Anteile; die Genossenschaft errichtet und betreibt die Anlagen.",
              achten: "Gründung, Revisionsverband, Organe – demokratische Mitbestimmung, dafür mehr Verwaltungsaufwand.",
            },
            {
              modell: "Modul-Beteiligung (Sale-and-lease-back)",
              wie: "Bürger kaufen einzelne Module und vermieten sie an den Betreiber zurück; sie erhalten Miete und am Ende den Kaufpreis zurück.",
              achten: "Eigentum am Modul, Laufzeit, Rückkauf und Versicherung klar regeln; kapitalmarktrechtlich prüfen lassen.",
            },
            {
              modell: "Nachrangdarlehen oder Anleihe",
              wie: "Bürger leihen der Projektgesellschaft Geld gegen Verzinsung.",
              achten: "Bankwesen- und Kapitalmarktrecht, Alternativfinanzierungsgesetz (AltFG); Risiko- und Informationspflichten gegenüber Anlegern.",
            },
          ]}
        />
        <p className="mt-4 max-w-4xl text-[13px] leading-relaxed text-ink-500">
          Quellen: Österreichische Koordinationsstelle für Energiegemeinschaften –{" "}
          <a href="https://energiegemeinschaften.gv.at/gemeinsame-energienutzung/" target="_blank" rel="noopener noreferrer" className="underline">
            Modelle der gemeinsamen Energienutzung
          </a>{" "}
          und{" "}
          <a href="https://energiegemeinschaften.gv.at/gebietskoerperschaften-und-schutzbeduerftige-haushalte/" target="_blank" rel="noopener noreferrer" className="underline">
            Gebietskörperschaften und schutzbedürftige Haushalte
          </a>{" "}
          (Abruf 30.09.2026); FMA –{" "}
          <a href="https://www.fma.gv.at/kapitalmaerkte/emittentenaufsicht/aufsicht-ueber-kapitalmarktprospekte/alternativfinanzierungsgesetz/" target="_blank" rel="noopener noreferrer" className="underline">
            Alternativfinanzierungsgesetz
          </a>
          ; Rericha/Wieser,{" "}
          <a href="https://www.wirtschaftsanwaelte.at/burgerbeteiligung-bei-erneuerbarer-energie/" target="_blank" rel="noopener noreferrer" className="underline">
            Bürgerbeteiligung bei erneuerbarer Energie
          </a>{" "}
          (02.04.2013; FMA-Sicht zum Einlagengeschäft, Sale-and-lease-back). Keine Rechtsberatung.
        </p>
      </Section>

      {/* Checkliste Gemeinderat */}
      <Section tone="sand" space="md" id="checkliste" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Checkliste · zum Abhaken"
            title="Unterlagen für den Gemeinderat"
            lead="Was in die Sitzungsvorlage gehört, damit der Beschluss hält und die Förderung nicht an Formalien scheitert. Mit „Liste kopieren“ übernehmen Sie die Punkte in Ihren Amtsvortrag."
          />
          <p className="text-[15px] leading-relaxed text-ink-600">
            Technische Grundlagen wie Dachbewertung, Ertragsprognose, Kostenrahmen und Netzauskunft stellen wir für Ihre Gremien zusammen.{" "}
            <Link href="/termin?art=video&thema=gemeinde" className={LINK}>
              Erstgespräch vereinbaren
            </Link>
            .
          </p>
        </div>
        <GemeinderatCheckliste gruppen={CHECKLISTE} />
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Vergabe und Förderung – kurz beantwortet" lead={`Stand ${STAND.label}. Keine Rechtsberatung.`}>
            <div className="mt-8 space-y-3">
              <Link href="/kommunen" className="group flex items-center justify-between gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 transition hover:bg-white hover:ring-ov-300">
                <span>
                  <span className="block font-display text-[17px] font-bold text-ink-900">Photovoltaik für Gemeinden</span>
                  <span className="mt-0.5 block text-[14px] text-ink-600">Schulen, Bauhöfe, Kläranlagen, Freibäder – zur Übersicht</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/ratgeber/photovoltaik-gemeinde" className="group flex items-center justify-between gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 transition hover:bg-white hover:ring-ov-300">
                <span>
                  <span className="block font-display text-[17px] font-bold text-ink-900">PV auf Gemeindegebäuden</span>
                  <span className="mt-0.5 block text-[14px] text-ink-600">Kläranlage, Schule, Bauhof – wo es sich rechnet</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={QUELLEN}
          hinweis="Orientierung ohne Gewähr, keine Rechts- oder Steuerberatung. Das Rechtsinformationssystem des Bundes (RIS) war am Prüfdatum nicht erreichbar; Gesetzestexte wurden über die RIS-Spiegelung von JUSLINE und die Übersichten von WKO und Bundeskammer der ZiviltechnikerInnen geprüft."
        />
        <p className="mt-6 flex max-w-4xl gap-2 text-[13px] leading-relaxed text-ink-500">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <span>
            Rechtlicher Hinweis: Die Inhalte dienen der allgemeinen Information und stellen keine Rechtsberatung dar. Für Zuständigkeiten und Wertgrenzen nach der
            Gemeindeordnung, das Haushaltsrecht und die umsatzsteuerliche Behandlung wenden Sie sich an Ihre Landesverwaltung, den Gemeindebund bzw. Ihre Rechts- und
            Steuerberatung.
          </span>
        </p>
      </Section>

      <CtaBand
        eyebrow="Für Gemeinden, Verbände & Stadtwerke"
        title="Unterlagen für Gemeinderat und Förderung – von uns vorbereitet."
        text="Wir bewerten Ihre Liegenschaften, liefern Ertragsprognose, Kostenrahmen und technische Mindestanforderungen und klären den Netzanschluss – als Grundlage für Beschluss, Vergabe und Förderantrag."
        primary={{ label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gemeinde" }}
        secondary={{ label: "Liegenschaften bewerten lassen", href: "/angebot?objekt=gemeinde", icon: CalendarCheck2 }}
      />

      <Bildnachweis items={nachweise("gemeindeamt", "schuleDach")} />
    </div>
  );
}
