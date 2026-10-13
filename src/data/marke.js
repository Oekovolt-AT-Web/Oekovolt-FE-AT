// src/data/marke.js
//
// Markenkern von Ökovolt Österreich – EINE Quelle für Kern, Claim, Säulen, Tonalität, CTA-Regel
// und Zusagen. Ziel (Welle A, Paket A02): ein Markenkern ohne angreifbare Aussagen.
//
// Regeln:
// - Keine Werbeaussage ohne Eintrag in src/data/werbeaussagen.js (Belegakte, Schalter je Aussage).
// - Keine Eigen-Parkregler-Aussage, solange PARKREGLER_RECHTE_GEKLAERT false ist – bis dahin gilt
//   PARKREGLER_SATZ (Technologiepartner Solensa, parametriert/betreut/gewartet von uns).
// - Zahl vor Adjektiv, Sie-Form, österreichisches Deutsch, kein Superlativ ohne Beleg.
// - Zusagen (ZUSAGEN) erscheinen erst mit freigegeben:true, freigegeben_am und freigegeben_von.
//
// Belege: docs/AT-BRIEFING.md (Unternehmensfakten 09/2026), src/data/mannschaft.js (Ausstattung
// vom Auftraggeber bestätigt), src/lib/site.js (Registerdaten).

import { FIRMA, SCHWESTER } from "@/lib/site";
import { werbeaussageAktiv } from "@/data/werbeaussagen";

/**
 * Nutzungsrechte am Parkregler (Software/Hardware, Entwicklung mit Solensa) sind nicht schriftlich
 * geklärt → die Eigen-Parkregler-Aussage wird nicht verwendet. Auf true setzen, sobald die Rechte belegt
 * sind (Eintrag „eigener-parkregler“ in werbeaussagen.js dann ebenfalls freigeben).
 */
export const PARKREGLER_RECHTE_GEKLAERT = false;

/** Eigene Montageteams, Lkw und Traktoren: vom Auftraggeber bestätigt (src/data/mannschaft.js, [AG]). */
export const AUSSTATTUNG_BESTAETIGT = true;

/** Der Satz über Regelung und Leittechnik – je nach Rechtelage. */
export const PARKREGLER_SATZ = PARKREGLER_RECHTE_GEKLAERT
  ? "Eigener Parkregler, Fernwartung und SCADA – entwickelt mit unserem Technologiepartner Solensa."
  : "Parkregler, Fernwartung und SCADA mit unserem Technologiepartner Solensa – parametriert, betreut und gewartet von uns.";

/** Kurzform für Aufzählungen und Listenpunkte (ohne „eigener“). */
export const PARKREGLER_KURZ = PARKREGLER_RECHTE_GEKLAERT ? "Eigener Parkregler, Fernwartung & SCADA" : "Parkregler, Fernwartung & SCADA – betreut von uns";

export const KERN = "Ökovolt ist der Photovoltaik-Errichter, der selbst betreibt – geplant, gebaut und betreut bis zum Netzanschlusspunkt.";

export const CLAIM = "Wir bauen, was wir selbst betreiben würden.";

/** Claim mit Markenname (Schlusssatz auf /uber-uns, TV-Folie). */
export const CLAIM_MIT_MARKE = `ÖKOVOLT. ${CLAIM}`;

/** Fußzeile (src/components/Reusable/footer.js). */
export const FOOTER_CLAIM = "Photovoltaik für Betriebe in ganz Österreich – geplant, gebaut, betrieben.";

/** Einleitung der Startseite (src/data/hero.js). */
export const LEAD =
  "Seit 2012 planen, bauen und betreuen wir Photovoltaik für Betriebe, Höfe und Gemeinden in ganz Österreich – mit eigenen Montageteams; Parkregler, Fernwartung und SCADA betreuen wir mit unserem Technologiepartner Solensa. Unsere Gründer betreiben selbst Solarparks.";

/**
 * Display-Zeile im Hero der Startseite. Variante B ist Standard; Variante A läuft als Experiment k4
 * (src/lib/experimente.js, inaktiv). Zwei Zeilen = zwei Masken in S01Hero.
 */
export const DISPLAY_ZEILEN = {
  b: ["Wir bauen, was wir", "selbst betreiben würden."],
  a: ["Gebaut von Betreibern.", "Geregelt mit eigener Technik."],
};

/**
 * Drei Säulen. `beleg` verweist auf die Belegakte („werbeaussagen:<id>“) oder auf eine Konstante
 * dieser Datei; `belegHref` ist die Seite, die den Beleg zeigt.
 */
