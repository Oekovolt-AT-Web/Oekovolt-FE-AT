import { NextResponse } from "next/server";
import { herkunftFelder, herkunftZeile } from "@/lib/herkunftServer";
import { TERMIN_ARTEN, THEMEN, slotsFuerArt, telefonNormalisieren } from "@/data/erreichbarkeit";
import { HEADERS_PRIVAT, alsKontaktanfrage, berlinText, emailGueltig, frappeKonfiguriert, frappeKontakt, gedrosselt, sauber } from "@/lib/rueckrufApi";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => NextResponse.json(body, { status, headers: HEADERS_PRIVAT });

/**
 * Belegte Zeiten aus dem Backoffice. `live: false`, wenn der DocType
 * „Beratungstermin" (noch) nicht erreichbar ist – dann gelten Buchungen als
 * unverbindliche Terminwünsche.
 */
async function belegung(art) {
  try {
    const r = await frappeKontakt("beratungstermin", "belegte_zeiten", { art });
    return { live: true, belegt: Array.isArray(r) ? r.filter((x) => x?.von && x?.bis) : [] };
  } catch {
    return { live: false, belegt: [] };
  }
}

/** Freie Termine je Art: GET /api/termin?art=video */
export async function GET(request) {
  const art = new URL(request.url).searchParams.get("art") || "video";
  if (!TERMIN_ARTEN.some((a) => a.id === art)) return antwort({ fehler: "art" }, 400);
  if (!frappeKonfiguriert()) return antwort({ verfuegbar: false, live: false, tage: [] });

  const { live, belegt } = await belegung(art);
  return antwort({ verfuegbar: true, live, tage: slotsFuerArt(art, belegt) });
}

export async function POST(request) {
  if (!frappeKonfiguriert()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("termin:global", 40, 10 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 4000)) return antwort({ fehler: "ungueltig" }, 400);
  if (e.einwilligung !== true) return antwort({ fehler: "einwilligung" }, 400);

  const art = TERMIN_ARTEN.find((a) => a.id === e.art);
  if (!art) return antwort({ fehler: "art" }, 400);

  const name = sauber(e.name, 140);
  const email = sauber(e.email, 190).toLowerCase();
  const telefon = telefonNormalisieren(e.telefon);
  const plz = sauber(e.plz, 10);
  const adresse = sauber(e.adresse, 300);
  const thema = THEMEN.includes(e.thema) ? e.thema : "";
  const nachricht = sauber(e.nachricht, 2000);

  const felder = [];
  if (name.length < 2) felder.push("name");
  if (!emailGueltig(email)) felder.push("email");
  if (!telefon) felder.push("telefon");
  if (!/^\d{4,5}$/.test(plz)) felder.push("plz");
  if (art.mitAdresse && adresse.length < 5) felder.push("adresse");
  if (felder.length) return antwort({ fehler: "felder", felder }, 400);

  if (gedrosselt(`termin:${email}`, 3, 24 * 60 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  // Slot serverseitig gegen aktuelle Belegung prüfen
  const { live, belegt } = await belegung(art.id);
  if (!slotsFuerArt(art.id, belegt).some((t) => t.slots.some((s) => s.start === e.start))) return antwort({ fehler: "belegt" }, 409);

  const start = new Date(e.start);
  const ende = new Date(start.getTime() + art.dauer * 60000);
  const basis = { ok: true, start: start.toISOString(), ende: ende.toISOString(), art: art.id };

  if (live) {
    try {
      const r = await frappeKontakt("beratungstermin", "create_termin", {
        art: art.titel,
        start: basis.start,
        ende: basis.ende,
        name,
        email,
        telefon,
        plz,
        adresse: art.mitAdresse ? adresse : "",
        thema,
        nachricht,
        seite: sauber(e.seite, 300),
        ...herkunftFelder(e.herkunft),
      });
      return antwort({ ...basis, bestaetigt: true, referenz: r?.referenz || null });
    } catch (fehler) {
      if (fehler.status === 409 || fehler.exc === "TerminBelegt") return antwort({ fehler: "belegt" }, 409);
      // sonst: Übergangslösung unten
    }
  }

  try {
    await alsKontaktanfrage({
      name,
      email,
      telefon,
      plzOrt: plz,
      strasse: art.mitAdresse ? adresse : "",
      nachricht: [`TERMINWUNSCH: ${art.titel} (${art.dauer} Min.)`, `Wunschtermin: ${berlinText(basis.start)}`, thema && `Thema: ${thema}`, nachricht && `\n${nachricht}`, herkunftZeile(e.herkunft)]
        .filter(Boolean)
        .join("\n"),
    });
    return antwort({ ...basis, bestaetigt: false, referenz: null });
  } catch {
    return antwort({ fehler: "backend" }, 502);
  }
}
