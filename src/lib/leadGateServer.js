// src/lib/leadGateServer.js
//
// Serverseitiger Kern des Lead-Gates 2.0 mit Double-Opt-in (Welle A, Paket A09). NUR in Route Handlern
// bzw. Server-Komponenten importieren (node:crypto).
//
// Ablauf:
//  1. POST /api/rechner_lead prüft die Angaben, erzeugt einen signierten Bestätigungs-Token (24 h gültig,
//     einmal verwendbar) und übergibt Lead + Link https://<site>/freischalten?token=… an das Backoffice
//     (Frappe, Paket A11), das die Bestätigungsmail versendet. Ohne Backoffice (Entwicklung/QA) wird der
//     Link nur im Server-Log und – außerhalb von production – in der Antwort ausgegeben.
//  2. /freischalten zeigt einen Knopf „E-Mail bestätigen“ (kein automatischer Verbrauch durch Mail-Scanner),
//     der POST /api/lead-gate/bestaetigen auslöst: Token prüfen, einmal verbrauchen, beim Backoffice
//     bestätigen und das signierte Freischalt-Cookie setzen.
//  3. GET /api/lead-gate/status?kennung=… liefert { frei } aus dem Cookie – Downloads und Auswertungen
//     richten sich danach.
//
// Cookie „ov-lead-frei“ (HttpOnly, SameSite=Lax, Secure in production, 30 Tage):
//   <base64url(JSON { bis, kennungen[] })>.<HMAC-SHA256 hex> mit dem Geheimnis LEAD_GATE_SECRET.
//   Enthält keine Personendaten – nur Ablaufzeit und die freigeschalteten Werkzeug-Kennungen.
//   Format identisch mit der Übergangsprüfung in src/lib/dossier/freigabe.js (Paket B07).
//   „stufe1“ in kennungen schaltet alle Rechner der Stufe 1 frei (Export nach einmaliger Bestätigung);
//   Auswertungen der Stufe 2 brauchen ihre eigene Kennung.

import crypto from "node:crypto";
import { BASE_URL } from "@/lib/site";
import { leadRechner, stufeFuer } from "@/data/leadRechner";

export const FREISCHALT_COOKIE = "ov-lead-frei";
export const COOKIE_TAGE = 30;
export const TOKEN_STUNDEN = 24;
export const STUFE1_MARKE = "stufe1";

const PRODUKTION = process.env.NODE_ENV === "production";
// Nur außerhalb von production: festes Entwicklungs-Geheimnis, damit QA ohne Konfiguration testen kann.
const ENTWICKLUNGS_GEHEIMNIS = "ov-lead-gate-nur-entwicklung";

/** Geheimnis für Token und Cookie; in production nur aus LEAD_GATE_SECRET (mind. 32 Zeichen). */
export function geheimnis() {
  const s = process.env.LEAD_GATE_SECRET || "";
  if (s.length >= 32) return s;
  return PRODUKTION ? "" : s || ENTWICKLUNGS_GEHEIMNIS;
}

const b64 = (obj) => Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
const hmac = (nutz, s) => crypto.createHmac("sha256", s).update(nutz).digest("hex");

/** Signiert ein Objekt: <base64url(JSON)>.<hex>. Ohne Geheimnis → "". */
export function signieren(obj, s = geheimnis()) {
  if (!s) return "";
  const nutz = b64(obj);
  return `${nutz}.${hmac(nutz, s)}`;
}

