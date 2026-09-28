// src/app/forderungen/steuerlich/page.js
//
// Steuerrecht Photovoltaik Österreich: IFB, Gewinnfreibetrag, AfA, USt,
// Elektrizitätsabgabe, Land- und Forstwirtschaft, Kleinunternehmer, Private.

import Link from "next/link";
import { Building2, Calculator, ClipboardCheck, FileText, Landmark, Percent, Receipt, Sun, Tractor } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SteuerCheck from "@/components/Forderungen/Steuerlich/SteuerCheck";
import { Checkliste, Hinweis, HowTo, Kennzahlen, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { ENERGIEGEMEINSCHAFTEN, STAND, STEUER } from "@/components/Forderungen/Shared/bund";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/steuerlich`;
const TITLE = "Photovoltaik & Steuer 2026: IFB 22 %, AfA, USt | Ökovolt";
const DESCRIPTION = "PV und Steuer in Österreich 2026: Investitionsfreibetrag 22 %, AfA 20 Jahre, Elektrizitätsabgabe, Umsatzsteuer, Landwirtschaft und Private – mit IFB-Rechner.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Investitionsfreibetrag Photovoltaik", "IFB 22 Prozent", "Photovoltaik Steuer Österreich", "PV Abschreibung Nutzungsdauer", "Elektrizitätsabgabe Eigenverbrauch", "Umsatzsteuer Photovoltaik 2026", "Photovoltaik Landwirtschaft Steuer"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Steuerliche Vorteile für Photovoltaik in Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const UEBERSICHT = [
  { art: "Investitionsfreibetrag (IFB)", regel: <><strong className="text-ov-700">22 %</strong> für PV, Speicher, Ladestationen (Öko); sonst 20 %</>, grenze: `Anschaffung ${STEUER.ifb.zeitraum}; max. 1 Mio. € Bemessungsgrundlage je Wirtschaftsjahr; ab 2027 wieder 15 % bzw. 10 %`, norm: "§ 11 EStG; § 124b Z 480 EStG; Öko-IFB-VO BGBl. II Nr. 155/2023", fuer: "Unternehmen, Landwirtschaft mit Gewinnermittlung" },
  { art: "Gewinnfreibetrag", regel: "Grundfreibetrag 15 % des Gewinns bis 33.000 €", grenze: "investitionsbedingt 13 % über 33.000 €; insgesamt max. 46.400 €; nicht zusätzlich zum IFB für dasselbe Wirtschaftsgut", norm: "§ 10 EStG", fuer: "natürliche Personen mit betrieblichen Einkünften" },
  { art: "Abschreibung (AfA)", regel: "Nutzungsdauer 20 Jahre linear oder degressiv mit max. 30 %", grenze: "Halbjahres-AfA bei Inbetriebnahme im 2. Halbjahr", norm: "§ 7 EStG; EStR 2000; PV-Erlass 30.07.2025", fuer: "alle betrieblichen Anlagen" },
  { art: "Umsatzsteuer", regel: <><strong className="text-ov-700">20 %</strong> – Vorsteuerabzug für Unternehmer</>, grenze: "0-%-Satz für PV bis 35 kWp endete mit 31.03.2025", norm: "§ 10 UStG; § 28 Abs. 62 UStG (ausgelaufen)", fuer: "alle Käufer; Vorsteuerabzug nur für Unternehmer" },
  { art: "Elektrizitätsabgabe", regel: <><strong className="text-ov-700">befreit</strong> für selbst erzeugten und verbrauchten Ökostrom</>, grenze: "ohne Mengengrenze; Anzeige beim Finanzamt; Einspeisung nicht steuerbar", norm: "§ 2 Abs. 1 Z 4 ElAbgG; ElAbg-ESBV", fuer: "alle Betreiber, auch EEG-Mitglieder" },
  { art: "Einkommensteuer Private", regel: "Einspeiseerlöse steuerfrei bis 12.500 kWh je Person und Jahr", grenze: "Anlage max. 35 kWp Engpass- und 25 kW Anschlussleistung", norm: "§ 3 Abs. 1 Z 39 EStG", fuer: "Private ohne Betriebszuordnung" },
  { art: "Kleinunternehmer", regel: "USt-befreit bis 55.000 € Bruttoumsatz", grenze: "10 % Toleranz; Einspeisung an Energieversorger im Reverse Charge", norm: "§ 6 Abs. 1 Z 27 UStG; § 19 Abs. 1d UStG", fuer: "kleine Betreiber, Vereine" },
];

const FAQ = [
  {
    q: "Wie hoch ist der Investitionsfreibetrag für Photovoltaik 2026?",
    a: `Für PV-Anlagen, Stromspeicher und E-Ladestationen beträgt der Investitionsfreibetrag 22 %, wenn sie zwischen 01.11.2025 und 31.12.2026 angeschafft oder hergestellt werden. Danach gilt wieder der reguläre Öko-Satz von 15 %. Bemessungsgrundlage sind die Anschaffungskosten bis 1 Mio. € je Wirtschaftsjahr; der IFB wird zusätzlich zur Abschreibung als Betriebsausgabe abgezogen (${STEUER.ifb.norm}).`,
  },
  {
    q: "Gilt 2026 noch der 0-%-Umsatzsteuersatz für PV-Anlagen?",
    a: "Nein. Der Nullsteuersatz für PV-Module bis 35 kWp (§ 28 Abs. 62 UStG) wurde mit dem Budgetsanierungsmaßnahmengesetz 2025 beendet und galt nur bis 31.03.2025 – für Verträge bis 06.03.2025 bei Lieferung bis 31.12.2025. 2026 fallen 20 % Umsatzsteuer an. Unternehmer holen sie sich als Vorsteuer zurück.",
  },
  {
    q: "Wie lange wird eine PV-Anlage abgeschrieben?",
    a: "Die Finanzverwaltung setzt für Photovoltaikanlagen eine Nutzungsdauer von 20 Jahren an, also 5 % linear pro Jahr. Alternativ ist die degressive AfA mit bis zu 30 % vom Restbuchwert zulässig. Bei Inbetriebnahme im zweiten Halbjahr steht im ersten Jahr nur die halbe AfA zu.",
  },
  {
    q: "Muss ich für selbst verbrauchten Solarstrom Elektrizitätsabgabe zahlen?",
    a: "Nein. Selbst erzeugter und selbst verbrauchter Strom aus erneuerbaren Quellen ist nach § 2 Abs. 1 Z 4 ElAbgG ohne Mengengrenze befreit – auch Strom, der innerhalb einer Erneuerbare-Energie-Gemeinschaft verbraucht wird. Voraussetzung sind eine Anzeige beim Finanzamt und Aufzeichnungen über Erzeugung und Verbrauch.",
  },
  {
    q: "Wie wird eine PV-Anlage in der Land- und Forstwirtschaft besteuert?",
    a: "Eine Volleinspeise-Anlage ist immer ein eigener Gewerbebetrieb. Bei Überschusseinspeisung liegt ein land- und forstwirtschaftlicher Nebenbetrieb vor, wenn mehr Strom im Betrieb verbraucht wird als privat verbraucht und eingespeist zusammen – sonst ebenfalls ein Gewerbebetrieb. Pauschalierte Betriebe versteuern die Einspeisung umsatzsteuerlich mit 13 %. Bei pauschaler Gewinnermittlung steht kein Investitionsfreibetrag zu.",
  },
  {
    q: "Sind Einspeiseerlöse für Private steuerfrei?",
    a: "Ja, bis 12.500 kWh eingespeisten Stroms je Person und Jahr, wenn die Anlage höchstens 35 kWp Engpass- und 25 kW Anschlussleistung hat (§ 3 Abs. 1 Z 39 EStG). Darüber ist nur der übersteigende Teil steuerpflichtig.",
  },
  {
    q: "Kürzt der EAG-Investitionszuschuss die Abschreibung?",
    a: "Steuerfreie Zuschüsse aus öffentlichen Mitteln kürzen grundsätzlich die Anschaffungskosten – damit sinken AfA und Bemessungsgrundlage des IFB entsprechend. Die genaue Behandlung Ihres Falls stimmen Sie mit Ihrer Steuerberatung ab; unser IFB-Rechner berücksichtigt den Zuschuss bereits.",
  },
];

export default function Steuerlich() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Photovoltaik und Steuer in Österreich 2026",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Steuerliche Vorteile" }]}
        eyebrow={`Photovoltaik & Steuer · Rechtsstand ${STAND.kurz}`}
        title={<>Photovoltaik und Steuer: <span className="ov-text-gradient">22 % Investitionsfreibetrag</span> bis Jahresende</>}
        lead="Für Unternehmen ist 2026 steuerlich ein Ausnahmejahr: Der Investitionsfreibetrag für PV, Speicher und Ladestationen liegt noch bis 31.12.2026 bei 22 %. Dazu kommen Abschreibung, Vorsteuerabzug und die Befreiung von der Elektrizitätsabgabe – hier mit Paragraph, Grenze und IFB-Rechner."
        image={{ src: "/Images/Referenzen/Projekte-1.jpg", alt: "Photovoltaikanlage auf einem Betriebsgebäude" }}
        points={["IFB 22 % bis 31.12.2026", "AfA 20 Jahre oder 30 % degressiv", "Elektrizitätsabgabe befreit", "Mit IFB-Rechner"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Zum IFB-Rechner", href: "#ifb-rechner", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Percent aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">22 %</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">IFB für Anschaffung bis 31.12.2026</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "22 %", label: "IFB für PV, Speicher, Ladestationen" },
          { wert: "20 Jahre", label: "Nutzungsdauer laut Finanzverwaltung" },
          { wert: "0 €", label: "Elektrizitätsabgabe auf Eigenverbrauch" },
          { wert: "20 %", label: "USt – der 0-%-Satz ist ausgelaufen" },
        ]}
      />

      <Section tone="sand" space="lg" id="ifb-rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="IFB-Rechner"
          title={<>Was bringt der <span className="ov-text-gradient">Investitionsfreibetrag</span> Ihrem Betrieb?</>}
          lead="Anschaffungskosten, Förderung und Rechtsform eingeben – Sie sehen IFB, Abschreibung und Steuerwirkung im ersten Jahr."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <SteuerCheck />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Die Regeln auf einen Blick"
            title="Photovoltaik-Steuerrecht 2026 in sieben Zeilen"
            lead="Welche Regel gilt, mit welcher Grenze, auf welcher Rechtsgrundlage – und für wen."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Rechtsstand {STAND.label}</StandPille>
        </div>
        <Reveal>
          <Tabelle
            dicht
            caption={`Steuerregeln für Photovoltaikanlagen in Österreich, Stand ${STAND.label}`}
            spalten={[
              { key: "art", label: "Thema", breite: "w-[15%]" },
              { key: "regel", label: "Regel" },
              { key: "grenze", label: "Grenze / Voraussetzung" },
              { key: "norm", label: "Rechtsgrundlage", breite: "w-[17%]", className: "text-[14px]" },
              { key: "fuer", label: "Für wen", breite: "w-[15%]" },
            ]}
            zeilen={UEBERSICHT}
          />
        </Reveal>
        <Hinweis titel="0 % Umsatzsteuer ist Geschichte" ton="warn" className="mt-8">
          {STEUER.ust} Angebote, die 2026 noch mit 0 % werben, sind falsch. Für Unternehmer ändert sich wenig, weil sie die Vorsteuer abziehen; für Private und Gemeinden im Hoheitsbereich ist die Umsatzsteuer ein echter Kostenfaktor.
        </Hinweis>
      </Section>

      {/* Nach Zielgruppe */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Nach Zielgruppe" title="Was für Unternehmen, Landwirtschaft, Gemeinden und Private gilt" className="mb-10" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Building2,
              titel: "Unternehmen",
              punkte: ["IFB 22 % zusätzlich zur AfA (Anschaffung bis 31.12.2026)", "Vorsteuerabzug aus 20 % USt", "Elektrizitätsabgabe auf Eigenverbrauch entfällt", "IFB schließt den investitionsbedingten Gewinnfreibetrag für dasselbe Wirtschaftsgut aus", "Behaltefrist 4 Jahre, sonst Nachversteuerung"],
              link: { href: "/gewerbe", label: "Photovoltaik für Gewerbe und Industrie" },
            },
            {
              icon: Tractor,
              titel: "Land- und Forstwirtschaft",
              punkte: ["Volleinspeisung = eigener Gewerbebetrieb", "Überschusseinspeisung mit überwiegend betrieblichem Verbrauch = Nebenbetrieb", "Nebenbetriebs-Einkünfte zählen nicht zur 55.000-€-Grenze der LuF-PauschVO 2015", "USt-Pauschalierung: Einspeisung 13 %, Privatentnahme 10 %", "Bei pauschaler Gewinnermittlung kein IFB"],
              link: { href: "/landwirtschaft", label: "Photovoltaik für die Landwirtschaft" },
            },
            {
              icon: Landmark,
              titel: "Gemeinden",
              punkte: ["Einordnung: Hoheitsbereich oder Betrieb gewerblicher Art – entscheidet über den Vorsteuerabzug", "Eigenverbrauch in Gemeindegebäuden von der Elektrizitätsabgabe befreit", "Energiegemeinschaft mit Bürgern: Gewinnerzielung nicht im Vordergrund", "Vergabe nach Bundesvergabegesetz beachten"],
              link: { href: "/kommunen", label: "Photovoltaik für Gemeinden" },
            },
            {
              icon: Sun,
              titel: "Private",
              punkte: ["20 % USt ohne Vorsteuerabzug", "Einspeiseerlöse bis 12.500 kWh je Person steuerfrei (Anlage bis 35 kWp)", "Eigenverbrauch abgabenfrei", "Keine AfA und kein IFB ohne betriebliche Nutzung"],
              link: { href: "/forderungen/landesforderungen", label: "Landesförderungen für Private" },
            },
          ].map((z, i) => (
            <Reveal key={z.titel} delay={(i % 2) * 70} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
              <p className="flex items-center gap-2 font-display text-[20px] font-bold text-ink-900">
                <z.icon aria-hidden="true" className="h-5 w-5 text-ov-600" /> {z.titel}
              </p>
              <Checkliste className="mt-5" items={z.punkte} />
              <Link href={z.link.href} className="mt-auto pt-6 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">{z.link.label}</Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Beispiel */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Rechenbeispiel"
          title="GmbH, 200.000 € Anschaffungskosten, Inbetriebnahme November 2026"
          lead="Beispielwerte zur Veranschaulichung – ohne EAG-Zuschuss, lineare AfA, KöSt 23 %."
          className="mb-10"
        />
        <Reveal>
          <Tabelle
            dicht
            caption="Beispielrechnung Investitionsfreibetrag und AfA"
            spalten={[
              { key: "pos", label: "Position", breite: "w-[34%]" },
              { key: "rechnung", label: "Rechnung" },
              { key: "betrag", label: "Betrag", className: "font-display font-bold text-ov-700" },
            ]}
            zeilen={[
              { pos: "Investitionsfreibetrag", rechnung: "200.000 € × 22 %", betrag: "44.000 €" },
              { pos: "AfA 1. Jahr (Halbjahres-AfA)", rechnung: "200.000 € ÷ 20 Jahre × ½", betrag: "5.000 €" },
              { pos: "Betriebsausgaben 1. Jahr", rechnung: "IFB + AfA", betrag: "49.000 €" },
              { pos: "Steuerwirkung 1. Jahr", rechnung: "49.000 € × 23 % KöSt", betrag: "11.270 €" },
              { pos: "Vergleich: Anschaffung 2027", rechnung: "200.000 € × 15 % IFB + 5.000 € AfA, × 23 %", betrag: "8.050 €" },
            ]}
          />
        </Reveal>
        <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Entscheidend ist der Zeitpunkt der Anschaffung bzw. Fertigstellung. Wer 2026 noch profitieren will, braucht einen realistischen Bauzeitplan – mehr dazu im Ratgeber{" "}
          <Link href="/ratgeber/investitionsfreibetrag-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Investitionsfreibetrag für Photovoltaik</Link>.
        </p>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Schritt für Schritt"
            title="Steuerlich richtig umsetzen"
            lead="Die fünf Punkte, die wir mit Ihrer Steuerberatung abstimmen – von der Bestellung bis zur Behaltefrist."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <HowTo
            name="PV-Anlage im Betrieb steuerlich richtig umsetzen"
            beschreibung={`Anleitung für Unternehmen in Österreich, Rechtsstand ${STAND.label}.`}
            schritte={[
              { icon: ClipboardCheck, name: "Anschaffungszeitpunkt planen", text: "Für 22 % IFB muss die Anlage bis 31.12.2026 angeschafft bzw. hergestellt sein. Bauzeit, Netzanschluss und Lieferzeiten realistisch einplanen." },
              { icon: Receipt, name: "Förderung und Anschaffungskosten abstimmen", text: "EAG-Zuschuss und Landesförderung kürzen die Anschaffungskosten. Rechnungen getrennt nach PV, Speicher und Ladestation ausweisen lassen." },
              { icon: FileText, name: "IFB und AfA in der Steuererklärung", text: "IFB im Jahr der Anschaffung geltend machen und im Anlagenverzeichnis ausweisen; lineare oder degressive AfA wählen." },
              { icon: Percent, name: "Befreiung von der Elektrizitätsabgabe anzeigen", text: "Eigenerzeugung aus Erneuerbaren beim Finanzamt anzeigen und Erzeugung sowie Eigenverbrauch aufzeichnen." },
              { icon: Building2, name: "Behaltefrist dokumentieren", text: "Die Anlage 4 Jahre im inländischen Betrieb halten – bei Verkauf oder Verbringung ins Ausland wird der IFB nachversteuert." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Photovoltaik und Steuer – kurz beantwortet" lead={`Allgemeine Information nach Rechtsstand ${STAND.label}. Verbindlich ist die Beratung durch Ihre Steuerberatung.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen stand={STAND.label} quellen={[...STEUER.quellen, ENERGIEGEMEINSCHAFTEN.quellen[2]]} hinweis="Allgemeine Information, keine Steuerberatung. Für Vermietung, Landwirtschaft, Gemeinden und mehrere Anlagen empfehlen wir die Abstimmung mit Ihrer Steuerberatung." />
      </Section>

      <Querverweise pfad="/forderungen/steuerlich" />
      <CtaBand
        eyebrow="Noch 2026 umsetzen"
        title="Mit 22 % IFB bauen – solange es geht."
        text="Wir planen Ihre Anlage mit einem Bauzeitplan, der zur Frist passt, und liefern die Unterlagen, die Ihre Steuerberatung für IFB, AfA und Förderung braucht."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Bundesförderung ansehen", href: "/forderungen/bundesfoerderung" }}
      />
    </div>
  );
}
