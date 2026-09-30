// src/app/api/heatmap/route.js
//
// Klick- und Scroll-Heatmap (nur mit Einwilligung „Statistik“, Sammler: components/Statistik/HeatmapSammler.js).
//
// POST /api/heatmap   Body { pfad, geraet, klicks: [{ sel, rx, ry }], scroll }  (per navigator.sendBeacon)
//   → prüft und kürzt die Daten, drosselt je IP (nur im Arbeitsspeicher, als gesalzener Hash) und leitet sie
//     OHNE IP-Adresse an Frappe weiter (heatmap_zelle.api.erfassen). Antwortet immer 204 – auch bei Fehlern,
//     die nur geloggt werden (der Browser wertet die Antwort eines Beacons ohnehin nicht aus).
//
// GET /api/heatmap?pfad=&geraet=&tage=30&token=   (für die Heatmap-Ansicht auf der Website)
//   → nur mit gültigem HEATMAP_TOKEN (sonst 404); holt die Auswertung aus Frappe (heatmap_zelle.api.auswertung).
//
// Umgebungsvariablen: SERVER, API_KEY, API_SECRET (Frappe, siehe lib/apiBaseUrl.js), HEATMAP_TOKEN (mind. 16 Zeichen).

import crypto from "node:crypto";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { ipAdresse } from "@/lib/ipAdresse";
import {
  HEATMAP_GERAETE,
  HEATMAP_MAX_KLICKS,
  heatmapAusgenommen,
  pfadGueltig,
  runden05,
  runden10,
  selektorGueltig,
} from "@/lib/heatmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const METHODE = "oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api";
const ERFASSEN_URL = `${API_BASE_URL}${METHODE}.erfassen`;
const AUSWERTUNG_URL = `${API_BASE_URL}${METHODE}.auswertung`;
const MAX_BODY = 40_000; // 100 Klicks × ~230 Zeichen reichen locker

const konfiguriert = () => Boolean(process.env.SERVER) && isApiConfigured();

/* ------------------------------------------------------------------ einfache Drosselung je IP (im Speicher) */

const FENSTER_MS = 10 * 60 * 1000;
const LIMITS = { erfassen: 120, ansicht: 60, token: 20 };
const zugriffe = new Map();
// Die IP wird nur gesalzen gehasht als Schlüssel gehalten; das Salz wechselt mit jedem Serverstart.
const SALZ = crypto.randomBytes(16).toString("hex");

const schluesselFuer = (ip, art) => `${art}:${crypto.createHash("sha256").update(SALZ + ip).digest("base64url").slice(0, 22)}`;

/** Zugriff zählen (zaehlen = false: nur nachsehen) und true liefern, wenn das Limit überschritten ist. */
function zuViele(ip, art, zaehlen = true) {
  if (!ip) return false;
  const jetzt = Date.now();
  const schluessel = schluesselFuer(ip, art);
  const liste = (zugriffe.get(schluessel) || []).filter((t) => jetzt - t < FENSTER_MS);
  if (zaehlen) liste.push(jetzt);
  zugriffe.set(schluessel, liste);
  if (zugriffe.size > 5000) {
    for (const [k, v] of zugriffe) if (!v.some((t) => jetzt - t < FENSTER_MS)) zugriffe.delete(k);
  }
  return zaehlen ? liste.length > LIMITS[art] : liste.length >= LIMITS[art];
}

/* ------------------------------------------------------------------ Hilfen */

const leer = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

const KOPF_ANSICHT = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

const nichtGefunden = () =>
  new Response("Not Found", { status: 404, headers: { ...KOPF_ANSICHT, "Content-Type": "text/plain; charset=utf-8" } });

const json = (daten, status = 200) => Response.json(daten, { status, headers: KOPF_ANSICHT });

