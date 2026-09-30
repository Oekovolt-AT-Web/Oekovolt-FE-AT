// src/lib/lastgang/beispiel.js
//
// Erzeugt den SYNTHETISCHEN Beispiel-Lastgang unter public/beispiele/lastgang-beispiel.csv.
// Keine Messdaten eines echten Betriebs: fiktiver Gewerbebetrieb mit zwei Schichten (Mo–Fr),
// Samstag-Vormittag, Betriebsurlaub im August und zwischen den Feiertagen, Anlaufspitzen am
// Schichtbeginn. Deterministisch (fester Zufallsstartwert) – gleiche Datei bei jedem Lauf.
//
// Erzeugen:  node -e "import('./src/lib/lastgang/beispiel.js').then(m=>require('fs').writeFileSync('public/beispiele/lastgang-beispiel.csv', m.beispielCsv()))"

import { tagTyp } from "./analyse.js";
import { utcZuWand } from "./parser.js";

function zufall(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const zwei = (n) => String(n).padStart(2, "0");
const kwhText = (v) => v.toFixed(3).replace(".", ",");

/** Leistung (kW) des fiktiven Betriebs zu einer Wanduhr-Zeit */
function leistung(wand, r, tagesZufall) {
  const d = new Date(wand);
  const monat = d.getUTCMonth();
  const tagImMonat = d.getUTCDate();
  const h = d.getUTCHours() + d.getUTCMinutes() / 60;
  const typ = tagTyp(wand);
  const winter = [1.12, 1.1, 1.05, 0.98, 0.95, 1.0, 1.04, 1.03, 0.97, 1.0, 1.06, 1.1][monat];
  let p = 36 + 5 * Math.sin((h / 24) * 2 * Math.PI) + r() * 5; // Grundlast: IT, Kühlung, Druckluft
  const urlaub = (monat === 7 && tagImMonat >= 4 && tagImMonat <= 15) || (monat === 11 && tagImMonat >= 24) || (monat === 0 && tagImMonat <= 6);
  if (typ === 0 && !urlaub) {
    if (h >= 5.75 && h < 6) p += 60;
    else if (h >= 6 && h < 22) {
      let prod = 125 * tagesZufall;
      if (h >= 12 && h < 12.5) prod *= 0.55; // Mittagspause Frühschicht
      if (h >= 18 && h < 18.5) prod *= 0.6; // Pause Spätschicht
      if (h >= 14 && h < 14.25) prod *= 0.85; // Schichtwechsel
      p += prod * winter + r() * 18;
      if (h >= 6 && h < 6.5) p += 55 + r() * 40; // Anlaufspitze Schichtbeginn
      if (h >= 9.5 && h < 11.5 && tagesZufall > 1.08) p += 45 * r(); // Auftragsspitze
    } else if (h >= 22 && h < 22.5) p += 30;
  } else if (typ === 1 && !urlaub && h >= 6 && h < 12) {
    p += 55 + r() * 12; // Samstag Vormittag
  } else if (urlaub && typ === 0 && h >= 7 && h < 15) {
    p += 20 + r() * 6; // Instandhaltung
  }
  return Math.max(12, p);
}

/**
 * CSV-Text des Beispiel-Lastgangs (Jahr 2025, Viertelstundenwerte, Zeitstempel in österreichischer
 * Ortszeit, Umstellungsstunden wie im echten Export: im März fehlt 02:00–02:45, im Oktober doppelt).
 */
export function beispielCsv(jahr = 2025) {
  const r = zufall(20250101);
  const zeilen = [
    "SYNTHETISCHER BEISPIEL-LASTGANG - keine echten Messdaten;;;",
    "Fiktiver Gewerbebetrieb (2 Schichten Mo-Fr) zum Ausprobieren der Lastgang-Analyse auf oekovolt.com;;;",
    "Datum;Zeit von;Zeit bis;Verbrauch [kWh]",
  ];
  // UTC-Raster über das Ortszeit-Jahr
  const start = Date.UTC(jahr - 1, 11, 31, 23, 0); // 01.01. 00:00 MEZ
  const ende = Date.UTC(jahr, 11, 31, 23, 0);
  let tagesZufall = 1;
  let letzterTag = -1;
  for (let utc = start; utc < ende; utc += 15 * 60000) {
    const wand = utcZuWand(utc);
    const d = new Date(wand);
    if (d.getUTCDate() !== letzterTag) {
      letzterTag = d.getUTCDate();
      tagesZufall = 0.88 + r() * 0.26;
    }
    const kw = leistung(wand, r, tagesZufall);
    const bis = new Date(wand + 15 * 60000);
    zeilen.push(
      `${zwei(d.getUTCDate())}.${zwei(d.getUTCMonth() + 1)}.${d.getUTCFullYear()};${zwei(d.getUTCHours())}:${zwei(d.getUTCMinutes())};${zwei(bis.getUTCHours())}:${zwei(bis.getUTCMinutes())};${kwhText(kw / 4)}`
    );
  }
  return zeilen.join("\r\n") + "\r\n";
}
