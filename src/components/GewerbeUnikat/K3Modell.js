// src/components/GewerbeUnikat/K3Modell.js
//
// Rechenkern von Kapitel 03 („Sonne trifft Schicht“) – REIN, ohne React und ohne Browser-APIs.
// Läuft in der Client-Bühne (K3SonneSchicht) und in Node-Tests. Bekommt die Daten aus useGewerbeDaten()
// (last = lastAufbereiten, pv = pvAufbereiten aus ./_rechnen.js, im Web Worker gerechnet).
//
// simuliere(), kurve(), rundeKwp() und empfehlung() sind wörtliche Kopien aus src/lib/lastgang/pv.js
// (Node-Test im Scratchpad vergleicht beide Fassungen Zahl für Zahl). Grund: pv.js importiert den
// CSV-Parser (parser.js, ≈ 29 KB) – der soll nicht ins Bundle der Bühne. Änderungen an pv.js hier
// nachziehen.
//
// Annahmen der E-Flotte (wie E-Flotten-Rechner, KLASSEN.transporter in src/lib/rechner/eflotte.js):
// 20.000 km/a × 30 kWh/100 km = 6.000 kWh je Fahrzeug und Jahr, geladen mit 11 kW AC ab 10:00 an
// Arbeitstagen (Mo–Fr ohne Feiertage und ohne Betriebsruhe), bis der Tagesbedarf gedeckt ist.
// Die Werte km und kWh/100 km reicht die Server-Hülle aus eflotte.js herein (kein Import hier).

const TAG = 86400000;

// ---------------------------------------------------------------------------------------------------
// Kopien aus src/lib/lastgang/pv.js (identisch)
// ---------------------------------------------------------------------------------------------------

/** Eigenverbrauch einer Anlage mit kwp auf dem Lastgang (Summen über den Messzeitraum) */
export function simuliere(kwh, pv1, kwp) {
  let ev = 0;
  let erzeugt = 0;
  let last = 0;
  for (let i = 0; i < kwh.length; i++) {
    const p = pv1[i] * kwp;
    erzeugt += p;
    last += kwh[i];
    ev += p < kwh[i] ? p : kwh[i];
  }
  return {
    kwp,
    eigenverbrauch: ev,
    erzeugt,
    einspeisung: erzeugt - ev,
    evQuote: erzeugt > 0 ? ev / erzeugt : 1,
    autarkie: last > 0 ? ev / last : 0,
  };
}

/** Auf „runde“ Anlagengrößen abrunden */
export function rundeKwp(kwp) {
  const schritt = kwp < 30 ? 1 : kwp < 200 ? 5 : kwp < 1000 ? 10 : 50;
  return Math.max(schritt, Math.floor(kwp / schritt) * schritt);
}

/** Größte Anlage, deren Eigenverbrauchsanteil noch ≥ zielQuote ist (Halbierungssuche). */
export function empfehlung(kwh, pv1, jahresverbrauch, jahresErtrag, zielQuote = 0.8) {
  const kwpMax = Math.max(10, (jahresverbrauch * 1.5) / Math.max(jahresErtrag, 1));
  let lo = 0;
  let hi = kwpMax;
  if (simuliere(kwh, pv1, hi).evQuote >= zielQuote) {
    const kwp = rundeKwp(hi);
    return { kwp, ergebnis: simuliere(kwh, pv1, kwp), kwpMax, begrenzt: true };
  }
  for (let k = 0; k < 40; k++) {
    const mitte = (lo + hi) / 2;
    if (simuliere(kwh, pv1, mitte).evQuote >= zielQuote) lo = mitte;
    else hi = mitte;
    if (hi - lo < 0.2) break;
  }
  const kwp = rundeKwp(Math.max(lo, 1));
  return { kwp, ergebnis: simuliere(kwh, pv1, kwp), kwpMax, begrenzt: false };
}

/** Kurve Eigenverbrauchsanteil und Autarkie über der Anlagengröße */
export function kurve(kwh, pv1, kwpMax, punkte = 36) {
  return Array.from({ length: punkte }, (_, j) => {
    const kwp = (kwpMax * (j + 1)) / punkte;
    const r = simuliere(kwh, pv1, kwp);
    return { kwp, evQuote: r.evQuote, autarkie: r.autarkie };
  });
}

