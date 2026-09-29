// src/lib/rechner/peakshaving.js
//
// Peak-Shaving- & Gewerbespeicher-Rechner (Österreich) – reine Funktionen,
// ohne React/Next-Abhängigkeiten, per Node prüfbar.
//
// Rechtslage & Tarife (Stand September 2026):
//  - Netznutzungsentgelt 2026: SNE-V 2018 idF BGBl. II Nr. 305/2025 (Novelle 2026),
//    § 5 Abs. 1 Z 4–6 (Leistungspreis LP in Cent/kW und Jahr, Arbeitspreis AP in
//    Cent/kWh) und § 6 lit. b (Netzverlustentgelt je Netzebene). Gültig 1.1.–31.12.2026.
//    https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html
//  - Abrechnung bis Ende 2026: Mittelwert der 12 monatlichen Viertelstundenmaxima ×
//    Jahresleistungspreis. Leistungsmessung ab > 100.000 kWh/Jahr oder > 50 kW;
//    sonst auf NE 7 Pauschale 54 €/Jahr (siehe Ratgeber peak-shaving-leistungspreis).
//  - Ab 1.1.2027 laut ElWG (BGBl. I Nr. 91/2025) und SNE-G-V-Begutachtungsentwurf
//    (E-Control, 07/2026): Monatsmaximum × Monatsleistungspreis, Leistungspreis auch
//    auf NE 7 (zwei Preisstufen), Mindestbemessung 20 % der vereinbarten Leistung,
//    mind. 2 kW. Tarifwerte 2027 (SNE-T-V) stehen noch aus – hier NUR die Struktur.
//
// Auslegung des Speichers wie im Ratgeber „Peak Shaving und Leistungspreis“:
// Leistung ≥ größte Überschreitung der Schwelle; Kapazität = Energie über der
// Schwelle am ungünstigsten Tag × 1,25 Reserve ÷ 0,8 Restkapazität am Lebensende.
//
// Alle Lastgänge sind MODELLIERT (typische Tagesform je Schichtmodell, typische
// Spitzenform) – ein echter Lastgang (35.040 Viertelstundenwerte) ersetzt sie.

import { betriebsLast, betriebsTagesform, jahresreihen, TAGE_MONAT, MONATE } from "./profile.js";
import { ANNAHMEN as SOLAR, speicherPreisProKwh, strompreisGewerbe, eagZuschuss } from "../../data/solarrechner.js";
import { satzFuer } from "./annahmen.js";

export const PS_STAND = "September 2026";

