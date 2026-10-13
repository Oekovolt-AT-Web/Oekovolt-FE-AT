import Link from "next/link";
import { Activity, BatteryCharging, Cog, FileSpreadsheet, Flame, Gauge, HandCoins, ShieldCheck, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/B/KennzahlenBand";
import FotoBento from "@/components/Loesungen/B/FotoBento";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import Rechenbeleg from "@/components/Loesungen/B/Rechenbeleg";
import DunkelSektion, { SystemKarten } from "@/components/Loesungen/B/DunkelSektion";
import Lastkurve from "@/components/Loesungen/B/Lastkurve";
import FoerdercallHinweis from "@/components/Foerdercall/FoerdercallHinweis";
import BranchenReferenzen from "@/components/Referenzen/BranchenReferenzen";
import IfbHinweis from "@/components/Verkauf/IfbHinweis";
import EinwandKarten from "@/components/Verkauf/EinwandKarten";
import UnsereZusagen from "@/components/Verkauf/UnsereZusagen";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/gewerbespeicher";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Gewerbespeicher: Batteriespeicher für Betriebe | Ökovolt";
const BESCHREIBUNG =
  "Batteriespeicher für Betriebe in Österreich: Peak Shaving gegen den Leistungspreis, Eigenverbrauch, Notstrom und Spotpreis – aus Ihrem Lastgang dimensioniert.";
const HERO_BILD = "/Images/AT/loesungen-b/speicher-produktionshalle.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1280 }] },
};

