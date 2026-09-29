// src/lib/rechner/energiegemeinschaft.js
//
// Energiegemeinschafts-Rechner (Österreich) – reine Funktionen, per Node prüfbar.
//
// Rechtsrahmen (Stand September 2026):
//  - Netzentgeltreduktion für den aus der Gemeinschaft bezogenen Strom bis 31.12.2026
//    (SNE-V 2018, § 5 Abs. 1a): lokale EEG −57 % auf den Arbeitspreis des
//    Netznutzungsentgelts; regionale EEG −28 % (NE 6/7) bzw. −64 % (NE 4/5);
//    BEG keine Reduktion. Quelle: smartmeter-portal.at, Netzentgelte Energiegemeinschaft
//    2026; Koordinationsstelle für Energiegemeinschaften.
//  - Ab 1.1.2027: neue Systematik (SNE-G-V), Abschlag je genutzter Infrastruktur für alle
//    Formen im Nahebereich – Prozentsätze legt die Tarifverordnung fest (ausstehend).
//  - Elektrizitätsabgabe entfällt nur bei EEG (§ 2 Abs. 1 Z 4 ElAbgG); Sätze 2026:
//    Nicht-Haushalte 0,82 ct/kWh (§ 7 Abs. 16 ElAbgG), Haushalte 0,1 ct/kWh (ElAbgG § 4).
//  - Erneuerbaren-Förderbeitrag entfällt bei EEG ebenfalls, wird aber als prozentualer
//    Aufschlag verrechnet – ohne belegten Satz je kWh NICHT beziffert.
//  - Große Unternehmen: nur BEG und Peer-to-Peer (max. 6 MW), nicht EEG
//    (Koordinationsstelle, Detailwissen).
//  - Netzentgelte 2026 je Netzbereich/Netzebene: peakshaving.js (BGBl. II Nr. 305/2025).
//  - Erzeuger-Alternative: OeMAG-Marktpreis (src/data/einspeiseverguetung.js).
//
// Gleichzeitigkeit vereinfacht: Stundenwerte aus typischen Profilen (profile.js), statt
// der Viertelstundenwerte, die der Netzbetreiber tatsächlich zuordnet. Aufteilung
// dynamisch nach aktuellem Restbedarf (Standardfall).

import { betriebsLast, jahresreihen, TAGE_MONAT, MONATE } from "./profile.js";
import { netzbereich } from "./peakshaving.js";
import { VERGUETUNG, marktpreisMittel } from "../../data/einspeiseverguetung.js";

export const EG_ANNAHMEN = {
  ertragProKwp: 1050, // kWh/kWp – Mix aus Schräg- und Flachdächern (1.100 Süd, vorsichtig)
  reduktion: {
    lokal: { 5: null, 6: 0.57, 7: 0.57, "7n": 0.57 }, // NE 5 nicht Teil einer lokalen EEG
    regional: { 5: 0.64, 6: 0.28, 7: 0.28, "7n": 0.28 },
    beg: { 5: 0, 6: 0, 7: 0, "7n": 0 },
  },
  elAbgabeCt: { haushalt: 0.1, sonst: 0.82 },
  energiepreisCt: 14, // Energiepreis des Lieferanten netto – Rechenannahme (Ratgeber Energiegemeinschaft Gewerbe)
  haushaltKwh: 3500, // Verbrauch je Haushalt (E-Control-Referenzhaushalt Preismonitor)
};

export const MODELLE = [
  { id: "lokal", label: "EEG lokal", sub: "NE 6/7 · −57 %" },
  { id: "regional", label: "EEG regional", sub: "bis NE 4/5 · −28/−64 %" },
  { id: "beg", label: "BEG", sub: "keine Reduktion 2026" },
];

export const TYPEN = {
  gemeinde: { label: "Gemeinde", kurz: "Gemeinde" },
  betrieb: { label: "Betrieb", kurz: "Betrieb" },
  landwirtschaft: { label: "Landwirtschaft", kurz: "Hof" },
  haushalte: { label: "Haushalte", kurz: "Haushalte" },
};

