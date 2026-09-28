// src/app/produkte/smartmeter/page.js
//
// Smart Meter & Energiemanagement – Österreich (Stand 09/2026).
//   - Rollout nach IME-VO faktisch abgeschlossen: ~97 % Ende 2025
//     (Oesterreichs Energie, https://oesterreichsenergie.at/smart-meter/roll-out)
//   - ElWG § 54: nur noch Opt-in (Viertelstundenwerte) oder Opt-out; kein
//     Opt-out bei meldepflichtigen Anlagen, dynamischem Tarif,
//     Energiegemeinschaft (https://netz-noe.at/energiezukunft/elwg-zu-smart-meter)
//   - Netzbetreiber = Messstellenbetreiber; Kosten im regulierten Messentgelt
// Keine Backoffice-Texte mehr (die API lieferte die deutsche Rechtslage).

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Cpu,
  Gauge,
  Home,
  LineChart,
  MonitorDot,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  Zap,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Zaehlervergleich from "@/components/Smartmeter/Zaehlervergleich";
import PflichtCheck from "@/components/Smartmeter/PflichtCheck";
import LivePreis from "@/components/Smartmeter/LivePreis";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/smartmeter";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Smart Meter & Energiemanagement Österreich | Ökovolt";
const DESCRIPTION =
  "Smart Meter in Österreich: Viertelstundenwerte, Opt-out nach ElWG, Kundenportale der Netzbetreiber – und wie Betriebe mit Lastgang und EMS Kosten senken.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Smart Meter Österreich", "Smart Meter Opt-out", "Viertelstundenwerte", "ElWG Smart Meter", "Lastprofilzähler", "Energiemanagementsystem Gewerbe"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Smart Meter im Zählerschrank" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const NETZBETREIBER = [
  "Netz Oberösterreich",
  "Linz Netz",
  "Salzburg Netz",
  "Wiener Netze",
  "Netz Niederösterreich",
  "Energienetze Steiermark",
  "Energie Graz Netz",
  "KNG-Kärnten Netz",
  "TINETZ",
  "IKB",
  "Vorarlberger Energienetze",
  "Netz Burgenland",
];

const GEWERBE = [
  { icon: LineChart, title: "Lastgang auswerten", text: "Die Viertelstundenwerte der letzten zwölf Monate sind die Grundlage für PV-Dimensionierung, Speicherauslegung und Tarifwahl." },
  { icon: TrendingDown, title: "Leistungspreis senken", text: "Mit Lastprofilzähler zählt jede Spitze. Energiemanagement und Speicher kappen sie gezielt.", href: "/gewerbespeicher" },
  { icon: Cpu, title: "Energiemanagement (EMS)", text: "Ein EMS steuert PV, Speicher, Ladeinfrastruktur und Wärmepumpe nach Erzeugung, Lastgang und Preis." },
  { icon: SlidersHorizontal, title: "Einspeiselimit & Netzvorgaben", text: "Am Netzanschlusspunkt regelt unser Parkregler Wirk- und Blindleistung nach den Vorgaben des Netzbetreibers.", href: "/technik/parkregler" },
  { icon: MonitorDot, title: "Monitoring & SCADA", text: "Standortübergreifende Überwachung von Erzeugung und Verbrauch – mit eigenen Fernwartungs- und SCADA-Systemen.", href: "/technik/scada" },
  { icon: Share2, title: "Energiegemeinschaften", text: "Viertelstundenwerte sind Voraussetzung für die Teilnahme an EEG, BEG und GEA.", href: "/energiegemeinschaften" },
];

