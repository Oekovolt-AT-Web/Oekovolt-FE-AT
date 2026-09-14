import { FOTO_FELDER, fotoSpeichern, tokenGueltig } from "@/lib/scan/backend";
import { gedrosselt } from "@/lib/rueckrufApi";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;
const PRIVAT = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const fehler = (code, status) => Response.json({ fehler: code }, { status, headers: PRIVAT });

/** Dateityp an den ersten Bytes erkennen – der Browser-Angabe wird nicht vertraut. */
function bildTyp(b) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP") return "image/webp";
  if (b.slice(4, 8).toString() === "ftyp" && /heic|heix|hevc|mif1|msf1/.test(b.slice(8, 12).toString())) return "image/heic";
  if (b.slice(0, 4).toString() === "%PDF") return "application/pdf";
  return null;
}

export async function POST(request, { params }) {
  const { token } = await params;
  if (!tokenGueltig(token)) return fehler("ungueltig", 404);
  if (gedrosselt(`scan:foto:${token}`, 25, 45 * 60_000)) return fehler("zu_viele", 429);

  const laenge = Number(request.headers.get("content-length") || 0);
  if (laenge > MAX_BYTES + 100_000) return fehler("zu_gross", 413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return fehler("ungueltig", 400);
  }
  const feld = String(form.get("feld") || "");
  const datei = form.get("datei");
  if (!FOTO_FELDER.includes(feld) || !datei || typeof datei === "string") return fehler("ungueltig", 400);
  if (datei.size > MAX_BYTES) return fehler("zu_gross", 413);

  const buffer = Buffer.from(await datei.arrayBuffer());
  const mime = bildTyp(buffer);
  // PDF nur für die Stromrechnung (z. B. Online-Rechnung aus dem Kundenportal)
  if (!mime || (mime === "application/pdf" && !feld.startsWith("rechnung"))) return fehler("dateityp", 415);

  try {
    await fotoSpeichern(token, feld, buffer, mime);
    return Response.json({ ok: true, feld }, { headers: PRIVAT });
  } catch (e) {
    return fehler(e.status === 410 ? "sitzung" : "backend", e.status === 410 ? 410 : 502);
  }
}
