// src/lib/rechner/dynamischerTarif.js
//
// Dynamischer-Stromtarif-Rechner: Tageskosten Festpreis vs. Spotpreis-Tarif
// auf Basis der echten Day-Ahead-Preise der Gebotszone Österreich (AT)
// (Energy-Charts / Fraunhofer ISE, bzn=AT; Abruf in src/lib/energy.js). Die
// Endkundenpreis-Annahmen (Aufschlag, USt., Festpreis) werden als Parameter
// übergeben – Quelle ist TARIF_ANNAHMEN in src/lib/energy.js.

import { HAUSHALT_MONAT, HEIZ_MONAT, TAGE_MONAT, PROFIL_HAUSHALT, PROFIL_WP, PROFIL_EAUTO } from "./profile.js";

// Österreich: Europe/Vienna (gleiche UTC-Offsets wie Berlin, aber fachlich korrekt benannt)
const TZ = "Europe/Vienna";
const datumFmt = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ });
const stundeFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "numeric", hourCycle: "h23" });

/** YYYY-MM-DD in Wiener Zeit */
export const wienTag = (t) => datumFmt.format(new Date(t));
/** Stunde 0–23 in Wiener Zeit */
export const wienStunde = (t) => Number(stundeFmt.formatToParts(new Date(t)).find((p) => p.type === "hour")?.value || 0) % 24;
// Alte Namen (DE-Fassung) – kompatibel gehalten
export const berlinTag = wienTag;
export const berlinStunde = wienStunde;

/** Endkundenpreis Spotpreis-Tarif brutto in ct/kWh */
export const bruttoCt = (eurMwh, a) => (eurMwh / 10 + a.aufschlagCt) * (1 + a.mwst);

/** Vorkonfigurierte Verbrauchsprofile */
export const PROFILE = {
  haushalt: { id: "haushalt", label: "Haushalt", sub: "Standard", haushaltKwh: 4000, km: 0, wpKwh: 0 },
  eauto: { id: "eauto", label: "E-Auto", sub: "+ Haushalt", haushaltKwh: 4000, km: 15000, wpKwh: 0 },
  wp: { id: "wp", label: "Wärmepumpe", sub: "+ Haushalt", haushaltKwh: 4000, km: 0, wpKwh: 4000 },
};

export const TARIF_PARAMETER = {
  eAutoKwhJe100: 18,
  eAutoLadeleistungKw: 11,
  wpLeistungKw: 3,
  haushaltFlexKw: 2.5,
  // Welcher Teil einer Last sich überhaupt verschieben lässt (bei 100 % Schieberegler)
  flexAnteil: { eauto: 1, wp: 0.5, haushalt: 0.15 },
};

/**
 * Preis-Slots eines Tages.
 * @returns [{ t, eurMwh, dauerH, stunde, ct }]
 */
export function tagesSlots(punkte = [], tag, aufloesungMin = 15, annahmen) {
  const dauerH = aufloesungMin / 60;
  return punkte
    .filter((p) => wienTag(p.t) === tag)
    .sort((a, b) => a.t - b.t)
    .map((p) => ({ t: p.t, eurMwh: p.eurMwh, dauerH, stunde: wienStunde(p.t), ct: bruttoCt(p.eurMwh, annahmen) }));
}

/** Lastgang je Slot für ein Profil (kWh je Slot, getrennt nach Verbraucher) */
export function tagesLast(slots, { haushaltKwh = 4000, km = 0, wpKwh = 0 }, tag) {
  const monat = Number(tag.slice(5, 7)) - 1;
  const tage = TAGE_MONAT[monat];
  const hhTag = (haushaltKwh * HAUSHALT_MONAT[monat]) / tage;
  const evTag = (km * TARIF_PARAMETER.eAutoKwhJe100) / 100 / 365;
  const wpTag = (wpKwh * (0.82 * HEIZ_MONAT[monat] + 0.18 / 12)) / tage;
  // Slots je Stunde zählen (Zeitumstellung, 15-min- vs. 60-min-Raster)
  const jeStunde = new Array(24).fill(0);
  slots.forEach((s) => (jeStunde[s.stunde] += s.dauerH));
  const anteil = (s) => (jeStunde[s.stunde] > 0 ? s.dauerH / jeStunde[s.stunde] : 0);
  return {
    haushalt: slots.map((s) => hhTag * PROFIL_HAUSHALT[s.stunde] * anteil(s)),
    eauto: slots.map((s) => evTag * PROFIL_EAUTO[s.stunde] * anteil(s)),
    wp: slots.map((s) => wpTag * PROFIL_WP[s.stunde] * anteil(s)),
    tagesKwh: { haushalt: hhTag, eauto: evTag, wp: wpTag, gesamt: hhTag + evTag + wpTag },
  };
}

