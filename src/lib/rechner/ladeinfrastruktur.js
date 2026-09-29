// src/lib/rechner/ladeinfrastruktur.js
//
// Ladeinfrastruktur-Planer (Österreich, Unternehmen): Wie viele Ladepunkte
// (AC 11/22 kW, DC) braucht ein Standort, welche Spitzenlast entsteht ohne und
// mit dynamischem Lastmanagement, reicht der Netzanschluss – und was kostet das
// ungefähr? Simuliert wird ein typischer Betriebstag in 15-Minuten-Schritten
// (96 Werte) aus Gebäudelast, PV-Erzeugung, Ladebedarf und optional Speicher.
//
// Reine Funktionen ohne React/Next-Abhängigkeit (per Node testbar).
// Alle Werte sind Richtwerte zur Orientierung – keine Planung, kein Angebot und
// keine Ökovolt-Preise. Recherchestand: 29.09.2026.

import { ANNAHMEN as SOLAR, speicherPreisProKwh } from "../../data/solarrechner.js";
import { PV_MONAT, TAGE_MONAT, BETRIEB_GRUNDLAST } from "./profile.js";

export const LADE_STAND = "September 2026";
export const SCHRITTE = 96;
export const DT = 0.25; // h je Schritt

/** Standzeit-Fenster je Nutzergruppe (Uhrzeit, Fenster über Mitternacht erlaubt) */
export const STANDZEITEN = {
  flotte: [
    { id: "nacht", label: "Nacht", sub: "17–7 Uhr", fenster: [[17, 7]], ankunftH: 2 },
    { id: "spaet", label: "Kurze Nacht", sub: "20–5 Uhr", fenster: [[20, 5]], ankunftH: 1.5 },
  ],
  mitarbeitende: [
    { id: "tag", label: "Tagdienst", sub: "7:30–16:30", fenster: [[7.5, 16.5]], ankunftH: 1 },
    { id: "schicht", label: "2 Schichten", sub: "6–14 / 14–22", fenster: [[6, 14], [14, 22]], ankunftH: 0.5 },
    { id: "nachtschicht", label: "Nachtschicht", sub: "22–6 Uhr", fenster: [[22, 6]], ankunftH: 0.5 },
  ],
  kunden: [
    { id: "handel", label: "Handel", sub: "8–19 Uhr", fenster: [[8, 19]] },
    { id: "gastro", label: "Hotel & Gastro", sub: "10–22 Uhr", fenster: [[10, 22]] },
    { id: "rund", label: "Rund um die Uhr", sub: "0–24 Uhr", fenster: [[0, 24]] },
  ],
};

/**
 * Kundenladen: Nennleistung, mittlere Ladeleistung über den Ladevorgang
 * (Fahrzeug-Ladekurve, AC meist nur 11 kW fahrzeugseitig) und typische Energie je
 * Ladevorgang (Richtwerte).
 */
export const KUNDEN_LADEN = {
  ac22: { id: "ac22", label: "AC 22 kW", kw: 22, mittel: 11, kwh: 12 },
  dc50: { id: "dc50", label: "DC 50 kW", kw: 50, mittel: 40, kwh: 20 },
  dc150: { id: "dc150", label: "DC 150 kW", kw: 150, mittel: 90, kwh: 30 },
};

/** Gebäudelast-Profile (Betriebszeit mit An-/Abfahrrampe, sonst Grundlast) */
export const GEBAEUDE = {
  buero: { id: "buero", label: "Büro & Handel", sub: "7–18 Uhr", von: 7, bis: 18, grund: BETRIEB_GRUNDLAST },
  schicht2: { id: "schicht2", label: "Produktion", sub: "2 Schichten", von: 6, bis: 22, grund: BETRIEB_GRUNDLAST },
  dauer: { id: "dauer", label: "Durchgehend", sub: "24/7", von: 0, bis: 24, grund: 0.8 },
};

// Sonnenauf-/-untergang (lokal inkl. Sommerzeit, ca. 48° N) und mittlerer Tagesertrag
// je kWp aus den Monatsanteilen des Solarrechners (PV_MONAT × 1.100 kWh/kWp).
const tagesertrag = (m) => (PV_MONAT[m] * SOLAR.ertragProKwpSued) / TAGE_MONAT[m];
export const JAHRESZEITEN = {
  sommer: { id: "sommer", label: "Sommer", sub: "Juni", sonne: [5.3, 21.4], kwhProKwp: tagesertrag(5) },
  uebergang: { id: "uebergang", label: "Übergang", sub: "März/Sept.", sonne: [6.8, 18.9], kwhProKwp: (tagesertrag(2) + tagesertrag(8)) / 2 },
  winter: { id: "winter", label: "Winter", sub: "Dezember", sonne: [8.0, 16.4], kwhProKwp: tagesertrag(11) },
};