const FAQ = [
  {
    q: "Kann ich den Smart Meter in Österreich ablehnen?",
    a: "Den Einbau des digitalen Zählers nicht, wohl aber die Viertelstundenmessung: Haushaltskunden können nach § 54 Abs. 2 ElWG der Speicherung und Übertragung von Tages- und Viertelstundenwerten widersprechen (Opt-out). Ausgeschlossen ist das unter anderem bei PV-Anlage, Wallbox, Wärmepumpe oder Speicher, bei dynamischem Tarif und bei Teilnahme an einer Energiegemeinschaft.",
  },
  {
    q: "Wer baut den Smart Meter ein und was kostet er?",
    a: "Den Zähler stellt und betreibt immer der zuständige Netzbetreiber. Einen vom Netzbetreiber getrennten Messstellenbetreiber gibt es in Österreich nicht. Die Kosten sind im regulierten Messentgelt enthalten, das auf der Netzrechnung ausgewiesen wird.",
  },
  {
    q: "Wo sehe ich meine Viertelstundenwerte?",
    a: "Im Kundenportal Ihres Netzbetreibers, meist ab dem Folgetag. Dort lassen sich die Werte auch als Datei herunterladen – genau diese Datei brauchen wir für eine fundierte PV- und Speicherplanung. Echtzeitwerte für das Energiemanagement liefert die Kundenschnittstelle des Zählers, die je nach Netzbetreiber freigeschaltet werden muss.",
  },
  {
    q: "Was ändert sich mit dem ElWG für den Smart Meter?",
    a: "Seit Inkrafttreten des ElWG Ende 2025 gibt es nur noch zwei Einstellungen: Opt-in mit Viertelstundenwerten oder Opt-out mit reduzierter Auslesung. Die Netzbetreiber stellen Zähler schrittweise auf Viertelstundenwerte um (§ 54 Abs. 3 ElWG). Wer bereits ein Opt-out gewählt hat und keine meldepflichtigen Anlagen betreibt, behält es.",
  },
  {
    q: "Brauche ich für einen dynamischen Stromtarif einen Smart Meter?",
    a: "Ja. Ein dynamischer Tarif rechnet nach dem Day-Ahead-Preis der Gebotszone Österreich ab – dafür muss Ihr Verbrauch in Viertelstundenwerten gemessen und übertragen werden. Ein Opt-out ist mit dynamischem Tarif nicht möglich.",
  },
  {
    q: "Welche Messung haben Gewerbebetriebe?",
    a: "Betriebe mit mehr als 100.000 kWh Jahresverbrauch oder über 50 kW Anschlussleistung werden in der Regel mit Lastprofilzähler gemessen. Dann fallen neben dem Arbeitspreis leistungsabhängige Netzentgelte an – und jede Lastspitze zählt. Mit Energiemanagement, Speicher und PV lassen sich diese Kosten gezielt senken.",
  },
  {
    q: "Sind meine Daten beim Smart Meter sicher?",
    a: "Die Werte werden verschlüsselt an den Netzbetreiber übertragen und nur für Abrechnung, Netzbetrieb und die von Ihnen beauftragten Zwecke verwendet. Weitergaben, etwa an einen Energiedienstleister, erfolgen nur mit Ihrer Zustimmung. Den Umfang der Datenerfassung steuern Sie über Opt-in und Opt-out, soweit kein Ausschlussgrund vorliegt.",
  },
];

