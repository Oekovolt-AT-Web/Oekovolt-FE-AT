// src/data/erreichbarkeit.js
//
// Öffnungszeiten, Feiertage, Rückruf- und Termin-Regeln – EINE Quelle für
// Öffnungsstatus, Rückruf-Widget, Terminbuchung (Browser) und API-Routen (Server).
// Reine Funktionen ohne Browser- oder Node-Abhängigkeiten.
//
// Österreich: Firmensitz Ostermiething (Oberösterreich), Zeitzone Europe/Vienna.
// Die Öffnungszeiten werden aus FIRMA.oeffnungszeiten (src/lib/site.js) abgeleitet –
// dort ändern, nicht hier.

import { FIRMA } from "@/lib/site";

export const ZEITZONE = "Europe/Vienna";

// Wochentag: 1 = Montag … 7 = Sonntag; Minuten ab Mitternacht
const TAG_NR = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 7 };
const TAG_LANG = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const minutenAus = (t) => {
  const [h, m] = String(t).trim().split(":").map(Number);
  return h * 60 + (m || 0);
};
const kurzeZeit = (min) => `${Math.floor(min / 60)}${min % 60 ? `:${String(min % 60).padStart(2, "0")}` : ""}`;

/** "Mo – Do" -> [1,2,3,4]; "Fr" -> [5] */
function tageAus(text) {
  const teile = String(text).split(/[–-]/).map((x) => x.trim());
  const von = TAG_NR[teile[0]];
  const bis = TAG_NR[teile[1] || teile[0]];
  const tage = [];
  for (let t = von; t <= bis; t++) tage.push(t);
  return tage;
}

const AUS_FIRMA = FIRMA.oeffnungszeiten.map((o) => {
  const tage = tageAus(o.tage);
  const [von, bis] = o.zeit.split(/[–-]/).map(minutenAus);
  const kurz = tage.length > 1 ? `${o.tage.split(/[–-]/)[0].trim()}–${o.tage.split(/[–-]/)[1].trim()}` : o.tage.trim();
  const label = tage.length > 1 ? `${TAG_LANG[tage[0]]} – ${TAG_LANG[tage[tage.length - 1]]}` : TAG_LANG[tage[0]];
  return { tage, label, kurz, von, bis, text: `${o.zeit.replace(/\s*[–-]\s*/, " – ")} Uhr` };
});

const OFFEN_TAGE = new Set(AUS_FIRMA.flatMap((o) => o.tage));
const ZU_TAGE = [1, 2, 3, 4, 5, 6, 7].filter((t) => !OFFEN_TAGE.has(t));

export const OEFFNUNGSZEITEN = [
  ...AUS_FIRMA,
  ...(ZU_TAGE.length ? [{ tage: ZU_TAGE, label: ZU_TAGE.length === 2 && ZU_TAGE[0] === 6 ? "Samstag & Sonntag" : ZU_TAGE.map((t) => TAG_LANG[t]).join(", "), kurz: ZU_TAGE.length === 2 && ZU_TAGE[0] === 6 ? "Sa–So" : ZU_TAGE.map((t) => TAG_LANG[t].slice(0, 2)).join(", "), von: null, bis: null, text: "geschlossen" }] : []),
];

/** z. B. "Mo–Do 8–16 Uhr · Fr 8–12 Uhr" */
export const OEFFNUNGSZEITEN_KURZ = AUS_FIRMA.map((o) => `${o.kurz} ${kurzeZeit(o.von)}–${kurzeZeit(o.bis)} Uhr`).join(" · ");

export const TERMIN_ARTEN = [
  {
    id: "telefon",
    titel: "Telefonische Beratung",
    kurz: "Telefon",
    dauer: 20,
    text: "Erste Fragen klären, Dach- oder Freifläche, Verbrauch und Netzanschluss grob einschätzen – wir rufen Sie zum Termin an.",
    icon: "Phone",
  },
  {
    id: "video",
    titel: "Video-Beratung",
    kurz: "Video",
    dauer: 30,
    text: "Per Video mit geteiltem Bildschirm: Luftbild Ihrer Fläche, Lastgang, Anlagengröße, Ertrag und Wirtschaftlichkeit.",
    icon: "Video",
    empfohlen: true,
  },
  {
    id: "vor-ort",
    titel: "Vor-Ort-Termin",
    kurz: "Vor Ort",
    dauer: 60,
    text: "Unser Projektleiter kommt zu Ihnen – in ganz Österreich: Dach, Statik, Trafo/Zählerplatz und Leitungswege werden direkt geprüft.",
    icon: "MapPin",
    mitAdresse: true,
  },
];

export const THEMEN = ["Gewerbe & Industrie", "Freifläche & Agri-PV", "Landwirtschaft", "Gemeinde & öffentliche Hand", "Speicher & Ladeinfrastruktur", "Service & Wartung", "Energiegemeinschaft", "Chalet & Privat", "Sonstiges"];

// Buchungsregeln
export const TERMIN_REGELN = {
  raster: 30, // Minuten zwischen Slot-Starts
  vorlaufMinuten: 120, // frühestens 2 h ab jetzt …
  vorOrtVorlaufTage: 2, // … Vor-Ort-Termine frühestens übermorgen
  tageVoraus: 30,
};

