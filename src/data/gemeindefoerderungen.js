// src/data/gemeindefoerderungen.js
//
// Gemeindeförderungen für PV, Stromspeicher, Wallbox und Heizungstausch im
// Einzugsgebiet von Ökovolt Österreich – Start mit den Bezirken Braunau am Inn
// (OÖ) und Salzburg-Umgebung (Flachgau). Anzeige auf /forderungen/status über
// src/components/Forderungen/Gemeindefoerderungen.js.
//
// REGELN
// - Nur Programme mit Primärquelle (Gemeinde-Website oder Richtlinie als PDF).
//   Keine Sekundärquellen, keine Schätzungen. Was nicht lesbar war (gescannte
//   PDFs), steht als pruefen:true mit Hinweis – ohne Zahlen.
// - status: "programm"   Gemeinde hat ein Programm, Daten aus der Richtlinie
//           "ausgesetzt" Programm existiert(e), Annahme laut Gemeinde ausgesetzt
//           "keine"      Website der Gemeinde geprüft, keine Förderung gefunden
//           "ungeprueft" noch nicht geprüft (Website nicht erreichbar oder offen)
// - geprueftAm: Datum der Recherche. Einträge älter als ein Quartal nachprüfen.
// - GKZ: Gemeindekennzahl laut Statistik Austria (über Wikipedia abgeglichen).
//
// Fehler melden: office@oekovolt.at (Betreff „Gemeindeförderung“), kein Formular.

export const GEMEINDEN_STAND = { iso: "2026-10-11", label: "11.10.2026" };

export const BEZIRKE = [
  { id: "braunau", label: "Bezirk Braunau am Inn", bundesland: "Oberösterreich", kuerzel: "OÖ" },
  { id: "salzburg-umgebung", label: "Bezirk Salzburg-Umgebung", bundesland: "Salzburg", kuerzel: "Sbg." },
];

export const GEMEINDE_STATUS = {
  programm: { label: "Gemeindeförderung", kurz: "Programm" },
  ausgesetzt: { label: "Förderung ausgesetzt", kurz: "ausgesetzt" },
  keine: { label: "keine Förderung gefunden", kurz: "keine" },
  ungeprueft: { label: "noch nicht geprüft", kurz: "offen" },
};

const G = GEMEINDEN_STAND.iso;

/** Kurzform für geprüfte Gemeinden ohne Programm. */
const keine = (gemeinde, gkz, bezirk, quelleUrl, hinweis) => ({
  gemeinde,
  gkz,
  bezirk,
  status: "keine",
  programm: null,
  hoehe: null,
  zielgruppen: [],
  bedingungen: [],
  frist: null,
  quelleUrl,
  geprueftAm: G,
  hinweis: hinweis || `Website der Gemeinde am ${GEMEINDEN_STAND.label} geprüft – kein Programm für PV, Speicher oder Wallbox gefunden.`,
});

/** Gemeinden, deren Website zum Prüfdatum nicht erreichbar oder noch nicht ausgewertet war. */
const ungeprueft = (gemeinde, gkz, bezirk, quelleUrl) => ({
  gemeinde,
  gkz,
  bezirk,
  status: "ungeprueft",
  programm: null,
  hoehe: null,
  zielgruppen: [],
  bedingungen: [],
  frist: null,
  quelleUrl: quelleUrl || null,
  geprueftAm: null,
  hinweis: "Noch nicht geprüft – bitte beim Gemeindeamt nachfragen. Wird in der nächsten Prüfrunde ergänzt.",
});

// ---------------------------------------------------------------------------
// Bezirk Braunau am Inn (OÖ) – 46 Gemeinden
// ---------------------------------------------------------------------------

