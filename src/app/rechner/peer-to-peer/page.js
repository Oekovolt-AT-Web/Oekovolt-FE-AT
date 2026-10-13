// src/app/rechner/peer-to-peer/page.js
//
// Peer-to-Peer-Rechner (ElWG): Erlös bei P2P-Preis gegenüber dem OeMAG-Marktpreis, Ersparnis des
// Abnehmers, Netzentgelte nur als Eingabe. Logik: src/components/Rechner/peerToPeerRechnung.js,
// OeMAG-Daten: src/data/oemag.js. Export über das Gate (Kennung "peer-to-peer").

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import PeerToPeerRechner from "@/components/Rechner/PeerToPeerRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { fmt } from "@/lib/rechner/annahmen";
import { OEMAG_REFERENZEN, P2P_ANNAHMEN, STAND } from "@/components/Rechner/peerToPeerRechnung";
import { QUELLEN as OEMAG_QUELLEN } from "@/data/oemag";

const PFAD = "/rechner/peer-to-peer";
const MITTEL12 = OEMAG_REFERENZEN[0];

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Peer-to-Peer-Rechner: PV-Strom direkt verkaufen | Ökovolt",
  description:
    "P2P-Stromvertrag nach ElWG rechnen: Erlös gegenüber OeMAG-Marktpreis, Ersparnis des Abnehmers, fairer Preis, Lieferantenpflichten ab 30/100 kW – Richtwert.",
  keywords: ["Peer-to-Peer Strom Rechner", "P2P Stromvertrag Österreich", "PV-Strom direkt verkaufen", "Peer-to-Peer ElWG", "OeMAG Marktpreis Vergleich", "Strom an Nachbarn verkaufen"],
});

