// src/lib/rechner/angebot.js
// Baut den Link "Angebot mit diesen Werten" für den Angebots-Konfigurator.

/**
 * @param {object} w { kwp, verbrauch, speicher, wallbox, waermepumpe }
 * @returns {string} z. B. /angebot?kwp=10&verbrauch=4500&speicher=8&wallbox=1
 */
export function angebotUrl({ kwp, verbrauch, speicher, wallbox, waermepumpe } = {}) {
  const q = new URLSearchParams();
  if (kwp > 0) q.set("kwp", String(Math.round(kwp * 10) / 10));
  if (verbrauch > 0) q.set("verbrauch", String(Math.round(verbrauch)));
  if (speicher > 0) q.set("speicher", String(Math.round(speicher)));
  if (wallbox) q.set("wallbox", "1");
  if (waermepumpe) q.set("waermepumpe", "1");
  const s = q.toString();
  return s ? `/angebot?${s}` : "/angebot";
}