/** Konstantzeitlicher Vergleich (über SHA-256, damit auch die Länge nichts verrät). */
function tokenGueltig(eingabe) {
  const soll = process.env.HEATMAP_TOKEN || "";
  if (soll.length < 16 || typeof eingabe !== "string" || !eingabe) return false;
  const a = crypto.createHash("sha256").update(eingabe).digest();
  const b = crypto.createHash("sha256").update(soll).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Beacon-Daten prüfen und normalisieren; null bei ungültigen Daten. */
function pruefen(e) {
  if (!e || typeof e !== "object" || Array.isArray(e)) return null;
  const { pfad, geraet, klicks, scroll } = e;
  if (!pfadGueltig(pfad) || heatmapAusgenommen(pfad)) return null;
  if (!HEATMAP_GERAETE.includes(geraet)) return null;
  if (!Array.isArray(klicks) || klicks.length > HEATMAP_MAX_KLICKS) return null;
  const sauber = [];
  for (const k of klicks) {
    if (!k || typeof k !== "object") return null;
    const { sel, rx, ry } = k;
    if (!selektorGueltig(sel)) return null;
    if (typeof rx !== "number" || typeof ry !== "number" || !(rx >= 0 && rx <= 1) || !(ry >= 0 && ry <= 1)) return null;
    sauber.push({ sel, rx: runden05(rx), ry: runden05(ry) });
  }
  if (typeof scroll !== "number" || !(scroll >= 0 && scroll <= 100)) return null;
  return { pfad, geraet, klicks: sauber, scroll: runden10(scroll) };
}

/* ------------------------------------------------------------------ POST: erfassen */

export async function POST(request) {
  try {
    if (!konfiguriert()) return leer();
    // Nur Beacons unserer eigenen Seiten annehmen (Browser senden Sec-Fetch-Site mit)
    const herkunft = request.headers.get("sec-fetch-site");
    if (herkunft && herkunft !== "same-origin") return leer();
    if (zuViele(ipAdresse(request), "erfassen")) return leer();

    const text = await request.text();
    if (!text || text.length > MAX_BODY) return leer();
    let roh;
    try {
      roh = JSON.parse(text);
    } catch {
      return leer();
    }
    const daten = pruefen(roh);
    if (!daten) {
      console.warn("Heatmap: ungültige Daten verworfen");
      return leer();
    }

    // Die IP-Adresse wird NICHT weitergegeben – nur Seite, Gerätetyp, Klicks und Scrolltiefe.
    const res = await fetch(ERFASSEN_URL, {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify(daten),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`Heatmap: erfassen fehlgeschlagen (HTTP ${res.status}) ${t.slice(0, 200)}`);
    }
  } catch (err) {
    console.error("Heatmap: erfassen fehlgeschlagen", err?.message);
  }
  return leer();
}

/* ------------------------------------------------------------------ GET: Auswertung für die Ansicht */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ip = ipAdresse(request);

  // Nach zu vielen Fehlversuchen wird der Token gar nicht mehr geprüft (Schutz vor Durchprobieren)
  if (zuViele(ip, "ansicht") || zuViele(ip, "token", false)) return nichtGefunden();
  if (!tokenGueltig(searchParams.get("token"))) {
    zuViele(ip, "token"); // nur Fehlversuche zählen
    return nichtGefunden();
  }

  const pfad = searchParams.get("pfad") || "";
  const geraet = searchParams.get("geraet") || "desktop";
  const tage = Math.round(Number(searchParams.get("tage") || 30));
  if (!pfadGueltig(pfad) || !HEATMAP_GERAETE.includes(geraet) || !(tage >= 1 && tage <= 450)) {
    return json({ fehler: "ungueltig" }, 400);
  }
  if (!konfiguriert()) return json({ fehler: "nicht_konfiguriert" }, 503);

  try {
    const res = await fetch(AUSWERTUNG_URL, {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({ pfad, geraet, tage }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`Heatmap: auswertung fehlgeschlagen (HTTP ${res.status}) ${t.slice(0, 200)}`);
      return json({ fehler: "backend" }, 502);
    }
    const m = (await res.json())?.message || {};
    const zahl = (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.round(Number(v)) : 0);
    const klicks = (Array.isArray(m.klicks) ? m.klicks : [])
      .filter((k) => k && selektorGueltig(k.sel))
      .slice(0, 5000)
      .map((k) => ({ sel: k.sel, rx: runden05(k.rx), ry: runden05(k.ry), anzahl: zahl(k.anzahl) }))
      .filter((k) => k.anzahl > 0);
    const scroll = (Array.isArray(m.scroll) ? m.scroll : [])
      .map((s) => ({ tiefe: runden10(s?.tiefe), anzahl: zahl(s?.anzahl) }))
      .filter((s) => s.tiefe > 0)
      .sort((a, b) => a.tiefe - b.tiefe);
    return json({ pfad, geraet, tage, aufrufe: zahl(m.aufrufe), klicks, scroll });
  } catch (err) {
    console.error("Heatmap: auswertung fehlgeschlagen", err?.message);
    return json({ fehler: "backend" }, 502);
  }
}
