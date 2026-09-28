import Link from "next/link";
import {
  Activity,
  BatteryCharging,
  Cog,
  FileSpreadsheet,
  Flame,
  Gauge,
  HandCoins,
  PlugZap,
  ShieldCheck,
  Sun,
  TrendingDown,
  Waves,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import TechnikVerbund from "@/components/Loesungen/TechnikVerbund";
import { Bildnachweis, Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/gewerbespeicher";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Gewerbespeicher & Peak Shaving in Österreich | Ökovolt";
const BESCHREIBUNG =
  "Gewerbespeicher in Österreich: Peak Shaving gegen den Leistungspreis, Eigenverbrauch, Notstrom und Spotpreis – aus Ihrem Lastgang dimensioniert.";
const HERO_BILD = "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1240, height: 900 }] },
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

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe & Industrie", href: "/gewerbe" }, { name: "Gewerbespeicher" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Batteriespeicher-Container im Freien auf einem Betriebsgelände" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Lastgang senden", href: "/angebot", icon: FileSpreadsheet },
        ]}
        points={["Leistungspreis nach österreichischer Mechanik", "Dimensionierung aus dem Lastgang", "Notstrom & Blackout-Vorsorge", "Brandschutz nach OVE R 20"]}
      />

      <Kennzahlen
        items={[
          { wert: "12", label: "Monatsspitzen – ihr Mittelwert bestimmt den Leistungspreis bei gemessener Leistung" },
          { wert: "88 €/kW", label: "höchster Leistungspreis Netzebene 6 unter den neun Landes-Netzbereichen 2026 (Burgenland, gerundet)" },
          { wert: "150 €/kWh", label: "EAG-Zuschuss für Speicher bis 50 kWh – nur zusammen mit PV" },
          { wert: "22 %", label: "Öko-Investitionsfreibetrag für Stromspeicher bis 31.12.2026" },
        ]}
        quelle="Quellen: § 52 ElWOG 2010; SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025; EAG-IZV 2026 laut Leitfaden Land Oberösterreich (06/2026); WKO (Investitionsfreibetrag)."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Nutzen"
          title="Ein Speicher, sechs Aufgaben"
          lead="Ein Gewerbespeicher rechnet sich, wenn er mehrere Aufgaben gleichzeitig übernimmt. Die Reihenfolge der Prioritäten legt das Energiemanagement fest."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: TrendingDown, title: "Peak Shaving", text: "Lastspitzen über einem Zielwert kappen – jede gesenkte Monatsspitze reduziert den Leistungspreis um ein Zwölftel ihres Jahreswerts." },
            { icon: Sun, title: "Eigenverbrauch", text: "PV-Überschüsse vom Mittag in Nachmittag, Abend und Nachtschicht verschieben – statt sie für wenige Cent einzuspeisen." },
            { icon: ShieldCheck, title: "Notstrom & Ersatzstrom", text: "Kritische Verbraucher bei Netzausfall weiterversorgen – mit Netztrennung und Reserve im Speicher.", href: "/service/notstrom" },
            { icon: Activity, title: "Spotpreis-Optimierung", text: "Mit spotpreisbasiertem Liefervertrag in günstigen Stunden laden und in teuren entladen – Gebotszone Österreich." },
            { icon: PlugZap, title: "Ladeinfrastruktur puffern", text: "Schnellladepunkte ohne teuren Netzausbau betreiben – der Speicher liefert die Spitzenleistung.", href: "/ladeinfrastruktur" },
            { icon: Waves, title: "Regelenergie (Zukunft)", text: "Vermarktung von Flexibilität über Aggregatoren an den Regelreservemärkten der APG – technisch vorbereitet." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="leistungspreis">
        <Fachabschnitt
          eyebrow="Leistungspreis in Österreich"
          title="Nicht die Jahresspitze zählt, sondern zwölf Monatsspitzen."
          lead="Der Leistungspreis für gemessene Leistung wird in Österreich auf den Mittelwert der monatlich höchsten Viertelstundenleistung verrechnet. Das verändert die Strategie für Peak Shaving grundlegend."
          aside={<StandPille>Netzentgelte 2026, Netzebene 6</StandPille>}
        >
          <Prosa>
            <p>
              <strong>So funktioniert die Rechnung:</strong> Der Netzbetreiber ermittelt für jeden Monat die höchste Viertelstunde, bildet
              daraus am Ende des Abrechnungsjahres den Mittelwert und multipliziert ihn mit dem Leistungspreis in € je kW und Jahr (§ 52 ElWOG
              2010, SNE-V 2018). Eine Spitze im Jänner kostet also ein Zwölftel – aber sie kostet es sicher.
            </p>
            <p>
              <strong>Was das für den Speicher heißt:</strong> Er muss nicht jede denkbare Spitze des Jahres abfangen, sondern Monat für Monat
              zuverlässig arbeiten. Winterspitzen, Schichtbeginn und Anfahrvorgänge sind die typischen Ziele – die PV-Anlage senkt dagegen eher
              die Spitzen der Sommermonate.
            </p>
            <p>
              <strong>Ausblick 2027:</strong> Mit dem Elektrizitätswirtschaftsgesetz (ElWG) wird die Netzentgeltstruktur umgebaut; laut
              Entwürfen soll die Leistungskomponente auch auf Netzebene 7 an Gewicht gewinnen. Die konkrete Verordnung der E-Control stand im
              September 2026 noch aus – wir rechnen mit den geltenden Werten und zeigen die Sensitivität. Mehr im Ratgeber{" "}
              <Link href="/ratgeber/peak-shaving-leistungspreis">Peak Shaving und Leistungspreis</Link>.
            </p>
          </Prosa>
          <Tabelle
            className="mt-8"
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
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg" id="dimensionierung">
        <Fachabschnitt
          eyebrow="Dimensionierung"
          title="Wir berechnen den Speicher aus Ihrem Lastgang – nicht aus einem Faustwert."
          lead="Leistung und Kapazität eines Gewerbespeichers folgen aus zwölf Monaten Viertelstundenwerten. Diese sechs Schritte gehen wir mit Ihnen durch."
        >
          <Tabelle
            dicht
            caption="Vorgehen bei der Dimensionierung eines Gewerbespeichers"
            spalten={[
              { key: "schritt", label: "Schritt", breite: "w-[24%]" },
              { key: "inhalt", label: "Was wir auswerten" },
            ]}
            zeilen={DIMENSIONIERUNG}
          />
          <Hinweis className="mt-8" titel="Erste Orientierung">
            Für eine grobe Größenordnung nutzen Sie den <Link href="/rechner/stromspeicher" className="text-ov-700 underline">Stromspeicher-Rechner</Link>.
            Für Peak Shaving brauchen wir den Lastgang – Sie erhalten ihn im Kundenportal Ihres Netzbetreibers.
          </Hinweis>
        </Fachabschnitt>
      </Section>

      <Section tone="green" space="lg" id="beispiel">
        <SectionHeading
          eyebrow="Beispielrechnung"
          title="200 kW / 400 kWh in einem Salzburger Produktionsbetrieb"
          lead="Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Es zeigt, warum ein Speicher meist mehrere Nutzen braucht."
          className="mb-10"
        />
        <Tabelle
          caption="Beispielrechnung Gewerbespeicher mit Peak Shaving und PV-Verschiebung"
          spalten={[
            { key: "pos", label: "Position", breite: "w-[28%]" },
            { key: "wert", label: "Annahme / Rechnung" },
            { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
          ]}
          zeilen={BEISPIEL}
          fuss="Beispiel, Stand 09/2026. Leistungspreis Netzebene 6 Netzbereich Salzburg laut SNE-V 2026; vermiedene Bezugskosten 14,6 ct/kWh, Einspeisung 6 ct/kWh; Zyklen, Wirkungsgrad und Investitionskosten sind Annahmen (kein Ökovolt-Preis). Nicht enthalten: Arbitrage, Notstromwert, Degradation, Ersatz von Komponenten, Finanzierung. Förderungen können die IFB-Bemessungsgrundlage mindern."
        />
        <div className="mt-10">
          <Hebel
            cols={3}
            items={[
              { icon: Gauge, titel: "Ehrlich gerechnet", text: "Peak Shaving allein trägt den Speicher selten. Wir zeigen jeden Nutzen einzeln und empfehlen auch einmal keinen Speicher." },
              { icon: ShieldCheck, titel: "Notstrom hat einen Wert", text: "Was kostet eine Stunde Stillstand in Ihrem Betrieb? Diesen Wert setzen wir mit Ihnen gemeinsam an." },
              { icon: HandCoins, titel: "Steuer & Förderung", text: "Öko-IFB 22 % bis Ende 2026, EAG-Zuschuss nur bis 50 kWh und nur mit PV." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg" id="notstrom">
        <Fachabschnitt
          eyebrow="Notstrom, Arbitrage & Regelenergie"
          title="Vom Blackout-Schutz bis zur Börse"
          lead="Neben Leistungspreis und Eigenverbrauch kann ein Speicher den Betrieb absichern und Erlöse am Strommarkt erzielen. Beides stellt eigene technische Anforderungen."
        >
          <Prosa>
            <h3>Notstrom und Ersatzstrom</h3>
            <p>
              Für Ersatzstrom braucht es einen inselnetzfähigen Wechselrichter, eine automatische Netztrennung und eine definierte Reserve. Wir
              planen, welche Verbraucher versorgt werden, wie lange, und wie die Umschaltung die Anforderungen des Netzbetreibers erfüllt.
              Mehr unter <Link href="/service/notstrom">Notstrom und Blackout-Vorsorge</Link> und im Ratgeber{" "}
              <Link href="/ratgeber/blackout-vorsorge-unternehmen">Blackout-Vorsorge für Unternehmen</Link>.
            </p>
            <h3>Spotpreis und negative Preise</h3>
            <p>
              Mit einem spotpreisbasierten Liefervertrag kann der Speicher in günstigen Stunden der Gebotszone Österreich laden und in teuren
              entladen. An sonnigen Tagen fallen die Day-Ahead-Preise zu Mittag zunehmend unter null – live zu sehen unter{" "}
              <Link href="/energie-live">Strommarkt Österreich live</Link>. Hintergrund im Ratgeber{" "}
              <Link href="/ratgeber/negative-strompreise">Negative Strompreise</Link>.
            </p>
            <h3>Regelenergie und Flexibilität</h3>
            <p>
              Die Austrian Power Grid (APG) beschafft Primär-, Sekundär- und Tertiärregelreserve. Batteriespeicher können präqualifiziert und
              über Aggregatoren im Pool vermarktet werden. Für die meisten Gewerbespeicher ist das eine Zukunftsoption – vorbereitet über
              offene Schnittstellen. Vertiefung im Ratgeber{" "}
              <Link href="/ratgeber/regelenergie-flexibilitaet">Regelenergie und Flexibilität</Link>.
            </p>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="sand" space="lg" id="brandschutz">
        <Fachabschnitt
          eyebrow="Brandschutz & Normen"
          title="Sicherheit ist Planungsaufgabe, nicht Zubehör."
          lead="Lithium-Speicher im Gewerbe brauchen ein abgestimmtes Brandschutzkonzept: Zellchemie, Aufstellort, Brandabschnitte, Detektion und Einsatzplanung der Feuerwehr."
        >
          <Prosa>
            <ul>
              <li><strong>OVE-Richtlinie R 20:</strong> Sicherheitsanforderungen an stationäre elektrische Energiespeichersysteme zum Anschluss an das Niederspannungsnetz, inklusive Aufstellung.</li>
              <li><strong>OIB-Richtlinie 2 und Bauordnung:</strong> Batterieräume gelten als Räume mit erhöhter Brandgefahr; ob ein eigener Raum nötig ist, hängt von Energieinhalt, Prüfnachweisen und Landesrecht ab.</li>
              <li><strong>TRVB 165 (Batteriespeichersysteme):</strong> Mindestanforderungen an den Brandschutz größerer Batteriespeichersysteme über 250 kWh.</li>
              <li><strong>Container im Freien:</strong> Abstände zu Gebäuden und Grundgrenzen, Zufahrt für die Feuerwehr, Entlüftung und Explosionsschutz nach Herstellerangaben.</li>
              <li><strong>Technik:</strong> bevorzugt Lithium-Eisenphosphat (LFP), Batteriemanagement mit Zellüberwachung, Brand- und Gasdetektion, Fernabschaltung.</li>
            </ul>
            <p>
              Ausführlich im Ratgeber <Link href="/ratgeber/photovoltaik-brandschutz">Photovoltaik und Brandschutz</Link>; Kosten und Größen im
              Ratgeber <Link href="/ratgeber/gewerbespeicher-kosten">Gewerbespeicher-Kosten</Link>.
            </p>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Technik"
          title="Speicher, PV und Netz aus einer Steuerung"
          lead="Ein Speicher ist nur so gut wie sein Energiemanagement. Unsere eigenen Systeme verbinden Lastgang, PV, Speicher, Ladepunkte und Netzvorgaben."
          className="mb-12"
        />
        <TechnikVerbund
          texte={{
            parkregler: "Hält am Netzverknüpfungspunkt Einspeise- und Bezugsgrenzen ein – auch wenn Speicher und PV gleichzeitig arbeiten.",
            fernwartung: "Ladestände, Zelltemperaturen und Alarme im Blick; Parameter der Betriebsstrategie anpassen, ohne vor Ort zu sein.",
            scada: "Monatsspitzen live verfolgen, Zielwerte je Monat setzen und die Einsparung beim Leistungspreis dokumentieren.",
          }}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zum laufenden Speicher" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: FileSpreadsheet, title: "Lastgang-Analyse", text: "12 Monate Viertelstundenwerte, Netzrechnung und PV-Daten auswerten – mit Spitzenprofil je Monat." },
            { icon: BatteryCharging, title: "Dimensionierung & Nutzen", text: "Leistung, Kapazität und Betriebsstrategie; jeder Nutzen einzeln bewertet, mit und ohne Förderung." },
            { icon: Flame, title: "Brandschutz & Genehmigung", text: "Aufstellort, Konzept mit Feuerwehr und Versicherung, Anzeige beim Netzbetreiber, gegebenenfalls Bauverfahren." },
            { icon: Wrench, title: "Installation & Betrieb", text: "Montage, Inbetriebnahme, Einbindung in unser SCADA und Wartungsvertrag über die gesamte Laufzeit." },
          ]}
        />
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Leistungspreis, Kosten & Sicherheit" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Technik, Controlling und Geschäftsführung" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Senden Sie uns Ihren Lastgang – wir zeigen, was ein Speicher bringt."
        text="Wir werten Ihre Monatsspitzen aus und sagen Ihnen offen, ob sich ein Speicher lohnt – und in welcher Größe."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis
        items={[{ motiv: "Batteriespeicher Theiß (Ausschnitt)", urheber: "Bp 95", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Batteriespeicher_Theiss.jpg" }]}
      />
    </div>
  );
}
