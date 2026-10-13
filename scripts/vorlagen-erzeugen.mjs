// scripts/vorlagen-erzeugen.mjs
//
// Erzeugt das Muster-Paket für Gemeinden unter public/vorlagen/ (Welle B, Paket B09):
//   - leistungsbeschreibung-pv-gemeinde-muster.docx  (docx, MIT)
//   - leistungsbeschreibung-pv-gemeinde-muster.html  (eigenständig, druckbar)
//   - bewertungsmatrix-pv-angebote-muster.xlsx       (exceljs, MIT) – 3 Angebote, Formeln
//   - README.md                                      (Nutzungshinweis)
// Aufruf: node scripts/vorlagen-erzeugen.mjs
//
// Inhalt herstellerneutral, mit Rechtsvorbehalt und Hinweis zu § 25 BVergG (Vorarbeiten).
// Die Vorlagen sind öffentlich und ohne Lead-Gate (statische Inhalte, Stufe 3 der Gate-Regel).
// Quellen siehe QUELLEN unten; Stand 11.10.2026.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import ExcelJS from "exceljs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = path.join(ROOT, "public", "vorlagen");
const STAND = "11.10.2026";
const VERSION = "1.0";
const HERAUSGEBER = "Ökovolt Solartechnik GmbH (FN 375708m)";

// ---------------------------------------------------------------------------
// Inhalt der funktionalen Leistungsbeschreibung (ein Datenmodell → DOCX und HTML)
// ---------------------------------------------------------------------------
const TITEL = "Funktionale Leistungsbeschreibung – Photovoltaikanlage auf einem Gemeindegebäude";
const UNTERTITEL = `Muster für öffentliche Auftraggeber · herstellerneutral · Version ${VERSION} · Stand ${STAND}`;

const VORBEMERKUNG = [
  "Dieses Muster ist eine Arbeitshilfe für Gemeinden, Gemeindeverbände und Stadtwerke. Es ersetzt keine Rechtsberatung und keine Fachplanung. Platzhalter in eckigen Klammern [__] sind auszufüllen; nicht zutreffende Positionen sind zu streichen.",
  "Hinweis zu § 25 BVergG 2018 (Vorarbeiten): Hat ein Unternehmen an der Vorbereitung des Vergabeverfahrens mitgewirkt – etwa durch Vorplanung, Potenzialanalyse oder Textbausteine –, ist das offenzulegen und so auszugleichen, dass dem Unternehmen daraus kein Wettbewerbsvorteil erwächst (z. B. durch Weitergabe aller Informationen an alle Bieter und angemessene Fristen). Dieses Muster ist öffentlich zugänglich, wurde nicht für ein bestimmtes Verfahren erstellt und steht allen Bietern gleichermaßen zur Verfügung.",
  `Offenlegung: Herausgeberin dieses Musters ist die ${HERAUSGEBER}, ein Elektrotechnik-Fachbetrieb, der sich an Vergabeverfahren für Photovoltaik beteiligen kann. Verwendet die Gemeinde dieses Muster und gibt das Unternehmen ein Angebot ab, empfiehlt es sich, das im Vergabevermerk festzuhalten und allen Bietern dieselben Unterlagen und Fristen zu geben.`,
  "Vergaberecht: Auftragswert nach § 13 BVergG schätzen (Gesamtwert ohne Umsatzsteuer, inkl. Optionen), Verfahren nach §§ 43, 46, 47 BVergG 2018 idF Vergaberechtsgesetz 2026 wählen. Bei Direktvergabe über 50.000 € netto um mindestens drei Angebote oder Preisauskünfte bemühen und die Vergabe dokumentieren (§ 46 Abs. 4 und 5).",
];

