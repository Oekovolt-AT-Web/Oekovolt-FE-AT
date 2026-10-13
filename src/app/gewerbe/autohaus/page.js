// Welle C / C04: Landingpage Photovoltaik für Autohäuser und Werkstätten.
//
// Referenzen: vier Autohäuser mit Werkstatt (Ford-Partner) laut src/data/projekte.js – 99,96 / 99,96 /
// 99,28 / 78,88 kWp. „Ford“ erscheint nur als Kundenbezeichnung (Branche laut kunden.js), keine Logos,
// keine Firmennamen ohne Freigabe (BranchenReferenzen zeigt neutral Branche, Ort, kWp).
// Lastprofile sind typisierte Beispiele (keine Messwerte). Konfigurator nur per Link vorbelegt.

import Link from "next/link";
import { ArrowRight, Car, ClipboardList, CloudHail, Gauge, LineChart, PlugZap, Sun, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis } from "@/components/Loesungen/Bausteine";
import LastprofilExplorer from "@/components/Loesungen/A/LastprofilExplorer";
import BranchenReferenzen from "@/components/Referenzen/BranchenReferenzen";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { KENNZAHLEN_HINWEIS_STAND } from "@/data/kennzahlen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/gewerbe/autohaus";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Autohäuser & Werkstätten | Ökovolt";
const BESCHREIBUNG =
  "PV für Autohaus, Schauraum und Werkstatt in Österreich: Werkstatt-Lastprofil, Laden für Kundschaft und Vorführwagen, Solarcarport für den Fahrzeugplatz.";
const HERO_BILD = "/Images/AT/loesungen-b/laden-dc-ladesaeule.jpg";
const STAND = "12.10.2026";

const TERMIN = "/termin?art=video&thema=gewerbe";
// Konfigurator-Vorbelegung nur über Link-Parameter – der Konfigurator wertet „branche“ derzeit nicht aus (Übergabe C04)
const ANFRAGE = "/angebot?objekt=gewerbe&branche=autohaus";