/**
 * Richtkosten NETTO (Spannen, inkl. Montage, ohne Tiefbau, Trafo und Netzzutritt).
 * ACHTUNG: Richtwerte aus der Marktbeobachtung 09/2026 zur Größenordnung – keine
 * Ökovolt-Preise, stark abhängig von Leitungswegen, Fundamenten und Hardware.
 * Netzbereitstellungsentgelt: Systemnutzungsentgelte-Verordnung (SNE-V) 2026,
 * Netzebene 7: 167,00 €/kW (Vorarlberg) bis 293,63 €/kW (Salzburg), z. B. Wien
 * 235,47 €/kW – fällig je kW zusätzlich vereinbarter Anschlussleistung; dazu
 * kommt das Netzzutrittsentgelt nach tatsächlichem Aufwand.
 */
export const KOSTEN = {
  ac: [1500, 3500], // € je AC-Ladepunkt 11/22 kW
  dc50: [20000, 40000],
  dc150: [50000, 90000],
  lastmanagement: [2000, 8000], // Energiemanager/Backend-Anbindung, einmalig
  speicherSpanne: 0.15, // ± 15 % um den Richtwert des Solarrechners
  nbe: [167, 293.63], // €/kW Netzbereitstellungsentgelt NE 7
};

/** Meldung beim Netzbetreiber: jede Ladeeinrichtung über 3,68 kVA (TOR/TAEV) */
export const MELDEGRENZE_KVA = 3.68;

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
const leer = () => new Array(SCHRITTE).fill(0);
const idx = (h) => ((Math.round(h / DT) % SCHRITTE) + SCHRITTE) % SCHRITTE;

/** Schritte eines Fensters [von, bis] (über Mitternacht) als Indexliste */
export function fensterSchritte([von, bis]) {
  const out = [];
  const dauer = (((bis - von) % 24) + 24) % 24 || 24;
  const n = Math.round(dauer / DT);
  const start = idx(von);
  for (let i = 0; i < n; i++) out.push((start + i) % SCHRITTE);
  return out;
}

/** Gebäudelast in kW (96 Werte) */
export function gebaeudeLast(spitzeKw, profilId = "buero") {
  const p = GEBAEUDE[profilId] || GEBAEUDE.buero;
  const r = leer();
  for (let i = 0; i < SCHRITTE; i++) {
    const h = i * DT + DT / 2;
    let f = p.grund;
    if (p.von === 0 && p.bis === 24) {
      // Durchgehend: leichter Tagesbuckel
      f = p.grund + (1 - p.grund) * Math.max(0, Math.sin(((h - 6) / 16) * Math.PI));
    } else if (h >= p.von - 1 && h < p.bis + 1) {
      const rampe = h < p.von ? h - (p.von - 1) : h >= p.bis ? p.bis + 1 - h : 1;
      // Mittagsdelle wie im Gewerbe-Lastprofil
      const mittag = h > 12 && h < 13 ? 0.9 : 1;
      f = p.grund + (1 - p.grund) * Math.min(1, Math.max(0, rampe)) * mittag;
    }
    r[i] = spitzeKw * f;
  }
  return r;
}

/** PV-Erzeugung in kW (96 Werte) für einen mittleren Tag der Jahreszeit */
export function pvLeistung(kwp, jahreszeit = "uebergang") {
  const j = JAHRESZEITEN[jahreszeit] || JAHRESZEITEN.uebergang;
  const r = leer();
  if (!(kwp > 0)) return r;
  const [auf, unter] = j.sonne;
  let summe = 0;
  for (let i = 0; i < SCHRITTE; i++) {
    const h = i * DT + DT / 2;
    if (h > auf && h < unter) {
      r[i] = Math.pow(Math.sin(((h - auf) / (unter - auf)) * Math.PI), 1.4);
      summe += r[i] * DT;
    }
  }
  const ziel = kwp * j.kwhProKwp;
  return r.map((v) => (summe > 0 ? (v / summe) * ziel : 0));
}

/**
 * Ungesteuertes Laden einer Gruppe: Fahrzeuge kommen gestaffelt in den ersten
 * `ankunftH` Stunden des Fensters an und laden mit voller Punktleistung, bis ihr
 * Tagesbedarf gedeckt ist (spätestens bis Fensterende).
 */