// Rückruf: Wunschzeit-Fenster außerhalb der Öffnungszeiten
export const RUECKRUF_RASTER = 30;

// ---------------------------------------------------------------- Zeit

const WT = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
export const WOCHENTAGE = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
export const WOCHENTAGE_KURZ = ["", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const zwei = (n) => String(n).padStart(2, "0");
export const hhmm = (m) => `${zwei(Math.floor(m / 60))}:${zwei(m % 60)}`;

/**
 * Wanduhr am Firmensitz (Europe/Vienna): { jahr, monat, tag, wochentag, minuten, ymd }.
 * Der Name `berlin` bleibt aus Kompatibilitätsgründen (Importe in Formularen und API-Routen).
 */
export function berlin(d = new Date()) {
  const t = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: ZEITZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value])
  );
  return {
    jahr: Number(t.year),
    monat: Number(t.month),
    tag: Number(t.day),
    wochentag: WT[t.weekday],
    minuten: Number(t.hour) * 60 + Number(t.minute),
    ymd: `${t.year}-${t.month}-${t.day}`,
  };
}

/** Wanduhrzeit am Firmensitz (YYYY-MM-DD + Minuten) -> Date (UTC-korrekt, auch bei Zeitumstellung). */
export function berlinZuDate(ymd, minuten) {
  const [j, m, t] = ymd.split("-").map(Number);
  const utcGuess = Date.UTC(j, m - 1, t, Math.floor(minuten / 60), minuten % 60);
  const b = berlin(new Date(utcGuess));
  const angezeigt = Date.UTC(b.jahr, b.monat - 1, b.tag, Math.floor(b.minuten / 60), b.minuten % 60);
  return new Date(utcGuess - (angezeigt - utcGuess));
}

function ymdPlus(ymd, tage) {
  const [j, m, t] = ymd.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1, t + tage));
  return `${d.getUTCFullYear()}-${zwei(d.getUTCMonth() + 1)}-${zwei(d.getUTCDate())}`;
}

function wochentagVon(ymd) {
  const [j, m, t] = ymd.split("-").map(Number);
  const w = new Date(Date.UTC(j, m - 1, t)).getUTCDay();
  return w === 0 ? 7 : w;
}

// ---------------------------------------------------------------- Feiertage (Österreich, Oberösterreich)

function ostersonntag(jahr) {
  // Gaußsche Osterformel (Anonymer Gregorianischer Algorithmus)
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return `${jahr}-${zwei(monat)}-${zwei(tag)}`;
}

const feiertagCache = new Map();
/**
 * Gesetzliche Feiertage in Österreich (Feiertagsruhegesetz / ARG) plus
 * Heiliger Abend und Silvester (Betriebsruhe). Karfreitag ist seit 2019 kein
 * allgemeiner Feiertag mehr; der Landesfeiertag hl. Florian (4. Mai, OÖ) ist
 * kein arbeitsfreier Tag und daher nicht enthalten.
 */
export function feiertage(jahr) {
  if (!feiertagCache.has(jahr)) {
    const o = ostersonntag(jahr);
    const liste = {
      [`${jahr}-01-01`]: "Neujahr",
      [`${jahr}-01-06`]: "Heilige Drei Könige",
      [ymdPlus(o, 1)]: "Ostermontag",
      [`${jahr}-05-01`]: "Staatsfeiertag",
      [ymdPlus(o, 39)]: "Christi Himmelfahrt",
      [ymdPlus(o, 50)]: "Pfingstmontag",
      [ymdPlus(o, 60)]: "Fronleichnam",
      [`${jahr}-08-15`]: "Mariä Himmelfahrt",
      [`${jahr}-10-26`]: "Nationalfeiertag",
      [`${jahr}-11-01`]: "Allerheiligen",
      [`${jahr}-12-08`]: "Mariä Empfängnis",
      [`${jahr}-12-24`]: "Heiliger Abend",
      [`${jahr}-12-25`]: "Christtag",
      [`${jahr}-12-26`]: "Stefanitag",
      [`${jahr}-12-31`]: "Silvester",
    };
    feiertagCache.set(jahr, liste);
  }
  return feiertagCache.get(jahr);
}

export const feiertagAm = (ymd) => feiertage(Number(ymd.slice(0, 4)))[ymd] || null;

/** Öffnungsfenster eines Kalendertags oder null (Wochenende/Feiertag). */
export function fensterAm(ymd) {
  if (feiertagAm(ymd)) return null;
  const z = OEFFNUNGSZEITEN.find((o) => o.tage.includes(wochentagVon(ymd)));
  return z?.von != null ? { von: z.von, bis: z.bis } : null;
}

// ---------------------------------------------------------------- Status

