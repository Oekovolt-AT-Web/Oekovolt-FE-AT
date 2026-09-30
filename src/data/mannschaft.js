// src/data/mannschaft.js
//
// „Eigene Mannschaft, eigener Maschinenpark“ – Inhalte für den Abschnitt auf
// /uber-uns (#mannschaft) und den Teaser auf der Startseite.
//
// GRUNDSATZ: Nur belegte Fakten. Jede Aussage hat unten eine Quelle.
//   [AG]   Angabe des Auftraggebers (Ökovolt Österreich), 09/2026:
//          eigener Lkw und eigene Traktoren.
//   [U-10] src/data/unternehmen.js → MEILENSTEINE 2010: eigene Montagegesellschaft
//          (ÖKOVOLT Montage GmbH, Gruppe), „Planung, Bau und Inbetriebnahme aus einer
//          Hand – mit eigenen Montageteams und einem festen Ansprechpartner“.
//   [U-12] src/data/unternehmen.js → MEILENSTEINE 2012: Deutsche Solar & Rammtechnik GmbH
//          (Fundamente, Gesellschaft der GRUPPE – daher „in der Gruppe“);
//          HALTUNG: „Die Gründer betreiben seit 2012 eigene Solarparks“.
//   [U-R]  src/data/unternehmen.js → ROLLEN_AT „Eigene Technik“: eigener EZA-Regler
//          (TOR Erzeuger), eigene Fernwartung, eigene SCADA-Systeme – mit Solensa;
//          ROLLEN_AT „Service“: Wartung, Anlagenprüfung, Drohnen-Thermografie (als
//          LEISTUNG – nicht als „eigene Drohnenpiloten“).
//   [SITE] src/lib/site.js → FIRMA.gewerbe „Elektrotechnik (reglementiertes Gewerbe)“,
//          FIRMA.gisa 17864251.
//   [WKO]  src/app/page.js (Hero) führt das WKO-Gütesiegel „Meisterbetrieb“
//          (public/Images/AT/siegel/wko-gutesiegel-meisterbetrieb.png). „Meisterbetrieb
//          seit 2012“ steht NICHT im Repo – deshalb ohne Jahresangabe.
//
// PFLEGE: Neue Maschinen/Fähigkeiten hier eintragen. Im UI erscheinen NUR Einträge
// mit `bestaetigt: true`. Kandidaten mit `bestaetigt: false` sind vorbereitet und
// werden erst sichtbar, wenn der Auftraggeber sie bestätigt hat (Feld umstellen,
// Quelle im Kommentar ergänzen).

import { FIRMA } from "@/lib/site";

/**
 * Foto für das Bildmodul.
 *
 * SO LEGT DER AUFTRAGGEBER DAS ECHTE FOTO AB:
 *   1. Foto des Ökovolt-Lkw als JPG (Querformat, mind. 1920 px breit, ≤ 450 KB) unter
 *        public/Images/AT/unternehmen/oekovolt-lkw.jpg
 *      speichern. Optional ein Traktor-Foto unter
 *        public/Images/AT/unternehmen/oekovolt-traktor.jpg
 *   2. Keine Kennzeichen, keine fremden Personen ohne Einwilligung im Bild.
 *   3. Eintrag in public/Images/AT/QUELLEN-unternehmen.md ergänzen („Ökovolt, eigenes Material“).
 *   4. Neu bauen/deployen – mehr ist nicht nötig. Die Komponente prüft serverseitig
 *      (fs.existsSync), ob die Datei da ist; fehlt sie, wird automatisch `fallback`
 *      verwendet. Alt-Texte unten bei Bedarf an das tatsächliche Motiv anpassen.
 */
export const MANNSCHAFT_FOTO = {
  lkw: {
    src: "/Images/AT/unternehmen/oekovolt-lkw.jpg",
    alt: "Der Ökovolt-Lkw, mit dem wir Module, Unterkonstruktion und Werkzeug selbst zur Baustelle bringen",
    unterschrift: "Unser eigener Lkw – Material kommt bei Ökovolt mit dem eigenen Fahrzeug.",
    position: "50% 50%",
  },
  traktor: {
    src: "/Images/AT/unternehmen/oekovolt-traktor.jpg",
    alt: "Traktor von Ökovolt im Einsatz auf einer Freifläche",
    unterschrift: "Eigene Traktoren für Arbeiten auf Freiflächen",
    position: "50% 50%",
  },
  // EIGENES Ökovolt-Foto laut public/Images/AT/QUELLEN-home.md („Ökovolt (eigenes Material)“,
  // Standbild aus dem Ökovolt-Imagevideo public/Images/Navbar/intro.mp4, Sek. 11).
  // ACHTUNG Motiv: Die zwei weißen Sattelzüge am linken Bildrand gehören dem Kunden, NICHT
  // Ökovolt. Deshalb wird der Ausschnitt nach rechts verschoben (zoom/origin) und der linke
  // Rand liegt unter dem Navy-Verlauf – das Bild darf nicht als „unser Lkw“ gelesen werden.
  fallback: {
    src: "/Images/AT/home/hero-gewerbedach-luftbild.jpg",
    alt: "Ökovolt-Baustelle aus der Luft: Monteure verlegen Photovoltaikmodule auf dem Flachdach einer Industriehalle",
    unterschrift: "Ökovolt-Baustelle: Modulmontage auf einem Industriedach",
    position: "85% 50%",
    zoom: 1.35,
    origin: "100% 50%",
    // Startseiten-Teaser: enger Ausschnitt der Montagefläche (Hero zeigt dasselbe Foto weit)
    teaserPosition: "62% 50%",
    teaserZoom: 1.6,
    teaserOrigin: "70% 48%",
  },
};

