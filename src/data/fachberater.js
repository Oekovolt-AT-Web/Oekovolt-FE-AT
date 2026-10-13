// src/data/fachberater.js
//
// Fachberater für die Zielgruppenseiten (Welle A, Paket A03) – nach dem Muster von fachpruefer.js.
//
// GRUNDSATZ: Eine Person erscheint mit Foto und Name NUR, wenn `einwilligung: true` gesetzt ist
// (schriftliche Einwilligung liegt vor, Datum in `einwilligungDatum`) und `name` sowie `rolle`
// ausgefüllt sind. Fehlt eine Bedingung, zeigt src/components/Verkauf/Ansprechpartner.js statt
// der Person die Teamfunktion („Ihr Projektteam Gewerbe & Industrie“) mit der Zentrale aus FIRMA.
//
// Stand 11.10.2026: Startbestand ohne Einwilligung. Die Personen sind dieselben, die der Auftraggeber
// für die Fachprüfung benannt hat (src/data/fachpruefer.js); Rolle, Zielgruppen, Bundesländer,
// Durchwahl und Foto sind offen – nichts davon wird geraten.
//
// PFLEGE:
//   - `id` stabil (Anker, Schema-@id).
//   - `zielgruppen`: gewerbe | landwirtschaft | gemeinde | freiflaeche | tourismus
//   - `bundeslaender`: Kürzel wie in src/data/bundeslaender.js (z. B. "ooe", "sbg") oder leer = alle.
//   - `telefon`: Durchwahl im Format "+43 6278 71030-12"; leer = Zentrale.
//   - `foto`: public/Images/AT/team/<id>.jpg (quadratisch, ≥ 600 px), nur mit Einwilligung.
//   - Widerruf: `einwilligung` auf false setzen und neu deployen.

import { FIRMA } from "@/lib/site";

export const FACHBERATER = [
  { id: "peter-strohbichler", name: "Peter Strohbichler", rolle: "", zielgruppen: [], bundeslaender: [], telefon: "", foto: "", einwilligung: false, einwilligungDatum: "" },
  { id: "ivan-kovacevic", name: "Ivan Kovacevic", rolle: "", zielgruppen: [], bundeslaender: [], telefon: "", foto: "", einwilligung: false, einwilligungDatum: "" },
  { id: "oleg-stein", name: "Oleg Stein", rolle: "", zielgruppen: [], bundeslaender: [], telefon: "", foto: "", einwilligung: false, einwilligungDatum: "" },
];

/** Teamfunktion je Zielgruppe – erscheint, solange keine Person freigegeben ist. */
export const TEAMFUNKTION = {
  gewerbe: "Ihr Projektteam Gewerbe & Industrie",
  landwirtschaft: "Ihr Projektteam Landwirtschaft",
  gemeinde: "Ihr Projektteam Gemeinden & öffentliche Hand",
  freiflaeche: "Ihr Projektteam Freifläche & Agri-PV",
  tourismus: "Ihr Projektteam Hotellerie & Tourismus",
  speicher: "Ihr Projektteam Speicher & Ladeinfrastruktur",
  energiegemeinschaft: "Ihr Projektteam Energiegemeinschaften",
};

/** Thema für /termin?thema=… je Zielgruppe (Kurzformen aus src/data/erreichbarkeit.js). */
export const TERMIN_THEMA = {
  gewerbe: "gewerbe",
  landwirtschaft: "landwirtschaft",
  gemeinde: "gemeinde",
  freiflaeche: "freiflaeche",
  tourismus: "gewerbe",
  speicher: "speicher",
  energiegemeinschaft: "energiegemeinschaft",
};

/** Darf die Person gezeigt werden? Einwilligung UND Name UND Rolle. */
export const istSichtbar = (p) => Boolean(p && p.einwilligung === true && p.name && p.rolle);

/**
 * Fachberater für Zielgruppe und (optional) Bundesland – nur freigegebene Personen, sonst null.
 * Vorrang: passende Zielgruppe und Bundesland, dann passende Zielgruppe ohne Bundeslandangabe.
 */
export function fachberaterFuer(zielgruppe, bundesland) {
  const sichtbar = FACHBERATER.filter(istSichtbar).filter((p) => !zielgruppe || p.zielgruppen.includes(zielgruppe));
  if (!sichtbar.length) return null;
  const bl = String(bundesland || "").toLowerCase();
  return (bl && sichtbar.find((p) => p.bundeslaender.map((b) => String(b).toLowerCase()).includes(bl))) || sichtbar.find((p) => !p.bundeslaender.length) || null;
}

/** Teamfunktion für eine Zielgruppe (Rückfall: „Ihr Projektteam“). */
export const teamfunktion = (zielgruppe) => TEAMFUNKTION[zielgruppe] || "Ihr Projektteam";

/** Zentrale (Telefon, E-Mail) aus FIRMA – für die Karte ohne freigegebene Person. */
export const ZENTRALE = { telefon: FIRMA.telefon, telefonHref: FIRMA.telefonHref, email: FIRMA.email, ort: `${FIRMA.plz} ${FIRMA.ort}` };
