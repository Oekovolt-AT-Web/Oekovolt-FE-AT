// src/app/rechner/blackout/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import BlackoutRechner from "@/components/RechnerGewerbe/BlackoutRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { fmt } from "@/lib/rechner/annahmen";
import { BO_ANNAHMEN, literJeKwh } from "@/lib/rechner/blackout";
import { PREISQUELLEN } from "@/data/solarrechner";

const PFAD = "/rechner/blackout";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Blackout-Rechner: Ausfallkosten & Notstrom | Ökovolt",
  description:
    "Blackout- und Ausfallkosten-Rechner für Betriebe, Landwirtschaft und Gemeinden: Kosten je Szenario, Ersatzstrom-Leistung, Speicher, Aggregat und Dieselbedarf.",
  keywords: ["Blackout Rechner", "Ausfallkosten Stromausfall berechnen", "Notstrom Leistung berechnen", "Notstromaggregat Dieselverbrauch", "Blackout Vorsorge Betrieb", "Ersatzstrom PV Speicher"],
});

const FAQ = [
  {
    q: "Wie lange dauert ein Blackout in Österreich?",
    a: "Die Gesellschaft für Krisenvorsorge (GfKV) rechnet in Österreich mit einem Stromausfall zwischen 10 und 48 Stunden, regional auch länger. Telekommunikation und Versorgung mit Gütern können danach noch Tage gestört sein. Der Rechner setzt für das Blackout-Szenario deshalb 48 Stunden an.",
  },
  {
    q: "Wie berechne ich die Ausfallkosten je Stunde?",
    a: "Als Summe aus entgangenem Deckungsbeitrag (nicht nur Umsatz – eingesparte Material- und Energiekosten abziehen) und den Personalkosten, die im Stillstand weiterlaufen. Dazu kommen einmalige Schäden: verdorbene Ware ab einer bestimmten Ausfalldauer, Ausschuss laufender Aufträge und die Zeit und Kosten für den Wiederanlauf nach Rückkehr des Stroms.",
  },
  {
    q: "Wie groß muss die Ersatzstromversorgung sein?",
    a: "Die Leistung richtet sich nach den kritischen Verbrauchern inklusive ihrer Anlaufströme – Motoren, Pumpen und Kompressoren brauchen beim Start ein Mehrfaches ihrer Nennleistung. Die Energie ergibt sich aus mittlerer Last mal Überbrückungsdauer. Für ein Dieselaggregat rechnet man die Wirkleistung mit cos φ 0,8 in kVA um.",
  },
  {
    q: "Wie viel Diesel braucht ein Notstromaggregat?",
    a: `Nach Datenblattwerten eines Industriemotors rund ${fmt(literJeKwh(0.75), 2)} Liter je Kilowattstunde bei 75 % Last und rund ${fmt(literJeKwh(0.25), 2)} Liter bei 25 % Last; als Faustformel gelten etwa 20 Liter je Stunde je 100 kVA. Läuft das Aggregat in Kombination mit einem Speicher im Bestpunkt, sinken Verbrauch und Laufzeit deutlich.`,
  },
  {
    q: "Hilft eine PV-Anlage im Blackout?",
    a: "Nur, wenn sie ersatzstromfähig geplant ist: Speicher mit netzbildendem Wechselrichter, automatische Netztrennung und Schwarzstartfähigkeit. Eine normale netzgekoppelte Anlage schaltet bei Netzausfall ab. Im Winter und nachts liefert PV wenig – deshalb ist die Kombination mit Speicher und Aggregat für längere Ausfälle am robustesten.",
  },
  {
    q: "Was gehört neben der Technik zur Blackout-Vorsorge?",
    a: "Ein Krisenplan: Krisenstab und Vertretungen, sicheres Herunterfahren und Reihenfolge des Wiederhochfahrens, Kommunikation ohne Mobilfunk, Treibstoffvorrat und die Eigenvorsorge der Mitarbeitenden für 14 Tage. Die Checkliste unter dem Rechner hilft beim Überblick.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="blackout"
      breadcrumb="Blackout-Rechner"
      eyebrow="Blackout- & Ausfallkosten-Rechner"
      title={<>Was kostet Sie <span className="ov-text-gradient-light">ein Tag ohne Strom?</span></>}
      lead="Ausfallkosten je Szenario, benötigte Ersatzstrom-Leistung und die Kombination aus PV, Speicher und Aggregat – für Betriebe, Landwirtschaft und Gemeinden."
      chips={["6 Branchen-Beispiele", "Stundengenaue Überbrückung", "Checkliste zum Abhaken"]}
      app={{
        name: "Ökovolt Blackout- & Ausfallkosten-Rechner",
        description:
          "Berechnet für Unternehmen, landwirtschaftliche Betriebe und Gemeinden die Kosten eines Stromausfalls je Szenario, die nötige Ersatzstrom-Leistung und Speicherkapazität sowie Laufzeit und Dieselbedarf einer Kombination aus PV, Speicher und Notstromaggregat.",
        featureList: ["Branchen-Beispiele mit editierbaren Werten", "Hilfsrechnung Ausfallkosten je Stunde", "Szenarien 30 Minuten, 8 Stunden und 48 Stunden Blackout", "Stündliche Simulation PV, Speicher und Aggregat", "Dieselbedarf nach Lastpunkt", "Interaktive Vorsorge-Checkliste"],
      }}
      rechner={<BlackoutRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Nicht der ganze Betrieb muss laufen – aber das Kritische ohne Unterbrechung."
            lead="Der Rechner trennt zwischen Kosten des Stillstands und der Versorgung kritischer Lasten: Kühlung, Tiere, Wasser, Steuerungen und Sicherheit. Was mit Ersatzstrom weiterläuft, spart Ware, Wiederanlauf und einen Teil der Stillstandskosten."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Die Überbrückung wird Stunde für Stunde simuliert: Die PV-Anlage deckt tagsüber einen Teil der Last und lädt den Speicher, der Speicher überbrückt Nacht und Aggregatstart,
              das Aggregat springt bei {fmt(BO_ANNAHMEN.aggregatStartSoc * 100)} % Ladezustand an und läuft im verbrauchsgünstigen Bestpunkt, bis der Speicher wieder {fmt(BO_ANNAHMEN.aggregatStopSoc * 100)} % erreicht.
              So läuft es kürzer und braucht weniger Diesel als allein.
            </p>
            <p>
              Wie ein Krisenplan für Betrieb oder Gemeinde aussieht, erklärt der Ratgeber <Link href="/ratgeber/blackout-vorsorge-unternehmen">Blackout-Vorsorge für Unternehmen und Gemeinden</Link>;
              die Technik nach TOR und ÖVE/ÖNORM E 8101 der Ratgeber <Link href="/ratgeber/notstrom-photovoltaik">Notstrom mit Photovoltaik</Link>. Unsere Leistungen finden Sie unter{" "}
              <Link href="/service/notstrom">Notstrom & Blackout-Vorsorge</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Blackout-Dauer (GfKV)", "10–48 h, gerechnet 48 h"],
        ["Aggregat: Wirk- zu Scheinleistung", `cos φ ${fmt(BO_ANNAHMEN.cosPhi, 1)}`],
        ["Diesel bei 25/50/75/100 % Last", BO_ANNAHMEN.spezVerbrauch.map((s) => fmt(literJeKwh(s.last), 2)).join(" / ") + " l/kWh"],
        ["Aggregat startet · stoppt", `${fmt(BO_ANNAHMEN.aggregatStartSoc * 100)} % · ${fmt(BO_ANNAHMEN.aggregatStopSoc * 100)} % Ladezustand`],
        ["Speicher: Entladetiefe · Wirkungsgrad", `${fmt(BO_ANNAHMEN.dod * 100)} % · ${fmt(BO_ANNAHMEN.etaSpeicher * 100)} % je Richtung`],
        ["Ladezustand bei Ausfallbeginn", `${fmt(BO_ANNAHMEN.socStart * 100)} %`],
        ["PV-Ertrag (Monatsmittel, keine Extremtage)", `${fmt(BO_ANNAHMEN.ertragProKwp)} kWh/kWp`],
        ["Last tagsüber · nachts", "115 % · 85 % des Mittels"],
        ["Branchenwerte", "Beispiele, keine Statistik"],
      ]}
      quellen={[
        { name: "GfKV – Leitfaden Blackout-Vorsorge in Unternehmen (03/2024)", url: "https://gfkv.org/wp-content/uploads/2024/03/GfKV-Leitfaden-fuer-die-Blackout-Vorsorge-in-Unternehmen-und-Organisationen.pdf" },
        { name: "MagnaGen – Kraftstoffverbrauch von Notstromaggregaten (01/2020)", url: "https://notstromdiesel.com/storage/app/media/downloads/Verbrauch-Kraftstoff-Notstromaggregat.pdf" },
        { name: "E-Control – TOR Stromerzeugungsanlagen Typ A", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735" },
        PREISQUELLEN.find((q) => q.name.startsWith("PVGIS")),
        { name: "Zivilschutzverband Steiermark – Blackout", url: "https://www.zivilschutz.steiermark.at/thema/blackout/" },
      ]}
      faq={FAQ}
      faqTitel="Blackout & Notstrom: Fragen & Antworten"
      cta={{
        title: "Handlungsfähig bleiben, wenn das Netz ausfällt.",
        text: "Wir messen Ihre kritischen Lasten und Anlaufströme, planen PV, Speicher und Aggregat als Ersatzstromsystem nach TOR und testen es unter realer Last – für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich.",
        primary: { label: "Notstrom anfragen", href: "/service/notstrom" },
        secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
      }}
    />
  );
}
