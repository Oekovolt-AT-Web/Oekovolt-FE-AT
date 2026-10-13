// src/lib/api/contact/create_contact.js
//
// Kontakt-API aus Sicht des Browsers (submitContact → /api/create_contact) und – weil im Browser
// wie auf dem Server importierbar – die gemeinsamen PRÜFREGELN für Kontaktdaten aller Formulare
// (Kontaktformular, Konfigurator, Terminbuchung, Rückruf) sowie die Whitelist der strukturierten
// Zusatzfelder, die /api/create_contact an das Backoffice durchreicht (Welle A, Paket A08).
//
// Regel (QA-Welle 1): Telefonnummern überall über telefonNormalisieren (AT/DE/CH, E.164),
// E-Mail und PLZ überall mit denselben Mustern – kein Formular prüft mehr „lockerer“ als ein anderes.

import { telefonNormalisieren } from "@/data/erreichbarkeit";
import { einwilligungPruefen } from "@/lib/einwilligungen";

/* ------------------------------------------------------------------ Prüfregeln */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Österreich 4-stellig, Nachbarländer 5-stellig */
export const PLZ_REGEX = /^\d{4,5}$/;

export const istEmail = (wert) => EMAIL_REGEX.test(String(wert ?? "").trim());
export const istPlz = (wert) => PLZ_REGEX.test(String(wert ?? "").trim());

/**
 * Telefonnummer prüfen: { leer, ok, e164 }.
 * ok = leer (bei optionalem Feld erlaubt) ODER gültige AT/DE/CH-Nummer. '------' ist keine Nummer.
 */
export function telefonPruefen(wert) {
  const roh = String(wert ?? "").trim();
  if (!roh) return { leer: true, ok: true, e164: "" };
  const e164 = telefonNormalisieren(roh);
  return { leer: false, ok: Boolean(e164), e164: e164 || "" };
}

export const TELEFON_FEHLER = "Bitte eine gültige österreichische, deutsche oder Schweizer Rufnummer angeben – oder das Feld leer lassen.";
export const TELEFON_PFLICHT_FEHLER = "Bitte eine gültige österreichische, deutsche oder Schweizer Rufnummer angeben.";
export const EMAIL_FEHLER = "Bitte eine gültige E-Mail-Adresse angeben.";
export const PLZ_FEHLER = "Bitte eine gültige Postleitzahl angeben, z. B. 5121.";

/* ------------------------------------------------------------------ Feste Listen */

/** Zeitplan-Chips (Kontaktformular) – gleiche Werte wie im Konfigurator (startzeitpunkt). */
export const ZEITPLAN_WERTE = ["So bald wie möglich", "In den nächsten 3 Monaten", "In 3–12 Monaten", "Später / Budgetplanung"];

/** Jahresverbrauch-Chips bei B2B-Themen (Kontaktformular). */
export const JAHRESVERBRAUCH_WERTE = ["unter 100 MWh", "100–500 MWh", "500–2.000 MWh", "über 2.000 MWh", "weiß nicht"];

/** Themen des Kontaktformulars. `b2b` = Projektthema mit Jahresverbrauch-Frage. */
export const KONTAKT_THEMEN = [
  { id: "Gewerbe & Industrie", b2b: true, projekt: true },
  { id: "Freifläche & Agri-PV", b2b: true, projekt: true },
  { id: "Landwirtschaft", b2b: true, projekt: true },
  { id: "Gemeinde", b2b: true, projekt: true },
  { id: "Speicher & Laden", b2b: true, projekt: true },
  { id: "Energiegemeinschaft", b2b: true, projekt: true },
  { id: "Service & Wartung", b2b: false, projekt: false },
  { id: "Störung an bestehender Anlage", b2b: false, projekt: false },
  { id: "Laufendes Projekt", b2b: false, projekt: false },
  { id: "Rechnung/Buchhaltung", b2b: false, projekt: false },
  { id: "Lieferant/Partner", b2b: false, projekt: false },
  { id: "Presse", b2b: false, projekt: false },
  { id: "Datenschutz-Anfrage", b2b: false, projekt: false },
  { id: "Sonstiges", b2b: false, projekt: true },
];

/* ------------------------------------------------------------------ Säubern (Server) */

/** Steuerzeichen raus, trimmen, Länge begrenzen. */
export const textKurz = (wert, max = 140) =>
  String(wert ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

const eine = (wert, erlaubt) => {
  const w = textKurz(wert, 80);
  return erlaubt.includes(w) ? w : "";
};

const flagge = (wert) => (wert === 1 || wert === true || wert === "1" || wert === "true" ? 1 : 0);

/**
 * Strukturierte Zusatzfelder einer Kontaktanfrage – nur Whitelist-Werte, mit Längenlimits.
 * Leere Werte werden weggelassen (ältere Formulare und das Frappe-Backend ohne diese Felder
 * laufen unverändert weiter). Das Ergebnis wird über den Roh-Body gelegt.
 */
export function kontaktZusatzfelder(body) {
  const b = body && typeof body === "object" ? body : {};
  const felder = {
    firma: textKurz(b.firma, 140),
    zeitplan: eine(b.zeitplan, ZEITPLAN_WERTE),
    jahresverbrauch: eine(b.jahresverbrauch, JAHRESVERBRAUCH_WERTE),
    rueckruf_ok: flagge(b.rueckruf_ok),
    ...einwilligungPruefen(b.einwilligung_id, b.einwilligung_version),
  };
  const sauber = {};
  for (const [k, v] of Object.entries(felder)) {
    if (v === "" || v === null || v === undefined) continue;
    if (k === "rueckruf_ok" && v === 0 && !("rueckruf_ok" in b)) continue;
    sauber[k] = v;
  }
  return sauber;
}

/** Honeypot: Formulare nennen das Feld nicht mehr „website“ (Passwortmanager) – das Backend kennt nur `website`. */
export const HONEYPOT_FELD = "kontakt_zusatz";

/* ------------------------------------------------------------------ Browser */

export async function submitContact(formData) {
  const url = "/api/create_contact";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to submit contact form: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}