export const NETZEBENEN_EG = [
  { id: "7n", label: "NE 7", sub: "ohne Lastprofil" },
  { id: "7", label: "NE 7", sub: "gemessen" },
  { id: "6", label: "NE 6", sub: "Trafo" },
  { id: "5", label: "NE 5", sub: "Mittelsp." },
];

/** Marktpreis-Referenz: Mittel der letzten 12 veröffentlichten OeMAG-Monatspreise (ct/kWh). */
export const MARKTPREIS_CT = Math.round(marktpreisMittel(12) * 100) / 100;
export const MARKTPREIS_AKTUELL = VERGUETUNG.marktpreis.aktuell;

export const EG_PRESETS = [
  {
    id: "gemeinde",
    label: "Gemeinde & Ortskern",
    modell: "lokal",
    bereich: "ooe",
    teilnehmer: [
      { typ: "gemeinde", name: "Gemeindeamt & Schule", verbrauch: 85000, kwp: 120, ne: "7" },
      { typ: "betrieb", name: "Bäckerei", verbrauch: 60000, kwp: 0, ne: "7", schichten: 2 },
      { typ: "haushalte", name: "Haushalte im Ort", anzahl: 40, verbrauch: 3500, kwp: 60, ne: "7n" },
    ],
  },
  {
    id: "gewerbepark",
    label: "Gewerbepark",
    modell: "lokal",
    bereich: "steiermark",
    teilnehmer: [
      { typ: "betrieb", name: "Logistikhalle", verbrauch: 120000, kwp: 400, ne: "6", schichten: 1 },
      { typ: "betrieb", name: "Kühlhaus", verbrauch: 450000, kwp: 0, ne: "6", schichten: 3 },
      { typ: "betrieb", name: "Kfz-Werkstatt", verbrauch: 70000, kwp: 30, ne: "7", schichten: 1 },
    ],
  },
  {
    id: "hof",
    label: "Hof & Dorf",
    modell: "regional",
    bereich: "noe",
    teilnehmer: [
      { typ: "landwirtschaft", name: "Milchviehbetrieb", verbrauch: 60000, kwp: 150, ne: "7" },
      { typ: "gemeinde", name: "Kläranlage", verbrauch: 180000, kwp: 0, ne: "5" },
      { typ: "haushalte", name: "Haushalte", anzahl: 25, verbrauch: 3500, kwp: 0, ne: "7n" },
    ],
  },
];

// Profil je kWp einmal berechnen (gleiche Wetterreihe für alle Anlagen)
let PV1 = null;
const pvJeKwp = () => (PV1 ||= jahresreihen({ kwp: 1, ertragProKwp: EG_ANNAHMEN.ertragProKwp }).pv);

/** Jahresverbrauch eines Teilnehmers (Haushalte: Anzahl × kWh). */
export const verbrauchVon = (t) => (t.typ === "haushalte" ? (t.anzahl || 0) * (t.verbrauch || 0) : t.verbrauch || 0);

/** Stündliche Last (8.760) eines Teilnehmers nach Typ. */
export function lastprofil(t) {
  const kwh = verbrauchVon(t);
  if (!(kwh > 0)) return new Float64Array(8760);
  if (t.typ === "haushalte") return jahresreihen({ kwp: 0, haushaltKwh: kwh }).haushalt;
  if (t.typ === "landwirtschaft") return betriebsLast({ kwh, typ: "landwirtschaft" });
  if (t.typ === "gemeinde") return betriebsLast({ kwh, typ: "gewerbe", betriebstage: 5, schichten: 1 });
  const sch = t.schichten || 1;
  return betriebsLast({ kwh, typ: "gewerbe", betriebstage: sch === 3 ? 7 : 5, schichten: sch });
}

/** Darf der Teilnehmer im gewählten Modell mitmachen? */
export function teilnahme(t, modell) {
  if (t.gross && modell !== "beg") return { ok: false, grund: "Große Unternehmen dürfen nur an Bürgerenergiegemeinschaften (BEG) teilnehmen." };
  if (modell === "lokal" && t.ne === "5") return { ok: false, grund: "Netzebene 5 ist nur in regionalen EEG möglich (lokal: NE 6 und 7)." };
  return { ok: true };
}

