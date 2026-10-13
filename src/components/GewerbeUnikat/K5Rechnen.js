// src/components/GewerbeUnikat/K5Rechnen.js
//
// K5 · Leistungspreis – REINE Rechen- und Aufbereitungsfunktionen (ohne React, ohne Browser-APIs).
// Server-Hülle (Startzustand, SSR-Platzhalter) und Client-Bühne rechnen mit DENSELBEN Funktionen, damit
// Platzhalter und interaktive Grafik pixelgleich sind (kein CLS, keine Abweichung).
//
// Datenherkunft: Monatsspitzen und Kappungstabelle aus dem Lastgang (src/lib/lastgang/analyse.js, peak.js,
// über ./_server.js bzw. den Web Worker), Sonnenstand aus src/lib/lastgang/pv.js (NOAA-Näherung),
// Leistungspreis aus src/lib/rechner/peakshaving.js (SNE-V 2018 – Novelle 2026).
// Relative Importe mit Endung, damit die Datei auch in Node ohne Bundler prüfbar ist.

import { sonnenstand } from "../../lib/lastgang/pv.js";
import { wandZuUtc } from "../../lib/lastgang/parser.js";
import { schwellenBereich } from "../../lib/lastgang/peak.js";
import { netzpreise } from "../../lib/rechner/peakshaving.js";
import { zahl } from "./_tokens.js";

export const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
export const MONATE_KURZ = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const MONATE_BUCHSTABE = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN = 60000;
const zwei = (n) => String(n).padStart(2, "0");

/** Minuten seit Mitternacht → "06:15" */
export function uhrzeit(minuten) {
  const m = ((Math.round(minuten) % 1440) + 1440) % 1440;
  return `${zwei(Math.floor(m / 60))}:${zwei(m % 60)}`;
}

/** Wanduhr-Zeitpunkt (UTC-ms-Kodierung wie im Lastgang) → Minuten, Uhrzeit, „Fr 5.12.“ */
export function zeitpunkt(t) {
  const d = new Date(t);
  const minuten = d.getUTCHours() * 60 + d.getUTCMinutes();
  // geschütztes Leerzeichen: „Fr 5.12.“ bricht nie um
  return { minuten, uhr: uhrzeit(minuten), tag: `${WOCHENTAGE[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth() + 1}.` };
}

/** Geschütztes Leerzeichen – Zahl, Einheit und „≈“ bleiben zusammen. */
export const NB = " ";

/** Euro wie euroRund() aus ./_tokens.js gerundet, aber als Zahl (10 € unter 10.000 €, sonst 100 €). */
export function euroWert(n) {
  if (!Number.isFinite(n)) return n;
  const schritt = Math.abs(n) >= 10000 ? 100 : 10;
  return Math.round(n / schritt) * schritt;
}

/** „≈ 4.050 €“ mit geschützten Leerzeichen (kein Umbruch zwischen ≈, Zahl und €). */
export const euroText = (n) => (Number.isFinite(n) ? `≈${NB}${zahl(euroWert(n))}${NB}€` : "–");

/**
 * Sonnenstand zur Spitze in drei Längen – überall gleich benannt (Ausgabesatz, Ring-Liste, Tabelle):
 * ≤ 0° „unter dem Horizont“, unter 1° „am Horizont“, sonst „x° hoch“ bzw. „x° über dem Horizont“.
 */
export function sonneTexte(hoehe, morgens = true) {
  if (!(hoehe > 0)) return { lang: `${morgens ? "noch" : "schon"} unter dem Horizont`, kurz: "unter Horizont", tabelle: "unter dem Horizont" };
  if (hoehe < 1) return { lang: "am Horizont", kurz: "am Horizont", tabelle: "am Horizont" };
  return { lang: `${zahl(hoehe)}°${NB}über dem Horizont`, kurz: `${zahl(hoehe)}°${NB}hoch`, tabelle: `${zahl(hoehe)}° hoch` };
}

/** Sonnenhöhe in Grad zu einem Wanduhr-Zeitpunkt (Österreich, Sommerzeit berücksichtigt). */
export function sonnenHoehe(wandMs, lat, lon) {
  return 90 - sonnenstand(wandZuUtc(wandMs), lat, lon).zenit;
}

/** Ab dieser Sonnenhöhe (Grad) zeichnet die Uhr den kräftigen Kern des Sonnenbogens. */
export const KERN_HOEHE = 20;

