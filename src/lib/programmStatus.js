// src/lib/programmStatus.js
//
// Datumsgesteuerter Status eines Förderprogramms – reine Funktion ohne React,
// server- und clientfähig, mit node testbar (scripts/foerder-fristen.test.mjs).
//
// Genutzt von LandesDetails.js, dem Förder-Check (programme.js), der Status-
// Tabelle (C02) und den Landesseiten (C08). Die Berechnung läuft im Browser beim
// Aufruf (Muster HinweisLeiste.js), damit ein Statuswechsel ohne Deploy greift.
//
// Felder am Programm (alle optional, ISO-Datum "JJJJ-MM-TT"):
//   startIso       Beginn der Einreichung (Call-Start, „seit …“)
//   fristIso       Einreich- bzw. Antragsfrist (letzter Tag, inklusive)
//   gueltigBisIso  Ende der Programmlaufzeit (letzter Tag, inklusive)
//   geprueftAm     Datum der letzten redaktionellen Prüfung
//   anzeigeStatus  "pausiert" | "beendet" | "angekuendigt" – redaktionelle Einordnung
//   pruefen        true, wenn nur Sekundärquellen vorliegen
//
// Ergebnis: "offen" | "bald" | "abgelaufen" | "wartet"
//   offen       Einreichung möglich
//   bald        Einreichung möglich, Frist endet innerhalb von BALD_TAGE Tagen
//   abgelaufen  Frist bzw. Laufzeit vorbei oder redaktionell beendet
//   wartet      noch nicht geöffnet (Start in der Zukunft) oder pausiert – neuen Call abwarten

/** Innerhalb dieser Spanne vor der Frist gilt ein Programm als „bald“ (endet in Kürze). */
export const BALD_TAGE = 30;

/** Ab diesem Alter gilt ein Prüfdatum als veraltet (Test und Hinweis auf den Seiten). */
export const PRUEFUNG_MAX_TAGE = 35;
/** Für Einträge mit pruefen:true (nur Sekundärquellen) – strengere Grenze. */
export const PRUEFUNG_MAX_TAGE_SEKUNDAER = 60;

export const STATUS_LABEL = {
  offen: "offen",
  bald: "endet bald",
  abgelaufen: "abgelaufen",
  wartet: "noch nicht geöffnet",
};

const TAG_MS = 86_400_000;

/** Zeitpunkt (ms) normalisieren: Date, ISO-String oder Zahl → ms; ungültig → NaN. */
export function zeitpunkt(jetzt) {
  if (jetzt instanceof Date) return jetzt.getTime();
  if (typeof jetzt === "number") return jetzt;
  if (typeof jetzt === "string") return Date.parse(jetzt);
  return NaN;
}

/**
 * Beginn eines Kalendertags in Wien (UTC-Zeitpunkt in ms).
 * Österreich: MEZ (+01:00) bzw. MESZ (+02:00, letzter Sonntag März bis letzter Sonntag Oktober).
 */
export function tagStart(iso) {
  if (!iso || typeof iso !== "string") return NaN;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return NaN;
  const [j, mo, t] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const utcMitternacht = Date.UTC(j, mo - 1, t);
  return utcMitternacht - versatzStunden(utcMitternacht) * 3_600_000;
}

/** Ende eines Kalendertags in Wien (exklusiv: Beginn des Folgetags). */
export function tagEnde(iso) {
  const s = tagStart(iso);
  if (!Number.isFinite(s)) return NaN;
  // Folgetag über UTC addieren und erneut auf Wien normalisieren (DST-Wechsel)
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const folge = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + 1));
  return tagStart(folge.toISOString().slice(0, 10));
}

/** Zeitversatz Wien in Stunden für einen UTC-Zeitpunkt (1 oder 2). */
function versatzStunden(utcMs) {
  const d = new Date(utcMs);
  const jahr = d.getUTCFullYear();
  // Letzter Sonntag im März 01:00 UTC bis letzter Sonntag im Oktober 01:00 UTC = Sommerzeit
  const letzterSonntag = (monat) => {
    const letzter = new Date(Date.UTC(jahr, monat + 1, 0));
    return Date.UTC(jahr, monat, letzter.getUTCDate() - letzter.getUTCDay(), 1);
  };
  return utcMs >= letzterSonntag(2) && utcMs < letzterSonntag(9) ? 2 : 1;
}

/** Tage zwischen zwei Zeitpunkten (gerundet nach unten), negativ wenn b vor a. */
export function tageBis(zielIso, jetzt) {
  const z = tagEnde(zielIso);
  const j = zeitpunkt(jetzt);
  if (!Number.isFinite(z) || !Number.isFinite(j)) return NaN;
  return Math.floor((z - j) / TAG_MS);
}

