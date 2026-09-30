// src/app/lastgang-analyse/page.js
//
// Lastgang-Analyse (Masterplan #11): 15-Minuten-CSV aus dem Netzbetreiber-Portal im Browser
// auswerten – Jahresverbrauch, Lastprofil (Tagesgang/Wochentage/Monate/Heatmap), Grundlast,
// Spitzen, PV-Größe für hohen Eigenverbrauch (PVGIS), Peak-Shaving-Speicher (grob).
//
// DATENSCHUTZ: Die Datei wird ausschließlich im Browser gelesen (File-API) und nie übertragen.
// Logik: src/lib/lastgang/* (Test: node scripts/lastgang.test.mjs) · UI: src/components/Lastgang/*
// Beispieldatei (synthetisch): public/beispiele/lastgang-beispiel.csv, erzeugt aus src/lib/lastgang/beispiel.js

import Link from "next/link";
import { FileSpreadsheet, LogIn, MousePointerClick } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { AnnahmenBox, WeitereRechner, rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import { Fachdetails } from "@/components/Forderungen/Shared/Premium";
import { Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import LastgangAnalyse from "@/components/Lastgang/LastgangAnalyse";
import { HEIMAT_SLUG, pvgisQuelle, regionenNachLand } from "@/lib/regionen";
import { NETZ_QUELLE, PS_ANNAHMEN } from "@/lib/rechner/peakshaving";
import { PVGIS_QUELLE, SONNE_QUELLE } from "@/lib/lastgang/pv";
import { zahl } from "@/lib/lastgang/format";
import { BASE_URL } from "@/lib/site";

const PFAD = "/lastgang-analyse";
const SEITE_URL = `${BASE_URL}${PFAD}`;
const STAND = "30.09.2026";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Lastgang-Analyse: 15-Minuten-Werte auswerten | Ökovolt",
  description:
    "Lastgang-CSV aus dem Netzbetreiber-Portal kostenlos auswerten – nur im Browser, ohne Upload: Jahresverbrauch, Lastprofil, Grundlast, Spitzen, PV-Größe und Peak-Shaving-Speicher.",
  keywords: ["Lastgang Analyse", "Lastgang auswerten", "Viertelstundenwerte auswerten", "Lastprofil Gewerbe", "Smart Meter CSV auswerten", "Peak Shaving Lastgang", "PV Eigenverbrauch Lastgang"],
});