// ---------------------------------------------------------------------------
// Netzentgelte 2026 je Netzbereich (SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025)
//   ne5/ne6/ne7 = [Leistungspreis €/kW und Jahr, Arbeitspreis ct/kWh] (gemessene Leistung)
//   ne7n        = Arbeitspreis ct/kWh NE 7 ohne Leistungsmessung (+ Pauschale 54 €/Jahr)
//   nv          = Netzverlustentgelt ct/kWh für Entnehmer [NE 5, NE 6, NE 7] (§ 6 lit. b)
// In der Verordnung stehen die Leistungspreise in Cent/kW – hier in Euro umgerechnet.
// ---------------------------------------------------------------------------
export const NETZBEREICHE = [
  { id: "burgenland", label: "Burgenland", betreiber: "Netz Burgenland", ne5: [100.56, 2.98], ne6: [87.96, 3.79], ne7: [76.56, 5.83], ne7n: 8.46, nv: [0, 0, 0] },
  { id: "kaernten", label: "Kärnten", betreiber: "KNG-Kärnten Netz", ne5: [75.12, 2.1], ne6: [75.48, 2.33], ne7: [112.32, 5.47], ne7n: 9.67, nv: [0.166, 0.307, 0.368] },
  { id: "klagenfurt", label: "Klagenfurt", betreiber: "Stadtgebiet Klagenfurt", ne5: [78.36, 1.98], ne6: [84.6, 3.14], ne7: [95.16, 4.36], ne7n: 6.9, nv: [0.284, 0.444, 0.578] },
  { id: "noe", label: "Niederösterreich", betreiber: "Netz NÖ", ne5: [72.48, 1.5], ne6: [74.28, 2.56], ne7: [56.04, 6.65], ne7n: 8.79, nv: [0.206, 0.349, 0.384] },
  { id: "ooe", label: "Oberösterreich", betreiber: "Netz Oberösterreich", ne5: [57.72, 1.29], ne6: [65.88, 2.37], ne7: [52.56, 4.68], ne7n: 6.29, nv: [0.197, 0.454, 0.528] },
  { id: "linz", label: "Linz", betreiber: "Linz Netz", ne5: [60.24, 1.45], ne6: [63.96, 2.74], ne7: [65.04, 3.26], ne7n: 5.57, nv: [0.126, 0.324, 0.487] },
  { id: "salzburg", label: "Salzburg", betreiber: "Salzburg Netz", ne5: [64.2, 1.68], ne6: [66.6, 2.86], ne7: [71.64, 3.91], ne7n: 6.59, nv: [0.198, 0.344, 0.357] },
  { id: "steiermark", label: "Steiermark", betreiber: "Energienetze Steiermark", ne5: [58.44, 1.89], ne6: [64.56, 2.77], ne7: [68.76, 6.78], ne7n: 8.82, nv: [0.118, 0.197, 0.336] },
  { id: "graz", label: "Graz", betreiber: "Energie Graz Netz", ne5: [39.96, 1.31], ne6: [38.64, 1.9], ne7: [46.92, 4.23], ne7n: 5.17, nv: [0.226, 0.31, 0.658] },
  { id: "tirol", label: "Tirol", betreiber: "TINETZ", ne5: [66.48, 1.73], ne6: [72.12, 2.95], ne7: [70.92, 3.66], ne7n: 6.81, nv: [0.159, 0.292, 0.293] },
  { id: "innsbruck", label: "Innsbruck", betreiber: "IKB", ne5: [43.44, 2.29], ne6: [54.24, 2.9], ne7: [84.12, 5.72], ne7n: 8.03, nv: [0.112, 0.218, 0.453] },
  { id: "vorarlberg", label: "Vorarlberg", betreiber: "Vorarlberger Energienetze", ne5: [37.32, 1.54], ne6: [58.44, 2.42], ne7: [63.84, 2.84], ne7n: 4.96, nv: [0.137, 0.222, 0.393] },
  { id: "wien", label: "Wien", betreiber: "Wiener Netze", ne5: [55.32, 1.31], ne6: [59.52, 1.93], ne7: [82.92, 4.21], ne7n: 6.98, nv: [0.175, 0.307, 0.7] },
];

export const NETZ_QUELLE = {
  name: "SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025 (RIS)",
  url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html",
};

export const netzbereich = (id) => NETZBEREICHE.find((b) => b.id === id) || NETZBEREICHE.find((b) => b.id === "ooe");

/** Leistungs- und Arbeitspreis einer Netzebene (5, 6, 7) im Netzbereich. */
export function netzpreise(bereichId, ne) {
  const b = netzbereich(bereichId);
  const [lp, ap] = b[`ne${ne}`] || b.ne6;
  const nv = b.nv[Math.min(2, Math.max(0, Number(ne) - 5))];
  return { lp, ap, nv, bereich: b };
}

// ---------------------------------------------------------------------------
// Annahmen (offengelegt, wie im Ratgeber)
// ---------------------------------------------------------------------------
export const PS_ANNAHMEN = {
  reserve: 1.25, // Zuschlag für Prognosefehler und Regelreserve
  sohEnde: 0.8, // nutzbare Restkapazität am Ende der Nutzungsdauer
  eta: 0.9, // Wirkungsgrad Laden + Entladen
  betriebAnteil: 0.015, // Wartung, Versicherung, Software je Jahr (Anteil Investition)
  lebensdauer: 15, // Jahre, wirtschaftliche Betrachtung (LFP)
  tageMitSpitze: 6, // Arbeitstage je Monat, an denen die Schwelle erreicht wird (Annahme)
  cRate: SOLAR.gewerbeSpeicherCRate ?? 0.5, // Lade-/Entladeleistung je kWh, wenn größer als Peak-Bedarf
  ertragProKwp: 1000, // kWh/kWp Hallen-/Flachdach (1.100 kWh/kWp Süd × 0,91 Flachdach, gerundet)
  messpflichtKwh: 100000, // Leistungsmessung ab > 100.000 kWh/Jahr …
  messpflichtKw: 50, // … oder > 50 kW
  pauschaleNe7: 54, // €/Jahr NE 7 ohne Leistungsmessung (2026)
  mindestAnteil2027: 0.2, // SNE-G-V-Entwurf: mind. 20 % der vereinbarten Leistung
};