// ---------------------------------------------------------------------------------------------------
// Kapitel-Rechnungen
// ---------------------------------------------------------------------------------------------------

/** Rechenbeispiel der Seite (Tabelle, K7) – Strich in der Kurve. */
export const RECHENBEISPIEL_KWP = 300;
/** Ab hier gilt die Erkenntnis „Knick“ (Vielfaches der Empfehlung). */
export const KNICK_FAKTOR = 1.5;
/** Grenz-Eigenverbrauch: Anteil der NÄCHSTEN … kWp, der selbst genutzt wird. */
export const GRENZ_SCHRITT = 20;
/** Fahrzeuge im Stepper. */
export const FLOTTE_MAX = 20;
/** Ladeleistung je Transporter (AC) und Ladebeginn (Stunde). */
export const LADEN = { kw: 11, abStunde: 10 };

/** Startwerte des Beispielbetriebs (Linz, Ost-West, Modell – Probelauf 12.10.2026, bei Bedarf aus den Daten). */
export const MODELLHALLE_KWP = 655; // K2: Halle 60 × 100 m, Ost-West aufgeständert ≈ 655 kWp

/** Kurven-Obergrenze wie pvAufbereiten() in ./_rechnen.js (dreifache Empfehlung, 600 … 3.000 kWp). */
export const kurveMaxFuer = (empfKwp) => Math.min(3000, Math.max(600, Math.round(empfKwp * 3)));

/** Regler-Schritt: 5 kWp, ab 500 kWp 10 kWp. */
export const reglerSchritt = (kwp, richtung = 1) => (richtung > 0 ? (kwp >= 500 ? 10 : 5) : kwp > 500 ? 10 : 5);

/** Wert auf das Raster des Reglers legen (unter 500: 5er, ab 500: 10er; min/max exakt erreichbar). */
export function aufRaster(v, min, max) {
  if (!Number.isFinite(v)) return min;
  if (v >= max) return max;
  if (v <= min) return min;
  const r = v >= 500 ? Math.round(v / 10) * 10 : Math.round(v / 5) * 5;
  return Math.min(max, Math.max(min, r));
}