const ABSCHNITTE = [
  {
    titel: "1. Auftraggeber und Vorhaben",
    absaetze: ["Auftraggeberin: Gemeinde [__], [Adresse], Ansprechperson [__], E-Mail [__], Telefon [__]."],
    punkte: [
      "Liegenschaft: [Bezeichnung, Adresse, Grundstücksnummer, KG]; Gebäudenutzung: [Schule / Bauhof / Kläranlage / Amt / …].",
      "Vorhaben: Lieferung, Montage und Inbetriebnahme einer netzgekoppelten Photovoltaikanlage mit rund [__] kWp; optional Stromspeicher mit rund [__] kWh nutzbarer Kapazität.",
      "Einordnung der Leistung: [Bauauftrag / Lieferauftrag] nach dem Hauptgegenstand (Begründung im Vergabevermerk).",
      "Vergabeverfahren: [Direktvergabe § 46 / Direktvergabe mit vorheriger Bekanntmachung § 47 / nicht offenes Verfahren ohne Bekanntmachung § 43 / Verfahren mit Bekanntmachung].",
      "Ausführungszeitraum: Beginn [__], Fertigstellung und Inbetriebnahme bis [__] (Förderfristen beachten, siehe Abschnitt 5).",
    ],
  },
  {
    titel: "2. Leistungsumfang (funktional)",
    absaetze: ["Die Bieterin bzw. der Bieter schuldet eine funktionsfähige, geprüfte und dokumentierte Anlage. Der Leistungsumfang umfasst insbesondere:"],
    punkte: [
      "Planung: Ausführungs- und Elektroplanung, Belegungsplan, Stringplanung, Ertragsprognose (Methode angeben, z. B. PVGIS), statische Beurteilung der Dachtragfähigkeit durch eine befugte Person, Nachweis der Durchdringungen und der Dachhaut-Verträglichkeit.",
      "Lieferung und Montage: Module, Wechselrichter, Unterkonstruktion, DC- und AC-Verkabelung, Schutz- und Trenneinrichtungen, Zählerplatz-Adaptierung, Potentialausgleich, Blitz- und Überspannungsschutzkonzept, Beschilderung und Kennzeichnung.",
      "Netzanschluss: Netzzugangsantrag und Abstimmung mit dem Netzbetreiber, Umsetzung der Vorgaben aus der Netzzugangsauskunft (Anschlusspunkt, Wirkleistungsbegrenzung, Steuerbarkeit), Fertigstellungsmeldung, Koordination des Zählertausches.",
      "Inbetriebnahme und Prüfung: Erstprüfung und Protokoll nach ÖVE/ÖNORM EN 62446-1, Messprotokolle (Isolationswiderstand, Leerlaufspannung, Kurzschlussstrom je String, Erdung/Potentialausgleich), Funktionsprüfung Monitoring.",
      "Dokumentation: Anlagenbuch mit Schaltplänen, Stringplan, Datenblättern, Konformitätserklärungen, Prüfprotokollen, Netzbetreiber-Unterlagen, Bedienungsanleitungen – in Papierform und digital (PDF).",
      "Einweisung: Einschulung von [__] Personen der Gemeinde (Betrieb, Störungsverhalten, Monitoring, Freischaltung im Notfall).",
      "Monitoring: Anlagenüberwachung mit Zugriff für die Gemeinde (Erzeugung, Störungsmeldung); Schnittstelle für Energiebuchhaltung bzw. Energiegemeinschaft [falls gewünscht].",
      "Unterstützung bei der Förderabwicklung (EAG-Investitionszuschuss) gemäß Abschnitt 5.",
      "Optional (eigene Preisposition): Wartungsvertrag gemäß Abschnitt 6.",
    ],
  },
  {
    titel: "3. Technische Mindestanforderungen (herstellerneutral)",
    absaetze: ["Produktnamen werden nicht vorgegeben. Zulässig sind alle Produkte, die die folgenden Anforderungen nachweislich erfüllen (gleichwertig)."],
    punkte: [
      "Module: kristalline Siliziummodule, Nennleistung je Modul mindestens [__] Wp, nur positive Leistungstoleranz, Produktgarantie mindestens [__] Jahre, lineare Leistungsgarantie mindestens [__] Jahre, Prüfung nach IEC 61215 und IEC 61730, Schneelastklasse passend zum Standort (Nachweis).",
      "Wechselrichter: Anforderungen der TOR Erzeuger (Typ A bzw. Typ B je Anlagenleistung) und der Netzzugangsauskunft; Steuerbarkeit und Begrenzung der Einspeiseleistung (z. B. Spitzenkappung nach ElWG) technisch vorbereitet; europäischer Wirkungsgrad mindestens [__] %; Datenschnittstelle für Monitoring; Herstellergarantie mindestens [__] Jahre.",
      "Speicher (falls beauftragt): nutzbare Kapazität [__] kWh, Zyklenfestigkeit bzw. Garantie [__] Jahre oder [__] Zyklen, Notstrom-/Ersatzstromfunktion [ja/nein], Aufstellung nach den Vorgaben der OVE-Richtlinie R 11-1 und des Brandschutzes.",
      "Unterkonstruktion: statisch nachgewiesen für Schnee- und Windlasten nach ÖNORM EN 1991-1-3 und 1991-1-4 samt nationalen Anhängen, korrosionsgeschützt (Aluminium/Edelstahl), ohne Beeinträchtigung der Dachabdichtung; Ballastierung bzw. Befestigung mit Nachweis.",
      "Elektrotechnik: Errichtung nach ÖVE/ÖNORM E 8101, Blitz- und Überspannungsschutz nach ÖVE/ÖNORM EN 62305 und OVE-Richtlinie R 11-1, DC-Freischaltung und Kennzeichnung für Einsatzkräfte, Kabelverlegung UV- und nagetierbeständig bzw. geschützt.",
      "Brandschutz und Sicherheit: Hinweisschilder, Übersichtsplan für die Feuerwehr, Abstände zu Brandabschnitten und Dachaufbauten nach Landesrecht; Absturzsicherung während der Montage.",
      "Netzkonformität: Einhaltung der TOR (Technische und organisatorische Regeln für Betreiber und Benutzer von Netzen) der E-Control in der geltenden Fassung.",
    ],
  },
  {
    titel: "4. Normen und Regelwerke",
    absaetze: ["Maßgeblich sind die am Tag der Angebotsabgabe geltenden Fassungen. Verwiesen wird insbesondere auf:"],
    punkte: [
      "Standardisierte Leistungsbeschreibung Hochbau (StLB-HT) – für ergänzende Leistungspositionen (Dach, Gerüst, Durchbrüche) in der jeweils aktuellen Version.",
      "OVE-Richtlinie R 11-1 (Photovoltaik-Anlagen) in der geltenden Fassung.",
      "ÖVE/ÖNORM EN 62446-1 – Prüfung, Dokumentation und Instandhaltung netzgekoppelter Photovoltaik-Systeme.",
      "ÖVE/ÖNORM E 8101 – Errichtung elektrischer Niederspannungsanlagen.",
      "TOR Erzeuger (Typ A, Typ B) der E-Control sowie die Netzzugangsbedingungen des zuständigen Netzbetreibers.",
      "ÖNORM EN 1991-1-3 / 1991-1-4 – Schnee- und Windlasten (mit nationalen Anhängen).",
      "Bauordnung und PV-Bestimmungen des Bundeslandes (Anzeige-/Bewilligungspflicht, Ortsbild), ggf. Denkmalschutz.",
      "Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) – Netzanschluss, Steuerbarkeit, Spitzenkappung, gemeinsame Energienutzung.",
    ],
  },
  {
    titel: "5. Förderung (EAG-Abwicklung)",
    absaetze: ["Die Gemeinde beantragt den EAG-Investitionszuschuss (bzw. andere Förderungen) selbst. Die Bieterin bzw. der Bieter unterstützt wie folgt:"],
    punkte: [
      "Rechtzeitige Bereitstellung aller Unterlagen für den Förderantrag und die Endabrechnung: Angebot mit Gliederung nach Komponenten, Datenblätter, Rechnungen mit getrennt ausgewiesenen förderfähigen Kosten, Inbetriebnahme- und Prüfprotokoll, Fertigstellungsmeldung des Netzbetreibers.",
      "Fristen: Der Förderantrag ist vor der Inbetriebnahme zu stellen; die Inbetriebnahme hat innerhalb der Frist der Förderzusage zu erfolgen. Der Bieter bestätigt einen Fertigstellungstermin, der diese Fristen einhält.",
      "Keine Inbetriebnahme ohne schriftliche Freigabe der Gemeinde (Förderantrag gestellt).",
      "Die Einhaltung des Vergaberechts ist Fördervoraussetzung (§ 4 Abs. 1 Z 5 EAG-IZV); das Vergabeverfahren wird daher vollständig dokumentiert.",
    ],
  },
  {
    titel: "6. Wartungsoption (eigene Preisposition)",
    absaetze: ["Die Gemeinde behält sich vor, einen Wartungsvertrag über [__] Jahre zu beauftragen. Anzubieten ist ein Jahrespauschalpreis für:"],
    punkte: [
      "Jährliche Sichtprüfung und Funktionskontrolle (Module, Unterkonstruktion, Verkabelung, Wechselrichter, Speicher, Schutzeinrichtungen) mit Bericht.",
      "Wiederkehrende Prüfung nach ÖVE/ÖNORM EN 62446-1 im Intervall [__] Jahre.",
      "Monitoring-Auswertung mit Ertragsvergleich und Störungsmeldung an die Gemeinde.",
      "Störungsbehebung: Reaktionszeit maximal [__] Werktage nach Meldung; Ersatzteilverfügbarkeit für Wechselrichter und Komponenten zusichern.",
      "Stundensätze und Anfahrt für Leistungen außerhalb der Pauschale.",
    ],
  },
  {
    titel: "7. Angebotsabgabe und Nachweise",
    absaetze: ["Mit dem Angebot sind vorzulegen (Eignung zum Zeitpunkt der Leistungserbringung, § 20 BVergG):"],
    punkte: [
      "Gewerbeberechtigung Elektrotechnik (GISA-Auszug) und Firmenbuchauszug.",
      "Referenzliste vergleichbarer Anlagen der letzten [__] Jahre mit Leistung in kWp, Jahr und Ansprechperson des Auftraggebers.",
      "Nachweis einer Betriebshaftpflichtversicherung mit Deckungssumme von mindestens [__] €.",
      "Auf Verlangen: Unbedenklichkeitsbescheinigungen (Finanzamt, Sozialversicherung), Auszug aus der Verwaltungsstrafevidenz nach dem LSD-BG.",
      "Preisblatt: Pauschalpreis netto mit Gliederung (Module, Wechselrichter, Speicher, Unterkonstruktion, Elektroinstallation, Planung/Dokumentation, Netzanschluss, Nebenleistungen), optional Wartung gemäß Abschnitt 6.",
      "Ertragsprognose in kWh/Jahr mit Angabe der Methode und der Annahmen (Ausrichtung, Neigung, Verschattung, Systemverluste).",
      "Lieferzeit und Montagedauer, Gewährleistungsfrist, Angebotsbindefrist.",
    ],
  },
  {
    titel: "8. Zuschlagskriterien",
    absaetze: ["Der Zuschlag erfolgt nach dem Bestbieterprinzip. Die Bewertung richtet sich nach der beiliegenden Bewertungsmatrix (Muster: Preis 50 %, Ertragsprognose 20 %, Wartung 10 %, Reaktionszeit 10 %, Lieferzeit 10 %). Die Gewichtung legt die Gemeinde vor Angebotseinholung fest und gibt sie allen Bietern bekannt."],
    punkte: [],
  },
  {
    titel: "9. Rechtsvorbehalt",
    absaetze: [
      "Dieses Muster dient der allgemeinen Information und stellt keine Rechtsberatung dar. Es wurde mit Sorgfalt erstellt, eine Gewähr für Vollständigkeit und Aktualität wird nicht übernommen. Verbindlich sind die Gesetze, Normen und Netzbetreiberbedingungen in ihrer jeweils geltenden Fassung sowie die Vorgaben der Förderstellen. Die Gemeinde als Auftraggeberin verantwortet Inhalt, Verfahren und Zuschlag.",
      `Stand der Rechtsgrundlagen: ${STAND}. Vergabewerte nach BVergG 2018 idF BGBl. I Nr. 8/2026.`,
    ],
    punkte: [],
  },
];

