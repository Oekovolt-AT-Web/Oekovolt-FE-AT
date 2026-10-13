// src/lib/rechnerLead.js
//
// Prüfregeln des Lead-Gates (Welle A, Paket A09) – EINE Quelle für Dialog (Browser) und API-Route
// (/api/rechner_lead). Reine Funktionen ohne Browser- oder Node-Abhängigkeiten (auch in Tests nutzbar).
//
// Entkopplung (Art. 7 Abs. 4 DSGVO, § 174 TKG 2021):
//  - Pflicht sind nur Vorname, Nachname und E-Mail. Begründung (Info-Text „leadgate-info“): Zustellung des
//    Ergebnis-Links und Zuordnung von Rückfragen – Art. 6 Abs. 1 lit. b DSGVO.
//  - Telefon ist optional, erscheint erst nach dem freiwilligen Häkchen „kontakt_ok“ und wird nur geprüft,
//    wenn es ausgefüllt ist. Ohne Häkchen wird eine Nummer verworfen (keine Anrufe ohne Einwilligung).
//  - Es gibt KEINE Pflicht-Einwilligung; das alte Feld „einwilligung“ ist nicht mehr nötig.

import { GATE_AKTIONEN, SEGMENTE, istLeadKennung, leadRechner, segmentFuer } from "@/data/leadRechner";
import { rollenBereinigen } from "@/data/argumentarien";
import { einwilligungPruefen } from "@/lib/einwilligungen";
import { telefonNormalisieren } from "@/data/erreichbarkeit";

/** Pflichtfelder – mehr nicht. */
export const PFLICHTFELDER = ["vorname", "nachname", "email"];

/**
 * Honigtopf: Feldname ohne Bedeutung, damit Ausfüll-Hilfen ihn nicht befüllen (autocomplete="off",
 * tabIndex -1, unsichtbar). Die Übergangs-Gates anderer Pakete senden noch „website“ – beides gilt.
 */
export const HONIGTOPF = "hp_feld_7";
export const HONIGTOPF_ALT = ["website", "firmenkuerzel"];

/** Optionale Angabe „Ihre Funktion“ (Backoffice-Feld „rolle“). */
export const LEAD_ROLLEN = ["Geschäftsführung", "Finanzen/CFO", "Technik/Facility", "Einkauf", "Nachhaltigkeit/ESG", "Gemeinde/Verwaltung", "Privat", "Sonstiges"];

