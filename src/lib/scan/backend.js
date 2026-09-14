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
const demoFortsetzen = (globalThis.__ovScanDemoFortsetzen ||= new Map());

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
    const s = { phase: "offen", fotos: {}, ki: { status: "keine" }, gueltigBis, daten };
    demo.set(hash(token), s);
    // Demo: Erinnerungs-Link sofort erzeugen (in Frappe erst nach 2 Stunden per E-Mail)
    const fortsetzen = neuesToken();
    demoFortsetzen.set(hash(fortsetzen), { sitzung: s, bis: Date.now() + 72 * 3600_000 });
    console.info(`[Demo] Erinnerungs-Link: /fortsetzen/${fortsetzen}`);
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

// ---------------------------------------------------------------- Fortsetzen (Erinnerungs-E-Mail)

function demoFortsetzenSitzung(token) {
  const f = demoFortsetzen.get(hash(token));
  return f && Date.now() < f.bis && f.sitzung.phase !== "eingegangen" ? f : null;
}

/** Nur lesend: { vorname, kwp, verbrauch, speicher_kwh, fotos } oder null */
export async function fortsetzenInfo(token) {
  if (!tokenGueltig(token)) return null;
  if (demoAktiv()) {
    const f = demoFortsetzenSitzung(token);
    if (!f) return null;
    const d = f.sitzung.daten;
    return { vorname: String(d.name || "").split(" ")[0], kwp: d.kwp || null, verbrauch: d.verbrauch || null, speicher_kwh: d.speicher_kwh || null, fotos: demoStatus(f.sitzung).fotos };
  }
  return frappeKontakt("solar_lead", "fortsetzen_info", { fortsetzen_hash: hash(token) });
}

/** Neuen Handy-Code für die offene Sitzung. Rückgabe: { token, gueltigBis } oder null */
export async function fortsetzenStarten(fortsetzenToken) {
  if (!tokenGueltig(fortsetzenToken)) return null;
  const token = neuesToken();
  const gueltigBis = Date.now() + GUELTIG_MINUTEN * 60_000;
  if (demoAktiv()) {
    const f = demoFortsetzenSitzung(fortsetzenToken);
    if (!f) return null;
    for (const [k, s] of demo) if (s === f.sitzung) demo.delete(k);
    f.sitzung.gueltigBis = gueltigBis;
    demo.set(hash(token), f.sitzung);
    return { token, gueltigBis };
  }
  const ok = await frappeKontakt("solar_lead", "fortsetzen_starten", { fortsetzen_hash: hash(fortsetzenToken), token_hash: hash(token), gueltig_minuten: GUELTIG_MINUTEN });
  return ok ? { token, gueltigBis } : null;
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
