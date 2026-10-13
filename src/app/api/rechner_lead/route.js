// src/app/api/rechner_lead/route.js
//
// Lead-Gate 2.0 (Welle A, Paket A09): nimmt Name + E-Mail (Telefon optional nach Häkchen) für den Export
// bzw. die Auswertung eines Werkzeugs entgegen und startet die E-Mail-Bestätigung (Double-Opt-in).
//
//  - Kennung nur aus src/data/leadRechner.js – unbekannt → 422 (code "kennung").
//  - Pflichtfelder nur Vorname, Nachname, E-Mail (src/lib/rechnerLead.js); keine Pflicht-Einwilligung.
//  - Honigtopf befüllt → scheinbarer Erfolg ohne Weiterleitung (Bots erhalten kein Signal).
//  - Drossel zählt nur GÜLTIGE Anfragen: je IP (großzügig, Firmen-NAT) und zusätzlich je E-Mail-Hash.
//  - Backoffice (Frappe, A11): oekovolt_app.website_api.rechner.submit_rechner_lead legt den „Rechner Lead“ an
//    und versendet die Bestätigungsmail mit dem übergebenen Link. Fehlt die Methode noch, geht der Lead als
//    Kontaktanfrage „Rechner-Lead“ an kontakt.submit_kontakt (mit Einwilligungsversion und Bestätigungslink
//    für das Team).
//  - Ohne Backoffice: außerhalb von production Entwicklungs-Fallback (Link im Server-Log und in der Antwort);
//    in production 503 mit Hinweis auf E-Mail/Telefon.

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { backendFehler } from "@/lib/backendFehler";
import { ipAdresse } from "@/lib/ipAdresse";
import { herkunftFelder, herkunftZeile } from "@/lib/herkunftServer";
import { leseJson, validierungsFehler } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { einwilligungZeile } from "@/lib/einwilligungen";
import { honigtopfGefuellt, rechnerLeadPruefen } from "@/lib/rechnerLead";
import { freischaltLink, geheimnis, linkBasis, tokenErzeugen, tokenHash, TOKEN_STUNDEN } from "@/lib/leadGateServer";
import { FIRMA } from "@/lib/site";

export const dynamic = "force-dynamic";

const LEAD_URL = `${API_BASE_URL}oekovolt_app.website_api.rechner.submit_rechner_lead`;
const KONTAKT_URL = `${API_BASE_URL}oekovolt_app.website_api.kontakt.submit_kontakt`;
const TIMEOUT_MS = 15_000;
const PRODUKTION = process.env.NODE_ENV === "production";
const HINWEIS = `Bitte schreiben Sie uns an ${FIRMA.email} oder rufen Sie an: ${FIRMA.telefon}.`;

/* ------------------------------------------------------------- Drossel */

// Zählt nur gültige Anfragen (abgelehnte verbrauchen kein Kontingent).
const FENSTER_MS = 10 * 60 * 1000;
const MAX_JE_IP = 20; // mehrere Mitarbeitende hinter einer Firmen-IP
const MAX_OHNE_IP = 120;
const MAX_JE_EMAIL = 4; // „Erneut senden“ inklusive
const ZAEHLER = new Map();

function zaehlerVoll(schluessel, limit, jetzt) {
  const liste = (ZAEHLER.get(schluessel) || []).filter((t) => jetzt - t < FENSTER_MS);
  ZAEHLER.set(schluessel, liste);
  return liste.length >= limit;
}
function zaehlen(schluessel, jetzt) {
  ZAEHLER.get(schluessel)?.push(jetzt) ?? ZAEHLER.set(schluessel, [jetzt]);
  if (ZAEHLER.size > 10000) ZAEHLER.clear();
}

const zuViele = () =>
  NextResponse.json({ error: "Zu viele Anfragen in kurzer Zeit – bitte versuchen Sie es in einigen Minuten erneut.", code: "zu_viele" }, { status: 429 });

/* ------------------------------------------------------------- Payloads */

