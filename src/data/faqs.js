// src/data/faqs.js
//
// Redaktionelle FAQ-Ergaenzungen fuer /faqs. Die Fragen aus dem Backoffice
// (faqs_page) werden in der Seite den gleichen Kategorien zugeordnet und
// um diese Eintraege ergaenzt. Fachliche Angaben: Stand September 2026.

import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

export const FAQ_KATEGORIEN = [
  { id: "planung", label: "Planung & Technik", apiFeld: "table_first_question", apiZuerst: true },
  { id: "kosten", label: "Kosten & Förderung", apiFeld: "table_second_question" },
  { id: "speicher", label: "Speicher, Wallbox & Wärmepumpe" },
  { id: "installation", label: "Installation & Anmeldung", apiFeld: "table_third_question" },
  { id: "service", label: "Service & Betrieb", apiFeld: "table_fourth_question" },
];

export const FAQ_ERGAENZUNG = {
  planung: [
    {
      q: "Wie viel Strom erzeugt eine Photovoltaikanlage?",
      a: `In Süddeutschland erzeugt eine gut ausgerichtete Anlage rund ${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh pro kWp im Jahr, in Norddeutschland eher 850 bis 950 kWh. Eine 10-kWp-Anlage im Allgäu liefert damit etwa 10.000 kWh – mehr als das Doppelte des Verbrauchs eines typischen Vier-Personen-Haushalts.`,
    },
    {
      q: "Welche Anlagengröße passt zu meinem Haus?",
      a: "Als Faustregel gilt mindestens 1 kWp je 1.000 kWh Jahresverbrauch. Weil Module günstig geworden sind und E-Auto oder Wärmepumpe den Verbrauch später erhöhen, planen wir häufig etwas größer. Pro kWp werden rund 5 m² Dachfläche benötigt.",
    },
    {
      q: "Lohnt sich Photovoltaik auch auf einem Ost-West-Dach?",
      a: "Ja. Ost-West-Dächer erzeugen rund 10 bis 15 % weniger als Süddächer, verteilen den Ertrag aber gleichmäßiger über den Tag. Das erhöht den Eigenverbrauch am Morgen und Abend und entschärft die Mittagsspitze – wirtschaftlich liegen beide Varianten oft nah beieinander.",
    },
  ],
  kosten: [
    {
      q: "Was kostet eine Solaranlage 2026 ungefähr?",
      a: `Schlüsselfertige Anlagen kosten 2026 je nach Größe rund ${eur(preisProKwp(30))} bis ${eur(preisProKwp(5))} je kWp, eine 10-kWp-Anlage also etwa ${eur(10 * preisProKwp(10))}. Ein Stromspeicher kommt mit rund ${ANNAHMEN.speicherPreisProKwh} € je kWh hinzu. Ein verbindliches Angebot erstellen wir nach dem Vor-Ort-Termin.`,
    },
    {
      q: "Wie hoch ist die Einspeisevergütung aktuell?",
      a: `Für Anlagen bis 10 kWp mit Inbetriebnahme ab dem ${VERGUETUNG.gueltigAbLabel} gibt es ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct/kWh bei Überschusseinspeisung und ${ct(VERGUETUNG.saetze[0].volleinspeisung)} ct/kWh bei Volleinspeisung – garantiert für 20 Jahre. Die geplante EEG-Novelle soll die feste Vergütung für neue kleine Anlagen ab 2027 ablösen.`,
    },
    {
      q: "Muss ich für meine PV-Anlage Steuern zahlen?",
      a: "In den meisten Fällen nicht. Seit 2023 gilt für PV-Anlagen und Speicher auf Wohngebäuden ein Umsatzsteuersatz von 0 %, und Einnahmen aus Anlagen bis 30 kWp je Wohneinheit sind von der Einkommensteuer befreit. Bei gewerblicher Nutzung oder größeren Anlagen empfehlen wir eine steuerliche Beratung.",
    },
    {
      q: "Wann hat sich eine PV-Anlage bezahlt gemacht?",
      a: "Gut auf den Verbrauch ausgelegte Anlagen amortisieren sich heute meist nach 10 bis 14 Jahren und laufen danach viele weitere Jahre praktisch kostenlos. Entscheidend ist der Eigenverbrauch – mit unserem Solarrechner sehen Sie den Cashflow über 20 Jahre.",
    },
  ],
  speicher: [
    {
      q: "Lohnt sich ein Stromspeicher?",
      a: `Für die meisten Einfamilienhäuser ja. Ein passend dimensionierter Speicher hebt die Autarkie typischerweise von rund 30 auf 55 bis 75 %. Jede gespeicherte Kilowattstunde ersetzt Netzstrom für rund ${Math.round(ANNAHMEN.strompreis * 100)} Cent, statt für ${ct(VERGUETUNG.saetze[0].teileinspeisung)} Cent eingespeist zu werden. Als Faustregel reicht 1 kWh Kapazität je 1.000 kWh Jahresverbrauch.`,
    },
    {
      q: "Habe ich mit Speicher auch bei Stromausfall Strom?",
      a: "Nur, wenn das System not- oder ersatzstromfähig geplant wurde. Standardmäßig schaltet sich eine netzgekoppelte Anlage bei Netzausfall aus Sicherheitsgründen ab. Mit Ersatzstrom-Umschaltung versorgt der Speicher das Haus oder ausgewählte Stromkreise weiter.",
    },
    {
      q: "Kann ich mein E-Auto mit Solarstrom laden?",
      a: "Ja. Mit einer steuerbaren Wallbox und einem Energiemanagementsystem lädt das Auto bevorzugt mit Überschussstrom vom Dach. Wallboxen über 4,2 kW fallen unter § 14a EnWG – dafür erhalten Sie reduzierte Netzentgelte.",
    },
    {
      q: "Passen Wärmepumpe und Photovoltaik zusammen?",
      a: "Sehr gut. Die Wärmepumpe nutzt Solarstrom vor allem in der Übergangszeit und für Warmwasser; im Hochwinter kommt der größere Teil aus dem Netz. Ein Energiemanagement verschiebt Laufzeiten gezielt in sonnige Stunden und erhöht so den Eigenverbrauch.",
    },
  ],
  installation: [
    {
      q: "Muss ich meine PV-Anlage anmelden?",
      a: "Ja. Die Anlage wird vor dem Anschluss beim Netzbetreiber angemeldet und nach der Inbetriebnahme innerhalb eines Monats im Marktstammdatenregister der Bundesnetzagentur eingetragen. Beides übernehmen wir für Sie.",
    },
    {
      q: "Brauche ich einen Smart Meter?",
      a: "Für neue Anlagen über 7 kW ist ein intelligentes Messsystem vorgesehen, das der Messstellenbetreiber einbaut. Seit dem Solarspitzengesetz dürfen Neuanlagen ohne Steuerbox höchstens 60 % ihrer Leistung einspeisen – mit Speicher und Eigenverbrauch fällt das kaum ins Gewicht.",
    },
    {
      q: "Wie lange dauert die Montage auf dem Dach?",
      a: "Die eigentliche Montage eines Einfamilienhauses dauert meist ein bis drei Tage, abhängig von Dachform, Anlagengröße und Elektroarbeiten. Die Gesamtdauer von der Anfrage bis zur Inbetriebnahme hängt zusätzlich von Lieferzeiten und der Rückmeldung des Netzbetreibers ab.",
    },
  ],
  service: [
    {
      q: "Wie lange hält eine Photovoltaikanlage?",
      a: "Solarmodule sind auf 25 bis 30 Jahre und mehr ausgelegt; Hersteller garantieren meist 80 bis 90 % der Leistung nach 25 bis 30 Jahren. Wechselrichter halten typischerweise 12 bis 20 Jahre und werden einmal in der Laufzeit getauscht.",
    },
    {
      q: "Muss eine PV-Anlage gewartet werden?",
      a: "Photovoltaik ist wartungsarm. Sinnvoll sind eine regelmäßige Sichtkontrolle, die Überwachung der Erträge per App und eine elektrische Prüfung in größeren Abständen. Ertragseinbrüche erkennen Sie so früh.",
    },
    {
      q: "Brauche ich eine Versicherung für die Anlage?",
      a: "Empfehlenswert ist sie. Häufig lässt sich die Anlage in die Wohngebäudeversicherung aufnehmen; eine separate Photovoltaikversicherung deckt zusätzlich Ertragsausfall, Überspannung oder Tierbiss ab. Prüfen Sie auch die Betreiberhaftpflicht.",
    },
  ],
};
