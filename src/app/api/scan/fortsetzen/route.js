import QRCode from "qrcode";
import { fortsetzenStarten, scanVerfuegbar, tokenGueltig, GUELTIG_MINUTEN } from "@/lib/scan/backend";
import { gedrosselt } from "@/lib/rueckrufApi";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

/** Fortsetzen-Link aus der Erinnerungs-E-Mail → neuer Handy-Code + QR-Code. */
export async function POST(request) {
  if (!scanVerfuegbar()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("scan:fortsetzen", 60, 10 * 60_000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }
  if (!tokenGueltig(e.token)) return antwort({ fehler: "abgelaufen" }, 410);
  if (gedrosselt(`scan:fortsetzen:${e.token}`, 10, 3600_000)) return antwort({ fehler: "zu_viele" }, 429);

  try {
    const s = await fortsetzenStarten(e.token);
    if (!s) return antwort({ fehler: "abgelaufen" }, 410);
    const origin = process.env.NODE_ENV === "production" ? "https://www.oekovolt.com" : new URL(request.url).origin;
    const url = `${origin}/scan/${s.token}`;
    const qrSvg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#03122b", light: "#ffffff" } });
    return antwort({ url, qrSvg, gueltigBis: s.gueltigBis, gueltigMinuten: GUELTIG_MINUTEN });
  } catch {
    return antwort({ fehler: "backend" }, 502);
  }
}