/**
 * Sonnenbögen der Spitzen-Uhr: am 15. jedes Monats Aufgang bis Untergang (Wanduhr-Minuten),
 * aus sonnenstand() in 5-Minuten-Schritten (Zenit < 90°).
 * kernAuf/kernUnter: Zeitraum mit Sonnenhöhe ≥ KERN_HOEHE (null, wenn die Sonne nie so hoch steht).
 * @returns {{auf:number, unter:number, kernAuf:number|null, kernUnter:number|null, mittag:number, hoehe:number}[]}
 */
export function sonnenboegen(lat, lon, jahr = 2025) {
  return Array.from({ length: 12 }, (_, m) => {
    let auf = null;
    let unter = null;
    let kernAuf = null;
    let kernUnter = null;
    let mittag = 720;
    let besterZenit = 180;
    for (let min = 0; min < 1440; min += 5) {
      const z = sonnenstand(wandZuUtc(Date.UTC(jahr, m, 15) + min * MIN), lat, lon).zenit;
      if (z < 90) {
        if (auf == null) auf = min;
        unter = min;
      }
      if (z <= 90 - KERN_HOEHE) {
        if (kernAuf == null) kernAuf = min;
        kernUnter = min;
      }
      if (z < besterZenit) {
        besterZenit = z;
        mittag = min;
      }
    }
    return { auf: auf ?? 720, unter: unter ?? 720, kernAuf, kernUnter, mittag, hoehe: 90 - besterZenit };
  });
}

/**
 * Monatsliste → 12 Plätze nach Kalendermonat (Jänner = 0). Bei mehr als einem Jahr gewinnt der Monat mit
 * der besseren Abdeckung, bei Gleichstand der spätere. Fehlende Monate: null.
 */
export function monatsPlaetze(liste) {
  const plaetze = new Array(12).fill(null);
  for (const m of liste || []) {
    const alt = plaetze[m.monat];
    const abd = m.abdeckung ?? 1;
    if (!alt || abd > (alt.abdeckung ?? 1) || (abd === (alt.abdeckung ?? 1) && m.jahr >= alt.jahr)) plaetze[m.monat] = m;
  }
  return plaetze;
}

/** true, wenn alle 12 Kalendermonate mit mindestens halber Abdeckung vorliegen (Peak-Shaving-Rechner). */
export const zwoelfVolle = (plaetze) => plaetze.every((m) => m && (m.abdeckung ?? 1) >= 0.5);

/** Index des Zeitpunkts t in einer aufsteigenden Zeitreihe (binäre Suche), sonst -1. */
export function indexVon(zeiten, t) {
  let lo = 0;
  let hi = zeiten.length - 1;
  while (lo <= hi) {
    const mitte = (lo + hi) >> 1;
    const v = zeiten[mitte];
    if (v === t) {
      // bei doppelter Oktober-Stunde den ersten Treffer nehmen
      let i = mitte;
      while (i > 0 && zeiten[i - 1] === t) i--;
      return i;
    }
    if (v < t) lo = mitte + 1;
    else hi = mitte - 1;
  }
  return -1;
}

/** PV-Leistung (kW) zur Monatsspitze: pv.reihe[i] × kWp × 60/intervall am Index von spitzeT. */
export function pvBeiSpitzen(plaetze, reihe, pvReihe, kwp, intervall) {
  const zuKw = 60 / intervall;
  return plaetze.map((m) => {
    if (!m) return null;
    const i = indexVon(reihe.zeiten, m.spitzeT);
    if (i < 0) return null;
    return Math.max(0, pvReihe[i] * kwp * zuKw);
  });
}

/**
 * Monatsspitzen des Netzbezugs mit PV (ohne Speicher) – lokale Kopie von monatsspitzenMitPv() aus
 * ./_rechnen.js (Regel „_rechnen nie statisch in Client-Bühnen“; Laufzeit ≈ 0,3 ms).
 */
export function monatsspitzenMitPv(reihe, pvReihe, kwp, intervall) {
  const zuKw = 60 / intervall;
  const spitzen = new Array(12).fill(NaN);
  for (let i = 0; i < reihe.kw.length; i++) {
    const m = new Date(reihe.zeiten[i]).getUTCMonth();
    const v = Math.max(0, reihe.kw[i] - pvReihe[i] * kwp * zuKw);
    if (!(spitzen[m] >= v)) spitzen[m] = v;
  }
  const gueltig = spitzen.filter(Number.isFinite);
  return { spitzen, mittel: gueltig.reduce((s, v) => s + v, 0) / Math.max(1, gueltig.length) };
}

/** Mittelwert der gültigen Zahlen. */
export function mittel(werte) {
  const g = werte.filter(Number.isFinite);
  return g.length ? g.reduce((s, v) => s + v, 0) / g.length : NaN;
}

