// src/app/forderungen/aktuell/rss.xml/route.js
//
// RSS 2.0 des Förder-Tickers (src/data/foerderTicker.js) – Einträge mit amtlicher Quelle.

import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { TICKER_STATUS, TICKER_TYPEN, tickerEintraege } from "@/data/foerderTicker";
import { BASE_URL } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** HTML-Inhalt eines Eintrags: Kurztext, eigener Text, Status, Quellen. */
function inhalt(e) {
  const quellen = [e.quelle, ...(e.quellen || [])].map((q) => `<li><a href="${esc(q.url)}">${esc(q.label)}</a></li>`).join("");
  return [
    `<p>${esc(e.kurz)}</p>`,
    e.text ? `<p>${esc(e.text)}</p>` : "",
    `<p><strong>Status:</strong> ${esc(TICKER_STATUS[e.status] || e.status)} · <strong>Art:</strong> ${esc(TICKER_TYPEN[e.typ] || e.typ)}${e.geprueftAm ? ` · geprüft am ${esc(e.geprueftAm)}` : ""}</p>`,
    `<p><strong>Quelle:</strong></p><ul>${quellen}</ul>`,
  ].join("");
}

export function GET() {
  const eintraege = tickerEintraege({ limit: 60 }).map((e) => ({
    titel: e.titel,
    url: `${BASE_URL}/forderungen/aktuell#${e.id}`,
    datum: `${e.datum}T08:00:00+02:00`,
    aktualisiert: e.geprueftAm ? `${e.geprueftAm}T08:00:00+02:00` : undefined,
    teaser: e.kurz,
    inhalt: inhalt(e),
    kategorie: TICKER_TYPEN[e.typ] || e.typ,
  }));

  return new Response(
    rss({
      titel: "Ökovolt Förder-Ticker Österreich – Photovoltaik, Speicher, Fristen",
      beschreibung: "Datierte Meldungen zu Förderungen, Fristen und Gesetzesänderungen für PV und Speicher in Österreich – jede mit amtlicher Quelle und Status.",
      pfad: "/forderungen/aktuell/rss.xml",
      eintraege,
    }),
    { headers: FEED_HEADERS.rss }
  );
}
