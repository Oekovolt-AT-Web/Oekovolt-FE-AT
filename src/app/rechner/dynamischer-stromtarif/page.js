// src/app/rechner/dynamischer-stromtarif/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import DynamischerTarifRechner from "@/components/Rechner/DynamischerTarifRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { getEnergySnapshot, TARIF_ANNAHMEN } from "@/lib/energy";
import { TARIF_PARAMETER } from "@/lib/rechner/dynamischerTarif";
import { fmt } from "@/lib/rechner/annahmen";
import { BASE_URL } from "@/lib/site";

// Börsenpreise alle 15 Minuten neu, im Browser zusätzlich über /api/energie/live aktualisiert
export const revalidate = 900;

const PFAD = "/rechner/dynamischer-stromtarif";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Dynamischer Stromtarif Österreich: Rechner | Ökovolt",
  description:
    "Spotpreis-Tarif oder Festpreis? Tageskosten mit echten Day-Ahead-Preisen der Gebotszone Österreich und die günstigsten Ladefenster für E-Auto und Wärmepumpe.",
  keywords: ["dynamischer Stromtarif Österreich", "Spotpreis Tarif Rechner", "Strompreis Börse Österreich heute", "Day-Ahead Preis AT", "E-Auto günstig laden Uhrzeit"],
});

const FAQ = [
  {
    q: "Wie funktioniert ein dynamischer Stromtarif in Österreich?",
    a: "Beim dynamischen oder Spotpreis-Tarif zahlen Sie für jede Viertelstunde bzw. Stunde den Day-Ahead-Börsenpreis der Gebotszone Österreich plus einen festen Aufschlag des Lieferanten. Netzentgelte, Abgaben und 20 % Umsatzsteuer kommen wie bei jedem Tarif dazu. Die Preise für den Folgetag stehen gegen 13 Uhr fest. Günstig ist Strom meist mittags bei viel Solarstrom und in windreichen Nächten, teuer am frühen Abend.",
  },
  {
    q: "Was brauche ich für einen dynamischen Tarif?",
    a: "Einen Smart Meter mit Viertelstundenwerten (Opt-in) – mit dynamischem Tarif ist die reduzierte Opt-out-Auslesung nach § 54 ElWG nicht möglich. In Österreich ist der Netzbetreiber zugleich Messstellenbetreiber, der Smart-Meter-Rollout ist weitgehend abgeschlossen. Den Tarif selbst schließen Sie mit einem Lieferanten ab, der Spotpreis-Tarife anbietet; vergleichen können Sie im Tarifkalkulator der E-Control.",
  },
  {
    q: "Für wen lohnt sich ein dynamischer Stromtarif?",
    a: "Vor allem für Haushalte und Betriebe mit großen, zeitlich flexiblen Verbrauchern: E-Auto, Wärmepumpe, Batteriespeicher oder verschiebbare Prozesse. Wer das Auto in den günstigsten Stunden lädt, spart spürbar. Ein Haushalt ohne solche Geräte verbraucht viel Strom am teuren Abend – hier ist der Vorteil gering, an teuren Tagen kann der dynamische Tarif sogar mehr kosten.",
  },
  {
    q: "Wie genau ist der Rechner?",
    a: `Die Börsenpreise sind echte Day-Ahead-Werte der Gebotszone Österreich (Energy-Charts, Daten Bundesnetzagentur/SMARD, CC BY 4.0). Den Endkundenpreis schätzen wir mit einem Aufschlag von ${fmt(TARIF_ANNAHMEN.aufschlagCt, 1)} ct/kWh netto für Netzentgelte (inkl. Netzverlust- und Messentgelt), Erneuerbaren-Förderbeitrag, Elektrizitätsabgabe, Gebrauchsabgabe und Lieferantenaufschlag plus ${fmt(TARIF_ANNAHMEN.mwst * 100)} % Umsatzsteuer. Netzentgelte unterscheiden sich je Netzbereich; Grundpauschalen und der günstigere Sommer-Arbeitspreis von 10 bis 16 Uhr sind nicht enthalten.`,
  },
  {
    q: "Was bringt ein dynamischer Tarif zusammen mit Photovoltaik?",
    a: "Die PV-Anlage deckt tagsüber den Bedarf – der dynamische Tarif macht den Reststrom günstiger, etwa wenn das E-Auto in windreichen Nachtstunden lädt oder die Wärmepumpe im Winter günstige Stunden nutzt. Ein Energiemanager steuert das automatisch. Beachten Sie: Netzbezug in einen Speicher und spätere Rückspeisung sind derzeit netzentgeltpflichtig, und negative Börsenpreise drücken zugleich marktgekoppelte Einspeisetarife.",
  },
  {
    q: "Was ändert sich 2027 bei den Netzentgelten?",
    a: "Mit dem Elektrizitätswirtschaftsgesetz (ElWG) wird das Netzentgeltsystem ab 1. Jänner 2027 umgestellt. Laut Verordnungsentwurf der E-Control soll dann auch auf Netzebene 7 ein monatlicher Leistungspreis gelten, ergänzt um günstigere Arbeitspreise im Sommer mittags und im Winter nachts. Für flexible Verbraucher wird damit neben dem Zeitpunkt auch die Leistungsspitze wichtiger. Die endgültigen Tarife legt die E-Control bis Ende 2026 fest.",
  },
];

