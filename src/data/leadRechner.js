// src/data/leadRechner.js
//
// EINZIGE Liste der Lead-Gate-Kennungen (Welle A, Paket A09). Jede Gate-Anfrage an /api/rechner_lead
// muss eine Kennung aus dieser Liste tragen – unbekannte Kennungen lehnt die Route mit 422 ab.
// Neue Werkzeuge hier eintragen (Paket B03 und Folgewellen ergänzen die Liste), nie im Formular frei wählen.
//
// Lead-Gate-Regel des Inhabers (11.10.2026):
//   Stufe 1  Rechner mit Bildschirm-Ergebnis: Ergebnis frei, Download/Export/PDF/Druck/Link nur nach dem Gate.
//   Stufe 2  Individuelle Auswertungen eigener Daten: Die Auswertung startet erst nach dem Gate.
//   Statische Inhalte (Checklisten, Muster-LV, Beispiel-CSV, Ratgeber, Förderlisten) sind frei und stehen
//   deshalb bewusst NICHT in dieser Liste (z. B. Netzanmeldung-Checkliste, Gemeinderat-Checkliste).
//
// Felder: kennung (^[a-z0-9-]{2,40}$), name (Anzeigename in Mail und Backoffice), segment (Schlüssel aus SEGMENTE),
// stufe (1 | 2), pfad (Werkzeugseite, Rückkehrziel ohne eigene Angabe).
// Reine Daten, ohne Browser- oder Node-Abhängigkeiten (auch in scripts/*.test.mjs nutzbar).

/** Segmente – Schlüssel für die Website, Wert = Auswahlwert im Backoffice (Feld „segment“, Paket A11). */
export const SEGMENTE = {
  gewerbe: "Gewerbe & Industrie",
  landwirtschaft: "Landwirtschaft",
  freiflaeche: "Freifläche/Agri-PV",
  gemeinde: "Gemeinde & öffentliche Hand",
  privat: "Privat",
  service: "Service",
  sonstiges: "Sonstiges",
};

/** Erlaubte Aktionen am Gate (Statistik, Backoffice-Notiz, Texte im Dialog). */
export const GATE_AKTIONEN = ["pdf", "download", "export", "link", "auswertung", "senden"];

export const LEAD_RECHNER = [
  // ── Stufe 1: Rechner mit Bildschirm-Ergebnis (Export, PDF, Link nach dem Gate)
  { kennung: "gewerbe-pv", name: "Gewerbe-PV-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/gewerbe-pv" },
  { kennung: "peak-shaving", name: "Peak-Shaving-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/peak-shaving" },
  { kennung: "co2-esg", name: "CO₂- & ESG-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/co2-esg" },
  { kennung: "energiegemeinschaft", name: "Energiegemeinschafts-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/energiegemeinschaft" },
  { kennung: "e-flotte", name: "E-Flotte-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/e-flotte" },
  { kennung: "blackout", name: "Blackout-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/blackout" },
  { kennung: "ladeinfrastruktur", name: "Ladeinfrastruktur-Planer", segment: "gewerbe", stufe: 1, pfad: "/rechner/ladeinfrastruktur" },
  { kennung: "freiflaeche-pacht", name: "Freiflächen- & Pacht-Rechner", segment: "landwirtschaft", stufe: 1, pfad: "/rechner/freiflaeche-pacht" },
  { kennung: "agri-pv", name: "Agri-PV-Rechner", segment: "landwirtschaft", stufe: 1, pfad: "/agri-pv" },
  { kennung: "finanzierung", name: "Finanzierungsvergleich", segment: "gewerbe", stufe: 1, pfad: "/rechner/finanzierung" },
  { kennung: "investitionsantrag", name: "Investitionsantrag", segment: "gewerbe", stufe: 1, pfad: "/rechner/investitionsantrag" },
  { kennung: "peer-to-peer", name: "Peer-to-Peer-Rechner", segment: "gewerbe", stufe: 1, pfad: "/rechner/peer-to-peer" },
  { kennung: "fachplaner-paket", name: "Fachplaner-Paket Parkregler", segment: "gewerbe", stufe: 1, pfad: "/technik/parkregler/datenblatt" },
  { kennung: "solarrechner", name: "Solarrechner", segment: "privat", stufe: 1, pfad: "/solarrechner" },
  { kennung: "stromspeicher", name: "Stromspeicher-Rechner", segment: "privat", stufe: 1, pfad: "/rechner/stromspeicher" },
  { kennung: "standort-check", name: "Standort-Check", segment: "sonstiges", stufe: 1, pfad: "/standort-check" },
  { kennung: "foerdercheck", name: "Förder-Check", segment: "sonstiges", stufe: 1, pfad: "/foerdercheck" },
  { kennung: "gemeinderat-vorlage", name: "Amtsvortrag für den Gemeinderat", segment: "gemeinde", stufe: 1, pfad: "/kommunen/vergabe-foerderung" },
  { kennung: "liegenschafts-check", name: "Liegenschafts-Check", segment: "gemeinde", stufe: 1, pfad: "/kommunen/vergabe-foerderung" },

  // ── Stufe 2: Auswertung eigener Daten erst nach dem Gate (vorher nur gekennzeichnete Beispielvorschau)
  { kennung: "lastgang-analyse", name: "Lastgang-Analyse", segment: "gewerbe", stufe: 2, pfad: "/lastgang-analyse" },
  { kennung: "lastgang-zwilling", name: "Energie-Zwilling (Lastgang 2.0)", segment: "gewerbe", stufe: 2, pfad: "/lastgang-analyse" },
  { kennung: "hallendach-planer", name: "Hallendach-Planer", segment: "gewerbe", stufe: 2, pfad: "/rechner/gewerbe-pv" },
  { kennung: "dossier", name: "Business-Case-Dossier", segment: "gewerbe", stufe: 2, pfad: "/rechner/investitionsantrag" },
  { kennung: "anlagen-check", name: "Anlagen-Check", segment: "service", stufe: 2, pfad: "/service/anlagen-check" },
  { kennung: "angebot-pruefen", name: "Angebots-Zweitmeinung", segment: "sonstiges", stufe: 2, pfad: "/angebot-pruefen" },
];

const NACH_KENNUNG = new Map(LEAD_RECHNER.map((r) => [r.kennung, r]));

/** Alle bekannten Kennungen (Whitelist der API-Route). */
export const LEAD_KENNUNGEN = LEAD_RECHNER.map((r) => r.kennung);

/** Format jeder Kennung (gleich wie RECHNER_NAMEN im Backoffice, Paket A11). */
export const KENNUNG_FORMAT = /^[a-z0-9-]{2,40}$/;

/** Eintrag zu einer Kennung oder null. */
export function leadRechner(kennung) {
  return NACH_KENNUNG.get(String(kennung ?? "")) || null;
}

/** true, wenn die Kennung in der Liste steht. */
export const istLeadKennung = (kennung) => NACH_KENNUNG.has(String(kennung ?? ""));

/** Segment-Schlüssel einer Kennung („sonstiges“, wenn unbekannt). */
export const segmentFuer = (kennung) => leadRechner(kennung)?.segment || "sonstiges";

/** Stufe einer Kennung (1 = Export nach Gate, 2 = Auswertung nach Gate); unbekannt → 0. */
export const stufeFuer = (kennung) => leadRechner(kennung)?.stufe || 0;
