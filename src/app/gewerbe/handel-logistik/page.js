// Welle C / C04: Landingpage Photovoltaik für Handel und Logistik.
//
// Inhalte: Variante „handel“ aus src/data/zielgruppen.js (Überschrift/CTA), belegte Branchen-Referenzen
// (BranchenReferenzen, Zielgruppe „handel-logistik“ – Namen nur mit Freigabe, keine Fremdlogos),
// Lastprofil-Explorer mit drei typisierten Beispielprofilen (Kühlhaus, Verteilzentrum, Markt – keine Messwerte),
// Leichtdach/Statik, Brandschutz (OVE R 11-1), Mieter/Vermieter, E-Lkw-Depotladen und AFIR.
// Keine Preise, keine Förderbeträge, keine Fristen ohne Quelle. Konfigurator nur per Link vorbelegt
// (?objekt=gewerbe&branche=handel) – der Konfigurator selbst bleibt unverändert.

import Link from "next/link";
import { ArrowRight, BatteryCharging, Building2, ClipboardList, Flame, HardHat, KeyRound, LineChart, PlugZap, Snowflake, Sun, Truck, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/B/KennzahlenBand";
import LastprofilExplorer from "@/components/Loesungen/A/LastprofilExplorer";
import BranchenReferenzen from "@/components/Referenzen/BranchenReferenzen";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { ZIELGRUPPEN } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/gewerbe/handel-logistik";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Handel & Logistik | Ökovolt";
const BESCHREIBUNG =
  "PV für Logistikhallen, Kühlhäuser, Märkte und Filialen in Österreich: Leichtdach und Statik, Brandschutz nach OVE R 11-1, Mieter/Vermieter, E-Lkw-Depotladen.";
const HERO_BILD = "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg";
const STAND = "12.10.2026";

const TERMIN = "/termin?art=video&thema=gewerbe";
// Konfigurator-Vorbelegung nur über Link-Parameter (C04, Punkt 4)
const ANFRAGE = "/angebot?objekt=gewerbe&branche=handel";

/** Variante „handel“ aus zielgruppen.js – Rückfall auf den Gewerbe-Standard, falls sie fehlt. */
function handelVariante() {
  const g = ZIELGRUPPEN.gewerbe;
  const v = g?.varianten?.find((x) => x.schluessel?.[0] === "handel");
  return v ? { ...v, id: "handel" } : { ...g.standard, id: "standard" };
}

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
    id: "kuehlhaus",
    label: "Kühlhaus",
    icon: "Snowflake",
    titel: "Kühlhaus und Tiefkühllager (Beispielprofil)",
    last: [0.72, 0.7, 0.7, 0.7, 0.7, 0.72, 0.76, 0.8, 0.84, 0.88, 0.92, 0.96, 0.99, 1, 1, 0.98, 0.95, 0.9, 0.85, 0.8, 0.77, 0.75, 0.74, 0.73],
    lastSaison: {
      uebergang: [0.66, 0.65, 0.65, 0.65, 0.65, 0.66, 0.7, 0.73, 0.76, 0.79, 0.82, 0.84, 0.86, 0.87, 0.87, 0.85, 0.83, 0.8, 0.76, 0.72, 0.7, 0.68, 0.67, 0.66],
      winter: [0.62, 0.61, 0.61, 0.61, 0.61, 0.62, 0.65, 0.68, 0.7, 0.71, 0.72, 0.73, 0.74, 0.74, 0.74, 0.73, 0.72, 0.71, 0.69, 0.66, 0.64, 0.63, 0.62, 0.62],
    },
    pvFaktor: 0.35,
    text: "Kälteanlagen laufen rund um die Uhr und arbeiten an warmen Nachmittagen am stärksten – genau dann, wenn die Solarkurve oben ist.",
    punkte: ["Sehr hohe Grundlast: fast jede Solar-Kilowattstunde wird direkt genutzt", "Kältespeicher (Temperaturband nutzen) verschiebt zusätzlichen Eigenverbrauch"],
    link: { label: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" },
  },
  {
    id: "verteilzentrum",
    label: "Verteilzentrum",
    icon: "Warehouse",
    titel: "Verteilzentrum im Zweischichtbetrieb (Beispielprofil)",
    last: [0.22, 0.2, 0.2, 0.22, 0.3, 0.55, 0.78, 0.82, 0.8, 0.78, 0.76, 0.72, 0.7, 0.74, 0.78, 0.8, 0.78, 0.74, 0.7, 0.62, 0.55, 0.45, 0.32, 0.25],
    pvFaktor: 1.3,
    marken: [
      { h: 5, label: "Schichtbeginn" },
      { h: 21.5, label: "Lkw-Depot lädt" },
    ],
    text: "Große Dachflächen, mittlere Last aus Fördertechnik, Beleuchtung, Toren und Staplerladung – ein Teil des Sommerstroms bleibt übrig.",
    punkte: ["Stapler und E-Transporter mittags laden statt nachts", "Überschuss für E-Lkw, Energiegemeinschaft oder Direktvermarktung"],
    link: { label: "E-Flotten-Rechner", href: "/rechner/e-flotte" },
  },
  {
    id: "markt",
    label: "Markt & Filiale",
    icon: "ShoppingCart",
    titel: "Lebensmittelmarkt mit Kühlmöbeln (Beispielprofil)",
    last: [0.42, 0.4, 0.4, 0.4, 0.42, 0.5, 0.75, 0.88, 0.92, 0.94, 0.96, 0.98, 1, 1, 0.99, 0.98, 0.96, 0.95, 0.92, 0.8, 0.55, 0.46, 0.44, 0.42],
    pvFaktor: 0.6,
    marken: [
      { h: 7, label: "Öffnung" },
      { h: 19.5, label: "Ladenschluss" },
    ],
    text: "Kühlregale, Beleuchtung, Backstation und Klima laufen in den Öffnungszeiten – Lastgang und Solarkurve decken sich gut.",
    punkte: ["Parkplatz als Solarcarport mit Ladepunkten für Kundinnen und Kunden", "Filialnetz: gleiche Technik, ein Monitoring für alle Standorte"],
    link: { label: "Solarcarport & Parkplatz-PV", href: "/solarcarport" },
  },
];