function ungesteuert(anzahl, kwhJeFz, kw, fenster, ankunftH) {
  const r = leer();
  if (!(anzahl > 0) || !(kwhJeFz > 0) || !(kw > 0)) return r;
  const schritte = fensterSchritte(fenster);
  const slots = Math.max(1, Math.round(ankunftH / DT));
  const jeSlot = anzahl / slots;
  const dauer = Math.ceil(kwhJeFz / kw / DT - 1e-9); // Schritte voller Leistung
  const rest = kwhJeFz - (dauer - 1) * kw * DT; // letzter Schritt anteilig
  for (let s = 0; s < slots; s++) {
    for (let k = 0; k < dauer; k++) {
      const pos = s + k;
      if (pos >= schritte.length) break;
      const p = k === dauer - 1 ? rest / DT : kw;
      r[schritte[pos]] += jeSlot * p;
    }
  }
  return r;
}

/**
 * Lastmanagement ("Valley Filling"): Energie E einer Gruppe innerhalb ihres
 * Fensters so verteilen, dass die Summe aus Grundlast und Laden möglichst flach
 * bleibt – PV-Überschuss und Lasttäler werden zuerst gefüllt.
 * Gibt die Ladeleistung je Schritt und eine eventuelle Unterdeckung (kWh) zurück.
 */
export function taelerFuellen(basis, schritte, energie, pMax) {
  const r = leer();
  if (!(energie > 0) || schritte.length === 0) return { last: r, fehlt: 0 };
  const menge = (L) => schritte.reduce((s, i) => s + Math.min(pMax, Math.max(0, L - basis[i])) * DT, 0);
  const maxMoeglich = schritte.length * pMax * DT;
  if (maxMoeglich <= energie) {
    for (const i of schritte) r[i] = pMax;
    return { last: r, fehlt: energie - maxMoeglich };
  }
  let lo = Math.min(...schritte.map((i) => basis[i]));
  let hi = Math.max(...schritte.map((i) => basis[i])) + pMax;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (menge(mid) < energie) lo = mid;
    else hi = mid;
  }
  for (const i of schritte) r[i] = Math.min(pMax, Math.max(0, hi - basis[i]));
  return { last: r, fehlt: 0 };
}

/**
 * Speicher zur Spitzenkappung: kleinste Netzgrenze T, die der Speicher über den
 * Tag halten kann (zwei Durchläufe, damit der Ladezustand zyklisch ist). Laden
 * aus PV-Überschuss oder aus dem Netz unterhalb von T.
 */
export function spitzeKappen(netz, kwh, kw) {
  if (!(kwh > 0) || !(kw > 0)) return { netz: netz.slice(), grenze: Math.max(...netz) };
  const pruefe = (T) => {
    let soc = kwh * 0.5;
    const out = leer();
    for (let runde = 0; runde < 2; runde++) {
      for (let i = 0; i < SCHRITTE; i++) {
        const l = netz[i];
        let p = 0; // + entladen, − laden
        if (l > T) {
          p = Math.min(l - T, kw, soc / DT);
          if (p < l - T - 1e-6) return null; // Grenze nicht haltbar
        } else {
          p = -Math.min(T - l, kw, (kwh - soc) / DT);
        }
        soc -= p * DT;
        if (runde === 1) out[i] = l - p;
      }
    }
    return out;
  };
  const spitze = Math.max(...netz);
  let lo = Math.max(0, netz.reduce((a, b) => a + b, 0) / SCHRITTE);
  let hi = spitze;
  let best = pruefe(hi) || netz.slice();
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    const r = pruefe(mid);
    if (r) {
      best = r;
      hi = mid;
    } else lo = mid;
  }
  return { netz: best, grenze: hi };
}

const max = (a) => a.reduce((m, v) => (v > m ? v : m), -Infinity);
const summe = (a) => a.reduce((s, v) => s + v, 0);
const addiere = (...reihen) => reihen[0].map((_, i) => reihen.reduce((s, r) => s + r[i], 0));

// ---------------------------------------------------------------------------
// Standard & Presets
// ---------------------------------------------------------------------------
export function ladeStandard() {
  return {
    preset: "gewerbe",
    flotte: { an: true, n: 10, km: 120, verbrauch: 22, standzeit: "nacht" },
    mitarbeitende: { an: true, n: 12, km: 50, verbrauch: 18, standzeit: "tag" },
    kunden: { an: false, vorgaenge: 20, laden: "dc50", oeffnung: "handel" },
    acKw: 11,
    anschlussKw: 150,
    gebaeudeKw: 90,
    gebaeude: "buero",
    kwp: 100,
    jahreszeit: "uebergang",
    speicherKwh: 0,
  };
}

