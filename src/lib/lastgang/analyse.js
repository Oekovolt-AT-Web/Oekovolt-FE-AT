// src/lib/lastgang/analyse.js
//
// Kennzahlen und Profile aus einem gelesenen Lastgang (siehe parser.js). Reine Funktionen,
// im Browser und in Node lauffähig. Alle Ergebnisse sind Richtwerte aus den gelieferten Daten.
//
// Begriffe:
//  - Leistung je Intervall: kW = kWh × 60 / Intervall (Minuten)
//  - Spitzenlast: höchste Viertelstunden-Leistung (Basis für den Leistungspreis)
//  - Grundlast: 5-%-Quantil der Viertelstunden-Leistung (robust gegen einzelne Ausreißer)
//  - Benutzungsdauer: Jahresverbrauch ÷ Spitzenlast (Stunden) – hoch = gleichmäßige Last
//  - Tagtypen: Werktag (Mo–Fr), Samstag, Sonn- und Feiertag (gesetzliche Feiertage nach
//    § 7 Abs. 2 Arbeitsruhegesetz, https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008541)

const MIN = 60000;
const TAG = 86400000;

/** Ostersonntag (gregorianisch, Algorithmus nach Meeus/Jones/Butcher) als UTC-ms */
export function ostersonntag(jahr) {
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
  return Date.UTC(jahr, monat - 1, tag);
}

const feiertagCache = new Map();
/** Gesetzliche Feiertage in Österreich (ARG § 7 Abs. 2) als Set von Tages-ms (UTC-Mitternacht) */
export function feiertageAT(jahr) {
  if (feiertagCache.has(jahr)) return feiertagCache.get(jahr);
  const o = ostersonntag(jahr);
  const fest = [
    [0, 1], [0, 6], [4, 1], [7, 15], [9, 26], [10, 1], [11, 8], [11, 25], [11, 26],
  ].map(([m, d]) => Date.UTC(jahr, m, d));
  const beweglich = [1, 39, 50, 60].map((n) => o + n * TAG); // Ostermontag, Christi Himmelfahrt, Pfingstmontag, Fronleichnam
  const s = new Set([...fest, ...beweglich]);
  feiertagCache.set(jahr, s);
  return s;
}

const tagBeginn = (t) => t - (((t % TAG) + TAG) % TAG);

/** 0 = Werktag (Mo–Fr), 1 = Samstag, 2 = Sonn- oder Feiertag */
export function tagTyp(t) {
  const beginn = tagBeginn(t);
  const wt = (new Date(beginn).getUTCDay() + 6) % 7;
  if (wt === 6 || feiertageAT(new Date(beginn).getUTCFullYear()).has(beginn)) return 2;
  return wt === 5 ? 1 : 0;
}

/** Quantil (0–1) einer Zahlenreihe */
export function quantil(werte, q) {
  const s = Float64Array.from(werte).sort();
  if (!s.length) return NaN;
  const pos = (s.length - 1) * q;
  const u = Math.floor(pos);
  const o = Math.ceil(pos);
  return s[u] + (s[o] - s[u]) * (pos - u);
}

/**
 * Analysiert einen Lastgang.
 * @param {{ zeiten: Float64Array, kwh: Float64Array, intervall: number }} lg
 */
