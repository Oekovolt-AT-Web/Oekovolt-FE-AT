// src/lib/einwilligungen.js
//
// Versionierte Hinweis- und Einwilligungstexte für alle Formulare der Website (Welle A, Paket A08).
// EINE Quelle für Konfigurator (/angebot), Kontaktformular, Terminbuchung, Rückruf-Widget und das
// Lead-Gate (A09). Jede Anfrage sendet `einwilligung_id` und `einwilligung_version` mit, damit im
// Backoffice nachvollziehbar bleibt, welcher Text zum Zeitpunkt der Anfrage angezeigt wurde
// (Rechenschaftspflicht Art. 5 Abs. 2 DSGVO).
//
// Zwei Arten:
//   "info"          Informationstext zur Verarbeitung auf Grundlage Art. 6 Abs. 1 lit. b DSGVO
//                   (Anfrage bearbeiten, Ergebnis zustellen). KEINE Checkbox – wird nur angezeigt.
//   "einwilligung"  Freiwillige, nicht vorangekreuzte Checkbox (Art. 6 Abs. 1 lit. a DSGVO,
//                   § 174 TKG 2021 für Anrufe). Niemals Bedingung für das Absenden (Kopplungsverbot
//                   Art. 7 Abs. 4 DSGVO). Jederzeit widerrufbar.
//
// Text ändern = Version erhöhen und `stand` setzen. Alte Versionen bleiben als Protokoll in
// VERSIONSPROTOKOLL erhalten. Alle Texte nennen den vollen Firmenwortlaut aus FIRMA.name.
// Reine Daten, ohne Browser- oder Node-Abhängigkeiten (auch in scripts/*.test.mjs nutzbar).

import { FIRMA } from "@/lib/site";

const LIT_B = "Art. 6 Abs. 1 lit. b DSGVO";
const LIT_A = "Art. 6 Abs. 1 lit. a DSGVO";
const TKG = "§ 174 TKG 2021";

export const EINWILLIGUNGEN_STAND = "2026-10-11";

/** Alle Texte nach id. Felder: id, version, art, rechtsgrundlage, text, link, stand. */
export const EINWILLIGUNGEN = {
  // Kontaktformular /kontakt – Hinweis statt Pflicht-Checkbox, kein AGB-Bezug
  "kontakt-info": {
    id: "kontakt-info",
    version: 1,
    art: "info",
    rechtsgrundlage: LIT_B,
    text: `Die ${FIRMA.name} verwendet Ihre Angaben nur, um Ihre Nachricht zu beantworten und Rückfragen zu klären (${LIT_B}). Keine Weitergabe an Dritte, kein Newsletter.`,
    link: "/datenschutz#anfragen",
    stand: "2026-10-11",
  },
  // Angebots-Konfigurator /angebot – Hinweis statt Pflicht-Checkbox, Telefon optional
  "konfigurator-info": {
    id: "konfigurator-info",
    version: 1,
    art: "info",
    rechtsgrundlage: LIT_B,
    text: `Die ${FIRMA.name} verwendet Ihre Angaben nur, um Ihre Anfrage zu bearbeiten, Ihnen eine Einschätzung bzw. ein Angebot zu erstellen und Rückfragen dazu zu beantworten (${LIT_B}). Keine Weitergabe an Dritte, kein Newsletter.`,
    link: "/datenschutz#anfragen",
    stand: "2026-10-11",
  },
  // Terminbuchung /termin – Hinweis statt Pflicht-Checkbox
  "termin-info": {
    id: "termin-info",
    version: 1,
    art: "info",
    rechtsgrundlage: LIT_B,
    text: `Die ${FIRMA.name} verwendet Ihre Angaben nur, um den gewählten Beratungstermin zu bestätigen, durchzuführen und bei Bedarf zu verschieben (${LIT_B}). Bei einer telefonischen Beratung rufen wir Sie zum vereinbarten Zeitpunkt unter der angegebenen Nummer an.`,
    link: "/datenschutz#rueckruf",
    stand: "2026-10-11",
  },
  // Rückruf-Widget und optionales Häkchen „telefonisch kontaktiert werden“ – echte Einwilligung
  "rueckruf-anruf": {
    id: "rueckruf-anruf",
    version: 1,
    art: "einwilligung",
    rechtsgrundlage: `${LIT_A}, ${TKG}`,
    text: `Die ${FIRMA.name} darf mich unter der angegebenen Nummer zu meiner Anfrage anrufen (${LIT_A}, ${TKG}). Freiwillig und jederzeit widerrufbar, etwa per E-Mail an ${FIRMA.email}.`,
    link: "/datenschutz#rueckruf",
    stand: "2026-10-11",
  },
  // Lead-Gate (A09): Zustellung des Ergebnis-Links – Hinweis, keine Checkbox
  "leadgate-info": {
    id: "leadgate-info",
    version: 1,
    art: "info",
    rechtsgrundlage: LIT_B,
    text: `Die ${FIRMA.name} sendet Ihnen den Link zu Ihrem Ergebnis an diese Adresse und beantwortet Rückfragen zu diesem Ergebnis (${LIT_B}). Kein Newsletter.`,
    link: "/datenschutz#rechner-export",
    stand: "2026-10-11",
  },
  // Lead-Gate (A09): optionale Kontaktaufnahme – Einwilligung, nicht vorangekreuzt
  "leadgate-kontakt": {
    id: "leadgate-kontakt",
    version: 1,
    art: "einwilligung",
    rechtsgrundlage: `${LIT_A}, ${TKG}`,
    text: `Die ${FIRMA.name} darf mich zu diesem Ergebnis kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch (${LIT_A}, ${TKG}). Freiwillig und jederzeit widerrufbar.`,
    link: "/datenschutz#rechner-export",
    stand: "2026-10-11",
  },
};