const QUELLEN = [
  "§§ 13, 20, 25, 43, 46, 47 BVergG 2018 idF Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 (RIS/JUSLINE)",
  "EAG-Investitionszuschüsseverordnung-Strom (EAG-IZV), § 4 Abs. 1 Z 5",
  "E-Control – TOR Erzeuger Typ A und Typ B (geltende Fassung)",
  "OVE-Richtlinie R 11-1; ÖVE/ÖNORM EN 62446-1; ÖVE/ÖNORM E 8101; ÖVE/ÖNORM EN 62305; ÖNORM EN 1991-1-3/-4",
  "Standardisierte Leistungsbeschreibung Hochbau (StLB-HT)",
  "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025",
];

// ---------------------------------------------------------------------------
// DOCX
// ---------------------------------------------------------------------------
const absatz = (text, opt = {}) => new Paragraph({ children: [new TextRun({ text, ...opt.run })], spacing: { after: 120 }, ...opt.para });
const punkt = (text) => new Paragraph({ children: [new TextRun(text)], bullet: { level: 0 }, spacing: { after: 80 } });
const ueberschrift = (text, level = HeadingLevel.HEADING_1) => new Paragraph({ text, heading: level, spacing: { before: 280, after: 120 } });

function docxErzeugen() {
  const kinder = [
    new Paragraph({ children: [new TextRun({ text: TITEL, bold: true, size: 32 })], spacing: { after: 120 } }),
    new Paragraph({ children: [new TextRun({ text: UNTERTITEL, color: "555555", size: 20 })], spacing: { after: 240 } }),
    ueberschrift("Vorbemerkung und Rechtsvorbehalt"),
    ...VORBEMERKUNG.map((t) => absatz(t)),
  ];
  for (const a of ABSCHNITTE) {
    kinder.push(ueberschrift(a.titel));
    for (const t of a.absaetze) kinder.push(absatz(t));
    for (const p of a.punkte) kinder.push(punkt(p));
  }
  kinder.push(ueberschrift("Quellen"));
  for (const q of QUELLEN) kinder.push(punkt(q));

  // Kopfdaten-Tabelle am Anfang (Gemeinde, Liegenschaft, Verfahren)
  const zeile = (k, v) =>
    new TableRow({
      children: [
        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })] }),
        new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, children: [new Paragraph(v)] }),
      ],
    });
  const tabelle = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [zeile("Auftraggeberin", "Gemeinde [__]"), zeile("Liegenschaft", "[__]"), zeile("Anlagenleistung", "rund [__] kWp, Speicher [__] kWh"), zeile("Vergabeverfahren", "[__] nach BVergG 2018"), zeile("Angebotsfrist", "[Datum, Uhrzeit]")],
  });
  kinder.splice(2, 0, tabelle, new Paragraph({ text: "", spacing: { after: 120 } }));

  const doc = new Document({
    creator: HERAUSGEBER,
    title: TITEL,
    description: UNTERTITEL,
    styles: {
      default: { document: { run: { font: "Arial", size: 21 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, color: "123456" }, paragraph: { spacing: { before: 280, after: 120 } } },
      ],
    },
    numbering: { config: [] },
    sections: [
      {
        properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
        children: kinder,
      },
    ],
  });
  return Packer.toBuffer(doc);
}