const DACH = [
  {
    icon: HardHat,
    titel: "Leichtdach & Tragreserve",
    text: "Viele Hallen haben Trapezblech- oder Sandwichdächer mit wenig Tragreserve. Wir lassen die Statik zuerst prüfen und wählen dann zwischen dachparalleler Befestigung und leichter Aufständerung – Ballast nur, wo die Reserve reicht.",
  },
  {
    icon: Snowflake,
    titel: "Schneelast nach ÖNORM",
    text: "Bemessen wird nach ÖNORM B 1991-1-3 mit der Schneelast des Grundstücks. Den Richtwert Ihres Standorts zeigt die Schneelast-Karte; die verbindliche Zahl liefert die Statik.",
  },
  {
    icon: Flame,
    titel: "Brandschutz nach OVE R 11-1",
    text: "Kennzeichnung am Hauptverteiler, Übersichtsplan für die Feuerwehr und geschützte DC-Leitungen ab Gebäudeeintritt. Abstände zu Brandwänden und Modulfeldgrößen richten sich nach OIB-Richtlinie 2 bzw. 2.1 im jeweiligen Bundesland.",
  },
  {
    icon: Wrench,
    titel: "Dachhaut & Betrieb",
    text: "Dachzustand vor dem Bau, Durchdringungen vermeiden, Wartungswege, Lichtkuppeln und RWA-Klappen frei halten – damit Dach und Anlage gleich lange halten.",
  },
];

