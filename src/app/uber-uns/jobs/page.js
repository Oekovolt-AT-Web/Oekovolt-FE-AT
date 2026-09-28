// uber-uns/jobs/page.js
//
// Stellen der Ökovolt Solartechnik GmbH (Österreich). Quelle: src/data/stellen.js.
// Die früher angebundenen Backoffice-Endpunkte (oekovoltdeutchland … jobsde_data)
// liefern die Stellen der deutschen Gesellschaft und werden auf oekovolt.com
// bewusst NICHT mehr gelesen.

import {
  Briefcase, CalendarCheck, ClipboardList, Compass, GraduationCap, HardHat, Leaf, Mail, MessagesSquare, MonitorDot, Rocket, Scale, Send, ShieldCheck,
  TrendingUp, Users, Zap,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import JobsListe from "@/components/Jobs/JobsListe";
import { alleStellen, bewerbungsLink, euro } from "@/components/Jobs/jobDaten";
import { KV, LEHRLINGSEINKOMMEN } from "@/data/stellen";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const JOBS_PAGE_URL = `${BASE_URL}/uber-uns/jobs`;
const TITEL = "Jobs Photovoltaik Österreich – Karriere | Ökovolt";
const BESCHREIBUNG =
  "Jobs bei Ökovolt in Ostermiething: Projektleitung, Elektrotechnik, Netzanschluss, SCADA, Service, Vertrieb und Lehre Elektrotechnik – mit KV-Mindestentgelt je Stelle.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Photovoltaik Jobs Österreich", "Elektrotechniker Job Oberösterreich", "PV Monteur Job", "Lehre Elektrotechnik Innviertel", "Ökovolt Karriere"],
  alternates: { canonical: JOBS_PAGE_URL, languages: hreflangLanguages(JOBS_PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: JOBS_PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Jobs bei Ökovolt Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}/og-image.jpg`] },
};

const VORTEILE = [
  { icon: Leaf, title: "Sinnvolle Arbeit", text: "Jede Anlage, die Sie mitbauen, erzeugt über Jahrzehnte erneuerbaren Strom für Betriebe, Höfe und Gemeinden." },
  { icon: GraduationCap, title: "Weiterbildung", text: "Herstellerschulungen, Prüf- und Messtechnik, Netzanschluss und Leittechnik – wir investieren in Ihr Know-how." },
  { icon: Zap, title: "Eigene Technik", text: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung: Sie arbeiten nicht nur mit Fremdsystemen." },
  { icon: TrendingUp, title: "Perspektive", text: "Photovoltaik, Speicher und Netzintegration wachsen – und mit ihnen die Aufgaben im Team." },
];

const FELDER = [
  { icon: Compass, title: "Projekt & Planung", text: "Projektleitung und Elektroplanung für Dach- und Freiflächenanlagen – vom Belegungsplan bis zur Übergabe." },
  { icon: ClipboardList, title: "Netzanschluss", text: "Netzzugang, TOR Erzeuger, Parkregler und Inbetriebnahme mit dem Netzbetreiber." },
  { icon: MonitorDot, title: "Leittechnik", text: "SCADA, Fernwartung und Monitoring – gemeinsam mit der Solensa GmbH für IT-Sicherheit." },
  { icon: HardHat, title: "Montage & Service", text: "Elektro- und Mechanikmontage, Wartung, Prüfung und Drohnen-Thermografie in ganz Österreich." },
  { icon: Briefcase, title: "Vertrieb & Beratung", text: "Key Account Gewerbe und Energieberatung für Betriebe, Landwirtschaft und Gemeinden." },
  { icon: GraduationCap, title: "Lehre", text: "Lehrberuf Elektrotechnik – mit Photovoltaik und Speichern von Anfang an." },
];

const ABLAUF = [
  { icon: Send, title: "Bewerbung senden", text: `Lebenslauf und ein paar Sätze zu Ihnen per E-Mail an ${FIRMA.email} – ein aufwendiges Anschreiben ist nicht nötig.` },
  { icon: MessagesSquare, title: "Erstes Gespräch", text: "Wir melden uns bei Ihnen und lernen uns am Telefon oder persönlich kennen." },
  { icon: Users, title: "Kennenlernen", text: "Sie lernen Team und Aufgaben kennen und stellen all Ihre Fragen – gern bei uns in Ostermiething." },
  { icon: Rocket, title: "Start im Team", text: "Einarbeitung im Team und Schulungen, damit Sie gut in Ihre neue Aufgabe starten." },
];

const lehrlingText = LEHRLINGSEINKOMMEN.map((l) => `${l.lehrjahr}. Lehrjahr € ${euro(l.betrag)}`).join(", ");

const FAQ = [
  {
    q: "Welcher Kollektivvertrag gilt bei Ökovolt?",
    a: `Die ${FIRMA.name} ist Mitglied der Landesinnung der Elektro-, Gebäude-, Alarm- und Kommunikationstechniker. Für Arbeiter:innen gilt deshalb der ${KV.arbeiter.name}, für Angestellte der ${KV.angestellte.name}. Das jeweilige Mindestentgelt steht in jeder Stellenanzeige.`,
  },
  {
    q: "Warum steht in jeder Anzeige ein Mindestgehalt?",
    a: "Das Gleichbehandlungsgesetz (§ 9 Abs 2 GlBG) verlangt in Österreich, dass Stellenanzeigen das kollektivvertragliche Mindestentgelt nennen und angeben, ob eine Überzahlung möglich ist. Das tatsächliche Gehalt vereinbaren wir je nach Qualifikation und Erfahrung – die Bereitschaft zur Überzahlung ist gegeben.",
  },
  {
    q: "Wie hoch ist das Lehrlingseinkommen in der Elektrotechnik?",
    a: `Laut Kollektivvertrag (Stand 1.1.2026) beträgt das Lehrlingseinkommen brutto pro Monat: ${lehrlingText}.`,
  },
  {
    q: "Wo arbeite ich bei Ökovolt?",
    a: `Unser Firmensitz ist in ${FIRMA.plz} ${FIRMA.ort} im Innviertel, nahe Salzburg. Montage- und Serviceteams sind in ganz Österreich im Einsatz; Tag- und Nächtigungsgeld richten sich nach dem Kollektivvertrag.`,
  },
  {
    q: "Kann ich mich auch ohne ausgeschriebene Stelle bewerben?",
    a: `Ja. Wir freuen uns jederzeit über Initiativbewerbungen an ${FIRMA.email}. Schreiben Sie kurz, welcher Bereich Sie interessiert – Planung, Montage, Netzanschluss, Leittechnik, Service oder Vertrieb.`,
  },
];

export default function JobsPage() {
  const jobs = alleStellen([]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${JOBS_PAGE_URL}/#webpage`,
        url: JOBS_PAGE_URL,
        name: TITEL,
        description: BESCHREIBUNG,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${JOBS_PAGE_URL}/#joblist`,
        name: `Stellenangebote der ${FIRMA.name}`,
        numberOfItems: jobs.length,
        itemListElement: jobs.map((job, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${JOBS_PAGE_URL}/${job.slug}`,
          name: job.titel,
        })),
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: "Jobs" }]}
        eyebrow="Karriere bei Ökovolt Österreich"
        title={<>Jobs mit Zukunft: Machen Sie die <span className="ov-text-gradient-light">Energiewende</span> zum Beruf</>}
        lead="Wir bauen Photovoltaikanlagen für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich – mit eigener Leittechnik. Dafür suchen wir Projektleitung, Elektrotechnik, Netzanschluss, SCADA, Service, Vertrieb und Lehrlinge."
        image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Techniker montieren Solarmodule auf einem Dach, Luftaufnahme" }}
        points={[`${jobs.length} offene Stellen`, "Firmensitz Ostermiething", "KV-Mindestentgelt in jeder Anzeige", "Lehre Elektrotechnik"]}
        actions={[
          { label: "Offene Stellen ansehen", href: "#stellen" },
          { label: "Initiativ bewerben", href: bewerbungsLink(), icon: Mail },
        ]}
      />

      {/* Stellen */}
      <Section tone="sand" space="lg" id="stellen" className="scroll-mt-20">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Offene Stellen"
            title={<>Ihr nächster Job – <span className="ov-text-gradient">mit Sinn</span></>}
            lead="Alle aktuellen Stellenangebote der Ökovolt Solartechnik GmbH. Ein Klick zeigt Aufgaben, Anforderungen, Kollektivvertrag und Mindestentgelt."
          />
          <p className="hidden text-[15px] leading-relaxed text-ink-600 lg:block lg:pb-1">
            Arbeitsort ist Ostermiething oder – bei Montage und Service – ganz Österreich mit Start ab Ostermiething.
          </p>
        </div>
        <JobsListe jobs={jobs} />
      </Section>

      {/* Vorteile */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Warum Ökovolt"
              title={<>Ihre Vorteile <span className="ov-text-gradient-light">bei Ökovolt</span></>}
              lead="Ein Errichter mit eigener Technik, kurzen Wegen und Projekten in ganz Österreich."
            />
            <Reveal className="mt-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-8">
              {[
                { w: "2012", l: "in Österreich gegründet" },
                { w: "30 MWp", l: "allein 2021 errichtet" },
                { w: "9", l: "Bundesländer im Einsatzgebiet" },
              ].map((k) => (
                <div key={k.l}>
                  <p className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-extrabold leading-none text-white">{k.w}</p>
                  <p className="mt-2 text-[13px] leading-snug text-white/60">{k.l}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <FeatureGrid items={VORTEILE} cols={2} tone="dark" />
        </div>
      </Section>

      {/* Tätigkeitsfelder */}
      <Section tone="white" space="lg">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading eyebrow="Tätigkeitsfelder" title="Sechs Wege in die Photovoltaik" />
          <div className="flex items-start gap-4 rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200 lg:mb-1">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[15px] leading-relaxed text-ink-700">
              <strong className="text-ink-900">Quereinstieg möglich:</strong> Wer in Elektrotechnik, Metall, Bau oder Automatisierung zu Hause ist, lernt die PV-spezifischen Themen bei uns schnell.
            </p>
          </div>
        </div>
        <FeatureGrid items={FELDER} cols={3} />
      </Section>

      {/* Entgelt & Kollektivvertrag */}
      <Section tone="green" space="lg">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Entgelt"
            title="Kollektivvertrag und Mindestentgelt – transparent je Stelle"
            lead="Für Ökovolt gelten die Kollektivverträge des Elektro- und Metallgewerbes. Jede Anzeige nennt Einstufung und kollektivvertragliches Mindestentgelt nach § 9 Abs 2 GlBG; die Bereitschaft zur Überzahlung ist gegeben."
          />
          <Reveal className="grid gap-4 sm:grid-cols-2">
            {[KV.arbeiter, KV.angestellte].map((k) => (
              <a
                key={k.link}
                href={k.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group ov-card-hover flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ov-200 hover:ring-ov-400"
              >
                <Scale aria-hidden="true" className="h-6 w-6 text-ov-600" />
                <p className="mt-4 font-display text-[17px] font-bold text-ink-900">{k.kurz}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{k.name}</p>
                <p className="mt-auto pt-4 text-[14px] font-semibold text-ov-700 group-hover:text-ov-800">Lohn- bzw. Gehaltstabelle bei der WKO</p>
              </a>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Bewerbungsprozess */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Bewerbung"
          title={<>In vier Schritten <span className="ov-text-gradient">ins Team</span></>}
          lead="Unkompliziert und persönlich – so läuft Ihre Bewerbung bei Ökovolt ab."
          align="center"
          className="mb-14"
        />
        <Steps items={ABLAUF} />
        <Reveal className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={bewerbungsLink()} className="inline-flex h-14 items-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-700">
            <Mail aria-hidden="true" className="h-5 w-5" />
            Bewerbung per E-Mail senden
          </a>
          <a href={FIRMA.telefonHref} className="inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-8 text-[16px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50">
            <CalendarCheck aria-hidden="true" className="h-5 w-5 text-ov-600" />
            Vorab Fragen klären
          </a>
        </Reveal>
      </Section>

      {/* Branche */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Beruf & Perspektiven"
          title="Arbeiten, wo die Energiewende gebaut wird"
          text={[
            "Das Erneuerbaren-Ausbau-Gesetz sieht bis 2030 einen Zubau von 11 TWh Strom aus Photovoltaik vor (§ 4 Abs 4 EAG). Damit neue Anlagen ins Netz dürfen, braucht es Menschen, die sie sauber planen, anschließen, regeln und über Jahrzehnte betreuen.",
            "Bei Ökovolt arbeiten Sie an Gewerbedächern, Freiflächen- und Agri-PV-Anlagen und Gemeindeprojekten – und an der Technik, die diese Anlagen steuerbar macht.",
          ]}
          points={["Projekte in allen neun Bundesländern", "Eigene Parkregler, Fernwartung und SCADA", "Kurze Wege zwischen Planung, Montage und Service"]}
          image={{ src: "/Images/Jobs/jobs1.jpg", alt: "Mitarbeiter installieren eine Photovoltaikanlage" }}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Karriere bei Ökovolt"
            lead={<>Noch etwas unklar? Schreiben Sie uns an <a href={bewerbungsLink()} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">{FIRMA.email}</a> oder rufen Sie an: <a href={FIRMA.telefonHref} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">{FIRMA.telefon}</a>.</>}
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/uber-uns/jobs" />
      <CtaBand
        eyebrow="Werden Sie Teil des Teams"
        title="Gestalten Sie die Energiewende mit – von Ostermiething aus."
        text="Senden Sie uns Ihren Lebenslauf und ein paar Sätze zu Ihnen. Wir melden uns persönlich bei Ihnen."
        primary={{ label: "Jetzt bewerben", href: bewerbungsLink() }}
        secondary={{ label: "Elektro-Partner werden", href: "/partner", icon: Briefcase }}
      />
    </div>
  );
}
