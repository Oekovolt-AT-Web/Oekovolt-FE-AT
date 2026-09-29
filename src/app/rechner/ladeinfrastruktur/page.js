// src/app/rechner/ladeinfrastruktur/page.js

import Link from "next/link";
import { ClipboardCheck, Gauge, Network, Scale } from "lucide-react";
import { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import FlotteLadeSeite from "@/components/RechnerGewerbe/FlotteLadeSeite";
import LadeRechner from "@/components/RechnerGewerbe/LadeRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { JAHRESZEITEN, KOSTEN, KUNDEN_LADEN, MELDEGRENZE_KVA } from "@/lib/rechner/ladeinfrastruktur";
import { SOLAR, fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/ladeinfrastruktur";
const eur = (v) => `${fmt(v)} €`;

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Ladeinfrastruktur-Planer für Betriebe | Ökovolt",
  description:
    "Ladeinfrastruktur-Planer für Österreich: Ladepunkte AC/DC, Spitzenlast mit und ohne Lastmanagement, Netzanschluss, PV und Speicher – mit Richtkosten und Meldepflicht.",
  keywords: [
    "Ladeinfrastruktur planen",
    "Ladepunkte berechnen Firma",
    "Lastmanagement Ladestationen",
    "Anschlussleistung Ladepark",
    "Ladestation Netzbetreiber melden Österreich",
    "Ladeinfrastruktur Kosten Unternehmen",
  ],
});

const FAQ = [
  {
    q: "Wie viele Ladepunkte braucht ein Betrieb?",
    a: "Das hängt von Standzeit und Tagesstrecke ab, nicht nur von der Zahl der Fahrzeuge. Firmenfahrzeuge über Nacht und Mitarbeitende im Tagdienst brauchen meist einen AC-Ladepunkt je Fahrzeug – bei Schichtbetrieb teilen sich zwei Schichten einen Punkt. Für Kundschaft zählt die Gleichzeitigkeit: Aus Ladevorgängen pro Tag, Verweildauer und Öffnungszeit ergibt sich, wie viele DC- oder AC-Punkte gleichzeitig belegt sind, plus eine Reserve gegen Wartezeiten.",
  },
  {
    q: "Was bringt dynamisches Lastmanagement?",
    a: "Ohne Steuerung laden alle Fahrzeuge sofort nach der Ankunft mit voller Leistung – die Spitze fällt oft genau auf die Zeit, in der auch das Gebäude am meisten braucht. Dynamisches Lastmanagement misst den Verbrauch am Netzanschluss und verteilt die freie Leistung über die ganze Standzeit, PV-Überschuss zuerst. Die Spitze sinkt dadurch häufig um die Hälfte oder mehr – das spart Anschlusserhöhung und Leistungspreis.",
  },
  {
    q: "Müssen Ladestationen beim Netzbetreiber gemeldet werden?",
    a: `Ja. In Österreich sind Ladeeinrichtungen über ${fmt(MELDEGRENZE_KVA, 2)} kVA nach den Technischen und Organisatorischen Regeln (TOR) und den TAEV beim Netzbetreiber meldepflichtig – das betrifft praktisch jede Wallbox mit 11 oder 22 kW. Größere Leistungen prüft der Netzbetreiber vor der Errichtung und gibt sie schriftlich frei. Die Meldung erledigt der konzessionierte Elektrotechniker. Planen Sie bei größeren Ladeparks einige Wochen Vorlauf ein.`,
  },
  {
    q: "Wann ist eine Erhöhung der Anschlussleistung nötig?",
    a: `Wenn die höchste Viertelstunde aus Gebäude und Laden auch mit Lastmanagement über der vereinbarten Anschlussleistung liegt. Der Planer rechnet dafür bewusst mit einem trüben Tag ohne PV. Für jedes zusätzliche kW fällt einmalig das Netzbereitstellungsentgelt an – auf Netzebene 7 zwischen ${fmt(KOSTEN.nbe[0])} € (Vorarlberg) und ${fmt(KOSTEN.nbe[1], 2)} € (Salzburg) je kW laut Systemnutzungsentgelte-Verordnung 2026 –, dazu das Netzzutrittsentgelt nach Aufwand. Ein Speicher kann Spitzen kappen und eine Erhöhung oft vermeiden.`,
  },
  {
    q: "AC oder DC – was ist für unseren Standort richtig?",
    a: "Überall dort, wo Fahrzeuge mehrere Stunden stehen, ist AC mit 11 kW die wirtschaftlichste und netzschonendste Lösung – in zehn Stunden lassen sich über 100 kWh laden. DC mit 50 bis 150 kW lohnt sich für kurze Standzeiten: Kundenparkplatz, Zwischenladen von Transportern oder Lkw-Depots. Viele Standorte kombinieren viele AC-Punkte mit wenigen DC-Punkten.",
  },
  {
    q: "Was bedeuten OCPP und Eichrecht?",
    a: "OCPP (Open Charge Point Protocol) ist der offene Standard, über den Ladepunkte mit einem Backend und dem Lastmanagement sprechen – Ladepunkte mit OCPP 1.6J oder 2.0.1 machen Sie unabhängig vom Hersteller. Das Eichrecht betrifft die Abrechnung: Wer Dritten Strom nach Kilowattstunden verrechnet, braucht nach dem Maß- und Eichgesetz eichrechtskonforme Zähler (BEV). Für kostenloses Laden oder rein interne Flotten gilt das nicht; ein MID-Zähler je Punkt ist für die Kostenzuordnung trotzdem sinnvoll.",
  },
  {
    q: "Wie genau ist der Ladeinfrastruktur-Planer?",
    a: "Er simuliert einen typischen Betriebstag in 96 Viertelstunden aus Gebäudelastprofil, PV-Erzeugung der gewählten Jahreszeit, Ankunftszeiten und Ladebedarf. Das ist eine gute erste Orientierung für Budget und Netzanfrage. Für die Ausführungsplanung werten wir Ihren echten Lastgang aus (Viertelstundenwerte vom Netzbetreiber oder Smart Meter), prüfen Leitungswege, Verteiler und Brandschutz und stimmen die Anschlussleistung mit dem Netzbetreiber ab.",
  },
];