export const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PLZ_AT = /^\d{4}$/;
const NAME_MUSTER = /^[\p{L}][\p{L}\p{M}' .-]*$/u;

export const MELDUNGEN = {
  vorname: "Bitte Vornamen angeben.",
  nachname: "Bitte Nachnamen angeben.",
  name: "Bitte nur Buchstaben, Leerzeichen, Bindestrich oder Apostroph verwenden.",
  email: "Bitte eine gültige E-Mail-Adresse angeben.",
  telefon: "Bitte eine Telefonnummer aus Österreich, Deutschland oder der Schweiz angeben – oder das Feld leer lassen.",
  plz: "Bitte eine vierstellige österreichische Postleitzahl angeben – oder das Feld leer lassen.",
  kennung: "Dieses Werkzeug ist für den Versand nicht freigegeben.",
};

/** String säubern: Steuerzeichen raus, trimmen, Länge begrenzen. */
export function text(wert, max = 200) {
  return String(wert ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/** Interner Pfad (Rückkehrziel, Quelle): nur „/…“, keine fremde Domain, keine Steuerzeichen. */
export function pfadSicher(wert, max = 400) {
  let p = text(wert, max);
  // Volle URL (Übergangs-Gates senden origin + Pfad): nur Pfad, Suche und Anker übernehmen – die Domain
  // setzt immer der Server (BASE_URL), nie das Formular.
  if (/^https?:\/\//i.test(p)) {
    try {
      const u = new URL(p);
      p = `${u.pathname}${u.search}${u.hash}`;
    } catch {
      return "";
    }
  }
  if (!p.startsWith("/") || p.startsWith("//") || p.startsWith("/\\") || /[\s<>"']/.test(p)) return "";
  return p;
}

/**
 * Ergebnis-Kennzahlen (kontext.ergebnis): höchstens 30 Einträge mit einfachen Werten.
 * Keine verschachtelten Objekte, keine Rohdateien – nur Zahlen und kurze Texte.
 */
export function ergebnisBereinigen(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return {};
  const aus = {};
  for (const [k, v] of Object.entries(roh).slice(0, 30)) {
    const schluessel = text(k, 60);
    if (!schluessel) continue;
    if (typeof v === "number" && Number.isFinite(v)) aus[schluessel] = v;
    else if (typeof v === "boolean") aus[schluessel] = v;
    else if (typeof v === "string" && v.trim()) aus[schluessel] = text(v, 200);
    else if (Array.isArray(v) && v.length <= 24 && v.every((x) => typeof x === "number" && Number.isFinite(x))) aus[schluessel] = v;
  }
  return aus;
}

/** Telefon prüfen: leer → "" (ok); sonst E.164 oder null (ungültig). */
export function telefonPruefen(roh) {
  const t = text(roh, 40);
  if (!t) return "";
  if (t.replace(/\D/g, "").length < 6) return null;
  return telefonNormalisieren(t);
}

/**
 * Prüft die Felder des Gate-Formulars (Browser und Server).
 * @param {object} roh  Formularwerte
 * @returns {{ ok: boolean, fehler: Record<string,string> }}
 */
export function formularPruefen(roh = {}) {
  const fehler = {};
  const vorname = text(roh.vorname, 60);
  const nachname = text(roh.nachname, 60);
  if (!vorname) fehler.vorname = MELDUNGEN.vorname;
  else if (!NAME_MUSTER.test(vorname)) fehler.vorname = MELDUNGEN.name;
  if (!nachname) fehler.nachname = MELDUNGEN.nachname;
  else if (!NAME_MUSTER.test(nachname)) fehler.nachname = MELDUNGEN.name;
  const email = text(roh.email, 120);
  if (!EMAIL_MUSTER.test(email)) fehler.email = MELDUNGEN.email;
  const kontakt = roh.kontakt_ok === 1 || roh.kontakt_ok === true || roh.kontakt_ok === "1";
  if (kontakt && telefonPruefen(roh.telefon) === null) fehler.telefon = MELDUNGEN.telefon;
  const plz = text(roh.plz, 10);
  if (plz && !PLZ_AT.test(plz)) fehler.plz = MELDUNGEN.plz;
  return { ok: Object.keys(fehler).length === 0, fehler };
}

/**
 * Vollständige Prüfung einer Gate-Anfrage (API-Route).
 * @returns {{ ok: boolean, code?: "kennung"|"validierung", fehler: Record<string,string>, daten?: object }}
 */
export function rechnerLeadPruefen(roh = {}) {
  const kennung = text(roh.kennung ?? roh.rechner, 40);
  if (!istLeadKennung(kennung)) return { ok: false, code: "kennung", fehler: { kennung: MELDUNGEN.kennung } };

  const f = formularPruefen(roh);
  if (!f.ok) return { ok: false, code: "validierung", fehler: f.fehler };

  const eintrag = leadRechner(kennung);
  const kontakt = roh.kontakt_ok === 1 || roh.kontakt_ok === true || roh.kontakt_ok === "1";
  const telefon = kontakt ? telefonPruefen(roh.telefon) || "" : "";
  const segmentRoh = text(roh.segment, 30);
  const segment = Object.hasOwn(SEGMENTE, segmentRoh) ? segmentRoh : segmentFuer(kennung);
  const rolle = LEAD_ROLLEN.includes(text(roh.rolle, 40)) ? text(roh.rolle, 40) : "";
  const aktion = GATE_AKTIONEN.includes(text(roh.aktion, 20)) ? text(roh.aktion, 20) : eintrag.stufe === 2 ? "auswertung" : "export";
  // Info-Text ist immer „leadgate-info“; die Version kommt aus dem Formular (Protokoll), sonst aktuelle.
  const info = einwilligungPruefen("leadgate-info", roh.einwilligung_version);
  const kontaktText = kontakt ? einwilligungPruefen("leadgate-kontakt", roh.kontakt_version) : { einwilligung_id: "", einwilligung_version: "" };

  return {
    ok: true,
    fehler: {},
    daten: {
      kennung,
      rechner_name: eintrag.name,
      stufe: eintrag.stufe,
      aktion,
      vorname: text(roh.vorname, 60),
      nachname: text(roh.nachname, 60),
      email: text(roh.email, 120).toLowerCase(),
      telefon,
      kontakt_ok: kontakt ? 1 : 0,
      plz: text(roh.plz, 10),
      firma: text(roh.firma, 140),
      segment,
      segment_name: SEGMENTE[segment],
      rolle,
      mappe_rollen: rollenBereinigen(roh.mappe_rollen),
      einwilligung_id: info.einwilligung_id,
      einwilligung_version: info.einwilligung_version,
      kontakt_einwilligung_id: kontaktText.einwilligung_id,
      kontakt_einwilligung_version: kontaktText.einwilligung_version,
      quelle: pfadSicher(roh.quelle, 200) || eintrag.pfad,
      rueckkehr: pfadSicher(roh.rueckkehr) || eintrag.pfad,
      ergebnis: ergebnisBereinigen(roh.ergebnis),
    },
  };
}

/** true, wenn ein Honigtopf-Feld befüllt ist (Bot). */
export const honigtopfGefuellt = (roh = {}) => [HONIGTOPF, ...HONIGTOPF_ALT].some((k) => text(roh[k], 200) !== "");
