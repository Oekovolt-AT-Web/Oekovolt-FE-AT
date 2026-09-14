import { NextResponse } from "next/server";
import { herkunftFelder, herkunftZeile } from "@/lib/herkunftServer";
import { THEMEN, freieSlots, oeffnungsStatus, telefonNormalisieren } from "@/data/erreichbarkeit";
import {
  HEADERS_PRIVAT,
  alsKontaktanfrage,
  berlinText,
  cloudtalkKonfiguriert,
  cloudtalkRueckruf,
  frappeKonfiguriert,
  frappeKontakt,
  freieAgenten,
  gedrosselt,
  sauber,
} from "@/lib/rueckrufApi";

export const dynamic = "force-dynamic";

const antwort = (body, status = 200) => NextResponse.json(body, { status, headers: HEADERS_PRIVAT });

// Wunschzeiten für Rückrufe: 15-Minuten-Gespräche im 30-Minuten-Raster, 7 Tage voraus
const wunschzeiten = (jetzt = new Date()) => freieSlots({ dauer: 15, raster: 30, vorlaufMinuten: 45, tage: 7, jetzt });

/** Status für das Widget: geöffnet? Sofort-Rückruf möglich? Wunschzeiten. */
export async function GET() {
  const status = oeffnungsStatus();
  const verfuegbar = frappeKonfiguriert() || cloudtalkKonfiguriert();
  const sofort = status.offen && (await freieAgenten()).length > 0;
  return antwort({
    verfuegbar,
    offen: status.offen,
    titel: status.titel,
    detail: status.detail,
    sofort,
    // Zusage, die das Widget anzeigt
    zusage: sofort ? "in unter 60 Sekunden" : status.offen ? "in der Regel innerhalb von 15 Minuten" : null,
    wunschzeiten: wunschzeiten().slice(0, 5),
  });
}

export async function POST(request) {
  if (!frappeKonfiguriert() && !cloudtalkKonfiguriert()) return antwort({ fehler: "nicht_konfiguriert" }, 503);
  if (gedrosselt("rueckruf:global", 60, 10 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return antwort({ fehler: "ungueltig" }, 400);
  }

  // Honeypot und Mindest-Ausfülldauer gegen Bots
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 2500)) return antwort({ fehler: "ungueltig" }, 400);
  if (e.einwilligung !== true) return antwort({ fehler: "einwilligung" }, 400);

  const telefon = telefonNormalisieren(e.telefon);
  if (!telefon) return antwort({ fehler: "telefon" }, 400);

  // Schutz vor Belästigung/Missbrauch: je Nummer max. 3 Anfragen pro Stunde
  if (gedrosselt(`rueckruf:${telefon}`, 3, 60 * 60 * 1000)) return antwort({ fehler: "zu_viele" }, 429);

  const status = oeffnungsStatus();
  let wunschzeit = null;
  if (e.wunschzeit) {
    const erlaubt = wunschzeiten().some((t) => t.slots.some((s) => s.start === e.wunschzeit));
    if (!erlaubt) return antwort({ fehler: "zeit" }, 400);
    wunschzeit = e.wunschzeit;
  } else if (!status.offen) {
    return antwort({ fehler: "geschlossen" }, 400);
  }

  const daten = {
    telefon,
    name: sauber(e.name, 140),
    thema: THEMEN.includes(e.thema) ? e.thema : "",
    wunschzeit: wunschzeit || "",
    seite: sauber(e.seite, 300),
    modus: wunschzeit ? "Wunschzeit" : "Sofort",
    ...herkunftFelder(e.herkunft),
  };

  // Sofort-Rückruf über CloudTalk, wenn jemand frei ist
  if (!wunschzeit) {
    const agenten = await freieAgenten();
    for (const agent of agenten.slice(0, 2)) {
      try {
        await cloudtalkRueckruf(agent, telefon);
        daten.modus = "CloudTalk automatisch";
        daten.cloudtalk_agent = agent;
        break;
      } catch {
        /* nächsten Agenten versuchen */
      }
    }
  }

  let referenz = null;
  if (frappeKonfiguriert()) {
    try {
      referenz = (await frappeKontakt("rueckruf", "create_rueckruf", daten))?.referenz || null;
    } catch {
      try {
        await alsKontaktanfrage({
          name: daten.name,
          telefon,
          nachricht: [
            `RÜCKRUF-ANFRAGE (${daten.modus})`,
            wunschzeit ? `Wunschzeit: ${berlinText(wunschzeit)}` : "Bitte so schnell wie möglich zurückrufen.",
            daten.thema && `Thema: ${daten.thema}`,
            daten.seite && `Seite: ${daten.seite}`,
            herkunftZeile(e.herkunft),
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch {
        // Läuft der Anruf bereits, ist die Anfrage trotzdem erfolgreich.
        if (daten.modus !== "CloudTalk automatisch") return antwort({ fehler: "backend" }, 502);
      }
    }
  }

  return antwort({ ok: true, modus: daten.modus, wunschzeit, referenz });
}