// Typische Verteilung der Monatsspitzen (Faktor auf die Jahresspitze) – ANNAHMEN.
// „winter“ entspricht dem Beispielbetrieb des Ratgebers (500 kW Jahresspitze).
export const SPITZENFORMEN = [
  { id: "winter", label: "Winterbetont", kurz: "Winter", sub: "Heizung, Licht", f: [1, 0.99, 0.97, 0.95, 0.94, 0.95, 0.94, 0.88, 0.95, 0.96, 0.99, 1] },
  { id: "gleich", label: "Gleichmäßig", kurz: "Konstant", sub: "Produktion", f: [0.98, 0.99, 1, 0.98, 0.97, 0.98, 0.97, 0.92, 0.98, 0.99, 1, 0.99] },
  { id: "sommer", label: "Sommerspitze", kurz: "Sommer", sub: "Kälte, Klima", f: [0.86, 0.86, 0.88, 0.92, 0.96, 1, 1, 0.98, 0.94, 0.9, 0.87, 0.86] },
];

// Charakter der Spitze am Spitzentag – bestimmt die Energie über der Schwelle.
export const SPITZENARTEN = [
  { id: "anlauf", label: "Kurz", sub: "Anlaufspitzen", beschreibung: "15–30 Minuten, z. B. gleichzeitiger Maschinenstart zum Schichtbeginn" },
  { id: "mittel", label: "1–2 Stunden", sub: "Aufheizen", beschreibung: "Aufheizphasen, Chargen oder E-Flotte zum Schichtende" },
  { id: "plateau", label: "Plateau", sub: "3–4 Stunden", beschreibung: "Mittagsplateau durch Kälte, Klima oder Öfen" },
];

export const PS_PRESETS = [
  { id: "metall", label: "Metallverarbeitung", verbrauch: 1500000, spitze: 500, schichten: 2, bereich: "ooe", ne: 6, form: "winter", art: "mittel", kappung: 400, kwp: 400 },
  { id: "lebensmittel", label: "Lebensmittel & Kühlung", verbrauch: 900000, spitze: 260, schichten: 3, bereich: "salzburg", ne: 6, form: "sommer", art: "plateau", kappung: 230, kwp: 300 },
  { id: "tischlerei", label: "Tischlerei (NE 7)", verbrauch: 180000, spitze: 140, schichten: 1, bereich: "steiermark", ne: 7, form: "winter", art: "anlauf", kappung: 100, kwp: 100 },
  { id: "logistik", label: "Logistik mit E-Flotte", verbrauch: 600000, spitze: 320, schichten: 2, bereich: "noe", ne: 6, form: "gleich", art: "mittel", kappung: 240, kwp: 250 },
];

// ---------------------------------------------------------------------------
// Monatsspitzen
// ---------------------------------------------------------------------------
export function monatsspitzen(jahresspitze, formId = "winter") {
  const form = SPITZENFORMEN.find((s) => s.id === formId) || SPITZENFORMEN[0];
  return form.f.map((f) => Math.round(jahresspitze * f));
}

const mittel = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);

// ---------------------------------------------------------------------------
// Spitzentag in Viertelstunden (96 Werte, kW)
// ---------------------------------------------------------------------------
const QH = 96;

/** Glockenförmiger Buckel (raised cosine) bzw. Plateau mit weichen Flanken. */
function buckel(t, mitte, breite, flach = 0) {
  const d = Math.abs(t - mitte);
  const halbFlach = flach / 2;
  if (d <= halbFlach) return 1;
  const r = (d - halbFlach) / (breite / 2);
  return r >= 1 ? 0 : 0.5 * (1 + Math.cos(Math.PI * r));
}

