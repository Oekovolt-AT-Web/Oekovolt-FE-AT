// src/app/rechner/waermepumpe/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import WaermepumpeRechner from "@/components/Rechner/WaermepumpeRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { ALLGEMEIN, WAERMEPUMPE as W, VERGUETUNG, fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/waermepumpe";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Wärmepumpen-Rechner: Kosten vs. Gas & Öl | Ökovolt",
  description:
    "Wärmepumpen-Rechner für Österreich: Heizkosten und CO₂ von Gas oder Heizöl mit Wärmepumpe und Solarstrom vergleichen – mit E-Control-Preisen. Kostenlos.",
  keywords: ["Wärmepumpe Rechner Österreich", "Wärmepumpe Kosten Vergleich Gas", "Wärmepumpe mit PV", "Heizkosten Wärmepumpe berechnen", "Jahresarbeitszahl", "Raus aus Öl und Gas"],
});

const FAQ = [
  {
    q: "Was kostet der Betrieb einer Wärmepumpe im Jahr?",
    a: `Das hängt vor allem vom Wärmebedarf und der Jahresarbeitszahl (JAZ) ab. Ein Einfamilienhaus mit 15.000 kWh Wärmebedarf braucht bei einer JAZ von 3,5 rund 4.300 kWh Strom. Mit rund ${W.wpTarifCt} ct/kWh sind das etwa ${fmt(Math.round((4300 * W.wpTarifCt) / 100 / 50) * 50)} € plus rund ${W.wpNebenkosten} € Wartung – mit Solarstrom vom eigenen Dach entsprechend weniger.`,
  },
  {
    q: "Welche Jahresarbeitszahl ist realistisch?",
    a: "Luft-Wasser-Wärmepumpen erreichen im gut gedämmten Neubau mit Fußbodenheizung eine JAZ von 4 bis 4,5, im sanierten Bestand meist 3,3 bis 3,8. In unsanierten Altbauten mit hohen Vorlauftemperaturen sind 2,8 bis 3,2 realistisch. Erd- oder Grundwasser-Wärmepumpen liegen etwa 0,5 bis 1 Punkt höher.",
  },
  {
    q: "Wie viel Solarstrom kann eine Wärmepumpe nutzen?",
    a: "Weniger als viele denken: Die Wärmepumpe braucht den meisten Strom im Winter, die PV-Anlage liefert ihn im Sommer. Ohne Speicher deckt eine 10-kWp-Anlage typischerweise 15–25 % des Wärmepumpenstroms, mit Speicher und intelligenter Steuerung 30–40 %. Im Rechner sehen Sie die Deckung Monat für Monat.",
  },
  {
    q: "Welche Förderung gibt es 2026 für eine Wärmepumpe?",
    a: "Die Bundesförderung „Raus aus Öl und Gas“ für den Heizungstausch war für 2026 im Juli ausgeschöpft; neue Registrierungen sind derzeit nicht möglich, bereits registrierte Projekte bleiben gültig. Für 2027 und 2028 ist ein geringeres Budget angekündigt. Daneben fördern die Bundesländer den Heizungstausch mit eigenen Programmen, Betriebe über die Umweltförderung im Inland (KPC). Stand September 2026 – wir prüfen vor dem Auftrag, was für Sie gilt.",
  },
  {
    q: "Funktioniert eine Wärmepumpe auch im Altbau?",
    a: "In vielen Fällen ja. Entscheidend ist die nötige Vorlauftemperatur: Reichen an kalten Tagen etwa 55 °C, arbeitet eine moderne Wärmepumpe wirtschaftlich. Oft genügen einzelne größere Heizkörper oder ein hydraulischer Abgleich. Wir prüfen das vor Ort mit einer Heizlastberechnung.",
  },
  {
    q: "Warum steigen die Kosten für Gas und Öl weiter?",
    a: "In Österreich wird auf fossile Brennstoffe seit 2022 ein nationaler CO₂-Preis erhoben; mit dem Übergang in den europäischen Emissionshandel für Gebäude und Verkehr (ETS 2) wird eine weitere Verteuerung erwartet. Der Rechner nutzt heutige Preise; über 20 Jahre Nutzungsdauer dürfte der Vorteil der Wärmepumpe daher eher größer ausfallen.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="waermepumpe"
      breadcrumb="Wärmepumpen-Rechner"
      eyebrow="Wärmepumpen-Rechner"
      title={<>Gas, Öl oder <span className="ov-text-gradient-light">Wärmepumpe</span>?</>}
      lead="Jährliche Heizkosten und CO₂ im direkten Vergleich – mit Netzstrom oder mit Solarstrom vom eigenen Dach, gerechnet mit österreichischen Gas-, Heizöl- und Strompreisen."
      chips={["Kostenlos & ohne Anmeldung", "Mit PV-Anteil je Monat", "Preise E-Control 09/2026"]}
      app={{
        name: "Ökovolt Wärmepumpen-Rechner",
        description: "Vergleicht die jährlichen Heizkosten und CO₂-Emissionen von Gas- oder Ölheizung mit einer Wärmepumpe mit Netzstrom und mit Photovoltaik-Anteil.",
        featureList: ["Heizwärmebedarf nach Wohnfläche und Baujahr", "Kostenvergleich Gas/Heizöl vs. Wärmepumpe", "Solarstrom-Anteil je Monat", "CO₂-Bilanz mit österreichischem Strommix", "Förderhinweis Österreich"],
      }}
      rechner={<WaermepumpeRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Aus einer Kilowattstunde Strom werden drei bis vier Kilowattstunden Wärme."
            lead="Die Jahresarbeitszahl gibt an, wie effizient die Wärmepumpe Umweltwärme nutzt. Sie ist der wichtigste Hebel für niedrige Heizkosten – gefolgt vom Strompreis."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Zuerst ermitteln wir den <strong>Wärmebedarf</strong> Ihres Hauses – aus Wohnfläche und Dämmstandard oder direkt aus Ihrem bisherigen Gas- oder Ölverbrauch (abzüglich der Kesselverluste).
              Den teilen wir durch die Jahresarbeitszahl und erhalten den Strombedarf der Wärmepumpe.
            </p>
            <p>
              Mit Photovoltaik simulieren wir ein ganzes Jahr in Stundenschritten: Haushalt und Wärmepumpe verbrauchen gleichzeitig, der Solarstrom wird anteilig verteilt.
              Solarstrom setzen wir nicht mit null an, sondern mit dem entgangenen Einspeiseerlös – so bleibt der Vergleich ehrlich.
              Mehr zur Technik lesen Sie auf unserer Seite zur <Link href="/produkte/warmepumpe">Wärmepumpe</Link>, zur Kombination mit Speicher im <Link href="/rechner/stromspeicher">Stromspeicher-Rechner</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Gaspreis (Standard, gesamt brutto)", `${fmt(W.heizungen.gas.preisStandard, 1)} ct/kWh`],
        ["Heizölpreis (Standard, brutto)", `${fmt(W.heizungen.oel.preisStandard)} €/100 l`],
        ["Nutzungsgrad Gas · Öl", `${fmt(W.heizungen.gas.nutzungsgrad * 100)} % · ${fmt(W.heizungen.oel.nutzungsgrad * 100)} %`],
        ["Wartung & Rauchfangkehrer Gas · Öl · WP", `${fmt(W.heizungen.gas.nebenkosten)} · ${fmt(W.heizungen.oel.nebenkosten)} · ${fmt(W.wpNebenkosten)} €/Jahr`],
        ["Wärmepumpen-Strompreis", `${fmt(W.wpTarifCt)} ct/kWh`],
        ["CO₂ Gas · Öl · Heizstrom AT", `${fmt(W.heizungen.gas.co2 * 1000)} · ${fmt(W.heizungen.oel.co2 * 1000)} · ${fmt(W.co2Strom * 1000)} g/kWh`],
        ["Haushaltsstrom neben WP", `${fmt(W.haushaltKwh)} kWh/Jahr`],
        ["Solarstrom bewertet mit", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} ct/kWh (Einspeiseerlös)`],
        ["Speicher bei „PV + Speicher“", `${W.speicherMitPv} kWh`],
      ]}
      quellen={[
        { name: "E-Control Preismonitor (Gas, 09/2026)", url: "https://www.e-control.at/preismonitor" },
        { name: "EU Weekly Oil Bulletin (Heizöl AT, 21.09.2026)", url: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
        { name: "Marktentwicklung 2024 (CO₂-Koeffizient Strom)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf" },
        { name: "Raus aus Öl und Gas (KPC)", url: "https://www.umweltfoerderung.at" },
      ]}
      faq={FAQ}
      faqTitel="Wärmepumpe – Kosten, JAZ & Förderung"
      cta={{
        title: "Wärmepumpe und Photovoltaik – aus einer Hand geplant.",
        text: "Wir prüfen Heizlast, Vorlauftemperatur und Aufstellort, kombinieren Wärmepumpe, PV und Speicher sinnvoll und prüfen, welche Landes- oder Bundesförderung für Sie offensteht.",
        primary: { label: "Wärmepumpen-Angebot anfragen", href: "/angebot?waermepumpe=1" },
        secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
      }}
    />
  );
}