export const LADE_PRESETS = [
  {
    id: "gewerbe",
    label: "Gewerbebetrieb",
    kurz: "10 Firmenfahrzeuge · 12 Mitarbeitende",
    werte: {},
  },
  {
    id: "handel",
    label: "Handel & Kundenparkplatz",
    kurz: "DC-Schnellladen für Kundschaft",
    werte: {
      flotte: { an: true, n: 3, km: 80, verbrauch: 20, standzeit: "nacht" },
      mitarbeitende: { an: true, n: 8, km: 40, verbrauch: 18, standzeit: "tag" },
      kunden: { an: true, vorgaenge: 40, laden: "dc50", oeffnung: "handel" },
      anschlussKw: 250,
      gebaeudeKw: 160,
      gebaeude: "buero",
      kwp: 200,
    },
  },
  {
    id: "logistik",
    label: "Logistik-Depot",
    kurz: "30 E-Transporter über Nacht",
    werte: {
      flotte: { an: true, n: 30, km: 160, verbrauch: 30, standzeit: "spaet" },
      mitarbeitende: { an: true, n: 10, km: 40, verbrauch: 18, standzeit: "schicht" },
      kunden: { an: false, vorgaenge: 0, laden: "dc50", oeffnung: "handel" },
      anschlussKw: 250,
      gebaeudeKw: 80,
      gebaeude: "schicht2",
      kwp: 300,
      speicherKwh: 200,
    },
  },
  {
    id: "hotel",
    label: "Hotel & Tourismus",
    kurz: "Gäste laden über Nacht",
    werte: {
      flotte: { an: true, n: 2, km: 60, verbrauch: 20, standzeit: "nacht" },
      mitarbeitende: { an: true, n: 6, km: 40, verbrauch: 18, standzeit: "schicht" },
      kunden: { an: true, vorgaenge: 25, laden: "ac22", oeffnung: "gastro" },
      anschlussKw: 200,
      gebaeudeKw: 140,
      gebaeude: "dauer",
      kwp: 80,
      acKw: 11,
    },
  },
  {
    id: "gemeinde",
    label: "Gemeinde & Bauhof",
    kurz: "Amt, Bauhof, öffentlich",
    werte: {
      flotte: { an: true, n: 8, km: 70, verbrauch: 24, standzeit: "nacht" },
      mitarbeitende: { an: true, n: 10, km: 30, verbrauch: 18, standzeit: "tag" },
      kunden: { an: true, vorgaenge: 12, laden: "ac22", oeffnung: "rund" },
      anschlussKw: 100,
      gebaeudeKw: 60,
      gebaeude: "buero",
      kwp: 60,
    },
  },
];

export function ladePresetEingaben(id) {
  const basis = ladeStandard();
  const p = LADE_PRESETS.find((x) => x.id === id) || LADE_PRESETS[0];
  const out = { ...basis, preset: p.id };
  for (const [k, v] of Object.entries(p.werte)) out[k] = typeof v === "object" ? { ...basis[k], ...v } : v;
  return out;
}

// ---------------------------------------------------------------------------
// Hauptberechnung
// ---------------------------------------------------------------------------
/**
 * @param {object} e Eingaben wie ladeStandard()
 * @returns Tageskurven (kW, 96 Werte), Ladepunkte, Spitzen, Anschluss-Bewertung, Kosten
 */