/** Kompakte Ortsliste für die PV-Simulation (nur benötigte PVGIS-Felder ins Client-Bundle) */
function orteFuerPv() {
  return regionenNachLand().map((g) => ({
    land: g.land,
    name: g.name,
    orte: g.orte
      .map((r) => ({
        slug: r.slug,
        name: r.kurzname || r.name,
        lat: r.pvgis.lat,
        lon: r.pvgis.lon,
        monate_sued35: r.pvgis.monate_sued35,
        sued35_kwh_kwp: r.pvgis.sued35_kwh_kwp,
        ostwest15_kwh_kwp: r.pvgis.ostwest15_kwh_kwp,
        flach10_kwh_kwp: r.pvgis.flach10_kwh_kwp,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "de")),
  }));
}

const FAQ = [
  {
    q: "Wird meine Lastgang-Datei hochgeladen oder gespeichert?",
    a: "Nein. Ihr Browser liest die Datei direkt auf Ihrem Gerät und rechnet dort. Es gibt keinen Upload an unseren oder einen anderen Server und keine Speicherung – auch nicht im Browser-Speicher. Schließen Sie den Tab oder klicken Sie auf „Daten verwerfen“, ist alles weg. Nur wenn Sie auf „Angebot anfragen“ klicken, stehen Jahresverbrauch, Anlagengröße und gegebenenfalls Speichergröße als Zahlen im Link.",
  },
  {
    q: "Welche Dateien kann ich verwenden?",
    a: "CSV- oder Textdateien mit einem Zeitstempel und einem Messwert je Zeile, wie sie Smart-Meter- und Lastgangportale exportieren: Semikolon, Komma oder Tabulator als Trennzeichen, Datum und Uhrzeit in einer oder zwei Spalten, „von/bis“-Spalten, Werte in kWh oder kW (auch Wh/W). Vorspann-Zeilen mit Zählpunkt oder Kundendaten werden übersprungen. Excel-Dateien (.xlsx) bitte zuerst als CSV speichern.",
  },
  {
    q: "Warum braucht die Analyse Viertelstundenwerte?",
    a: "Der Netzbetreiber misst die Leistung als Mittelwert je Viertelstunde – die höchste Viertelstunde des Monats bestimmt den Leistungspreis. Stunden- oder Tageswerte glätten genau diese Spitzen weg. Stundenwerte wertet die Analyse trotzdem aus, weist aber darauf hin, dass Spitzen und Speicherbedarf dann eher unterschätzt werden.",
  },
  {
    q: "Wie genau ist die empfohlene PV-Größe?",
    a: "Sie ist ein Richtwert für die erste Planung. Die Simulation legt ein typisches PV-Profil (PVGIS-Monatswerte des gewählten Orts, Tagesverlauf aus dem Sonnenstand, typische Folge sonniger und trüber Tage) Viertelstunde für Viertelstunde über Ihren gemessenen Verbrauch. Dachfläche, Statik, Verschattung und Netzanschluss prüfen wir erst bei der Planung – sie können die sinnvolle Größe begrenzen.",
  },
  {
    q: "Wie wird die Speichergröße für Peak Shaving berechnet?",
    a: `Die Analyse sucht die kleinste Speicherkapazität, mit der Ihre gewählte Zielspitze im gesamten Messzeitraum gehalten wird – der Speicher entlädt über dem Ziel und lädt darunter aus dem Netz nach (Wirkungsgrad ${zahl(PS_ANNAHMEN.eta * 100)} %). Die empfohlene Nennkapazität enthält ${zahl((PS_ANNAHMEN.reserve - 1) * 100)} % Reserve und berücksichtigt ${zahl(PS_ANNAHMEN.sohEnde * 100)} % Restkapazität am Lebensende. Im Echtbetrieb braucht es zusätzlich eine gute Lastprognose.`,
  },
  {
    q: "Meine Datei wird nicht erkannt – was kann ich tun?",
    a: "Prüfen Sie zuerst, ob Sie Viertelstundenwerte (nicht Tageswerte oder Zählerstände) exportiert haben. Die Fehlermeldung nennt, was fehlt. Klappt es trotzdem nicht, schicken Sie uns die Datei mit Ihrer Anfrage – wir werten den Lastgang im Rahmen der Angebotserstellung aus.",
  },
];

const FORMATE = [
  { m: "Trennzeichen", w: "Semikolon, Komma, Tabulator, senkrechter Strich; Felder in Anführungszeichen" },
  { m: "Zeichensatz", w: "UTF-8 (mit oder ohne BOM), UTF-16, Windows-1252 (Umlaute aus älteren Excel-Exporten)" },
  { m: "Datum & Uhrzeit", w: "01.03.2025 07:15 · 2025-03-01T07:15 (auch mit Z oder +01:00) · 01/03/2025 · getrennte Spalten Datum und Uhrzeit · Bereiche wie „07:00 - 07:15“ · 24:00 als Tagesende" },
  { m: "Zeitstempel", w: "Intervallbeginn oder -ende (aus der Kopfzeile „von/bis“ oder aus dem ersten und letzten Wert erkannt); Sommer-/Winterzeit-Umstellung wie im Portal-Export" },
  { m: "Werte", w: "kWh, Wh oder MWh je Intervall bzw. mittlere Leistung in kW, W oder MW; Dezimalkomma oder -punkt; Einheit bei Bedarf umstellbar" },
  { m: "Mehrere Spalten", w: "Bezug wird vor Einspeisung bevorzugt (auch Langformat mit OBIS-Kennzahl 1.8.0/2.8.0); Wertspalte umstellbar" },
  { m: "Intervall & Umfang", w: "15 Minuten (empfohlen), 30 oder 60 Minuten; 5-Minuten-Werte werden zusammengefasst; mindestens sieben Tage, bei mehr als einem Jahr die letzten 365 Tage" },
];

export default function Page() {
  const orte = orteFuerPv();
  const pq = pvgisQuelle();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SEITE_URL}/#app`,
        name: "Ökovolt Lastgang-Analyse",
        url: SEITE_URL,
        description:
          "Wertet Lastgang-Dateien (15-Minuten-Werte) im Browser aus – ohne Upload: Jahresverbrauch, Tagesgang, Wochentage, Monate, Grundlast, Spitzen, PV-Größe für hohen Eigenverbrauch und Peak-Shaving-Speicher.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: "de-AT",
        isAccessibleForFree: true,
        featureList: [
          "CSV-Erkennung für gängige Portal-Exporte (Trennzeichen, Datumsformate, kWh/kW)",
          "Auswertung vollständig im Browser, kein Upload",
          "Tagesgang, Wochentage, Monate und Jahres-Heatmap",
          "Grundlast, Spitzenlast, Benutzungsdauer",
          "PV-Größenempfehlung mit PVGIS-Daten für 37 Orte in Österreich",
          "Peak-Shaving-Speicher und Leistungspreis-Ersparnis (SNE-V 2026)",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SEITE_URL}/#webpage`,
        url: SEITE_URL,
        name: "Lastgang-Analyse",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        dateModified: "2026-09-30",
        mainEntity: { "@id": `${SEITE_URL}/#app` },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Lastgang-Analyse" }]}
        eyebrow="Lastgang-Analyse · kostenlos · ohne Upload"
        title={
          <>
            Ihr Lastgang, <span className="ov-text-gradient-light">in Sekunden gelesen</span>.
          </>
        }
        lead="Laden Sie die Viertelstundenwerte aus dem Portal Ihres Netzbetreibers – und sehen Sie Lastprofil, Grundlast, Spitzen, die passende PV-Größe und das Peak-Shaving-Potenzial. Die Auswertung läuft nur in Ihrem Browser."
        points={["Kein Upload – Daten bleiben auf Ihrem Gerät", "Tagesgang, Wochentage, Monate, Heatmap", "PV-Größe für hohen Eigenverbrauch", "Speicher für Peak Shaving, grob ausgelegt"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <section aria-label="Lastgang-Analyse" className="relative z-10 -mt-20 pb-6 md:-mt-28 md:pb-10">
        <div className="ov-container">
          <LastgangAnalyse orte={orte} startOrt={HEIMAT_SLUG} />
        </div>
      </section>

      <Section tone="white" space="md">
        <SectionHeading
          eyebrow="In drei Schritten"
          title="So kommen Sie zu Ihrem Lastgang."
          lead="Viertelstundenwerte gibt es, wenn an Ihrem Anschluss ein Smart Meter oder ein Lastprofilzähler misst. Sie stehen im Kunden- bzw. Smart-Meter-Portal Ihres Netzbetreibers – meist unter „Verbrauchsdaten“ oder „Datenexport“."
        />
        <Steps
          className="mt-12"
          cols={3}
          items={[
            { icon: LogIn, title: "Im Portal anmelden", text: "Kunden- oder Smart-Meter-Portal Ihres Netzbetreibers; die Zählpunktnummer steht auf der Netzrechnung. Große Betriebe erhalten Lastgänge oft auch über ein eigenes Energiedaten-Portal." },
            { icon: FileSpreadsheet, title: "15-Minuten-Werte exportieren", text: "Bezug (Verbrauch), Viertelstundenwerte, möglichst zwölf volle Monate, als CSV. Bei mehreren Zählpunkten je Zählpunkt eine Datei." },
            { icon: MousePointerClick, title: "Datei hier ablegen", text: "Format, Einheit und Zeitstempel werden automatisch erkannt. Fehlt etwas, sagt Ihnen die Analyse, was – und die Datei verlässt dabei nie Ihr Gerät." },
          ]}
        />
        <Reveal className="mt-10 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          <p>
            Sehen Sie im Portal nur Tageswerte, ist die Viertelstundenauslesung für Ihren Zähler vermutlich nicht aktiv – fragen Sie Ihren Netzbetreiber danach. Welcher Netzbetreiber für Ihren Standort zuständig ist und wie die Netzanmeldung einer PV-Anlage abläuft, zeigt die Seite{" "}
            <Link href="/netzanmeldung" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
              Netzanmeldung
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="So rechnen wir"
              title="Aus 35.040 Viertelstunden werden fünf Entscheidungen."
              lead="Ein Jahr Lastgang zeigt, wann Ihr Betrieb Strom braucht – und damit, wie viel PV-Strom er selbst nutzen kann und welche Spitzen den Leistungspreis treiben."
            />
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Jahresverbrauch", "Summe aller Werte; bei weniger als einem Jahr auf 365 Tage hochgerechnet (Lücken mit dem Mittel gefüllt) und gekennzeichnet."],
                ["Spitzenlast & Grundlast", "Höchste Viertelstunden-Leistung und das 5-%-Quantil aller Viertelstunden – robust gegen einzelne Ausreißer."],
                ["Tagesgang & Heatmap", "Mittlere Leistung je Uhrzeit für Werktage, Samstage sowie Sonn- und Feiertage (österreichische Feiertage) und jede Viertelstunde des Jahres als Farbfeld."],
                ["PV-Größe", "Größte Anlage, deren Strom noch zum gewählten Anteil (Standard 80 %) im Betrieb verbraucht wird – viertelstundengenau simuliert, ohne Speicher."],
                ["Peak Shaving", "Kleinster Speicher, der Ihr Ziel im ganzen Messzeitraum hält, und die Senkung des Leistungspreises auf Basis der Monatsspitzen."],
                ["Grenzen", "Kein Wetter Ihres Messjahres, keine Dachprüfung, keine Speicherpreise – das klären wir im Angebot mit Ihren echten Gegebenheiten."],
              ].map(([k, v]) => (
                <Reveal key={k} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/60">
                  <dt className="font-display text-[16.5px] font-bold text-ink-900">{k}</dt>
                  <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <Reveal>
            <AnnahmenBox
              punkte={[
                ["PV-Monatswerte", "PVGIS v5.3, SARAH3, 37 Orte"],
                ["Systemverluste (PVGIS)", "14 %"],
                ["Tagesverlauf PV", "Sonnenstand + Klarhimmel-Modell"],
                ["Wetterfolge", "typisch, synthetisch (Annahme)"],
                ["Ziel Eigenverbrauch", "60–95 %, Standard 80 %"],
                ["Speicher: Wirkungsgrad", `${zahl(PS_ANNAHMEN.eta * 100)} %`],
                ["Speicher: Reserve / Restkapazität", `× ${zahl(PS_ANNAHMEN.reserve, 2)} ÷ ${zahl(PS_ANNAHMEN.sohEnde, 1)}`],
                ["Leistungspreis", "SNE-V 2026 je Netzbereich/-ebene"],
                ["Leistungsmessung ab", `${zahl(PS_ANNAHMEN.messpflichtKwh)} kWh oder ${PS_ANNAHMEN.messpflichtKw} kW`],
                ["Feiertage", "§ 7 Abs. 2 Arbeitsruhegesetz"],
              ]}
              quellen={[
                { name: `${PVGIS_QUELLE.name.split(" – ")[0]} (abgerufen ${pq.abgerufen.split("-").reverse().join(".")})`, url: PVGIS_QUELLE.url },
                SONNE_QUELLE,
                NETZ_QUELLE,
                { name: "RIS – ElWG, BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" },
                { name: "RIS – Arbeitsruhegesetz § 7", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008541" },
              ]}
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Für Technik & Energiemanagement" title="Formate, Datenschutz und Beispieldatei im Detail." />
        <div className="mt-10 space-y-4">
          <Fachdetails titel="Welche Dateiformate erkannt werden" untertitel="Trennzeichen, Datums- und Zahlenformate, Einheiten">
            <Tabelle
              caption="Erkannte Merkmale von Lastgang-Dateien"
              dicht
              spalten={[
                { key: "m", label: "Merkmal", breite: "w-[220px]" },
                { key: "w", label: "Erkannt wird" },
              ]}
              zeilen={FORMATE}
            />
            <p className="mt-5 text-[14.5px] leading-relaxed text-ink-600">
              Die Exportformate der Netzbetreiber-Portale unterscheiden sich im Detail und ändern sich gelegentlich. Die Erkennung ist deshalb bewusst allgemein gebaut und mit vielen Varianten getestet. Wird Ihre Datei trotzdem nicht erkannt, zeigt die Analyse den Grund an – schicken Sie uns die Datei in diesem Fall mit Ihrer Anfrage.
            </p>
          </Fachdetails>
          <Fachdetails titel="Wie die Datenschutz-Zusage technisch eingehalten wird" untertitel="Auswertung im Browser, kein Upload, keine Speicherung">
            <div className="ov-prose max-w-3xl text-[15px]">
              <ul>
                <li>Die Datei wird mit der File-Schnittstelle Ihres Browsers gelesen und im Arbeitsspeicher des Tabs ausgewertet. Der Code der Analyse sendet keine Anfrage mit Ihren Daten.</li>
                <li>Es gibt keinen Speicher-Schritt: weder auf unserem Server noch im lokalen Speicher Ihres Browsers (kein localStorage, keine Cookies für die Analyse).</li>
                <li>Einzige Netzwerkanfrage der Analyse ist das Laden der Beispieldatei – und nur, wenn Sie „Beispiel-Lastgang laden“ wählen.</li>
                <li>Der Link „Angebot anfragen“ enthält ausschließlich Jahresverbrauch, Anlagengröße und – falls gewählt – die Speichergröße. Was Sie im Angebotsformular absenden, entscheiden Sie dort selbst; Details regelt unsere <Link href="/datenschutz">Datenschutzerklärung</Link>.</li>
              </ul>
            </div>
          </Fachdetails>
          <Fachdetails titel="Beispieldatei zum Ausprobieren" untertitel="Synthetischer Lastgang eines erfundenen Gewerbebetriebs">
            <div className="ov-prose max-w-3xl text-[15px]">
              <p>
                Die <a href="/beispiele/lastgang-beispiel.csv" download>Beispiel-CSV</a> ist frei erfunden und als solche gekennzeichnet: ein Gewerbebetrieb mit zwei Schichten von Montag bis Freitag, Samstag-Vormittag, Betriebsurlaub im August und zwischen den Feiertagen sowie Anlaufspitzen zu Schichtbeginn – 35.040 Viertelstundenwerte für 2025, Zeitstempel in österreichischer Ortszeit samt Sommerzeit-Umstellung. Sie zeigt, wie ein Portal-Export aufgebaut sein kann:
              </p>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-navy-950 p-4 text-[13px] leading-relaxed text-white/85">
              <code>{`SYNTHETISCHER BEISPIEL-LASTGANG - keine echten Messdaten;;;
Fiktiver Gewerbebetrieb (2 Schichten Mo-Fr) …;;;
Datum;Zeit von;Zeit bis;Verbrauch [kWh]
01.01.2025;00:00;00:15;9,013
01.01.2025;00:15;00:30;9,486
…`}</code>
            </pre>
          </Fachdetails>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Lastgang-Analyse: Fragen & Antworten" lead={`Stand ${STAND}. Ihre Frage ist nicht dabei? Wir beraten Sie persönlich und herstellerunabhängig.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <WeitereRechner ohne="lastgang-analyse" />
      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Lastgang ausgewertet – jetzt die passende Anlage planen."
        text="Wir prüfen Dach, Netzanschluss und Förderung, legen PV-Anlage und Speicher auf Ihren echten Verbrauch aus und rechnen die Wirtschaftlichkeit ehrlich durch – für Betriebe in ganz Österreich."
        primary={{ label: "Angebot anfragen", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" }}
      />
    </div>
  );
}
