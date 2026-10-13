// src/app/api/referenz-freigabe/route.js
//
// Proxy für die Referenz-Freigabe per Einmal-Link (Welle A07) → Backoffice
// oekovolt_app.website_api.freigabe (freigabe_speichern / widerrufen). Nur POST, JSON ≤ 24 KB,
// gleiche Herkunft (Origin/Sec-Fetch-Site), Drosselung je Besucher, keine Daten im Log.
//
// Body: { token, aktion: "speichern" | "widerrufen", auswahl?: { name, logo, zitat, zitat_text,
//         zitat_person_funktion, fotos_anlage, plakette, livedaten, messwerte,
//         vertretungsbefugnis_bestaetigt }, text_version? }
// Antwort: { ok: true, status: "freigegeben" | "widerrufen", test?: true }
//          oder { error, code, felder? } mit 400/403/404/409/422/429/502/503.

import { NextResponse } from "next/server";
import { gedrosselt, leseJson, pruefung, text, validierungsFehler } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { ipAdresse } from "@/lib/ipAdresse";
import { FREIGABE_TEXT_VERSION, TEST_TOKEN, freigabeSpeichern, freigabeWiderrufen, tokenGueltig } from "@/lib/kundenbuehneServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KOPF = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const MAX_ZITAT = 600;
const MAX_PERSON = 160;

const antwort = (body, status = 200) => NextResponse.json(body, { status, headers: KOPF });

/**
 * Fremde Herkunft ablehnen: Browser schicken bei Formularen Origin bzw. Sec-Fetch-Site.
 * Ohne beide Kopfzeilen (z. B. ältere Clients) wird nicht blockiert – die Drosselung greift trotzdem.
 */
function herkunftAbgelehnt(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  try {
    return new URL(origin).host !== host.split(",")[0].trim();
  } catch {
    return true;
  }
}

const bool = (w) => w === true || w === 1 || w === "1" || w === "true" || w === "on";

export async function POST(request) {
  if (herkunftAbgelehnt(request)) {
    return antwort({ error: "Anfrage von fremder Herkunft abgelehnt.", code: "herkunft" }, 403);
  }
  const drossel = gedrosselt(request, "referenz-freigabe");
  if (drossel) return drossel;

  const { daten, antwort: fehler } = await leseJson(request);
  if (fehler) return fehler;

  const token = text(daten.token, 64);
  if (token !== TEST_TOKEN && !tokenGueltig(token)) {
    return antwort({ error: "Dieser Link ist nicht gültig.", code: "ungueltig" }, 404);
  }
  const aktion = text(daten.aktion, 20);
  const ip = ipAdresse(request);

  if (aktion === "widerrufen") {
    const r = await freigabeWiderrufen(token, ip);
    if (!r.ok) return antwort({ error: r.fehler, code: r.status === 404 ? "ungueltig" : "backend" }, r.status);
    return antwort({ ok: true, status: "widerrufen", ...(r.daten?.test && { test: true }) });
  }

  if (aktion !== "speichern") {
    return antwort({ error: "Unbekannte Aktion.", code: "ungueltig" }, 400);
  }

  const a = daten.auswahl && typeof daten.auswahl === "object" && !Array.isArray(daten.auswahl) ? daten.auswahl : {};
  const auswahl = {
    name: bool(a.name),
    logo: bool(a.logo),
    zitat: bool(a.zitat),
    zitat_text: text(a.zitat_text, MAX_ZITAT),
    zitat_person_funktion: text(a.zitat_person_funktion, MAX_PERSON),
    fotos_anlage: bool(a.fotos_anlage),
    plakette: bool(a.plakette),
    livedaten: bool(a.livedaten),
    messwerte: bool(a.messwerte),
    vertretungsbefugnis_bestaetigt: bool(a.vertretungsbefugnis_bestaetigt),
    text_version: text(daten.text_version, 40) || FREIGABE_TEXT_VERSION,
  };

  const p = pruefung();
  p.wenn(!auswahl.vertretungsbefugnis_bestaetigt, "vertretungsbefugnis_bestaetigt", "Bitte bestätigen Sie, dass Sie diese Erklärung für das Unternehmen abgeben dürfen.");
  p.wenn(auswahl.zitat && auswahl.zitat_text.length < 10, "zitat_text", "Bitte tragen Sie den Wortlaut des Zitats ein (mindestens 10 Zeichen) oder nehmen Sie das Häkchen heraus.");
  p.wenn(auswahl.zitat && !auswahl.zitat_person_funktion, "zitat_person_funktion", "Bitte Name und Funktion der zitierten Person angeben.");
  if (!p.ok()) return validierungsFehler(p.felder);
  if (!auswahl.zitat) {
    auswahl.zitat_text = "";
    auswahl.zitat_person_funktion = "";
  }

  const r = await freigabeSpeichern(token, auswahl, ip);
  if (!r.ok) {
    const code = r.status === 404 ? "ungueltig" : r.status === 422 ? "validierung" : r.status === 429 ? "zu_viele" : "backend";
    return antwort({ error: r.fehler, code }, r.status);
  }
  return antwort({ ok: true, status: "freigegeben", ...(r.daten?.test && { test: true }) });
}