// ---------------------------------------------------------------------------
// HTML (eigenständig, druckbar)
// ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function htmlErzeugen() {
  const teile = ABSCHNITTE.map(
    (a) =>
      `<section><h2>${esc(a.titel)}</h2>${a.absaetze.map((t) => `<p>${esc(t)}</p>`).join("")}${a.punkte.length ? `<ul>${a.punkte.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}</section>`
  ).join("\n");
  return `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(TITEL)} (Muster)</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #111; max-width: 50rem; margin: 2rem auto; padding: 0 1.25rem; line-height: 1.55; }
  h1 { font-size: 1.5rem; margin: 0 0 .25rem; } .unter { color: #555; margin: 0 0 1.5rem; }
  h2 { font-size: 1.1rem; margin: 1.6rem 0 .5rem; border-bottom: 1px solid #999; padding-bottom: .2rem; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; } td { border: 1px solid #bbb; padding: .4rem .6rem; vertical-align: top; } td:first-child { font-weight: bold; width: 35%; background: #f4f4f4; }
  li { margin: .3rem 0; } .vorbemerkung { background: #f7f7f2; border-left: 4px solid #999; padding: .75rem 1rem; }
  .quellen { font-size: .9rem; color: #444; border-top: 1px solid #ccc; margin-top: 2rem; padding-top: .75rem; }
  @media print { body { margin: 0; max-width: none; } .vorbemerkung { background: none; } }
</style>
</head>
<body>
<h1>${esc(TITEL)}</h1>
<p class="unter">${esc(UNTERTITEL)}</p>
<table>
<tr><td>Auftraggeberin</td><td>Gemeinde [__]</td></tr>
<tr><td>Liegenschaft</td><td>[__]</td></tr>
<tr><td>Anlagenleistung</td><td>rund [__] kWp, Speicher [__] kWh</td></tr>
<tr><td>Vergabeverfahren</td><td>[__] nach BVergG 2018</td></tr>
<tr><td>Angebotsfrist</td><td>[Datum, Uhrzeit]</td></tr>
</table>
<section class="vorbemerkung"><h2>Vorbemerkung und Rechtsvorbehalt</h2>${VORBEMERKUNG.map((t) => `<p>${esc(t)}</p>`).join("")}</section>
${teile}
<div class="quellen"><strong>Quellen</strong><ul>${QUELLEN.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// XLSX – Bewertungsmatrix für 3 Angebote
// ---------------------------------------------------------------------------
const KRITERIEN = [
  { name: "Angebotspreis netto (€)", gewicht: 50, richtung: "min", einheit: "€", hinweis: "Pauschalpreis gemäß Preisblatt; niedrigster Preis = 10 Punkte, andere anteilig (Minimum ÷ Preis × 10)." },
  { name: "Ertragsprognose (kWh/Jahr)", gewicht: 20, richtung: "max", einheit: "kWh", hinweis: "Nachvollziehbare Prognose (z. B. PVGIS) mit Annahmen; höchster Wert = 10 Punkte, andere anteilig." },
  { name: "Wartung – Jahrespauschale (€/Jahr)", gewicht: 10, richtung: "min", einheit: "€/a", hinweis: "Optionale Wartung nach Abschnitt 6; niedrigster Preis = 10 Punkte." },
  { name: "Reaktionszeit bei Störung (Werktage)", gewicht: 10, richtung: "min", einheit: "Werktage", hinweis: "Zugesicherte Reaktionszeit; kürzeste = 10 Punkte." },
  { name: "Lieferzeit bis Inbetriebnahme (Wochen)", gewicht: 10, richtung: "min", einheit: "Wochen", hinweis: "Ab Auftragserteilung; kürzeste = 10 Punkte. Förderfristen beachten." },
];

async function xlsxErzeugen() {
  const wb = new ExcelJS.Workbook();
  wb.creator = HERAUSGEBER;
  wb.calcProperties = { fullCalcOnLoad: true };
  wb.created = new Date("2026-10-11T00:00:00Z");

  const ws = wb.addWorksheet("Bewertung", { views: [{ state: "frozen", ySplit: 4 }] });
  ws.columns = [
    { key: "krit", width: 42 },
    { key: "gew", width: 11 },
    { key: "a1", width: 16 },
    { key: "p1", width: 11 },
    { key: "a2", width: 16 },
    { key: "p2", width: 11 },
    { key: "a3", width: 16 },
    { key: "p3", width: 11 },
    { key: "hinweis", width: 60 },
  ];
  ws.mergeCells("A1:I1");
  ws.getCell("A1").value = "Bewertungsmatrix Photovoltaik – 3 Angebote (Muster, Bestbieterprinzip)";
  ws.getCell("A1").font = { bold: true, size: 14 };
  ws.mergeCells("A2:I2");
  ws.getCell("A2").value = `Gemeinde [__] · Vorhaben [__] · Stand ${STAND} · Gewichte vor Angebotseinholung festlegen und allen Bietern bekanntgeben (§ 46 Abs. 4 BVergG: über 50.000 € mindestens drei Angebote oder Preisauskünfte). Gelbe Zellen ausfüllen.`;
  ws.getCell("A2").alignment = { wrapText: true };
  ws.getRow(2).height = 34;

  const kopf = ["Kriterium", "Gewicht %", "Angebot 1", "Punkte 1", "Angebot 2", "Punkte 2", "Angebot 3", "Punkte 3", "Hinweis zur Bewertung"];
  ws.getRow(4).values = kopf;
  ws.getRow(4).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F2A4A" } };
  const gelb = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2B3" } };

  const erste = 5;
  KRITERIEN.forEach((k, i) => {
    const r = erste + i;
    const row = ws.getRow(r);
    row.getCell(1).value = k.name;
    row.getCell(2).value = k.gewicht;
    row.getCell(2).fill = gelb;
    const eingaben = ["C", "E", "G"];
    const bereich = `${eingaben[0]}${r},${eingaben[1]}${r},${eingaben[2]}${r}`;
    eingaben.forEach((sp, j) => {
      row.getCell(sp).fill = gelb;
      row.getCell(sp).numFmt = k.einheit === "€" || k.einheit === "€/a" ? "#,##0 [$€-C07]" : "#,##0";
      const punkteSpalte = String.fromCharCode(sp.charCodeAt(0) + 1);
      const formel = k.richtung === "min" ? `IF(AND(ISNUMBER(${sp}${r}),${sp}${r}>0),MIN(${bereich})/${sp}${r}*10,0)` : `IF(AND(ISNUMBER(${sp}${r}),MAX(${bereich})>0),${sp}${r}/MAX(${bereich})*10,0)`;
      row.getCell(punkteSpalte).value = { formula: formel };
      row.getCell(punkteSpalte).numFmt = "0.0";
      void j;
    });
    row.getCell(9).value = k.hinweis;
    row.getCell(9).alignment = { wrapText: true, vertical: "top" };
    row.height = 32;
  });

  const letzte = erste + KRITERIEN.length - 1;
  const summe = letzte + 1;
  ws.getRow(summe).values = ["Summe Gewichte (muss 100 ergeben)"];
  ws.getCell(`B${summe}`).value = { formula: `SUM(B${erste}:B${letzte})` };
  ws.getCell(`B${summe}`).font = { bold: true };

  const gesamt = summe + 2;
  ws.getRow(gesamt).values = ["Gewichtete Gesamtpunkte (max. 10)"];
  ws.getRow(gesamt).font = { bold: true };
  for (const [punkte, ziel] of [
    ["D", "D"],
    ["F", "F"],
    ["H", "H"],
  ]) {
    ws.getCell(`${ziel}${gesamt}`).value = { formula: `SUMPRODUCT($B$${erste}:$B$${letzte},${punkte}${erste}:${punkte}${letzte})/100` };
    ws.getCell(`${ziel}${gesamt}`).numFmt = "0.00";
  }
  const rang = gesamt + 1;
  ws.getRow(rang).values = ["Rang (1 = Bestbieter)"];
  // Rang ohne RANK über nicht zusammenhängende Zellen (läuft gleich in Excel und LibreOffice)
  for (const [sp, a, b] of [
    ["D", "F", "H"],
    ["F", "D", "H"],
    ["H", "D", "F"],
  ]) {
    ws.getCell(`${sp}${rang}`).value = { formula: `IF(${sp}${gesamt}>0,1+(${a}${gesamt}>${sp}${gesamt})+(${b}${gesamt}>${sp}${gesamt}),"")` };
  }

  const bieter = rang + 2;
  ws.getRow(bieter).values = ["Bieter (Name, Ort)", "", "[Angebot 1]", "", "[Angebot 2]", "", "[Angebot 3]"];
  ["C", "E", "G"].forEach((sp) => (ws.getCell(`${sp}${bieter}`).fill = gelb));
  ws.getRow(bieter + 1).values = ["Eignung geprüft (GISA, Firmenbuch, Versicherung)", "", "[ja/nein]", "", "[ja/nein]", "", "[ja/nein]"];
  ws.getRow(bieter + 2).values = ["Angebotsdatum / Bindefrist", "", "[__]", "", "[__]", "", "[__]"];
  ws.getRow(bieter + 4).values = ["Vergabevermerk: Gegenstand, geschätzter Auftragswert netto, Verfahren, eingeholte Angebote, Auftragnehmer, Preisangemessenheit (§ 46 Abs. 5 BVergG) – als Beilage ablegen."];
  ws.mergeCells(`A${bieter + 4}:I${bieter + 4}`);
  ws.getCell(`A${bieter + 4}`).alignment = { wrapText: true };
  ws.getRow(bieter + 4).height = 30;

  const hw = wb.addWorksheet("Hinweise");
  hw.columns = [{ width: 110 }];
  [
    "Bewertungsmatrix Photovoltaik – Hinweise (Muster, keine Rechtsberatung)",
    "",
    "1. Gewichtung und Bewertungsmethode VOR der Angebotseinholung festlegen und allen Bietern gleich bekanntgeben (Transparenz, Gleichbehandlung).",
    "2. Direktvergabe über 50.000 € netto: um mindestens drei Angebote oder unverbindliche Preisauskünfte bemühen, sofern keine sachlichen Gründe entgegenstehen (§ 46 Abs. 4 BVergG 2018 idF 2026); Dokumentation nach § 46 Abs. 5.",
    "3. § 25 BVergG (Vorarbeiten): Hat ein Unternehmen an der Vorbereitung mitgewirkt, ist das offenzulegen und auszugleichen, damit kein Wettbewerbsvorteil entsteht. Dieses Muster ist öffentlich und für alle Bieter gleich zugänglich.",
    "4. Preis: niedrigster Preis erhält 10 Punkte, die anderen anteilig (Minimum ÷ Preis × 10). Ertrag: höchster Wert 10 Punkte, andere anteilig. Wartung, Reaktionszeit, Lieferzeit: niedrigster Wert 10 Punkte.",
    "5. Nur vergleichbare Angebote bewerten: gleicher Leistungsumfang (funktionale Leistungsbeschreibung), gleiche Annahmen in der Ertragsprognose. Ungewöhnlich niedrige Preise aufklären.",
    "6. Eignung (Befugnis, Zuverlässigkeit, Leistungsfähigkeit) vor der Bewertung prüfen (§ 20 BVergG); fehlt sie, scheidet das Angebot aus.",
    "7. Formeln: Bei nicht ausgefüllten Angebotszellen ergibt das Kriterium 0 Punkte; der Rang erscheint, sobald ein Angebot Punkte hat. Die Formeln laufen in Excel und LibreOffice ohne Matrixeingabe.",
    `8. Offenlegung: Herausgeberin dieses Musters ist die ${HERAUSGEBER}, die sich als Bieterin beteiligen kann – siehe § 25 BVergG und Hinweis 3.`,
    `Stand ${STAND}. Quellen: §§ 20, 25, 46 BVergG 2018 idF BGBl. I Nr. 8/2026 (RIS/JUSLINE).`,
  ].forEach((t, i) => {
    const c = hw.getCell(`A${i + 1}`);
    c.value = t;
    c.alignment = { wrapText: true, vertical: "top" };
    if (i === 0) c.font = { bold: true, size: 13 };
  });

  return wb.xlsx.writeBuffer();
}

// ---------------------------------------------------------------------------
const README = `# Muster-Paket Photovoltaik für Gemeinden

Stand ${STAND} · Version ${VERSION} · erzeugt mit \`node scripts/vorlagen-erzeugen.mjs\`

Dateien:
- leistungsbeschreibung-pv-gemeinde-muster.docx – funktionale Leistungsbeschreibung (Word)
- leistungsbeschreibung-pv-gemeinde-muster.html – dieselbe Vorlage als druckbare HTML-Seite
- bewertungsmatrix-pv-angebote-muster.xlsx – Bewertungsmatrix für drei Angebote mit Formeln (Excel/LibreOffice)

Nutzung: frei für Gemeinden, Gemeindeverbände, Stadtwerke und deren Berater – ohne Registrierung.
Herstellerneutral; Platzhalter [__] ausfüllen. Keine Rechtsberatung, keine Gewähr; verbindlich sind
Gesetze, Normen, Netzbetreiber- und Förderbedingungen in der geltenden Fassung.

§ 25 BVergG 2018 (Vorarbeiten): Mitwirkung eines Unternehmens an der Vorbereitung ist offenzulegen
und auszugleichen, damit kein Wettbewerbsvorteil entsteht. Diese Muster sind öffentlich und für alle
Bieter gleichermaßen zugänglich; sie wurden nicht für ein bestimmtes Verfahren erstellt.

Offenlegung: Herausgeberin ist die ${HERAUSGEBER}, ein Fachbetrieb, der sich an Vergabeverfahren
beteiligen kann. Wird das Muster verwendet und bietet das Unternehmen an, im Vergabevermerk festhalten.
`;

async function main() {
  fs.mkdirSync(ZIEL, { recursive: true });
  const docx = await docxErzeugen();
  fs.writeFileSync(path.join(ZIEL, "leistungsbeschreibung-pv-gemeinde-muster.docx"), docx);
  fs.writeFileSync(path.join(ZIEL, "leistungsbeschreibung-pv-gemeinde-muster.html"), htmlErzeugen(), "utf8");
  const xlsx = await xlsxErzeugen();
  fs.writeFileSync(path.join(ZIEL, "bewertungsmatrix-pv-angebote-muster.xlsx"), Buffer.from(xlsx));
  fs.writeFileSync(path.join(ZIEL, "README.md"), README, "utf8");
  for (const f of fs.readdirSync(ZIEL)) {
    const st = fs.statSync(path.join(ZIEL, f));
    console.log(`${f.padEnd(50)} ${Math.round(st.size / 1024)} kB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