const BRAUNAU = [
  ungeprueft("Altheim", "40401", "braunau", "https://www.altheim.at/"),
  ungeprueft("Aspach", "40402", "braunau"),
  ungeprueft("Auerbach", "40403", "braunau"),
  keine(
    "Braunau am Inn",
    "40404",
    "braunau",
    "https://www.braunau.at/Unsere_Stadt/Umwelt_Energie",
    "Stadtamt bietet eine kostenlose, firmenneutrale Energieberatung (mit dem OÖ Energiesparverband); ein Zuschuss für PV, Speicher oder Wallbox war am 11.10.2026 nicht auffindbar."
  ),
  ungeprueft("Burgkirchen", "40405", "braunau"),
  ungeprueft("Eggelsberg", "40406", "braunau"),
  ungeprueft("Feldkirchen bei Mattighofen", "40407", "braunau"),
  ungeprueft("Franking", "40408", "braunau"),
  ungeprueft("Geretsberg", "40409", "braunau"),
  ungeprueft("Gilgenberg am Weilhart", "40410", "braunau"),
  ungeprueft("Haigermoos", "40411", "braunau"),
  ungeprueft("Handenberg", "40412", "braunau"),
  ungeprueft("Helpfau-Uttendorf", "40413", "braunau"),
  ungeprueft("Hochburg-Ach", "40414", "braunau"),
  ungeprueft("Höhnhart", "40415", "braunau"),
  ungeprueft("Jeging", "40416", "braunau"),
  ungeprueft("Kirchberg bei Mattighofen", "40417", "braunau"),
  ungeprueft("Lengau", "40418", "braunau", "https://www.lengau.at/"),
  ungeprueft("Lochen am See", "40419", "braunau"),
  ungeprueft("Maria Schmolln", "40420", "braunau"),
  keine(
    "Mattighofen",
    "40421",
    "braunau",
    "https://www.mattighofen.at/Buergerservice/Services/Foerderungen",
    "Förderseite der Stadt nennt Familien-, Sozial- und Wirtschaftsförderungen; für Energie nur den Verweis auf die KEM „Klimazukunft Mattigtal“ (Programm für Gemeinden, kein Zuschuss für Haushalte)."
  ),
  ungeprueft("Mauerkirchen", "40422", "braunau", "https://www.mauerkirchen.at/"),
  ungeprueft("Mining", "40423", "braunau"),
  ungeprueft("Moosbach", "40424", "braunau"),
  ungeprueft("Moosdorf", "40425", "braunau"),
  keine(
    "Munderfing",
    "40426",
    "braunau",
    "https://www.munderfing.at/",
    "Gemeinde ist seit 2023 Teil der KEM „Klimazukunft Mattigtal“; eine eigene Förderung für PV, Speicher oder Wallbox war am 11.10.2026 nicht auffindbar."
  ),
  ungeprueft("Neukirchen an der Enknach", "40427", "braunau"),
  keine(
    "Ostermiething",
    "40428",
    "braunau",
    "https://www.ostermiething.at/Buergerservice/Foerderungen",
    "Förderseite nennt nur Betriebsansiedlungen, örtliche Vereine und Tierzucht – keine Energieförderung (Firmensitz von Ökovolt Österreich)."
  ),
  ungeprueft("Palting", "40429", "braunau"),
  ungeprueft("Perwang am Grabensee", "40430", "braunau"),
  ungeprueft("Pfaffstätt", "40431", "braunau"),
  ungeprueft("Pischelsdorf am Engelbach", "40432", "braunau"),
  ungeprueft("Polling im Innkreis", "40433", "braunau"),
  ungeprueft("Roßbach", "40434", "braunau"),
  ungeprueft("St. Georgen am Fillmannsbach", "40435", "braunau"),
  ungeprueft("St. Johann am Walde", "40436", "braunau"),
  ungeprueft("St. Pantaleon", "40437", "braunau"),
  ungeprueft("St. Peter am Hart", "40438", "braunau"),
  ungeprueft("St. Radegund", "40439", "braunau"),
  ungeprueft("St. Veit im Innkreis", "40440", "braunau"),
  ungeprueft("Schalchen", "40441", "braunau"),
  ungeprueft("Schwand im Innkreis", "40442", "braunau"),
  ungeprueft("Tarsdorf", "40443", "braunau"),
  ungeprueft("Treubach", "40444", "braunau"),
  ungeprueft("Überackern", "40445", "braunau"),
  ungeprueft("Weng im Innkreis", "40446", "braunau"),
];

// ---------------------------------------------------------------------------
// Bezirk Salzburg-Umgebung (Flachgau) – 37 Gemeinden
// ---------------------------------------------------------------------------

