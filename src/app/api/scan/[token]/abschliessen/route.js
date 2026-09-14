import { PFLICHT, sitzungAbschliessen, sitzungStatus, tokenGueltig } from "@/lib/scan/backend";
import { sauber } from "@/lib/rueckrufApi";

export const dynamic = "force-dynamic";

const PRIVAT = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/** Smartphone: „Daten an PC senden“. */
export async function POST(request, { params }) {
  const { token } = await params;
  if (!tokenGueltig(token)) return Response.json({ fehler: "ungueltig" }, { status: 404, headers: PRIVAT });

  let e;
  try {
    e = await request.json();
  } catch {
    return Response.json({ fehler: "ungueltig" }, { status: 400, headers: PRIVAT });
  }
  if (e.einwilligung !== true) return Response.json({ fehler: "einwilligung" }, { status: 400, headers: PRIVAT });

  const s = await sitzungStatus(token).catch(() => null);
  if (!s || !s.gueltig) return Response.json({ fehler: "sitzung" }, { status: 410, headers: PRIVAT });
  if (PFLICHT.some((f) => !s.fotos?.[f])) return Response.json({ fehler: "pflicht" }, { status: 400, headers: PRIVAT });

  const stand = String(e.zaehlerstand ?? "").replace(",", ".").replace(/[^\d.]/g, "");
  try {
    await sitzungAbschliessen(token, {
      zaehlerstand: stand ? Number(stand) : null,
      zaehlerstandOcr: sauber(e.zaehlerstandOcr, 40),
      kiEinwilligung: e.kiEinwilligung === true,
    });
    return Response.json({ ok: true }, { headers: PRIVAT });
  } catch {
    return Response.json({ fehler: "backend" }, { status: 502, headers: PRIVAT });
  }
}
