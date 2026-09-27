import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import QRCode from "qrcode";
import { renderToBuffer } from "@react-pdf/renderer";
import AnalysePdf from "@/lib/analyse/AnalysePdf";
import { analyse } from "@/lib/analyse/berechnung";
import { emailGueltig, gedrosselt, sauber } from "@/lib/rueckrufApi";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { ipAdresse } from "@/lib/ipAdresse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SOLARRECHNER_URL = `${API_BASE_URL}oekovolt_app.website_api.solarrechner.submit_solarrechner`;

const fehler = (code, status = 400) => Response.json({ fehler: code }, { status, headers: { "Cache-Control": "no-store" } });

/** Nur einen Seitenpfad wie „/solarrechner“ zulassen. */
const quellePfad = (v) => (/^\/[\w\-/.%~]*$/.test(String(v || "")) ? String(v).slice(0, 200) : "");

/**
 * Sendet Kontaktdaten und das PDF als multipart/form-data an
 * oekovolt_app.website_api.solarrechner.submit_solarrechner.
 */
async function solarrechnerSenden({ kontakt, quelle, ip, pdf, referenz }) {
  const form = new FormData();
  form.append("kunden_name", kontakt.name);
  form.append("email", kontakt.email);
  form.append("telefon", kontakt.telefon);
  form.append("plz", kontakt.plz);
  form.append("ip_adresse", ip);
  form.append("quelle", quelle); // z. B. /solarrechner
  form.append("pdf", new Blob([pdf], { type: "application/pdf" }), `Oekovolt-PV-Analyse-${referenz}.pdf`);

  const headers = getApiHeaders();
  headers.delete("Content-Type"); // multipart/form-data setzt die Boundary selbst
  const res = await fetch(SOLARRECHNER_URL, { method: "POST", headers, body: form, cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    // Frappe-Fehlermeldung (Traceback-Typ) loggen – ohne Zugangsdaten oder Formularinhalte
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
}

/**
 * Erzeugt die persönliche PV-Analyse als PDF – in einem Schritt:
 * prüfen → berechnen → PDF rendern → an Frappe senden → Download.
 */
export async function POST(request) {
  if (gedrosselt("analyse:  ", 60, 10 * 60 * 1000)) return fehler("zu_viele", 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return fehler("ungueltig");
  }
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 3000)) return fehler("ungueltig");
  if (e.einwilligung !== true) return fehler("einwilligung");

  const kontakt = {
    name: sauber(e.name, 120),
    email: sauber(e.email, 190).toLowerCase(),
    telefon: sauber(e.telefon, 40),
    plz: sauber(e.plz, 10),
  };
  if (kontakt.name.length < 2) return fehler("name");
  if (!emailGueltig(kontakt.email)) return fehler("email");
  if (kontakt.telefon.replace(/\D/g, "").length < 6) return fehler("telefon");
  if (!/^\d{5}$/.test(kontakt.plz)) return fehler("plz");
  if (gedrosselt(`analyse:${kontakt.email}`, 5, 24 * 3600 * 1000)) return fehler("zu_viele", 429);

  const daten = analyse(e.eingaben);
  const referenz = `PVA-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const datum = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" }).format(new Date());
  const qrPng = await QRCode.toDataURL(`https://www.oekovolt.de/termin?utm_source=pdf-analyse&utm_medium=qr&ref=${referenz}`, { margin: 0, width: 300, color: { dark: "#03122b", light: "#ffffff" } });

  let pdf;
  try {
    pdf = await renderToBuffer(
      <AnalysePdf daten={daten} kontakt={kontakt} referenz={referenz} datum={datum} logoPfad={{ data: fs.readFileSync(path.join(process.cwd(), "src/lib/analyse/logo-hell.png")), format: "png" }} qrPng={qrPng} />
    );
  } catch (err) {
    console.error("PDF-Analyse: Rendern fehlgeschlagen", err?.message);
    return fehler("pdf", 500);
  }

  if (!isApiConfigured()) {
    console.error("PDF-Analyse: API_KEY/API_SECRET fehlen");
    return fehler("pdf", 500);
  }
  try {
    await solarrechnerSenden({ kontakt, quelle: quellePfad(e.seite), ip: ipAdresse(request), pdf, referenz });
  } catch (err) {
    console.error("PDF-Analyse: submit_solarrechner fehlgeschlagen –", err?.message);
    return fehler("pdf", 502);
  }

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Oekovolt-PV-Analyse-${referenz}.pdf"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "X-Analyse-Referenz": referenz,
    },
  });
}
