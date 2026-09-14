// src/lib/scan/backend.js
//
// „Unterlagen per Smartphone“: Desktop erzeugt eine Sitzung, das Handy lädt Fotos hoch,
// Frappe speichert alles privat im DocType „Solar Lead“ und wertet die Stromrechnung
// (nur mit Einwilligung) im Hintergrund mit Claude aus.
//
// Das Handy-Token (32 Byte, Base64url) steht nur im QR-Code. Frappe kennt ausschließlich
// seinen SHA-256-Hash – Tokens tauchen so weder in der Datenbank noch in Logs auf.
//
// Lokal (KANAL_DEMO=1, nie in Produktion) arbeitet ein Speicher im Arbeitsspeicher.

import crypto from "node:crypto";
import { demoAktiv } from "@/lib/kanaele/demo";
import { frappeKonfiguriert, frappeKontakt } from "@/lib/rueckrufApi";

export const FOTO_FELDER = ["zaehler", "rechnung", "rechnung_2", "schaltschrank", "dach"];
export const PFLICHT = ["zaehler", "rechnung"];
export const GUELTIG_MINUTEN = 45;

export const neuesToken = () => crypto.randomBytes(32).toString("base64url");
export const tokenGueltig = (t) => /^[A-Za-z0-9_-]{43}$/.test(String(t || ""));
const hash = (t) => crypto.createHash("sha256").update(String(t)).digest("hex");

export const scanVerfuegbar = () => demoAktiv() || frappeKonfiguriert();

// ---------------------------------------------------------------- Demo-Speicher

const demo = (globalThis.__ovScanDemo ||= new Map());

function demoStatus(s) {
  return {
    gueltig: Date.now() < s.gueltigBis,
    phase: s.phase,
    fotos: Object.fromEntries(FOTO_FELDER.map((f) => [f, Boolean(s.fotos[f])])),
    ki: s.ki,
  };
}

// ---------------------------------------------------------------- API

/** Neue Sitzung vom Desktop. Rückgabe: { token, gueltigBis } */
export async function sitzungStarten(daten) {
  const token = neuesToken();
  const gueltigBis = Date.now() + GUELTIG_MINUTEN * 60_000;
  if (demoAktiv()) {
    demo.set(hash(token), { phase: "offen", fotos: {}, ki: { status: "keine" }, gueltigBis, daten });
    return { token, gueltigBis };
  }
  await frappeKontakt("solar_lead", "sitzung_starten", { ...daten, token_hash: hash(token), gueltig_minuten: GUELTIG_MINUTEN });
  return { token, gueltigBis };
}

/** { gueltig, phase: offen|verbunden|fotos|eingegangen, fotos: {feld: bool}, ki: { status, jahresverbrauch, arbeitspreis_ct, anbieter } } oder null */
export async function sitzungStatus(token) {
  if (!tokenGueltig(token)) return null;
  if (demoAktiv()) {
    const s = demo.get(hash(token));
    return s ? demoStatus(s) : null;
  }
  return frappeKontakt("solar_lead", "sitzung_status", { token_hash: hash(token) });
}

export async function alsVerbundenMarkieren(token) {
  if (demoAktiv()) {
    const s = demo.get(hash(token));
    if (s && s.phase === "offen") s.phase = "verbunden";
    return Boolean(s);
  }
  return frappeKontakt("solar_lead", "sitzung_verbunden", { token_hash: hash(token) });
}

export async function fotoSpeichern(token, feld, buffer, mime) {
  if (demoAktiv()) {
    const s = demo.get(hash(token));
    if (!s || Date.now() > s.gueltigBis || s.phase === "eingegangen") throw Object.assign(new Error("sitzung"), { status: 410 });
    s.fotos[feld] = { groesse: buffer.length, mime };
    if (s.phase !== "eingegangen") s.phase = "fotos";
    return true;
  }
  return frappeKontakt("solar_lead", "foto_speichern", {
    token_hash: hash(token),
    feld,
    mime,
    datei_base64: buffer.toString("base64"),
  });
}

export async function sitzungAbschliessen(token, { zaehlerstand, zaehlerstandOcr, kiEinwilligung }) {
  if (demoAktiv()) {
    const s = demo.get(hash(token));
    if (!s) throw Object.assign(new Error("sitzung"), { status: 410 });
    s.phase = "eingegangen";
    s.zaehlerstand = zaehlerstand;
    if (kiEinwilligung) {
      s.ki = { status: "laeuft" };
      // Demo: kein echter KI-Aufruf – nur der Ablauf wird simuliert
      setTimeout(() => (s.ki = { status: "demo", hinweis: "Demo-Modus: keine KI-Auswertung" }), 2500);
    }
    return true;
  }
  return frappeKontakt("solar_lead", "sitzung_abschliessen", {
    token_hash: hash(token),
    zaehlerstand: zaehlerstand ?? "",
    zaehlerstand_ocr: zaehlerstandOcr ?? "",
    ki_einwilligung: kiEinwilligung ? 1 : 0,
  });
}
