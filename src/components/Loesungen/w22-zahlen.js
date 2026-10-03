// src/components/Loesungen/w22-zahlen.js
//
// Reine Hilfsfunktionen (Server und Browser) für die Zahlen-Bausteine der Lösungsseiten (Präfix w22).
// Ohne Intl, damit Server- und Browser-Ausgabe garantiert identisch sind (Hydration).

/** Zahl in österreichischer Schreibweise: Tausenderpunkt, Dezimalkomma. */
export function zahlFormat(n, stellen = 0, gruppieren = true) {
  const betrag = Math.abs(Number(n) || 0);
  const [ganz, rest] = (Math.round(betrag * 10 ** stellen) / 10 ** stellen).toFixed(stellen).split(".");
  const ganzText = gruppieren ? ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ganz;
  return `${n < 0 ? "−" : ""}${ganzText}${stellen ? `,${rest}` : ""}`;
}

/**
 * Zerlegt einen Anzeige-Text mit genau einer Zahl („≈ 34.360 €“, „14,64 ct“, „49 %“) in
 * { vor, wert, stellen, gruppieren, nach } – damit er hochzählen kann und am Ende exakt
 * wieder dem Original entspricht. Alles andere (Datumsangaben, Spannen, mehrere Zahlen) → null.
 */
export function zahlZerlegen(text) {
  if (typeof text !== "string") return null;
  const alle = text.match(/\d[\d.]*(?:,\d+)?/g);
  if (!alle || alle.length !== 1) return null;
  const m = text.match(/^([\s\S]*?)(\d[\d.]*(?:,\d+)?)([\s\S]*)$/);
  if (!m) return null;
  const [ganzRoh, dez] = m[2].split(",");
  const gruppieren = ganzRoh.includes(".");
  if (gruppieren && !/^\d{1,3}(\.\d{3})+$/.test(ganzRoh)) return null;
  const wert = Number(ganzRoh.replace(/\./g, "") + (dez ? `.${dez}` : ""));
  const stellen = dez ? dez.length : 0;
  if (!Number.isFinite(wert) || zahlFormat(wert, stellen, gruppieren) !== m[2]) return null;
  return { vor: m[1], wert, stellen, gruppieren, nach: m[3] };
}