/** Alle bekannten Kennungen (für Whitelists in den API-Routen). */
export const EINWILLIGUNG_IDS = Object.keys(EINWILLIGUNGEN);

/** Frühere Fassungen (Protokoll). Beim Erhöhen einer Version den alten Text hier eintragen. */
export const VERSIONSPROTOKOLL = [];

/** Eintrag nach id oder null. */
export const einwilligung = (id) => EINWILLIGUNGEN[id] || null;

/** Nur der Text (leer bei unbekannter id). */
export const einwilligungText = (id) => einwilligung(id)?.text || "";

/**
 * Felder zum Mitsenden mit einer Anfrage: { einwilligung_id, einwilligung_version }.
 * Unbekannte id → leere Strings (die API-Routen lassen sie weg).
 */
export function einwilligungFelder(id) {
  const e = einwilligung(id);
  return { einwilligung_id: e ? e.id : "", einwilligung_version: e ? String(e.version) : "" };
}

/** Textzeile für Nachrichten an Backends ohne eigene Felder, z. B. „Rechtsgrundlage: … (Hinweistext konfigurator-info v1)“. */
export function einwilligungZeile(id, { angekreuzt } = {}) {
  const e = einwilligung(id);
  if (!e) return "";
  if (e.art === "info") return `Rechtsgrundlage: ${e.rechtsgrundlage} – Hinweistext ${e.id} v${e.version} angezeigt, keine Einwilligungs-Checkbox`;
  return `Einwilligung ${e.id} v${e.version} (${e.rechtsgrundlage}): ${angekreuzt ? "erteilt" : "nicht erteilt"}`;
}

/**
 * Prüft eine Kennung samt Version, wie sie ein Formular mitsendet (für API-Routen).
 * Rückgabe: { einwilligung_id, einwilligung_version } mit bekannten Werten, sonst leere Strings.
 */
export function einwilligungPruefen(idRoh, versionRoh) {
  const id = String(idRoh ?? "").trim().slice(0, 40);
  const e = einwilligung(id);
  if (!e) return { einwilligung_id: "", einwilligung_version: "" };
  const v = String(versionRoh ?? "").trim().slice(0, 8);
  // Unbekannte oder fehlende Version → aktuelle Version (Text ist derselbe wie heute angezeigt)
  const bekannt = /^\d{1,4}$/.test(v) && (Number(v) === e.version || VERSIONSPROTOKOLL.some((p) => p.id === id && p.version === Number(v)));
  return { einwilligung_id: id, einwilligung_version: bekannt ? v : String(e.version) };
}
