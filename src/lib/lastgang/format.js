// src/lib/lastgang/format.js
//
// Zahlen- und Datumsformat der Lastgang-Analyse – bewusst OHNE Intl/toLocaleString,
// damit Server und Browser (und Node im Test) exakt dieselben Zeichen erzeugen:
// Tausenderpunkt, Dezimalkomma wie auf der ganzen Site (vgl. zahlText in src/data/kennzahlen.js).

/** 1234567.891 → „1.234.567,9“ (stellen = Nachkommastellen) */
export function zahl(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const neg = n < 0;
  const faktor = Math.pow(10, stellen);
  const gerundet = Math.round(Math.abs(n) * faktor) / faktor;
  const [ganz, rest = ""] = gerundet.toFixed(stellen).split(".");
  const mitPunkten = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const text = stellen > 0 ? `${mitPunkten},${rest}` : mitPunkten;
  return neg && gerundet !== 0 ? `−${text}` : text;
}

/** Prozent aus Anteil 0–1: 0.834 → „83 %“ */
export const prozent = (anteil, stellen = 0) => `${zahl(anteil * 100, stellen)} %`;

/** Energiemenge kurz: 12.345 kWh → „12,3 MWh“, 884.273 → „884 MWh“, ab 10 GWh in GWh; unter 10.000 in kWh */
export function energie(kwh) {
  if (!Number.isFinite(kwh)) return "–";
  if (kwh >= 1e7) return `${zahl(kwh / 1e6, 1)} GWh`;
  if (kwh >= 1e5) return `${zahl(kwh / 1000)} MWh`;
  if (kwh >= 1e4) return `${zahl(kwh / 1000, 1)} MWh`;
  return `${zahl(kwh)} kWh`;
}

/** Leistung: < 10 kW mit einer Nachkommastelle */
export const leistung = (kw) => (Number.isFinite(kw) ? `${zahl(kw, kw < 10 ? 1 : 0)} kW` : "–");

export const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
export const WOCHENTAGE_LANG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
export const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const zwei = (n) => String(n).padStart(2, "0");

/** Zeitstempel (Wanduhr als UTC-ms) → „14.03.2025“ */
export function datum(ms) {
  const d = new Date(ms);
  return `${zwei(d.getUTCDate())}.${zwei(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

/** Zeitstempel (Wanduhr als UTC-ms) → „14.03.2025, 07:15“ */
export function datumZeit(ms) {
  const d = new Date(ms);
  return `${datum(ms)}, ${zwei(d.getUTCHours())}:${zwei(d.getUTCMinutes())}`;
}

/** Wochentag Mo = 0 … So = 6 eines Wanduhr-Zeitstempels */
export const wochentag = (ms) => (new Date(ms).getUTCDay() + 6) % 7;

/** Uhrzeit aus Viertelstunden-Index 0–95 → „07:15“ */
export const uhrzeit = (slot, proStunde = 4) => `${zwei(Math.floor(slot / proStunde))}:${zwei(((slot % proStunde) * 60) / proStunde)}`;