/** Startdeckel: 74 % der Jahresspitze, auf 5 kW abgerundet (Beispiel: 311,6 kW → 230 kW). */
export const startDeckel = (spitzeKw) => Math.floor((spitzeKw * 0.74) / 5) * 5;

/** Reglerbereich wie peak.js (schwellenBereich) – vor dem Worker aus Spitze und mittlerer Last. */
export function deckelBereich(spitzeKw, mittelKw, kapp) {
  if (kapp?.bereich) return { min: kapp.bereich.min, max: kapp.bereich.max, schritt: kapp.bereich.schritt };
  const b = schwellenBereich({ spitze: { kw: spitzeKw }, mittelKw });
  return { min: b.min, max: b.max, schritt: b.schritt };
}

/** Zeile der Kappungstabelle mit der nächstgelegenen Schwelle; null ohne Tabelle. */
export function zeileFuer(zeilen, deckel) {
  if (!zeilen?.length) return null;
  let beste = zeilen[0];
  for (const z of zeilen) if (Math.abs(z.schwelle - deckel) < Math.abs(beste.schwelle - deckel)) beste = z;
  return beste;
}

/** Größte Nennkapazität der Tabelle (Batterie-Skala). */
export function groessteKwh(zeilen) {
  let max = 0;
  for (const z of zeilen || []) if (z.moeglich && Number.isFinite(z.nennKwh) && z.nennKwh > max) max = z.nennKwh;
  return max;
}

/** Grenznutzen-Punkte: €/Jahr über Nennkapazität (monoton, je kWh-Stufe der größte Wert). */
export function grenzPunkte(zeilen, lp) {
  const nachKwh = new Map([[0, 0]]);
  for (const z of zeilen || []) {
    if (!z.moeglich || !Number.isFinite(z.nennKwh)) continue;
    const euro = z.senkungKw * lp;
    if (!(nachKwh.get(z.nennKwh) >= euro)) nachKwh.set(z.nennKwh, euro);
  }
  const punkte = [...nachKwh.entries()].map(([kwh, euro]) => ({ kwh, euro })).sort((a, b) => a.kwh - b.kwh);
  // monoton steigend halten (Tabellenrundung auf 5/10 kWh)
  for (let i = 1; i < punkte.length; i++) punkte[i].euro = Math.max(punkte[i].euro, punkte[i - 1].euro);
  return punkte;
}

/**
 * Satz zum Grenznutzen: „Die ersten 60 kW Kappung brauchen {a} kWh – die nächsten 40 kW zusätzlich {b} kWh.“
 * Stufen skaliert mit der Jahresspitze (≈ 19 % und 13 %, auf 5 kW gerundet; beim Beispiel 60 und 40 kW).
 */
export function grenzSatz(zeilen, spitzeKw) {
  if (!zeilen?.length || !(spitzeKw > 0)) return null;
  const runde5 = (x) => Math.max(5, Math.round(x / 5) * 5);
  const s1 = runde5(spitzeKw * 0.19);
  const s2 = runde5(spitzeKw * 0.13);
  const finde = (kappung) => [...zeilen].sort((a, b) => b.schwelle - a.schwelle).find((z) => spitzeKw - z.schwelle >= kappung - 1e-9);
  const z1 = finde(s1);
  const z2 = finde(s1 + s2);
  if (!z1 || !z2 || !z1.moeglich || !z2.moeglich || !Number.isFinite(z1.nennKwh) || !Number.isFinite(z2.nennKwh)) return null;
  return { s1, s2, a: z1.nennKwh, b: Math.max(0, z2.nennKwh - z1.nennKwh), text: `Die ersten ${zahl(s1)} kW Kappung brauchen ${zahl(z1.nennKwh)} kWh – die nächsten ${zahl(s2)} kW zusätzlich ${zahl(Math.max(0, z2.nennKwh - z1.nennKwh))} kWh.` };
}

/** y-Achse der Monatstürme: ab 0 bis zur nächsten 50 kW über 108 % der Jahresspitze. */
export const yMaxFuer = (spitzeKw) => Math.max(50, Math.ceil((spitzeKw * 1.08) / 50) * 50);

/** Leistungspreis (€/kW und Jahr) und Etikett für Netzbereich/Netzebene. */
export function leistungspreis(bereichId, ne) {
  const n = netzpreise(bereichId, ne);
  return { lp: n.lp, bereich: n.bereich.label, ne: Number(ne) || 6 };
}

