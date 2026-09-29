// src/app/forderungen/steuerlich/page.js
//
// Steuerrecht Photovoltaik Österreich: IFB, Gewinnfreibetrag, AfA, USt,
// Elektrizitätsabgabe, Land- und Forstwirtschaft, Kleinunternehmer, Private.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeEuro, Building2, Calculator, ClipboardCheck, FileText, Home, Landmark, Percent, Receipt, Store, Sun, Tractor, TrendingDown, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SteuerCheck from "@/components/Forderungen/Steuerlich/SteuerCheck";
import Umschalter from "@/components/Forderungen/Shared/Umschalter";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { BILDER, nachweise } from "@/components/Forderungen/Shared/bildnachweise";
import { Checkliste, Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
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

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

const REGEL_ICONS = [<Percent key="p" />, <BadgeEuro key="b" />, <TrendingDown key="t" />, <Receipt key="r" />, <Zap key="z" />, <Home key="h" />, <Store key="s" />];

const ZIELGRUPPEN = [
  {
    id: "unternehmen",
    icon: <Building2 />,
    titel: "Unternehmen",
    bild: { src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftbild von Gewerbehallen mit Photovoltaikanlagen auf den Dächern" },
    punkte: ["IFB 22 % zusätzlich zur AfA (Anschaffung bis 31.12.2026)", "Vorsteuerabzug aus 20 % USt", "Elektrizitätsabgabe auf Eigenverbrauch entfällt", "IFB schließt den investitionsbedingten Gewinnfreibetrag für dasselbe Wirtschaftsgut aus", "Behaltefrist 4 Jahre, sonst Nachversteuerung"],
    link: { href: "/gewerbe", label: "Photovoltaik für Gewerbe und Industrie" },
  },
  {
    id: "landwirtschaft",
    icon: <Tractor />,
    titel: "Land- und Forstwirtschaft",
    bild: { src: "/Images/Referenzen/projekteBanner.jpg", alt: "Aufgeständerte Photovoltaik-Freiflächenanlage unter blauem Himmel" },
    punkte: ["Volleinspeisung = eigener Gewerbebetrieb", "Überschusseinspeisung mit überwiegend betrieblichem Verbrauch = Nebenbetrieb", "Nebenbetriebs-Einkünfte zählen nicht zur 55.000-€-Grenze der LuF-PauschVO 2015", "USt-Pauschalierung: Einspeisung 13 %, Privatentnahme 10 %", "Bei pauschaler Gewinnermittlung kein IFB"],
    link: { href: "/landwirtschaft", label: "Photovoltaik für die Landwirtschaft" },
  },
  {
    id: "gemeinden",
    icon: <Landmark />,
    titel: "Gemeinden",
    bild: { src: BILDER.gemeinde.src, alt: "Photovoltaikanlage auf dem Dach eines Gemeindeamts in Kärnten" },
    punkte: ["Einordnung: Hoheitsbereich oder Betrieb gewerblicher Art – entscheidet über den Vorsteuerabzug", "Eigenverbrauch in Gemeindegebäuden von der Elektrizitätsabgabe befreit", "Energiegemeinschaft mit Bürgern: Gewinnerzielung nicht im Vordergrund", "Vergabe nach Bundesvergabegesetz beachten"],
    link: { href: "/kommunen", label: "Photovoltaik für Gemeinden" },
  },
  {
    id: "private",
    icon: <Sun />,
    titel: "Private",
    bild: { src: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg", alt: "Reihenhäuser mit Photovoltaikmodulen auf dem Dach" },
    punkte: ["20 % USt ohne Vorsteuerabzug", "Einspeiseerlöse bis 12.500 kWh je Person steuerfrei (Anlage bis 35 kWp)", "Eigenverbrauch abgabenfrei", "Keine AfA und kein IFB ohne betriebliche Nutzung"],
    link: { href: "/forderungen/landesforderungen", label: "Landesförderungen für Private" },
  },
];

const BEISPIEL = [
  { pos: "Investitionsfreibetrag", rechnung: "200.000 € × 22 %", betrag: "44.000 €" },
  { pos: "AfA 1. Jahr (Halbjahres-AfA)", rechnung: "200.000 € ÷ 20 Jahre × ½", betrag: "5.000 €" },
  { pos: "Betriebsausgaben 1. Jahr", rechnung: "IFB + AfA", betrag: "49.000 €" },
  { pos: "Steuerwirkung 1. Jahr", rechnung: "49.000 € × 23 % KöSt", betrag: "11.270 €" },
  { pos: "Vergleich: Anschaffung 2027", rechnung: "200.000 € × 15 % IFB + 5.000 € AfA, × 23 %", betrag: "8.050 €" },
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

  const regelPanels = UEBERSICHT.map((r, i) => (
    <article key={r.art} className="relative overflow-hidden rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 shadow-[0_30px_60px_-45px_rgba(3,18,43,0.45)] md:p-9">
      <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-8 font-display text-[150px] font-extrabold leading-none text-ink-100">{String(i + 1).padStart(2, "0")}</span>
      <div className="relative">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{r.art}</p>
        <h3 className="mt-3 max-w-2xl font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold leading-snug tracking-tight text-ink-900">{r.regel}</h3>
        <dl className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:col-span-3">
            <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Grenze / Voraussetzung</dt>
            <dd className="mt-1.5 text-[15.5px] leading-relaxed text-ink-800">{r.grenze}</dd>
          </div>
          <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:col-span-2">
            <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Rechtsgrundlage</dt>
            <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-700">{r.norm}</dd>
          </div>
          <div className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-100">
            <dt className="text-[12px] font-semibold uppercase tracking-wider text-ov-700">Für wen</dt>
            <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-800">{r.fuer}</dd>
          </div>
        </dl>
      </div>
    </article>
  ));

  const zgPanels = ZIELGRUPPEN.map((z) => (
    <div key={z.id} className="grid items-stretch gap-6 overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">
      <div className="relative min-h-[240px] overflow-hidden">
        <Image src={z.bild.src} alt={z.bild.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <p className="absolute bottom-5 left-6 font-display text-[24px] font-extrabold text-white">{z.titel}</p>
      </div>
      <div className="flex flex-col p-6 md:p-9">
        <Checkliste items={z.punkte} />
        <Link href={z.link.href} className="group mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
          {z.link.label}
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  ));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Steuerliche Vorteile" }]}
        eyebrow={`Photovoltaik & Steuer · Rechtsstand ${STAND.kurz}`}
        title={<>Photovoltaik und Steuer: <span className="ov-text-gradient-light">22 % Investitionsfreibetrag</span> bis Jahresende</>}
        lead="Für Unternehmen ist 2026 steuerlich ein Ausnahmejahr: Der Investitionsfreibetrag für PV, Speicher und Ladestationen liegt noch bis 31.12.2026 bei 22 %. Dazu kommen Abschreibung, Vorsteuerabzug und die Befreiung von der Elektrizitätsabgabe – hier mit Paragraph, Grenze und IFB-Rechner."
        image={{ src: "/Images/Referenzen/referenzkarte4.jpg", alt: "Projektteam mit Schutzhelmen vor einer Photovoltaik-Freiflächenanlage", position: "center 40%" }}
        points={["IFB 22 % bis 31.12.2026", "AfA 20 Jahre oder 30 % degressiv", "Elektrizitätsabgabe befreit", "Mit IFB-Rechner"]}
        actions={[
          { label: "Zum IFB-Rechner", href: "#ifb-rechner", icon: Calculator },
          { label: "Projekt anfragen", href: "/angebot" },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: 22, suffix: " %", label: "IFB für PV, Speicher, Ladestationen" },
          { value: 20, suffix: " Jahre", label: "Nutzungsdauer laut Finanzverwaltung" },
          { value: 0, suffix: " €", label: "Elektrizitätsabgabe auf Eigenverbrauch" },
          { value: 20, suffix: " %", label: "USt – der 0-%-Satz ist ausgelaufen" },
        ]}
      />

      <Section tone="sand" space="md" id="ifb-rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="IFB-Rechner"
          title={<>Was bringt der <span className="ov-text-gradient">Investitionsfreibetrag</span> Ihrem Betrieb?</>}
          lead="Anschaffungskosten, Förderung und Rechtsform eingeben – Sie sehen IFB, Abschreibung und Steuerwirkung im ersten Jahr, im direkten Vergleich zur Anschaffung ab 2027."
          align="center"
          className="mb-10"
        />
        <Reveal dir="scale">
          <SteuerCheck />
        </Reveal>
      </Section>

      <Section tone="white" space="md">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Die Regeln auf einen Blick" title="Photovoltaik-Steuerrecht 2026 in sieben Punkten" lead="Welche Regel gilt, mit welcher Grenze, auf welcher Rechtsgrundlage – und für wen. Thema wählen." />
          <StandPille className="shrink-0 self-start md:self-auto">Rechtsstand {STAND.label}</StandPille>
        </div>
        <Umschalter form="liste" label="Steuerthema wählen" tabs={UEBERSICHT.map((r, i) => ({ id: `r${i}`, label: r.art, icon: REGEL_ICONS[i] }))} panels={regelPanels} />
        <Hinweis titel="0 % Umsatzsteuer ist Geschichte" ton="warn" className="mt-8">
          {STEUER.ust} Angebote, die 2026 noch mit 0 % werben, sind falsch. Für Unternehmer ändert sich wenig, weil sie die Vorsteuer abziehen; für Private und Gemeinden im Hoheitsbereich ist die Umsatzsteuer ein echter Kostenfaktor.
        </Hinweis>
      </Section>

      {/* Rechenbeispiel */}
      <Section tone="navy" space="md" className="ov-noise overflow-hidden">
        <Glow />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading dark eyebrow="Rechenbeispiel" title="GmbH, 200.000 € Anschaffungskosten, Inbetriebnahme November 2026" lead="Beispielwerte zur Veranschaulichung – ohne EAG-Zuschuss, lineare AfA, KöSt 23 %." />
            <p className="mt-6 text-[15px] leading-relaxed text-white/65">
              Entscheidend ist der Zeitpunkt der Anschaffung bzw. Fertigstellung. Wer 2026 noch profitieren will, braucht einen realistischen Bauzeitplan – mehr dazu im Ratgeber{" "}
              <Link href="/ratgeber/investitionsfreibetrag-photovoltaik" className="font-semibold text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">Investitionsfreibetrag für Photovoltaik</Link>.
            </p>
          </div>
          <Reveal dir="right" className="ov-glass rounded-3xl p-6 md:p-8">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/55">Steuerwirkung im 1. Jahr</p>
            <div className="mt-6 space-y-5">
              {[
                { l: "Anschaffung 2026 (IFB 22 %)", w: 11270, t: "11.270 €", c: "from-ov-400 to-ov-600" },
                { l: "Anschaffung 2027 (IFB 15 %)", w: 8050, t: "8.050 €", c: "from-white/40 to-white/20" },
              ].map((b) => (
                <div key={b.l}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[14.5px] text-white/75">{b.l}</span>
                    <span className="ov-num whitespace-nowrap font-display text-[21px] font-extrabold text-white sm:text-[26px]">{b.t}</span>
                  </div>
                  <span aria-hidden="true" className="mt-2 block h-4 overflow-hidden rounded-full bg-white/10">
                    <span className={`block h-full rounded-full bg-gradient-to-r ${b.c}`} style={{ width: `${(b.w / 11270) * 100}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <dl className="mt-7 divide-y divide-white/10 border-t border-white/10 text-[14px]">
              {BEISPIEL.map((z) => (
                <div key={z.pos} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 py-2.5">
                  <dt className="text-white/85">{z.pos}<span className="block text-[12.5px] text-white/45">{z.rechnung}</span></dt>
                  <dd className="ov-num self-center font-display font-bold text-ov-300">{z.betrag}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* Nach Zielgruppe */}
      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Nach Zielgruppe" title="Was für Unternehmen, Landwirtschaft, Gemeinden und Private gilt" className="mb-8" />
        <Umschalter label="Zielgruppe wählen" tabs={ZIELGRUPPEN.map((z) => ({ id: z.id, label: z.titel, icon: z.icon }))} panels={zgPanels} />
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Schritt für Schritt" title="Steuerlich richtig umsetzen" lead="Die fünf Punkte, die wir mit Ihrer Steuerberatung abstimmen – von der Bestellung bis zur Behaltefrist." className="mb-10" />
        <Prozess
          name="PV-Anlage im Betrieb steuerlich richtig umsetzen"
          beschreibung={`Anleitung für Unternehmen in Österreich, Rechtsstand ${STAND.label}.`}
          schritte={[
            { icon: <ClipboardCheck />, name: "Anschaffungszeitpunkt planen", text: "Für 22 % IFB muss die Anlage bis 31.12.2026 angeschafft bzw. hergestellt sein. Bauzeit, Netzanschluss und Lieferzeiten realistisch einplanen." },
            { icon: <Receipt />, name: "Förderung und Anschaffungskosten abstimmen", text: "EAG-Zuschuss und Landesförderung kürzen die Anschaffungskosten. Rechnungen getrennt nach PV, Speicher und Ladestation ausweisen lassen." },
            { icon: <FileText />, name: "IFB und AfA in der Steuererklärung", text: "IFB im Jahr der Anschaffung geltend machen und im Anlagenverzeichnis ausweisen; lineare oder degressive AfA wählen." },
            { icon: <Percent />, name: "Befreiung von der Elektrizitätsabgabe anzeigen", text: "Eigenerzeugung aus Erneuerbaren beim Finanzamt anzeigen und Erzeugung sowie Eigenverbrauch aufzeichnen." },
            { icon: <Building2 />, name: "Behaltefrist dokumentieren", text: "Die Anlage 4 Jahre im inländischen Betrieb halten – bei Verkauf oder Verbringung ins Ausland wird der IFB nachversteuert." },
          ]}
        />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Photovoltaik und Steuer – kurz beantwortet" lead={`Allgemeine Information nach Rechtsstand ${STAND.label}. Verbindlich ist die Beratung durch Ihre Steuerberatung.`}>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
              Förderungen, die den IFB ergänzen: <Link href="/forderungen/bundesfoerderung#rechner" className={LINK}>EAG-Zuschuss berechnen</Link>.
            </p>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={STAND.label} quellen={[...STEUER.quellen, ENERGIEGEMEINSCHAFTEN.quellen[2]]} hinweis="Allgemeine Information, keine Steuerberatung. Für Vermietung, Landwirtschaft, Gemeinden und mehrere Anlagen empfehlen wir die Abstimmung mit Ihrer Steuerberatung." />
      </Section>

      <Querverweise pfad="/forderungen/steuerlich" />
      <CtaBand
        eyebrow="Noch 2026 umsetzen"
        title="Mit 22 % IFB bauen – solange es geht."
        text="Wir planen Ihre Anlage mit einem Bauzeitplan, der zur Frist passt, und liefern die Unterlagen, die Ihre Steuerberatung für IFB, AfA und Förderung braucht."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Bundesförderung ansehen", href: "/forderungen/bundesfoerderung" }}
      />
      <Bildnachweis items={nachweise("gemeinde")} />
    </div>
  );
}