export function analysiere(lg) {
  const { zeiten, kwh, intervall } = lg;
  const n = kwh.length;
  const proTag = 1440 / intervall;
  const zuKw = 60 / intervall;
  const kw = new Float64Array(n);
  let summe = 0;
  let spitzeI = 0;
  for (let i = 0; i < n; i++) {
    kw[i] = kwh[i] * zuKw;
    summe += kwh[i];
    if (kw[i] > kw[spitzeI]) spitzeI = i;
  }
  const von = zeiten[0];
  const bis = zeiten[n - 1] + intervall * MIN;
  const tage = n / proTag;
  const spanneTage = (bis - von) / TAG;
  const erwartet = Math.round((bis - von) / (intervall * MIN));
  const fehlend = Math.max(0, erwartet - n);
  const faktorJahr = (365 * proTag) / n; // Hochrechnung (auch Lücken werden mit dem Mittel gefüllt)
  const jahresverbrauch = summe * faktorJahr;
  const hochgerechnet = tage < 350;
  const spitze = { kw: kw[spitzeI], t: zeiten[spitzeI] };
  const grundlast = quantil(kw, 0.05);
  const mittelKw = (summe * zuKw) / n;

  // Tagesgang je Tagtyp, Wochentage, Monate, Heatmap
  const tg = [0, 1, 2].map(() => ({ s: new Float64Array(proTag), n: new Float64Array(proTag), max: new Float64Array(proTag) }));
  const wtSumme = new Float64Array(7);
  const wtWerte = new Float64Array(7);
  const monate = new Map();
  const tagIndex = new Map();
  const tagesListe = [];
  let energieFrei = 0;
  const tagesEnergie = new Map();
  for (let i = 0; i < n; i++) {
    const t = zeiten[i];
    const beginn = tagBeginn(t);
    const slot = Math.min(proTag - 1, Math.floor((t - beginn) / (intervall * MIN)));
    const typ = tagTyp(t);
    const g = tg[typ];
    g.s[slot] += kw[i];
    g.n[slot]++;
    if (kw[i] > g.max[slot]) g.max[slot] = kw[i];
    const wt = (new Date(beginn).getUTCDay() + 6) % 7;
    wtSumme[wt] += kwh[i];
    wtWerte[wt]++;
    if (typ > 0) energieFrei += kwh[i];
    const d = new Date(t);
    const mk = d.getUTCFullYear() * 12 + d.getUTCMonth();
    let m = monate.get(mk);
    if (!m) {
      m = { jahr: d.getUTCFullYear(), monat: d.getUTCMonth(), kwh: 0, spitzeKw: 0, spitzeT: t, werte: 0 };
      monate.set(mk, m);
    }
    m.kwh += kwh[i];
    m.werte++;
    if (kw[i] > m.spitzeKw) {
      m.spitzeKw = kw[i];
      m.spitzeT = t;
    }
    if (!tagIndex.has(beginn)) {
      tagIndex.set(beginn, tagesListe.length);
      tagesListe.push(beginn);
    }
    tagesEnergie.set(beginn, (tagesEnergie.get(beginn) || 0) + kwh[i]);
  }
  const tagesgang = {
    slots: proTag,
    werktag: Array.from(tg[0].s, (s, j) => (tg[0].n[j] ? s / tg[0].n[j] : NaN)),
    samstag: Array.from(tg[1].s, (s, j) => (tg[1].n[j] ? s / tg[1].n[j] : NaN)),
    sonntag: Array.from(tg[2].s, (s, j) => (tg[2].n[j] ? s / tg[2].n[j] : NaN)),
    werktagMax: Array.from(tg[0].max),
    tage: [0, 1, 2].map((k) => Math.round(Math.max(...tg[k].n) || 0)),
  };
  const wochentage = Array.from(wtSumme, (s, i) => ({ tag: i, kwhProTag: wtWerte[i] ? (s / wtWerte[i]) * proTag : NaN, tage: wtWerte[i] / proTag }));
  const monatsListe = [...monate.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, m]) => {
      const tageImMonat = new Date(Date.UTC(m.jahr, m.monat + 1, 0)).getUTCDate();
      const abdeckung = m.werte / (tageImMonat * proTag);
      return { jahr: m.jahr, monat: m.monat, kwh: m.kwh, spitzeKw: m.spitzeKw, spitzeT: m.spitzeT, abdeckung };
    });

  // Top-Spitzen an verschiedenen Tagen
  const reihenfolge = Array.from({ length: n }, (_, i) => i).sort((a, b) => kw[b] - kw[a]);
  const topSpitzen = [];
  const gesehen = new Set();
  for (const i of reihenfolge) {
    const b = tagBeginn(zeiten[i]);
    if (gesehen.has(b)) continue;
    gesehen.add(b);
    topSpitzen.push({ kw: kw[i], t: zeiten[i] });
    if (topSpitzen.length === 5) break;
  }

  // Jahresdauerlinie (absteigend sortiert, auf ≤ 241 Stützstellen verdichtet)
  const sortiert = reihenfolge.map((i) => kw[i]);
  const stuetz = Math.min(241, n);
  const dauerlinie = Array.from({ length: stuetz }, (_, j) => {
    const pos = Math.round((j / (stuetz - 1)) * (n - 1));
    return { anteil: pos / (n - 1), kw: sortiert[pos] };
  });
  // Stunden über Schwellen (für „x % der Spitze“)
  const stundenUeber = (schwelleKw) => {
    let c = 0;
    for (let i = 0; i < n; i++) if (kw[i] > schwelleKw) c++;
    return (c * intervall) / 60;
  };

  // Heatmap: Tage × Slots, fehlende Werte als NaN
  const heat = new Float32Array(tagesListe.length * proTag).fill(NaN);
  for (let i = 0; i < n; i++) {
    const beginn = tagBeginn(zeiten[i]);
    const slot = Math.min(proTag - 1, Math.floor((zeiten[i] - beginn) / (intervall * MIN)));
    const idx = tagIndex.get(beginn) * proTag + slot;
    heat[idx] = Number.isNaN(heat[idx]) ? kw[i] : (heat[idx] + kw[i]) / 2; // doppelte Oktober-Stunde gemittelt
  }

  // Monatsspitzen-Mittel (Basis Leistungspreis bis Ende 2026)
  const volleMonate = monatsListe.filter((m) => m.abdeckung >= 0.5);
  const basis = volleMonate.length ? volleMonate : monatsListe;
  const mittelMonatsspitze = basis.reduce((s, m) => s + m.spitzeKw, 0) / basis.length;

  const benutzungsdauer = spitze.kw > 0 ? jahresverbrauch / spitze.kw : NaN;
  return {
    n,
    intervall,
    von,
    bis,
    tage,
    spanneTage,
    fehlend,
    summe,
    faktorJahr,
    jahresverbrauch,
    hochgerechnet,
    spitze,
    topSpitzen,
    grundlast,
    mittelKw,
    benutzungsdauer,
    lastfaktor: spitze.kw > 0 ? mittelKw / spitze.kw : NaN,
    grundlastAnteil: jahresverbrauch > 0 ? Math.min(1, (grundlast * 8760) / jahresverbrauch) : NaN,
    anteilFrei: summe > 0 ? energieFrei / summe : NaN,
    mittelMonatsspitze,
    tagesgang,
    wochentage,
    monate: monatsListe,
    dauerlinie,
    stundenUeber,
    heat: { tage: tagesListe, slots: proTag, werte: heat, max: spitze.kw },
    tagesEnergie,
    kw,
  };
}
