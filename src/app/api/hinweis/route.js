import { NextResponse } from "next/server";
import { frappeHinweis, gedrosselt, hinweisKonfiguriert, sauber, HEADERS_PRIVAT } from "@/lib/hinweisApi";
import { KATEGORIEN, BEZIEHUNG } from "@/data/hinweisgeber";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => NextResponse.json(body, { status, headers: HEADERS_PRIVAT });

/**
 * Neue Meldung an die interne Meldestelle.
 * Rückgabe: { referenz, zugangsschluessel } – der Schlüssel wird nur dieses
 * eine Mal übermittelt; im Backend liegt ausschließlich sein Hash.
 */
export async function POST(request) {
  if (!hinweisKonfiguriert()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("meldung", 40, 10 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }

  // Honeypot und Mindest-Ausfülldauer gegen Bots
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 4000)) return antwort({ fehler: "ungueltig" }, 400);

  const anonym = e.anonym !== false;
  const daten = {
    kategorie: KATEGORIEN.some((k) => k.id === e.kategorie) ? e.kategorie : "Sonstiges",
    beziehung: BEZIEHUNG.includes(e.beziehung) ? e.beziehung : "Keine Angabe",
    betreff: sauber(e.betreff, 140),
    beschreibung: sauber(e.beschreibung, 20000),
    zeitraum: sauber(e.zeitraum, 140),
    ort: sauber(e.ort, 140),
    beteiligte: sauber(e.beteiligte, 2000),
    bereits_gemeldet: sauber(e.bereitsGemeldet, 140),
    anonym: anonym ? 1 : 0,
    name_meldende: anonym ? "" : sauber(e.name, 140),
    email: anonym ? "" : sauber(e.email, 140),
    telefon: anonym ? "" : sauber(e.telefon, 60),
  };

  if (daten.betreff.length < 5 || daten.beschreibung.length < 30 || e.datenschutz !== true) {
    return antwort({ fehler: "unvollstaendig" }, 400);
  }

  try {
    const r = await frappeHinweis("create_hinweis", daten);
    if (!r?.referenz || !r?.zugangsschluessel) throw new Error("antwort");
    return antwort({ referenz: r.referenz, zugangsschluessel: r.zugangsschluessel });
  } catch {
    return antwort({ fehler: "backend" }, 502);
  }
}
