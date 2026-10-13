// src/app/forderungen/fristen.ics/route.js
//
// Kalenderdatei (iCalendar, RFC 5545) mit allen Förder-Fristen aus src/data/foerderFristen.js.
// ?zielgruppe=betrieb|landwirtschaft|gemeinde|privat filtert; ohne Parameter alle Termine.
// UID je Termin stabil (foerderfrist-<id>@oekovolt.com) – erneuter Import aktualisiert statt dupliziert.
// Ganztägige Termine (VALUE=DATE), Einreich- und Gebotstermine mit Erinnerung 7 Tage vorher.

import { FOERDER_FRISTEN, FRISTEN_ARTEN, FRISTEN_ZIELGRUPPEN } from "@/data/foerderFristen";
import { BASE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

/** Zeilen nach RFC 5545 auf höchstens 75 Oktette falten (UTF-8, ohne Zeichen zu zerteilen). */
export function falten(zeile) {
  const teile = [];
  let aktuell = "";
  let bytes = 0;
  for (const zeichen of zeile) {
    const n = encoder.encode(zeichen).length;
    const grenze = teile.length ? 74 : 75; // Folgezeilen beginnen mit einem Leerzeichen
    if (bytes + n > grenze) {
      teile.push(aktuell);
      aktuell = "";
      bytes = 0;
    }
    aktuell += zeichen;
    bytes += n;
  }
  teile.push(aktuell);
  return teile.join("\r\n ");
}

/** TEXT-Wert nach RFC 5545 maskieren. */
export const text = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** "2026-10-31" -> "20261031" */
const datum = (iso) => iso.replace(/-/g, "");

/** Folgetag als ISO (DTEND ist bei ganztägigen Terminen exklusiv). */
function folgetag(iso) {
  const [j, m, t] = iso.split("-").map(Number);
  return new Date(Date.UTC(j, m - 1, t + 1)).toISOString().slice(0, 10);
}

/** Kalender für eine Zielgruppe (oder alle) als iCalendar-Text. */
export function fristenKalender(zielgruppe) {
  const zg = FRISTEN_ZIELGRUPPEN.find((z) => z.id === zielgruppe) || null;
  const fristen = FOERDER_FRISTEN.filter((f) => !zg || f.zielgruppen.some((g) => zg.gruppen.includes(g))).sort((a, b) => (a.datum < b.datum ? -1 : 1));
  const stand = fristen.reduce((m, f) => (f.geprueftAm > m ? f.geprueftAm : m), "2026-01-01");
  const stempel = `${datum(stand)}T060000Z`;
  const name = `Ökovolt Förder-Fristen Österreich${zg ? ` – ${zg.label}` : ""}`;

  const zeilen = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oekovolt Solartechnik GmbH//Foerder-Fristen AT//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${text(name)}`,
    "X-WR-TIMEZONE:Europe/Vienna",
    `X-WR-CALDESC:${text("Fristen für PV- und Speicherförderung, Steuer und Energierecht in Österreich – jeder Termin mit amtlicher Quelle. Orientierung, verbindlich sind die Richtlinien der Förderstellen.")}`,
    "REFRESH-INTERVAL;VALUE=DURATION:P1W",
    `URL:${BASE_URL}/forderungen/fristen`,
  ];

  for (const f of fristen) {
    const seite = `${BASE_URL}${f.seite || "/forderungen/fristen"}`;
    const titel = `${f.voraussichtlich ? "Voraussichtlich: " : ""}${f.titel}`;
    const beschreibung = [f.kurz, f.pruefen ? "Hinweis: nur über Sekundärquellen belegt – bitte bei der Förderstelle prüfen." : "", `Quelle: ${f.quelle.label} – ${f.quelle.url}`, `Details: ${seite}`, `Geprüft am ${f.geprueftAm}.`].filter(Boolean).join("\n");
    zeilen.push(
      "BEGIN:VEVENT",
      `UID:foerderfrist-${f.id}@oekovolt.com`,
      `DTSTAMP:${stempel}`,
      `DTSTART;VALUE=DATE:${datum(f.datum)}`,
      `DTEND;VALUE=DATE:${datum(folgetag(f.bis || f.datum))}`,
      `SUMMARY:${text(titel)}`,
      `DESCRIPTION:${text(beschreibung)}`,
      `CATEGORIES:${text(FRISTEN_ARTEN[f.art] || f.art)},${text(f.bundesland === "bund" ? "Bund" : f.bundesland)}`,
      `URL:${seite}`,
      `STATUS:${f.voraussichtlich ? "TENTATIVE" : "CONFIRMED"}`,
      "TRANSP:TRANSPARENT",
      `LAST-MODIFIED:${datum(f.geprueftAm)}T060000Z`
    );
    if (f.art === "einreichfrist" || f.art === "gebotstermin") {
      zeilen.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${text(`In 7 Tagen: ${f.titel}`)}`, "TRIGGER:-P7D", "END:VALARM");
    }
    zeilen.push("END:VEVENT");
  }
  zeilen.push("END:VCALENDAR");
  return zeilen.map(falten).join("\r\n") + "\r\n";
}

export function GET(request) {
  const url = new URL(request.url);
  const gewuenscht = url.searchParams.get("zielgruppe") || "";
  const zielgruppe = FRISTEN_ZIELGRUPPEN.some((z) => z.id === gewuenscht) ? gewuenscht : "";
  return new Response(fristenKalender(zielgruppe), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="oekovolt-foerder-fristen${zielgruppe ? `-${zielgruppe}` : ""}.ics"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
