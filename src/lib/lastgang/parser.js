// src/lib/lastgang/parser.js
//
// Robuster Leser für Lastgang-Dateien (CSV/TXT) aus Netzbetreiber- und Energieportalen.
// Läuft komplett im Browser (und in Node für den Test) – keine Abhängigkeiten, kein Netzwerk.
//
// Erkennt automatisch:
//  - Zeichensatz: UTF-8 (mit/ohne BOM), UTF-16 (BOM), sonst Windows-1252
//  - Trennzeichen: Semikolon, Tabulator, Komma, senkrechter Strich; Anführungszeichen
//  - Vorspann (Zählpunkt, Kundendaten …) vor der Kopfzeile, Kopfzeile optional
//  - Zeitangaben: „TT.MM.JJJJ hh:mm[:ss]“, „JJJJ-MM-TT[T]hh:mm[:ss][Z|±hh:mm]“, „TT/MM/JJJJ“,
//    „JJJJ/MM/TT“, Datum und Uhrzeit in einer oder getrennten Spalten, „von/bis“-Spalten,
//    Bereiche wie „00:00 - 00:15“, „24:00“ als Tagesende
//  - Intervall-Beginn oder -Ende als Zeitstempel (Kopfzeile „bis/Ende“ oder Heuristik)
//  - Werte in kWh, Wh, MWh (Energie je Intervall) oder kW, W, MW (mittlere Leistung)
//  - Dezimalkomma oder -punkt, Tausendertrennzeichen
//  - Langformat (Bezug und Einspeisung untereinander mit Kennzeichen-Spalte, z. B. OBIS 1.8.0/2.8.0)
//  - Intervall 15, 30 oder 60 Minuten (5-Minuten-Werte werden zu Viertelstunden zusammengefasst)
//
// Zeitstempel werden als „Wanduhr-Zeit“ geführt: Date.UTC(Jahr, Monat, Tag, Stunde, Minute) der
// österreichischen Ortszeit. Damit hängen Wochentag, Tagesgang usw. nicht von der Zeitzone des
// Browsers ab. Für den Sonnenstand rechnet src/lib/lastgang/pv.js in echte UTC-Zeit um.

export class LastgangFehler extends Error {
  constructor(meldung, code = "format") {
    super(meldung);
    this.name = "LastgangFehler";
    this.code = code;
  }
}

export const GRENZEN = {
  maxBytes: 40 * 1024 * 1024, // 40 MB – reicht für mehrere Jahre Viertelstundenwerte
  maxZeilen: 1_500_000,
  minTage: 7,
  fensterTage: 365, // bei längeren Dateien werden die letzten 365 Tage ausgewertet
};

const MIN = 60000;
const TAG = 86400000;

// ---------------------------------------------------------------------------
// Zeichensatz
// ---------------------------------------------------------------------------

/** Bytes (Uint8Array/ArrayBuffer) → Text. Erkennt Excel-Dateien und meldet sie verständlich. */
export function dekodiere(eingabe) {
  const b = eingabe instanceof Uint8Array ? eingabe : new Uint8Array(eingabe);
  if (b.length === 0) throw new LastgangFehler("Die Datei ist leer.", "leer");
  if (b.length > GRENZEN.maxBytes) {
    throw new LastgangFehler("Die Datei ist größer als 40 MB. Bitte exportieren Sie höchstens zwölf bis 36 Monate Viertelstundenwerte.", "gross");
  }
  if (b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) {
    throw new LastgangFehler("Das ist eine Excel-Datei (.xlsx). Bitte öffnen Sie sie in Excel und speichern Sie sie über „Speichern unter → CSV (Trennzeichen-getrennt)“ – oder exportieren Sie im Portal direkt als CSV.", "excel");
  }
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) {
    throw new LastgangFehler("Das ist eine ältere Excel-Datei (.xls). Bitte speichern Sie sie als CSV und laden Sie diese Datei hoch.", "excel");
  }
  let text;
  if (b[0] === 0xff && b[1] === 0xfe) text = new TextDecoder("utf-16le").decode(b);
  else if (b[0] === 0xfe && b[1] === 0xff) text = new TextDecoder("utf-16be").decode(b);
  else {
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(b);
    } catch {
      text = new TextDecoder("windows-1252").decode(b);
    }
  }
  return text.replace(/^﻿/, "");
}

// ---------------------------------------------------------------------------
// Zeilen und Felder
// ---------------------------------------------------------------------------