export function rechneLadeinfrastruktur(e) {
  const acKw = e.acKw === 22 ? 22 : 11;
  const gebaeude = gebaeudeLast(Math.max(0, e.gebaeudeKw || 0), e.gebaeude);
  const pv = pvLeistung(Math.max(0, e.kwp || 0), e.jahreszeit);
  const hinweise = [];

  // --- Gruppen ---
  const gruppen = [];
  const f = e.flotte || {};
  if (f.an && f.n > 0) {
    const st = STANDZEITEN.flotte.find((s) => s.id === f.standzeit) || STANDZEITEN.flotte[0];
    const kwhFz = (f.km * f.verbrauch) / 100;
    const fensterH = fensterSchritte(st.fenster[0]).length * DT;
    const noetigKw = kwhFz / Math.max(1, fensterH - st.ankunftH);
    const kw = noetigKw > acKw * 0.95 ? (noetigKw > 21 ? 50 : 22) : acKw;
    gruppen.push({
      id: "flotte",
      label: "Flotte",
      n: f.n,
      kwhTag: f.n * kwhFz,
      kwhFz,
      kw,
      punkte: f.n,
      art: kw === 50 ? "dc50" : kw === 22 ? "ac22" : `ac${acKw}`,
      fenster: st.fenster.map((fe) => ({ fenster: fe, anteil: 1, ankunftH: st.ankunftH })),
      flexibel: true,
      standzeit: st,
    });
    if (kw !== acKw) hinweise.push({ ton: "info", text: `Die Firmenfahrzeuge brauchen je Nacht rund ${Math.round(kwhFz)} kWh – mit ${acKw} kW reicht die Standzeit nicht, daher ${kw === 50 ? "DC 50 kW" : "AC 22 kW"} für die Flotte.` });
  }
  const m = e.mitarbeitende || {};
  if (m.an && m.n > 0) {
    const st = STANDZEITEN.mitarbeitende.find((s) => s.id === m.standzeit) || STANDZEITEN.mitarbeitende[0];
    const kwhFz = (m.km * m.verbrauch) / 100;
    const teile = st.fenster.length;
    gruppen.push({
      id: "mitarbeitende",
      label: "Mitarbeitende",
      n: m.n,
      kwhTag: m.n * kwhFz,
      kwhFz,
      kw: acKw,
      // Schichtbetrieb: Ladepunkte werden von beiden Schichten genutzt
      punkte: Math.ceil(m.n / teile),
      art: `ac${acKw}`,
      fenster: st.fenster.map((fe) => ({ fenster: fe, anteil: 1 / teile, ankunftH: st.ankunftH })),
      flexibel: true,
      standzeit: st,
    });
  }
  const k = e.kunden || {};
  let kundenLast = leer();
  if (k.an && k.vorgaenge > 0) {
    const art = KUNDEN_LADEN[k.laden] || KUNDEN_LADEN.dc50;
    const st = STANDZEITEN.kunden.find((s) => s.id === k.oeffnung) || STANDZEITEN.kunden[0];
    const schritte = fensterSchritte(st.fenster[0]);
    // Ankünfte über den Tag: Vormittags- und Nachmittagsspitze
    const w = schritte.map((_, j) => {
      const x = (j + 0.5) / schritte.length;
      return 0.6 + Math.exp(-((x - 0.3) ** 2) / 0.02) + 1.1 * Math.exp(-((x - 0.72) ** 2) / 0.02);
    });
    const ws = summe(w);
    const dauerH = art.kwh / art.mittel;
    const dauerS = Math.max(1, Math.ceil(dauerH / DT));
    let spitzeGleichzeitig = 0;
    const gleichzeitig = leer();
    schritte.forEach((i, j) => {
      const ankuenfte = (k.vorgaenge * w[j]) / ws;
      for (let d = 0; d < dauerS; d++) {
        const pos = schritte[(j + d) % schritte.length];
        gleichzeitig[pos] += ankuenfte * Math.min(1, dauerH / DT - d);
      }
    });
    for (let i = 0; i < SCHRITTE; i++) {
      kundenLast[i] = gleichzeitig[i] * art.mittel;
      spitzeGleichzeitig = Math.max(spitzeGleichzeitig, gleichzeitig[i]);
    }
    // Ladepunkte: Spitzen-Gleichzeitigkeit plus Zufallsreserve (Wartezeit gering halten)
    const punkte = Math.max(1, Math.ceil(spitzeGleichzeitig + 1.2 * Math.sqrt(spitzeGleichzeitig)));
    gruppen.push({
      id: "kunden",
      label: "Kundschaft",
      n: k.vorgaenge,
      kwhTag: k.vorgaenge * art.kwh,
      kwhFz: art.kwh,
      kw: art.kw,
      punkte,
      art: art.id,
      flexibel: false,
      standzeit: st,
      fenster: st.fenster.map((fe) => ({ fenster: fe, anteil: 1 })),
    });
  }

  // --- Ohne Lastmanagement ---
  const ladenOhne = { flotte: leer(), mitarbeitende: leer(), kunden: kundenLast };
  for (const g of gruppen) {
    if (!g.flexibel) continue;
    for (const fe of g.fenster) {
      const r = ungesteuert(g.n * fe.anteil, g.kwhFz, g.kw, fe.fenster, fe.ankunftH);
      ladenOhne[g.id] = addiere(ladenOhne[g.id], r);
    }
  }

  // --- Mit Lastmanagement (je Szenario: mit PV der Jahreszeit / trüber Tag ohne PV) ---
  const mitLm = (pvReihe) => {
    const laden = { flotte: leer(), mitarbeitende: leer(), kunden: kundenLast };
    let basis = gebaeude.map((g, i) => g - pvReihe[i] + kundenLast[i]);
    let fehlt = 0;
    // Tagsüber-Gruppen zuerst (nutzen PV), dann die Flotte über Nacht
    const reihenfolge = ["mitarbeitende", "flotte"];
    for (const id of reihenfolge) {
      const g = gruppen.find((x) => x.id === id);
      if (!g) continue;
      for (const fe of g.fenster) {
        const alle = fensterSchritte(fe.fenster);
        // erst nach der Ankunft steuerbar (halbe Ankunftsphase)
        const ab = Math.round((fe.ankunftH || 0) / 2 / DT);
        const schritte = alle.slice(ab);
        const pMax = g.punkte * g.kw; // alle Ladepunkte der Gruppe stehen im Fenster zur Verfügung
        const res = taelerFuellen(basis, schritte, g.n * fe.anteil * g.kwhFz, pMax);
        fehlt += res.fehlt;
        laden[id] = addiere(laden[id], res.last);
        basis = basis.map((b, i) => b + res.last[i]);
      }
    }
    return { laden, netz: basis, fehlt };
  };
  const lm = mitLm(pv);
  const lmTrueb = mitLm(leer());

  const ladenOhneSumme = addiere(ladenOhne.flotte, ladenOhne.mitarbeitende, ladenOhne.kunden);
  const netzOhne = gebaeude.map((g, i) => g - pv[i] + ladenOhneSumme[i]);
  const netzOhneTrueb = gebaeude.map((g, i) => g + ladenOhneSumme[i]);

  // --- Speicher ---
  const speicherKwh = Math.max(0, e.speicherKwh || 0);
  const speicherKw = speicherKwh * SOLAR.gewerbeSpeicherCRate;
  const sp = spitzeKappen(lm.netz, speicherKwh, speicherKw);
  const spTrueb = spitzeKappen(lmTrueb.netz, speicherKwh, speicherKw);

  // --- Ladepunkte ---
  const punkte = { ac11: 0, ac22: 0, dc50: 0, dc150: 0 };
  for (const g of gruppen) punkte[g.art] = (punkte[g.art] || 0) + g.punkte;
  const punkteGesamt = punkte.ac11 + punkte.ac22 + punkte.dc50 + punkte.dc150;
  const installiert = punkte.ac11 * 11 + punkte.ac22 * 22 + punkte.dc50 * 50 + punkte.dc150 * 150;

  // --- Spitzen (Netzbezug) ---
  const spitze = {
    gebaeude: max(gebaeude),
    ohne: max(netzOhneTrueb), // Auslegung: trüber Tag, alle kommen an
    ohneTag: max(netzOhne),
    lm: max(lmTrueb.netz),
    lmTag: max(lm.netz),
    speicher: speicherKwh > 0 ? max(spTrueb.netz) : null,
    speicherTag: speicherKwh > 0 ? max(sp.netz) : null,
  };
  const auslegung = spitze.speicher ?? spitze.lm;
  const anschluss = Math.max(1, e.anschlussKw || 0);
  const reserveFaktor = 0.9; // 10 % Reserve zur vereinbarten Leistung
  const erhoehungKw = Math.max(0, Math.ceil((auslegung - anschluss * reserveFaktor) / 5) * 5);
  const erhoehungOhneLmKw = Math.max(0, Math.ceil((spitze.ohne - anschluss * reserveFaktor) / 5) * 5);
  const status = auslegung > anschluss ? "erhoehen" : auslegung > anschluss * reserveFaktor ? "knapp" : "ok";

  // --- Energie ---
  const energieTag = summe(gruppen.map((g) => g.kwhTag));
  const ladenLm = addiere(lm.laden.flotte, lm.laden.mitarbeitende, lm.laden.kunden);
  // PV-Anteil am Laden (Szenario Jahreszeit, mit Lastmanagement): Solarstrom wird
  // je Viertelstunde anteilig auf Gebäude und Laden aufgeteilt.
  let pvInsAuto = 0;
  for (let i = 0; i < SCHRITTE; i++) {
    const last = gebaeude[i] + ladenLm[i];
    if (last > 0 && pv[i] > 0) pvInsAuto += ladenLm[i] * Math.min(1, pv[i] / last) * DT;
  }
  // Jahresenergie: Flotte/Mitarbeitende an 250 Betriebstagen, Kundschaft an 300 Tagen
  const jahrKwh = gruppen.reduce((s, g) => s + g.kwhTag * (g.id === "kunden" ? 300 : 250), 0);

  // --- Kosten (Richtwert-Spannen) ---
  const posten = [];
  const acPunkte = punkte.ac11 + punkte.ac22;
  if (acPunkte) posten.push({ id: "ac", label: `${acPunkte} AC-Ladepunkte`, min: acPunkte * KOSTEN.ac[0], max: acPunkte * KOSTEN.ac[1] });
  if (punkte.dc50) posten.push({ id: "dc50", label: `${punkte.dc50} × DC 50 kW`, min: punkte.dc50 * KOSTEN.dc50[0], max: punkte.dc50 * KOSTEN.dc50[1] });
  if (punkte.dc150) posten.push({ id: "dc150", label: `${punkte.dc150} × DC 150 kW`, min: punkte.dc150 * KOSTEN.dc150[0], max: punkte.dc150 * KOSTEN.dc150[1] });
  if (punkteGesamt > 1) posten.push({ id: "lm", label: "Lastmanagement & Backend", min: KOSTEN.lastmanagement[0], max: KOSTEN.lastmanagement[1] });
  if (speicherKwh > 0) {
    const p = speicherPreisProKwh(speicherKwh, "gewerbe") * speicherKwh;
    posten.push({ id: "speicher", label: `Speicher ${Math.round(speicherKwh)} kWh`, min: p * (1 - KOSTEN.speicherSpanne), max: p * (1 + KOSTEN.speicherSpanne) });
  }
  if (erhoehungKw > 0) posten.push({ id: "nbe", label: `Netzbereitstellung +${erhoehungKw} kW`, min: erhoehungKw * KOSTEN.nbe[0], max: erhoehungKw * KOSTEN.nbe[1] });
  const kosten = { posten, min: summe(posten.map((p) => p.min)), max: summe(posten.map((p) => p.max)) };
  // Was das Lastmanagement beim Netzanschluss vermeidet
  const vermiedenKw = Math.max(0, erhoehungOhneLmKw - erhoehungKw);
  const vermieden = { kw: vermiedenKw, min: vermiedenKw * KOSTEN.nbe[0], max: vermiedenKw * KOSTEN.nbe[1] };

  // --- Hinweise ---
  if (punkteGesamt > 0) {
    hinweise.push({
      ton: "pflicht",
      text: `Meldung beim Netzbetreiber: Jede Ladeeinrichtung über ${String(MELDEGRENZE_KVA).replace(".", ",")} kVA ist meldepflichtig (TOR/TAEV) – Ihre ${punkteGesamt} Ladepunkte also alle. Größere Leistungen prüft der Netzbetreiber vor der Errichtung.`,
    });
  }
  if (status === "erhoehen") hinweise.push({ ton: "warnung", text: `Auch mit Lastmanagement reicht der Anschluss an einem trüben Tag nicht: Anschlusserhöhung um rund ${erhoehungKw} kW beim Netzbetreiber anfragen${speicherKwh > 0 ? "" : " – oder einen Speicher zur Spitzenkappung prüfen"}.` });
  else if (status === "knapp") hinweise.push({ ton: "warnung", text: "Der Anschluss ist mit Lastmanagement knapp ausgelastet (unter 10 % Reserve). Für Wachstum früh mit dem Netzbetreiber sprechen." });
  if (auslegung > 400) hinweise.push({ ton: "info", text: "Bei mehreren hundert kW wird meist ein Anschluss an der Mittelspannung (Netzebene 6, eigene Trafostation) geprüft – das beeinflusst Kosten und Vorlaufzeit deutlich." });
  if (lmTrueb.fehlt > 1) hinweise.push({ ton: "warnung", text: `In der gewählten Standzeit können rund ${Math.round(lmTrueb.fehlt)} kWh nicht nachgeladen werden – höhere Ladeleistung oder längere Standzeit einplanen.` });
  if (punkteGesamt > 1) hinweise.push({ ton: "info", text: "Ladepunkte mit OCPP (1.6J oder 2.0.1) wählen: offen für jedes Backend, Voraussetzung für dynamisches Lastmanagement und herstellerunabhängigen Betrieb." });
  if (k.an && k.vorgaenge > 0) hinweise.push({ ton: "info", text: "Laden Dritte gegen Bezahlung nach kWh, müssen Zähler eichrechtskonform sein (Maß- und Eichgesetz, BEV). Öffentliche DC-Punkte ab 50 kW brauchen nach AFIR Kartenzahlung ad hoc." });

  return {
    acKw,
    gruppen,
    punkte,
    punkteGesamt,
    installiert,
    kurven: {
      gebaeude,
      pv,
      ohne: { laden: ladenOhneSumme, netz: netzOhne },
      lm: { laden: ladenLm, netz: lm.netz },
      speicher: speicherKwh > 0 ? { laden: ladenLm, netz: sp.netz } : null,
    },
    spitze,
    auslegung,
    anschluss,
    status,
    erhoehungKw,
    erhoehungOhneLmKw,
    vermieden,
    energieTag,
    jahrKwh,
    pvInsAuto,
    pvAnteil: energieTag > 0 ? Math.min(1, pvInsAuto / energieTag) : 0,
    speicherKw,
    kosten,
    hinweise,
    fehlt: lmTrueb.fehlt,
  };
}

