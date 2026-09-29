// src/app/pv-award/page.js
//
// Ökovolt PV Award – jährlicher Preis für die besten Anlagen und
// Nachhaltigkeitsinvestitionen unserer Kundinnen und Kunden.
// Inhalte: src/components/Award/awardDaten.js · Formular → /api/award
// Event-Schema nur, wenn TERMINE.fix (Datum und Ort feststehen).
//
// Gala-Ästhetik: dunkler Hero mit animierter Trophäe und Gold-Akzenten
// (sun-*), Kategorien als edle Karten, Gewichtungsband, Zeitstrahl,
// mehrstufige Einreichung.

import Image from "next/image";
import { CalendarClock, ChevronDown, Clapperboard, FileCheck2, ListChecks, Scale, Send, Sparkles, Trophy } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import { iconFor } from "@/components/ui/icons";
import Querverweise from "@/components/Reusable/Querverweise";
import Trophaee from "@/components/Award/Trophaee";
import AwardKriterien from "@/components/Award/AwardKriterien";
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

const GOLD = "bg-gradient-to-r from-sun-300 via-sun-400 to-sun-500 bg-clip-text text-transparent";

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

  const [erste, ...weitere] = KATEGORIEN;
  const ErsteIcon = iconFor(erste.icon);
  const zeitIcons = [Send, FileCheck2, Scale, Trophy];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }) }} />

      {/* ---------- Gala-Hero ---------- */}
      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute left-1/2 top-[-20%] -z-10 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,197,61,0.22),transparent_62%)] lg:left-[72%]" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-sun-400/60 to-transparent" />
        <div className="ov-container grid items-center gap-10 pb-16 pt-8 md:pb-24 md:pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
          <div>
            <Breadcrumbs dark items={[{ name: "Über uns", href: "/uber-uns" }, { name: AWARD_NAME }]} className="ov-hero-in mb-10" />
            <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
              <p className="inline-flex items-center gap-2 rounded-full bg-sun-400/10 px-3.5 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-sun-300 ring-1 ring-sun-400/30">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                {AWARD_NAME} {AWARD_JAHR}
              </p>
            </div>
            <h1 className="ov-h1 ov-hero-in mt-6" style={{ "--ov-delay": "120ms" }}>
              Ausgezeichnete Anlagen. <span className={GOLD}>Ausgezeichnete Betriebe.</span>
            </h1>
            <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/75" style={{ "--ov-delay": "200ms" }}>
              Mit dem {AWARD_NAME} zeichnen wir jedes Jahr die besten Photovoltaikanlagen und Nachhaltigkeitsinvestitionen unserer Kundinnen und Kunden in Österreich aus – bewertet von einer Fachjury aus Technik, Wirtschaft und Nachhaltigkeit.
            </p>
            <div className="ov-hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--ov-delay": "280ms" }}>
              <Button href="#einreichen" variant="sun" size="lg" pfeil>
                Projekt einreichen
              </Button>
              <Button href="#kategorien" variant="outlineLight" size="lg" icon={ListChecks}>
                Kategorien & Kriterien
              </Button>
            </div>
            <dl className="ov-hero-in mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-8" style={{ "--ov-delay": "360ms" }}>
              {[
                { v: KATEGORIEN.length, l: "Kategorien" },
                { v: KRITERIEN.length, l: "Kriterien" },
                { v: 0, l: "Teilnahme", s: " €" },
              ].map((k) => (
                <div key={k.l}>
                  <dt className="sr-only">{k.l}</dt>
                  <dd className={`font-display text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] font-extrabold leading-none ${GOLD}`}>
                    <CountUp value={k.v} suffix={k.s || ""} />
                  </dd>
                  <dd className="mt-2 text-[13px] leading-snug text-white/60">{k.l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ov-hero-in relative" style={{ "--ov-delay": "200ms" }}>
            <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[4%] h-10 rounded-[100%] bg-sun-400/25 blur-2xl" />
            <div className="motion-safe:animate-ov-float">
              <Trophaee jahr={AWARD_JAHR} animiert className="max-w-[280px] md:max-w-[340px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Der Preis ---------- */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Der Preis"
          title="Wofür der Ökovolt PV Award steht"
          text={[
            `Der ${AWARD_NAME} ist ein jährlicher Preis für Photovoltaikanlagen, die mehr leisten als Kilowattstunden: Sie senken Kosten, sparen CO₂, verbinden Sektoren, fügen sich in Gebäude und Landschaft ein – und zeigen anderen, dass es geht.`,
            "Ausgezeichnet werden nicht wir, sondern die Unternehmen, Höfe, Gemeinden, Hotels und Energiegemeinschaften, die investiert haben. Preisträger erhalten die Award-Trophäe und eine Urkunde; auf Wunsch stellen wir ihr Projekt auf oekovolt.com vor.",
          ]}
          points={[
            { title: "Kostenlos", text: "und unabhängig von künftigen Aufträgen" },
            { title: "Für Kundinnen und Kunden", text: "mit Anlage in Österreich" },
          ]}
          image={{ src: "/Images/Referenzen/Projekte-1.jpg", alt: "Photovoltaikmodule im goldenen Abendlicht, dahinter Windräder" }}
          reverse
        />
      </Section>

      {/* ---------- Kategorien ---------- */}
      <section id="kategorien" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-20 text-white md:py-32">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-sun-400/12 blur-[140px]" />
        <div className="ov-container relative">
          <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <SectionHeading
              dark
              eyebrow="Kategorien"
              title={<>{KATEGORIEN.length} Kategorien für <span className={GOLD}>ganz Österreich</span></>}
            />
            <p className="text-[16px] leading-relaxed text-white/65">
              Jede Anlage tritt in genau einer Kategorie an. Welche passt, entscheiden Sie bei der Einreichung – die Jury kann ein Projekt in eine passendere Kategorie verschieben.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <Reveal as="li" className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <article className="group relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.75rem] p-7 ring-1 ring-sun-400/40">
                <Image src="/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg" alt="Photovoltaikanlage auf einem Gewerbebau mit Bergkulisse" fill sizes="(max-width: 1024px) 100vw, 25vw" className="-z-20 object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/20" />
                <span className="ov-num font-display text-[13px] font-bold text-sun-300">01</span>
                <span className="mt-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sun-300 to-sun-500 text-navy-950 shadow-[0_10px_30px_-10px_rgba(255,197,61,0.8)]">
                  {ErsteIcon && <ErsteIcon aria-hidden="true" className="h-6 w-6" />}
                </span>
                <h3 className="mt-5 font-display text-[22px] font-extrabold leading-tight">{erste.titel}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{erste.text}</p>
              </article>
            </Reveal>
            {weitere.map((k, i) => {
              const Icon = iconFor(k.icon);
              return (
                <Reveal as="li" key={k.id} delay={((i % 3) + 1) * 80}>
                  <article className="group relative flex h-full flex-col rounded-[1.75rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:ring-sun-400/50 hover:shadow-[0_24px_60px_-30px_rgba(255,197,61,0.45)]">
                    <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sun-300/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun-400/10 text-sun-300 ring-1 ring-sun-400/30 transition-colors duration-300 group-hover:bg-sun-400 group-hover:text-navy-950">
                        {Icon && <Icon aria-hidden="true" className="h-5 w-5" />}
                      </span>
                      <span className="ov-num font-display text-[13px] font-bold text-white/35">{String(i + 2).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-5 font-display text-[17.5px] font-bold leading-snug">{k.titel}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/60">{k.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Kriterien ---------- */}
      <Section tone="white" space="lg" id="kriterien" className="scroll-mt-20">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Kriterien & Gewichtung" title="Bewertet wird, was eine Anlage wirklich leistet" />
          <div className="space-y-3 text-[15.5px] leading-relaxed text-ink-600">
            <p>Die Jury bewertet jede nominierte Anlage nach sechs Kriterien. Die Gewichtung ist ein Vorschlag und wird mit den Teilnahmebedingungen verbindlich veröffentlicht.</p>
            <p className="flex items-start gap-2 text-[14.5px]">
              <Scale aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              Kennzahlen wie Leistung, Ertrag und Eigenverbrauch prüfen wir – mit Ihrer Zustimmung – anhand der Monitoring-Daten.
            </p>
          </div>
        </div>
        <AwardKriterien />
      </Section>

      {/* ---------- Zeitstrahl & Jury ---------- */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Zeitplan"
          title={`So läuft der ${AWARD_NAME} ab`}
          lead={TERMINE.fix ? undefined : `Die Termine für ${AWARD_JAHR} werden hier veröffentlicht. Einreichungen nehmen wir schon jetzt entgegen.`}
          align="center"
          className="mb-14"
        />
        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-sun-400 via-sun-300 to-ov-400 md:left-[12%] md:right-[12%] md:top-[27px] md:h-px md:w-auto md:bg-gradient-to-r" />
          {ZEITPLAN.map((z, i) => {
            const Icon = zeitIcons[i];
            const letzte = i === ZEITPLAN.length - 1;
            return (
              <Reveal as="li" key={z.titel} delay={i * 120} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                <span
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-8 ring-sand-50 ${
                    letzte ? "bg-gradient-to-br from-sun-300 to-sun-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(245,167,15,0.7)]" : "bg-navy-950 text-sun-300"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <p className="ov-num text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Phase {i + 1}</p>
                  <h3 className="mt-1 font-display text-[19px] font-bold text-ink-900">{z.titel}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{z.text}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12.5px] font-semibold text-ink-600 ring-1 ring-ink-200">
                    <CalendarClock aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
                    {i === 0 ? "ab sofort möglich" : TERMINE.fix ? "Termin siehe oben" : "Termin folgt"}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="Jury"
            title="Eine Fachjury aus Technik, Wirtschaft und Nachhaltigkeit"
            lead="Die Jury besteht aus Fachleuten, die nicht an den eingereichten Projekten beteiligt waren. Die Besetzung veröffentlichen wir gemeinsam mit den Terminen."
          />
          <ul className="grid gap-3 sm:grid-cols-3">
            {JURY.map((j, i) => {
              const Icon = iconFor(j.icon);
              return (
                <Reveal as="li" key={j.titel} delay={i * 90} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950 text-sun-300">{Icon && <Icon aria-hidden="true" className="h-5 w-5" />}</span>
                  <h3 className="mt-4 font-display text-[17px] font-bold text-ink-900">{j.titel}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{j.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ---------- Einreichung ---------- */}
      <section id="einreichen" className="relative scroll-mt-20 overflow-clip bg-navy-950 py-20 md:py-32">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-sun-400/12 blur-[140px]" />
        <div aria-hidden="true" className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-ov-500/15 blur-[140px]" />
        <div className="ov-container relative grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="text-white lg:sticky lg:top-28 lg:self-start">
            <Eyebrow dark>Einreichung</Eyebrow>
            <h2 className="ov-h2 mt-4">
              Ihr Projekt <span className={GOLD}>auf die Bühne</span>
            </h2>
            <p className="ov-lead mt-5 text-white/70">Vier kurze Schritte, rund zehn Minuten: Kategorie, Projekt, Kennzahlen, Ansprechperson. Fotos teilen Sie per Link zu einem Cloud-Ordner.</p>
            <ul className="mt-8 space-y-3 text-[15px] text-white/75">
              {["Fotos oder Drohnenaufnahmen der Anlage im Betrieb", "Jahresertrag und Eigenverbrauch aus dem Monitoring", "Ein Satz, warum Sie investiert haben", "Was sich seitdem verändert hat – Kosten, CO₂, Abläufe"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[14.5px] leading-relaxed text-white/60">
              Fragen zur Einreichung?{" "}
              <a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(AWARD_NAME)}`} className="font-semibold text-sun-300 underline decoration-sun-300/40 underline-offset-4 hover:text-white">
                {FIRMA.email}
              </a>{" "}
              oder{" "}
              <a href={FIRMA.telefonHref} className="font-semibold text-sun-300 underline decoration-sun-300/40 underline-offset-4 hover:text-white">
                {FIRMA.telefon}
              </a>
            </p>
          </div>
          <Reveal dir="scale" className="relative rounded-[2rem] bg-white p-5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] ring-1 ring-sun-300/40 sm:p-7 md:p-9">
            <AwardEinreichung />
          </Reveal>
        </div>
      </section>

      {/* ---------- Teilnahme & Sichtbarkeit ---------- */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Teilnahmebedingungen" title="Wer mitmachen kann – und was gilt" lead="Kurzfassung der Teilnahmebedingungen. Die vollständige Fassung veröffentlichen wir mit den Terminen." />
            <details className="group mt-8 rounded-3xl bg-sand-50 ring-1 ring-ink-200/60 open:bg-white open:shadow-lg">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[16.5px] font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                Alle {TEILNAHME.length} Punkte anzeigen
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-200 transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown aria-hidden="true" className="h-4 w-4" />
                </span>
              </summary>
              <ol className="space-y-3 border-t border-ink-100 px-6 pb-6 pt-4">
                {TEILNAHME.map((t, i) => (
                  <li key={t} className="flex gap-3.5">
                    <span className="ov-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-[13px] font-bold text-sun-300">{i + 1}</span>
                    <span className="text-[15px] leading-relaxed text-ink-700">{t}</span>
                  </li>
                ))}
              </ol>
            </details>
          </div>
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-ov-50 p-7 ring-1 ring-ov-200 md:p-10">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-200/60 blur-3xl" />
            <p className="relative text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Mehr Sichtbarkeit</p>
            <h2 className="relative mt-3 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight text-ink-900">Aus Ihrer Anlage eine Geschichte machen</h2>
            <p className="relative mt-4 text-[15.5px] leading-relaxed text-ink-600">
              Ob Preisträger oder nicht: Eine gute Anlage verdient ein Publikum. Mit der {SOLENSA.name} produzieren wir Videos zur PV-Anlage und Nachhaltigkeits-Imagespots für Unternehmen – für Website, Social Media, Recruiting und Nachhaltigkeitsbericht.
            </p>
            <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/service/nachhaltigkeitsmarketing" pfeil>
                Nachhaltigkeitsmarketing
              </Button>
              <Button href={SOLENSA.web} variant="secondary" icon={Clapperboard}>
                {SOLENSA.name}
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
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