// ---------------------------------------------------------------------------------------------------
// Staffelstart (schematisch): drei Verbraucher, Anlaufspitze × 1,5 für eine Viertelstunde
// ---------------------------------------------------------------------------------------------------

export const STAFFEL_VERBRAUCHER = [
  { id: "kompressor", label: "Kompressor", kw: 45 },
  { id: "presse", label: "Presse", kw: 60 },
  { id: "lueftung", label: "Lüftung", kw: 30 },
];
export const STAFFEL_SLOTS = ["05:45", "06:00", "06:15", "06:30", "06:45", "07:00"];
export const STAFFEL_ANLAUF = 1.5;
const STAFFEL_START = { gleichzeitig: [1, 1, 1], gestaffelt: [1, 2, 3] };

/**
 * Viertelstunden 05:45–07:00 je Verbraucher: Grundleistung und Anlauf-Zuschlag.
 * @returns {{ spalten: {basis:number[], anlauf:number[], summe:number}[], spitze:number, spitzeSlot:number }}
 */
export function staffelReihen(modus) {
  const starts = STAFFEL_START[modus] || STAFFEL_START.gleichzeitig;
  const spalten = STAFFEL_SLOTS.map((_, s) => {
    const basis = STAFFEL_VERBRAUCHER.map((v, j) => (s >= starts[j] ? v.kw : 0));
    const anlauf = STAFFEL_VERBRAUCHER.map((v, j) => (s === starts[j] ? v.kw * (STAFFEL_ANLAUF - 1) : 0));
    return { basis, anlauf, summe: basis.reduce((a, b) => a + b, 0) + anlauf.reduce((a, b) => a + b, 0) };
  });
  let spitzeSlot = 0;
  spalten.forEach((sp, s) => {
    if (sp.summe > spalten[spitzeSlot].summe) spitzeSlot = s;
  });
  return { spalten, spitze: spalten[spitzeSlot].summe, spitzeSlot };
}

// ---------------------------------------------------------------------------------------------------
// Ansichts-Modell: EIN Objekt für die reine Ansicht (K5Ansicht) – vom Server (Startzustand) und vom Client
// ---------------------------------------------------------------------------------------------------

/**
 * @param {object} d Daten: { plaetze, boegen, ort:{name,lat,lon}, kwp, spitzeKw, mittelKw, pvKw[]|null,
 *   mitPv:{spitzen,mittel}, zeilen[]|null, kappBereich?, vollstaendig:boolean (volle Tabelle),
 *   bereichId, ne, quelle }
 * @param {object} z Zustand: { monat, gewaehlt?, deckel, sonne, modus, staffel } – monat = angezeigter Monat
 *   (Auswahl oder Hover-Vorschau), gewaehlt = ausgewählter Monat (aria-pressed, Tastatur-Fokus)
 */