/** Prüft Signatur und Format; { ok, daten, grund }. */
export function signaturPruefen(wert, s = geheimnis()) {
  if (!s) return { ok: false, grund: "kein_geheimnis" };
  const [nutz, sig, rest] = String(wert || "").split(".");
  if (!nutz || !sig || rest !== undefined || nutz.length > 2000 || !/^[0-9a-f]{64}$/.test(sig)) return { ok: false, grund: "format" };
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(hmac(nutz, s), "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, grund: "signatur" };
  try {
    const daten = JSON.parse(Buffer.from(nutz, "base64url").toString("utf8"));
    if (!daten || typeof daten !== "object") return { ok: false, grund: "inhalt" };
    return { ok: true, daten };
  } catch {
    return { ok: false, grund: "inhalt" };
  }
}

/* ---------------------------------------------------------------- Token */

/**
 * Bestätigungs-Token: { t: "lg1", k: kennung, r: rückkehrpfad, e: ablauf (ms), n: zufall }.
 * Enthält bewusst keine E-Mail-Adresse (der Link landet in Mail-Postfächern und Protokollen).
 */
export function tokenErzeugen({ kennung, rueckkehr, jetzt = Date.now() }) {
  return signieren({ t: "lg1", k: kennung, r: rueckkehr || leadRechner(kennung)?.pfad || "/", e: jetzt + TOKEN_STUNDEN * 3600_000, n: crypto.randomBytes(12).toString("base64url") });
}

/** Prüft einen Bestätigungs-Token; { ok, kennung, rueckkehr, nonce, grund }. */
export function tokenPruefen(token, jetzt = Date.now()) {
  const p = signaturPruefen(token);
  if (!p.ok) return { ok: false, grund: p.grund };
  const d = p.daten;
  if (d.t !== "lg1" || !leadRechner(d.k) || typeof d.n !== "string") return { ok: false, grund: "inhalt" };
  if (!(Number(d.e) > jetzt)) return { ok: false, grund: "abgelaufen" };
  return { ok: true, kennung: d.k, rueckkehr: typeof d.r === "string" && d.r.startsWith("/") && !d.r.startsWith("//") ? d.r : leadRechner(d.k).pfad, nonce: d.n, ablauf: Number(d.e) };
}

/** Hash eines Tokens (für das Backoffice: dort wird nur der Hash gespeichert). */
export const tokenHash = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");

// Einmal-Verwendung je Server-Instanz (das Backoffice prüft zusätzlich dauerhaft über bestaetige_lead).
const VERBRAUCHT = new Map();
/** true beim ersten Aufruf je Nonce, danach false. */
export function einmalVerbrauchen(nonce, ablauf, jetzt = Date.now()) {
  for (const [n, bis] of VERBRAUCHT) if (bis < jetzt) VERBRAUCHT.delete(n);
  if (VERBRAUCHT.has(nonce)) return false;
  VERBRAUCHT.set(nonce, ablauf || jetzt + TOKEN_STUNDEN * 3600_000);
  if (VERBRAUCHT.size > 20000) VERBRAUCHT.clear();
  return true;
}

/* --------------------------------------------------------------- Cookie */

function cookieLesen(request, name = FREISCHALT_COOKIE) {
  const roh = request.headers.get("cookie") || "";
  for (const teil of roh.split(";")) {
    const [k, ...rest] = teil.trim().split("=");
    if (k === name) {
      try {
        return decodeURIComponent(rest.join("="));
      } catch {
        return "";
      }
    }
  }
  return "";
}

/** Inhalt des Freischalt-Cookies oder null (ungültig/abgelaufen). */
export function cookieInhalt(request, jetzt = Date.now()) {
  const p = signaturPruefen(cookieLesen(request));
  if (!p.ok) return null;
  const bis = Number(p.daten.bis);
  if (!(bis > jetzt)) return null;
  const kennungen = Array.isArray(p.daten.kennungen) ? p.daten.kennungen.filter((k) => typeof k === "string").slice(0, 60) : [];
  return { bis, kennungen };
}

/** Ist dieser Besucher für die Kennung freigeschaltet? { frei, bis, grund } */
export function freigabePruefen(request, kennung, jetzt = Date.now()) {
  const c = cookieInhalt(request, jetzt);
  if (!c) return { frei: false, bis: 0, grund: "kein_cookie" };
  const ok = c.kennungen.includes(kennung) || c.kennungen.includes("*") || (stufeFuer(kennung) === 1 && c.kennungen.includes(STUFE1_MARKE));
  return { frei: ok, bis: ok ? c.bis : 0, grund: ok ? "cookie" : "kennung" };
}

/** Neuer Cookie-Wert nach einer Bestätigung: bisherige Kennungen + neue, Laufzeit neu 30 Tage. */
export function cookieNachBestaetigung(request, kennung, jetzt = Date.now()) {
  const alt = cookieInhalt(request, jetzt)?.kennungen || [];
  const neu = new Set([...alt, kennung]);
  if (stufeFuer(kennung) === 1) neu.add(STUFE1_MARKE);
  return signieren({ bis: jetzt + COOKIE_TAGE * 86400_000, kennungen: [...neu].slice(-60) });
}

/** Optionen für NextResponse.cookies.set. */
export const cookieOptionen = (maxAge = COOKIE_TAGE * 86400) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: PRODUKTION,
  path: "/",
  maxAge,
});

/* ---------------------------------------------------------------- Links */

/**
 * Basis-URL für Links in E-Mails. In production IMMER die feste Domain (nie der Host-Header – sonst
 * könnten Angreifer Links auf fremde Domains in unsere Mails schreiben); optional LEAD_GATE_BASIS_URL
 * für eine Testumgebung. Außerhalb von production die Adresse des Dev-Servers.
 */
export function linkBasis(request) {
  const env = process.env.LEAD_GATE_BASIS_URL;
  if (env && /^https?:\/\/[^\s/]+$/.test(env)) return env;
  if (PRODUKTION) return BASE_URL;
  // Entwicklung: Host wie im Browser (request.url meldet unter next dev „localhost“ statt 127.0.0.1 –
  // das Cookie landete sonst auf einem anderen Host als das offene Werkzeug)
  const host = request.headers?.get?.("host");
  if (host && /^[\w.-]+(:\d+)?$/.test(host)) return `${request.headers.get("x-forwarded-proto") === "https" ? "https" : "http"}://${host}`;
  try {
    return new URL(request.url).origin;
  } catch {
    return BASE_URL;
  }
}

export const freischaltLink = (basis, token) => `${basis}/freischalten?token=${encodeURIComponent(token)}`;