/** Zeitpunkte der Spitzen je Schichtmodell und Spitzenart (Stunde als Dezimalzahl). */
function spitzenLage(schichten, art) {
  const beginn = schichten === 3 ? 6 : schichten === 2 ? 6 : 7;
  if (art === "anlauf") return [{ t: beginn + 0.25, b: 0.5, f: 0, a: 1 }, { t: 12.625, b: 0.5, f: 0, a: 0.6 }, ...(schichten >= 2 ? [{ t: 14.125, b: 0.5, f: 0, a: 0.7 }] : [])];
  if (art === "plateau") return [{ t: 12, b: 1.5, f: 3, a: 1 }];
  return [{ t: beginn + 1.75, b: 2.5, f: 0.5, a: 1 }, ...(schichten >= 2 ? [{ t: 15.5, b: 2, f: 0, a: 0.55 }] : [])];
}

/**
 * Lastkurve eines Spitzentags (96 Viertelstunden) mit Grundform aus dem
 * Schichtmodell (profile.js) und aufgesetzten Spitzen, skaliert auf `spitze`.
 * @param {object} p { spitze, plateau (kW mittlere Betriebslast im Maximum der Stunde), schichten, art }
 */
export function spitzentag({ spitze, plateau, schichten = 1, art = "mittel" }) {
  const form = betriebsTagesform({ typ: "gewerbe", schichten, arbeitstag: true });
  // Grundlast an der Obergrenze kappen, wenn die Werte unplausibel sind
  const p0 = Math.min(plateau, spitze * 0.96);
  const basis = Array.from({ length: QH }, (_, q) => {
    const h = (q + 0.5) / 4 - 0.5; // Stundenmitte-Interpolation
    const i = Math.floor(h);
    const t = h - i;
    const a = form[(i + 24) % 24];
    const b = form[(i + 25) % 24];
    return p0 * (a + (b - a) * t);
  });
  const lagen = spitzenLage(schichten, art);
  const form01 = lagen.map((l) => Array.from({ length: QH }, (_, q) => l.a * buckel((q + 0.5) / 4, l.t, l.b, l.f)));
  // Amplitude so wählen, dass das Maximum genau der Spitze entspricht
  let amp = Math.max(spitze - p0, 0);
  let kurve = basis;
  for (let k = 0; k < 4; k++) {
    kurve = basis.map((v, q) => v + amp * form01.reduce((s, f) => s + f[q], 0));
    const max = Math.max(...kurve);
    if (max <= 0) break;
    const qMax = kurve.indexOf(max);
    const ueberBasis = max - basis[qMax];
    if (ueberBasis <= 1e-9) break;
    amp *= (spitze - basis[qMax]) / ueberBasis;
  }
  return kurve.map((v) => Math.max(0, v));
}

/** Energie (kWh) und Leistung (kW) über einer Schwelle. */
export function ueberSchwelle(kurve, schwelle) {
  let e = 0;
  let p = 0;
  for (const v of kurve) {
    if (v > schwelle) {
      e += (v - schwelle) / 4;
      p = Math.max(p, v - schwelle);
    }
  }
  return { energie: e, leistung: p };
}

/**
 * Niedrigste erreichbare Spitze mit gegebener Speicher-Energie (für Peak Shaving
 * verfügbar) und -Leistung, nicht unter dem Ziel. Bisektion.
 */
export function erreichbareSpitze(kurve, ziel, energie, leistung) {
  const max = Math.max(...kurve);
  if (max <= ziel) return max;
  const geht = (s) => {
    const u = ueberSchwelle(kurve, s);
    return u.energie <= energie + 1e-9 && u.leistung <= leistung + 1e-9;
  };
  if (geht(ziel)) return ziel;
  let lo = ziel;
  let hi = max;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (geht(m)) hi = m;
    else lo = m;
  }
  return hi;
}