/** Verschiebt den flexiblen Teil jeder Last in die günstigsten Slots. */
export function verschiebe(slots, last, verschiebbarkeit) {
  const P = TARIF_PARAMETER;
  const nachPreis = slots.map((s, i) => i).sort((a, b) => slots[a].ct - slots[b].ct);
  const ergebnis = {};
  const leistung = { eauto: P.eAutoLadeleistungKw, wp: P.wpLeistungKw, haushalt: P.haushaltFlexKw };
  for (const art of ["haushalt", "eauto", "wp"]) {
    const reihe = last[art];
    const flex = P.flexAnteil[art] * verschiebbarkeit;
    const basis = reihe.map((v) => v * (1 - flex));
    let rest = reihe.reduce((a, b) => a + b, 0) * flex;
    const neu = basis.slice();
    for (const i of nachPreis) {
      if (rest <= 1e-9) break;
      const frei = Math.max(leistung[art] * slots[i].dauerH - neu[i], 0);
      const plus = Math.min(frei, rest);
      neu[i] += plus;
      rest -= plus;
    }
    ergebnis[art] = neu;
  }
  return ergebnis;
}

const summeLast = (last, i) => last.haushalt[i] + last.eauto[i] + last.wp[i];

/** Kosten eines Tages in € */
export function tagesKosten(slots, last, festpreisCt) {
  let kwh = 0, dyn = 0;
  slots.forEach((s, i) => {
    const l = summeLast(last, i);
    kwh += l;
    dyn += (l * s.ct) / 100;
  });
  return { kwh, fest: (kwh * festpreisCt) / 100, dynamisch: dyn, mittelCt: kwh > 0 ? (dyn / kwh) * 100 : 0 };
}

/**
 * Günstigstes (oder teuerstes) zusammenhängendes Zeitfenster.
 * @param {number} stunden Fensterlänge
 * @param {number} abT     nur Slots ab diesem Zeitpunkt (z. B. jetzt)
 */
export function zeitfenster(slots, stunden, { abT = 0, teuerstes = false } = {}) {
  if (!slots.length) return null;
  const dauerH = slots[0].dauerH;
  const len = Math.max(1, Math.round(stunden / dauerH));
  let start0 = slots.findIndex((s) => s.t + dauerH * 3600000 > abT);
  if (start0 < 0 || slots.length - start0 < len) start0 = 0;
  if (slots.length < len) return null;
  let best = null;
  for (let i = start0; i + len <= slots.length; i++) {
    let sum = 0;
    for (let j = i; j < i + len; j++) sum += slots[j].ct;
    const avg = sum / len;
    if (!best || (teuerstes ? avg > best.avgCt : avg < best.avgCt)) best = { von: i, bis: i + len - 1, avgCt: avg };
  }
  if (!best) return null;
  return { ...best, startT: slots[best.von].t, endeT: slots[best.bis].t + dauerH * 3600000 };
}

/**
 * Gesamtauswertung für einen Tag.
 * @param {object} e { punkte, aufloesungMin, tag, profil, verschiebbarkeit, festpreisCt, annahmen, fensterStunden, jetzt }
 */
export function rechneDynamisch({ punkte, aufloesungMin, tag, profil, verschiebbarkeit, festpreisCt, annahmen, fensterStunden = 3, jetzt = 0 }) {
  const slots = tagesSlots(punkte, tag, aufloesungMin, annahmen);
  if (!slots.length) return null;
  const last = tagesLast(slots, profil, tag);
  const ohne = tagesKosten(slots, last, festpreisCt);
  const verschoben = verschiebe(slots, last, verschiebbarkeit);
  const mit = tagesKosten(slots, verschoben, festpreisCt);
  const cts = slots.map((s) => s.ct);
  const mittelCt = cts.reduce((a, b) => a + b, 0) / cts.length;
  const min = slots.reduce((a, b) => (b.ct < a.ct ? b : a));
  const max = slots.reduce((a, b) => (b.ct > a.ct ? b : a));
  return {
    slots,
    last,
    verschoben,
    kwh: ohne.kwh,
    fest: ohne.fest,
    dynamischOhne: ohne.dynamisch,
    dynamischMit: mit.dynamisch,
    mittelCtEffektiv: mit.mittelCt,
    ersparnisTag: ohne.fest - mit.dynamisch,
    verschiebeVorteil: ohne.dynamisch - mit.dynamisch,
    mittelCt,
    min,
    max,
    negativ: slots.filter((s) => s.eurMwh < 0).length * slots[0].dauerH,
    guenstigerAlsFest: slots.filter((s) => s.ct < festpreisCt).length * slots[0].dauerH,
    fenster: zeitfenster(slots, fensterStunden, { abT: jetzt }),
    teuer: zeitfenster(slots, fensterStunden, { abT: jetzt, teuerstes: true }),
  };
}
