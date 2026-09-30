// src/lib/prognose/format.js
//
// Zahlen- und Zeitdarstellung für die PV-Prognose – ohne toLocaleString, damit Server und Browser
// dieselben Zeichen liefern (Tausenderpunkt über zahlText aus src/data/kennzahlen.js).

import { zahlText } from "../../data/kennzahlen.js";

export const ZEITZONE = "Europe/Vienna";

/** Zahl mit Tausenderpunkt und Dezimalkomma, z. B. zahl(1234.5, 1) → "1.234,5". */
export function zahl(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const gerundet = Math.round(Math.abs(n) * 10 ** stellen) / 10 ** stellen;
  const [ganz, dez] = gerundet.toFixed(stellen).split(".");
  const vorzeichen = n < 0 && gerundet !== 0 ? "−" : "";
  return `${vorzeichen}${zahlText(ganz)}${dez ? `,${dez}` : ""}`;
}

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

let teiler;
function formatierer() {
  if (!teiler) {
    teiler = new Intl.DateTimeFormat("en-GB", {
      timeZone: ZEITZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      weekday: "short",
    });
  }
  return teiler;
}

/**
 * Wiener Ortszeit eines Zeitpunkts in Einzelteilen (nur Ziffern aus Intl, Wochentag selbst übersetzt).
 * Rückgabe: { datum: "YYYY-MM-DD", stunde, minute, tag, monat, wochentag: "Mi" }
 */
export function wienZeit(ms) {
  const teile = Object.fromEntries(formatierer().formatToParts(new Date(ms)).map((p) => [p.type, p.value]));
  const en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(teile.weekday);
  const stunde = Number(teile.hour) % 24;
  return {
    datum: `${teile.year}-${teile.month}-${teile.day}`,
    stunde,
    minute: Number(teile.minute),
    tag: Number(teile.day),
    monat: Number(teile.month),
    wochentag: WOCHENTAGE[en] ?? "",
  };
}

/** „Mi 1.10.“ */
export function tagKurz(ms) {
  const z = wienZeit(ms);
  return `${z.wochentag} ${z.tag}.${z.monat}.`;
}

/** „14 Uhr“ bzw. Intervall „14–15 Uhr“ */
export function uhrzeit(ms) {
  return `${wienZeit(ms).stunde} Uhr`;
}

export function intervall(vonMs, bisMs) {
  const b = wienZeit(bisMs).stunde;
  return `${wienZeit(vonMs).stunde}–${b === 0 ? 24 : b} Uhr`;
}