/** Speicherverlauf am Spitzentag: Entladen über der Schwelle, danach Nachladen darunter. */
export function mitSpeicher(kurve, schwelle, leistung, eta = PS_ANNAHMEN.eta) {
  let entnommen = 0; // kWh, die nachgeladen werden müssen (inkl. Verlust)
  const netz = [];
  const entladen = [];
  const laden = [];
  for (const v of kurve) {
    if (v > schwelle) {
      const d = Math.min(v - schwelle, leistung);
      entnommen += d / 4 / eta;
      netz.push(v - d);
      entladen.push(d);
      laden.push(0);
    } else {
      const raum = Math.min(schwelle - v, leistung, entnommen * 4);
      const l = entnommen > 0 ? Math.max(0, raum) : 0;
      entnommen = Math.max(0, entnommen - l / 4);
      netz.push(v + l);
      entladen.push(0);
      laden.push(l);
    }
  }
  return { netz, entladen, laden };
}

// ---------------------------------------------------------------------------
// Jahresreihen (Betriebslast) & PV-Eigenverbrauch
// ---------------------------------------------------------------------------

/** Betriebslast + PV-Reihe (8.760 h) – teuer, daher im Client memoisieren. */
export function psReihen({ verbrauch, schichten = 1, kwp = 0 }) {
  const betriebstage = schichten === 3 ? 7 : 5;
  const last = betriebsLast({ kwh: verbrauch, typ: "gewerbe", betriebstage, schichten });
  const pv = kwp > 0 ? jahresreihen({ kwp, ertragProKwp: PS_ANNAHMEN.ertragProKwp }).pv : new Float64Array(8760);
  // Stündliches Maximum der Betriebslast je Monat (für die Grundform des Spitzentags)
  const plateau = new Array(12).fill(0);
  let i = 0;
  for (let m = 0; m < 12; m++) {
    for (let h = 0; h < TAGE_MONAT[m] * 24; h++, i++) plateau[m] = Math.max(plateau[m], last[i]);
  }
  return { last, pv, plateau, betriebstage };
}

// Betriebe: zwei Teilzustände je Stunde ±15 % (wie profile.js TEIL_BETRIEB)
const TEILE = [
  { anteil: 0.5, faktor: 0.85 },
  { anteil: 0.5, faktor: 1.15 },
];

/**
 * Stündliche Simulation PV + Speicher mit monatlich reservierter Peak-Kapazität.
 * @param {object} reihen    psReihen()
 * @param {number[]} kapPv   je Monat für PV nutzbare Kapazität (kWh)
 * @param {number} leistung  kW
 */
export function pvSimulation(reihen, kapPv, leistung, eta = PS_ANNAHMEN.eta) {
  const { last, pv } = reihen;
  const e1 = Math.sqrt(eta);
  let soc = 0;
  let sPv = 0, sDirekt = 0, sLaden = 0, sEntladen = 0;
  let i = 0;
  for (let m = 0; m < 12; m++) {
    const kap = Math.max(0, kapPv[m] || 0);
    soc = Math.min(soc, kap);
    for (let h = 0; h < TAGE_MONAT[m] * 24; h++, i++) {
      const p = pv[i];
      sPv += p;
      if (p <= 0 && soc <= 0) continue;
      let u = 0, b = 0, d = 0;
      for (const t of TEILE) {
        const l = last[i] * t.faktor;
        if (p > l) { d += t.anteil * l; u += t.anteil * (p - l); } else { d += t.anteil * p; b += t.anteil * (l - p); }
      }
      sDirekt += d;
      if (kap > 0) {
        const lad = Math.min(u, leistung, (kap - soc) / e1);
        soc += lad * e1;
        const ent = Math.min(b, leistung, soc * e1);
        soc -= ent / e1;
        sLaden += lad;
        sEntladen += ent;
      }
    }
  }
  return { pv: sPv, direkt: sDirekt, laden: sLaden, entladen: sEntladen };
}

// ---------------------------------------------------------------------------
// Gesamtrechnung
// ---------------------------------------------------------------------------

/** Kaufmännisch runden auf „glatte“ Speichergrößen. */
export function glatt(kwh) {
  if (kwh <= 0) return 0;
  const r = kwh < 50 ? 5 : kwh < 200 ? 10 : kwh < 1000 ? 20 : 50;
  return Math.ceil(kwh / r) * r;
}
const glattKw = (kw) => (kw <= 0 ? 0 : Math.ceil(kw / (kw < 100 ? 5 : 10)) * (kw < 100 ? 5 : 10));

