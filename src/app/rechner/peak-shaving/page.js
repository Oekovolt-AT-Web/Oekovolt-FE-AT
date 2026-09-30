// src/app/rechner/peak-shaving/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import PeakRechner from "@/components/RechnerGewerbe/PeakRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { fmt } from "@/lib/rechner/annahmen";
import { NETZBEREICHE, NETZ_QUELLE, PS_ANNAHMEN, netzpreise } from "@/lib/rechner/peakshaving";
import { ANNAHMEN as SOLAR, PREISQUELLEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

const PFAD = "/rechner/peak-shaving";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Peak-Shaving-Rechner: Leistungspreis senken | Ökovolt",
  description:
    "Peak-Shaving- und Gewerbespeicher-Rechner Österreich: Leistungspreis 2026 je Netzebene, Speichergröße, PV-Eigenverbrauch, Amortisation – mit ElWG-Ausblick 2027.",
  keywords: ["Peak Shaving Rechner", "Leistungspreis senken", "Gewerbespeicher Rechner", "Lastspitzen kappen", "Leistungspreis Netzebene 6", "Batteriespeicher Gewerbe Amortisation"],
});

const OOE6 = netzpreise("ooe", 6);
const LP_ALLE = NETZBEREICHE.flatMap((b) => [b.ne5[0], b.ne6[0], b.ne7[0]]);

