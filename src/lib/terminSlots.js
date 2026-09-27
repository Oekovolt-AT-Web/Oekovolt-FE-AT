// src/lib/terminSlots.js
//
// Kalender-Tage aus termin.get_kalender (siehe terminKalender.js) in buchbare Slots umwandeln.
// Im Browser nutzbar (keine Zugangsdaten) – für /termin und das Rückruf-Widget.

/** Minuten zwischen UTC und Berliner Zeit zu einem Zeitpunkt (60 oder 120) */
function berlinOffset(date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value])
  );
  const alsUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return (alsUtc - date.getTime()) / 60000;
}

/** "2026-09-25" + "08:30" (Berliner Zeit) → ISO-Zeitstempel */
export function berlinZuIso(ymd, zeit) {
  const [y, m, d] = ymd.split("-").map(Number);
  const [h, mi] = zeit.split(":").map(Number);
  const schaetzung = Date.UTC(y, m - 1, d, h, mi);
  return new Date(schaetzung - berlinOffset(new Date(schaetzung)) * 60000).toISOString();
}

/** Tage aus get_kalender: freie und belegte Zeiten, belegte markiert (frei: false) */
export function tageAusApi(apiTage) {
  return apiTage.map((t) => {
    const frei = new Set(t.frei || []);
    const zeiten = [...new Set([...(t.frei || []), ...(t.belegt || [])])].sort();
    return {
      ymd: t.datum,
      label: t.label,
      status: t.status,
      buchbar: !!t.buchbar,
      slots: zeiten.map((z) => ({ start: berlinZuIso(t.datum, z), zeit: z, frei: frei.has(z) })),
    };
  });
}