/**
 * @param {object} e Eingaben
 *   verbrauch kWh/Jahr, spitzen[12] kW, kappung kW, schichten, art, bereich, ne,
 *   lp (optional überschrieben, €/kW/Jahr), kwp, speicher (kWh nutzbar; null = Vorschlag)
 * @param {object} reihen psReihen() – optional, wird sonst berechnet
 */
export function peakShaving(e, reihen = null) {
  const A = PS_ANNAHMEN;
  const R = reihen || psReihen(e);
  const netz = netzpreise(e.bereich, e.ne);
  const lp = Number.isFinite(e.lp) && e.lp > 0 ? e.lp : netz.lp;
  const spitzen = e.spitzen.map((s) => Math.max(0, s));
  const jahresspitze = Math.max(...spitzen);
  const ziel = Math.min(Math.max(e.kappung, 0), jahresspitze);

  // Spitzentage je Monat
  const tage = spitzen.map((s, m) => spitzentag({ spitze: s, plateau: R.plateau[m], schichten: e.schichten, art: e.art }));
  const bedarf = tage.map((k) => ueberSchwelle(k, ziel));
  const leistungBedarf = Math.max(...bedarf.map((b) => b.leistung));
  const energieBedarf = Math.max(...bedarf.map((b) => b.energie));
  const kapBedarf = (energieBedarf * A.reserve) / A.sohEnde;
  const vorschlag = { kwh: glatt(kapBedarf), kw: glattKw(leistungBedarf) };

  const kap = e.speicher == null ? vorschlag.kwh : Math.max(0, e.speicher);
  const leistung = kap > 0 ? Math.max(vorschlag.kw, glattKw(kap * A.cRate)) : 0;
  const energiePeak = (kap * A.sohEnde) / A.reserve; // sicher für Peak Shaving verfügbar

  // Erreichte Monatsspitzen
  const gekappt = tage.map((k, m) => (kap > 0 ? Math.min(spitzen[m], erreichbareSpitze(k, ziel, energiePeak, leistung)) : spitzen[m]));
  const ohneMittel = mittel(spitzen);
  const mitMittel = mittel(gekappt);
  const senkung = ohneMittel - mitMittel;
  const ersparnisLp = senkung * lp;
  const zielErreicht = gekappt.every((g, m) => g <= ziel + 0.5 || spitzen[m] <= ziel);

  // Reservierte Kapazität je Monat, Rest für PV. Morgen- und Anlaufspitzen liegen vor
  // dem PV-Überschuss: Der Speicher lädt mittags Solarstrom, gibt ihn abends ab und
  // wird nachts für die nächste Spitze nachgeladen (Verluste in verlustPs) – die volle
  // Kapazität steht für PV bereit. Beim Mittagsplateau kollidieren beide Aufgaben.
  const reserveMonat = tage.map((k, m) =>
    e.art === "plateau" && spitzen[m] > gekappt[m] + 1e-6 ? Math.min(kap, (ueberSchwelle(k, gekappt[m]).energie * A.reserve) / A.sohEnde) : 0
  );
  const kapPv = reserveMonat.map((r) => Math.max(0, kap - r));

  // Wirtschaftliche Parameter
  const bezug = strompreisGewerbe(e.verbrauch); // €/kWh netto, vermeidbar
  const einspeisung = satzFuer(e.kwp || 0) / 100; // €/kWh
  const sim = e.kwp > 0 && kap > 0 ? pvSimulation(R, kapPv, leistung) : null;
  const ohneSpeicherEv = e.kwp > 0 ? pvSimulation(R, new Array(12).fill(0), 0) : null;
  const pvEntladen = sim ? sim.entladen : 0;
  const pvNutzen = sim ? sim.entladen * bezug - sim.laden * einspeisung : 0;

  const durchsatzPs = gekappt.reduce((s, g, m) => s + ueberSchwelle(tage[m], g).energie, 0) * A.tageMitSpitze;
  const verlustPs = durchsatzPs * (1 / A.eta - 1) * bezug;
  const preisKwh = kap > 0 ? speicherPreisProKwh(kap, "gewerbe") : 0;
  const invest = kap * preisKwh;
  const betrieb = invest * A.betriebAnteil;
  const netto = ersparnisLp - verlustPs - betrieb + pvNutzen;
  const amortisation = kap > 0 && netto > 0 ? invest / netto : null;
  const foerderung = e.kwp > 0 && kap > 0 ? eagZuschuss(e.kwp, kap).speicher : 0;
  const amortisationFoerderung = kap > 0 && netto > 0 && foerderung > 0 ? (invest - foerderung) / netto : null;

  // Leistungsmessung 2026
  const gemessen = !(Number(e.ne) === 7 && e.verbrauch <= A.messpflichtKwh && jahresspitze <= A.messpflichtKw);

  return {
    lp,
    netz,
    spitzen,
    gekappt,
    ziel,
    jahresspitze,
    ohneMittel,
    mitMittel,
    senkung,
    ersparnisLp,
    zielErreicht,
    bedarf: { leistung: leistungBedarf, energie: energieBedarf, kapazitaet: kapBedarf },
    vorschlag,
    speicher: { kwh: kap, kw: leistung, energiePeak, preisKwh },
    tage,
    reserveMonat,
    kapPv,
    pv: sim
      ? {
          erzeugung: sim.pv,
          eigenOhne: ohneSpeicherEv.direkt,
          eigenMit: sim.direkt + sim.laden,
          zusaetzlich: pvEntladen,
          nutzen: pvNutzen,
        }
      : ohneSpeicherEv
        ? { erzeugung: ohneSpeicherEv.pv, eigenOhne: ohneSpeicherEv.direkt, eigenMit: ohneSpeicherEv.direkt, zusaetzlich: 0, nutzen: 0 }
        : null,
    wirtschaft: { bezug, einspeisung, invest, betrieb, verlustPs, durchsatzPs, pvNutzen, netto, amortisation, foerderung, amortisationFoerderung, lohntSich: amortisation != null && amortisation <= A.lebensdauer },
    gemessen,
    // Struktur ab 2027: Monatsmaximum × Monatsleistungspreis (hier LP/12 als Platzhalter)
    ab2027: spitzen.map((s, m) => ({ monat: MONATE[m], ohne: (s * lp) / 12, mit: (gekappt[m] * lp) / 12 })),
  };
}