// ---------------------------------------------------------------------------
// Teilen-Link
// ---------------------------------------------------------------------------
const eins = (v) => (Array.isArray(v) ? v[0] : v);
const zahl = (v, min, max, standard) => {
  const n = Number(eins(v));
  if (v == null || v === "" || !Number.isFinite(n)) return standard;
  return Math.min(max, Math.max(min, n));
};
const wahl = (v, liste, standard) => (liste.includes(eins(v)) ? eins(v) : standard);

export function ladeQuery(e) {
  const q = new URLSearchParams();
  q.set("z", e.preset || "individuell");
  q.set("fa", e.flotte.an ? "1" : "0");
  q.set("fn", String(e.flotte.n));
  q.set("fk", String(e.flotte.km));
  q.set("fv", String(e.flotte.verbrauch));
  q.set("fs", e.flotte.standzeit);
  q.set("ma", e.mitarbeitende.an ? "1" : "0");
  q.set("mn", String(e.mitarbeitende.n));
  q.set("mk", String(e.mitarbeitende.km));
  q.set("ms", e.mitarbeitende.standzeit);
  q.set("ka", e.kunden.an ? "1" : "0");
  q.set("kn", String(e.kunden.vorgaenge));
  q.set("kl", e.kunden.laden);
  q.set("ko", e.kunden.oeffnung);
  q.set("ac", String(e.acKw));
  q.set("an", String(e.anschlussKw));
  q.set("gl", String(e.gebaeudeKw));
  q.set("gp", e.gebaeude);
  q.set("pv", String(e.kwp));
  q.set("jz", e.jahreszeit);
  q.set("sp", String(e.speicherKwh));
  return q.toString();
}

