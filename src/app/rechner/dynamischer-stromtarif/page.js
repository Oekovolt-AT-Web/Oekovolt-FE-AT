// src/app/rechner/dynamischer-stromtarif/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import DynamischerTarifRechner from "@/components/Rechner/DynamischerTarifRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { getEnergySnapshot, TARIF_ANNAHMEN } from "@/lib/energy";
import { TARIF_PARAMETER } from "@/lib/rechner/dynamischerTarif";
import { fmt } from "@/lib/rechner/annahmen";

// Börsenpreise alle 15 Minuten neu, im Browser zusätzlich live aktualisiert
export const revalidate = 900;

const PFAD = "/rechner/dynamischer-stromtarif";
const BASE = "https://www.oekovolt.com";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Dynamischer Stromtarif Rechner: Lohnt es sich? | Ökovolt",
  description:
    "Dynamischer Stromtarif mit Live-Börsenpreisen: Tageskosten vs. Festpreis und günstigste Ladefenster für E-Auto und Wärmepumpe. Jetzt kostenlos prüfen.",
  keywords: ["dynamischer Stromtarif Rechner", "dynamischer Stromtarif lohnt sich", "Day-Ahead Strompreis heute", "Strompreis Börse aktuell", "E-Auto günstig laden Uhrzeit"],
});

const FAQ = [
  {
    q: "Wie funktioniert ein dynamischer Stromtarif?",
    a: "Beim dynamischen Tarif zahlen Sie für jede Viertelstunde bzw. Stunde den Börsenpreis des Day-Ahead-Marktes plus feste Bestandteile wie Netzentgelt, Abgaben, Umlagen, Marge und Mehrwertsteuer. Die Preise für den Folgetag werden gegen 13 Uhr veröffentlicht. Günstig ist Strom meist mittags bei viel Solarstrom und nachts bei viel Wind, teuer am frühen Abend.",
  },
  {
    q: "Seit wann muss jeder Anbieter einen dynamischen Tarif anbieten?",
    a: "Seit dem 1. Januar 2025 sind alle Stromlieferanten in Deutschland nach § 41a EnWG verpflichtet, einen dynamischen Stromtarif anzubieten. Voraussetzung ist ein intelligentes Messsystem (Smart Meter), das den Verbrauch viertelstündlich erfasst.",
  },
  {
    q: "Für wen lohnt sich ein dynamischer Stromtarif?",
    a: "Vor allem für Haushalte mit großen, zeitlich flexiblen Verbrauchern: E-Auto, Wärmepumpe oder Batteriespeicher. Wer das Auto nachts oder mittags in den günstigsten Stunden lädt, spart spürbar. Ein Haushalt ohne solche Geräte verbraucht viel Strom am teuren Abend – hier ist der Vorteil gering, an teuren Tagen kann der dynamische Tarif sogar mehr kosten.",
  },
  {
    q: "Wie genau ist der Rechner?",
    a: `Die Börsenpreise sind echte Day-Ahead-Werte von Energy-Charts (Fraunhofer ISE). Den Endkundenpreis schätzen wir mit einem pauschalen Aufschlag von ${fmt(TARIF_ANNAHMEN.aufschlagCt, 1)} ct/kWh netto für Netzentgelt, Abgaben und Marge plus ${fmt(TARIF_ANNAHMEN.mwst * 100)} % MwSt. Netzentgelte unterscheiden sich regional deutlich, Grundgebühr und Messstellenbetrieb sind nicht enthalten.`,
  },
  {
    q: "Was bringt ein dynamischer Tarif zusammen mit Photovoltaik?",
    a: "Die PV-Anlage deckt tagsüber den Bedarf – der dynamische Tarif macht den Reststrom günstiger, etwa wenn der Speicher im Winter nachts günstig nachlädt oder das E-Auto in windreichen Nachtstunden lädt. Ein Energiemanager steuert das automatisch. Auch bei negativen Börsenpreisen profitieren Sie als Verbraucher.",
  },
  {
    q: "Was hat § 14a EnWG mit dynamischen Tarifen zu tun?",
    a: "Wallboxen und Wärmepumpen gelten als steuerbare Verbrauchseinrichtungen. Dafür gibt es reduzierte Netzentgelte – ab 2025 optional auch zeitvariabel (Modul 3). In Kombination mit einem dynamischen Tarif sinken die Kosten in günstigen Stunden dann doppelt.",
  },
];