/**
 * Maschinen, Mannschaft und Fähigkeiten.
 * `bestaetigt: true`  → belegt, wird angezeigt.
 * `bestaetigt: false` → NICHT anzeigen – vom Auftraggeber bestätigen.
 * `icon`: Name eines lucide-react-Icons (Auflösung in src/components/Mannschaft/icons.js).
 */
export const AUSSTATTUNG = [
  { id: "lkw", kurz: "Eigener Lkw", text: "Transport von Material und Werkzeug", icon: "Truck", bestaetigt: true }, // [AG]
  { id: "traktoren", kurz: "Eigene Traktoren", text: "Für Arbeiten auf Freiflächen", icon: "Tractor", bestaetigt: true }, // [AG]
  { id: "montage", kurz: "Eigene Montageteams", text: "Montage aus einer Hand", icon: "HardHat", bestaetigt: true }, // [U-10]
  { id: "ramm", kurz: "Rammtechnik in der Gruppe", text: "Deutsche Solar & Rammtechnik GmbH", icon: "Pickaxe", bestaetigt: true }, // [U-12]
  { id: "parkregler", kurz: "Eigener Parkregler", text: "EZA-Regler nach TOR Erzeuger", icon: "SlidersHorizontal", bestaetigt: true }, // [U-R]
  { id: "scada", kurz: "Eigene Fernwartung & SCADA", text: "Mit unserem Partner Solensa", icon: "MonitorDot", bestaetigt: true }, // [U-R]
  { id: "fachbetrieb", kurz: "Elektrotechnik-Fachbetrieb", text: `Reglementiertes Gewerbe, GISA ${FIRMA.gisa}`, icon: "BadgeCheck", bestaetigt: true }, // [SITE]
  { id: "meister", kurz: "Meisterbetrieb", text: "WKO-Gütesiegel", icon: "Award", bestaetigt: true }, // [WKO] – ohne „seit 2012“ (nicht belegt)

  // ---- Kandidaten: vom Auftraggeber bestätigen, bis dahin unsichtbar ----
  { id: "lager", kurz: "Eigenes Lager", text: "Material vorrätig in Ostermiething", icon: "Warehouse", bestaetigt: false }, // vom Auftraggeber bestätigen
  { id: "stapler", kurz: "Eigene Stapler", text: "Be- und Entladen ohne Fremdgerät", icon: "Forklift", bestaetigt: false }, // vom Auftraggeber bestätigen
  { id: "hebetechnik", kurz: "Kran & Hebebühnen", text: "Module sicher aufs Dach", icon: "Construction", bestaetigt: false }, // vom Auftraggeber bestätigen
  { id: "drohnen", kurz: "Eigene Drohnenpiloten", text: "Thermografie mit eigenem Personal", icon: "ScanSearch", bestaetigt: false }, // vom Auftraggeber bestätigen – bisher nur „Drohnen-Thermografie“ als Leistung belegt
  { id: "mitarbeitende", kurz: "Mitarbeitende", text: null, wert: null, icon: "Users", bestaetigt: false }, // vom Auftraggeber bestätigen – Anzahl liegt nicht freigegeben vor (vgl. HEUTE in unternehmen.js)
  { id: "fahrzeuge", kurz: "Fahrzeugflotte", text: null, wert: null, icon: "Car", bestaetigt: false }, // vom Auftraggeber bestätigen – Anzahl Fahrzeuge nicht belegt
];

/** Nur bestätigte Einträge – das UI verwendet ausschließlich diese Liste. */
export const AUSSTATTUNG_BESTAETIGT = AUSSTATTUNG.filter((a) => a.bestaetigt === true);

