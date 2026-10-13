// src/app/api/dossier/pdf/route.js
//
// Business-Case-Dossier / Investitionsantrag als PDF – Lead-Gate Stufe 2 (Kennung „dossier“ bzw.
// „investitionsantrag“, Aktion „pdf“): nur nach bestätigter E-Mail (signiertes Freischalt-Cookie aus A09; außerhalb
// von production der Entwicklungs-Fallback-Kopf x-ov-gate-dev). Nur POST, JSON ≤ 48 KB, gleiche
// Herkunft (Origin/Sec-Fetch-Site), Drosselung je Besucher und global, keine Daten im Log.
//
// Body: { variante: "cfo"|"bank"|"gemeinderat"|"investitionsantrag", eingaben: {…}, eintraege: [...],
//         kontakt: { name, email, firma? } }
// Antwort: application/pdf (attachment) oder { fehler } mit 400/403/413/429/500.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { renderToBuffer } from "@react-pdf/renderer";
import DossierPdf from "@/lib/dossier/DossierPdf";
import { VARIANTEN, dossierRechnung, eingabenLesen, gateKennung } from "@/lib/dossier/rechnung";
import { eintragErzeugen } from "@/lib/dossier/ablage";
import { freigabeGeprueft } from "@/lib/dossier/freigabe";
import { emailGueltig, gedrosselt, sauber } from "@/lib/rueckrufApi";
import { ipAdresse } from "@/lib/ipAdresse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 48 * 1024;
const KOPF = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const fehler = (code, status = 400) => Response.json({ fehler: code }, { status, headers: KOPF });

/** Fremde Herkunft ablehnen (Origin bzw. Sec-Fetch-Site); ohne beide Kopfzeilen greift nur die Drossel. */
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

/** Drossel je Besucher (10 PDFs je 10 Minuten) und global (120 je 10 Minuten). */
function besucherGedrosselt(request) {
  const ip = ipAdresse(request) || "unbekannt";
  return gedrosselt(`dossier:${ip}`, 10, 10 * 60 * 1000) || gedrosselt("dossier:*", 120, 10 * 60 * 1000);
}

export async function POST(request) {
  if (herkunftAbgelehnt(request)) return fehler("herkunft", 403);
  if (besucherGedrosselt(request)) return fehler("zu_viele", 429);

  const laenge = Number(request.headers.get("content-length") || 0);
  if (laenge > MAX_BYTES) return fehler("zu_gross", 413);
  let text;
  try {
    text = await request.text();
  } catch {
    return fehler("ungueltig");
  }
  if (text.length > MAX_BYTES) return fehler("zu_gross", 413);
  let e;
  try {
    e = JSON.parse(text);
  } catch {
    return fehler("ungueltig");
  }
  if (!e || typeof e !== "object") return fehler("ungueltig");

  const variante = VARIANTEN.some((v) => v.id === e.variante) ? e.variante : "cfo";

  // Lead-Gate Stufe 2: Download nur nach bestätigter E-Mail (Kennung „dossier“ bzw. „investitionsantrag“)
  const gate = freigabeGeprueft(request, gateKennung(variante));
  if (!gate.frei) return fehler("gate", 403);
  const kontakt = { name: sauber(e.kontakt?.name, 120), email: sauber(e.kontakt?.email, 190).toLowerCase(), firma: sauber(e.kontakt?.firma, 120) };
  if (kontakt.email && !emailGueltig(kontakt.email)) kontakt.email = "";
  const eintraege = (Array.isArray(e.eintraege) ? e.eintraege : [])
    .slice(0, 10)
    .map((x) => eintragErzeugen(x || {}))
    .filter(Boolean);

  let rechnung;
  try {
    rechnung = dossierRechnung(eingabenLesen(e.eingaben || {}), { variante });
  } catch (err) {
    console.error("Dossier-PDF: Rechnung fehlgeschlagen", err?.message);
    return fehler("rechnung", 500);
  }

  const referenz = `BCD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const datum = new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Vienna" }).format(new Date());

  let pdf;
  try {
    pdf = await renderToBuffer(<DossierPdf rechnung={rechnung} eintraege={eintraege} kontakt={kontakt} referenz={referenz} datum={datum} logoPfad={{ data: fs.readFileSync(path.join(process.cwd(), "src/lib/analyse/logo-hell.png")), format: "png" }} />);
  } catch (err) {
    console.error("Dossier-PDF: Rendern fehlgeschlagen", err?.message);
    return fehler("pdf", 500);
  }

  const dateiname = variante === "investitionsantrag" ? `Oekovolt-Investitionsantrag-${referenz}.pdf` : `Oekovolt-Business-Case-Dossier-${referenz}.pdf`;
  return new Response(pdf, {
    headers: {
      ...KOPF,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${dateiname}"`,
      "X-Dossier-Referenz": referenz,
    },
  });
}