export function ladeAusParams(p = {}) {
  const get = (k) => (typeof p.get === "function" ? p.get(k) : p[k]);
  if (get("fn") == null && get("mn") == null && get("an") == null) return null;
  const s = ladeStandard();
  const b = (k, std) => {
    const v = eins(get(k));
    return v == null ? std : v === "1";
  };
  const presetRoh = eins(get("z"));
  return {
    preset: LADE_PRESETS.some((x) => x.id === presetRoh) ? presetRoh : "individuell",
    flotte: {
      an: b("fa", s.flotte.an),
      n: Math.round(zahl(get("fn"), 0, 200, s.flotte.n)),
      km: zahl(get("fk"), 10, 500, s.flotte.km),
      verbrauch: zahl(get("fv"), 12, 150, s.flotte.verbrauch),
      standzeit: wahl(get("fs"), STANDZEITEN.flotte.map((x) => x.id), s.flotte.standzeit),
    },
    mitarbeitende: {
      an: b("ma", s.mitarbeitende.an),
      n: Math.round(zahl(get("mn"), 0, 300, s.mitarbeitende.n)),
      km: zahl(get("mk"), 5, 200, s.mitarbeitende.km),
      verbrauch: s.mitarbeitende.verbrauch,
      standzeit: wahl(get("ms"), STANDZEITEN.mitarbeitende.map((x) => x.id), s.mitarbeitende.standzeit),
    },
    kunden: {
      an: b("ka", s.kunden.an),
      vorgaenge: Math.round(zahl(get("kn"), 0, 300, s.kunden.vorgaenge)),
      laden: wahl(get("kl"), Object.keys(KUNDEN_LADEN), s.kunden.laden),
      oeffnung: wahl(get("ko"), STANDZEITEN.kunden.map((x) => x.id), s.kunden.oeffnung),
    },
    acKw: Number(eins(get("ac"))) === 22 ? 22 : 11,
    anschlussKw: zahl(get("an"), 10, 2000, s.anschlussKw),
    gebaeudeKw: zahl(get("gl"), 0, 2000, s.gebaeudeKw),
    gebaeude: wahl(get("gp"), Object.keys(GEBAEUDE), s.gebaeude),
    kwp: zahl(get("pv"), 0, 2000, s.kwp),
    jahreszeit: wahl(get("jz"), Object.keys(JAHRESZEITEN), s.jahreszeit),
    speicherKwh: zahl(get("sp"), 0, 2000, s.speicherKwh),
  };
}