export default function Page() {
  return (
    <FlotteLadeSeite
      pfad={PFAD}
      toolId="ladeinfrastruktur"
      breadcrumb="Ladeinfrastruktur-Planer"
      eyebrow="Ladeinfrastruktur-Planer"
      title={
        <>
          Wie viele Ladepunkte <span className="ov-text-gradient-light">verträgt Ihr Netzanschluss?</span>
        </>
      }
      lead="Ladepunkte, Spitzenlast und Anschlussleistung für Flotte, Mitarbeitende und Kundschaft – als Tageslastkurve mit und ohne Lastmanagement, mit PV und Speicher."
      chips={["Kostenlos & ohne Anmeldung", "96 Viertelstunden simuliert", "Mit Richtkosten"]}
      app={{
        name: "Ökovolt Ladeinfrastruktur-Planer",
        description:
          "Plant Ladeinfrastruktur für Unternehmen in Österreich: Anzahl AC- und DC-Ladepunkte, Tageslastkurve mit und ohne Lastmanagement, Spitzenlast gegenüber der Anschlussleistung, PV und Speicher, Richtkosten und Hinweise zu Meldepflicht, OCPP und Eichrecht.",
        featureList: [
          "Ladepunkte AC 11/22 kW und DC",
          "Tageslastkurve in 15-Minuten-Schritten",
          "Spitzenlast mit und ohne Lastmanagement",
          "Prüfung der Anschlussleistung",
          "PV-Überschussladen",
          "Speicher zur Spitzenkappung",
          "Richtkosten-Spanne",
          "Meldepflicht, OCPP und Eichrecht",
        ],
      }}
      rechner={<LadeRechner />}
      fakten={{
        eyebrow: "Netz & Recht kompakt",
        title: "Was vor dem ersten Spatenstich geklärt sein muss",
        lead: "Ladeinfrastruktur scheitert selten an der Wallbox – sondern am Netzanschluss, an der Meldung oder an der Abrechnung. Die vier wichtigsten Punkte, Stand September 2026.",
        bild: { src: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Luftbild eines Parkplatzes mit Solar-Carports und Ladestationen (Symbolbild)", caption: "Solarcarports liefern Ladestrom dort, wo die Fahrzeuge stehen." },
        items: [
          { icon: ClipboardCheck, wert: `${fmt(MELDEGRENZE_KVA, 2)} kVA`, label: "Meldepflicht beim Netzbetreiber", text: "Jede Ladeeinrichtung darüber ist nach TOR/TAEV zu melden; größere Leistungen werden vor der Errichtung geprüft." },
          { icon: Gauge, wert: "≈ ½", label: "Ladespitze mit Lastmanagement", text: "In unseren Beispielen sinkt die Spitze durch dynamisches Lastmanagement um rund die Hälfte – der Planer zeigt Ihren Wert." },
          { icon: Network, wert: `${fmt(KOSTEN.nbe[0])}–${fmt(Math.round(KOSTEN.nbe[1]))} €`, label: "je kW Anschlusserhöhung", text: "Netzbereitstellungsentgelt auf Netzebene 7 (SNE-V 2026), dazu das Netzzutrittsentgelt nach Aufwand." },
          { icon: Scale, wert: "OCPP", label: "Offen, eichrechtskonform", text: "OCPP für herstellerunabhängiges Lastmanagement; eichrechtskonforme Zähler, sobald Dritte nach kWh zahlen." },
        ],
        quelle: "Quellen: E-Control TOR Teil D / TAEV (z. B. Netz NÖ, Salzburg Netz); Systemnutzungsentgelte-Verordnung 2026; Maß- und Eichgesetz (BEV); AFIR (EU) 2023/1804.",
      }}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Ein Betriebstag in 96 Viertelstunden."
            lead="Der Netzbetreiber verrechnet und begrenzt die höchste Viertelstunde – deshalb rechnet der Planer genau in dieser Auflösung und legt den Anschluss auf einen trüben Tag ohne Sonne aus."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              <strong>Ohne Lastmanagement</strong> kommen die Fahrzeuge gestaffelt an und laden sofort mit voller Leistung, bis ihr Tagesbedarf gedeckt ist. <strong>Mit Lastmanagement</strong> verteilt der Energiemanager dieselbe Energie über die ganze Standzeit und füllt zuerst Lasttäler und PV-Überschuss – Kundschaft an DC-Punkten lädt dabei immer ungebremst. Ein Speicher kappt zusätzlich die verbleibende Spitze.
            </p>
            <p>
              Aus Standzeit und Tagesenergie ergibt sich die Ladeleistung je Fahrzeug: Reichen 11 kW nicht, schlägt der Planer 22 kW oder DC vor. Für Kundenparkplätze bestimmen Ladevorgänge, Verweildauer und Öffnungszeit die Gleichzeitigkeit.
            </p>
            <p>
              Was die Umstellung der Flotte insgesamt bringt, zeigt der <Link href="/rechner/e-flotte">E-Flotte-Rechner</Link>. Wie wir Ladeparks mit Solarcarport, Speicher und Abrechnung umsetzen, lesen Sie unter <Link href="/ladeinfrastruktur">Ladeinfrastruktur für Unternehmen</Link>; Spitzenkappung mit Batterien erklären wir bei den <Link href="/gewerbespeicher">Gewerbespeichern</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Zeitauflösung", "15 Minuten (96 Werte/Tag)"],
        ["Auslegung Netzanschluss", "trüber Tag, 10 % Reserve"],
        ["Grundlast außerhalb der Betriebszeit", "25 % der Spitzenlast"],
        ["PV je kWp: Sommer · Übergang · Winter", `${fmt(JAHRESZEITEN.sommer.kwhProKwp, 1)} · ${fmt(JAHRESZEITEN.uebergang.kwhProKwp, 1)} · ${fmt(JAHRESZEITEN.winter.kwhProKwp, 1)} kWh/Tag`],
        ["Kundenladen AC 22 · DC 50 · DC 150", `${KUNDEN_LADEN.ac22.kwh} · ${KUNDEN_LADEN.dc50.kwh} · ${KUNDEN_LADEN.dc150.kwh} kWh/Vorgang`],
        ["Mittlere Ladeleistung am Fahrzeug", `${KUNDEN_LADEN.ac22.mittel} · ${KUNDEN_LADEN.dc50.mittel} · ${KUNDEN_LADEN.dc150.mittel} kW`],
        ["Speicherleistung", `${fmt(SOLAR.gewerbeSpeicherCRate * 100)} % der Kapazität je h`],
        ["AC-Ladepunkt inkl. Montage", `${eur(KOSTEN.ac[0])} – ${eur(KOSTEN.ac[1])}`],
        ["DC 50 kW · DC 150 kW", `${fmt(KOSTEN.dc50[0] / 1000)}–${fmt(KOSTEN.dc50[1] / 1000)} · ${fmt(KOSTEN.dc150[0] / 1000)}–${fmt(KOSTEN.dc150[1] / 1000)} T€`],
        ["Netzbereitstellungsentgelt NE 7", `${fmt(KOSTEN.nbe[0])} – ${fmt(KOSTEN.nbe[1], 2)} €/kW`],
      ]}
      quellen={[
        { name: "Netz NÖ – Meldepflichtige Geräte", url: "https://netz-noe.at/strom/meldepflichtige-geraete" },
        { name: "Salzburg Netz – TAEV-Ausführungsbestimmungen", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/netzanschluss/Stromnetz_TAEV_Ausfuehrungsbestimmungen.pdf" },
        { name: "WKO NÖ – Technischer Leitfaden Anschluss von Ladestationen", url: "https://www.wko.at/noe/gewerbe-handwerk/fahrzeugtechnik/technischer-leitfaden-fuer-elektriker-anschluss-von-ladestat.pdf" },
        { name: "RIS – Systemnutzungsentgelte-Verordnung", url: "https://www.ris.bka.gv.at/geltendefassung.wxe?abfrage=bundesnormen&gesetzesnummer=20010107" },
        { name: "Wiener Netze – Stromnetzbedingungen", url: "https://www.wienernetze.at/stromnetzbedingungen" },
        { name: "PVGIS (EU JRC)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
      ]}
      faq={FAQ}
      faqTitel="Ladeinfrastruktur: Netz, Recht & Technik"
      cta={{
        title: "Ihr Ladepark – geplant mit Ihrem echten Lastgang.",
        text: "Wir werten Ihre Viertelstundenwerte aus, planen AC- und DC-Punkte, Lastmanagement, PV und Speicher und übernehmen die Meldung beim Netzbetreiber – in ganz Österreich.",
        primary: { label: "Konzept anfragen", href: "/angebot?objekt=gewerbe&wallbox=1" },
        secondary: { label: "Termin vereinbaren", href: "/termin?art=video" },
      }}
    />
  );
}