const FAQ = [
  {
    q: "Wie rechnet der Peak-Shaving-Rechner die Ersparnis?",
    a: `Bis Ende 2026 zahlen leistungsgemessene Betriebe den Leistungspreis auf den Mittelwert ihrer zwölf monatlichen Viertelstundenmaxima. Der Rechner senkt jede Monatsspitze auf Ihr Ziel, soweit Speicherleistung und -kapazität reichen, und multipliziert die Senkung des Mittelwerts mit dem Leistungspreis Ihrer Netzebene – etwa ${fmt(OOE6.lp, 2)} € je kW und Jahr auf Netzebene 6 in Oberösterreich (SNE-V 2026).`,
  },
  {
    q: "Wie groß muss der Speicher für Peak Shaving sein?",
    a: `Die Entladeleistung muss die größte Überschreitung der Zielspitze abdecken, die Kapazität die Energie über dem Ziel am ungünstigsten Tag – plus ${fmt((PS_ANNAHMEN.reserve - 1) * 100)} % Reserve für Prognosefehler und geteilt durch ${fmt(PS_ANNAHMEN.sohEnde * 100)} % Restkapazität am Lebensende. Kurze Anlaufspitzen brauchen daher wenig Kapazität, mehrstündige Plateaus sehr viel.`,
  },
  {
    q: "Warum rechnet sich Peak Shaving allein selten?",
    a: "Bei Leistungspreisen um 60 bis 70 € je kW und Jahr auf Netzebene 5 und 6 bringt jedes gekappte Kilowatt nur diesen Betrag im Jahr. Wirtschaftlich wird ein Speicher meist erst, wenn er zusätzlich PV-Überschuss verschiebt, eine teure Erhöhung der Anschlussleistung vermeidet oder am Spotmarkt optimiert.",
  },
  {
    q: "Senkt meine PV-Anlage die Lastspitze?",
    a: "Kaum verlässlich. Die Monatsspitze entsteht oft an Wintermorgen, bei Schichtbeginn oder an trüben Tagen. Weil jeder Monat zählt, bleibt das Maximum meist gleich. Der Rechner nutzt die PV-Anlage deshalb nur für den zusätzlichen Eigenverbrauch über den Speicher, nicht für die Kappung.",
  },
  {
    q: "Was ändert sich ab 2027 beim Leistungspreis?",
    a: "Laut ElWG und dem Entwurf der Systemnutzungsentgelte-Grundsätze-Verordnung wird ab 1. Jänner 2027 jeder Monat einzeln abgerechnet (Monatsmaximum × Monatsleistungspreis), und der Leistungspreis gilt auch auf Netzebene 7 mit zwei Preisstufen. Die Tarifwerte 2027 stehen noch aus; der Rechner zeigt deshalb nur die neue Struktur.",
  },
  {
    q: "Gibt es eine Förderung für Gewerbespeicher?",
    a: "Der EAG-Investitionszuschuss fördert Stromspeicher nur gemeinsam mit einer PV-Anlage – 2026 mit höchstens 150 € je kWh bis 50 kWh, vergeben in Fördercalls (der nächste läuft von 8. bis 22. Oktober 2026) ohne Rechtsanspruch. Dazu kommen Landesprogramme und der Investitionsfreibetrag für Betriebe.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="peak-shaving"
      breadcrumb="Peak-Shaving-Rechner"
      eyebrow="Peak-Shaving- & Gewerbespeicher-Rechner"
      title={<>Lastspitzen kappen, <span className="ov-text-gradient-light">Leistungspreis senken</span>.</>}
      lead="Netzentgelte 2026 für alle Netzbereiche Österreichs, modellierter Spitzentag, Speichergröße, PV-Eigenverbrauch und Amortisation – in Sekunden."
      chips={["Leistungspreise 2026 je Netzebene", "Spitzentag animiert", "ElWG-Ausblick 2027"]}
      app={{
        name: "Ökovolt Peak-Shaving- & Gewerbespeicher-Rechner",
        description:
          "Berechnet für Betriebe in Österreich die Ersparnis beim Leistungspreis durch Peak Shaving, die nötige Speicherleistung und -kapazität, den zusätzlichen PV-Eigenverbrauch, einen Richtwert für die Investition und die Amortisation.",
        featureList: ["Leistungspreise 2026 für 13 Netzbereiche und Netzebenen 5–7", "Lastkurve eines Spitzentags mit und ohne Speicher", "Speicherauslegung mit Reserve", "PV-Eigenverbrauch mit Speicher", "Amortisation und EAG-Speicherförderung", "Abrechnungsstruktur ab 2027"],
      }}
      rechner={<PeakRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Jede Monatsspitze zählt – deshalb muss Peak Shaving jeden Monat halten."
            lead={`In Österreich fließt jedes Monatsmaximum nur zu einem Zwölftel in den Leistungspreis ein. Ein Kilowatt weniger in allen zwölf Monaten ist auf Netzebene 6 in Oberösterreich ${fmt(OOE6.lp, 2)} € im Jahr wert – ein einzelner verpasster Monat kostet dagegen die volle Überschreitung.`}
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Der Rechner baut aus Jahresverbrauch und Schichtmodell eine typische Betriebslast und setzt die gemessenen Monatsspitzen als Viertelstundenspitzen auf.
              Daraus ergeben sich für jeden Monat <strong>Leistung und Energie über Ihrem Ziel</strong> – und damit die Speichergröße, die das Ziel mit Reserve hält.
              Die 2026 gültigen Leistungspreise liegen je nach Netzbereich und -ebene zwischen {fmt(Math.min(...LP_ALLE), 2)} und {fmt(Math.max(...LP_ALLE), 2)} € je kW und Jahr.
            </p>
            <p>
              Wann Lastmanagement ohne Speicher reicht und wie man den Lastgang auswertet, erklärt der Ratgeber{" "}
              <Link href="/ratgeber/peak-shaving-leistungspreis">Peak Shaving und Leistungspreis</Link>. Was Speicher je Größenklasse kosten, steht unter{" "}
              <Link href="/ratgeber/gewerbespeicher-kosten">Gewerbespeicher Kosten</Link>; Systeme und Umsetzung auf der Seite <Link href="/gewerbespeicher">Gewerbespeicher</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Leistungs-/Arbeitspreise", "SNE-V 2026, 13 Netzbereiche"],
        ["Leistungsmessung (bis 2026)", `> ${fmt(PS_ANNAHMEN.messpflichtKwh)} kWh oder > ${PS_ANNAHMEN.messpflichtKw} kW`],
        ["Speicherauslegung", `× ${fmt(PS_ANNAHMEN.reserve, 2)} Reserve ÷ ${fmt(PS_ANNAHMEN.sohEnde, 1)} Restkapazität`],
        ["Speicherpreis (Richtwert, netto)", `${fmt(SOLAR.speicherPreise[SOLAR.speicherPreise.length - 1].eur)}–${fmt(SOLAR.speicherPreise[0].eur)} €/kWh`],
        ["Wartung, Versicherung, Software", `${fmt(PS_ANNAHMEN.betriebAnteil * 100, 1)} % der Investition/Jahr`],
        ["Wirkungsgrad Laden + Entladen", `${fmt(PS_ANNAHMEN.eta * 100)} %`],
        ["Arbeitstage mit Spitze je Monat", `${PS_ANNAHMEN.tageMitSpitze}`],
        ["Strompreis Betrieb (vermeidbar, netto)", "17–26 ct/kWh nach Verbrauch"],
        ["Einspeiseerlös (Rechensatz)", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} ct/kWh`],
        ["PV-Ertrag Hallendach", `${fmt(PS_ANNAHMEN.ertragProKwp)} kWh/kWp`],
        ["Nutzungsdauer", `${PS_ANNAHMEN.lebensdauer} Jahre`],
      ]}
      quellen={[
        NETZ_QUELLE,
        { name: "E-Control – SNE-G-V-Begutachtungsentwurf (07/2026)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf" },
        { name: "RIS – ElWG, BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" },
        { name: "EAG-Investitionszuschüsseverordnung-Strom, BGBl. II Nr. 12/2026" },
        PREISQUELLEN.find((q) => q.name.startsWith("Eurostat")),
        { name: "BMWET/FH Technikum Wien – PV-Batteriespeichersysteme, Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf" },
        VERGUETUNG.quelle,
      ]}
      faq={FAQ}
      faqTitel="Peak Shaving: Fragen & Antworten"
      cta={{
        title: "Leistungspreis senken – mit Ihrem echten Lastgang.",
        text: "Wir werten Ihre 35.040 Viertelstundenwerte aus, zeigen Lastmanagement-Potenziale und legen einen Speicher aus, der Peak Shaving, PV-Eigenverbrauch und Notstrom verbindet – in ganz Österreich.",
        primary: { label: "Lastgang-Analyse anfragen", href: "/angebot" },
        secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
      }}
    />
  );
}
