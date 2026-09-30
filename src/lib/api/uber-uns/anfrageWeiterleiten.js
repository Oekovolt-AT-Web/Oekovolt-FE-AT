// src/lib/api/uber-uns/anfrageWeiterleiten.js
//
// Gemeinsame Server-Logik für die Formulare der Community-Seiten
// (/api/award, /api/sponsoring, /api/partner-registrierung):
//   - Body lesen mit Größenlimit, JSON prüfen
//   - Eingaben säubern und validieren (Hilfsfunktionen)
//   - Honeypot „website“ gegen Spam-Bots
//   - einfache Drosselung je IP (im Arbeitsspeicher der Instanz)
//   - Weiterleitung an das Backoffice über den bestehenden Kontakt-Endpunkt
//     (oekovolt_app.website_api.kontakt.submit_kontakt, wie /api/create_contact)
//     mit eigenem `thema` und strukturierter `nachricht`
//   - ohne Env-Variablen (SERVER, API_KEY, API_SECRET) kein Absturz, sondern
//     eine verständliche Fehlermeldung mit Hinweis auf E-Mail und Telefon.
//
// NUR SERVERSEITIG importieren (Route Handler).

import { NextResponse } from "next/server";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { backendFehler } from "@/lib/backendFehler";
import { ipAdresse } from "@/lib/ipAdresse";
import { FIRMA } from "@/lib/site";

const KONTAKT_URL = `${API_BASE_URL}oekovolt_app.website_api.kontakt.submit_kontakt`;
const MAX_BYTES = 24_000;
const TIMEOUT_MS = 15_000;

export const HINWEIS = `Bitte senden Sie Ihre Angaben direkt an ${FIRMA.email} oder rufen Sie uns an: ${FIRMA.telefon}.`;


/* ------------------------------------------------------------ Säubern & Prüfen */