const FLACHGAU = [
  ungeprueft("Anif", "50301", "salzburg-umgebung", "https://www.anif.at/"),
  ungeprueft("Anthering", "50302", "salzburg-umgebung"),
  {
    gemeinde: "Bergheim",
    gkz: "50303",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Energiesparförderung (Sanierung der Gebäudehülle)",
    hoehe: "Teilsanierung 500 €, Gesamtsanierung 1.000 €, Planungsenergieausweis 250 €",
    zielgruppen: ["privat"],
    bedingungen: ["nur Sanierung der Gebäudehülle bei Wohngebäuden – PV, Speicher und Wallbox sind nicht Gegenstand", "an die Zusage einer Landes- oder Bundesförderung gekoppelt", "Richtlinien gelten ab 2025"],
    frist: null,
    quelleUrl: "https://www.bergheim.at/Energiesparfoerderung",
    geprueftAm: G,
    hinweis: "Für PV, Speicher oder Wallbox gibt es laut Förderseite keinen Gemeindezuschuss.",
  },
  ungeprueft("Berndorf bei Salzburg", "50304", "salzburg-umgebung"),
  keine("Bürmoos", "50305", "salzburg-umgebung", "https://www.buermoos.at/", "Website nennt eine Bürgerbeteiligungs-PV-Anlage am Gemeindezentrum, aber keinen Zuschuss für private oder betriebliche Anlagen."),
  ungeprueft("Dorfbeuern", "50306", "salzburg-umgebung"),
  ungeprueft("Ebenau", "50307", "salzburg-umgebung"),
  ungeprueft("Elixhausen", "50308", "salzburg-umgebung"),
  ungeprueft("Elsbethen", "50309", "salzburg-umgebung", "https://www.elsbethen.at/"),
  {
    gemeinde: "Eugendorf",
    gkz: "50310",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Förderung von Heizungsanlagen bzw. Nah-/Fernwärme (Antrag „Heizungs- und/oder PV-Anlage“)",
    hoehe: null,
    zielgruppen: ["privat"],
    bedingungen: ["Richtlinien als PDF auf der Gemeindeseite; Antragsformular nennt Heizungs- und/oder PV-Anlage"],
    frist: null,
    quelleUrl: "https://www.eugendorf.at/Buergerservice/Dienstleistungen/Foerderungen",
    geprueftAm: G,
    pruefen: true,
    hinweis: "Förderhöhe und Bedingungen stehen nur in der Richtlinie (PDF), die am Prüfdatum nicht auswertbar war – vor dem Antrag beim Marktgemeindeamt (Natur & Umwelt) nachfragen.",
  },
  ungeprueft("Faistenau", "50311", "salzburg-umgebung"),
  ungeprueft("Fuschl am See", "50312", "salzburg-umgebung"),
  ungeprueft("Göming", "50313", "salzburg-umgebung"),
  keine("Grödig", "50314", "salzburg-umgebung", "https://www.groedig.at/"),
  ungeprueft("Großgmain", "50315", "salzburg-umgebung"),
  {
    gemeinde: "Hallwang",
    gkz: "50316",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Förderung von Maßnahmen zur Reduzierung des Energieverbrauchs (Richtlinie, 3. Änderung)",
    hoehe: null,
    zielgruppen: ["privat"],
    bedingungen: ["Antragsformular „Förderungsansuchen 2026“ auf der Gemeindeseite"],
    frist: null,
    quelleUrl: "https://www.hallwang.at/Energiesparfoerderung",
    geprueftAm: G,
    pruefen: true,
    hinweis: "Die Richtlinie liegt nur als gescanntes PDF vor; ob PV, Speicher oder Wallbox enthalten sind und in welcher Höhe, war am Prüfdatum nicht lesbar – beim Gemeindeamt nachfragen.",
  },
  {
    gemeinde: "Henndorf am Wallersee",
    gkz: "50317",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Energieförderung der Gemeinde (Richtlinie laut Beschluss der Gemeindevertretung vom 20.02.2026)",
    hoehe: null,
    zielgruppen: ["privat"],
    bedingungen: ["Richtlinie und Antragsformular im Bereich Formulare/Förderungen; Bearbeitung durch das Bauamt"],
    frist: null,
    quelleUrl: "https://www.henndorf.at/Ich_brauche/Bauen/Heizung_Lueftung_und_Photovoltaik",
    geprueftAm: G,
    pruefen: true,
    hinweis: "Die aktualisierte Richtlinie 2026 war am Prüfdatum nicht abrufbar (Seite nicht erreichbar); Förderhöhen für PV, Speicher und Heizungstausch beim Bauamt erfragen.",
  },
  ungeprueft("Hintersee", "50318", "salzburg-umgebung"),
  ungeprueft("Hof bei Salzburg", "50319", "salzburg-umgebung"),
  ungeprueft("Köstendorf", "50320", "salzburg-umgebung"),
  ungeprueft("Koppl", "50321", "salzburg-umgebung"),
  keine("Lamprechtshausen", "50322", "salzburg-umgebung", "https://www.lamprechtshausen.at/Service/Dienstleistungen/Foerderungen", "Förderseite nennt nur den Heizkostenzuschuss 2026 (Zuschuss zu Heizkosten, keine Anlagenförderung) und Vereinszuschüsse."),
  keine("Mattsee", "50323", "salzburg-umgebung", "https://www.mattsee.at/Services/Dienstleistungen/Foerderungen", "Förderseite verweist nur auf Förderungen des Landes Salzburg (Sanierungsförderung); kein eigenes Gemeindeprogramm für PV, Speicher oder Wallbox."),
  ungeprueft("Neumarkt am Wallersee", "50324", "salzburg-umgebung"),
  ungeprueft("Nußdorf am Haunsberg", "50325", "salzburg-umgebung"),
  keine("Oberndorf bei Salzburg", "50326", "salzburg-umgebung", "https://www.oberndorf.salzburg.at/", "Website nennt Energie-Beratungstermine des Regionalverbands Flachgau-Nord, aber keinen Gemeindezuschuss für PV, Speicher oder Wallbox."),
  ungeprueft("Obertrum am See", "50327", "salzburg-umgebung"),
  ungeprueft("Plainfeld", "50328", "salzburg-umgebung"),
  ungeprueft("St. Georgen bei Salzburg", "50329", "salzburg-umgebung"),
  ungeprueft("St. Gilgen", "50330", "salzburg-umgebung"),
  ungeprueft("Schleedorf", "50331", "salzburg-umgebung"),
  ungeprueft("Seeham", "50332", "salzburg-umgebung"),
  {
    gemeinde: "Seekirchen am Wallersee",
    gkz: "50339",
    bezirk: "salzburg-umgebung",
    status: "ausgesetzt",
    programm: "Förderung für thermische Sanierung, Heizungstausch, PV-Anlagen (bis 5 kWp) und PV-Speicher (bis 6 kWh) – Förderrichtlinie 2022",
    hoehe: null,
    zielgruppen: ["privat"],
    bedingungen: ["Beschluss der Gemeindevertretung vom 16.12.2024: Annahme neuer Ansuchen seit 01.01.2025 bis auf Weiteres ausgesetzt", "für bis 31.12.2024 fertiggestellte und abgerechnete Maßnahmen gilt eine Einreichfrist von 12 Monaten nach Fertigstellung (Rechnungsdatum)"],
    frist: null,
    quelleUrl: "https://www.seekirchen.at/Buergerservice/Foerderungen",
    geprueftAm: G,
    pruefen: true,
    hinweis: "Die Detailseite „Förderungen für thermische Sanierungen“ war am Prüfdatum nur über die Suche erreichbar – Wiederaufnahme beim Stadtamt erfragen.",
  },
  {
    gemeinde: "Straßwalchen",
    gkz: "50335",
    bezirk: "salzburg-umgebung",
    status: "ausgesetzt",
    programm: "Gemeindeförderung für Energiesparmaßnahmen (Sanierungsförderung)",
    hoehe: null,
    zielgruppen: ["privat"],
    bedingungen: ["„Neue Anträge zur Gemeindeförderung für Energiesparmaßnahmen können bis auf weiteres NICHT mehr eingereicht werden“ – Sparmaßnahmen zum Budget 2026"],
    frist: null,
    quelleUrl: "https://www.strasswalchen.at/Info_ueber_das_Aussetzen_der_Energiespar-Foerderungen_im_Jahr_2025",
    geprueftAm: G,
    hinweis: "Ein Datum der Wiederaufnahme nennt die Gemeinde nicht.",
  },
  ungeprueft("Strobl", "50336", "salzburg-umgebung"),
  {
    gemeinde: "Thalgau",
    gkz: "50337",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Richtlinien für die Förderung von Maßnahmen zur Reduzierung des Energieverbrauchs (e5-Gemeinde)",
    hoehe: "Heizungstausch (Biomasse, Nahwärme, Wärmepumpe) pauschal 500 €; gemeinsam mit einer neuen PV-Anlage ab 2 kWp pauschal 700 €; thermische Solaranlage 500 €; Dämmung und Fenster je m² (max. 600–1.600 €)",
    zielgruppen: ["privat", "unternehmen", "landwirtschaft"],
    bedingungen: [
      "bestehendes Wohngebäude, landwirtschaftlicher Wohntrakt oder betriebliches Objekt im Gemeindegebiet",
      "Energieberatung (Land Salzburg oder befugtes Büro) als Voraussetzung, nicht älter als 10 Jahre",
      "PV nur in Kombination mit dem Heizungstausch; Balkonkraftwerke ausgenommen; kein eigener Speicher- oder Wallbox-Zuschuss",
      "je Haushalt und Maßnahme einmalig; 10 Jahre widmungsgemäße Nutzung",
    ],
    frist: "Ansuchen längstens 3 Monate nach Rechnungslegung",
    quelleUrl: "https://www.thalgau.at/Richtlinien_fuer_Energiefoerderungen_1",
    geprueftAm: G,
    hinweis: "Richtlinie in Kraft seit 01.03.2024 (Beschluss 27.02.2024), unbefristet; Auszahlung nach Maßgabe der Mittel.",
  },
  {
    gemeinde: "Wals-Siezenheim",
    gkz: "50338",
    bezirk: "salzburg-umgebung",
    status: "programm",
    programm: "Förderrichtlinien Energie, Klima und Umwelt (e5-Gemeinde) – gültig ab 01.04.2026",
    hoehe: "PV-Nachrüstung 4–10 kWp pauschal 500 €, 10,1–20 kWp 1.000 €; Batteriespeicher zusätzlich 10 % des Speicherpreises, max. 500 €; Wallbox oder Mehrzweckladekabel 25 % des Bruttopreises, max. 200 €; Wärmepumpe 500 €, Biomassekessel 1.000 €, Fernwärmeanschluss 800 €",
    zielgruppen: ["privat", "unternehmen"],
    bedingungen: [
      "PV: Gebäude mindestens 5 Jahre alt, Anlage 4–30 kWp mit Wechselrichter, Vor-Ort-Energieberatung oder Energieausweis (max. 2 Jahre alt) vor der Umsetzung",
      "Heizungstausch nur als Ersatz von Öl, Erdgas, Kohle oder Nachtspeicher; Vor-Ort-Energieberatung in den letzten 2 Jahren",
      "private Haushalte: Bruttopreis; vorsteuerabzugsberechtigte Unternehmen: Nettokosten",
      "je Haushalt und Maßnahme einmalig innerhalb von 5 Jahren; kein Rechtsanspruch",
    ],
    frist: "Ansuchen bis 6 Monate nach Rechnungsausstellung (formlos), Abrechnung binnen 18 Monaten",
    quelleUrl: "https://www.wals-siezenheim.at/e5-Foerderungen_2020",
    geprueftAm: G,
    hinweis: "Beschluss der Gemeindevertretung vom 18.03.2026; Richtlinie als PDF „Förderrichtlinien_Energie, Klima, Umwelt“ auf der Förderseite.",
  },
];

export const GEMEINDEFOERDERUNGEN = [...BRAUNAU, ...FLACHGAU];

/** Zählung je Status für Kopfzeile und Tests. */
export function zaehleStatus(liste = GEMEINDEFOERDERUNGEN) {
  return liste.reduce(
    (acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    },
    { programm: 0, ausgesetzt: 0, keine: 0, ungeprueft: 0 }
  );
}

/** Einträge eines Bezirks, alphabetisch. */
export function gemeindenImBezirk(bezirkId, liste = GEMEINDEFOERDERUNGEN) {
  return liste.filter((g) => g.bezirk === bezirkId).sort((a, b) => a.gemeinde.localeCompare(b.gemeinde, "de"));
}