/** Alter eines ISO-Datums in Tagen zum Zeitpunkt `jetzt` (NaN ohne Datum). */
export function alterTage(iso, jetzt) {
  const s = tagStart(iso);
  const j = zeitpunkt(jetzt);
  if (!Number.isFinite(s) || !Number.isFinite(j)) return NaN;
  return Math.floor((j - s) / TAG_MS);
}

/**
 * Status eines Programms zu einem Zeitpunkt.
 * p: Programm mit den oben genannten Feldern; jetzt: Date | ms | ISO (Standard: jetzt).
 */
export function programmStatus(p, jetzt = Date.now()) {
  if (!p || typeof p !== "object") return "offen";
  const j = zeitpunkt(jetzt);
  const t = Number.isFinite(j) ? j : Date.now();

  if (p.anzeigeStatus === "beendet") return "abgelaufen";

  const ende = ersteGueltige([p.fristIso, p.gueltigBisIso].map(tagEnde));
  if (Number.isFinite(ende) && t >= ende) return "abgelaufen";

  if (p.anzeigeStatus === "pausiert" || p.anzeigeStatus === "angekuendigt") return "wartet";

  const start = tagStart(p.startIso);
  if (Number.isFinite(start) && t < start) return "wartet";

  if (Number.isFinite(ende) && ende - t <= BALD_TAGE * TAG_MS) return "bald";
  return "offen";
}

/** Frühester gültiger Zeitpunkt aus einer Liste (NaN, wenn keiner). */
function ersteGueltige(werte) {
  const gueltig = werte.filter(Number.isFinite);
  return gueltig.length ? Math.min(...gueltig) : NaN;
}

/** Nächster relevanter Termin (ISO) eines Programms: Start, wenn noch nicht offen, sonst Frist/Laufzeitende. */
export function naechsterTermin(p, jetzt = Date.now()) {
  if (!p) return null;
  const t = zeitpunkt(jetzt);
  const start = tagStart(p.startIso);
  if (Number.isFinite(start) && t < start) return { iso: p.startIso, art: "start" };
  if (p.fristIso) return { iso: p.fristIso, art: "frist" };
  if (p.gueltigBisIso) return { iso: p.gueltigBisIso, art: "laufzeit" };
  return null;
}

/**
 * Prüfdatum bewerten: { ok, tage, grenze } – ok=false, wenn älter als die Grenze.
 * Die 35-Tage-Grenze gilt für alle Programme; für pruefen:true gilt zusätzlich die 60-Tage-Grenze
 * (die Sekundärquelle muss spätestens dann durch eine Primärquelle ersetzt sein).
 */
export function pruefungVeraltet(p, jetzt = Date.now()) {
  const tage = alterTage(p?.geprueftAm, jetzt);
  if (!Number.isFinite(tage)) return { ok: false, tage: NaN, grenze: PRUEFUNG_MAX_TAGE, grund: "kein Prüfdatum" };
  if (tage > PRUEFUNG_MAX_TAGE) return { ok: false, tage, grenze: PRUEFUNG_MAX_TAGE, grund: `Prüfdatum ${tage} Tage alt` };
  if (p.pruefen && tage > PRUEFUNG_MAX_TAGE_SEKUNDAER) return { ok: false, tage, grenze: PRUEFUNG_MAX_TAGE_SEKUNDAER, grund: `Sekundärquelle seit ${tage} Tagen nicht ersetzt` };
  return { ok: true, tage, grenze: p.pruefen ? PRUEFUNG_MAX_TAGE_SEKUNDAER : PRUEFUNG_MAX_TAGE };
}

/** "2026-10-31" → "31.10.2026" (ohne Intl, server- und clientgleich). */
export function datumKurzIso(iso) {
  const m = typeof iso === "string" && iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/** Prüft, ob ein Statustext „laufend“ behauptet (für den Test gegen vergangene Fristen). */
export function behauptetLaufend(statusText = "") {
  return /\blaufend\b|\boffen\b|\bläuft\b/i.test(String(statusText));
}

/**
 * Heutiger Kalendertag in Wien als ISO ("JJJJ-MM-TT"). Nicht über toISOString() (UTC):
 * zwischen 00:00 und 01:00/02:00 Uhr Wiener Zeit läge das noch am Vortag.
 * jetzt: Date | ms | ISO (Standard: jetzt).
 */
export function heuteWienIso(jetzt = Date.now()) {
  const j = zeitpunkt(jetzt);
  const d = new Date(Number.isFinite(j) ? j : Date.now());
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  } catch {
    // Ohne Zeitzonen-Daten: Versatz MEZ/MESZ selbst rechnen
    return new Date(d.getTime() + versatzStunden(d.getTime()) * 3_600_000).toISOString().slice(0, 10);
  }
}
