// src/app/rechner/stromspeicher/page.js

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import StromspeicherRechner from "@/components/Rechner/StromspeicherRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { SPEICHER, ALLGEMEIN, VERGUETUNG, fmt } from "@/lib/rechner/annahmen";
import { PREISQUELLEN } from "@/data/solarrechner";

const PFAD = "/rechner/stromspeicher";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Stromspeicher-Rechner Österreich: Größe & Ersparnis | Ökovolt",
  description:
    "Stromspeicher-Rechner für Österreich: Autarkie, Ersparnis und Amortisation stündlich simuliert – mit wirtschaftlich optimaler Speichergröße. Kostenlos rechnen.",
  keywords: ["Stromspeicher Rechner Österreich", "Speichergröße berechnen", "Batteriespeicher lohnt sich", "Autarkie berechnen", "PV Speicher Amortisation"],
});

const FAQ = [
  {
    q: "Welche Speichergröße ist wirtschaftlich sinnvoll?",
    a: "Für einen Haushalt mit 4.000–5.000 kWh Verbrauch und 8–10 kWp liegt das wirtschaftliche Optimum meist bei 5–8 kWh. Größere Speicher erhöhen die Autarkie zwar weiter, werden aber an vielen Tagen nicht mehr voll geladen oder entladen – jede zusätzliche Kilowattstunde bringt dann weniger Ersparnis, als sie kostet. Mit E-Auto oder Wärmepumpe verschiebt sich das Optimum nach oben.",
  },
  {
    q: "Warum erreicht man mit Speicher keine 100 % Autarkie?",
    a: "Im Winter erzeugt eine PV-Anlage in Österreich – abseits sonniger Hochlagen – nur etwa ein Zehntel ihres Jahresertrags auf drei Monate verteilt. An trüben Tagen reicht der Strom nicht einmal für den Tagesbedarf, ein Speicher kann dann nichts zwischenspeichern. Realistisch sind 60–80 % Autarkie – mehr nur mit sehr großer Anlage und hohem Aufwand.",
  },
  {
    q: "Wie rechnet der Stromspeicher-Rechner?",
    a: "Er simuliert ein ganzes Jahr in Stundenschritten (8.760 Stunden): Solarertrag nach Monat und Tageszeit mit wechselnd sonnigen und trüben Tagen, Haushaltslast nach typischem Tagesprofil, optional E-Auto und Wärmepumpe. Der Speicher lädt Überschüsse und entlädt bei Bedarf – mit Wirkungsgrad, nutzbarer Kapazität und Standby-Verbrauch. Die Ersparnis ergibt sich aus weniger Netzbezug abzüglich entgangenem Einspeiseerlös (OeMAG-Marktpreis bzw. Einspeisetarif); über die Nutzungsdauer rechnen wir – wie im Solarrechner – mit leicht steigendem Strompreis.",
  },
  {
    q: "Lohnt sich das Nachrüsten eines Speichers?",
    a: "Oft ja, aber es ist teurer als die Installation zusammen mit der PV-Anlage: Häufig wird ein eigener Batterie-Wechselrichter (AC-Kopplung) und ein zweiter Montagetermin nötig. Stellen Sie im Rechner „Nachrüsten“ ein, dann wird ein Aufschlag berücksichtigt. Besonders lohnend ist das Nachrüsten, wenn eine alte Anlage aus einem fixen Ökostromtarif fällt und der Überschuss nur noch den Marktpreis bringt. Der EAG-Investitionszuschuss fördert Speicher nur gemeinsam mit einer PV-Anlage.",
  },
  {
    q: "Wie lange hält ein Stromspeicher?",
    a: "Moderne Lithium-Eisenphosphat-Speicher (LFP) sind für 6.000 und mehr Vollzyklen ausgelegt. Ein typischer Heimspeicher kommt auf 150–300 Vollzyklen pro Jahr. Für die Wirtschaftlichkeit rechnen wir vorsichtig mit 15 Jahren Nutzungsdauer.",
  },
  {
    q: "Brauche ich mit Speicher einen dynamischen Stromtarif?",
    a: "Nicht zwingend. Ein Speicher erhöht vor allem Ihren Eigenverbrauch. Mit einem Spotpreis-Tarif und passendem Energiemanagement kann er zusätzlich günstigen Netzstrom nutzen – das lohnt sich vor allem mit E-Auto oder Wärmepumpe. Achtung: Netzbezug in den Speicher und spätere Rückspeisung sind derzeit netzentgeltpflichtig. Wie viel ein dynamischer Tarif heute bringt, zeigt unser Dynamischer-Tarif-Rechner.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="stromspeicher"
      breadcrumb="Stromspeicher-Rechner"
      eyebrow="Stromspeicher-Rechner"
      title={<>Wie viel Speicher <span className="ov-text-gradient-light">rechnet sich</span> für Sie?</>}
      lead="Autarkie, Eigenverbrauch und Amortisation – stündlich über ein ganzes Jahr simuliert, inklusive E-Auto und Wärmepumpe."
      chips={["Kostenlos & ohne Anmeldung", "Ergebnis sofort", "Stündlich simuliert"]}
      app={{
        name: "Ökovolt Stromspeicher-Rechner",
        description: "Berechnet Autarkie, Eigenverbrauch, Ersparnis, Amortisation und die wirtschaftlich optimale Größe eines Batteriespeichers für Photovoltaikanlagen.",
        featureList: ["Stündliche Jahressimulation", "Autarkie mit und ohne Speicher", "Wirtschaftliches Optimum", "E-Auto und Wärmepumpe", "Amortisation"],
      }}
      rechner={<StromspeicherRechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Ein Speicher lohnt sich, wenn er oft voll wird – und oft leer."
            lead={`Jede Kilowattstunde, die der Speicher abends liefert, ersetzt Netzstrom für rund ${fmt(ALLGEMEIN.strompreis * 100)} Cent – statt für etwa ${fmt(VERGUETUNG.saetze[0].teileinspeisung)} Cent eingespeist zu werden. Wie oft das passiert, entscheidet über die Wirtschaftlichkeit.`}
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Ein kleiner Speicher wird fast jeden Tag komplett genutzt, jede Kilowattstunde Kapazität arbeitet voll. Mit wachsender Größe bleibt ein immer größerer Teil an trüben Tagen und im Winter ungenutzt.
              Deshalb flacht die Autarkie-Kurve ab – und es gibt eine Größe, bei der sich <strong>Ersparnis über {SPEICHER.lebensdauerJahre} Jahre und Mehrkosten</strong> am besten die Waage halten: das wirtschaftliche Optimum.
            </p>
            <p>
              Mehr Autarkie als das Optimum kann trotzdem sinnvoll sein – etwa für Notstrom, ein künftiges E-Auto oder weil Ihnen Unabhängigkeit wichtig ist. Welche Speichersysteme wir einsetzen, lesen Sie auf unserer Seite zum{" "}
              <Link href="/produkte/stromspeicher">Stromspeicher</Link>. Die ganze PV-Anlage durchrechnen können Sie im <Link href="/solarrechner">Solarrechner</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["PV-Ertrag (Süd, Österreich)", `${fmt(ALLGEMEIN.ertragProKwp)} kWh/kWp`],
        ["Strompreis Netzbezug (vermeidbar)", `${fmt(ALLGEMEIN.strompreis * 100)} ct/kWh`],
        ["Einspeiseerlös (Rechensatz)", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} ct/kWh`],
        ["Speicherpreis mit PV-Anlage (brutto)", `${fmt(SPEICHER.preisProKwh)} €/kWh`],
        ["Aufschlag Nachrüstung", `${fmt(SPEICHER.nachruestAufschlag)} €`],
        ["Nutzbare Kapazität · Wirkungsgrad", `${fmt(SPEICHER.nutzbarAnteil * 100)} % · ${fmt(SPEICHER.wirkungsgradJeRichtung ** 2 * 100)} %`],
        ["Betrachtungsdauer · Strompreis", `${SPEICHER.lebensdauerJahre} Jahre · +${fmt(SPEICHER.strompreisSteigerung * 100)} %/Jahr`],
        ["E-Auto", `${SPEICHER.eAutoVerbrauch} kWh/100 km, ${fmt(SPEICHER.eAutoLadeanteilZuhause * 100)} % zu Hause`],
        ["Wärmepumpe", `${fmt(SPEICHER.wpStromKwh)} kWh Strom/Jahr`],
      ]}
      quellen={[
        { name: "OeMAG – Marktpreis", url: VERGUETUNG.quelle.url },
        { name: "BMWET/FH Technikum Wien – PV-Batteriespeichersysteme, Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf" },
        PREISQUELLEN.find((q) => q.name.startsWith("PVGIS")),
        { name: "HTW Berlin – Unabhängigkeitsrechner (Plausibilisierung)", url: "https://solar.htw-berlin.de/rechner/unabhaengigkeitsrechner/" },
      ]}
      faq={FAQ}
      faqTitel="Stromspeicher: Fragen & Antworten"
      cta={{
        title: "Die richtige Speichergröße – geplant mit Ihren echten Werten.",
        text: "Wir prüfen Ihren Lastgang, Ihr Dach und vorhandene Technik und empfehlen einen Speicher, der sich wirklich rechnet – herstellerunabhängig, in ganz Österreich. Für Betriebe bewerten wir zusätzlich Peak Shaving und Notstrom.",
        primary: { label: "Speicher-Angebot anfragen", href: "/angebot" },
        secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
      }}
    />
  );
}
