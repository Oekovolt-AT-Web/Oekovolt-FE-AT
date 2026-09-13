// Ratgeber: Wärmepumpe Kosten 2026
// Betriebskosten aus dem Rechenkern des Wärmepumpen-Rechners, Förderzahlen
// passend zu @/lib/rechner/annahmen (KfW 458, Richtlinie seit 21.07.2026).

import { WALLBOX } from "@/data/wallbox";
import { WAERMEPUMPE as W } from "@/lib/rechner/annahmen";
import { rechneWaermepumpe } from "@/lib/rechner/waermepumpe";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const kwh = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " kWh";
const komma = (n, s = 1) => n.toFixed(s).replace(".", ",");

const F = W.foerderung;
const DECKEL = F.kostenDeckelErsteWe; // 28.000 €
const INVEST = F.investitionOrientierung; // 30.000 €
const FOERDERFAEHIG = Math.min(INVEST, DECKEL);
const MAX_NIEDRIG = 80; // Obergrenze bei zu versteuerndem Haushaltseinkommen bis 30.000 € (Merkblatt 458, Stand 07/2026)

// Förderbeispiele: Summe der Sätze, gedeckelt
const beispiel = (name, saetze, deckel = F.maxProzent) => {
  const summe = saetze.reduce((a, b) => a + b, 0);
  const satz = Math.min(summe, deckel);
  const zuschuss = (FOERDERFAEHIG * satz) / 100;
  return { name, summe, satz, zuschuss, eigen: INVEST - zuschuss };
};
const B = [
  beispiel("Grundförderung (z. B. Vermieter, Gasheizung jünger als 20 Jahre)", [F.grundProzent]),
  beispiel("Selbstnutzer, Ölheizung ersetzt, Einkommen über 50.000 €", [F.grundProzent, 16]),
  beispiel("wie oben, Einkommen bis 50.000 €", [F.grundProzent, 16, 10]),
  beispiel("wie oben, Einkommen bis 40.000 €", [F.grundProzent, 16, 30]),
  beispiel("wie oben, Einkommen bis 30.000 €", [F.grundProzent, 16, 40], MAX_NIEDRIG),
];

// Betriebskosten je Gebäudestandard, 150 m², Gas als Vergleich
const betrieb = (id) => {
  const s = W.standards.find((x) => x.id === id);
  const r = rechneWaermepumpe({ flaeche: 150, standard: id, heizung: "gas", preis: W.heizungen.gas.preisStandard, jaz: s.jaz, pv: "keine" });
  return { s, r };
};
const BETRIEB = ["unsaniert", "teilsaniert", "1995", "2010", "neubau"].map(betrieb);
const MITTEL = BETRIEB[2];