/** Kopftexte des Abschnitts (eigene Formulierungen). */
export const MANNSCHAFT = {
  anker: "mannschaft",
  eyebrow: "Eigene Mannschaft · eigener Maschinenpark",
  // Überschrift wird in der Komponente dreiteilig gesetzt (letzter Teil mit Verlauf).
  titel: ["Unsere Leute.", "Unsere Fahrzeuge.", "Unsere Technik."],
  lead:
    "Planung, Bau und Inbetriebnahme kommen bei Ökovolt aus einer Hand. Material bringt unser eigener Lkw, auf Freiflächen arbeiten unsere eigenen Traktoren, montiert wird von eigenen Teams – und am Netzanschluss wie im Betrieb setzen wir Technik ein, die wir selbst entwickelt haben.",
  // Teaser Startseite: genau zwei Sätze.
  teaser:
    "Material bringt unser eigener Lkw, auf Freiflächen fahren unsere eigenen Traktoren, montiert wird von eigenen Teams. Parkregler, Fernwartung und SCADA entwickeln wir selbst – Sie haben vom ersten Plan bis zum Betrieb einen festen Ansprechpartner.",
};

/**
 * „Vom Hof bis zum Netzanschluss“ – Stationen, an denen Ökovolt eigene Leute,
 * Fahrzeuge oder Technik einsetzt. `eigen` = was davon uns gehört, `nutzen` = was
 * Sie davon haben. Quellen je Station im Kommentar.
 */
export const STATIONEN = [
  {
    id: "planung",
    titel: "Planung",
    eigen: "Aus einer Hand",
    icon: "DraftingCompass",
    nutzen: "Planung, Bau und Inbetriebnahme liegen bei uns. Sie erklären Ihr Projekt einmal – nicht jedem Gewerk neu.",
  }, // [U-10]
  {
    id: "transport",
    titel: "Transport",
    eigen: "Eigener Lkw",
    icon: "Truck",
    nutzen: "Module, Unterkonstruktion und Werkzeug fahren wir selbst an. Die Anlieferung hängt nicht allein an fremden Transportterminen.",
  }, // [AG]
  {
    id: "gelaende",
    titel: "Gelände & Freifläche",
    eigen: "Eigene Traktoren · Rammtechnik in der Gruppe",
    icon: "Tractor",
    nutzen: "Auf Freiflächen arbeiten wir mit eigenen Traktoren. Für Rammfundamente hat die Gruppe eine eigene Gesellschaft: die Deutsche Solar & Rammtechnik GmbH.",
  }, // [AG], [U-12]
  {
    id: "montage",
    titel: "Montage",
    eigen: "Eigene Montageteams",
    icon: "HardHat",
    nutzen: "Montage und Elektroinstallation durch eigene Teams im Elektrotechnik-Fachbetrieb – mit einem festen Ansprechpartner für Sie.",
  }, // [U-10], [SITE]
  {
    id: "netz",
    titel: "Netzanschluss",
    eigen: "Eigener Parkregler",
    icon: "PlugZap",
    nutzen: "Unser selbst entwickelter EZA-Regler setzt die Vorgaben des Netzbetreibers und der TOR Erzeuger am Netzanschlusspunkt um.",
  }, // [U-R]
  {
    id: "betrieb",
    titel: "Betrieb & Service",
    eigen: "Eigene Fernwartung & SCADA",
    icon: "MonitorDot",
    nutzen: "Fernwartung und SCADA aus eigener Entwicklung, gemeinsam mit Solensa. Dazu Wartung, Prüfung und Drohnen-Thermografie als Service.",
  }, // [U-R]
];

/** „Was das für Ihr Projekt bedeutet“ – Nutzen ohne unbelegte Zahlen. */
export const NUTZEN = [
  {
    id: "termine",
    titel: "Termine, die wir selbst in der Hand haben",
    icon: "CalendarCheck2",
    text: "Lkw, Traktoren und Montageteams gehören zum eigenen Betrieb. Ihr Bauzeitplan hängt dadurch an weniger fremden Kalendern.",
  }, // [AG], [U-10]
  {
    id: "ansprechpartner",
    titel: "Ein Ansprechpartner statt vieler Schnittstellen",
    icon: "UserRoundCheck",
    text: "Ein fester Ansprechpartner begleitet Ihr Projekt von der Planung bis zur Inbetriebnahme. Weniger Übergaben heißt weniger Stellen, an denen Informationen verloren gehen.",
  }, // [U-10]
  {
    id: "lebensdauer",
    titel: "Verantwortung über die ganze Lebensdauer",
    icon: "ShieldCheck",
    text: "Die Gründer betreiben seit 2012 eigene Solarparks. Wir bauen deshalb, was wir selbst betreiben würden – und bleiben mit Fernwartung, SCADA und Service an Ihrer Seite.",
  }, // [U-12] HALTUNG, [U-R]
];