export default async function Page() {
  const snap = await getEnergySnapshot();
  // Nur die benötigten Daten an den Client geben
  const start = { stand: snap.stand, preis: { quelle: snap.preis.quelle, aufloesungMin: snap.preis.aufloesungMin, punkte: snap.preis.punkte } };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Day-Ahead-Strompreise Deutschland/Luxemburg (heute und morgen)",
    description: "Börsenstrompreise des Day-Ahead-Marktes für die Gebotszone DE-LU in 15-Minuten-Auflösung, umgerechnet in geschätzte Endkundenpreise.",
    url: `${BASE}${PFAD}`,
    creator: { "@type": "Organization", name: "Fraunhofer ISE – Energy-Charts", url: "https://www.energy-charts.info" },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: snap.stand,
    temporalCoverage: snap.preis.punkte.length ? `${new Date(snap.preis.punkte[0].t).toISOString()}/${new Date(snap.preis.punkte[snap.preis.punkte.length - 1].t).toISOString()}` : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }} />
      <RechnerSeite
        pfad={PFAD}
        toolId="dynamisch"
        breadcrumb="Dynamischer Stromtarif"
        eyebrow="Live · Day-Ahead-Preise"
        title={<>Lohnt sich ein <span className="ov-text-gradient-light">dynamischer Stromtarif</span>?</>}
        lead="Mit den echten Börsenpreisen von heute: Was Ihr Tag mit Festpreis und mit dynamischem Tarif kostet – und wann Sie E-Auto oder Wärmepumpe am günstigsten laufen lassen."
        chips={["Live-Börsenpreise", "Günstigste Ladefenster", "Quelle: Fraunhofer ISE"]}
        app={{
          name: "Ökovolt Dynamischer-Stromtarif-Rechner",
          description: "Vergleicht die Tagesstromkosten mit Festpreis und dynamischem Tarif auf Basis aktueller Day-Ahead-Börsenpreise und zeigt die günstigsten Zeitfenster für flexible Verbraucher.",
          featureList: ["Live-Day-Ahead-Preise DE-LU", "Profile Haushalt, E-Auto, Wärmepumpe", "Lastverschiebung", "Günstigste Ladefenster", "Festpreis-Vergleich"],
        }}
        rechner={<DynamischerTarifRechner start={start} annahmen={TARIF_ANNAHMEN} />}
        erklaerung={
          <>
            <SectionHeading
              eyebrow="So rechnen wir"
              title="Nicht der Tarif spart Geld – sondern der Zeitpunkt."
              lead="Ein dynamischer Tarif belohnt, wer Strom dann nutzt, wenn er im Überfluss vorhanden ist. Entscheidend ist, wie viel Ihres Verbrauchs sich verschieben lässt."
            />
            <div className="ov-prose mt-8 max-w-2xl">
              <p>
                Für den gewählten Tag verteilen wir Ihren Jahresverbrauch auf ein typisches Tagesprofil des Monats – Haushalt, E-Auto und Wärmepumpe getrennt.
                Dann bewerten wir jede Viertelstunde mit dem Börsenpreis plus Aufschlag und vergleichen mit Ihrem Festpreis.
              </p>
              <p>
                Mit dem Regler „Verschiebbarkeit“ wandert der flexible Anteil in die günstigsten Viertelstunden – das E-Auto mit bis zu {TARIF_PARAMETER.eAutoLadeleistungKw} kW, die Wärmepumpe
                zur Hälfte, im Haushalt nur Waschmaschine & Co. Wie viel davon Ihre eigene PV-Anlage übernehmen kann, zeigt der <Link href="/rechner/stromspeicher">Stromspeicher-Rechner</Link>;
                die aktuelle Lage am Strommarkt sehen Sie unter <Link href="/energie-live">Energie live</Link>.
              </p>
            </div>
          </>
        }
        annahmen={[
          ["Aufschlag Netzentgelt, Abgaben, Marge", `${fmt(TARIF_ANNAHMEN.aufschlagCt, 1)} ct/kWh netto`],
          ["Mehrwertsteuer", `${fmt(TARIF_ANNAHMEN.mwst * 100)} %`],
          ["Festpreis (Standard)", `${fmt(TARIF_ANNAHMEN.festpreisCt)} ct/kWh brutto`],
          ["E-Auto", `${TARIF_PARAMETER.eAutoKwhJe100} kWh/100 km, max. ${TARIF_PARAMETER.eAutoLadeleistungKw} kW`],
          ["Wärmepumpe", `max. ${TARIF_PARAMETER.wpLeistungKw} kW, bis 50 % verschiebbar`],
          ["Haushalt", "bis 15 % verschiebbar"],
          ["Nicht enthalten", "Grundgebühr, Smart Meter"],
        ]}
        quellen={[
          { name: "Energy-Charts, Fraunhofer ISE (CC BY 4.0)", url: "https://www.energy-charts.info" },
          { name: "§ 41a EnWG", url: "https://www.gesetze-im-internet.de/enwg_2005/__41a.html" },
        ]}
        faq={FAQ}
        faqTitel="Dynamische Stromtarife verständlich erklärt"
        cta={{
          title: "Strom dann nutzen, wenn er günstig ist – automatisch.",
          text: "PV-Anlage, Speicher, Wallbox und Energiemanager aus einer Hand: Wir planen Ihr System so, dass Sonne und günstige Börsenstunden optimal genutzt werden.",
          primary: { label: "Beratung anfragen", href: "/angebot" },
          secondary: { label: "Energie live ansehen", href: "/energie-live" },
        }}
      />
    </>
  );
}
