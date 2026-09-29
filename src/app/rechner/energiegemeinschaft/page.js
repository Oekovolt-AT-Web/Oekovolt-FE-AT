// src/app/rechner/energiegemeinschaft/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import EGRechner from "@/components/RechnerGewerbe/EGRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { fmt } from "@/lib/rechner/annahmen";
import { EG_ANNAHMEN, MARKTPREIS_AKTUELL, MARKTPREIS_CT } from "@/lib/rechner/energiegemeinschaft";
import { NETZ_QUELLE } from "@/lib/rechner/peakshaving";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

const PFAD = "/rechner/energiegemeinschaft";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Energiegemeinschafts-Rechner Österreich | Ökovolt",
  description:
    "Energiegemeinschafts-Rechner für Gemeinden, Betriebe und Haushalte: geteilter Solarstrom, Netzentgelt-Ersparnis 2026, Erlös vs. OeMAG-Marktpreis und Win-win-Preis.",
  keywords: ["Energiegemeinschaft Rechner", "EEG Rechner Österreich", "Energiegemeinschaft Ersparnis", "Netzentgelt Energiegemeinschaft 2026", "Energiegemeinschaft Gemeinde", "Energiegemeinschaft Preis"],
});

const FAQ = [
  {
    q: "Wie viel Netzentgelt spart eine Energiegemeinschaft 2026?",
    a: "Bis 31. Dezember 2026 sinkt für Strom, den Mitglieder aus einer lokalen Erneuerbare-Energie-Gemeinschaft (EEG) beziehen, der Arbeitspreis des Netznutzungsentgelts um 57 %, in regionalen EEG um 28 % (Netzebene 6 und 7) bzw. 64 % (Netzebene 4 und 5). Bürgerenergiegemeinschaften erhalten 2026 keine Reduktion. Der Rechner nutzt die Arbeitspreise 2026 Ihres Netzbereichs laut Systemnutzungsentgelte-Verordnung.",
  },
  {
    q: "Was ändert sich ab 2027?",
    a: "Ab 1. Jänner 2027 gilt die neue Netzentgelt-Systematik nach ElWG: Alle Formen der gemeinsamen Energienutzung im Nahebereich erhalten Abschläge je genutzter Netzinfrastruktur. Die Prozentsätze legt die Tarifverordnung fest, die noch aussteht. Der Leistungspreis wird bei lokalen und regionalen Modellen nicht saldiert.",
  },
  {
    q: "Welcher Preis ist in der Gemeinschaft fair?",
    a: `Fair ist ein Preis zwischen dem, was der Erzeuger sonst bekäme (OeMAG-Marktpreis, zuletzt im Mittel ${fmt(MARKTPREIS_CT, 2)} ct/kWh), und dem Energiepreis, den der Verbraucher seinem Lieferanten zahlt. Der Rechner schlägt die Mitte vor – dann teilen sich beide den Vorteil. Netzentgelt- und Abgabenvorteile kommen dem Verbraucher zusätzlich zugute.`,
  },
  {
    q: "Dürfen Unternehmen an einer Energiegemeinschaft teilnehmen?",
    a: "Kleine und mittlere Unternehmen dürfen an EEG und BEG teilnehmen, sofern das nicht ihre Haupttätigkeit ist. Große Unternehmen (ab 250 Beschäftigte und mehr als 50 Mio. € Umsatz bzw. 43 Mio. € Bilanzsumme) dürfen nur an Bürgerenergiegemeinschaften und Peer-to-Peer-Modellen teilnehmen, mit höchstens 6 MW. Gemeinden können in allen Modellen mitmachen.",
  },
  {
    q: "Warum wird nicht der ganze Überschuss geteilt?",
    a: "Geteilt wird nur, was in derselben Viertelstunde verbraucht wird. Mittags im Sommer übersteigt der PV-Überschuss oft den Bedarf der anderen Teilnehmenden, der Rest geht wie bisher an den Stromhändler. Betriebe mit Dauerlast (Kühlung, Kläranlage, Mehrschichtbetrieb) ergänzen PV-Erzeuger deshalb besonders gut.",
  },
  {
    q: "Welche Abgaben entfallen in der Energiegemeinschaft?",
    a: "Nur in der EEG entfallen für den Gemeinschaftsstrom die Elektrizitätsabgabe – 2026 für Nicht-Haushalte 0,82 ct/kWh, für Haushalte 0,1 ct/kWh – und der Erneuerbaren-Förderbeitrag. Den Förderbeitrag beziffert der Rechner nicht, weil er als prozentualer Aufschlag auf die Netzentgelte verrechnet wird. In der BEG fallen beide weiterhin an.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="energiegemeinschaft"
      breadcrumb="Energiegemeinschafts-Rechner"
      eyebrow="Energiegemeinschafts-Rechner"
      title={<>Solarstrom teilen – <span className="ov-text-gradient-light">was bringt es allen?</span></>}
      lead="Gemeinde, Betriebe und Haushalte in einer Gemeinschaft: geteilte Energie, Netzentgelt-Ersparnis nach Netzbereich und ein Preis, bei dem Erzeuger und Verbraucher gewinnen."
      chips={["Netzentgelte 2026 je Netzbereich", "Stündlich über ein Jahr", "Win-win-Preis per Regler"]}
      app={{
        name: "Ökovolt Energiegemeinschafts-Rechner",
        description:
          "Berechnet für Erneuerbare-Energie-Gemeinschaften und Bürgerenergiegemeinschaften in Österreich die geteilte Energie, die Netzentgelt-Ersparnis 2026, den Entfall der Elektrizitätsabgabe, den Mehrerlös der Erzeuger gegenüber dem OeMAG-Marktpreis und einen fairen Gemeinschaftspreis.",
        featureList: ["Gemeinden, Betriebe, Landwirtschaft und Haushalte", "Lokale und regionale EEG, BEG", "Netzentgelte 2026 für 13 Netzbereiche", "Energiefluss-Diagramm", "Win-win-Preis zwischen Marktpreis und Energiepreis", "Teilnahmeprüfung große Unternehmen und Netzebene"],
      }}
      rechner={<EGRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Geteilt wird nur, was zur gleichen Zeit gebraucht wird."
            lead="Der Rechner legt für jede Teilnehmerin und jeden Teilnehmer ein typisches Lastprofil über 8.760 Stunden an, zieht den eigenen Solarstrom ab und verteilt den Überschuss stündlich auf den Restbedarf der anderen – wie der Netzbetreiber bei dynamischer Aufteilung."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Auf den Gemeinschaftsstrom wirken drei Vorteile: ein <strong>Energiepreis unter dem des Lieferanten</strong>, der <strong>reduzierte Arbeitspreis der Netznutzung</strong> und – nur in der EEG – der Entfall der Elektrizitätsabgabe.
              Der Erzeuger erhält dafür mehr als den OeMAG-Marktpreis. Kosten für Organisation und Abrechnung sind nicht abgezogen.
            </p>
            <p>
              Wer teilnehmen darf, wie abgerechnet wird und was steuerlich gilt, erklären die Ratgeber{" "}
              <Link href="/ratgeber/energiegemeinschaft-gewerbe">Energiegemeinschaft für Unternehmen</Link> und{" "}
              <Link href="/ratgeber/energiegemeinschaft-gruenden">Energiegemeinschaft gründen</Link>. Die Umsetzung mit Ökovolt zeigt die Seite{" "}
              <Link href="/energiegemeinschaften">Energiegemeinschaften</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Reduktion lokal (bis 31.12.2026)", "−57 % Arbeitspreis"],
        ["Reduktion regional NE 6/7 · NE 4/5", "−28 % · −64 %"],
        ["BEG (2026)", "keine Reduktion"],
        ["Arbeitspreise Netznutzung", "SNE-V 2026 je Netzbereich"],
        ["Elektrizitätsabgabe (nur EEG)", `${fmt(EG_ANNAHMEN.elAbgabeCt.sonst, 2)} ct · Haushalte ${fmt(EG_ANNAHMEN.elAbgabeCt.haushalt, 1)} ct`],
        ["OeMAG-Marktpreis PV Ø 12 Monate", `${fmt(MARKTPREIS_CT, 2)} ct/kWh`],
        [`OeMAG-Marktpreis ${MARKTPREIS_AKTUELL.zeitraum}`, `${fmt(MARKTPREIS_AKTUELL.ct, 3)} ct/kWh`],
        ["Energiepreis Lieferant (Standard)", `${fmt(EG_ANNAHMEN.energiepreisCt)} ct/kWh netto`],
        ["Verbrauch je Haushalt (Standard)", `${fmt(EG_ANNAHMEN.haushaltKwh)} kWh`],
        ["PV-Ertrag", `${fmt(EG_ANNAHMEN.ertragProKwp)} kWh/kWp`],
        ["Zeitauflösung", "Stunden (Netzbetreiber: ¼ h)"],
      ]}
      quellen={[
        { name: "Smart Meter Portal – Netzentgelte Energiegemeinschaft 2026", url: "https://www.smartmeter-portal.at/energiegemeinschaften/netzentgelte/" },
        { name: "Koordinationsstelle für Energiegemeinschaften – Detailwissen", url: "https://energiegemeinschaften.gv.at/detailwissen/" },
        { name: "Koordinationsstelle – Steuern & Abgaben für EEG", url: "https://energiegemeinschaften.gv.at/downloads/erneuerbare-energie-gemeinschaften-steuern-abgaben/" },
        NETZ_QUELLE,
        VERGUETUNG.quelle,
        { name: "E-Control – SNE-G-V-Begutachtungsentwurf (07/2026)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf" },
      ]}
      faq={FAQ}
      faqTitel="Energiegemeinschaften: Fragen & Antworten"
      cta={{
        title: "Eine Gemeinschaft, die sich für alle rechnet.",
        text: "Wir analysieren die Lastgänge der Teilnehmenden, planen die PV-Anlagen passend dazu und begleiten Gründung, Netzbetreiber-Anmeldung und Inbetriebnahme – für Gemeinden, Betriebe und Landwirtschaft in ganz Österreich.",
        primary: { label: "Gemeinschaft planen", href: "/energiegemeinschaften" },
        secondary: { label: "Anfrage starten", href: "/angebot" },
      }}
    />
  );
}
