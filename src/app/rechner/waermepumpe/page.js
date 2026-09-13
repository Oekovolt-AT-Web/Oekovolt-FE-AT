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
    "Wärmepumpen-Rechner 2026: Heizkosten und CO₂ von Gas oder Öl mit Wärmepumpe und Solarstrom vergleichen – inkl. BEG-Förderung. Jetzt kostenlos rechnen.",
  keywords: ["Wärmepumpe Rechner", "Wärmepumpe Kosten Vergleich Gas", "Wärmepumpe mit PV", "Heizkosten Wärmepumpe berechnen", "Jahresarbeitszahl", "BEG Förderung Wärmepumpe 2026"],
});

const FAQ = [
  {
    q: "Was kostet der Betrieb einer Wärmepumpe im Jahr?",
    a: "Das hängt vor allem vom Wärmebedarf und der Jahresarbeitszahl (JAZ) ab. Ein Einfamilienhaus mit 15.000 kWh Wärmebedarf braucht bei einer JAZ von 3,5 rund 4.300 kWh Strom. Mit einem Wärmepumpentarif von 26 ct/kWh sind das etwa 1.100 € plus rund 150 € Wartung – mit Solarstrom vom eigenen Dach entsprechend weniger.",
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
    a: `Über die BEG-Heizungsförderung der KfW (Programm 458) erhalten Selbstnutzer ${W.foerderung.grundProzent} % Grundförderung. Boni – etwa der Klimageschwindigkeitsbonus beim Tausch einer alten fossilen Heizung und der Einkommensbonus – können den Zuschuss auf bis zu ${W.foerderung.maxProzent} % erhöhen. Seit der Richtlinie vom Juli 2026 sind für die erste Wohneinheit höchstens ${fmt(W.foerderung.kostenDeckelErsteWe)} € förderfähig. Der Antrag muss vor Vertragsabschluss gestellt werden; Stand September 2026, bitte vor Antrag bei der KfW prüfen.`,
  },
  {
    q: "Funktioniert eine Wärmepumpe auch im Altbau?",
    a: "In vielen Fällen ja. Entscheidend ist die nötige Vorlauftemperatur: Reichen an kalten Tagen etwa 55 °C, arbeitet eine moderne Wärmepumpe wirtschaftlich. Oft genügen einzelne größere Heizkörper oder ein hydraulischer Abgleich. Wir prüfen das vor Ort mit einer Heizlastberechnung.",
  },
  {
    q: "Warum steigen die Kosten für Gas und Öl weiter?",
    a: "Auf fossile Brennstoffe wird ein CO₂-Preis erhoben, der schrittweise steigt – mit dem Übergang in den europäischen Emissionshandel (ETS 2) wird eine weitere Verteuerung erwartet. Der Rechner nutzt heutige Preise; über 20 Jahre Nutzungsdauer dürfte der Vorteil der Wärmepumpe daher eher größer ausfallen.",
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
      lead="Jährliche Heizkosten und CO₂ im direkten Vergleich – mit Netzstrom oder mit Solarstrom vom eigenen Dach, inklusive Förderhinweis."
      chips={["Kostenlos & ohne Anmeldung", "Mit PV-Anteil je Monat", "BEG-Förderung 2026"]}
      app={{
        name: "Ökovolt Wärmepumpen-Rechner",
        description: "Vergleicht die jährlichen Heizkosten und CO₂-Emissionen von Gas- oder Ölheizung mit einer Wärmepumpe mit Netzstrom und mit Photovoltaik-Anteil.",
        featureList: ["Heizwärmebedarf nach Wohnfläche und Baujahr", "Kostenvergleich Gas/Öl vs. Wärmepumpe", "Solarstrom-Anteil je Monat", "CO₂-Bilanz", "BEG-Förderhinweis"],
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
              Solarstrom setzen wir nicht mit null an, sondern mit der entgangenen Einspeisevergütung – so bleibt der Vergleich ehrlich.
              Mehr zur Technik lesen Sie auf unserer Seite zur <Link href="/produkte/warmepumpe">Wärmepumpe</Link>, zur Kombination mit Speicher im <Link href="/rechner/stromspeicher">Stromspeicher-Rechner</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Gaspreis (Standard)", `${fmt(W.heizungen.gas.preisStandard, 1)} ct/kWh`],
        ["Heizölpreis (Standard)", `${fmt(W.heizungen.oel.preisStandard)} €/100 l`],
        ["Nutzungsgrad Gas · Öl", `${fmt(W.heizungen.gas.nutzungsgrad * 100)} % · ${fmt(W.heizungen.oel.nutzungsgrad * 100)} %`],
        ["Nebenkosten Gas · Öl · WP", `${fmt(W.heizungen.gas.nebenkosten)} · ${fmt(W.heizungen.oel.nebenkosten)} · ${fmt(W.wpNebenkosten)} €/Jahr`],
        ["Wärmepumpen-Strompreis", `${fmt(W.wpTarifCt)} ct/kWh`],
        ["CO₂ Gas · Öl · Strommix", `${fmt(W.heizungen.gas.co2 * 1000)} · ${fmt(W.heizungen.oel.co2 * 1000)} · ${fmt(ALLGEMEIN.co2Strommix * 1000)} g/kWh`],
        ["Haushaltsstrom neben WP", `${fmt(W.haushaltKwh)} kWh/Jahr`],
        ["Solarstrom bewertet mit", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 2)} ct/kWh (Vergütung)`],
        ["Speicher bei „PV + Speicher“", `${W.speicherMitPv} kWh`],
      ]}
      quellen={[
        { name: "KfW – Heizungsförderung (458)", url: "https://www.kfw.de/458" },
        { name: "BDEW Gaspreisanalyse", url: "https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/" },
        { name: "Umweltbundesamt (Emissionsfaktoren)" },
      ]}
      faq={FAQ}
      faqTitel="Wärmepumpe – Kosten, JAZ & Förderung"
      cta={{
        title: "Wärmepumpe und Photovoltaik – aus einer Hand geplant.",
        text: "Wir prüfen Heizlast, Vorlauftemperatur und Aufstellort, kombinieren Wärmepumpe, PV und Speicher sinnvoll und unterstützen Sie beim Förderantrag.",
        primary: { label: "Wärmepumpen-Angebot anfragen", href: "/angebot?waermepumpe=1" },
        secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
      }}
    />
  );
}