const TRENNER = [";", "\t", ",", "|"];
const TRENNER_NAME = { ";": "Semikolon", "\t": "Tabulator", ",": "Komma", "|": "senkrechter Strich" };

function zaehleTrenner(zeile, t) {
  let n = 0;
  let inQ = false;
  for (let i = 0; i < zeile.length; i++) {
    const c = zeile[i];
    if (c === '"') inQ = !inQ;
    else if (c === t && !inQ) n++;
  }
  return n;
}

/** Trennzeichen nach Häufigkeit und Gleichmäßigkeit über die ersten Zeilen */
export function trennerErkennen(zeilen) {
  const probe = zeilen.filter((z) => z.trim() !== "").slice(0, 400);
  let bester = null;
  let besterWert = 0;
  for (const t of TRENNER) {
    const zaehler = new Map();
    for (const z of probe) {
      const n = zaehleTrenner(z, t);
      if (n > 0) zaehler.set(n, (zaehler.get(n) || 0) + 1);
    }
    let modus = 0;
    for (const [, anzahl] of zaehler) modus = Math.max(modus, anzahl);
    // Semikolon und Tabulator bei Gleichstand bevorzugen (Komma ist oft Dezimaltrenner)
    const wert = modus * (t === "," ? 0.98 : t === "|" ? 0.97 : 1);
    if (wert > besterWert) {
      besterWert = wert;
      bester = t;
    }
  }
  return bester;
}

export function zerlege(zeile, t) {
  if (!t) return [zeile.trim()];
  const felder = [];
  let feld = "";
  let inQ = false;
  for (let i = 0; i < zeile.length; i++) {
    const c = zeile[i];
    if (inQ) {
      if (c === '"') {
        if (zeile[i + 1] === '"') {
          feld += '"';
          i++;
        } else inQ = false;
      } else feld += c;
    } else if (c === '"') inQ = true;
    else if (c === t) {
      felder.push(feld.trim());
      feld = "";
    } else feld += c;
  }
  felder.push(feld.trim());
  return felder;
}

// ---------------------------------------------------------------------------
// Zahlen
// ---------------------------------------------------------------------------

