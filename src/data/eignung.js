// src/data/eignung.js
//
// Eignungsnachweise für /kommunen/eignung (Welle B, Paket B09).
//
// Regel des Inhabers: Nur belegte Nachweise werden gezeigt. Gütesiegel, Haftpflichtversicherung
// und ANKÖ-Eintrag erscheinen auf der Seite NUR, wenn hier belegt:true steht und ein Beleg
// (Urkunde, Polizze, Registerauszug – Ablage/Referenz) eingetragen ist. Start: alles false.
// Keine Aussagen zu Gesellschaftern (Inhaber-Entscheidung 05.10.2026, Salzburg AG nur neutral).
//
// Belegt und öffentlich prüfbar sind nur die Registerdaten aus src/lib/site.js (FIRMA):
// GISA-Nummer, Firmenbuchnummer/-gericht, UID, reglementiertes Gewerbe Elektrotechnik.
//
// Pflege: Liegt ein Beleg vor → belegt: true, beleg: "Ablage/Referenz", stand: "JJJJ-MM-TT",
// text: Wortlaut, der gezeigt werden darf (z. B. Deckungssumme nur, wenn die Polizze es hergibt).

export const EIGNUNG_STAND = { iso: "2026-10-11", label: "11.10.2026" };

/** Optionale Nachweise – nur mit belegt:true sichtbar. */
export const NACHWEISE_OPTIONAL = {
  guetesiegel: { titel: "Gütesiegel / Zertifizierungen", belegt: false, beleg: "", stand: null, text: "" },
  haftpflicht: { titel: "Betriebshaftpflichtversicherung", belegt: false, beleg: "", stand: null, text: "" },
  ankoe: { titel: "Eintrag im Auftragnehmerkataster Österreich (ANKÖ)", belegt: false, beleg: "", stand: null, text: "" },
};

/** Nur die belegten optionalen Nachweise (für die Seite). */
export const nachweiseBelegt = () => Object.entries(NACHWEISE_OPTIONAL).filter(([, n]) => n.belegt === true && n.beleg && n.text).map(([id, n]) => ({ id, ...n }));

/**
 * Was eine Gemeinde für die Eignungsprüfung bei der Direktvergabe üblicherweise verlangt
 * (§ 20 Abs. 1 BVergG: Befugnis, Zuverlässigkeit, Leistungsfähigkeit; bei Direktvergabe genügt
 * die Prüfung „zum Zeitpunkt der Leistungserbringung“ in der vom Auftraggeber bestimmten Art).
 * Reine Orientierung, keine Rechtsberatung.
 */
export const EIGNUNG_PRUEFUNG = [
  { id: "befugnis", titel: "Befugnis", text: "Gewerbeberechtigung für das reglementierte Gewerbe Elektrotechnik – prüfbar im GISA (Gewerbeinformationssystem Austria) über die GISA-Zahl.", quelle: "gisa" },
  { id: "zuverlaessigkeit", titel: "Berufliche Zuverlässigkeit", text: "Keine Ausschlussgründe nach § 78 BVergG; Firmenbuchauszug, auf Verlangen Unbedenklichkeitsbescheinigungen von Finanzamt und Sozialversicherung, Auszug aus der Verwaltungsstrafevidenz (LSD-BG).", quelle: "firmenbuch" },
  { id: "leistung", titel: "Technische und finanzielle Leistungsfähigkeit", text: "Referenzen vergleichbarer Anlagen mit Leistung in kWp, Personal und Ausstattung, Versicherungsnachweis – im Umfang, den die Gemeinde festlegt.", quelle: "referenzen" },
];

export const QUELLEN = [
  { label: "GISA – Gewerbeinformationssystem Austria (Abfrage nach GISA-Zahl)", url: "https://www.gisa.gv.at/" },
  { label: "Firmenbuch – Justiz Österreich (Abfrage über Verrechnungsstellen)", url: "https://www.justiz.gv.at/service/firmenbuch.5a8.de.html" },
  { label: "§ 20 BVergG 2018 – Grundsätze des Vergabeverfahrens, Eignung (JUSLINE)", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/20" },
  { label: "§ 78 BVergG 2018 – Ausschlussgründe (JUSLINE)", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/78" },
  { label: "§ 46 BVergG 2018 – Direktvergabe (JUSLINE)", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/46" },
];

const BUNDESLAENDER_AT = ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien"];

/**
 * Ort aus kunden.js → nur eines der 9 Bundesländer. Ortsnamen, Zusätze in Klammern („Werk“,
 * „Firmensitz“) und Angaben nach „;“ fallen weg – zusammen mit Branche und kWp würden sie Kunden
 * ohne Namensfreigabe erkennbar machen.
 */
export function bundeslandAusOrt(ort) {
  const rein = String(ort || "")
    .split(";")[0]
    .replace(/\([^)]*\)/g, "")
    .trim();
  const letzter = rein.split(",").pop().trim();
  if (BUNDESLAENDER_AT.includes(letzter)) return letzter;
  const woerter = rein.split(/[\s,]+/); // alle 9 Bundesländer sind einzelne Wörter
  return BUNDESLAENDER_AT.find((b) => woerter.includes(b)) || "–";
}