/** String säubern: Steuerzeichen raus, trimmen, Länge begrenzen. */
export function text(wert, max = 300) {
  return String(wert ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/** Mehrfachauswahl: nur erlaubte Werte, ohne Duplikate. */
export function auswahl(wert, erlaubt) {
  const liste = Array.isArray(wert) ? wert : [];
  return [...new Set(liste.map((w) => text(w, 80)).filter((w) => erlaubt.includes(w)))];
}

/** Einfachauswahl: erlaubter Wert oder "". */
export function eine(wert, erlaubt) {
  const w = text(wert, 120);
  return erlaubt.includes(w) ? w : "";
}

export const istEmail = (w) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w);
export const istTelefon = (w) => /^[+()\d\s/.-]{6,30}$/.test(w) && w.replace(/\D/g, "").length >= 6;
export const istPlzAT = (w) => /^\d{4}$/.test(w);
export const istUrl = (w) => {
  try {
    const u = new URL(w);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};
/** Österreichische UID: ATU + 8 Ziffern. */
export const istUidAT = (w) => /^ATU\d{8}$/.test(w.replace(/\s/g, "").toUpperCase());
/** GISA-Zahl: in der Regel 8 Ziffern (Gewerbeinformationssystem Austria). */
export const istGisa = (w) => /^\d{6,10}$/.test(w.replace(/\s/g, ""));
/** Firmenbuchnummer: „FN 375708m“ bzw. „375708m“. */
export const istFirmenbuch = (w) => /^(FN\s?)?\d{1,6}\s?[a-z]$/i.test(w.trim());

/** Sammelt Feldfehler: pruefung.pflicht("email", wert, "…") usw. */
export function pruefung() {
  const felder = {};
  return {
    felder,
    wenn(bedingung, name, meldung) {
      if (bedingung && !felder[name]) felder[name] = meldung;
    },
    ok: () => Object.keys(felder).length === 0,
  };
}

/* ---------------------------------------------------------------- Antworten */

export function validierungsFehler(felder) {
  return NextResponse.json(
    { error: "Bitte prüfen Sie die markierten Angaben.", code: "validierung", felder },
    { status: 422 },
  );
}

/** Honeypot gefüllt → so tun, als sei alles angekommen (Bots erhalten kein Signal). */
export function honeypotAntwort() {
  return NextResponse.json({ success: true });
}

/* ------------------------------------------------------------------ Einlesen */

/**
 * Liest den JSON-Body mit Größenlimit.
 * @returns {Promise<{ daten?: object, antwort?: NextResponse }>}
 */
export async function leseJson(request) {
  const laenge = Number(request.headers.get("content-length") || 0);
  if (laenge > MAX_BYTES) {
    return { antwort: NextResponse.json({ error: "Die Anfrage ist zu groß.", code: "zu_gross" }, { status: 413 }) };
  }
  let roh = "";
  try {
    roh = await request.text();
  } catch {
    return { antwort: NextResponse.json({ error: "Die Anfrage konnte nicht gelesen werden.", code: "ungueltig" }, { status: 400 }) };
  }
  if (roh.length > MAX_BYTES) {
    return { antwort: NextResponse.json({ error: "Die Anfrage ist zu groß.", code: "zu_gross" }, { status: 413 }) };
  }
  try {
    const daten = JSON.parse(roh);
    if (!daten || typeof daten !== "object" || Array.isArray(daten)) throw new Error("kein Objekt");
    return { daten };
  } catch {
    return { antwort: NextResponse.json({ error: "Ungültiges Datenformat.", code: "ungueltig" }, { status: 400 }) };
  }
}

/* -------------------------------------------------------------- Drosselung */

const ZUGRIFFE = new Map();
const FENSTER_MS = 10 * 60 * 1000;
const MAX_JE_FENSTER = 5;
const MAX_OHNE_IP = 60;

/**
 * Einfache Drosselung je IP und Formular (pro Server-Instanz). Kein Ersatz für
 * einen Schutz am Backend, verhindert aber Formular-Fluten aus einer Quelle.
 */
export function gedrosselt(request, formular) {
  const ip = ipAdresse(request);
  // Ohne ermittelbare IP (Proxy liefert keinen Header) teilen sich alle Besucher einen
  // Zähler – dort mit großzügigem Limit, damit echte Anfragen nicht blockiert werden,
  // eine Formular-Flut aber trotzdem gebremst wird. Proxy beim Deploy prüfen (R-18).
  const schluessel = `${formular}:${ip || "unbekannt"}`;
  const limit = ip ? MAX_JE_FENSTER : MAX_OHNE_IP;
  const jetzt = Date.now();
  const liste = (ZUGRIFFE.get(schluessel) || []).filter((t) => jetzt - t < FENSTER_MS);
  if (liste.length >= limit) {
    ZUGRIFFE.set(schluessel, liste);
    return NextResponse.json(
      { error: "Zu viele Anfragen in kurzer Zeit – bitte versuchen Sie es in einigen Minuten erneut.", code: "zu_viele" },
      { status: 429 },
    );
  }
  liste.push(jetzt);
  ZUGRIFFE.set(schluessel, liste);
  if (ZUGRIFFE.size > 5000) ZUGRIFFE.clear();
  return null;
}

/* ------------------------------------------------------------- Weiterleiten */

/**
 * Leitet eine Anfrage an den Kontakt-Endpunkt des Backoffice weiter.
 *
 * @param {object} p
 * @param {Request} p.request
 * @param {string} p.thema      Kennung für das Backoffice, z. B. „PV Award – Einreichung“
 * @param {string} p.kontext    Log-Kontext
 * @param {object} p.kontakt    { vorname, nachname, email, telefon, strasse, plz, ort }
 * @param {Array<[string, string]>} p.zeilen  Beschriftete Angaben für die Nachricht
 * @param {string} [p.quelle]   Seitenpfad
 */
export async function weiterleiten({ request, thema, kontext, kontakt, zeilen, quelle }) {
  if (!isApiConfigured() || !process.env.SERVER) {
    console.error(`${kontext}: Backoffice nicht konfiguriert (SERVER/API_KEY/API_SECRET fehlen)`);
    return NextResponse.json(
      {
        error: `Das Formular ist derzeit nicht mit unserem System verbunden. ${HINWEIS}`,
        code: "nicht_konfiguriert",
        email: FIRMA.email,
      },
      { status: 503 },
    );
  }

  const nachricht = [
    `${thema}`,
    "",
    ...zeilen
      .filter(([, wert]) => wert !== undefined && wert !== null && String(wert).trim() !== "")
      .map(([label, wert]) => `${label}: ${Array.isArray(wert) ? wert.join(", ") : wert}`),
  ].join("\n");

  const payload = {
    thema,
    vorname: kontakt.vorname,
    nachname: kontakt.nachname,
    email: kontakt.email,
    telefon: kontakt.telefon,
    strasse_hausnummer: kontakt.strasse || "",
    plz: kontakt.plz || "",
    ort: kontakt.ort || "",
    nachricht: nachricht.slice(0, 8000),
    einwilligung: 1,
    quelle: quelle || "",
    website: "",
    ip_adresse: ipAdresse(request),
  };

  try {
    const response = await fetch(KONTAKT_URL, {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const { status, body } = await backendFehler(response, kontext);
      const mitHinweis = status === 502 ? { ...body, error: `${body.error}. ${HINWEIS}` } : body;
      return NextResponse.json(mitHinweis, { status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`${kontext}: Weiterleitung fehlgeschlagen`, error);
    return NextResponse.json(
      { error: `Der Server ist vorübergehend nicht erreichbar. ${HINWEIS}`, code: "backend" },
      { status: 502 },
    );
  }
}