const FAQ = [
  {
    q: "Trägt das Dach unserer Logistikhalle eine PV-Anlage?",
    a: "Das entscheidet die Statik. Leichte Trapezblech- und Sandwichdächer haben oft wenig Reserve; dann kommen dachparallele Systeme mit geringem Eigengewicht infrage, ohne Ballast. Wir lassen die Tragfähigkeit vor dem Angebot prüfen und rechnen mit der Schneelast nach ÖNORM B 1991-1-3. Ohne statischen Nachweis bauen wir nicht.",
  },
  {
    q: "Was verlangt der Brandschutz auf großen Hallendächern?",
    a: "Die OVE-Richtlinie R 11-1 regelt unter anderem Kennzeichnung, Übersichtsplan für die Feuerwehr und den Schutz der DC-Leitungen. Abstände zu Brandwänden und Dachöffnungen sowie die Größe der Modulfelder legen die OIB-Richtlinien 2 und 2.1 fest, so wie sie das jeweilige Bundesland verbindlich erklärt hat. Dazu kommen Auflagen von Behörde und Versicherung im Einzelfall.",
  },
  {
    q: "Wir sind nur Mieter der Halle – geht Photovoltaik trotzdem?",
    a: "Ja, wenn der Eigentümer zustimmt. Üblich sind drei Wege: Der Eigentümer baut und verkauft Ihnen den Strom, Sie bauen selbst mit Dachnutzungsvertrag, oder ein Dritter betreibt die Anlage. Entscheidend sind Laufzeit des Mietvertrags, Rückbau, Haftung und wer die Anlage bei einem Mieterwechsel übernimmt. Die Verträge prüft Ihre Rechtsberatung; wir liefern die technischen Grundlagen.",
  },
  {
    q: "Gilt die EU-Verordnung AFIR für unser Lkw-Depot?",
    a: "Die AFIR (Verordnung (EU) 2023/1804) stellt ihre Anforderungen an öffentlich zugängliche Ladepunkte, etwa Ad-hoc-Zahlung und Preisangabe. Ein Depot, in dem nur die eigene Flotte auf dem Betriebsgelände lädt, ist in der Regel nicht öffentlich zugänglich. Sobald Dritte laden können oder nach Kilowattstunden abgerechnet wird, prüfen wir AFIR und Eichrecht im Einzelfall.",
  },
  {
    q: "Wie groß sollte die Anlage für ein Verteilzentrum sein?",
    a: "Nicht die Dachfläche bestimmt die Größe, sondern der Lastgang. Wir werten die Viertelstundenwerte Ihres Zählers aus, legen die Anlage nach Eigenverbrauch aus und planen den Überschuss bewusst ein – für E-Lkw, Stapler, Speicher, Energiegemeinschaft oder Direktvermarktung.",
  },
];