const median = (arr) => {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

const TAGNAMEN = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
/** Wanduhr-UTC-ms → „Mi 18.6.“ */
export const tagKurz = (t) => {
  const d = new Date(t);
  return `${TAGNAMEN[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
};
export const monatName = (m) => MONATE[m] || "";

/** Feste Tage des synthetischen Beispiels (Konzept): Mi 18.6., Sa 21.6., Mi 6.8.2025 */
const BEISPIEL_TAGE = { juni: Date.UTC(2025, 5, 18), samstag: Date.UTC(2025, 5, 21), urlaub: Date.UTC(2025, 7, 6) };

/**
 * Einmal je Lastgang: Zuordnung Intervall → Tag/Slot, Tagesmittel, ruhende Tage (Sa/So/Feiertag oder
 * Werktage mit Betriebsruhe) und Auswahl der drei Tage für die Tagesbänder.
 *
 * Betriebsruhe an Werktagen: Tagesmittel unter max(1,3 × Grundlast; 50 % des Werktag-Medians). Die zweite
 * Schwelle braucht es, weil Instandhaltung im Betriebsurlaub das Tagesmittel über 1,3 × Grundlast hebt
 * (Beispiel: Grundlast 34 kW, Urlaubstage ≈ 46 kW, normale Werktage ≈ 130 kW).
 * @param {object} last Ergebnis von lastAufbereiten()
 */
export function vorbereiten(last) {
  const { tage, slots, typ } = last.raster;
  const werte = last.raster.last;
  const zeiten = last.reihe.zeiten;
  const n = zeiten.length;
  const slotMs = (1440 / slots) * 60000;
  const tagIdx = new Map();
  for (let d = 0; d < tage.length; d++) tagIdx.set(tage[d], d);
  const iTag = new Int32Array(n);
  const iSlot = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    const t = zeiten[i];
    const b = t - (((t % TAG) + TAG) % TAG);
    const d = tagIdx.get(b);
    iTag[i] = d == null ? -1 : d;
    iSlot[i] = Math.min(slots - 1, Math.max(0, Math.floor((t - b) / slotMs)));
  }
  const mittel = new Float64Array(tage.length);
  for (let d = 0; d < tage.length; d++) {
    let s = 0;
    let c = 0;
    for (let j = 0; j < slots; j++) {
      const v = werte[d * slots + j];
      if (Number.isFinite(v)) {
        s += v;
        c++;
      }
    }
    mittel[d] = c >= slots * 0.75 ? s / c : NaN;
  }
  const werktagMittel = [];
  for (let d = 0; d < tage.length; d++) if (typ[d] === 0 && Number.isFinite(mittel[d])) werktagMittel.push(mittel[d]);
  const werktagMedian = median(werktagMittel);
  const ruheGrenze = Math.max(1.3 * (last.grundlast || 0), 0.5 * (werktagMedian || 0));
  const ruht = new Uint8Array(tage.length);
  let arbeitstage = 0;
  let ruhendeWerktage = 0;
  for (let d = 0; d < tage.length; d++) {
    if (typ[d] > 0) ruht[d] = 1;
    else if (Number.isFinite(mittel[d]) && mittel[d] < ruheGrenze) {
      ruht[d] = 1;
      ruhendeWerktage++;
    } else arbeitstage++;
  }
  const auswahl = tageWaehlen(last, mittel, ruht, werktagMedian, tagIdx);
  return { iTag, iSlot, ruht, mittel, arbeitstage, ruhendeWerktage, werktagMedian, ruheGrenze, slots, auswahl, intervallH: last.intervall / 60, tageAnzahl: tage.length };
}

/** Drei Tage für die Bänder (Beispiel: feste Daten; eigene Daten: Regeln aus dem Konzept). */
function tageWaehlen(last, mittel, ruht, werktagMedian, tagIdx) {
  const { tage, typ } = last.raster;
  const monat = (d) => new Date(tage[d]).getUTCMonth();
  const gueltig = (d) => d != null && d >= 0 && Number.isFinite(mittel[d]);
  const out = [];

  if (last.quelle !== "eigen") {
    const j = tagIdx.get(BEISPIEL_TAGE.juni);
    const s = tagIdx.get(BEISPIEL_TAGE.samstag);
    const u = tagIdx.get(BEISPIEL_TAGE.urlaub);
    if (gueltig(j) && gueltig(s) && gueltig(u)) {
      return [
        { id: "juni", d: j, titel: "Werktag im Juni", datum: tagKurz(tage[j]) },
        { id: "samstag", d: s, titel: "Samstag im Juni", datum: tagKurz(tage[s]) },
        { id: "urlaub", d: u, titel: "Betriebsurlaub im August", datum: tagKurz(tage[u]) },
      ];
    }
  }

  // 1 · Werktag im Juni mit Median-Tagesverbrauch (sonst nächster Sommermonat mit Daten)
  const monatsFolge = [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 0, 11];
  let mWahl = -1;
  let werktag = -1;
  for (const m of monatsFolge) {
    const kand = [];
    for (let d = 0; d < tage.length; d++) if (monat(d) === m && typ[d] === 0 && !ruht[d] && gueltig(d)) kand.push(d);
    if (kand.length) {
      kand.sort((a, b) => mittel[a] - mittel[b]);
      werktag = kand[Math.floor(kand.length / 2)];
      mWahl = m;
      break;
    }
  }
  if (werktag >= 0) out.push({ id: "juni", d: werktag, titel: `Werktag im ${monatName(mWahl)}`, datum: tagKurz(tage[werktag]) });

  // 2 · erster Samstag im selben Monat (sonst erster Samstag im Sommerhalbjahr)
  let samstag = -1;
  for (const m of mWahl >= 0 ? [mWahl, ...monatsFolge] : monatsFolge) {
    for (let d = 0; d < tage.length; d++)
      if (monat(d) === m && typ[d] === 1 && gueltig(d)) {
        samstag = d;
        break;
      }
    if (samstag >= 0) break;
  }
  if (samstag >= 0) out.push({ id: "samstag", d: samstag, titel: `Samstag im ${monatName(monat(samstag))}`, datum: tagKurz(tage[samstag]) });

  // 3 · verbrauchsärmster Werktag Juli/August unter 50 % des Werktag-Medians, sonst ein Sonntag im August
  let ruhig = -1;
  for (let d = 0; d < tage.length; d++) {
    const m = monat(d);
    if ((m === 6 || m === 7) && typ[d] === 0 && gueltig(d) && mittel[d] < 0.5 * werktagMedian && (ruhig < 0 || mittel[d] < mittel[ruhig])) ruhig = d;
  }
  if (ruhig >= 0) out.push({ id: "urlaub", d: ruhig, titel: `Ruhiger Werktag im ${monatName(monat(ruhig))}`, datum: tagKurz(tage[ruhig]) });
  else {
    let sonntag = -1;
    for (const m of [7, 6, 5, 8]) {
      for (let d = 0; d < tage.length; d++)
        if (monat(d) === m && typ[d] === 2 && new Date(tage[d]).getUTCDay() === 0 && gueltig(d)) {
          sonntag = d;
          break;
        }
      if (sonntag >= 0) break;
    }
    if (sonntag >= 0) out.push({ id: "urlaub", d: sonntag, titel: `Sonntag im ${monatName(monat(sonntag))}`, datum: tagKurz(tage[sonntag]) });
  }
  return out;
}

/**
 * Arbeitstage im JAHR (für den Tagesbedarf der E-Flotte). Der Lastgang kann kürzer als ein Jahr sein
 * (der Parser lässt ab 7 Tagen zu): Die Arbeitstage im Lastgang werden auf 365 Tage hochgerechnet und
 * auf 200 … 300 begrenzt (sonst würde z. B. ein Monat mit Betriebsurlaub den Tagesbedarf vervielfachen).
 * Beispielbetrieb (365 Tage, 235 Arbeitstage): 235.
 */
export function jahresArbeitstage(vor) {
  const tage = Math.max(1, vor?.tageAnzahl || 365);
  const hoch = ((vor?.arbeitstage || 0) * 365) / tage;
  return Math.max(200, Math.min(300, Math.round(hoch) || 250));
}

/**
 * Ladeprofil EINES Arbeitstags für n Fahrzeuge (kW je Slot): n × 11 kW ab 10:00, bis der Tagesbedarf
 * gedeckt ist. bedarfTagKwh = Jahresbedarf je Fahrzeug ÷ jahresArbeitstage(vor).
 */
export function ladeprofil(anzahl, bedarfTagKwh, slots) {
  const prof = new Float64Array(slots);
  if (!(anzahl > 0) || !(bedarfTagKwh > 0)) return prof;
  const slotH = 24 / slots;
  let rest = anzahl * bedarfTagKwh;
  for (let s = Math.round(LADEN.abStunde / slotH); s < slots && rest > 1e-9; s++) {
    const kw = Math.min(anzahl * LADEN.kw, rest / slotH);
    prof[s] = kw;
    rest -= kw * slotH;
  }
  return prof;
}

/** Kopie der Viertelstunden-Energie (kWh) mit der Flotte an Arbeitstagen. */
export function kwhMitFlotte(kwh, vor, profil, typ) {
  const out = Float64Array.from(kwh);
  for (let i = 0; i < out.length; i++) {
    const d = vor.iTag[i];
    if (d >= 0 && typ[d] === 0 && !vor.ruht[d]) out[i] += profil[vor.iSlot[i]] * vor.intervallH;
  }
  return out;
}

/** Anteil des Überschusses, der an ruhenden Tagen (Sa/So/Feiertag, Betriebsruhe) entsteht. */
export function ueberschussRuhe(kwh, pv1, kwp, vor) {
  let u = 0;
  let ur = 0;
  for (let i = 0; i < kwh.length; i++) {
    const x = pv1[i] * kwp - kwh[i];
    if (x > 0) {
      u += x;
      const d = vor.iTag[i];
      if (d < 0 || vor.ruht[d]) ur += x;
    }
  }
  return u > 0 ? ur / u : 0;
}

/** Überschuss im Messzeitraum (kWh) und der Teil an ruhenden Tagen – ein Durchlauf (≈ 0,1 ms). */
export function ueberschussTeile(kwh, pv1, kwp, vor) {
  let u = 0;
  let ur = 0;
  for (let i = 0; i < kwh.length; i++) {
    const x = pv1[i] * kwp - kwh[i];
    if (x > 0) {
      u += x;
      const d = vor.iTag[i];
      if (d < 0 || vor.ruht[d]) ur += x;
    }
  }
  return { gesamt: u, ruhe: ur, anteil: u > 0 ? ur / u : 0 };
}

/** Montag der Juniwoche des Beispiels (dieselbe Woche wie der Wochen-Puls im Hero, mit Fronleichnam). */
export const BEISPIEL_WOCHE = Date.UTC(2025, 5, 16);

/**
 * Index des Montags einer Woche mit 7 lückenlosen Tagen: Beispiel = Mo 16.6.2025; eigene Daten = die Woche
 * des gewählten Werktags (Tagesband „Werktag im …“), sonst der erste vollständige Montag im Sommerhalbjahr,
 * sonst irgendeiner. -1, wenn der Lastgang keine 7 zusammenhängenden Tage hat.
 */
export function wocheWaehlen(last, vor) {
  const { tage } = last.raster;
  const voll = (d) => {
    if (d < 0 || d + 6 >= tage.length) return false;
    for (let k = 1; k < 7; k++) if (tage[d + k] - tage[d] !== k * TAG) return false;
    for (let k = 0; k < 7; k++) if (!Number.isFinite(vor.mittel[d + k])) return false;
    return true;
  };
  const montag = (d) => new Date(tage[d]).getUTCDay() === 1;
  if (last.quelle !== "eigen") {
    const d = tage.indexOf(BEISPIEL_WOCHE);
    if (voll(d)) return d;
  }
  const juni = vor.auswahl?.find((a) => a.id === "juni");
  if (juni) {
    const wt = (new Date(tage[juni.d]).getUTCDay() + 6) % 7; // Mo = 0
    const d = juni.d - wt;
    if (d >= 0 && tage[juni.d] - tage[d] === wt * TAG && voll(d)) return d;
  }
  const monat = (d) => new Date(tage[d]).getUTCMonth();
  for (const m of [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 0, 11]) {
    for (let d = 0; d < tage.length; d++) if (monat(d) === m && montag(d) && voll(d)) return d;
  }
  return -1;
}

/**
 * Daten der Woche ab Index d0: Last (kW, inkl. E-Flotte an Arbeitstagen) und PV (kW je kWp) je Slot,
 * dazu je Tag Typ und Ruhe. Für den Wochenstreifen; die Bühne skaliert P1 mit der Federwert-kWp.
 */
export function wocheDaten(last, pv, vor, d0, profil) {
  const { slots, typ, tage } = last.raster;
  const n = 7 * slots;
  const L = new Float32Array(n);
  const P1 = new Float32Array(n);
  const info = [];
  for (let k = 0; k < 7; k++) {
    const d = d0 + k;
    const laedt = typ[d] === 0 && !vor.ruht[d];
    info.push({ t: tage[d], typ: typ[d], ruht: !!vor.ruht[d] });
    for (let s = 0; s < slots; s++) {
      const j = d * slots + s;
      const basis = last.raster.last[j];
      L[k * slots + s] = (Number.isFinite(basis) ? basis : 0) + (laedt && profil ? profil[s] : 0);
      P1[k * slots + s] = Math.max(0, pv.raster[j] || 0);
    }
  }
  return { slots, tage: info, L, P1 };
}

/** Größter Wert der Woche für eine feste y-Skala (Last oder PV bei der größten wählbaren Anlage). */
export function wocheYMax(woche, kwpMax) {
  let m = 0;
  for (let i = 0; i < woche.L.length; i++) m = Math.max(m, woche.L[i], woche.P1[i] * kwpMax);
  return Math.max(50, Math.ceil((m * 1.06) / 50) * 50);
}

/** Alle Live-Werte für eine Anlagengröße (≈ 0,5 ms bei 35.040 Werten). */
export function werteFuer(kwh, pv1, kwp) {
  const s = simuliere(kwh, pv1, kwp);
  const s2 = simuliere(kwh, pv1, kwp + GRENZ_SCHRITT);
  const dE = s2.erzeugt - s.erzeugt;
  return {
    kwp,
    ev: s.evQuote,
    aut: s.autarkie,
    erzeugtMwh: s.erzeugt / 1000,
    eigenMwh: s.eigenverbrauch / 1000,
    ueberschussMwh: s.einspeisung / 1000,
    grenz: dE > 0 ? (s2.eigenverbrauch - s.eigenverbrauch) / dE : 1,
  };
}

/**
 * Daten eines Tagesbands: Last (inkl. Flotte), Flotte, PV bei kwp – je Slot in kW – und Tagessummen in kWh.
 * Fehlende Werte (NaN) zählen als 0 und werden nicht gezeichnet.
 */
export function bandDaten(last, pv, tagInfo, kwp, profil, vor) {
  const { slots, typ } = last.raster;
  const d = tagInfo.d;
  const laedt = typ[d] === 0 && !vor.ruht[d];
  const L = new Array(slots);
  const F = new Array(slots);
  const P = new Array(slots);
  const slotH = 24 / slots;
  let sLast = 0;
  let sEigen = 0;
  let sUebrig = 0;
  let sFlotte = 0;
  for (let s = 0; s < slots; s++) {
    const basis = last.raster.last[d * slots + s];
    const f = laedt ? profil[s] : 0;
    const l = (Number.isFinite(basis) ? basis : 0) + f;
    const p = Math.max(0, pv.raster[d * slots + s] * kwp);
    L[s] = l;
    F[s] = f;
    P[s] = p;
    sLast += l * slotH;
    sFlotte += f * slotH;
    sEigen += Math.min(p, l) * slotH;
    sUebrig += Math.max(0, p - l) * slotH;
  }
  return { ...tagInfo, L, F, P, laedt, summe: { last: sLast, eigen: sEigen, uebrig: sUebrig, flotte: sFlotte } };
}

/** Lineare Interpolation in der Kurve (für Punkt und Ablesung; Kurve beginnt bei 0 kWp mit EV 100 %). */
export function kurvenWert(punkte, kwp, feld) {
  if (!punkte?.length) return NaN;
  if (kwp <= punkte[0].kwp) return punkte[0][feld];
  for (let j = 1; j < punkte.length; j++) {
    const a = punkte[j - 1];
    const b = punkte[j];
    if (kwp <= b.kwp) {
      const t = (kwp - a.kwp) / (b.kwp - a.kwp || 1);
      return a[feld] + (b[feld] - a[feld]) * t;
    }
  }
  return punkte[punkte.length - 1][feld];
}

/**
 * Kurve für die Zeichnung: Punkt (0 kWp | EV 100 % | Autarkie 0 %) vorne, dazu der Grenz-Eigenverbrauch
 * (Anteil der nächsten kWh, der selbst genutzt wird) aus den Differenzen der Kurve.
 */
export function kurveFuerZeichnung(roh) {
  const p = [{ kwp: 0, ev: 1, aut: 0 }, ...roh.map((k) => ({ kwp: k.kwp, ev: k.evQuote, aut: k.autarkie }))];
  for (let j = 0; j < p.length; j++) {
    const a = p[Math.max(0, j - 1)];
    const b = p[Math.min(p.length - 1, j + 1)];
    const ea = a.ev * a.kwp;
    const eb = b.ev * b.kwp;
    p[j].grenz = b.kwp > a.kwp ? Math.max(0, Math.min(1, (eb - ea) / (b.kwp - a.kwp))) : 1;
  }
  p[0].grenz = 1;
  return p;
}

// ---------------------------------------------------------------------------------------------------
// Startzustand (SSR-Platzhalter und Bühne, bis der Worker fertig ist) – Server und Client rechnen
// mit DENSELBEN Funktionen, damit Platzhalter und Bühne beim Austausch identisch aussehen.
// ---------------------------------------------------------------------------------------------------

/** Kleinste Anlage im Regler. */
export const MIN_KWP = 50;

/**
 * Werte vor dem Worker: aus der Startkurve des Servers interpoliert (K3Server.js rechnet DIESELBE
 * 60-Punkte-Kurve wie der Worker). start.punkte = kurveFuerZeichnung(…) mit `ruhe` (Anteil des Überschusses
 * an ruhenden Tagen), start.ertragMwhJeKwp = Erzeugung je kWp (MWh).
 */
export function startWerte(start, kwp) {
  const p = start.punkte;
  const ev = kurvenWert(p, kwp, "ev");
  const aut = kurvenWert(p, kwp, "aut");
  const k2 = kwp + GRENZ_SCHRITT;
  const ev2 = kurvenWert(p, k2, "ev");
  const erzeugtMwh = kwp * start.ertragMwhJeKwp;
  const eigenMwh = ev * erzeugtMwh;
  return {
    kwp,
    ev,
    aut,
    erzeugtMwh,
    eigenMwh,
    ueberschussMwh: erzeugtMwh - eigenMwh,
    grenz: Math.max(0, Math.min(1, (ev2 * k2 - ev * kwp) / GRENZ_SCHRITT)),
    ruhe: Math.max(0, Math.min(1, kurvenWert(p, kwp, "ruhe") || 0)),
  };
}

/**
 * Startband (L in kW, P1 in kW je kWp) für eine Anlagengröße. Tage der Juniwoche verweisen mit `wocheTag`
 * auf den Wochenstreifen (die Werte stehen nur einmal in den Startdaten).
 */
export function bandAusStart(b, kwp, woche) {
  let L = b.L;
  let P1 = b.P1;
  if (!L && woche && b.wocheTag != null && b.wocheTag >= 0) {
    const s = woche.slots;
    L = Array.prototype.slice.call(woche.L, b.wocheTag * s, (b.wocheTag + 1) * s);
    P1 = Array.prototype.slice.call(woche.P1, b.wocheTag * s, (b.wocheTag + 1) * s);
  }
  if (!L) return { id: b.id, titel: b.titel, datum: b.datum, L: null, summe: null };
  const slots = L.length;
  const slotH = 24 / slots;
  const P = Array.from(P1, (v) => v * kwp);
  const F = new Array(slots).fill(0);
  let sLast = 0;
  let sEigen = 0;
  let sUebrig = 0;
  for (let s = 0; s < slots; s++) {
    sLast += L[s] * slotH;
    sEigen += Math.min(P[s], L[s]) * slotH;
    sUebrig += Math.max(0, P[s] - L[s]) * slotH;
  }
  return { id: b.id, titel: b.titel, datum: b.datum, L, F, P, laedt: false, summe: { last: sLast, eigen: sEigen, uebrig: sUebrig, flotte: 0 } };
}

/** Gemeinsame y-Skala der Tagesbänder: Maximum aus Last und PV, auf 100 kW aufgerundet. */
export function bandYMax(baender) {
  let m = 0;
  for (const b of baender) {
    if (!b.L) continue;
    for (let s = 0; s < b.L.length; s++) m = Math.max(m, b.L[s], b.P[s]);
  }
  return Math.max(100, Math.ceil((m * 1.04) / 100) * 100);
}

/** Sprungmarken unter der Kurve. */
export function sprungmarken(empfKwp, max, dachKwp, mitFlotte = false) {
  const liste = [
    { id: "empfehlung", label: mitFlotte ? "Empfehlung mit Flotte" : "Empfehlung", kwp: empfKwp },
    { id: "rechenbeispiel", label: "Rechenbeispiel", kwp: RECHENBEISPIEL_KWP },
  ];
  if (empfKwp * 2 <= max) liste.push({ id: "doppelt", label: "Doppelte Empfehlung", kwp: aufRaster(empfKwp * 2, MIN_KWP, max) });
  liste.push({ id: "dach", label: max >= dachKwp ? "Ganzes Dach" : "Kurvenende", kwp: max });
  return liste.filter((m) => m.kwp >= MIN_KWP && m.kwp <= max);
}