const R_ZAHL = /^[+-]?(?:\d+|\d{1,3}(?:[.,' ]\d{3})+)(?:[.,]\d+)?(?:[eE][+-]?\d+)?$/;

/** Bereinigt ein Zahlfeld (Leerzeichen, geschützte Leerzeichen, Apostroph) */
const saeubere = (s) => s.replace(/[\s  ']/g, "");

export const istZahl = (s) => s !== "" && R_ZAHL.test(saeubere(s)) && !/^\d{1,2}[.,]\d{1,2}[.,]\d{2,4}$/.test(s.trim());

/** Stimme für das Dezimalformat: "komma", "punkt" oder null (mehrdeutig/ganzzahlig) */
function dezimalStimme(s) {
  const x = saeubere(s);
  const k = x.lastIndexOf(",");
  const p = x.lastIndexOf(".");
  if (k >= 0 && p >= 0) return k > p ? "komma" : "punkt";
  if (k >= 0) return /,\d{3}$/.test(x) && /^\d{1,3}(,\d{3})+$/.test(x.replace(/^[+-]/, "")) && x.length > 5 ? null : "komma";
  if (p >= 0) return /^[+-]?\d{1,3}(\.\d{3})+$/.test(x) ? null : "punkt";
  return null;
}

/** Zahl lesen; dezimalKomma = true: „1.234,5“, sonst „1,234.5“ */
export function leseZahl(s, dezimalKomma) {
  const x = saeubere(String(s ?? ""));
  if (x === "" || !R_ZAHL.test(x)) return NaN;
  const norm = dezimalKomma ? x.replace(/\./g, "").replace(",", ".") : x.replace(/,/g, "");
  return Number(norm);
}

// ---------------------------------------------------------------------------
// Datum und Uhrzeit
// ---------------------------------------------------------------------------

const R_DE = /^(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})(?:[\s,T]+(\d{1,2}):(\d{2})(?::(\d{2})(?:[.,]\d+)?)?)?$/;
const R_ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2})(?:[.,]\d+)?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;
const R_SLASH = /^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?:[\s,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const R_YSLASH = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const R_ZEIT = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:[.,]\d+)?)?(?:\s*(?:-|–|bis)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?(?:\s*Uhr)?$/i;
const R_BEREICH_ENDE = /^(.*?\d{1,2}:\d{2}(?::\d{2})?)\s*(?:-|–|bis)\s*\d{1,2}:\d{2}(?::\d{2})?$/i;

const plausibel = (y, m, d, h = 0, mi = 0) => y >= 1990 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31 && h >= 0 && h <= 24 && mi >= 0 && mi < 60 && !(h === 24 && mi > 0);

/**
 * Liest ein Datum (optional mit Uhrzeit).
 * Rückgabe { wand: ms (Wanduhr als UTC), mitZeit, bereich, h, mi } oder null.
 * slash: "dm" (TT/MM, Standard in Österreich) oder "md" (MM/TT)
 */
export function leseDatum(roh, slash = "dm") {
  let s = String(roh ?? "").trim();
  if (!s || s.length > 40) return null;
  let bereich = false;
  const b = R_BEREICH_ENDE.exec(s);
  if (b) {
    s = b[1].trim();
    bereich = true;
  }
  let y, m, d, h, mi, sek, tz;
  let r;
  if ((r = R_DE.exec(s))) [, d, m, y, h, mi, sek] = r;
  else if ((r = R_ISO.exec(s))) [, y, m, d, h, mi, sek, tz] = r;
  else if ((r = R_YSLASH.exec(s))) [, y, m, d, h, mi, sek] = r;
  else if ((r = R_SLASH.exec(s))) {
    if (slash === "md") [, m, d, y, h, mi, sek] = r;
    else [, d, m, y, h, mi, sek] = r;
  } else return null;
  y = Number(y);
  if (y < 100) y += 2000;
  m = Number(m);
  d = Number(d);
  const mitZeit = h !== undefined;
  h = mitZeit ? Number(h) : 0;
  mi = mitZeit ? Number(mi) : 0;
  sek = sek ? Number(sek) : 0;
  if (!plausibel(y, m, d, h, mi)) return null;
  let wand = Date.UTC(y, m - 1, d, h, mi, sek);
  if (tz) {
    const off = tz.toUpperCase() === "Z" ? 0 : (tz[0] === "-" ? -1 : 1) * (Number(tz.slice(1, 3)) * 60 + Number(tz.slice(-2)));
    wand = utcZuWand(wand - off * MIN);
  }
  return { wand, mitZeit, bereich, h, mi, tz: Boolean(tz) };
}

/** Uhrzeit (auch Bereich „00:00 - 00:15“) → { min: Minuten ab Mitternacht, bereich } */
export function leseZeit(roh) {
  const r = R_ZEIT.exec(String(roh ?? "").trim());
  if (!r) return null;
  const h = Number(r[1]);
  const mi = Number(r[2]);
  if (h > 24 || mi > 59 || (h === 24 && mi > 0)) return null;
  return { min: h * 60 + mi, bereich: r[4] !== undefined };
}

// Mitteleuropäische Zeit mit Sommerzeit (EU-Regel: letzter Sonntag im März/Oktober, 01:00 UTC)
function letzterSonntag(jahr, monat) {
  const ende = new Date(Date.UTC(jahr, monat + 1, 0));
  return Date.UTC(jahr, monat, ende.getUTCDate() - ende.getUTCDay());
}
/** Offset der österreichischen Ortszeit zu UTC in Minuten für einen UTC-Zeitpunkt */
export function wienOffset(utcMs) {
  const j = new Date(utcMs).getUTCFullYear();
  const beginn = letzterSonntag(j, 2) + 1 * 3600000;
  const ende = letzterSonntag(j, 9) + 1 * 3600000;
  return utcMs >= beginn && utcMs < ende ? 120 : 60;
}
export const utcZuWand = (utcMs) => utcMs + wienOffset(utcMs) * MIN;
/** Wanduhr → UTC (in der doppelten Oktober-Stunde wird die Sommerzeit angenommen) */
export function wandZuUtc(wand) {
  const versuch = wand - 120 * MIN;
  return wienOffset(versuch) === 120 ? versuch : wand - 60 * MIN;
}

// ---------------------------------------------------------------------------
// Spalten erkennen
// ---------------------------------------------------------------------------

function klassifiziere(zelle, slash) {
  if (zelle === "") return "leer";
  const d = leseDatum(zelle, slash);
  if (d) return d.mitZeit ? "datumzeit" : "datum";
  if (leseZeit(zelle)) return "zeit";
  if (istZahl(zelle)) return "zahl";
  return "text";
}

/** Einheit aus Kopfzeilen- oder Zelltext */
export function einheitAusText(text) {
  const t = String(text || "").toLowerCase();
  const wort = (w) => new RegExp(`(?<![a-zäöü])${w}(?![a-zäöü])`).test(t);
  if (wort("mwh")) return { einheit: "mwh", sicher: true };
  if (wort("kwh")) return { einheit: "kwh", sicher: true };
  if (wort("wh")) return { einheit: "wh", sicher: true };
  if (wort("mw")) return { einheit: "mw", sicher: true };
  if (wort("kw")) return { einheit: "kw", sicher: true };
  if (wort("w") && /\[\s*w\s*\]|\(\s*w\s*\)|in w\b/.test(t)) return { einheit: "w", sicher: true };
  if (/leistung|power|\blast\b/.test(t)) return { einheit: "kw", sicher: false };
  if (/energie|verbrauch|bezug|menge|arbeit|energy|consumption/.test(t)) return { einheit: "kwh", sicher: false };
  return null;
}

export const EINHEITEN = {
  kwh: { label: "kWh je Intervall", faktor: () => 1 },
  wh: { label: "Wh je Intervall", faktor: () => 0.001 },
  mwh: { label: "MWh je Intervall", faktor: () => 1000 },
  kw: { label: "kW (mittlere Leistung)", faktor: (iv) => iv / 60 },
  w: { label: "W (mittlere Leistung)", faktor: (iv) => iv / 60000 },
  mw: { label: "MW (mittlere Leistung)", faktor: (iv) => (iv / 60) * 1000 },
};

const POSITIV = /verbrauch|bezug|wirkenergie|energie|kwh|wert|value|last|leistung|\bkw\b|1\.8\.0|1-1:1\.8|consumption|import|entnahme|menge|arbeit/i;
const NEGATIV = /einspeis|lieferung|erzeugung|produktion|2\.8\.0|1-1:2\.8|export|blind|kvar|varh|status|qualit|ersatz|zähl|zaehl|\bnr\b|\bid\b|nummer|stand|temperatur|kennz|flag/i;
const BEZUG = /bezug|verbrauch|1\.8\.0|1-1:1\.8|import|consumption|entnahme|\+a\b|a\+/i;

function spaltenWert(name) {
  let w = 0;
  if (POSITIV.test(name)) w += 3;
  if (NEGATIV.test(name)) w -= 6;
  if (BEZUG.test(name)) w += 2;
  return w;
}

// ---------------------------------------------------------------------------
// Hauptfunktion
// ---------------------------------------------------------------------------

/**
 * Liest einen Lastgang aus Text.
 * @param {string} text
 * @param {object} [opt] { einheit: "auto"|"kwh"|"kw"|"wh"|"w"|"mwh"|"mw", spalte: Spaltenindex|null }
 * @returns {{
 *   zeiten: Float64Array, kwh: Float64Array, intervall: number,
 *   einheit: string, einheitSicher: boolean, spalte: number, spalten: {index:number,name:string}[],
 *   erkannt: object, hinweise: string[]
 * }}
 */
export function leseLastgang(text, opt = {}) {
  const { einheit: einheitWahl = "auto", spalte: spalteWahl = null } = opt;
  const hinweise = [];
  const zeilen = String(text ?? "").split(/\r\n|\n|\r/);
  if (zeilen.filter((z) => z.trim() !== "").length < 2) throw new LastgangFehler("Die Datei enthält keine auswertbaren Zeilen.", "leer");
  if (zeilen.length > GRENZEN.maxZeilen) throw new LastgangFehler("Die Datei hat zu viele Zeilen. Bitte exportieren Sie höchstens 36 Monate Viertelstundenwerte.", "gross");

  const trenner = trennerErkennen(zeilen);

  // Datenbeginn: erste Zeile mit Datum und mindestens einer Zahl, bestätigt durch die Folgezeilen
  const passtZeile = (felder) => {
    let datum = false;
    let zahl = false;
    for (const f of felder) {
      const k = klassifiziere(f, "dm");
      if (k === "datum" || k === "datumzeit") datum = true;
      else if (k === "zahl") zahl = true;
    }
    return datum && zahl;
  };
  let start = -1;
  for (let i = 0; i < Math.min(zeilen.length, 400); i++) {
    if (zeilen[i].trim() === "") continue;
    if (!passtZeile(zerlege(zeilen[i], trenner))) continue;
    let bestaetigt = 0;
    let geprueft = 0;
    for (let j = i + 1; j < zeilen.length && geprueft < 3; j++) {
      if (zeilen[j].trim() === "") continue;
      geprueft++;
      if (passtZeile(zerlege(zeilen[j], trenner))) bestaetigt++;
    }
    if (bestaetigt >= Math.min(2, geprueft)) {
      start = i;
      break;
    }
  }
  if (start < 0) {
    throw new LastgangFehler(
      "In der Datei wurde keine Zeile mit Datum, Uhrzeit und Messwert gefunden. Erwartet wird je Zeile ein Zeitstempel (z. B. „01.01.2025 00:15“ oder „2025-01-01T00:15“) und ein Verbrauchswert.",
      "keinDatum"
    );
  }

  // Kopfzeile: letzte nicht leere Zeile vor dem Datenbeginn ohne Datum
  const ersteDaten = zerlege(zeilen[start], trenner);
  let kopf = null;
  for (let i = start - 1; i >= Math.max(0, start - 6); i--) {
    if (zeilen[i].trim() === "") continue;
    const f = zerlege(zeilen[i], trenner);
    const hatDatum = f.some((x) => leseDatum(x));
    if (!hatDatum && f.length >= Math.min(2, ersteDaten.length) && Math.abs(f.length - ersteDaten.length) <= 1) kopf = f;
    break;
  }

  // Datenzeilen einsammeln
  const daten = [];
  for (let i = start; i < zeilen.length; i++) {
    if (zeilen[i].trim() === "") continue;
    daten.push(zerlege(zeilen[i], trenner));
  }
  const spaltenZahl = Math.max(...daten.slice(0, 200).map((f) => f.length));
  const name = (i) => (kopf && kopf[i] ? kopf[i] : `Spalte ${i + 1}`);

  // Schrägstrich-Datum: TT/MM oder MM/TT?
  let slash = "dm";
  for (const f of daten.slice(0, 3000)) {
    for (const z of f) {
      const r = R_SLASH.exec(z.replace(R_BEREICH_ENDE, "$1"));
      if (r && Number(r[2]) > 12) slash = "md";
    }
  }

  // Rolle je Spalte aus einer Stichprobe
  const probe = daten.length > 600 ? daten.filter((_, i) => i % Math.ceil(daten.length / 600) === 0) : daten;
  const rollen = [];
  for (let c = 0; c < spaltenZahl; c++) {
    const zaehler = { datumzeit: 0, datum: 0, zeit: 0, zahl: 0, text: 0, leer: 0 };
    for (const f of probe) zaehler[klassifiziere(f[c] ?? "", slash)]++;
    const gesamt = probe.length - zaehler.leer;
    let rolle = "leer";
    if (gesamt > 0) {
      rolle = "text";
      for (const k of ["datumzeit", "datum", "zeit", "zahl"]) if (zaehler[k] >= gesamt * 0.8) rolle = k;
    }
    rollen.push(rolle);
  }

  // Zeitspalten wählen
  const kopfText = (i) => name(i).toLowerCase();
  const istBis = (i) => /bis|ende|\bend|to\b/.test(kopfText(i)) && !/von|beginn|start|ab\b|from/.test(kopfText(i));
  const istVon = (i) => /von|beginn|start|ab\b|from/.test(kopfText(i));
  const dz = rollen.map((r, i) => (r === "datumzeit" ? i : -1)).filter((i) => i >= 0);
  const dat = rollen.map((r, i) => (r === "datum" ? i : -1)).filter((i) => i >= 0);
  const zeit = rollen.map((r, i) => (r === "zeit" ? i : -1)).filter((i) => i >= 0);

  let zeitQuelle; // { art: "dz", spalte } | { art: "dt", datum, zeit }
  let ende = null; // true = Zeitstempel markiert das Intervallende
  if (dz.length) {
    const von = dz.find(istVon);
    const sp = von ?? dz.find((i) => !istBis(i)) ?? dz[0];
    zeitQuelle = { art: "dz", spalte: sp };
    if (dz.length > 1 || von !== undefined) ende = false;
    else if (istBis(sp)) ende = true;
  } else if (dat.length && zeit.length) {
    const von = zeit.find(istVon);
    const sp = von ?? zeit.find((i) => !istBis(i)) ?? zeit[0];
    zeitQuelle = { art: "dt", datum: dat[0], zeit: sp };
    if (zeit.length > 1 || von !== undefined) ende = false;
    else if (istBis(sp)) ende = true;
  } else if (dat.length) {
    throw new LastgangFehler(
      "Die Datei enthält nur Tageswerte (Datum ohne Uhrzeit). Für Lastprofil, Spitzen und Speicher braucht die Analyse Viertelstundenwerte – bitte im Portal „Viertelstundenwerte“ bzw. „15-Minuten-Werte“ exportieren.",
      "tageswerte"
    );
  } else {
    throw new LastgangFehler("Es wurde keine Spalte mit Datum und Uhrzeit erkannt.", "keinDatum");
  }

  // Wertspalte(n)
  const benutzt = new Set([zeitQuelle.spalte, zeitQuelle.datum, zeitQuelle.zeit, ...dz, ...dat, ...zeit].filter((x) => x !== undefined));
  const zahlSpalten = rollen.map((r, i) => (r === "zahl" && !benutzt.has(i) ? i : -1)).filter((i) => i >= 0);
  if (!zahlSpalten.length) throw new LastgangFehler("Neben dem Zeitstempel wurde keine Spalte mit Zahlenwerten gefunden.", "keineWerte");
  const spalten = zahlSpalten.map((i) => ({ index: i, name: name(i) }));
  let wertSpalte;
  if (spalteWahl != null && zahlSpalten.includes(Number(spalteWahl))) wertSpalte = Number(spalteWahl);
  else {
    wertSpalte = zahlSpalten[0];
    let best = -Infinity;
    for (const i of zahlSpalten) {
      const w = spaltenWert(name(i));
      if (w > best) {
        best = w;
        wertSpalte = i;
      }
    }
    if (zahlSpalten.length > 1) hinweise.push(`Mehrere Wertspalten gefunden – ausgewertet wird „${name(wertSpalte)}“. Sie können die Spalte unten umstellen.`);
  }

  // Dezimalformat der Wertspalte
  let komma = 0;
  let punkt = 0;
  for (const f of daten.slice(0, 5000)) {
    const st = dezimalStimme(f[wertSpalte] ?? "");
    if (st === "komma") komma++;
    else if (st === "punkt") punkt++;
  }
  const dezimalKomma = komma > punkt || (komma === punkt && trenner === ";");

  // Einheit: Wahl > Kopfzeile > Einheiten-Spalte > Annahme kWh
  let einheit = "kwh";
  let einheitSicher = false;
  let einheitQuelle = "annahme";
  if (einheitWahl !== "auto" && EINHEITEN[einheitWahl]) {
    einheit = einheitWahl;
    einheitSicher = true;
    einheitQuelle = "wahl";
  } else {
    const ausKopf = einheitAusText(name(wertSpalte));
    if (ausKopf) {
      einheit = ausKopf.einheit;
      einheitSicher = ausKopf.sicher;
      einheitQuelle = "kopf";
    }
    if (!ausKopf || !ausKopf.sicher) {
      for (let c = 0; c < spaltenZahl; c++) {
        if (rollen[c] !== "text") continue;
        const werte = new Set(probe.slice(0, 50).map((f) => (f[c] || "").trim().toLowerCase()));
        if (werte.size === 1) {
          const e = einheitAusText([...werte][0]);
          if (e && e.sicher && [...werte][0].length <= 4) {
            einheit = e.einheit;
            einheitSicher = true;
            einheitQuelle = "spalte";
          }
        }
      }
    }
  }

  // Langformat: Kennzeichen-Spalte mit wenigen Ausprägungen (z. B. Bezug/Einspeisung)
  let filter = null;
  const kennSpalten = rollen.map((r, i) => (r === "text" ? i : -1)).filter((i) => i >= 0);
  const zeitSchluessel = (f) => (zeitQuelle.art === "dz" ? f[zeitQuelle.spalte] : `${f[zeitQuelle.datum]} ${f[zeitQuelle.zeit]}`);
  {
    const stich = daten.slice(0, 2000);
    const eindeutig = new Set(stich.map(zeitSchluessel)).size;
    if (eindeutig < stich.length * 0.7) {
      for (const c of kennSpalten) {
        const auspraegungen = [...new Set(stich.map((f) => f[c] ?? ""))];
        if (auspraegungen.length >= 2 && auspraegungen.length <= 6) {
          const bezug = auspraegungen.find((a) => BEZUG.test(a)) ?? auspraegungen.find((a) => !NEGATIV.test(a) && !/einspeis|2\.8/i.test(a)) ?? auspraegungen[0];
          filter = { spalte: c, wert: bezug };
          hinweise.push(`Die Datei enthält mehrere Messgrößen untereinander – ausgewertet werden die Zeilen „${bezug}“ (Spalte „${name(c)}“).`);
          break;
        }
      }
    }
  }

  // Zeilen lesen
  const roh = [];
  let leer = 0;
  let bereichGesehen = false;
  let mit24 = false;
  for (const f of daten) {
    if (filter && (f[filter.spalte] ?? "") !== filter.wert) continue;
    let t;
    if (zeitQuelle.art === "dz") {
      const d = leseDatum(f[zeitQuelle.spalte], slash);
      if (!d || !d.mitZeit) continue;
      t = d.wand;
      if (d.bereich) bereichGesehen = true;
      if (d.h === 24) mit24 = true;
    } else {
      const d = leseDatum(f[zeitQuelle.datum], slash);
      const z = leseZeit(f[zeitQuelle.zeit]);
      if (!d || !z) continue;
      t = d.wand + z.min * MIN;
      if (z.bereich) bereichGesehen = true;
      if (z.min === 1440) mit24 = true;
    }
    const v = leseZahl(f[wertSpalte], dezimalKomma);
    if (!Number.isFinite(v)) {
      leer++;
      continue;
    }
    roh.push([t, v]);
  }
  if (roh.length < 24) throw new LastgangFehler("Es konnten zu wenige Messwerte gelesen werden. Bitte prüfen Sie, ob die Datei Viertelstundenwerte enthält.", "keineWerte");
  if (bereichGesehen) ende = false;

  // Sortieren (Zeitstempel gleich → Dateireihenfolge, wichtig für die doppelte Oktober-Stunde)
  const reihenfolge = roh.map((_, i) => i).sort((a, b) => roh[a][0] - roh[b][0] || a - b);
  let zeiten = reihenfolge.map((i) => roh[i][0]);
  let werte = reihenfolge.map((i) => roh[i][1]);

  // Intervall = häufigster Abstand
  const abstaende = new Map();
  for (let i = 1; i < zeiten.length; i++) {
    const d = Math.round((zeiten[i] - zeiten[i - 1]) / MIN);
    if (d > 0) abstaende.set(d, (abstaende.get(d) || 0) + 1);
  }
  let intervall = 0;
  let haeufig = 0;
  for (const [d, n] of abstaende) {
    if (n > haeufig) {
      haeufig = n;
      intervall = d;
    }
  }
  if (intervall >= 1440) throw new LastgangFehler("Die Datei enthält Tageswerte. Bitte exportieren Sie Viertelstundenwerte (96 Werte je Tag).", "tageswerte");
  if (![5, 15, 30, 60].includes(intervall)) {
    throw new LastgangFehler(`Das Messintervall von ${intervall} Minuten wird nicht unterstützt. Erwartet werden 15-Minuten-Werte (auch 5, 30 oder 60 Minuten sind möglich).`, "intervall");
  }

  // Intervallende → Intervallbeginn
  if (ende === null) {
    const minTag = (ms) => Math.round((ms % TAG) / MIN);
    ende = mit24 || (minTag(zeiten[0]) === intervall && minTag(zeiten[zeiten.length - 1]) === 0);
  }
  if (ende) {
    zeiten = zeiten.map((t) => t - intervall * MIN);
    hinweise.push("Die Zeitstempel markieren das Ende des Intervalls – sie wurden auf den Intervallbeginn umgerechnet.");
  }

  // Doppelte Zeitstempel: in der Oktober-Umstellungsstunde echt, sonst Dubletten
  const oktoberStunde = (t) => {
    const d = new Date(t);
    if (d.getUTCMonth() !== 9 || d.getUTCHours() !== 2) return false;
    return Date.UTC(d.getUTCFullYear(), 9, d.getUTCDate()) === letzterSonntag(d.getUTCFullYear(), 9);
  };
  const zt = [];
  const wt = [];
  let dubletten = 0;
  for (let i = 0; i < zeiten.length; i++) {
    if (i > 0 && zeiten[i] === zeiten[i - 1]) {
      const zweite = i < 2 || zeiten[i - 2] !== zeiten[i];
      if (!(oktoberStunde(zeiten[i]) && zweite)) {
        dubletten++;
        continue;
      }
    }
    zt.push(zeiten[i]);
    wt.push(werte[i]);
  }
  zeiten = zt;
  werte = wt;
  if (dubletten > 0) hinweise.push(`${dubletten} doppelte Zeitstempel wurden übersprungen.`);

  // Einheit anwenden
  const faktor = EINHEITEN[einheit].faktor(intervall);
  werte = werte.map((v) => v * faktor);

  // Vorzeichen
  const negativ = werte.filter((v) => v < 0).length;
  if (negativ > werte.length * 0.9) {
    werte = werte.map((v) => -v);
    hinweise.push("Die Werte sind negativ angegeben (Vorzeichenkonvention des Portals) und wurden umgedreht.");
  } else if (negativ > 0) {
    werte = werte.map((v) => Math.max(0, v));
    hinweise.push(`${negativ} negative Werte (z. B. Einspeisung) wurden als 0 gewertet.`);
  }

  // 5-Minuten-Werte zu Viertelstunden zusammenfassen
  if (intervall === 5) {
    const z2 = [];
    const w2 = [];
    for (let i = 0; i < zeiten.length; i++) {
      const block = zeiten[i] - (zeiten[i] % (15 * MIN));
      if (z2.length && z2[z2.length - 1] === block && !oktoberStunde(block)) w2[w2.length - 1] += werte[i];
      else {
        z2.push(block);
        w2.push(werte[i]);
      }
    }
    zeiten = z2;
    werte = w2;
    intervall = 15;
    hinweise.push("5-Minuten-Werte wurden zu Viertelstundenwerten zusammengefasst.");
  }

  // Auswertungsfenster: höchstens die letzten 365 Tage
  const letzte = zeiten[zeiten.length - 1];
  if (letzte - zeiten[0] > (GRENZEN.fensterTage + 1) * TAG) {
    const ab = letzte + intervall * MIN - GRENZEN.fensterTage * TAG;
    const i0 = zeiten.findIndex((t) => t >= ab);
    zeiten = zeiten.slice(i0);
    werte = werte.slice(i0);
    hinweise.push("Die Datei umfasst mehr als ein Jahr – ausgewertet werden die letzten 365 Tage.");
  }

  const tage = (zeiten.length * intervall) / 1440;
  if (tage < GRENZEN.minTage) {
    throw new LastgangFehler(`Die Datei enthält nur rund ${Math.max(1, Math.round(tage))} Tag(e) Messwerte. Für eine sinnvolle Auswertung braucht es mindestens sieben Tage – ideal sind zwölf Monate.`, "kurz");
  }

  if (intervall === 60) hinweise.push("Die Datei enthält Stundenwerte. Viertelstunden-Spitzen sind darin geglättet – Spitzenlast und Speicherbedarf werden eher unterschätzt.");
  if (intervall === 30) hinweise.push("Die Datei enthält 30-Minuten-Werte. Viertelstunden-Spitzen sind darin geglättet.");
  if (leer > 0) hinweise.push(`${leer} Zeilen ohne gültigen Messwert wurden übersprungen.`);
  if (!einheitSicher) {
    hinweise.push(
      einheit === "kw"
        ? "Die Einheit ist nicht eindeutig angegeben – angenommen wird mittlere Leistung in kW. Bitte prüfen und bei Bedarf umstellen."
        : "Die Einheit ist nicht eindeutig angegeben – angenommen wird Energie in kWh je Intervall. Enthält Ihre Datei Leistungswerte (kW), stellen Sie die Einheit unten um."
    );
  }

  return {
    zeiten: Float64Array.from(zeiten),
    kwh: Float64Array.from(werte),
    intervall,
    einheit,
    einheitSicher,
    einheitQuelle,
    spalte: wertSpalte,
    spalten,
    erkannt: {
      trenner: TRENNER_NAME[trenner] || "keines",
      dezimal: dezimalKomma ? "Komma" : "Punkt",
      kopfzeile: Boolean(kopf),
      zeitformat: zeitQuelle.art === "dz" ? `Datum und Uhrzeit in „${name(zeitQuelle.spalte)}“` : `Datum in „${name(zeitQuelle.datum)}“, Uhrzeit in „${name(zeitQuelle.zeit)}“`,
      zeitstempel: ende ? "Intervallende" : "Intervallbeginn",
      wertspalte: name(wertSpalte),
      vorspannZeilen: start - (kopf ? 1 : 0),
    },
    hinweise,
  };
}