/** Arbeitspreis Netznutzung (ct/kWh) eines Teilnehmers im Netzbereich. */
export function arbeitspreisCt(bereichId, ne) {
  const b = netzbereich(bereichId);
  if (ne === "7n") return b.ne7n;
  return (b[`ne${ne}`] || b.ne7)[1];
}

/**
 * Energiebilanz der Gemeinschaft (Stundenwerte).
 * @param {object[]} teilnehmer
 * @param {string} modell lokal|regional|beg
 * @param {Float64Array[]} [lasten] optional vorberechnete Lastprofile (gleiche Reihenfolge)
 */
export function egBilanz(teilnehmer, modell, lasten = null) {
  const pv1 = pvJeKwp();
  const n = teilnehmer.length;
  const L = lasten || teilnehmer.map(lastprofil);
  const aktiv = teilnehmer.map((t) => teilnahme(t, modell).ok);
  const res = teilnehmer.map(() => ({ verbrauch: 0, erzeugung: 0, eigen: 0, ueberschuss: 0, restbedarf: 0, geliefert: 0, bezogen: 0 }));
  const monat = MONATE.map((name) => ({ name, ueberschuss: 0, bedarf: 0, geteilt: 0 }));
  const u = new Float64Array(n);
  const r = new Float64Array(n);
  let i = 0;
  for (let m = 0; m < 12; m++) {
    const mo = monat[m];
    for (let h = 0; h < TAGE_MONAT[m] * 24; h++, i++) {
      let U = 0;
      let Rb = 0;
      for (let k = 0; k < n; k++) {
        const t = teilnehmer[k];
        const l = L[k][i];
        const p = (t.kwp || 0) * pv1[i];
        const ev = Math.min(l, p);
        u[k] = p - ev;
        r[k] = l - ev;
        const x = res[k];
        x.verbrauch += l;
        x.erzeugung += p;
        x.eigen += ev;
        x.ueberschuss += u[k];
        x.restbedarf += r[k];
        if (aktiv[k]) {
          U += u[k];
          Rb += r[k];
        }
      }
      const G = Math.min(U, Rb);
      mo.ueberschuss += U;
      mo.bedarf += Rb;
      mo.geteilt += G;
      if (G > 0) {
        for (let k = 0; k < n; k++) {
          if (!aktiv[k]) continue;
          if (u[k] > 0) res[k].geliefert += (G * u[k]) / U;
          if (r[k] > 0) res[k].bezogen += (G * r[k]) / Rb;
        }
      }
    }
  }
  const summe = (key) => res.reduce((s, x, k) => s + (aktiv[k] ? x[key] : 0), 0);
  const geteilt = summe("geliefert");
  const ueberschuss = summe("ueberschuss");
  const restbedarf = summe("restbedarf");
  return {
    teilnehmer: res,
    aktiv,
    monat,
    geteilt,
    ueberschuss,
    restbedarf,
    quoteUeberschuss: ueberschuss > 0 ? geteilt / ueberschuss : 0,
    deckung: restbedarf > 0 ? geteilt / restbedarf : 0,
    erzeugung: res.reduce((s, x) => s + x.erzeugung, 0),
    verbrauch: res.reduce((s, x) => s + x.verbrauch, 0),
  };
}

/**
 * Wirtschaftlichkeit (netto, €/Jahr) auf Basis der Bilanz.
 * @param {object} p { teilnehmer, modell, bereich, energiepreisCt, marktpreisCt, egPreisCt }
 */
