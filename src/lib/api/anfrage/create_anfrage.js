// src/lib/api/anfrage/create_anfrage.js
//
// Angebots-Anfrage aus Sicht des Browsers (submitAnfrage → /api/create_anfrage) und – weil im
// Browser wie auf dem Server importierbar – die festen Listen und die Whitelist der strukturierten
// Felder, die der Konfigurator zusätzlich zur Nachricht sendet (Welle A, Paket A08):
//   objekt, firma, netzebene, lastgang, flaeche_m2, kwp_wunsch, zeitplan, rolle, gremium[],
//   einwilligung_id, einwilligung_version, rueckruf_ok, thema, zweck
// Alle Felder sind optional: Fehlt eines, läuft das Frappe-Backend (submit_angebot) wie bisher.

import { getBaseUrl, isBuilding } from "@/lib/baseUrl";
import { einwilligungPruefen } from "@/lib/einwilligungen";
import { textKurz, ZEITPLAN_WERTE } from "@/lib/api/contact/create_contact";

/* ------------------------------------------------------------------ Feste Listen */

export const OBJEKT_WERTE = ["gewerbe", "landwirtschaft", "freiflaeche", "hotellerie", "gemeinde", "chalet", "privat", "sonstiges"];
export const NETZEBENE_WERTE = ["7", "6", "5", "4", "unbekannt"];
export const LASTGANG_WERTE = ["ja", "nein", "unbekannt"];

/** Rolle der anfragenden Person (optional, Einzelwahl). */
export const ROLLEN = ["Geschäftsführung/Inhaber", "Finanzen", "Technik/Facility", "Einkauf", "Gemeinde/Verwaltung", "Landwirt/Eigentümer", "Sonstiges"];

/** Wer entscheidet mit? (optional, Mehrfachauswahl) */
export const GREMIEN = ["Geschäftsführung", "Finanzen", "Technik", "Eigentümer/Vermieter", "Hausbank", "Gemeinderat"];

/** ?thema= aus Links anderer Seiten – nur diese Werte werden übernommen. */
export const THEMA_WERTE = ["netzanmeldung", "beschlussvorlage", "lastgang", "speicher", "ladeinfrastruktur", "notstrom", "repowering", "wartung", "foerderung", "finanzierung", "zweitmeinung"];

/** ?zweck= aus Links anderer Seiten – nur diese Werte werden übernommen. */
export const ZWECK_WERTE = ["angebot", "beschlussvorlage", "zweitmeinung", "foerderung", "finanzierung", "netzanmeldung", "wartung", "ausschreibung"];

export { ZEITPLAN_WERTE };

/* ------------------------------------------------------------------ Säubern (Server) */

const eine = (wert, erlaubt) => {
  const w = textKurz(wert, 80);
  return erlaubt.includes(w) ? w : "";
};

const mehrere = (wert, erlaubt) => {
  const liste = Array.isArray(wert) ? wert : typeof wert === "string" ? wert.split(",") : [];
  return [...new Set(liste.map((w) => textKurz(w, 80)).filter((w) => erlaubt.includes(w)))];
};

const zahl = (wert, max) => {
  const n = Number(String(wert ?? "").replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 && n <= max ? Math.round(n * 10) / 10 : null;
};

const flagge = (wert) => (wert === 1 || wert === true || wert === "1" || wert === "true" ? 1 : 0);

/**
 * Strukturierte Felder einer Angebotsanfrage – nur Whitelist-Werte, mit Längenlimits.
 * Leere Werte werden weggelassen (Frappe-Fallback ohne diese Felder bleibt kompatibel).
 */
export function anfrageZusatzfelder(body) {
  const b = body && typeof body === "object" ? body : {};
  const felder = {
    objekt: eine(b.objekt, OBJEKT_WERTE),
    firma: textKurz(b.firma, 140),
    netzebene: eine(b.netzebene, NETZEBENE_WERTE),
    lastgang: eine(b.lastgang, LASTGANG_WERTE),
    flaeche_m2: zahl(b.flaeche_m2, 10_000_000),
    kwp_wunsch: zahl(b.kwp_wunsch, 100_000),
    zeitplan: eine(b.zeitplan, ZEITPLAN_WERTE),
    rolle: eine(b.rolle, ROLLEN),
    gremium: mehrere(b.gremium, GREMIEN),
    rueckruf_ok: flagge(b.rueckruf_ok),
    thema: eine(b.thema, THEMA_WERTE),
    zweck: eine(b.zweck, ZWECK_WERTE),
    // Website-Referenz der Anfrage (Verknüpfung mit Termin und Lastgang-Analyse), z. B. „AK-20261011-7F3K“
    bezug: /^[A-Z]{2}-\d{8}-[A-Z0-9]{4}$/.test(textKurz(b.bezug, 20)) ? textKurz(b.bezug, 20) : "",
    ...einwilligungPruefen(b.einwilligung_id, b.einwilligung_version),
  };
  const sauber = {};
  for (const [k, v] of Object.entries(felder)) {
    if (v === "" || v === null || v === undefined) continue;
    if (Array.isArray(v) && !v.length) continue;
    if (k === "rueckruf_ok" && v === 0 && !("rueckruf_ok" in b)) continue;
    sauber[k] = v;
  }
  return sauber;
}

/** Honeypot-Feldname im Konfigurator (nicht „website“ – Passwortmanager). Die Route übersetzt nach `website`. */
export const HONEYPOT_FELD = "anfrage_zusatz";

/** Referenz der Anfrage, die der Browser vergibt (Verknüpfung Angebot ↔ Termin ↔ Lastgang-Analyse). */
export function anfrageReferenz(jetzt = new Date()) {
  const d = `${jetzt.getFullYear()}${String(jetzt.getMonth() + 1).padStart(2, "0")}${String(jetzt.getDate()).padStart(2, "0")}`;
  const zeichen = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let zufall = "";
  for (let i = 0; i < 4; i++) zufall += zeichen[Math.floor(Math.random() * zeichen.length)];
  return `AK-${d}-${zufall}`;
}

/**
 * sessionStorage-Schlüssel: Kontaktdaten + Bezug für die Terminbuchung nach einer Anfrage
 * (Konfigurator bzw. Kontaktformular schreiben, TerminBuchung liest und löscht nach der Buchung).
 */
export const TERMIN_VORBELEGUNG_KEY = "ov_termin_vorbelegung_v1";

/** Vorbelegung für die Terminbuchung merken (Rückfall, falls die Seite neu geladen wird). */
export function terminVorbelegungMerken(daten) {
  try {
    sessionStorage.setItem(TERMIN_VORBELEGUNG_KEY, JSON.stringify(daten || {}));
  } catch {}
}

/* ------------------------------------------------------------------ Browser */

export async function submitAnfrage(payload) {
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();

  const url = `${baseUrl}/api/create_anfrage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to submit inquiry");
    }

    return await res.json();
  } catch (error) {
    console.error("Error submitting PV inquiry:", error);
    throw error;
  }
}