const FAQ = [
  {
    q: "Was ist ein Peer-to-Peer-Stromvertrag nach ElWG?",
    a: "Der Verkauf oder die Schenkung von erneuerbarem Strom zwischen Marktteilnehmern auf Basis eines Vertrags mit vorab festgelegten Bedingungen für die automatische Abwicklung und Abrechnung (§ 6 Z 124 ElWG). Seit 1. Oktober 2026 können aktive Kunden zusätzlich zu ihrem bestehenden Liefervertrag so Strom teilen – ohne Verein oder Genossenschaft, nur mit Vertrag.",
  },
  {
    q: "Womit vergleicht der Rechner den P2P-Erlös?",
    a: `Mit dem OeMAG-Marktpreis für Photovoltaik, zu dem Anlagen unter 500 kWp ihren Überschuss abgeben können. Zur Wahl stehen das Mittel der letzten zwölf veröffentlichten Monate (${fmt(MITTEL12.ct, 2)} ct/kWh), der letzte Monatswert und das Jahresmittel 2025 – alle aus der OeMAG-Tabelle, Stand ${STAND.label}. Der Erzeuger gewinnt nur, wenn der P2P-Preis darüber liegt.`,
  },
  {
    q: "Wie kommt die Ersparnis des Abnehmers zustande?",
    a: `Der Abnehmer zahlt für die geteilte Menge den P2P-Preis statt des Energiepreises seines Lieferanten (Standardannahme ${fmt(P2P_ANNAHMEN.energiepreisCt)} ct/kWh netto, anpassbar). Netzentgelte, Abgaben und Umsatzsteuer laufen weiter wie bisher, weil der P2P-Bezug zusätzlich zum Liefervertrag stattfindet.`,
  },
  {
    q: "Warum steht der Netzentgelt-Abschlag nur als Eingabe im Rechner?",
    a: "Für Peer-to-Peer im Nahebereich sieht § 70 ElWG reduzierte Netzentgelte vor; die Höhe legt die E-Control per Verordnung fest. Laut Koordinationsstelle für Energiegemeinschaften gilt die Reduktion voraussichtlich ab der novellierten Systemnutzungsentgelte-Verordnung (1. Jänner 2027) – bis dahin gibt es nur für lokale und regionale EEG reduzierte Netzentgelte. Erfundene Prozentsätze wollen wir nicht rechnen: Tragen Sie 0 oder Ihre eigene Annahme ein.",
  },
  {
    q: "Ab wann gelten Lieferantenpflichten?",
    a: "Laut Koordinationsstelle bei Haushaltskunden mit Erzeugungsanlagen über 30 kW und bei sonstigen aktiven Kunden, EEG und BEG über 100 kW (§ 69 ElWG): Allgemeine Lieferbedingungen, Informationsblatt, Änderungen einen Monat vorab, transparente Rechnungen, Wahlrecht monatlich oder jährlich. Der Rechner zeigt nur die Schwelle – die Einordnung ist keine Rechtsberatung.",
  },
  {
    q: "Was ist mit Gleichzeitigkeit gemeint?",
    a: "Geteilt wird nur, was in derselben Viertelstunde erzeugt und beim Abnehmer verbraucht wird. Der Rest geht wie bisher an die OeMAG oder den Stromhändler. Der Standardwert von 60 % ist ein Richtwert – wer die Viertelstundenwerte beider Seiten hat, kann ihn in der Lastgang-Analyse genauer bestimmen.",
  },
  {
    q: "Ab wann geht Peer-to-Peer praktisch?",
    a: "Die Bestimmungen gelten seit 1. Oktober 2026. Laut Koordinationsstelle sind neue Modelle ab 5. Oktober 2026 zunächst nur mit Zählpunkten beim selben Netzbetreiber umsetzbar; netzübergreifend bzw. österreichweit voraussichtlich ab April 2027. Beide Seiten brauchen Smart Meter mit Viertelstundenauslesung.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="peer-to-peer"
      breadcrumb="Peer-to-Peer-Rechner"
      eyebrow="Peer-to-Peer nach ElWG · seit 1. Oktober 2026"
      title={<>PV-Strom direkt verkaufen – <span className="ov-text-gradient-light">lohnt sich Peer-to-Peer?</span></>}
      lead="Erlös des Erzeugers bei Ihrem P2P-Preis gegenüber dem OeMAG-Marktpreis, Ersparnis des Abnehmers und ein fairer Preis für beide – mit echten OeMAG-Monatswerten. Netzentgelt-Abschläge erst nach Verordnung, daher nur als Eingabe."
      chips={["OeMAG-Monatswerte", "Fairer Preis per Regler", "Lieferantenpflichten ab 30/100 kW"]}
      app={{
        name: "Ökovolt Peer-to-Peer-Rechner Österreich",
        description: "Vergleicht den Jahreserlös eines PV-Erzeugers bei einem Peer-to-Peer-Vertrag mit der OeMAG-Abnahme und zeigt die Ersparnis des Abnehmers, einen fairen Preis und die Schwelle für Lieferantenpflichten nach § 69 ElWG.",
        featureList: ["OeMAG-Marktpreis (12-Monats-Mittel, letzter Monat, 2025)", "Gleichzeitigkeit als Regler", "Fairer Preis als Mitte", "Netzentgelt-Abschlag nur als Eingabe", "Lieferantenpflicht-Schwelle 30/100 kW", "CSV-Export"],
      }}
      rechner={<PeerToPeerRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Der Preis zwischen OeMAG und Lieferant entscheidet."
            lead="Ein Peer-to-Peer-Vertrag lohnt sich für beide, wenn der Preis zwischen dem liegt, was der Erzeuger sonst bekäme, und dem, was der Abnehmer sonst zahlt."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Der Erzeuger gibt seinen Überschuss ohne Vertrag an die OeMAG ab – zum monatlich veröffentlichten Marktpreis für Photovoltaik. Mit Peer-to-Peer verkauft er den Teil, der zeitgleich beim Abnehmer
              verbraucht wird, zum vereinbarten Preis; der Rest geht weiter an die OeMAG. Sein Mehrerlös ist die geteilte Menge mal der Differenz zwischen P2P-Preis und OeMAG-Preis.
            </p>
            <p>
              Der Abnehmer spart die Differenz zwischen dem Energiepreis seines Lieferanten und dem P2P-Preis. Netzentgelte, Abgaben und Umsatzsteuer bleiben, weil der P2P-Bezug zusätzlich zum Liefervertrag läuft
              (§ 68 ElWG). Reduzierte Netzentgelte im Nahebereich kommen erst mit der Verordnung der E-Control – deshalb nur als Eingabe. Den Unterschied zu EEG, BEG und GEA erklärt der Ratgeber{" "}
              <Link href="/ratgeber/peer-to-peer-strom-teilen">Peer-to-Peer: Strom teilen</Link>; welche Mengen tatsächlich zeitgleich anfallen, zeigt die <Link href="/lastgang-analyse">Lastgang-Analyse</Link> mit den
              Viertelstundenwerten aus dem <Link href="/smart-meter">Smart-Meter-Portal</Link>. Für Gemeinschaften mit Verein oder Genossenschaft gibt es den <Link href="/rechner/energiegemeinschaft">Energiegemeinschafts-Rechner</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["OeMAG-Referenz (Standard)", `${fmt(MITTEL12.ct, 2)} ct/kWh, Mittel ${MITTEL12.sub}`],
        ["Energiepreis Lieferant (Standard)", `${fmt(P2P_ANNAHMEN.energiepreisCt)} ct/kWh netto, anpassbar`],
        ["Gleichzeitigkeit (Standard)", `${fmt(P2P_ANNAHMEN.gleichzeitigkeit * 100)} % – Richtwert`],
        ["Netzentgelt-Abschlag", "nur Eingabe, Standard 0 (Verordnung ausstehend)"],
        ["Lieferantenpflichten", `über ${P2P_ANNAHMEN.lieferantenpflichtKw.haushalt} kW (Haushalt) bzw. ${P2P_ANNAHMEN.lieferantenpflichtKw.sonst} kW (sonst)`],
        ["Elektrizitätsabgabe, Förderbeitrag", "unverändert (Entfall nur in der EEG)"],
        ["Nicht enthalten", "Abwicklungskosten, Messung, Ausgleichsenergie, Umsatzsteuer"],
      ]}
      quellen={[
        { name: `${OEMAG_QUELLEN.oemag.label} (abgerufen ${OEMAG_QUELLEN.oemag.abgerufen})`, url: OEMAG_QUELLEN.oemag.url },
        { name: "RIS – ElWG, BGBl. I Nr. 91/2025 (§ 6 Z 124, §§ 65–72, § 188)", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" },
        { name: "Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG (Fristen, § 69, § 70)", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" },
        { name: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf" },
      ]}
      faq={FAQ}
      faqTitel="Peer-to-Peer-Strom in Österreich erklärt"
      cta={{
        title: "Strom teilen braucht die richtige Anlage – und saubere Daten.",
        text: "Wir planen PV-Anlagen für Betriebe, Höfe und Gemeinden so, dass Überschuss und Abnehmer zusammenpassen: Lastgang-Auswertung, Netzanmeldung, Messung und Betrieb aus einer Hand – in ganz Österreich.",
        primary: { label: "Beratung anfragen", href: "/angebot?objekt=gewerbe" },
        secondary: { label: "Lastgang auswerten", href: "/lastgang-analyse" },
      }}
    />
  );
}