export const SAEULEN = [
  {
    id: "betreiberblick",
    titel: "Betreiberblick seit 2012",
    satz: "Unsere Gründer betreiben selbst Solarparks.",
    belegHref: "/uber-uns#geschichte",
    beleg: "werbeaussagen:gruender-betreiben",
    sichtbar: werbeaussageAktiv("gruender-betreiben"),
  },
  {
    id: "leittechnik",
    titel: "Regelung und Leittechnik",
    satz: PARKREGLER_SATZ,
    belegHref: "/technik/parkregler",
    beleg: PARKREGLER_RECHTE_GEKLAERT ? "werbeaussagen:eigener-parkregler" : "PARKREGLER_SATZ",
    sichtbar: true,
  },
  {
    id: "ausstattung",
    titel: "Eigene Leute und Maschinen",
    satz: "Eigene Montageteams, eigener Lkw, eigene Traktoren.",
    belegHref: "/uber-uns#mannschaft",
    beleg: "AUSSTATTUNG_BESTAETIGT",
    sichtbar: AUSSTATTUNG_BESTAETIGT,
  },
];

/** Nur die Säulen, deren Beleg vorliegt. */
export const SAEULEN_SICHTBAR = SAEULEN.filter((s) => s.sichtbar);

export const TONALITAET = {
  regeln: ["Zahl vor Adjektiv", "Sie-Form", "Österreichisches Deutsch (Jänner, Netzbetreiber, Gemeinde)", "Kein Superlativ ohne Beleg", "Keine Zahl ohne Quelle und Stand"],
  beispiele: {
    gut: "Seit 2012 errichten wir PV-Anlagen in Österreich.",
    schlecht: "Wir sind der führende PV-Errichter Österreichs.",
  },
};

/** Commitment-Leiter: Mikro → Mittel → Makro (A08 nutzt die Stufen für die Formulare). */
export const CTA_REGEL = {
  mikro: "Rechner oder Check in 2 Minuten, ohne Daten",
  mittel: "Lastgang oder Flächendaten hochladen – Auswertung zurück",
  makro: "Termin",
};

/**
 * Zusagen an Kundinnen und Kunden. Erst sichtbar, wenn freigegeben:true UND freigegeben_am/_von
 * gesetzt sind (Inhaber + Rechtsprüfung). Bis dahin nirgends ausspielen.
 */
export const ZUSAGEN = [
  { id: "rechenweg", text: "Sie bekommen den Rechenweg, nicht nur die Amortisationszahl.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
  { id: "vorab-ehrlich", text: "Wir sagen es Ihnen vor dem Angebot, wenn Netz, Statik oder Widmung dagegen sprechen.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
  { id: "ansprechpartner", text: "Ein fester Ansprechpartner von der Planung bis zur Inbetriebnahme.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
  { id: "doku-maschinenlesbar", text: "Regler-Parameter und Anlagendokumentation erhalten Sie maschinenlesbar.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
  { id: "datenhoheit", text: "Ihre Anlagendaten gehören Ihnen.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
  { id: "vorauskasse", text: "Keine große Vorauskasse: Zahlung nach Baufortschritt.", freigegeben: false, freigegeben_am: null, freigegeben_von: null },
];

/** Freigegebene Zusagen – leer, solange niemand freigegeben hat. */
export const ZUSAGEN_FREIGEGEBEN = ZUSAGEN.filter((z) => z.freigegeben === true && z.freigegeben_am && z.freigegeben_von);

/**
 * Kurzprofil für Redaktionen (/presse) – nur Registerdaten und belegte Aussagen, ohne Werbung.
 * Die Gesellschafter stehen neutral („Gesellschafter: …“), die Salzburg AG ist kein Werbeargument.
 */
export const BOILERPLATE = `Die ${FIRMA.name} mit Sitz in ${FIRMA.ort} (${FIRMA.bundesland}) plant, errichtet und betreut seit ${FIRMA.gegruendet} Photovoltaikanlagen in ganz Österreich – für Gewerbe und Industrie, Landwirtschaft, Gemeinden und Energieversorger. ${KERN} ${PARKREGLER_SATZ} Gesellschafter: ${FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(", ")}. Die deutsche Schwestergesellschaft ${SCHWESTER.name} (${SCHWESTER.ort}) ist seit 2010 am Markt.${FIRMA.verbaende.length ? ` Ökovolt ist ${FIRMA.verbaende.map((v) => `${v.status} im ${v.name}`).join(" und ")}.` : ""}`;

/** Kennzahlen-Hinweis in einheitlicher Form: „Angaben Ökovolt Österreich · Stand MM/JJJJ“. */
export const kennzahlenHinweis = (standIso, hinweis = "Angaben Ökovolt Österreich") => {
  const [jahr, monat] = String(standIso || "").split("-");
  return jahr && monat ? `${hinweis} · Stand ${monat}/${jahr}` : hinweis;
};