const QUELLEN = [
  { titel: "OVE – Richtlinien (u. a. R 11-1 Feuerwehr, R 2000-7-7N90 überdachte Stellplätze)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
  { titel: "OIB – OIB-Richtlinie 2.1 Brandschutz bei Betriebsbauten, Ausgabe Mai 2023", url: "https://www.oib.or.at/wp-content/uploads/richtlinien/richtlinie_2023/oib-rl_2.1_ausgabe_mai_2023.pdf", stand: "05/2023" },
  { titel: "Verordnung (EU) 2023/1804 über den Aufbau der Infrastruktur für alternative Kraftstoffe (AFIR)", url: "https://eur-lex.europa.eu/eli/reg/2023/1804/oj", stand: "09/2023" },
  { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1 (Ladeeinrichtungen)", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
  { titel: "ÖNORM B 1991-1-3 Schneelasten (Bemessungsgrundlage; Richtwert über die Schneelast-Karte)", url: "/schneelast", stand: "09/2026" },
];

const WEITER = [
  { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Netzebenen, Rechnung und Technik im Überblick." },
  { href: "/ratgeber/photovoltaik-flachdach", titel: "Ratgeber Flachdach", text: "Aufständerung, Ballast, Abdichtung." },
  { href: "/ratgeber/photovoltaik-brandschutz", titel: "Ratgeber Brandschutz", text: "OIB-RL 2, OVE R 11-1 und Feuerwehr." },
  { href: "/solarcarport", titel: "Solarcarport & Parkplatz-PV", text: "Kundenparkplatz als Kraftwerk." },
];

export default function HandelLogistikPage() {
  const v = handelVariante();

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Handel und Logistik in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Handel, Großhandel, Filialbetriebe, Logistik, Kühlhäuser und Speditionen"
        bild={HERO_BILD}
        leistungen={["PV auf Logistik- und Kühlhallen", "PV für Märkte und Filialnetze", "Statik- und Brandschutzplanung", "Ladeinfrastruktur für E-Lkw und Kundenparkplätze", "Speicher und Lastmanagement", "Monitoring und Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe", href: "/gewerbe" }, { name: "Handel & Logistik" }]}
        eyebrow={v.eyebrow}
        title={<>Photovoltaik für <span className="ov-text-gradient-light">Handel und Logistik</span></>}
        lead={
          <>
            <span className="block font-display text-[1.15em] font-bold leading-snug text-white">
              {v.titel} {v.akzent}
            </span>
            {/* Langer Text erst ab Tablet – mobil bleibt der Handlungsknopf im ersten Bildschirm */}
            {/* Ab Desktop kleiner gesetzt (wie PageHero bei langen Leads), damit die Handlungsknöpfe im ersten Bildschirm bleiben */}
            <span className="mt-3 hidden sm:block lg:text-[16px] lg:leading-relaxed">{v.lead}</span>
          </>
        }
        image={{ src: HERO_BILD, alt: "Luftbild eines großen Gewerbedachs mit Photovoltaikmodulen (Symbolbild)", position: "50% 50%" }}
        actions={[
          { label: v.cta || "Standort prüfen lassen", href: TERMIN },
          { label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList },
        ]}
        /* Drei Punkte halten die Handlungsknöpfe auch am Desktop im ersten Bildschirm (QA C04) */
        points={["Leichtdach & Statik", "Brandschutz OVE R 11-1", "E-Lkw-Depot & Kundenladen"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <KennzahlenBand
        items={[
          { text: "15 min", label: "Viertelstundenwerte des Zählers – Grundlage jeder Auslegung" },
          { text: "B 1991-1-3", label: "ÖNORM für die Schneelast – vor jedem Hallendach geprüft" },
          { text: "R 11-1", label: "OVE-Richtlinie: Kennzeichnung und Feuerwehrplan für PV-Anlagen" },
          { text: "AFIR", label: "EU-Regeln für öffentlich zugängliche Ladepunkte – nicht fürs interne Depot" },
        ]}
        quelle="Quellen: OVE-Richtlinien (R 11-1); ÖNORM B 1991-1-3; Verordnung (EU) 2023/1804 (AFIR). Redaktionsstand 12.10.2026."
      />

      {/* Belegte Referenzen (Zuordnung src/data/branchenZuordnung.js): Namen nur mit Freigabe, keine Logos */}
      <BranchenReferenzen zielgruppe="handel-logistik" titel="Handel und Logistik, die schon mit Ökovolt-Strom arbeiten" />

      <Section tone="navy" space="lg" id="lastprofil" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
        <LastprofilExplorer
          dunkel
          className="relative"
          ueberschrift="h2"
          eyebrow="Beispielprofile · interaktiv"
          titel={<>Kühlhaus, Verteilzentrum, Markt – <span className="ov-text-gradient-light">drei Lastgänge, drei Anlagen.</span></>}
          lead="Wie viel Solarstrom ein Betrieb selbst nutzt, hängt am Tagesverlauf seines Verbrauchs. Schalten Sie zwischen den Betriebsarten, Jahreszeiten und mit Speicher um."
          hinweis="Typisierte Beispielprofile (schematische Stundenwerte) – keine Messwerte eines Kunden. Ihr Ergebnis ergibt sich erst aus den Viertelstundenwerten Ihres Zählers."
          profile={PROFILE}
        />
      </Section>

      <Section tone="white" space="lg" id="dach">
        <SectionHeading
          eyebrow="Dach, Statik & Brandschutz"
          title="Hallendächer sind groß – aber selten für zusätzliche Last gebaut."
          lead="Bevor wir Module zählen, klären wir Tragreserve, Schneelast, Dachhaut und Brandschutz. Das spart später Nachträge und Ärger mit der Versicherung."
          className="mb-10"
        />
        <Hebel items={DACH} cols={4} />
        <div className="mt-8 flex flex-wrap gap-3 text-[15px]">
          <Link href="/schneelast" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Snowflake aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Schneelast-Karte: Richtwert für Ihren Standort
          </Link>
          <Link href="/ratgeber/photovoltaik-flachdach" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Building2 aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Ratgeber Photovoltaik auf dem Flachdach
          </Link>
          <Link href="/ratgeber/photovoltaik-brandschutz" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Flame aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Ratgeber Brandschutz
          </Link>
        </div>
      </Section>

      <Section tone="sand" space="lg" id="mieter-vermieter">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Mieter & Vermieter"
            title="Die Halle gehört nicht Ihnen? Dann regeln wir zuerst, wem die Anlage gehört."
            lead="In Handel und Logistik sind gemietete Hallen die Regel. Photovoltaik funktioniert trotzdem – mit klaren Verträgen."
          />
          <div>
            <Prosa>
              <p>
                <strong>Eigentümer baut, Mieter kauft den Strom:</strong> Der Vermieter investiert und liefert den Solarstrom an Sie – etwa über einen
                Liefervertrag vor Ort. Hintergründe im Ratgeber <Link href="/ratgeber/ppa-oesterreich">PPA in Österreich</Link>.
              </p>
              <p>
                <strong>Mieter baut auf fremdem Dach:</strong> Sie investieren selbst und schließen mit dem Eigentümer einen Dachnutzungsvertrag. Die
                Laufzeit sollte zur Lebensdauer der Anlage passen, nicht nur zum Mietvertrag.
              </p>
              <p>
                <strong>Dritte betreiben die Anlage:</strong> Miete, Leasing oder Contracting – Vergleich im Ratgeber{" "}
                <Link href="/ratgeber/photovoltaik-mieten-oder-kaufen">Photovoltaik mieten oder kaufen</Link>.
              </p>
            </Prosa>
            <Hinweis className="mt-6" titel="Das gehört in jeden Vertrag">
              Laufzeit und Verlängerung, Zustimmung zu Dacharbeiten, Haftung und Versicherung, Zugang für Wartung, Umgang mit Dachsanierung, Rückbau und
              was bei einem Mieterwechsel passiert. Die Verträge prüft Ihre Rechtsberatung – keine Rechtsberatung durch uns.
            </Hinweis>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg" id="e-lkw">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="E-Lkw & Depotladen"
              title="Das Depot wird zur Tankstelle – und das Dach liefert einen Teil der Energie."
              lead="Elektrische Lkw und Transporter laden meist über Nacht im Depot, Stapler und Zustellfahrzeuge oft auch tagsüber. Wir planen Photovoltaik, Ladepunkte, Speicher und Lastmanagement als ein System – passend zur Anschlussleistung."
            />
            <ul className="mt-8 space-y-4">
              {[
                { icon: PlugZap, titel: "Anschlussleistung zuerst", text: "Ladeleistung, Netzanschluss und Meldung beim Netzbetreiber nach TOR – Lastmanagement verteilt die Leistung, statt den Anschluss auszubauen." },
                { icon: BatteryCharging, titel: "Speicher als Puffer", text: "Mittagsüberschuss für die Abendladung speichern und Lastspitzen beim gleichzeitigen Laden kappen." },
                { icon: Truck, titel: "Tourenplan statt Bauchgefühl", text: "Wann welches Fahrzeug steht und wie viel es nachladen muss, bestimmt Anzahl und Leistung der Ladepunkte." },
              ].map((p) => (
                <li key={p.titel} className="flex gap-4 rounded-2xl bg-sand-50 p-5">
                  <p.icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-ov-600" />
                  <div>
                    <h3 className="font-display text-[16.5px] font-semibold text-ink-900">{p.titel}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <Hinweis ton="warn" titel="AFIR gilt für öffentlich zugängliche Ladepunkte">
              Die EU-Verordnung AFIR (Verordnung (EU) 2023/1804) stellt Anforderungen an öffentlich zugängliche Ladepunkte, etwa Ad-hoc-Zahlung und
              transparente Preise. Ein Depot, in dem nur die eigene Flotte auf dem Betriebsgelände lädt, ist in der Regel nicht öffentlich zugänglich.
              Laden Kundinnen, Kunden oder Subunternehmer gegen Bezahlung, prüfen wir AFIR und Eichrecht im Einzelfall. Keine Rechtsberatung.
            </Hinweis>
            <div className="rounded-[1.5rem] bg-navy-950 p-6 text-white md:p-7">
              <p className="font-display text-[18px] font-bold">Selbst rechnen – ohne Daten</p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {[
                  { href: "/rechner/e-flotte", label: "E-Flotten-Rechner" },
                  { href: "/rechner/ladeinfrastruktur", label: "Ladeinfrastruktur-Rechner" },
                  { href: "/rechner/peak-shaving", label: "Peak-Shaving-Rechner" },
                  { href: "/ladeinfrastruktur", label: "Ladeinfrastruktur für Betriebe" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex min-h-11 items-center gap-2 text-white/85 hover:text-white">
                      <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-300 transition-transform group-hover:translate-x-0.5" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: LineChart, title: "Lastgang & Flächen", text: "Viertelstundenwerte, Dachflächen, Parkplätze und Netzanschluss aufnehmen." },
            { icon: HardHat, title: "Statik & Brandschutz", text: "Tragreserve, Schneelast, Brandabschnitte und Feuerwehrplan klären." },
            { icon: KeyRound, title: "Verträge & Förderung", text: "Eigentum, Dachnutzung, Fördercall und Netzzugang vorbereiten." },
            { icon: Sun, title: "Bau im laufenden Betrieb", text: "Etappen um Hauptsaison und Anlieferzeiten herum, danach Monitoring und Wartung." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Handel und Logistik" />
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
                <span className="font-display text-[17px] font-bold text-ink-900 group-hover:text-ov-700">{w.titel}</span>
                <span className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{w.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Prüfen wir Ihr Hallendach – bevor Sie Module zählen."
        text="Erstgespräch per Video oder vor Ort: Lastgang, Statik, Brandschutz, Eigentumsverhältnisse und Ladepunkte – mit ehrlicher Einschätzung, ob sich das Dach lohnt."
        primary={{ label: v.cta || "Standort prüfen lassen", href: TERMIN }}
        secondary={{ label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList }}
      />

      <section aria-labelledby="quellen-titel" className="bg-white">
        <div className="ov-container pb-6 pt-2">
          <h2 id="quellen-titel" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Quellen & Stand</h2>
          <ul className="mt-3 space-y-1 text-[13px] leading-relaxed text-ink-500">
            {QUELLEN.map((q) => (
              <li key={q.url}>
                {q.url.startsWith("/") ? (
                  <Link href={q.url} className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">{q.titel}</Link>
                ) : (
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">{q.titel}</a>
                )}{" "}
                · Stand {q.stand}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-ink-500">
            Lastprofile sind typisierte Beispiele zur Orientierung, keine Messwerte. Referenzen: Angaben Ökovolt Österreich. Seite redaktionell geprüft am {STAND}.
          </p>
        </div>
      </section>

      <Bildnachweis
        items={[{ motiv: "Luftbild Gewerbedach mit PV", urheber: "Giant Asparagus", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/aerial-view-of-rooftop-solar-panel-installation-35691079/" }]}
      />
    </div>
  );
}