function nachrichtZeilen(d, link) {
  const ergebnis = Object.entries(d.ergebnis).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
  return [
    `Rechner-Lead: ${d.rechner_name} (${d.kennung}, Aktion ${d.aktion}, Stufe ${d.stufe})`,
    `Segment: ${d.segment_name}`,
    d.firma && `Firma: ${d.firma}`,
    d.rolle && `Funktion: ${d.rolle}`,
    d.mappe_rollen.length && `Bericht für: ${d.mappe_rollen.join(", ")}`,
    `Kontakt erwünscht (E-Mail${d.telefon ? "/Telefon" : ""}): ${d.kontakt_ok ? "ja" : "nein – nur Zustellung und Rückfragen zum Ergebnis"}`,
    einwilligungZeile("leadgate-info"),
    d.kontakt_ok ? einwilligungZeile("leadgate-kontakt", { angekreuzt: true }) : "",
    ergebnis.length ? `Kennzahlen:\n${ergebnis.join("\n")}` : "",
    `Werkzeug: ${d.quelle}`,
    link
      ? `Bestätigung (Double-Opt-in) ausstehend. Falls die automatische Mail fehlt, diesen Link an den Kunden senden (${TOKEN_STUNDEN} h gültig): ${link}`
      : "Kennzahlen an einen Fachberater gesendet – keine Freischaltung angefordert.",
  ].filter(Boolean);
}

async function anBackoffice(url, body) {
  return fetch(url, { method: "POST", headers: getApiHeaders(), body: JSON.stringify(body), signal: AbortSignal.timeout(TIMEOUT_MS) });
}

/** Methode im Backoffice (noch) nicht vorhanden? */
async function methodeFehlt(res) {
  if (res.status === 404) return true;
  if (res.status !== 417 && res.status !== 500 && res.status !== 403) return false;
  const t = await res.clone().text().catch(() => "");
  return /Failed to get method|No module named|has no attribute|not whitelisted|DoesNotExistError/i.test(t);
}

/* ------------------------------------------------------------------ POST */