// Belegte Anlagenleistungen der vier Autohäuser (src/data/projekte.js, Feld leistung) – Angaben Ökovolt Österreich
const AUTOHAUS_KWP = [99.96, 99.96, 99.28, 78.88];
const fmtKwp = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const KWP_MIN = Math.min(...AUTOHAUS_KWP);
const KWP_MAX = Math.max(...AUTOHAUS_KWP);
const KWP_SUMME = Math.round(AUTOHAUS_KWP.reduce((s, v) => s + v, 0) * 100) / 100;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}${HERO_BILD}` }],
  },
};

// Typisierte Beispielprofile (relative Stundenwerte, schematisch) – Veranschaulichung, KEINE Messwerte.
const PROFILE = [
  {
    id: "werkstatt",
    label: "Werkstatt & Schauraum",
    icon: "Wrench",
    titel: "Autohaus mit Werkstatt (Beispielprofil)",
    last: [0.14, 0.13, 0.13, 0.13, 0.14, 0.18, 0.45, 0.85, 0.95, 1, 0.97, 0.9, 0.68, 0.88, 0.96, 0.92, 0.8, 0.55, 0.38, 0.22, 0.17, 0.15, 0.14, 0.14],
    pvFaktor: 1.0,
    marken: [{ h: 12.2, label: "Mittagspause" }],
    text: "Hebebühnen, Druckluft, Prüfstände, Absaugung und Beleuchtung laufen tagsüber; Schauraum und Klima bis zum Ladenschluss.",
    punkte: ["Kompressor und Prüfstand verursachen kurze Spitzen", "Samstag und Mittagspause erzeugen Überschuss"],
    link: { label: "Gewerbe-PV-Rechner", href: "/rechner/gewerbe-pv" },
  },
  {
    id: "laden",
    label: "Mit Ladepunkten",
    icon: "Building2",
    titel: "Autohaus mit Ladepunkten für Kundschaft und Vorführwagen (Beispielprofil)",
    last: [0.14, 0.13, 0.13, 0.13, 0.14, 0.18, 0.45, 0.88, 1, 1, 0.98, 0.97, 0.85, 0.98, 1, 0.97, 0.85, 0.58, 0.38, 0.22, 0.17, 0.15, 0.14, 0.14],
    pvFaktor: 0.85,
    marken: [{ h: 10, label: "Vorführwagen laden" }],
    text: "Vorführwagen, Werkstattfahrzeuge und Kundschaft laden während der Öffnungszeiten – mit Lastmanagement genau dann, wenn das Dach liefert.",
    punkte: ["Überschuss fließt in Fahrzeugbatterien statt ins Netz", "Lastmanagement hält die Anschlussleistung"],
    link: { label: "Ladeinfrastruktur-Rechner", href: "/rechner/ladeinfrastruktur" },
  },
];

const LADEN = [
  {
    icon: Car,
    titel: "Vorführwagen & Bestand",
    text: "Elektrische Vorführ- und Lagerfahrzeuge brauchen einen Ladestand, der sich vorzeigen lässt. AC-Ladepunkte am Fahrzeugplatz, gesteuert nach Solarüberschuss.",
  },
  {
    icon: PlugZap,
    titel: "Kundschaft & Service",
    text: "Laden während Service oder Beratung. Sind Ladepunkte öffentlich zugänglich, gelten AFIR und bei kWh-Abrechnung das Eichrecht – wir prüfen das im Einzelfall.",
  },
  {
    icon: Wrench,
    titel: "Hochvolt-Werkstatt",
    text: "Ladeleistung für Diagnose, Software-Updates und Übergabe – eingeplant in Anschlussleistung und Lastmanagement nach den TOR des Netzbetreibers.",
  },
  {
    icon: CloudHail,
    titel: "Solarcarport am Fahrzeugplatz",
    text: "Überdachung schützt Neu- und Gebrauchtwagen vor Hagel und Sonne und trägt zugleich Module. Mehr unter Solarcarport & Parkplatz-PV.",
  },
];

const FAQ = [
  {
    q: "Wie viel Photovoltaik passt auf ein Autohaus?",
    a: `Das hängt von Dach, Statik und Lastgang ab. Die vier Autohäuser mit Werkstatt, für die wir Anlagen gebaut haben, liegen zwischen ${fmtKwp(KWP_MIN)} und ${fmtKwp(KWP_MAX)} kWp (${KENNZAHLEN_HINWEIS_STAND}). Für Ihren Betrieb legen wir die Größe nach den Viertelstundenwerten des Zählers aus.`,
  },
  {
    q: "Passt der Lastgang einer Werkstatt zur Photovoltaik?",
    a: "Meist gut: Hebebühnen, Druckluft, Prüfstände, Absaugung, Beleuchtung und Klima laufen tagsüber. Überschuss entsteht in der Mittagspause, am Samstag und am Wochenende. Ladepunkte für Vorführwagen und Werkstattfahrzeuge nehmen ihn auf.",
  },
  {
    q: "Müssen unsere Ladepunkte für Kundschaft die AFIR erfüllen?",
    a: "Die AFIR (Verordnung (EU) 2023/1804) betrifft öffentlich zugängliche Ladepunkte. Ob ein Ladepunkt auf dem Kundenparkplatz öffentlich zugänglich ist, hängt von Zufahrt, Zielgruppe und Bedingungen ab. Laden nur Vorführwagen und Werkstattfahrzeuge auf dem Betriebsgelände, greift sie in der Regel nicht. Wird nach Kilowattstunden abgerechnet, ist zusätzlich das Eichrecht zu beachten. Keine Rechtsberatung.",
  },
  {
    q: "Lohnt sich ein Solarcarport für den Gebrauchtwagenplatz?",
    a: "Er nutzt die versiegelte Fläche doppelt: Hagel- und Sonnenschutz für den Fahrzeugbestand und Stromerzeugung. Kosten treiben vor allem Statik und Fundamente; die Wirtschaftlichkeit rechnen wir mit Ihrem Lastgang und der aktuellen Förderlage im Einzelfall.",
  },
  {
    q: "Dürfen wir mit der Anlage im Schauraum werben?",
    a: "Ja, mit belegten Werten: erzeugte Kilowattstunden aus dem Monitoring, Anteil am Strombedarf, Zeitraum und Stand. Pauschale Umwelt- oder Neutralitätsaussagen ohne Nachweis sind seit 27.09.2026 nach Richtlinie (EU) 2024/825 unzulässig; irreführende Werbung verbietet § 2 UWG.",
  },
];

const QUELLEN = [
  { titel: "Verordnung (EU) 2023/1804 über den Aufbau der Infrastruktur für alternative Kraftstoffe (AFIR)", url: "https://eur-lex.europa.eu/eli/reg/2023/1804/oj", stand: "09/2023" },
  { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1 (Ladeeinrichtungen)", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
  { titel: "Richtlinie (EU) 2024/825 (Umweltaussagen, anzuwenden seit 27.09.2026)", url: "https://eur-lex.europa.eu/eli/dir/2024/825/oj", stand: "03/2024" },
  { titel: "OVE – Richtlinien (u. a. R 11-1 Feuerwehr, R 2000-7-7N90 überdachte Stellplätze)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
];

const WEITER = [
  { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur für Betriebe", text: "AC und DC, Lastmanagement, Abrechnung." },
  { href: "/solarcarport", titel: "Solarcarport & Parkplatz-PV", text: "Fahrzeugplatz überdachen und Strom erzeugen." },
  { href: "/ratgeber/pv-ueberschussladen", titel: "Ratgeber PV-Überschussladen", text: "Fahrzeuge mit Solarstrom laden." },
  { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Netzebenen, Rechnung und Technik." },
];

export default function AutohausPage() {
  return (
    <div>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Autohäuser und Kfz-Werkstätten in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Autohäuser, Kfz-Werkstätten und Fahrzeughandel"
        bild={HERO_BILD}
        leistungen={["PV auf Schauraum und Werkstatt", "Ladepunkte für Kundschaft und Vorführwagen", "Solarcarport für den Fahrzeugplatz", "Lastmanagement und Speicher", "Monitoring und Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe", href: "/gewerbe" }, { name: "Autohaus & Werkstatt" }]}
        eyebrow="Für Autohäuser & Werkstätten"
        title={<>Photovoltaik für <span className="ov-text-gradient-light">Autohaus und Werkstatt</span></>}
        lead={
          <>
            <span className="block font-display text-[1.15em] font-bold leading-snug text-white">Werkstatt, Schauraum und Ladepunkte – tagsüber mit Strom vom eigenen Dach.</span>
            <span className="mt-3 hidden sm:block">
              Hebebühnen, Druckluft und Beleuchtung laufen, wenn die Sonne scheint. Vorführwagen und Kundschaft laden mit dem Überschuss. Wir planen Dach,
              Ladepunkte und Carport als ein System.
            </span>
          </>
        }
        image={{ src: HERO_BILD, alt: "Schnellladesäule für Elektroautos auf einem Parkplatz (Symbolbild)", position: "50% 55%" }}
        actions={[
          { label: "Autohaus prüfen lassen", href: TERMIN },
          { label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList },
        ]}
        points={["Werkstatt-Lastprofil", "Laden für Kundschaft & Vorführwagen", "Solarcarport für den Fahrzeugplatz"]}
      />

      {/* Belegte Referenzen (Zuordnung src/data/branchenZuordnung.js): Namen nur mit Freigabe, keine Logos.
          „Ford“ nur als Kundenbezeichnung (Branche laut kunden.js). */}
      <div id="referenzen" className="scroll-mt-24">
        <BranchenReferenzen zielgruppe="autohaus" titel="Vier Ford-Partnerbetriebe mit Werkstatt arbeiten schon mit Ökovolt-Strom" />
      </div>
      <Section tone="sand" space="none" className="-mt-4 pb-14 md:pb-20">
        <p className="max-w-3xl text-[15px] leading-relaxed text-ink-600">
          Anlagen zwischen {fmtKwp(KWP_MIN)} und {fmtKwp(KWP_MAX)} kWp, zusammen {fmtKwp(KWP_SUMME)} kWp. Die Marke nennt die Branche der Betriebe –
          Firmennamen zeigen wir nur mit Freigabe, Logos gar nicht. <span className="text-ink-500">{KENNZAHLEN_HINWEIS_STAND}</span>
        </p>
      </Section>

      <Section tone="navy" space="lg" id="lastprofil" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
        <LastprofilExplorer
          dunkel
          className="relative"
          ueberschrift="h2"
          eyebrow="Beispielprofil · interaktiv"
          titel={<>Die Werkstatt arbeitet, <span className="ov-text-gradient-light">wenn die Sonne scheint.</span></>}
          lead="Schalten Sie zwischen Werkstattbetrieb und Betrieb mit Ladepunkten, zwischen Jahreszeiten und mit Speicher um."
          hinweis="Typisierte Beispielprofile (schematische Stundenwerte) – keine Messwerte eines Kunden. Ihr Ergebnis ergibt sich aus den Viertelstundenwerten Ihres Zählers."
          profile={PROFILE}
        />
      </Section>

      <Section tone="white" space="lg" id="laden">
        <SectionHeading
          eyebrow="Laden"
          title="Ladepunkte für Kundschaft, Vorführwagen und Werkstatt."
          lead="Elektroautos verkaufen, warten und übergeben braucht Ladeleistung. Mit Photovoltaik und Lastmanagement kommt ein Teil davon vom eigenen Dach – ohne den Netzanschluss zu sprengen."
          className="mb-10"
        />
        <Hebel items={LADEN} cols={4} />
        <div className="mt-8 flex flex-wrap gap-3 text-[15px]">
          <Link href="/ladeinfrastruktur" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <PlugZap aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Ladeinfrastruktur für Betriebe
          </Link>
          <Link href="/rechner/ladeinfrastruktur" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Gauge aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Ladeinfrastruktur-Rechner
          </Link>
          <Link href="/solarcarport" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Sun aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Solarcarport & Parkplatz-PV
          </Link>
        </div>
        <Hinweis className="mt-8" ton="warn" titel="Werben mit der eigenen Anlage">
          Im Schauraum zählen belegte Werte: erzeugte Kilowattstunden aus dem Monitoring, Anteil am Strombedarf, Zeitraum und Stand. Pauschale Umwelt- oder
          Neutralitätsaussagen ohne Nachweis sind seit 27.09.2026 unzulässig (Richtlinie (EU) 2024/825, § 2 UWG). Keine Rechtsberatung.
        </Hinweis>
      </Section>

      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: LineChart, title: "Lastgang & Flächen", text: "Viertelstundenwerte, Dach, Fahrzeugplatz und Netzanschluss aufnehmen." },
            { icon: PlugZap, title: "Ladekonzept", text: "Ladepunkte für Vorführwagen, Kundschaft und Werkstatt mit Lastmanagement." },
            { icon: ClipboardList, title: "Förderung & Netz", text: "Fördercall, Netzzugang und Meldung der Ladeeinrichtungen vorbereiten." },
            { icon: Wrench, title: "Bau & Betrieb", text: "Montage ohne Werkstattstillstand, danach Monitoring und Wartung." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Autohaus und Werkstatt" />
          <Faq items={FAQ} />
        </div>
      </Section>

      {/* Ansprechpartner bringt keinen eigenen Container mit */}
      <Section tone="white" space="sm">
        <Ansprechpartner zielgruppe="gewerbe" />
      </Section>

      <Section tone="sand" space="md" aria-labelledby="weiter-titel">
        <h2 id="weiter-titel" className="ov-h3 mb-8 text-ink-900">Weiterlesen</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEITER.map((w) => (
            <li key={w.href}>
              <Link href={w.href} className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 transition-colors hover:ring-ov-300">
                <span className="inline-flex items-center gap-2 font-display text-[17px] font-bold text-ink-900 group-hover:text-ov-700">
                  {w.titel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600" />
                </span>
                <span className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{w.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir Dach, Ladepunkte und Carport für Ihr Autohaus."
        text="Erstgespräch per Video oder vor Ort – mit Einschätzung zu Lastgang, Ladekonzept, Netzanschluss und Förderung."
        primary={{ label: "Autohaus prüfen lassen", href: TERMIN }}
        secondary={{ label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList }}
      />

      <section aria-labelledby="quellen-titel" className="bg-white">
        <div className="ov-container pb-6 pt-2">
          <h2 id="quellen-titel" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Quellen & Stand</h2>
          <ul className="mt-3 space-y-1 text-[13px] leading-relaxed text-ink-500">
            {QUELLEN.map((q) => (
              <li key={q.url}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">{q.titel}</a> · Stand {q.stand}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-ink-500">
            Anlagenleistungen: {KENNZAHLEN_HINWEIS_STAND}. Lastprofile sind typisierte Beispiele zur Orientierung, keine Messwerte. Seite redaktionell geprüft am {STAND}.
          </p>
        </div>
      </section>

      <Bildnachweis
        items={[{ motiv: "DC-Ladesäule auf einem Parkplatz", urheber: "Reinhard Bruckner", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/public-charger-for-electric-vehicles-4678065/" }]}
      />
    </div>
  );
}