/** { offen, titel, detail, wochentag, feiertag, naechsteOeffnung: Date|null } */
export function oeffnungsStatus(d = new Date()) {
  const b = berlin(d);
  const heute = fensterAm(b.ymd);
  const feiertag = feiertagAm(b.ymd);

  if (heute && b.minuten >= heute.von && b.minuten < heute.bis) {
    const rest = heute.bis - b.minuten;
    return { offen: true, wochentag: b.wochentag, feiertag, titel: "Jetzt geöffnet", detail: rest <= 60 ? `noch ${rest} Min.` : `bis ${hhmm(heute.bis)} Uhr`, naechsteOeffnung: null };
  }
  if (heute && b.minuten < heute.von) {
    return { offen: false, wochentag: b.wochentag, feiertag, titel: "Geschlossen", detail: `öffnet heute um ${hhmm(heute.von)} Uhr`, naechsteOeffnung: berlinZuDate(b.ymd, heute.von) };
  }
  for (let i = 1; i <= 14; i++) {
    const tag = ymdPlus(b.ymd, i);
    const f = fensterAm(tag);
    if (f) {
      const wann = i === 1 ? "morgen" : WOCHENTAGE[wochentagVon(tag)];
      return {
        offen: false,
        wochentag: b.wochentag,
        feiertag,
        titel: feiertag ? `Feiertag (${feiertag})` : "Geschlossen",
        detail: `öffnet ${wann} um ${hhmm(f.von)} Uhr`,
        naechsteOeffnung: berlinZuDate(tag, f.von),
      };
    }
  }
  return { offen: false, wochentag: b.wochentag, feiertag, titel: "Geschlossen", detail: "", naechsteOeffnung: null };
}

// ---------------------------------------------------------------- Slots

const ueberschneidet = (aStart, aEnde, belegt) => belegt.some((x) => aStart < x.bis && x.von < aEnde);

/**
 * Freie Slots je Tag.
 * dauer   Minuten
 * belegt  [{ von: Date|ISO, bis: Date|ISO }]
 * Rückgabe: [{ ymd, wochentag, label, slots: [{ start: ISO, zeit: "09:30" }] }]
 */
export function freieSlots({ dauer = 30, belegt = [], jetzt = new Date(), vorlaufMinuten = TERMIN_REGELN.vorlaufMinuten, abTagen = 0, tage = TERMIN_REGELN.tageVoraus, raster = TERMIN_REGELN.raster } = {}) {
  const b = berlin(jetzt);
  const frueheste = jetzt.getTime() + vorlaufMinuten * 60000;
  const blockiert = belegt.map((x) => ({ von: new Date(x.von).getTime(), bis: new Date(x.bis).getTime() }));
  const ergebnis = [];

  for (let i = abTagen; i <= tage; i++) {
    const ymd = ymdPlus(b.ymd, i);
    const f = fensterAm(ymd);
    if (!f) continue;
    const slots = [];
    for (let m = f.von; m + dauer <= f.bis; m += raster) {
      const start = berlinZuDate(ymd, m).getTime();
      const ende = start + dauer * 60000;
      if (start < frueheste || ueberschneidet(start, ende, blockiert)) continue;
      slots.push({ start: new Date(start).toISOString(), zeit: hhmm(m) });
    }
    if (slots.length) {
      const [, mo, ta] = ymd.split("-");
      ergebnis.push({ ymd, wochentag: wochentagVon(ymd), label: `${WOCHENTAGE_KURZ[wochentagVon(ymd)]}, ${Number(ta)}.${Number(mo)}.`, slots });
    }
  }
  return ergebnis;
}

/** Slots für eine Termin-Art (berücksichtigt Vorlauf je Art). */
export function slotsFuerArt(artId, belegt = [], jetzt = new Date()) {
  const art = TERMIN_ARTEN.find((a) => a.id === artId);
  if (!art) return [];
  return freieSlots({
    dauer: art.dauer,
    belegt,
    jetzt,
    abTagen: art.id === "vor-ort" ? TERMIN_REGELN.vorOrtVorlaufTage : 0,
  });
}

// ---------------------------------------------------------------- Telefonnummern

// Kostenpflichtige/Sonderrufnummern – niemals automatisch anrufen (Missbrauchsschutz).
const GESPERRT_DE = [/^\+49(900|137|138|180|181|190|191|192|193|194|199|118|115|110|112|116)/, /^\+491(1[0-9])$/];

/**
 * Normalisiert auf E.164 und erlaubt nur Rufnummern aus Österreich, Deutschland und der Schweiz.
 * Nationale Nummern mit führender 0 werden als österreichisch gelesen (0662 … -> +43662 …).
 * Rückgabe: "+43627871030" oder null.
 */
export function telefonNormalisieren(eingabe) {
  let t = String(eingabe || "").replace(/\(0\)/g, "").replace(/[\s\-/().]/g, "");
  if (t.startsWith("00")) t = `+${t.slice(2)}`;
  else if (t.startsWith("0")) t = `+43${t.slice(1)}`;
  if (!/^\+[1-9]\d{8,14}$/.test(t)) return null;
  if (!/^\+(49|43|41)/.test(t)) return null;
  if (GESPERRT_DE.some((r) => r.test(t))) return null;
  if (/^\+43(8[12]\d|900|901|930|931|939)/.test(t) || /^\+41(90[0-9])/.test(t)) return null;
  return t;
}