export function ansichtModell(d, z) {
  const { lp, bereich, ne } = leistungspreis(d.bereichId, d.ne);
  const monate = d.plaetze.map((m, i) => {
    if (!m) return { i, kurz: MONATE_KURZ[i], lang: MONATE_LANG[i], buchstabe: MONATE_BUCHSTABE[i], leer: true };
    const zp = zeitpunkt(m.spitzeT);
    const hoehe = sonnenHoehe(m.spitzeT + 7.5 * MIN, d.ort.lat, d.ort.lon);
    const pv = d.pvKw ? d.pvKw[i] : hoehe <= 0 ? 0 : null; // ohne Sonne liefert die Anlage sicher nichts
    const morgens = zp.minuten < (d.boegen[i]?.mittag ?? 720);
    const st = sonneTexte(hoehe, morgens);
    const pvText = pv == null ? "PV wird berechnet" : `PV liefert ${zahl(pv)}${NB}kW`;
    return {
      i,
      kurz: MONATE_KURZ[i],
      lang: MONATE_LANG[i],
      buchstabe: MONATE_BUCHSTABE[i],
      kw: m.spitzeKw,
      minuten: zp.minuten,
      uhr: zp.uhr,
      tag: zp.tag,
      hoehe,
      pv,
      sonneKurz: st.kurz,
      sonneTabelle: st.tabelle,
      satz: `${MONATE_LANG[i]}: ${zahl(m.spitzeKw)}${NB}kW am ${zp.tag} um${NB}${zp.uhr} – Sonne: ${st.lang} · ${pvText}`,
    };
  });
  const gueltig = monate.filter((m) => !m.leer);
  const ohnePv = monate.map((m) => (m.leer ? NaN : m.kw));
  const mittelOhne = mittel(ohnePv);
  // Zählen nur, wenn alle Werte bekannt sind (sonst null → kein Satz)
  const pvBekannt = gueltig.every((m) => m.pv != null);
  const nullMonate = pvBekannt ? gueltig.filter((m) => m.pv < 0.5).length : null;
  // häufigste Uhrzeit der Spitzen (für den Erkenntnis-Satz)
  const zaehler = new Map();
  for (const m of gueltig) zaehler.set(m.uhr, (zaehler.get(m.uhr) || 0) + 1);
  const haeufigste = [...zaehler.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1))[0]?.[0] ?? "06:15";
  const alleUhrzeiten = [...new Set(gueltig.map((m) => m.uhr))].sort();

  const bereichDeckel = deckelBereich(d.spitzeKw, d.mittelKw, d.kappBereich ? { bereich: d.kappBereich } : null);
  const deckel = Math.min(bereichDeckel.max, Math.max(bereichDeckel.min, z.deckel));
  const zeile = d.vollstaendig ? zeileFuer(d.zeilen, deckel) : (d.zeilen || []).find((r) => Math.abs(r.schwelle - deckel) < 1e-6) || null;
  const mitPvWerte = monate.map((m, i) => (m.leer ? NaN : Number.isFinite(d.mitPv?.spitzen?.[i]) ? d.mitPv.spitzen[i] : m.kw));
  const werte = z.sonne ? mitPvWerte : ohnePv;
  const mittelMitPv = mittel(mitPvWerte);
  const pvSenkung = Math.max(0, mittelOhne - mittelMitPv);
  const nachher = mittel(ohnePv.map((v) => Math.min(v, deckel)));
  const groesste = d.vollstaendig ? groessteKwh(d.zeilen) : d.groessteKwh || groessteKwh(d.zeilen);
  const fuell = zeile?.moeglich && groesste > 0 ? Math.min(1, zeile.nennKwh / groesste) : 0;
  // Speicher-Skala (Batterie und Grenznutzen-x): unabhängig davon, ob die volle Kappungstabelle schon da ist –
  // so sind Server-Platzhalter und Bühne gleich groß. Richtwert: 4 Volllaststunden der Jahresspitze, auf 250 kWh.
  const speicherMax = Math.max(250, Math.ceil(Math.max(d.vollstaendig ? groesste : 0, d.spitzeKw * 4) / 250) * 250);
  // Grenznutzen-y: Ersparnis beim tiefsten Deckel – aus den Monatsspitzen, ohne Tabelle
  const amTiefsten = mittel(ohnePv.map((v) => Math.min(v, bereichDeckel.min)));
  const grenzEuroMax = Math.max(1, (mittelOhne - amTiefsten) * lp);
  const kappen2027 = werte.map((v) => (Number.isFinite(v) ? Math.max(0, v - deckel) : NaN));
  const punkte = grenzPunkte(d.zeilen, lp);
  const staffel = staffelReihen(z.staffel);
  const staffelAndere = staffelReihen(z.staffel === "gestaffelt" ? "gleichzeitig" : "gestaffelt");

  return {
    quelle: d.quelle,
    ortName: d.ort.name,
    kwp: d.kwp,
    monate,
    aktiv: z.monat,
    gewaehlt: z.gewaehlt ?? z.monat,
    boegen: d.boegen,
    nullMonate,
    anzahlMonate: gueltig.length,
    haeufigste,
    alleUhrzeiten,
    spitzeKw: d.spitzeKw,
    yMax: yMaxFuer(d.spitzeKw),
    deckel,
    bereichDeckel,
    sonne: z.sonne,
    modus: z.modus,
    werte,
    ohnePv,
    zeile,
    tabelleBereit: !!d.vollstaendig,
    fuell,
    groessteKwh: groesste,
    speicherMax,
    grenzEuroMax,
    mittelOhne,
    mittelNachher: nachher,
    pvAllein: { mittel: mittelMitPv, senkungKw: pvSenkung, euro: pvSenkung * lp },
    lp,
    bereich,
    ne,
    euro: zeile && zeile.moeglich ? zeile.senkungKw * lp : null,
    kappen2027,
    summe2027: kappen2027.filter(Number.isFinite).reduce((s, v) => s + v, 0),
    grenz: { punkte, aktuell: zeile && zeile.moeglich ? { kwh: zeile.nennKwh, euro: zeile.senkungKw * lp } : null, satz: d.vollstaendig ? grenzSatz(d.zeilen, d.spitzeKw) : null },
    staffelModus: z.staffel,
    staffel,
    staffelAndere,
  };
}