export default function SmartmeterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${PAGE_URL}/#service` },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Messkonzept und Energiemanagement",
        serviceType: "Lastganganalyse, Messkonzept und Energiemanagementsysteme",
        description: DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        url: PAGE_URL,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Smart Meter & EMS" }]}
        eyebrow="Smart Meter · Energiemanagement"
        title={
          <>
            Smart Meter in Österreich – <span className="ov-text-gradient">und was Betriebe daraus machen</span>
          </>
        }
        lead="Der Smart Meter des Netzbetreibers misst Verbrauch und Einspeisung in Viertelstundenwerten. Für Haushalte ist er Grundlage für dynamische Tarife und Energiegemeinschaften, für Betriebe die Datenbasis für PV-Planung, Peak Shaving und Energiemanagement."
        image={{ src: "/Images/Dienstleistungen/Smartphone/smart-guard-scaled.jpg", alt: "Elektrotechniker arbeitet am Zählerschrank" }}
        points={["Opt-in oder Opt-out nach ElWG", "Viertelstundenwerte im Kundenportal", "Lastgang als Planungsgrundlage", "Energiemanagement für Gewerbe"]}
        actions={[
          { label: "Beratung anfragen", href: "/angebot" },
          { label: "Smart-Meter-Check", href: "#pflicht-check", icon: ShieldCheck },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Gauge aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                96 <span className="text-[14px] font-semibold text-ink-500">Messwerte am Tag</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">statt einer Ablesung im Jahr</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Einfach erklärt"
          title="Was ist ein Smart Meter in Österreich?"
          image={{ src: "/Images/Ratgeber/energiemanagementsystem.jpg", alt: "Energiedaten auf einem Bildschirm" }}
          text={[
            "Ein Smart Meter ist ein digitaler Stromzähler mit Kommunikationsmodul, den der Netzbetreiber einbaut und betreibt. Grundlage des Rollouts war die Intelligente Messgeräte-Einführungsverordnung (IME-VO); Ende 2025 hatten laut Oesterreichs Energie rund 97 % der Zählpunkte ein digitales Messgerät.",
            "Seit dem Elektrizitätswirtschaftsgesetz (ElWG) gibt es zwei Einstellungen: Opt-in mit Viertelstundenwerten oder Opt-out mit reduzierter Auslesung. Wer eine PV-Anlage, Wallbox, Wärmepumpe oder einen Speicher betreibt, misst immer in Viertelstundenwerten.",
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="zaehlerarten">
        <SectionHeading
          eyebrow="Zähler und Einstellungen"
          title={
            <>
              Analog, Opt-out oder <span className="ov-text-gradient">Viertelstunde</span>?
            </>
          }
          lead="Nicht jeder digitale Zähler liefert dieselben Daten. Klicken Sie sich durch die drei Varianten, die heute in österreichischen Zählerschränken vorkommen."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Zaehlervergleich />
        </Reveal>
      </Section>

      <Section tone="white" space="lg" id="pflicht-check" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Opt-out oder Viertelstunde?"
              title="Welche Messung gilt für Sie?"
              lead="Ein Opt-out nach § 54 Abs. 2 ElWG ist nur möglich, wenn keine meldepflichtige Anlage, kein dynamischer Tarif und keine Energiegemeinschaft vorliegt. Betriebe über 100.000 kWh werden in der Regel ohnehin mit Lastprofilzähler gemessen."
            />
            <Reveal delay={100} className="mt-8 space-y-4 border-l-2 border-ov-300 pl-6 text-[16px] leading-relaxed text-ink-600">
              <p className="ov-measure">Die Viertelstundenwerte stellen die Netzbetreiber in ihren Kundenportalen bereit, in der Regel ab dem Folgetag und als Download.</p>
              <p className="ov-measure">Zuständig ist immer der Netzbetreiber Ihres Standorts, zum Beispiel:</p>
              <ul className="flex flex-wrap gap-2">
                {NETZBETREIBER.map((n) => (
                  <li key={n} className="rounded-full bg-sand-50 px-3 py-1.5 text-[13.5px] font-medium text-ink-700 ring-1 ring-ink-200/70">
                    {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <PflichtCheck />
          </Reveal>
        </div>
      </Section>

      {/* Gewerbe */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Für Betriebe"
            title="Vom Lastgang zum Energiemanagement"
            lead="Im Gewerbe ist der Zähler die wichtigste Datenquelle: Aus dem Lastgang ergeben sich PV-Größe, Speicherbedarf und Einsparpotenzial beim Leistungspreis. Ein Energiemanagementsystem setzt das im Betrieb um."
            className="mb-12"
          />
          <FeatureGrid items={GEWERBE} cols={3} tone="dark" />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Nutzen für Haushalt und Betrieb"
          title="Zwei Hebel, die Viertelstundenwerte erst möglich machen"
          lead="Ein Smart Meter spart nicht von allein. Seinen Wert entfaltet er über Energiegemeinschaften und dynamische Tarife."
          className="mb-12"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="flex">
            <div className="flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70 md:p-8">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-600">
                <Share2 aria-hidden="true" className="h-4 w-4" />
                Energiegemeinschaften
              </p>
              <h3 className="ov-h3 mt-3 text-ink-900">Strom teilen in Gemeinde und Nachbarschaft</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
                In Erneuerbare-Energie-Gemeinschaften, Bürgerenergiegemeinschaften und gemeinschaftlichen Erzeugungsanlagen ordnet der Netzbetreiber den geteilten Strom
                Viertelstunde für Viertelstunde zu. Ab 1. Oktober 2026 regelt das ElWG diese Modelle neu und ergänzt Peer-to-Peer-Verträge.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { t: "EEG", w: "lokal/regional", d: "reduzierte Netzentgelte im Nahbereich" },
                  { t: "BEG", w: "österreichweit", d: "ohne Netzentgelt-Reduktion" },
                  { t: "GEA", w: "im Gebäude", d: "ohne öffentliches Netz" },
                ].map((m) => (
                  <li key={m.t} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{m.t}</p>
                    <p className="mt-1 font-display text-[17px] font-extrabold text-ink-900">{m.w}</p>
                    <p className="mt-1 text-[13px] leading-snug text-ink-500">{m.d}</p>
                  </li>
                ))}
              </ul>
              <Link href="/energiegemeinschaften" className="group mt-auto inline-flex h-11 items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Energiegemeinschaften im Detail
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="flex">
            <LivePreis />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Smart Meter – kurz & ehrlich beantwortet"
            lead="Sie planen PV, Speicher, Wärmepumpe oder Ladeinfrastruktur? Dann denken wir Messung und Energiemanagement von Anfang an mit."
          >
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/produkte/smartenergyhome" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <Home aria-hidden="true" className="h-4 w-4" />
                Smart Energy Home entdecken
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/energie-live" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <Zap aria-hidden="true" className="h-4 w-4" />
                Strommarkt Österreich live
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/service/energieberatung" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <BarChart3 aria-hidden="true" className="h-4 w-4" />
                Lastganganalyse & Energieberatung
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Messung, PV & Steuerung – sauber geplant aus einer Hand."
        text={`${FIRMA.name} aus ${FIRMA.ort} wertet Ihren Lastgang aus, plant Energiemanagement und Regelung und stimmt alles mit Ihrem Netzbetreiber ab – in ganz Österreich.`}
        primary={{ label: "Beratung anfragen", href: "/angebot" }}
        secondary={{ label: "Dynamischen Tarif prüfen", href: "/service/stromtarif", icon: Activity }}
      />
    </div>
  );
}