export function egWirtschaft(bilanz, { teilnehmer, modell, bereich, energiepreisCt, marktpreisCt, egPreisCt }) {
  const eeg = modell !== "beg";
  const zeilen = teilnehmer.map((t, k) => {
    const x = bilanz.teilnehmer[k];
    const ok = bilanz.aktiv[k];
    const red = EG_ANNAHMEN.reduktion[modell][t.ne] ?? 0;
    const ap = arbeitspreisCt(bereich, t.ne);
    const netzCt = ok ? ap * red : 0;
    const abgabeCt = ok && eeg ? (t.typ === "haushalte" ? EG_ANNAHMEN.elAbgabeCt.haushalt : EG_ANNAHMEN.elAbgabeCt.sonst) : 0;
    const energie = (x.bezogen * (energiepreisCt - egPreisCt)) / 100;
    const netz = (x.bezogen * netzCt) / 100;
    const abgabe = (x.bezogen * abgabeCt) / 100;
    const mehrerloes = (x.geliefert * (egPreisCt - marktpreisCt)) / 100;
    return { ...x, ok, grund: teilnahme(t, modell).grund, ap, reduktion: red, netzCt, abgabeCt, energie, netz, abgabe, mehrerloes, vorteil: energie + netz + abgabe + mehrerloes };
  });
  const sum = (key) => zeilen.reduce((s, z) => s + z[key], 0);
  const verbraucher = sum("energie") + sum("netz") + sum("abgabe");
  const erzeuger = sum("mehrerloes");
  return {
    zeilen,
    energie: sum("energie"),
    netz: sum("netz"),
    abgabe: sum("abgabe"),
    mehrerloes: erzeuger,
    verbraucher,
    erzeuger,
    gesamt: verbraucher + erzeuger,
    erloesEg: (bilanz.geteilt * egPreisCt) / 100,
    erloesOemag: (bilanz.geteilt * marktpreisCt) / 100,
    winwinCt: (energiepreisCt + marktpreisCt) / 2,
  };
}

// ---------------------------------------------------------------------------
// Teilen-Link
// ---------------------------------------------------------------------------
const TYP_KURZ = { gemeinde: "g", betrieb: "b", landwirtschaft: "l", haushalte: "h" };
const KURZ_TYP = Object.fromEntries(Object.entries(TYP_KURZ).map(([k, v]) => [v, k]));

export function egParams({ teilnehmer, modell, bereich, energiepreisCt, egPreisCt }) {
  const t = teilnehmer
    .map((x) => [TYP_KURZ[x.typ], Math.round(x.verbrauch), Math.round(x.kwp || 0), x.ne, x.anzahl || 0, x.schichten || 1, x.gross ? 1 : 0].join("."))
    .join("_");
  return new URLSearchParams({ m: modell, b: bereich, e: String(energiepreisCt), p: String(egPreisCt), t }).toString();
}

export function egAusParams(get) {
  const roh = get("t");
  if (!roh) return null;
  const teilnehmer = String(roh)
    .split("_")
    .slice(0, 8)
    .map((s) => {
      const [ty, v, k, ne, a, sch, g] = s.split(".");
      const typ = KURZ_TYP[ty];
      if (!typ) return null;
      const zahl = (x, min, max) => Math.min(max, Math.max(min, Number(x) || 0));
      return {
        typ,
        name: TYPEN[typ].label,
        verbrauch: zahl(v, 0, 10000000),
        kwp: zahl(k, 0, 5000),
        ne: ["5", "6", "7", "7n"].includes(ne) ? ne : typ === "haushalte" ? "7n" : "7",
        anzahl: typ === "haushalte" ? zahl(a, 1, 500) : undefined,
        schichten: zahl(sch, 1, 3) || 1,
        gross: g === "1",
      };
    })
    .filter(Boolean);
  if (!teilnehmer.length) return null;
  const modell = MODELLE.some((m) => m.id === get("m")) ? get("m") : "lokal";
  const e = Number(get("e"));
  const p = Number(get("p"));
  return {
    teilnehmer,
    modell,
    bereich: get("b") || "ooe",
    energiepreisCt: Number.isFinite(e) && e > 0 ? Math.min(e, 40) : EG_ANNAHMEN.energiepreisCt,
    egPreisCt: Number.isFinite(p) && p > 0 ? Math.min(p, 40) : null,
  };
}
