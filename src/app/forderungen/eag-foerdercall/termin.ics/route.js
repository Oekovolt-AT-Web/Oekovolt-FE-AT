// src/app/forderungen/eag-foerdercall/termin.ics/route.js
//
// Kalenderdatei (iCalendar) mit den Terminen des 3. EAG-Fördercalls 2026 und
// Erinnerungen – Erinnerung ohne Backend, funktioniert in Outlook, Google, Apple.

import { FOERDERCALL } from "@/lib/foerdercall";
import { BASE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** ISO-Zeitpunkt -> iCalendar-UTC-Format (20261008T150000Z). */
function ical(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Zeilen nach RFC 5545 auf höchstens 75 Oktette falten (UTF-8, ohne Zeichen zu zerteilen). */
const encoder = new TextEncoder();
function falten(zeile) {
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

const text = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function GET() {
  const seite = `${BASE_URL}/forderungen/eag-foerdercall`;
  const stempel = ical(`${FOERDERCALL.stand.iso}T08:00:00+02:00`);
  const termine = [
    {
      uid: "eag-call-2026-3-ticket@oekovolt.com",
      start: FOERDERCALL.ticketStart,
      ende: new Date(Date.parse(FOERDERCALL.ticketStart) + 60 * 60 * 1000).toISOString(),
      titel: "EAG-Fördercall: Ticketziehung ab 17 Uhr",
      beschreibung: `3. EAG-Fördercall 2026 für Photovoltaik und Speicher. Ticket nur über den offiziellen Link auf www.eag-abwicklungsstelle.at ziehen – mit Einspeisezählpunkt (33-stellig, AT00…) und E-Mail-Adresse. Antragseinreichung im EAG-Portal ab 09.10.2026, 8 Uhr. Checkliste: ${seite}`,
      alarme: [
        { vor: "-P1D", text: "Morgen 17 Uhr: EAG-Ticketziehung" },
        { vor: "-PT30M", text: "In 30 Minuten: EAG-Ticketziehung" },
      ],
    },
    {
      uid: "eag-call-2026-3-ende@oekovolt.com",
      start: new Date(Date.parse(FOERDERCALL.ende) - 60 * 60 * 1000).toISOString(),
      ende: FOERDERCALL.ende,
      titel: "EAG-Fördercall endet um 23:59 Uhr",
      beschreibung: `Bis 22.10.2026, 23:59 Uhr muss der Förderantrag im EAG-Portal eingereicht sein – sonst verfällt ein gezogenes Ticket. ${seite}`,
      alarme: [{ vor: "-P2D", text: "In 2 Tagen endet der EAG-Fördercall" }],
    },
  ];

  const zeilen = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oekovolt Solartechnik GmbH//EAG-Foerdercall//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:EAG-Fördercall Oktober 2026",
  ];
  for (const t of termine) {
    zeilen.push(
      "BEGIN:VEVENT",
      `UID:${t.uid}`,
      `DTSTAMP:${stempel}`,
      `DTSTART:${ical(t.start)}`,
      `DTEND:${ical(t.ende)}`,
      `SUMMARY:${text(t.titel)}`,
      `DESCRIPTION:${text(t.beschreibung)}`,
      `URL:${seite}`
    );
    for (const a of t.alarme) {
      zeilen.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${text(a.text)}`, `TRIGGER:${a.vor}`, "END:VALARM");
    }
    zeilen.push("END:VEVENT");
  }
  zeilen.push("END:VCALENDAR");

  return new Response(zeilen.map(falten).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="eag-foerdercall-oktober-2026.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
