import { NextResponse } from "next/server";
import { frappeHinweis, gedrosselt, hinweisKonfiguriert, sauber, HEADERS_PRIVAT } from "@/lib/hinweisApi";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => NextResponse.json(body, { status, headers: HEADERS_PRIVAT });

/**
 * Anonymes Postfach.
 * aktion "abrufen":   { referenz, schluessel }            -> Status + Nachrichtenverlauf
 * aktion "antworten": { referenz, schluessel, nachricht } -> neue Nachricht an die Meldestelle
 *
 * Falsche Zugangsdaten liefern bewusst dieselbe Antwort wie eine unbekannte
 * Fall-Nummer, damit sich keine gültigen Nummern erraten lassen.
 */
export async function POST(request) {
  if (!hinweisKonfiguriert()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("postfach", 120, 10 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }

  const referenz = sauber(e.referenz, 40).toUpperCase();
  const schluessel = sauber(e.schluessel, 80);
  if (!/^HW-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(referenz) || schluessel.length < 16) {
    return antwort({ fehler: "zugang" }, 401);
  }

  try {
    if (e.aktion === "antworten") {
      const nachricht = sauber(e.nachricht, 10000);
      if (nachricht.length < 2) return antwort({ fehler: "unvollstaendig" }, 400);
      const r = await frappeHinweis("add_nachricht", { referenz, schluessel, nachricht });
      if (!r) return antwort({ fehler: "zugang" }, 401);
      return antwort(r);
    }
    const r = await frappeHinweis("get_postfach", { referenz, schluessel });
    if (!r) return antwort({ fehler: "zugang" }, 401);
    return antwort(r);
  } catch (err) {
    if (err.status === 401 || err.status === 403 || err.status === 404) return antwort({ fehler: "zugang" }, 401);
    return antwort({ fehler: "backend" }, 502);
  }
}