// Primärquellen zur Leistungskomponente ab 2027 (Welle A04, geprüft am 11.10.2026 im Volltext des Entwurfs).
const ELWG_RIS = { titel: "ElWG, BGBl. I Nr. 91/2025 (RIS)", href: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" };
const SNE_ENTWURF = {
  titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen",
  href: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf",
  stand: "Entwurf vom 29.06.2026",
};

const FAQ = [
  {
    q: "Wie wird der Leistungspreis in Österreich berechnet?",
    a: "Bei Kunden mit gemessener Leistung verrechnet der Netzbetreiber den arithmetischen Mittelwert der monatlich höchsten Viertelstundenleistung (§ 52 ElWOG 2010). Jede Monatsspitze zählt also zu einem Zwölftel. Ein Speicher, der die Spitze in einem einzelnen Monat verfehlt, kostet deshalb nur diesen Monat – nicht das ganze Jahr.",
  },
  {
    q: "Ab wann lohnt sich ein Gewerbespeicher?",
    a: "Wenn mehrere Nutzen zusammenkommen: kurze, hohe Lastspitzen, ein hoher Leistungspreis auf Netzebene 5 bis 7, PV-Überschüsse, die sonst billig eingespeist würden, und Bedarf an Ersatzstrom. Peak Shaving allein trägt die Investition selten; zusammen mit Eigenverbrauch, Notstrom und Investitionsfreibetrag oft schon. Wir rechnen jeden Nutzen einzeln aus Ihrem Lastgang.",
  },
  {
    q: "Wie groß muss der Speicher sein?",
    a: "Die Leistung in kW ergibt sich aus der Höhe der Spitzen über dem Zielwert, die Kapazität in kWh aus ihrer Dauer – beides aus den Viertelstundenwerten eines ganzen Jahres. Dazu kommen PV-Überschuss, gewünschte Notstromreserve und nutzbare Entladetiefe. Ein Faustwert ersetzt diese Analyse nicht; unser Stromspeicher-Rechner hilft bei der ersten Orientierung.",
  },
  {
    q: "Kann der Speicher bei einem Stromausfall den Betrieb versorgen?",
    a: "Ja, wenn er dafür ausgelegt ist: mit inselnetzfähigem Wechselrichter, automatischer Netztrennung und einer Reserve im Speicher, die im Normalbetrieb nicht entladen wird. Meist versorgen wir ausgewählte Verbraucher wie IT, Kühlung, Tore, Beleuchtung und Steuerungen. Die Anforderungen des Netzbetreibers an Umschaltung und Netzrückwirkung sind dabei einzuhalten.",
  },
  {
    q: "Was gilt beim Brandschutz für Batteriespeicher?",
    a: "Für stationäre Speicher am Niederspannungsnetz gilt die OVE-Richtlinie R 20. Ob ein eigener Batterieraum nötig ist, richtet sich nach der OIB-Richtlinie 2 und der Bauordnung des Landes; für größere Batteriespeichersysteme über 250 kWh gibt es die Technische Richtlinie Vorbeugender Brandschutz TRVB 165. Wir stimmen Aufstellort, Brandabschnitte und Einsatzkonzept früh mit Feuerwehr und Versicherung ab.",
  },
  {
    q: "Gibt es eine Förderung für Gewerbespeicher?",
    a: "Der EAG-Investitionszuschuss fördert Stromspeicher mit 150 € je kWh, allerdings nur gemeinsam mit einer neuen oder erweiterten PV-Anlage, bis 50 kWh und mit mindestens 0,5 kWh je kWp. Unabhängig davon gelten Stromspeicher als ökologische Investition für den Investitionsfreibetrag – bis 31. Dezember 2026 mit 22 %. Speicher ohne PV werden vom EAG nicht gefördert.",
  },
  {
    q: "Kann ein Gewerbespeicher mit dem Spotpreis Geld verdienen?",
    a: "Mit einem spotpreisbasierten Liefervertrag ja: Der Speicher lädt in günstigen oder negativen Stunden der Gebotszone Österreich und entlädt in teuren. Der Ertrag hängt von der Preisspreizung ab und schwankt von Jahr zu Jahr. Wir berücksichtigen ihn vorsichtig und nur, wenn Ihr Liefervertrag das zulässt.",
  },
  {
    q: "Was ist mit Regelenergie?",
    a: "Der Übertragungsnetzbetreiber APG beschafft Regelreserve, für die auch Batteriespeicher präqualifiziert werden können – bei kleineren Anlagen über einen Aggregator im Pool. Für die meisten Gewerbespeicher ist das heute eine Zusatzoption für die Zukunft. Wir planen Kommunikation und Steuerung so, dass sie später möglich ist.",
  },
];

const LEISTUNGSPREISE = [
  { bereich: "Burgenland", lp: "87,96 €/kW", ap: "3,79 ct/kWh" },
  { bereich: "Kärnten", lp: "75,48 €/kW", ap: "2,33 ct/kWh" },
  { bereich: "Niederösterreich", lp: "74,28 €/kW", ap: "2,56 ct/kWh" },
  { bereich: "Oberösterreich", lp: "65,88 €/kW", ap: "2,37 ct/kWh" },
  { bereich: "Salzburg", lp: "66,60 €/kW", ap: "2,86 ct/kWh" },
  { bereich: "Steiermark", lp: "64,56 €/kW", ap: "2,77 ct/kWh" },
  { bereich: "Tirol", lp: "72,12 €/kW", ap: "2,95 ct/kWh" },
  { bereich: "Vorarlberg", lp: "58,44 €/kW", ap: "2,42 ct/kWh" },
  { bereich: "Wien", lp: "59,52 €/kW", ap: "1,93 ct/kWh" },
];
// Für die interaktive Lastkurve: dieselben Werte als Zahl
const NETZBEREICHE = LEISTUNGSPREISE.map((l) => ({ name: l.bereich, lp: Number(l.lp.replace(/[^\d,]/g, "").replace(",", ".")) }));

const DIMENSIONIERUNG = [
  { schritt: "Lastgang", inhalt: "12 Monate Viertelstundenwerte, idealerweise mit PV-Erzeugung; Ausreißer (Tests, Störungen) markieren." },
  { schritt: "Spitzenprofil", inhalt: "Je Monat: höchste Viertelstunde, Dauer und Häufigkeit der Spitzen, Energie oberhalb möglicher Zielwerte." },
  { schritt: "Zielwert", inhalt: "Kappungsgrenze je Monat so wählen, dass die Einsparung beim Leistungspreis die Speicherkosten am besten trägt." },
  { schritt: "Leistung (kW)", inhalt: "Differenz aus Spitze und Zielwert plus Reserve – bestimmt Wechselrichter und Netzanschluss des Speichers." },
  { schritt: "Kapazität (kWh)", inhalt: "Längste zusammenhängende Episode über dem Zielwert, geteilt durch nutzbare Entladetiefe; plus PV-Verschiebung und Notstromreserve." },
  { schritt: "Betriebsstrategie", inhalt: "Prioritäten im Energiemanagement: Spitze vor Eigenverbrauch vor Arbitrage; Ladestand vor typischen Spitzenzeiten sichern." },
];

const BEISPIEL = [
  { pos: "Betrieb", wert: "Metallverarbeitung, Netzebene 6, Netzbereich Salzburg, 300-kWp-PV vorhanden", ergebnis: "–" },
  { pos: "Mittel der Monatsspitzen", wert: "vorher 420 kW → mit Speicher 300 kW", ergebnis: "− 120 kW" },
  { pos: "Einsparung Leistungspreis", wert: "120 kW × 66,60 €/kW und Jahr", ergebnis: "≈ 7.990 €/Jahr" },
  { pos: "PV-Überschuss verschoben", wert: "400 kWh × 90 % × 200 Zyklen = 72.000 kWh × (14,6 − 6,0 ct)", ergebnis: "≈ 6.190 €/Jahr" },
  { pos: "Betrieb & Wartung", wert: "Annahme", ergebnis: "− 1.000 €/Jahr" },
  { pos: "Jährlicher Vorteil", wert: "ohne Arbitrage, ohne Notstromwert", ergebnis: "≈ 13.180 €/Jahr", hervorheben: true },
  { pos: "Investition", wert: "Annahme 200 kW / 400 kWh, 400 €/kWh netto inkl. Wechselrichter und EMS", ergebnis: "160.000 €" },
  { pos: "EAG-Speicherzuschuss", wert: "nur mit PV-Erweiterung: 50 kWh × 150 €", ergebnis: "− 7.500 €" },
  { pos: "Statische Amortisation", wert: "152.500 € ÷ 13.180 €/Jahr", ergebnis: "≈ 11,6 Jahre", hervorheben: true },
  { pos: "Öko-IFB 22 % (bis 31.12.2026)", wert: "Freibetrag auf 152.500 €, Körperschaftsteuer 23 %", ergebnis: "≈ 7.700 € Steuerwirkung" },
];

function TabKopf({ titel, text, children }) {
  return (
    <div>
      <h3 className="ov-h3 text-ink-900">{titel}</h3>
      {text && <p className="mt-4 text-[16px] leading-relaxed text-ink-600">{text}</p>}
      {children}
    </div>
  );
}

export default async function GewerbespeicherPage({ searchParams }) {
  const v = zielgruppenVariante("speicher", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Gewerbespeicher und Peak Shaving in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gewerbe, Industrie, Landwirtschaft, Gemeinden"
        bild={HERO_BILD}
        leistungen={["Lastganganalyse und Speicherdimensionierung", "Peak Shaving", "Eigenverbrauchsoptimierung", "Notstrom und Ersatzstrom", "Spotpreis-Optimierung", "Brandschutzkonzept für Batteriespeicher"]}
      />

      {/* Blendet sich nach Call-Ende (22.10.2026) selbst aus */}
      <FoerdercallHinweis />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe & Industrie", href: "/gewerbe" }, { name: "Gewerbespeicher" }]}
        eyebrow={v.eyebrow}
        title={<>Gewerbespeicher für <span className="ov-text-gradient-light">Peak Shaving, Eigenverbrauch und Notstrom</span></>}
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">{v.titel} {v.akzent}</span><span className="mt-3 block">{v.lead}</span></>}
        image={{ src: HERO_BILD, alt: "Helle Produktionshalle mit Maschinen und Lagerregalen", position: "center 60%" }}
        actions={[
          { label: v.cta, href: "/termin?art=video&thema=speicher" },
          { label: "Lastgang senden", href: "/angebot?objekt=gewerbe&speicher=1", icon: FileSpreadsheet },
        ]}
        points={["Leistungspreis nach österreichischer Mechanik", "Dimensionierung aus dem Lastgang", "Notstrom & Blackout-Vorsorge", "Brandschutz nach OVE R 20"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      >
        {/* Einstieg für Betriebe mit bestehender PV: Lastgang im Browser auswerten, Speicher nachrüsten */}
        <Link
          href="/lastgang-analyse?zweck=speicher-nachruesten"
          className="w21-auf group mt-5 inline-flex min-h-11 max-w-full items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-4 text-[14px] text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ "--w21-d": "860ms" }}
        >
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 text-white">
            <Activity className="h-4 w-4" />
          </span>
          <span className="min-w-0 leading-snug">
            <strong className="font-semibold text-white">Ich habe bereits eine PV-Anlage</strong> – Lastgang auswerten und Speicher nachrüsten
          </span>
        </Link>
      </PageHero>

      <KennzahlenBand
        items={[
          { wert: 12, label: "Monatsspitzen – ihr Mittelwert bestimmt den Leistungspreis bei gemessener Leistung" },
          { wert: 88, suffix: " €/kW", label: "höchster Leistungspreis Netzebene 6 unter den neun Landes-Netzbereichen 2026 (Burgenland, gerundet)" },
          { wert: 150, suffix: " €/kWh", label: "EAG-Zuschuss für Speicher bis 50 kWh – nur zusammen mit PV" },
          { wert: 22, suffix: " %", label: "Öko-Investitionsfreibetrag für Stromspeicher bis 31.12.2026" },
        ]}
        quelle="Quellen: § 52 ElWOG 2010; SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025; EAG-IZV 2026 laut Leitfaden Land Oberösterreich (06/2026); WKO (Investitionsfreibetrag)."
      />

      {/* Blendet sich nach 31.12.2026 selbst aus */}
      <IfbHinweis zusatz="Stromspeicher zählen als ökologische Investition." />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Nutzen"
          title="Ein Speicher, sechs Aufgaben"
          lead="Ein Gewerbespeicher rechnet sich, wenn er mehrere Aufgaben gleichzeitig übernimmt. Die Reihenfolge der Prioritäten legt das Energiemanagement fest."
          className="mb-12"
        />
        <FotoBento
          items={[
            { bild: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg", alt: "Batteriespeicher-Container auf einem Betriebsgelände", tag: "Kernnutzen", titel: "Peak Shaving", text: "Lastspitzen über einem Zielwert kappen – jede gesenkte Monatsspitze reduziert den Leistungspreis um ein Zwölftel ihres Jahreswerts.", position: "70% 50%" },
            { bild: "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg", alt: "Luftbild eines Industriedachs mit Photovoltaikmodulen", titel: "Eigenverbrauch", text: "PV-Überschüsse vom Mittag in Nachmittag, Abend und Nachtschicht verschieben – statt sie für wenige Cent einzuspeisen." },
            { bild: "/Images/AT/ratgeber/blackout-vorsorge-unternehmen.jpg", alt: "Notstromaggregat im Container vor einem Betriebsgebäude", titel: "Notstrom & Ersatzstrom", text: "Kritische Verbraucher bei Netzausfall weiterversorgen – mit Netztrennung und Reserve im Speicher.", href: "/service/notstrom" },
            { bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Großbildwand (Symbolbild)", titel: "Spotpreis-Optimierung", text: "Mit spotpreisbasiertem Liefervertrag in günstigen Stunden laden und in teuren entladen – Gebotszone Österreich." },
            { bild: "/Images/AT/loesungen-b/laden-tiefgarage.jpg", alt: "Elektroautos an Ladepunkten in einer Tiefgarage", titel: "Ladeinfrastruktur puffern", text: "Schnellladepunkte ohne teuren Netzausbau betreiben – der Speicher liefert die Spitzenleistung.", href: "/ladeinfrastruktur" },
            { bild: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg", alt: "Eingezäunte Batteriespeicher-Anlage mit Containern und Trafostationen", titel: "Regelenergie (Zukunft)", text: "Vermarktung von Flexibilität über Aggregatoren an den Regelreservemärkten der APG – technisch vorbereitet." },
          ]}
        />
      </Section>

      {/* Beweise: echte Projekte der Zielgruppe (A03) – ohne Treffer rendert die Komponente nichts */}
      <BranchenReferenzen zielgruppe="industrie" max={4} />

      <Section tone="sand" space="lg" id="leistungspreis">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Leistungspreis in Österreich" title="Nicht die Jahresspitze zählt, sondern zwölf Monatsspitzen." />
          <div>
            <p className="text-[16.5px] leading-relaxed text-ink-600">
              Der Leistungspreis für gemessene Leistung wird in Österreich auf den Mittelwert der monatlich höchsten Viertelstundenleistung verrechnet. Das verändert die Strategie für Peak Shaving grundlegend.
            </p>
            <StandPille className="mt-5">Netzentgelte 2026, Netzebene 6</StandPille>
          </div>
        </div>
        <Lastkurve netzbereiche={NETZBEREICHE} standardBereich="Salzburg" />

        {/* Der Leistungspreis-Hebel gehört hierher: Speicher planbar, PV nur anteilig */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10">
          <Hinweis titel="Speicher kappt Spitzen planbar – die PV allein nur an sonnigen Tagen.">
            Die Leistungskomponente richtet sich nach Ihrer höchsten Viertelstunde im Monat. Eine PV-Anlage senkt sie nur, wenn die Spitze zur Mittagszeit und bei Sonne
            liegt; Winterspitzen, Schichtbeginn und Anfahrvorgänge fängt nur ein Speicher mit Lastmanagement ab – Monat für Monat, unabhängig vom Wetter. Wie viel das bei
            Ihrem Leistungspreis ausmacht, zeigt der Peak-Shaving-Rechner mit den Netzentgelten Ihres Netzbereichs.
          </Hinweis>
          <div className="flex flex-col gap-3 lg:items-start">
            <Button href="/rechner/peak-shaving" size="lg" pfeil icon={Gauge}>Peak-Shaving-Rechner</Button>
            <p className="text-[13.5px] leading-snug text-ink-600">Ohne Anmeldung, mit Ihren Monatsspitzen – Richtwert, kein Angebot.</p>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Ehrlich gerechnet"
          title="Ein Speicher braucht meist mehrere Nutzen."
          text="Peak Shaving allein trägt den Speicher selten. Wir zeigen jeden Nutzen einzeln und empfehlen auch einmal keinen Speicher – die vollständige Beispielrechnung für einen Salzburger Produktionsbetrieb finden Sie in den Fachdetails."
          points={[
            { title: "Notstrom hat einen Wert", text: "Was kostet eine Stunde Stillstand in Ihrem Betrieb? Diesen Wert setzen wir mit Ihnen gemeinsam an." },
            { title: "Steuer & Förderung", text: "Öko-IFB 22 % bis Ende 2026, EAG-Zuschuss nur bis 50 kWh und nur mit PV." },
            { title: "Erste Orientierung", text: "Für eine grobe Größenordnung nutzen Sie den Stromspeicher-Rechner; für Peak Shaving brauchen wir den Lastgang aus dem Kundenportal Ihres Netzbetreibers." },
          ]}
          image={{ src: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg", alt: "Batteriespeicher-Anlage mit Containern und Trafostationen hinter einem Zaun" }}
          action={{ label: "Zur Beispielrechnung", href: "#fachdetails" }}
        />
      </Section>

      <DunkelSektion
        eyebrow="Technik"
        title="Speicher, PV und Netz aus einer Steuerung"
        lead="Ein Speicher ist nur so gut wie sein Energiemanagement. Parkregler, Fernwartung und SCADA setzen wir mit unserem Technologiepartner Solensa um – parametriert, betreut und gewartet von uns – und verbinden Lastgang, PV, Speicher, Ladepunkte und Netzvorgaben."
        bild={{
          src: "/Images/AT/loesungen-b/speicher-schaltanlage.jpg",
          alt: "Reihe von Schalt- und Schutzschränken in einem hellen Technikraum",
          position: "90% 50%",
          badge: "Prioritäten im Energiemanagement: Spitze vor Eigenverbrauch vor Arbitrage.",
        }}
      >
        <SystemKarten
          texte={{
            parkregler: "Hält am Netzverknüpfungspunkt Einspeise- und Bezugsgrenzen ein – auch wenn Speicher und PV gleichzeitig arbeiten.",
            fernwartung: "Ladestände, Zelltemperaturen und Alarme im Blick; Parameter der Betriebsstrategie anpassen, ohne vor Ort zu sein.",
            scada: "Monatsspitzen live verfolgen, Zielwerte je Monat setzen und die Einsparung beim Leistungspreis dokumentieren.",
          }}
        />
      </DunkelSektion>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zum laufenden Speicher" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: FileSpreadsheet, title: "Lastgang-Analyse", text: "12 Monate Viertelstundenwerte, Netzrechnung und PV-Daten auswerten – mit Spitzenprofil je Monat." },
            { icon: BatteryCharging, title: "Dimensionierung & Nutzen", text: "Leistung, Kapazität und Betriebsstrategie; jeder Nutzen einzeln bewertet, mit und ohne Förderung." },
            { icon: Flame, title: "Brandschutz & Genehmigung", text: "Aufstellort, Konzept mit Feuerwehr und Versicherung, Anzeige beim Netzbetreiber, gegebenenfalls Bauverfahren." },
            { icon: Wrench, title: "Installation & Betrieb", text: "Montage, Inbetriebnahme, Einbindung in SCADA und Fernwartung, Wartungsvertrag über die gesamte Laufzeit." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg" id="fachdetails" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Für Technik, Controlling & Einkauf"
          title="Die Fachdetails – kompakt nachgeschlagen"
          lead="Netzentgelte je Netzbereich, Vorgehen bei der Dimensionierung, die vollständige Beispielrechnung sowie Notstrom, Markt und Brandschutz."
          className="mb-10"
        />
        <FachTabs
          tabs={[
            {
              id: "leistungspreis",
              label: "Leistungspreis",
              icon: <Gauge />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                  <Prosa>
                    <p>
                      <strong>So funktioniert die Rechnung:</strong> Der Netzbetreiber ermittelt für jeden Monat die höchste Viertelstunde, bildet daraus am Ende des Abrechnungsjahres den Mittelwert und multipliziert ihn mit dem
                      Leistungspreis in € je kW und Jahr (§ 52 ElWOG 2010, SNE-V 2018). Eine Spitze im Jänner kostet also ein Zwölftel – aber sie kostet es sicher.
                    </p>
                    <p>
                      <strong>Was das für den Speicher heißt:</strong> Er muss nicht jede denkbare Spitze des Jahres abfangen, sondern Monat für Monat zuverlässig arbeiten. Winterspitzen, Schichtbeginn und Anfahrvorgänge sind die
                      typischen Ziele – die PV-Anlage senkt dagegen nur die Spitzen sonniger Sommermonate.
                    </p>
                    <p>
                      <strong>Ausblick 2027 – geplant laut Entwurf:</strong> Das ElWG (
                      <a href={ELWG_RIS.href} target="_blank" rel="noopener noreferrer">BGBl. I Nr. 91/2025</a>) ordnet die Netzentgelte neu. Der Begutachtungsentwurf der E-Control zur
                      Systemnutzungsentgelte-Grundsatzverordnung (<a href={SNE_ENTWURF.href} target="_blank" rel="noopener noreferrer">SNE-G-V, {SNE_ENTWURF.stand}</a>) sieht ab 1. Jänner 2027 einen
                      Monatsleistungspreis auf Basis des höchsten Viertelstundenwerts je Kalendermonat vor – grundsätzlich für jeden Entnehmer, auf Netzebene 7 zweistufig ab 10 kW – und als Zielwert binnen
                      drei Jahren je 50 % Arbeits- und Leistungsanteil. Die Beträge legt die Tarifverordnung fest, die noch aussteht; wir rechnen mit den geltenden Werten und zeigen die Sensitivität. Mehr im
                      Ratgeber <Link href="/ratgeber/peak-shaving-leistungspreis">Peak Shaving und Leistungspreis</Link>.
                    </p>
                  </Prosa>
                  <Tabelle
                    dicht
                    caption="Leistungspreise und Arbeitspreise Netzebene 6 im Jahr 2026 nach Netzbereich"
                    spalten={[
                      { key: "bereich", label: "Netzbereich", breite: "w-[34%]" },
                      { key: "lp", label: "Leistungspreis / Jahr" },
                      { key: "ap", label: "Arbeitspreis" },
                    ]}
                    zeilen={LEISTUNGSPREISE}
                    fuss="Quelle: SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025, § 5 Abs. 1 Z 5 (Netznutzungsentgelt Netzebene 6, gemessene Leistung, netto). Städtische Netzbereiche (z. B. Linz, Graz, Innsbruck, Klagenfurt) haben eigene Werte."
                  />
                </div>
              ),
            },
            {
              id: "dimensionierung",
              label: "Dimensionierung",
              icon: <BatteryCharging />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="Wir berechnen den Speicher aus Ihrem Lastgang – nicht aus einem Faustwert."
                    text="Leistung und Kapazität eines Gewerbespeichers folgen aus zwölf Monaten Viertelstundenwerten. Diese sechs Schritte gehen wir mit Ihnen durch."
                  >
                    <Hinweis className="mt-8" titel="Erste Orientierung">
                      Für eine grobe Größenordnung nutzen Sie den <Link href="/rechner/stromspeicher" className="text-ov-700 underline">Stromspeicher-Rechner</Link>, für Peak Shaving den{" "}
                      <Link href="/rechner/peak-shaving" className="text-ov-700 underline">Peak-Shaving-Rechner</Link>. Den Lastgang erhalten Sie im Kundenportal Ihres Netzbetreibers – oder Sie werten ihn
                      vorab selbst aus: <Link href="/lastgang-analyse?zweck=speicher-nachruesten" className="text-ov-700 underline">Lastgang-Analyse im Browser</Link>.
                    </Hinweis>
                  </TabKopf>
                  <Tabelle
                    dicht
                    caption="Vorgehen bei der Dimensionierung eines Gewerbespeichers"
                    spalten={[
                      { key: "schritt", label: "Schritt", breite: "w-[24%]" },
                      { key: "inhalt", label: "Was wir auswerten" },
                    ]}
                    zeilen={DIMENSIONIERUNG}
                  />
                </div>
              ),
            },
            {
              id: "beispiel",
              label: "Beispielrechnung",
              icon: <HandCoins />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="200 kW / 400 kWh in einem Salzburger Produktionsbetrieb"
                    text="Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Es zeigt, warum ein Speicher meist mehrere Nutzen braucht."
                  />
                  <Rechenbeleg
                    titel="Peak Shaving und PV-Verschiebung"
                    caption="Beispielrechnung Gewerbespeicher mit Peak Shaving und PV-Verschiebung"
                    zeilen={BEISPIEL}
                    fuss="Beispiel, Stand 09/2026. Leistungspreis Netzebene 6 Netzbereich Salzburg laut SNE-V 2026; vermiedene Bezugskosten 14,6 ct/kWh, Einspeisung 6 ct/kWh; Zyklen, Wirkungsgrad und Investitionskosten sind Annahmen (kein Ökovolt-Preis). Nicht enthalten: Arbitrage, Notstromwert, Degradation, Ersatz von Komponenten, Finanzierung. Förderungen können die IFB-Bemessungsgrundlage mindern."
                  />
                </div>
              ),
            },
            {
              id: "notstrom",
              label: "Notstrom & Markt",
              icon: <ShieldCheck />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="Vom Blackout-Schutz bis zur Börse"
                    text="Neben Leistungspreis und Eigenverbrauch kann ein Speicher den Betrieb absichern und Erlöse am Strommarkt erzielen. Beides stellt eigene technische Anforderungen."
                  />
                  <Prosa>
                    <h3>Notstrom und Ersatzstrom</h3>
                    <p>
                      Für Ersatzstrom braucht es einen inselnetzfähigen Wechselrichter, eine automatische Netztrennung und eine definierte Reserve. Wir planen, welche Verbraucher versorgt werden, wie lange, und wie die Umschaltung
                      die Anforderungen des Netzbetreibers erfüllt. Mehr unter <Link href="/service/notstrom">Notstrom und Blackout-Vorsorge</Link> und im Ratgeber{" "}
                      <Link href="/ratgeber/blackout-vorsorge-unternehmen">Blackout-Vorsorge für Unternehmen</Link>.
                    </p>
                    <h3>Spotpreis und negative Preise</h3>
                    <p>
                      Mit einem spotpreisbasierten Liefervertrag kann der Speicher in günstigen Stunden der Gebotszone Österreich laden und in teuren entladen. An sonnigen Tagen fallen die Day-Ahead-Preise zu Mittag zunehmend unter
                      null – live zu sehen unter <Link href="/energie-live">Strommarkt Österreich live</Link>. Hintergrund im Ratgeber <Link href="/ratgeber/negative-strompreise">Negative Strompreise</Link>.
                    </p>
                    <h3>Regelenergie und Flexibilität</h3>
                    <p>
                      Die Austrian Power Grid (APG) beschafft Primär-, Sekundär- und Tertiärregelreserve. Batteriespeicher können präqualifiziert und über Aggregatoren im Pool vermarktet werden. Für die meisten Gewerbespeicher ist
                      das eine Zukunftsoption – vorbereitet über offene Schnittstellen. Vertiefung im Ratgeber <Link href="/ratgeber/regelenergie-flexibilitaet">Regelenergie und Flexibilität</Link>.
                    </p>
                  </Prosa>
                </div>
              ),
            },
            {
              id: "brandschutz",
              label: "Brandschutz & Normen",
              icon: <Flame />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="Sicherheit ist Planungsaufgabe, nicht Zubehör."
                    text="Lithium-Speicher im Gewerbe brauchen ein abgestimmtes Brandschutzkonzept: Zellchemie, Aufstellort, Brandabschnitte, Detektion und Einsatzplanung der Feuerwehr."
                  />
                  <Prosa>
                    <ul>
                      <li><strong>OVE-Richtlinie R 20:</strong> Sicherheitsanforderungen an stationäre elektrische Energiespeichersysteme zum Anschluss an das Niederspannungsnetz, inklusive Aufstellung.</li>
                      <li><strong>OIB-Richtlinie 2 und Bauordnung:</strong> Batterieräume gelten als Räume mit erhöhter Brandgefahr; ob ein eigener Raum nötig ist, hängt von Energieinhalt, Prüfnachweisen und Landesrecht ab.</li>
                      <li><strong>TRVB 165 (Batteriespeichersysteme):</strong> Mindestanforderungen an den Brandschutz größerer Batteriespeichersysteme über 250 kWh.</li>
                      <li><strong>Container im Freien:</strong> Abstände zu Gebäuden und Grundgrenzen, Zufahrt für die Feuerwehr, Entlüftung und Explosionsschutz nach Herstellerangaben.</li>
                      <li><strong>Technik:</strong> bevorzugt Lithium-Eisenphosphat (LFP), Batteriemanagement mit Zellüberwachung, Brand- und Gasdetektion, Fernabschaltung.</li>
                    </ul>
                    <p>
                      Ausführlich im Ratgeber <Link href="/ratgeber/photovoltaik-brandschutz">Photovoltaik und Brandschutz</Link>; Kosten und Größen im Ratgeber{" "}
                      <Link href="/ratgeber/gewerbespeicher-kosten">Gewerbespeicher-Kosten</Link>.
                    </p>
                  </Prosa>
                </div>
              ),
            },
          ]}
        />
      </Section>

      {/* Einwände vor der FAQ – die Seite hat eine eigene FAQ mit Schema, daher ohne zweites FAQPage-Schema */}
      <EinwandKarten gruppe="gewerbe" ids={["netz-voll", "zu-teuer", "strompreise"]} mitSchema={false} rahmen />

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Technik, Controlling und Geschäftsführung" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Leistungspreis, Kosten & Sicherheit" />

      {/* Zusagen (nur freigegebene) und Ansprechpartner (nur mit Einwilligung, sonst Teamfunktion) – A03 */}
      <UnsereZusagen rahmen />
      <Ansprechpartner zielgruppe="gewerbe" rahmen />

      <CtaBand
        eyebrow="Lastgang rein, Speicherauslegung raus"
        title="Senden Sie uns Ihren Lastgang – wir zeigen, was ein Speicher bringt."
        text="Wir werten Ihre Monatsspitzen aus und sagen Ihnen offen, ob sich ein Speicher lohnt – und in welcher Größe. Jeder Nutzen einzeln gerechnet, mit und ohne Förderung."
        primary={{ label: v.cta, href: "/termin?art=video&thema=speicher" }}
        secondary={{ label: "Anfrage mit Lastgang starten", href: "/angebot?objekt=gewerbe&speicher=1", icon: Cog }}
      />

      <Bildnachweis
        items={[
          { motiv: "Batteriespeicher Theiß (Ausschnitt)", urheber: "Bp 95", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Batteriespeicher_Theiss.jpg" },
          { motiv: "Batteriespeicher-Anlage", urheber: "Qurren", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Nirazuka_Battery_Storage_Power_Station_2.jpg" },
          { motiv: "Netzleitwarte (Symbolbild)", urheber: "Dpysh w", lizenz: "CC BY 3.0", href: "https://commons.wikimedia.org/wiki/File:ERCOTOperator_2.jpg" },
          { motiv: "Produktionshalle", urheber: "Freek Wolsink", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/modern-industrial-warehouse-interior-with-machinery-34207364/" },
          { motiv: "Industriedach mit PV", urheber: "Giant Asparagus", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/aerial-view-of-rooftop-solar-panel-installation-35691079/" },
          { motiv: "Schaltanlage", urheber: "Shameer Vayalakkad Hydrose", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/modern-control-room-with-electrical-panels-33706868/" },
          { motiv: "Ladepunkte in der Tiefgarage", urheber: "Jakub Zerdzicki", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/eco-friendly-electric-cars-in-underground-parking-28851165/" },
        ]}
      />
    </div>
  );
}