const artikel = {
  slug: "waermepumpe-kosten",
  title: "Wärmepumpe Kosten 2026: Anschaffung, Einbau, Betrieb, Förderung",
  seoTitle: "Wärmepumpe Kosten 2026: Preise & KfW-Förderung | Ökovolt",
  kurzTitel: "Wärmepumpe Kosten",
  description:
    "Wärmepumpe Kosten 2026: Preise für Luft-, Erd- und Grundwasser-Wärmepumpen inkl. Einbau, laufende Kosten und KfW-458-Förderung nach der neuen Richtlinie.",
  excerpt:
    "Was eine Wärmepumpe 2026 mit Einbau kostet, welche Nebenarbeiten den Preis treiben, was der Betrieb kostet – und wie viel die KfW seit dem 21. Juli 2026 noch zuschießt.",
  hauptKeyword: "wärmepumpe kosten",
  keywords: [
    "Wärmepumpe Kosten",
    "Wärmepumpe Kosten mit Einbau",
    "Luft-Wasser-Wärmepumpe Kosten",
    "Erdwärmepumpe Kosten",
    "Wärmepumpe Förderung 2026",
    "KfW 458 Wärmepumpe",
    "Wärmepumpe Betriebskosten",
    "Wärmepumpe Eigenanteil nach Förderung",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Wärmepumpe & E-Mobilität",
  bild: "/Images/Ratgeber/waermepumpe-kosten.jpg",
  bildAlt: "Luft-Wasser-Wärmepumpe im Garten vor einem Einfamilienhaus mit Klinkerfassade",
  badge: { wert: "15.000–31.000 €", text: "Luft-Wasser-Wärmepumpe inkl. Einbau, vor Förderung" },

  kurzFazit: [
    "**Eine Luft-Wasser-Wärmepumpe kostet 2026 im Einfamilienhaus inklusive Einbau meist 15.000 bis 31.000 €**, eine Erdwärmepumpe mit Bohrung 25.000 bis 49.000 € (ADAC, Stand Juli 2026).",
    `Die KfW zahlt seit dem 21.07.2026 **${F.grundProzent} % Grundförderung**, 16 % Klimageschwindigkeitsbonus und bis zu 40 % Einkommensbonus – gedeckelt auf ${F.maxProzent} % bzw. ${MAX_NIEDRIG} % von höchstens ${eur(DECKEL)} förderfähigen Kosten.`,
    `Bei ${eur(INVEST)} Investition bleiben je nach Situation **${eur(B[B.length - 1].eigen)} bis ${eur(B[0].eigen)} Eigenanteil**.`,
    `Im Betrieb kostet eine Wärmepumpe im Beispielhaus (150 m², Baujahr 1995–2009) rund **${eur10(MITTEL.r.netz.summe)} im Jahr** – gegenüber rund ${eur10(MITTEL.r.fossil.summe)} mit Gas.`,
    "Der Klimageschwindigkeitsbonus sinkt ab dem 01.02.2027 halbjährlich um 4 Prozentpunkte, der Kostendeckel um 750 €. Wer ohnehin tauschen muss, sollte zügig planen.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was kostet eine Wärmepumpe 2026?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Wärmepumpe kostet 2026 im Einfamilienhaus je nach Bauart zwischen rund 15.000 und 49.000 € inklusive Einbau – vor Abzug der Förderung.** Am günstigsten und mit Abstand am häufigsten ist die Luft-Wasser-Wärmepumpe. Erd- und Grundwasser-Wärmepumpen arbeiten effizienter, verursachen aber zusätzliche Kosten für Bohrung, Kollektoren oder Brunnen.",
        },
        {
          typ: "p",
          text: `Für die Orientierung rechnen wir in den Beispielen dieses Ratgebers mit ${eur(INVEST)} für eine Luft-Wasser-Wärmepumpe im Bestand – ein realistischer Wert, wenn neben dem Gerät auch Pufferspeicher, Elektroarbeiten, Demontage der Altanlage und die Optimierung des Heizsystems anfallen. Im gut vorbereiteten Neubau oder bei einfacher Aufstellung kann es deutlich günstiger werden.`,
        },
        {
          typ: "tabelle",
          caption: "Kosten nach Wärmepumpen-Typ im Einfamilienhaus, inkl. Installation, vor Förderung",
          kopf: ["Typ", "Gerät", "Installation & Material", "Erschließung", "Gesamt"],
          zeilen: [
            ["Luft-Wasser-Wärmepumpe", "8.000–16.000 €", "7.000–15.000 €", "–", "**15.000–31.000 €**"],
            ["Sole-Wasser (Erdsonde)", "10.000–18.000 €", "7.000–15.000 €", "8.000–16.000 €", "**25.000–49.000 €**"],
            ["Wasser-Wasser (Grundwasser)", "10.000–20.000 €", "7.000–15.000 €", "im Gesamtpreis", "**17.000–35.000 €**"],
          ],
          hervorheben: 4,
          markierteZeile: 0,
          minBreite: 640,
          fussnote: "Quelle: ADAC, Stand 21.07.2026. Spannen aus Marktübersichten, keine Angebote. Zusätzliche Arbeiten am Heizsystem (Heizkörper, Leitungen) sind nicht enthalten.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum die Angebote so stark schwanken",
          text: "Der Gerätepreis macht oft nur die Hälfte aus. Entscheidend sind Heizlast, Vorlauftemperatur, Aufstellort, Leitungswege, der Zustand von Zählerschrank und Heizkörpern sowie der Aufwand für die Entsorgung der Altanlage. Vergleichen Sie Angebote deshalb Position für Position.",
        },
      ],
    },
    {
      id: "kostenpositionen",
      titel: "Aus welchen Positionen setzt sich der Preis zusammen?",
      tocLabel: "Kostenpositionen",
      bloecke: [
        {
          typ: "p",
          text: "**Neben dem Gerät bestimmen vor allem Einbau, Erschließung der Wärmequelle und Anpassungen am Heizsystem die Gesamtkosten.** Diese Positionen sollten in einem seriösen Angebot einzeln aufgeführt sein:",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Wärmepumpe & Speicher", text: "Außen- und Inneneinheit, Warmwasserspeicher, ggf. Pufferspeicher und Regelung. Größe nach Heizlastberechnung – eine überdimensionierte Anlage kostet mehr und taktet häufiger." },
            { titel: "Hydraulik & Montage", text: "Fundament oder Wandkonsole, Kondensatablauf, Rohrleitungen, Umwälzpumpen, Inbetriebnahme und der für die Förderung vorgeschriebene hydraulische Abgleich." },
            { titel: "Elektroinstallation", text: "Eigener Stromkreis, bei älteren Anlagen oft ein neuer Zählerschrank, Platz für Steuerbox und ggf. zweiten Zähler nach [§ 14a EnWG](/ratgeber/paragraf-14a-enwg)." },
            { titel: "Umfeldmaßnahmen", text: "Größere Heizkörper, neue Leitungen, Pumpen und Ventile kosten laut ADAC je nach Umfang rund 5.000 bis 20.000 € – nötig vor allem, wenn die Vorlauftemperatur sonst zu hoch bliebe." },
          ],
        },
        {
          typ: "tabelle",
          caption: "Kosten der Erschließung bei Erd- und Grundwasser-Wärmepumpen",
          kopf: ["Wärmequelle", "Erschließungskosten", "Hinweis"],
          zeilen: [
            ["Erdwärmekollektor", "2.000–5.000 €", "Große unbebaute Gartenfläche nötig"],
            ["Erdwärmesonde (Bohrung)", "6.000–13.000 €", "Wasserrechtliche Genehmigung, Bohrfirma"],
            ["Grundwasserbrunnen", "4.000–7.000 €", "Wasserqualität und Genehmigung prüfen"],
          ],
          minBreite: 520,
          fussnote: "Quelle: co2online, Stand 2026. Tiefe und Bodenbeschaffenheit beeinflussen die Kosten stark.",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "KfW-Förderung 458: Was gilt seit dem 21. Juli 2026?",
      tocLabel: "KfW-Förderung 458",
      bloecke: [
        {
          typ: "p",
          text: `**Seit dem 21.07.2026 gelten für die Heizungsförderung (KfW 458) niedrigere Sätze: ${F.grundProzent} % Grundförderung, 16 % Klimageschwindigkeitsbonus und ein gestaffelter Einkommensbonus – der Effizienzbonus ist entfallen.** Förderfähig sind bei einem Einfamilienhaus höchstens ${eur(DECKEL)} (zuvor 30.000 €). Die Förderung ist ein Zuschuss, der nach Abschluss der Arbeiten ausgezahlt wird. Einen Überblick über alle Programme bietet die [BEG im Lexikon](/wissen/lexikon#beg).`,
        },
        {
          typ: "tabelle",
          caption: "Fördersätze KfW 458 für Wärmepumpen, Antragstellung ab 21.07.2026",
          kopf: ["Baustein", "Satz", "Voraussetzung"],
          zeilen: [
            ["Grundförderung", `${F.grundProzent} %`, "Alle privaten Eigentümer; Bestandsgebäude (Bauantrag mind. 5 Jahre alt), Optimierung des Heizsystems"],
            ["Klimageschwindigkeitsbonus", "16 %", "Nur Selbstnutzer; Austausch einer funktionstüchtigen Öl-, Kohle-, Nachtspeicher- oder Gasetagenheizung, oder einer Gas-/Biomasseheizung ab 20 Jahren"],
            ["Einkommensbonus", "40 / 30 / 10 %", "Nur Selbstnutzer; zu versteuerndes Haushaltseinkommen bis 30.000 / 40.000 / 50.000 € (+10.000 € mit Kind)"],
            ["Effizienzbonus", "entfallen", "Bis 20.07.2026 zusätzlich 5 % für natürliche Kältemittel oder Erdwärme"],
            ["Obergrenze", `${F.maxProzent} % bzw. ${MAX_NIEDRIG} %`, `${MAX_NIEDRIG} % nur bei Einkommen bis 30.000 € (mit Kind 40.000 €)`],
            ["Förderfähige Kosten", `max. ${eur(DECKEL)}`, "Erste Wohneinheit; 2.–6. Einheit je 15.000 €, ab der 7. je 8.000 €"],
          ],
          hervorheben: 1,
          minBreite: 640,
          fussnote: "Quelle: KfW-Merkblatt 458, Stand 07/2026. Das Einkommen wird als Durchschnitt des zweiten und dritten Jahres vor Antragstellung ermittelt (Antrag 2026: Steuerbescheide 2023 und 2024).",
        },
        { typ: "h3", text: "So viel Zuschuss gibt es: fünf Beispiele" },
        {
          typ: "tabelle",
          caption: `Zuschuss und Eigenanteil bei ${eur(INVEST)} Investition (förderfähig ${eur(FOERDERFAEHIG)}), Antrag bis 31.01.2027`,
          kopf: ["Situation", "Satz", "Zuschuss", "Eigenanteil"],
          zeilen: B.map((b) => [b.name, b.summe > b.satz ? `${b.satz} % (statt ${b.summe} %)` : `${b.satz} %`, eur(b.zuschuss), `**${eur(b.eigen)}**`]),
          hervorheben: 3,
          markierteZeile: 1,
          minBreite: 640,
          fussnote: `Zuschuss = förderfähige Kosten × Fördersatz. Weil der Deckel bei ${eur(DECKEL)} liegt, trägt man bei ${eur(INVEST)} Investition mindestens ${eur(INVEST - DECKEL)} ohne Förderung selbst.`,
        },
        {
          typ: "tabelle",
          caption: "Geplante Absenkung laut Merkblatt – maßgeblich ist das Datum der Antragstellung",
          kopf: ["Antrag ab", "Klimageschwindigkeitsbonus", "Förderfähige Kosten (1. Wohneinheit)"],
          zeilen: [
            ["21.07.2026", "16 %", eur(DECKEL)],
            ["01.02.2027", "12 %", eur(DECKEL - 750)],
            ["01.08.2027", "8 %", eur(DECKEL - 1500)],
            ["01.02.2028", "4 %", eur(DECKEL - 2250)],
            ["01.08.2028", "entfällt", eur(DECKEL - 3000)],
          ],
          hervorheben: 1,
          minBreite: 480,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Reihenfolge beachten – sonst ist die Förderung weg",
          text: "Vor dem Antrag brauchen Sie eine **Bestätigung zum Antrag (BzA)** vom Fachbetrieb oder Energieeffizienz-Experten und einen **Liefer- oder Leistungsvertrag mit aufschiebender oder auflösender Bedingung** (Förderzusage). Erst dann wird der Antrag im Portal „Meine KfW“ gestellt; mit dem Einbau beginnen Sie nach der Zusage. Luft-Wasser-Wärmepumpen müssen seit 2026 zudem mindestens 10 dB leiser sein als die EU-Ökodesign-Grenzwerte.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Was sich 2027 noch ändern könnte",
          text: "Fachmedien berichten über Pläne, die Grundförderung für Wärmepumpen 2027 auf 15 % zu senken und für Geräte aus EU-Fertigung einen Wertschöpfungsbonus von 15 Prozentpunkten einzuführen. Stand September 2026 ist das nicht im Merkblatt geregelt; Details und Startdatum sind offen. Wir aktualisieren diesen Ratgeber, sobald die KfW neue Konditionen veröffentlicht.",
        },
        {
          typ: "p",
          text: "Alternativ zum Zuschuss kann die Wärmepumpe im selbst genutzten Wohneigentum über die Steuer gefördert werden (§ 35c EStG: 20 % der Kosten, verteilt auf drei Jahre). Beides für dieselbe Maßnahme geht nicht. Für die Restfinanzierung gibt es den KfW-Ergänzungskredit (358/359); weitere Wege zeigt die Seite [Finanzierung](/service/finanzierung). Ob zusätzlich Landes- oder Kommunalprogramme greifen, klärt der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "betriebskosten",
      titel: "Was kostet eine Wärmepumpe im Betrieb?",
      tocLabel: "Betriebskosten",
      bloecke: [
        {
          typ: "p",
          text: `**Die laufenden Kosten einer Wärmepumpe bestehen fast nur aus Strom und rund ${eur(W.wpNebenkosten)} Wartung im Jahr – entscheidend ist die [Jahresarbeitszahl](/wissen/lexikon#jaz).** Sie gibt an, wie viele Kilowattstunden Wärme aus einer Kilowattstunde Strom entstehen. Je besser gedämmt das Haus und je niedriger die Vorlauftemperatur, desto höher die Arbeitszahl und desto niedriger die Stromrechnung.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Heizkosten für 150 m² Wohnfläche, Wärmepumpe mit ${W.wpTarifCt} ct/kWh vs. Gas mit ${komma(W.heizungen.gas.preisStandard)} ct/kWh`,
          kopf: ["Gebäude", "Wärmebedarf", "JAZ", "Strom Wärmepumpe", "Kosten Wärmepumpe", "Kosten Gasheizung"],
          zeilen: BETRIEB.map(({ s, r }) => [s.label, kwh(r.bedarf), komma(s.jaz), kwh(r.wpStrom), `**${eur10(r.netz.summe)}**`, eur10(r.fossil.summe)]),
          hervorheben: 4,
          markierteZeile: 2,
          minBreite: 700,
          fussnote: `Inkl. ${eur(W.wpNebenkosten)} Wartung (Wärmepumpe) bzw. ${eur(W.heizungen.gas.nebenkosten)} Grundpreis, Wartung und Schornsteinfeger (Gas, Brennwertkessel mit ${Math.round(W.heizungen.gas.nutzungsgrad * 100)} % Nutzungsgrad). Orientierungswerte, Stand September 2026.`,
        },
        {
          typ: "liste",
          punkte: [
            `**Stromtarif:** Wärmepumpentarife liegen meist zwischen etwa 21 und 28 ct/kWh. Alternativ senkt der Netzentgelt-Rabatt nach § 14a EnWG die Kosten – pauschal rund ${WALLBOX.paragraf14a.ersparnisVon} bis ${WALLBOX.paragraf14a.ersparnisBis} € im Jahr (Modul 1) oder über einen reduzierten Arbeitspreis mit eigenem Zähler (Modul 2). Tarife vergleichen: [Stromtarif](/service/stromtarif).`,
            "**Wartung:** Etwa alle ein bis zwei Jahre Sichtprüfung, Filter und Kondensatablauf, bei Split-Geräten die Kältemittel-Dichtheitsprüfung nach Vorgabe.",
            "**Schornsteinfeger & Grundpreis Gas entfallen:** Wer vollständig umstellt, kündigt den Gasanschluss und spart die festen Kosten.",
            "**Eigener Solarstrom:** Mit PV-Anlage sinken die Stromkosten weiter. Wie groß der Anteil realistisch ist, zeigt [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
          ],
        },
        { typ: "tool", href: "/rechner/waermepumpe", titel: "Heizkosten für Ihr Haus berechnen", text: "Wärmepumpe gegen Gas oder Öl – mit Ihrer Wohnfläche, Ihrem Verbrauch und optional eigener PV-Anlage.", label: "Zum Wärmepumpen-Rechner" },
      ],
    },
    {
      id: "rechnung",
      titel: "Rechnet sich die Wärmepumpe? Ein Beispiel",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Im Beispielhaus spart die Wärmepumpe gegenüber der Gasheizung rund ${eur10(MITTEL.r.ersparnisNetz)} pro Jahr – bei einem Eigenanteil von ${eur(B[1].eigen)} (46 % Förderung) ist die Investition damit nach rund ${Math.round(B[1].eigen / MITTEL.r.ersparnisNetz)} Jahren wieder eingespielt**, ohne steigende CO₂-Preise für Gas und ohne eigenen Solarstrom. Die Rechnung ist bewusst einfach:`,
        },
        {
          typ: "ablauf",
          schritte: [
            ["Investition", `${eur(INVEST)} für eine Luft-Wasser-Wärmepumpe inklusive Einbau im Bestandsgebäude.`],
            ["Förderung abziehen", `Grundförderung plus Klimageschwindigkeitsbonus = 46 % von ${eur(FOERDERFAEHIG)} = ${eur(B[1].zuschuss)}. Eigenanteil: ${eur(B[1].eigen)}.`],
            ["Laufende Kosten vergleichen", `Gas: ${eur10(MITTEL.r.fossil.summe)} pro Jahr. Wärmepumpe (JAZ ${komma(MITTEL.s.jaz)}, ${W.wpTarifCt} ct/kWh): ${eur10(MITTEL.r.netz.summe)} pro Jahr.`],
            ["Einordnen", "Muss die alte Gasheizung ohnehin ersetzt werden, zählen nur die Mehrkosten gegenüber einem neuen Gaskessel – dann rechnet sich die Wärmepumpe deutlich schneller."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Die größten Stellschrauben sind nicht der Gerätepreis, sondern die Vorlauftemperatur und der Strompreis. Einzelne zu kleine Heizkörper tauschen, den hydraulischen Abgleich ernst nehmen und einen passenden Tarif wählen bringt oft mehr als ein paar hundert Euro Rabatt beim Gerät.",
        },
      ],
    },
    {
      id: "sparen",
      titel: "So senken Sie die Kosten – und diese Fehler sollten Sie vermeiden",
      tocLabel: "Kosten senken & Fehler",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Heizlast berechnen lassen** statt nach dem alten Kessel zu dimensionieren – überdimensionierte Geräte sind teurer und weniger effizient.",
            "**Förderantrag vor der Auftragsvergabe** stellen; Vertrag mit Förderbedingung abschließen.",
            "**Mehrere Angebote vergleichen** und auf gleiche Leistungsumfänge achten (Speicher, Elektrik, Demontage, Abgleich).",
            "**Aufstellort früh klären:** Schallabstand zum Nachbarn, Kondensatablauf und kurze Leitungswege sparen Geld und Ärger.",
            "**Zählerschrank prüfen:** Ein nötiger Umbau ist ein häufiger Kostentreiber, der in Pauschalangeboten fehlt.",
            "**Mit PV und Energiemanagement zusammen planen:** Leitungen, Messkonzept und Steuerung werden nur einmal gebaut.",
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Was kostet eine Wärmepumpe mit Einbau für ein Einfamilienhaus?", a: "Eine Luft-Wasser-Wärmepumpe kostet 2026 inklusive Einbau meist 15.000 bis 31.000 €, eine Erdwärmepumpe mit Sonde 25.000 bis 49.000 €. Hinzu kommen je nach Haus Umbauten an Heizkörpern oder am Zählerschrank." },
    { q: "Wie hoch ist die Förderung für eine Wärmepumpe 2026?", a: `Seit dem 21.07.2026 gibt es über die KfW (Programm 458) ${F.grundProzent} % Grundförderung, 16 % Klimageschwindigkeitsbonus und bis zu 40 % Einkommensbonus. Insgesamt sind höchstens ${F.maxProzent} %, bei geringem Einkommen ${MAX_NIEDRIG} % von maximal ${eur(DECKEL)} förderfähigen Kosten möglich – also bis zu ${eur(DECKEL * 0.8)}.` },
    { q: "Wie viel Eigenanteil bleibt bei einer Wärmepumpe?", a: `Bei ${eur(INVEST)} Investition bleiben je nach Förderung zwischen ${eur(B[B.length - 1].eigen)} und ${eur(B[0].eigen)}. Ein Selbstnutzer, der eine Ölheizung ersetzt und über 50.000 € zu versteuerndes Einkommen hat, zahlt im Beispiel ${eur(B[1].eigen)}.` },
    { q: "Was kostet eine Wärmepumpe im Monat an Strom?", a: `Im Beispielhaus mit 150 m² (Baujahr 1995–2009) braucht die Wärmepumpe rund ${kwh(MITTEL.r.wpStrom)} Strom im Jahr, das sind bei ${W.wpTarifCt} ct/kWh etwa ${eur10(MITTEL.r.netz.strom / 12)} im Monatsschnitt – im Winter deutlich mehr, im Sommer weniger.` },
    { q: "Wird der Effizienzbonus noch gezahlt?", a: "Nein. Der Effizienzbonus von 5 % für Wärmepumpen mit natürlichem Kältemittel oder Erdwärme gilt nur für Anträge bis 20.07.2026. Seit dem 21.07.2026 ist er entfallen." },
    { q: "Lohnt es sich, mit der Wärmepumpe bis 2027 zu warten?", a: "Aus Fördersicht eher nicht: Der Klimageschwindigkeitsbonus sinkt ab 01.02.2027 auf 12 %, die förderfähigen Kosten sinken um 750 €. Entscheidend ist das Datum der Antragstellung, nicht des Einbaus." },
    { q: "Wie teuer ist die Wartung einer Wärmepumpe?", a: `Rechnen Sie im Einfamilienhaus mit rund ${eur(W.wpNebenkosten)} pro Jahr. Schornsteinfeger und Gasgrundpreis entfallen dafür.` },
    { q: "Kann ich Wärmepumpe und PV-Anlage gleichzeitig fördern lassen?", a: "Ja, aber über verschiedene Wege: Die Wärmepumpe über KfW 458, die PV-Anlage über den Nullsteuersatz und bei Bedarf den KfW-Kredit 270. Details zur Kombination im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik)." },
  ],

  passend: [
    { href: "/ratgeber/waermepumpe-mit-photovoltaik", titel: "Wärmepumpe mit Photovoltaik", text: "Wie viel Heizstrom die eigene Anlage liefert." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten gegen Gas oder Öl vergleichen." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Welche Programme für Sie gelten." },
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe von Ökovolt", text: "Planung, Einbau und Förderantrag aus einer Hand." },
  ],

  quellen: [
    { titel: "KfW – Merkblatt Heizungsförderung für Privatpersonen (458)", url: "https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005131_M_458.pdf", stand: "07/2026" },
    { titel: "KfW – Heizungsförderung für Privatpersonen – Wohngebäude (458)", url: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-Wohngeb%C3%A4ude-(458)/", stand: "09/2026" },
    { titel: "ADAC – Wärmepumpe: Funktion, Kosten und Förderung", url: "https://www.adac.de/rund-ums-haus/energie/versorgung/waermepumpe-funktion-kosten-foerderung/", stand: "07/2026" },
    { titel: "co2online – Wärmepumpe: Kosten, Funktion & Förderung", url: "https://www.co2online.de/modernisieren-und-bauen/waermepumpe/", stand: "07/2026" },
    { titel: "Bundesverband Wärmepumpe – Neue Schallanforderungen in der BEG-Förderung 2026", url: "https://www.waermepumpe.de/presse/news/details/beg-foerderung-2026-neue-schallanforderungen-fuer-waermepumpen/", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Steuerbare Verbrauchseinrichtungen (§ 14a EnWG)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/start.html", stand: "09/2026" },
    { titel: "§ 35c EStG – Steuerermäßigung für energetische Maßnahmen", url: "https://www.gesetze-im-internet.de/estg/__35c.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Was kostet die Wärmepumpe im Betrieb?", text: "Heizkosten gegen Gas oder Öl mit Ihren Werten.", href: "/rechner/waermepumpe", label: "Zum Wärmepumpen-Rechner" },
  cta: {
    title: "Ihr Wärmepumpen-Angebot – mit Förderantrag.",
    text: "Wir berechnen die Heizlast, planen Aufstellort, Elektrik und auf Wunsch die PV-Anlage mit und begleiten Sie durch den KfW-Antrag.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
  },
};

export default artikel;
