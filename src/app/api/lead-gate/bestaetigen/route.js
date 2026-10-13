// src/app/api/lead-gate/bestaetigen/route.js
//
// Lead-Gate 2.0 (Welle A, Paket A09): Bestätigung der E-Mail-Adresse (Double-Opt-in).
//   POST { token }  → prüft Signatur und Ablauf (24 h), verbraucht den Token einmal, meldet die Bestätigung
//                     an das Backoffice (oekovolt_app.website_api.rechner.bestaetige_lead, Paket A11) und setzt
//                     das signierte Freischalt-Cookie „ov-lead-frei“ (HttpOnly, 30 Tage).
//                     Antwort: { ok, kennung, ziel } – ziel ist ein interner Pfad (Werkzeugseite).
//   GET ?token=…    → nur Weiterleitung auf /freischalten (verbraucht nichts: Mail-Scanner rufen Links ab).
// Ohne Backoffice (Entwicklung) gilt allein die Signatur; in production muss das Backoffice bestätigen.

import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { FREISCHALT_COOKIE, cookieNachBestaetigung, cookieOptionen, einmalVerbrauchen, tokenHash, tokenPruefen } from "@/lib/leadGateServer";
import { FIRMA } from "@/lib/site";
import { ipAdresse } from "@/lib/ipAdresse";

export const dynamic = "force-dynamic";

const BESTAETIGEN_URL = `${API_BASE_URL}oekovolt_app.website_api.rechner.bestaetige_lead`;
const PRODUKTION = process.env.NODE_ENV === "production";

const MELDUNG = {
  abgelaufen: "Dieser Bestätigungslink ist abgelaufen (24 Stunden). Bitte fordern Sie im Werkzeug einen neuen Link an.",
  verbraucht: "Dieser Bestätigungslink wurde bereits verwendet. Auf dem Gerät, auf dem Sie ihn geöffnet haben, ist die Freischaltung aktiv – sonst fordern Sie bitte einen neuen Link an.",
  ungueltig: "Dieser Bestätigungslink ist ungültig. Bitte kopieren Sie den Link vollständig aus der E-Mail oder fordern Sie einen neuen an.",
  backend: `Die Bestätigung ist gerade nicht möglich. Bitte versuchen Sie es in einigen Minuten erneut oder schreiben Sie an ${FIRMA.email}.`,
};

const fehler = (code, status) => NextResponse.json({ ok: false, code, error: MELDUNG[code] }, { status, headers: { "Cache-Control": "no-store" } });

export function GET(request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const ziel = new URL(`/freischalten${token ? `?token=${encodeURIComponent(token)}` : ""}`, request.url);
  return NextResponse.redirect(ziel, 303);
}

export async function POST(request) {
  const { daten, antwort } = await leseJson(request);
  if (antwort) return antwort;
  const token = String(daten.token || "").slice(0, 2400);

  const t = tokenPruefen(token);
  if (!t.ok) return fehler(t.grund === "abgelaufen" ? "abgelaufen" : "ungueltig", t.grund === "abgelaufen" ? 410 : 400);

  // Backoffice bestätigt dauerhaft und einmalig (Hash + Ablauf, setzt „bestaetigt“ am Rechner Lead)
  if (process.env.SERVER) {
    try {
      const res = await fetch(BESTAETIGEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Gastmethode – ohne Authorization (siehe /api/rueckruf)
        body: JSON.stringify({ token, token_hash: tokenHash(token), ip_adresse: ipAdresse(request) }),
        signal: AbortSignal.timeout(12_000),
      });
      const j = await res.json().catch(() => ({}));
      const ergebnis = j?.message ?? j;
      if (res.ok && ergebnis?.ok === false) return fehler(ergebnis.grund === "abgelaufen" ? "abgelaufen" : ["verwendet", "verbraucht"].includes(ergebnis.grund) ? "verbraucht" : "ungueltig", 409);
      if (!res.ok && res.status !== 404) {
        console.error("Lead-Gate bestaetigen: Backoffice antwortet", res.status);
        if (PRODUKTION) return fehler("backend", 502);
      }
      if (res.status === 404) console.warn("Lead-Gate bestaetigen: Methode rechner.bestaetige_lead fehlt im Backoffice (A11) – Bestätigung nur über die Signatur");
    } catch (e) {
      console.error("Lead-Gate bestaetigen: Backoffice nicht erreichbar", e);
      if (PRODUKTION) return fehler("backend", 502);
    }
  }

  // Einmal verwendbar (je Server-Instanz; dauerhaft prüft das Backoffice)
  if (!einmalVerbrauchen(t.nonce, t.ablauf)) return fehler("verbraucht", 409);

  const wert = cookieNachBestaetigung(request, t.kennung);
  const [ohneAnker, anker = ""] = t.rueckkehr.split("#");
  const ziel = `${ohneAnker}${ohneAnker.includes("?") ? "&" : "?"}lead-frei=${encodeURIComponent(t.kennung)}${anker ? `#${anker}` : ""}`;
  const res = NextResponse.json({ ok: true, kennung: t.kennung, ziel }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(FREISCHALT_COOKIE, wert, cookieOptionen());
  return res;
}