// ---------------------------------------------------------------------------
// Teilen-Link (nur Eingaben, keine Ergebnisse)
// ---------------------------------------------------------------------------
const zahl = (v, min, max, std) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : std;
};

export function psParams(e) {
  const q = new URLSearchParams({
    v: String(Math.round(e.verbrauch)),
    s: e.spitzen.map((x) => Math.round(x)).join("-"),
    k: String(Math.round(e.kappung)),
    sch: String(e.schichten),
    art: e.art,
    b: e.bereich,
    ne: String(e.ne),
    pv: String(Math.round(e.kwp)),
  });
  if (e.speicher != null) q.set("sp", String(Math.round(e.speicher)));
  if (Number.isFinite(e.lp) && e.lp > 0) q.set("lp", String(Math.round(e.lp * 100) / 100));
  return q.toString();
}

export function psAusParams(get) {
  if (!get("v") || !get("s")) return null;
  const spitzen = String(get("s")).split("-").map((x) => zahl(x, 5, 20000, NaN));
  if (spitzen.length !== 12 || spitzen.some((x) => !Number.isFinite(x))) return null;
  const art = SPITZENARTEN.some((a) => a.id === get("art")) ? get("art") : "mittel";
  const bereich = NETZBEREICHE.some((b) => b.id === get("b")) ? get("b") : "ooe";
  const lp = Number(get("lp"));
  return {
    verbrauch: zahl(get("v"), 20000, 20000000, 1500000),
    spitzen,
    kappung: zahl(get("k"), 1, 20000, Math.max(...spitzen)),
    schichten: zahl(get("sch"), 1, 3, 2),
    art,
    bereich,
    ne: [5, 6, 7].includes(Number(get("ne"))) ? Number(get("ne")) : 6,
    kwp: zahl(get("pv"), 0, 2000, 0),
    speicher: get("sp") != null ? zahl(get("sp"), 0, 5000, null) : null,
    lp: Number.isFinite(lp) && lp > 0 ? Math.min(lp, 300) : null,
  };
}
