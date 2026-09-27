import QRCode from "qrcode";
import { herkunftFelder } from "@/lib/herkunftServer";
import { ipAdresse } from "@/lib/ipAdresse";
import { sitzungStarten, scanVerfuegbar, GUELTIG_MINUTEN } from "@/lib/scan/backend";
import { emailGueltig, gedrosselt, sauber } from "@/lib/rueckrufApi";
import { telefonNormalisieren } from "@/data/erreichbarkeit";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
const zahl = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};

/** Desktop: „Präzises Angebot anfordern“ → Sitzung + QR-Code für das Smartphone. */
export async function POST(request) {
  if (!scanVerfuegbar()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("scan:start", 40, 10 * 60_000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 2500)) return antwort({ fehler: "ungueltig" }, 400);
  if (e.einwilligung !== true) return antwort({ fehler: "einwilligung" }, 400);

  const name = sauber(e.name, 120);
  const email = sauber(e.email, 190).toLowerCase();
  const telefon = e.telefon ? telefonNormalisieren(e.telefon) : "";
  const plz = sauber(e.plz, 10);
  if (name.length < 2) return antwort({ fehler: "name" }, 400);
  if (!emailGueltig(email)) return antwort({ fehler: "email" }, 400);
  if (e.telefon && !telefon) return antwort({ fehler: "telefon" }, 400);
  if (plz && !/^\d{4,5}$/.test(plz)) return antwort({ fehler: "plz" }, 400);
  if (gedrosselt(`scan:start:${email}`, 5, 3600_000)) return antwort({ fehler: "zu_viele" }, 429);

  const r = e.rechner || {};
  try {
    const { token, gueltigBis } = await sitzungStarten({
      name,
      email,
      telefon: telefon || "",
      plz,
      quelle: sauber(e.quelle, 40) || "Website",
      seite: sauber(e.seite, 300),
      kwp: zahl(r.kwp, 0, 1000) ?? "",
      verbrauch: zahl(r.verbrauch, 0, 1_000_000) ?? "",
      speicher_kwh: zahl(r.speicherKwh, 0, 1000) ?? "",
      ausrichtung: sauber(r.ausrichtung, 20),
      neigung: sauber(r.neigung, 20),
      ...herkunftFelder(e.herkunft),
      ip_adresse: ipAdresse(request),
    });
    const origin = process.env.NODE_ENV === "production" ? "https://www.oekovolt.de" : new URL(request.url).origin;
    const url = `${origin}/scan/${token}`;
    const qrSvg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#03122b", light: "#ffffff" } });
    return antwort({ token, url, qrSvg, gueltigBis, gueltigMinuten: GUELTIG_MINUTEN });
  } catch {
    return antwort({ fehler: "backend" }, 502);
  }
}