export async function POST(request) {
  const { daten: roh, antwort } = await leseJson(request);
  if (antwort) return antwort;

  // Bot: so tun, als sei alles angekommen
  if (honigtopfGefuellt(roh)) return NextResponse.json({ success: true, bestaetigung: "email" });

  const p = rechnerLeadPruefen(roh);
  if (!p.ok) {
    if (p.code === "kennung") return NextResponse.json({ error: p.fehler.kennung, code: "kennung", felder: p.fehler }, { status: 422 });
    return validierungsFehler(p.fehler);
  }
  const d = p.daten;

  // Drossel: erst prüfen, dann zählen – nur gültige Anfragen
  const jetzt = Date.now();
  const ip = ipAdresse(request);
  const ipSchluessel = `ip:${ip || "unbekannt"}`;
  const mailSchluessel = `mail:${crypto.createHash("sha256").update(d.email).digest("hex").slice(0, 32)}`;
  if (zaehlerVoll(ipSchluessel, ip ? MAX_JE_IP : MAX_OHNE_IP, jetzt) || zaehlerVoll(mailSchluessel, MAX_JE_EMAIL, jetzt)) return zuViele();
  zaehlen(ipSchluessel, jetzt);
  zaehlen(mailSchluessel, jetzt);

  if (!geheimnis()) {
    console.error("Rechner-Lead: LEAD_GATE_SECRET fehlt oder ist kürzer als 32 Zeichen");
    return NextResponse.json({ error: `Die Freischaltung ist gerade nicht verfügbar. ${HINWEIS}`, code: "nicht_konfiguriert" }, { status: 503 });
  }

  // „senden“ (Kennzahlen an einen Fachberater, z. B. Lastgang) schaltet nichts frei → keine Bestätigungsmail
  const doi = d.aktion !== "senden";
  const token = doi ? tokenErzeugen({ kennung: d.kennung, rueckkehr: d.rueckkehr, jetzt }) : "";
  const link = doi ? freischaltLink(linkBasis(request), token) : "";
  const gueltigBis = doi ? new Date(jetzt + TOKEN_STUNDEN * 3600_000).toISOString() : null;
  const herkunft = herkunftFelder(roh.herkunft);

  // ── Ohne Backoffice: Entwicklungs-Fallback (nur außerhalb von production)
  if (!isApiConfigured() || !process.env.SERVER) {
    if (PRODUKTION) {
      console.error("Rechner-Lead: Backoffice nicht konfiguriert (SERVER/API_KEY/API_SECRET fehlen)");
      return NextResponse.json({ error: `Der Versand ist derzeit nicht mit unserem System verbunden. ${HINWEIS}`, code: "nicht_konfiguriert" }, { status: 503 });
    }
    if (!doi) {
      console.info(`[Lead-Gate Entwicklungs-Fallback] ${d.kennung} (senden) – Kennzahlen: ${JSON.stringify(d.ergebnis)}`);
      return NextResponse.json({ success: true, bestaetigung: "keine" });
    }
    console.info(`[Lead-Gate Entwicklungs-Fallback] ${d.kennung} (${d.aktion}) – Bestätigungslink (${TOKEN_STUNDEN} h, einmal verwendbar):\n${link}`);
    return NextResponse.json({ success: true, bestaetigung: "entwicklung", gueltig_bis: gueltigBis, entwicklung_link: link });
  }

  // ── Backoffice: eigener DocType „Rechner Lead“ (A11)
  const lead = {
    ...d,
    ergebnis_json: JSON.stringify(d.ergebnis),
    ergebnis: undefined,
    mappe_rollen: d.mappe_rollen.join(", "),
    segment: d.segment_name,
    einwilligung_text_version: d.einwilligung_version,
    bestaetigung: doi ? "double-opt-in" : "keine",
    bestaetigungs_link: link,
    bestaetigungs_token_hash: doi ? tokenHash(token) : "",
    token_gueltig_bis: gueltigBis || "",
    ip_adresse: ip,
    ...herkunft,
    // Backoffice erwartet die Herkunft als Zeile (Spezifikation #17); den Token im Link übernimmt es (Integration A09/A11)
    herkunft: herkunftZeile(roh.herkunft) || "",
  };

  try {
    let res = await anBackoffice(LEAD_URL, lead);
    let weg = "rechner";
    if (!res.ok && (await methodeFehlt(res))) {
      // Rückfall: Kontaktanfrage mit Kennzeichnung „Rechner-Lead“
      weg = "kontakt";
      const zeilen = nachrichtZeilen(d, link);
      const hz = herkunftZeile(roh.herkunft);
      res = await anBackoffice(KONTAKT_URL, {
        thema: "Rechner-Lead",
        vorname: d.vorname,
        nachname: d.nachname,
        email: d.email,
        telefon: d.telefon,
        plz: d.plz,
        firma: d.firma,
        nachricht: [...zeilen, hz].filter(Boolean).join("\n").slice(0, 8000),
        einwilligung: 1, // Hinweistext lit. b angezeigt – keine Einwilligungs-Checkbox (siehe create_contact)
        einwilligung_id: d.einwilligung_id,
        einwilligung_version: d.einwilligung_version,
        rueckruf_ok: d.kontakt_ok,
        quelle: d.quelle,
        website: "",
        ip_adresse: ip,
      });
    }
    if (!res.ok) {
      const { status, body } = await backendFehler(res, "Rechner-Lead API");
      return NextResponse.json(status === 502 ? { ...body, error: `${body.error}. ${HINWEIS}` } : body, { status });
    }
    const leadId = weg === "rechner" ? (await res.json().catch(() => ({})))?.message?.lead_id || null : null;
    if (!doi) return NextResponse.json({ success: true, bestaetigung: "keine", lead_id: leadId });
    return NextResponse.json({ success: true, bestaetigung: weg === "rechner" ? "email" : "team", gueltig_bis: gueltigBis, lead_id: leadId });
  } catch (error) {
    console.error("Rechner-Lead: Weiterleitung fehlgeschlagen", error);
    return NextResponse.json({ error: `Der Server ist vorübergehend nicht erreichbar. ${HINWEIS}`, code: "backend" }, { status: 502 });
  }
}