export default async function Page() {
  const snap = await getEnergySnapshot();
  // Nur die benötigten Daten an den Client geben
  const start = { stand: snap.stand, preis: { quelle: snap.preis.quelle, aufloesungMin: snap.preis.aufloesungMin, punkte: snap.preis.punkte } };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Day-Ahead-Strompreise Österreich (heute und morgen)",
    description: "Börsenstrompreise des Day-Ahead-Marktes für die Gebotszone Österreich (AT) in 15-Minuten-Auflösung, umgerechnet in geschätzte Endkundenpreise.",
    url: `${BASE_URL}${PFAD}`,
    spatialCoverage: { "@type": "Country", name: "Österreich" },
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
        eyebrow="Gebotszone Österreich · Day-Ahead"
        title={<>Lohnt sich ein <span className="ov-text-gradient-light">dynamischer Stromtarif</span>?</>}
        lead="Mit den echten Börsenpreisen der Gebotszone Österreich: Was Ihr Tag mit Festpreis und mit Spotpreis-Tarif kostet – und wann Sie E-Auto oder Wärmepumpe am günstigsten laufen lassen."
        chips={["Börsenpreise AT", "Günstigste Ladefenster", "Quelle: Energy-Charts"]}
        app={{
          name: "Ökovolt Dynamischer-Stromtarif-Rechner Österreich",
          description: "Vergleicht die Tagesstromkosten mit Festpreis und Spotpreis-Tarif auf Basis aktueller Day-Ahead-Börsenpreise der Gebotszone Österreich und zeigt die günstigsten Zeitfenster für flexible Verbraucher.",
          featureList: ["Day-Ahead-Preise Gebotszone AT", "Profile Haushalt, E-Auto, Wärmepumpe", "Lastverschiebung", "Günstigste Ladefenster", "Festpreis-Vergleich"],
        }}
        rechner={<DynamischerTarifRechner start={start} annahmen={TARIF_ANNAHMEN} />}
        erklaerung={
          <>
            <SectionHeading
              eyebrow="So rechnen wir"
              title="Nicht der Tarif spart Geld – sondern der Zeitpunkt."
              lead="Ein Spotpreis-Tarif belohnt, wer Strom dann nutzt, wenn er im Überfluss vorhanden ist. Entscheidend ist, wie viel Ihres Verbrauchs sich verschieben lässt."
            />
            <div className="ov-prose mt-8 max-w-2xl">
              <p>
                Für den gewählten Tag verteilen wir Ihren Jahresverbrauch auf ein typisches Tagesprofil des Monats – Haushalt, E-Auto und Wärmepumpe getrennt.
                Dann bewerten wir jede Viertelstunde mit dem Börsenpreis der Gebotszone Österreich plus Aufschlag und vergleichen mit Ihrem Festpreis.
              </p>
              <p>
                Mit dem Regler „Verschiebbarkeit“ wandert der flexible Anteil in die günstigsten Viertelstunden – das E-Auto mit bis zu {TARIF_PARAMETER.eAutoLadeleistungKw} kW, die Wärmepumpe
                zur Hälfte, im Haushalt nur Waschmaschine & Co. Wie viel davon Ihre eigene PV-Anlage übernehmen kann, zeigt der <Link href="/rechner/stromspeicher">Stromspeicher-Rechner</Link>;
                warum sich Tarife und Einspeiseerlöse gerade verändern, erklärt der Ratgeber <Link href="/ratgeber/dynamischer-stromtarif-lohnt-sich">Dynamischer Stromtarif</Link>.
              </p>
            </div>
          </>
        }
        annahmen={[
          ["Aufschlag Netz, Abgaben, Lieferant", `${fmt(TARIF_ANNAHMEN.aufschlagCt, 1)} ct/kWh netto`],
          ["Umsatzsteuer", `${fmt(TARIF_ANNAHMEN.mwst * 100)} %`],
          ["Festpreis (Standard)", `${fmt(TARIF_ANNAHMEN.festpreisCt)} ct/kWh brutto`],
          ["E-Auto", `${TARIF_PARAMETER.eAutoKwhJe100} kWh/100 km, max. ${TARIF_PARAMETER.eAutoLadeleistungKw} kW`],
          ["Wärmepumpe", `max. ${TARIF_PARAMETER.wpLeistungKw} kW, bis 50 % verschiebbar`],
          ["Haushalt", "bis 15 % verschiebbar"],
          ["Nicht enthalten", "Grundpauschalen, Sommer-Nieder-Arbeitspreis"],
        ]}
        quellen={[
          { name: "Energy-Charts, Fraunhofer ISE – Day-Ahead AT (Daten: Bundesnetzagentur | SMARD.de, CC BY 4.0)", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT" },
          { name: "SNE-V 2018 i. d. F. BGBl. II Nr. 305/2025 (Netzentgelte 2026)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html" },
          { name: "E-Control Tarifkalkulator", url: "https://www.e-control.at/tarifkalkulator" },
        ]}
        faq={FAQ}
        faqTitel="Dynamische Stromtarife in Österreich erklärt"
        cta={{
          title: "Strom dann nutzen, wenn er günstig ist – automatisch.",
          text: "PV-Anlage, Speicher, Ladeinfrastruktur und Energiemanagement aus einer Hand: Wir planen Ihr System so, dass Sonne und günstige Börsenstunden optimal genutzt werden – für Haus und Betrieb in ganz Österreich.",
          primary: { label: "Beratung anfragen", href: "/angebot" },
          secondary: { label: "Zum Solarrechner", href: "/solarrechner" },
        }}
      />
    </>
  );
}
