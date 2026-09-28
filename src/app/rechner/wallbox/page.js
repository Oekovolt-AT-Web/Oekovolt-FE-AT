// src/app/rechner/wallbox/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import WallboxRechner from "@/components/Rechner/WallboxRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { ALLGEMEIN, WALLBOX as WB, VERGUETUNG, fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/wallbox";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "E-Auto-Laderechner: Strom vs. Benzin | Ökovolt",
  description:
    "E-Auto-Laderechner für Österreich: Laden mit Netz- oder Solarstrom vs. Benzin und Diesel – Kosten je 100 km, Ersparnis und CO₂. Jetzt kostenlos rechnen.",
  keywords: ["E-Auto Ladekosten Rechner", "Wallbox Rechner", "E-Auto laden mit PV", "Kosten pro 100 km E-Auto", "E-Auto vs Benziner Kosten", "Solarstrom E-Auto"],
});

const FAQ = [
  {
    q: "Was kostet es, ein E-Auto zu Hause zu laden?",
    a: `Bei 18 kWh/100 km und ${fmt(ALLGEMEIN.strompreis * 100)} ct/kWh kosten 100 km rund ${fmt(18 * ALLGEMEIN.strompreis, 2)} € – deutlich weniger als ein Benziner mit 7 Litern. Mit Solarstrom vom eigenen Dach sinken die Kosten weiter: Rechnerisch „kostet“ Sie jede selbst geladene Kilowattstunde nur den entgangenen Einspeiseerlös von rund ${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} ct.`,
  },
  {
    q: "Wie viel Solarstrom kann ich realistisch ins Auto laden?",
    a: "Das hängt davon ab, wann das Auto zu Hause steht. Wer tagsüber pendelt und ohne Steuerung lädt, schafft meist 20–30 % Solaranteil. Mit PV-Überschussladen, Homeoffice oder einem Zweitwagen sind 50–70 % möglich – im Sommer deutlich mehr als im Winter.",
  },
  {
    q: "Brauche ich für das Laden mit PV-Überschuss eine spezielle Wallbox?",
    a: "Ja, die Wallbox muss mit dem Wechselrichter oder einem Energiemanager kommunizieren, damit sie die Ladeleistung an den aktuellen Überschuss anpasst. Viele Modelle können außerdem zwischen ein- und dreiphasigem Laden umschalten, um auch kleine Überschüsse zu nutzen. Wir planen Wallbox und PV-Anlage aufeinander abgestimmt.",
  },
  {
    q: "Muss ich die Wallbox beim Netzbetreiber melden?",
    a: "Ja. In Österreich ist jede Ladeeinrichtung dem Netzbetreiber zu melden – das erledigt der Elektrotechniker. Bis 11 kW dreiphasig ist das in der Regel ohne gesonderte Netzprüfung möglich; bei höheren Leistungen wie 22 kW prüft der Netzbetreiber im Einzelfall. Einphasig sind nach den TAEV höchstens 3,68 kVA zulässig. Mit Wallbox ist beim Smart Meter keine Opt-out-Einstellung möglich.",
  },
  {
    q: "Was ist in den Kosten nicht enthalten?",
    a: "Der Rechner vergleicht nur die Energiekosten. Anschaffung, motorbezogene Versicherungssteuer (seit April 2025 auch für E-Autos fällig), Versicherung, Wartung und Wertverlust sind nicht berücksichtigt – E-Autos haben meist geringere Wartungskosten.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="wallbox"
      breadcrumb="E-Auto-Laderechner"
      eyebrow="E-Auto-Laderechner"
      title={<>Tanken oder <span className="ov-text-gradient-light">mit Sonne laden</span>?</>}
      lead="Was Sie jeder Kilometer kostet – mit Benzin, Diesel, Netzstrom oder Solarstrom vom eigenen Dach. Inklusive Ersparnis und CO₂."
      chips={["Kostenlos & ohne Anmeldung", "Kosten je 100 km", "Mit PV-Überschussladen"]}
      app={{
        name: "Ökovolt E-Auto-Laderechner",
        description: "Vergleicht die jährlichen Energiekosten und CO₂-Emissionen eines Benzin- oder Diesel-Pkw mit einem E-Auto, das mit Netzstrom oder Solarstrom geladen wird.",
        featureList: ["Kosten je 100 km", "Netzstrom vs. Solarstrom", "Öffentliches Laden", "CO₂-Vergleich", "Ersparnis über 10 Jahre"],
      }}
      rechner={<WallboxRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Die günstigste Kilowattstunde ist die vom eigenen Dach."
            lead="Solarstrom, der ins Auto statt ins Netz fließt, kostet Sie nur den entgangenen Einspeiseerlös – ein Bruchteil von Netzstrom oder Benzin."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Aus Fahrleistung und Verbrauch ergibt sich der jährliche Ladestrom. Den teilen wir auf: öffentliches Laden, Netzstrom an der eigenen Wallbox und Solarstrom aus dem PV-Überschuss.
              Für den Verbrenner rechnen wir mit Literverbrauch und aktuellem Kraftstoffpreis.
            </p>
            <p>
              Den Solaranteil erhöhen eine Wallbox mit Überschussladen, ein <Link href="/rechner/stromspeicher">Stromspeicher</Link> oder ein{" "}
              <Link href="/rechner/dynamischer-stromtarif">dynamischer Stromtarif</Link> für die Nachtstunden. Welche Wallboxen wir installieren, zeigen wir auf unserer <Link href="/produkte/wallbox">Wallbox-Seite</Link>;
              Firmenflotten und Kundenparkplätze planen wir unter <Link href="/ladeinfrastruktur">Ladeinfrastruktur</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Benzin · Diesel (Standard)", `${fmt(WB.kraftstoffe.benzin.preis, 2)} · ${fmt(WB.kraftstoffe.diesel.preis, 2)} €/l`],
        ["Verbrauch Benziner · Diesel", `${fmt(WB.kraftstoffe.benzin.verbrauch, 1)} · ${fmt(WB.kraftstoffe.diesel.verbrauch, 1)} l/100 km`],
        ["Netzstrom zu Hause (vermeidbar, Standard)", `${fmt(ALLGEMEIN.strompreis * 100)} ct/kWh`],
        ["Öffentlich laden (Mischpreis AC/DC, Richtwert)", `${WB.oeffentlichCt} ct/kWh`],
        ["Solarstrom bewertet mit (Einspeiseerlös)", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} ct/kWh`],
        ["CO₂ Benzin · Diesel", `${fmt(WB.kraftstoffe.benzin.co2, 2)} · ${fmt(WB.kraftstoffe.diesel.co2, 2)} kg/l`],
        ["CO₂ Strommix · Solar (Betrieb)", `${fmt(ALLGEMEIN.co2Strommix * 1000)} · 0 g/kWh`],
      ]}
      quellen={[
        { name: "EU Weekly Oil Bulletin (Österreich, 21.09.2026)", url: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
        { name: "OeMAG – Marktpreis", url: VERGUETUNG.quelle.url },
        { name: "Marktentwicklung 2024 (CO₂-Koeffizient Strom)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf" },
      ]}
      faq={FAQ}
      faqTitel="E-Auto laden – Kosten & Solarstrom"
      cta={{
        title: "Wallbox und PV-Anlage – perfekt aufeinander abgestimmt.",
        text: "Wir installieren Ihre Wallbox mit PV-Überschussladen, melden sie beim Netzbetreiber und sorgen dafür, dass möglichst viel Sonne im Akku landet – vom Einfamilienhaus bis zum Firmenparkplatz.",
        primary: { label: "Wallbox-Angebot anfragen", href: "/angebot?wallbox=1" },
        secondary: { label: "Zum Solarrechner", href: "/solarrechner" },
      }}
    />
  );
}
