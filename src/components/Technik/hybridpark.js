// src/components/Technik/hybridpark.js
//
// Rechenkern des Hybridpark-Konfigurators (Welle C, Paket C03): PV-Park und Batteriespeicher
// (BESS, AC-gekoppelt) an einem gemeinsamen Netzanschluss mit begrenzter netzwirksamer Leistung.
// Reine Funktionen ohne React/Next und ohne Alias-Importe, damit scripts/hybridpark.test.mjs sie
// direkt mit Node prüfen kann.
//
// Modell (Richtwert/Orientierung, keine Ertrags- oder Erlöszusage):
// - PV-Erzeugung: Stundenreihe aus src/lib/rechner/profile.js (jahresreihen, 8.760 h, deterministisches
//   Wetter, Monatsverteilung Alpenvorland). Wechselhafte Stunden werden – wie in profile.js – in zwei
//   Halbstunden mit Faktor 1,55 / 0,45 geteilt, damit Wolkenzüge Spitzen über die Anschlussgrenze erzeugen.
// - DC/AC: DC-Leistung = kWp × Stundenwert, höchstens 1 kW je kWp; über der PV-Wechselrichterleistung
//   (PV-AC) wird abgeschnitten (Clipping, getrennt ausgewiesen).
// - Netzanschluss: Was über der netzwirksamen Leistung liegt, wird ohne Speicher abgeregelt. Mit Speicher
//   lädt der BESS diesen Überschuss (begrenzt durch Leistung und freie Kapazität).
// - Entladen ins Netz nur, solange PV + Entladung die netzwirksame Leistung nicht übersteigen – ab 16 Uhr
//   und erst nach der letzten Abregelung des Tages (Tagesprognose als bekannt angenommen).
// - Speicherbezug (optional): Netzladung 0–6 Uhr mit höchstens der vereinbarten Bezugsleistung, nur so weit,
//   dass für die am Tag erwartete Abregelung Platz bleibt (vereinfachter Fahrplan, keine Preisoptimierung).
// - Ohne Eigenverbrauch am Standort, ohne Regelreserve, ohne Alterung, ohne Standby-Verluste.

import { jahresreihen, MONATE, TAGE_MONAT } from "../../lib/rechner/profile.js";
import { TYPEN, torTyp as torTypGemeinsam } from "./torTypen.js";

export const STAND = "2026-10-12";

/** Offen gelegte Annahmen – erscheinen am Bildschirm und im Export. */
export const ANNAHMEN = {
  ertragProKwp: 1050, // kWh/kWp und Jahr, Freifläche Alpenvorland – Richtwert (PVGIS-Größenordnung), Standort prüfen
  wirkungsgrad: 0.94, // je Richtung, Round-Trip ≈ 88 %
  nutzbarAnteil: 0.92, // nutzbarer Anteil der Nennkapazität
  netzladungVon: 0,
  netzladungBis: 6, // Netzladung 0–6 Uhr
  entladenAb: 16, // Entladen frühestens ab 16 Uhr
};

const ETA_RT = () => ANNAHMEN.wirkungsgrad * ANNAHMEN.wirkungsgrad;

// Halbstunden-Aufteilung wechselhafter Stunden (wie PV_TEIL_WECHSELHAFT in profile.js)
const TEIL_WECHSELHAFT = [1.55, 0.45];

/** Standardwerte der Eingabe (Beispiel: 5 MW PV-AC, 2 MW / 4 MWh BESS, 3 MW netzwirksam). */
export const STANDARD = { pvAcKw: 5000, dcAc: 1.2, bessKw: 2000, bessKwh: 4000, netzKw: 3000, bezugKw: 0 };

/** Grenzen der Eingabefelder (auch für die Plausibilisierung). */
export const GRENZEN = {
  pvAcKw: [100, 100000],
  dcAc: [1, 1.6],
  bessKw: [0, 100000],
  bessKwh: [0, 400000],
  netzKw: [50, 100000],
  bezugKw: [0, 100000],
};

const begrenze = (wert, [min, max]) => Math.min(max, Math.max(min, Number.isFinite(Number(wert)) ? Number(wert) : min));

/** Eingaben auf gültige Werte bringen. */
export function bereinige(e = {}) {
  const r = { ...STANDARD, ...e };
  return {
    pvAcKw: begrenze(r.pvAcKw, GRENZEN.pvAcKw),
    dcAc: begrenze(r.dcAc, GRENZEN.dcAc),
    bessKw: begrenze(r.bessKw, GRENZEN.bessKw),
    bessKwh: begrenze(r.bessKwh, GRENZEN.bessKwh),
    netzKw: begrenze(r.netzKw, GRENZEN.netzKw),
    bezugKw: begrenze(r.bezugKw, GRENZEN.bezugKw),
  };
}

/**
 * TOR-Typ nach Maximalkapazität (RfG-Schwellenwert-V; Netzanschluss < 110 kV angenommen).
 * @param {number} kw Summe der Maximalkapazitäten in kW
 * @returns {"A"|"B"|"C"|"D"|null}
 */
export function torTyp(kw) {
  // Eine Quelle für die Schwellen: torTypen.js (A10) – hier nur der Buchstabe bzw. null
  if (!(kw >= 0)) return null;
  const { typ } = torTypGemeinsam(kw);
  return typ === "–" ? null : typ;
}

/**
 * TOR-Einordnung für die Gesamtanordnung. Summenregel: Maßgeblich ist in der Regel die Maximalkapazität
 * der Gesamtanordnung aus Erzeugung und Speicher am Netzanschlusspunkt – hier PV-AC + BESS-Leistung.
 * Ob eine dauerhafte Begrenzung auf die netzwirksame Leistung (Parkregler) die Einstufung senkt,
 * entscheidet der Netzbetreiber – deshalb wird dieser Fall nur als „zu prüfen“ ausgewiesen.
 */
export function torEinordnung({ pvAcKw, bessKw, netzKw }) {
  const summeKw = pvAcKw + bessKw;
  const typ = torTyp(summeKw);
  const typBegrenzt = torTyp(Math.min(summeKw, netzKw));
  return {
    summeKw,
    typ,
    regelwerk: typ ? TYPEN[typ].regelwerk : null,
    grenze: typ ? TYPEN[typ].grenze : null,
    anforderungen: typ ? TYPEN[typ].anforderungen : [],
    typBegrenzt,
    abweichung: typBegrenzt !== typ,
  };
}

/**
 * Jahressimulation des Hybridparks.
 * @param {object} eingabe { pvAcKw, dcAc, bessKw, bessKwh, netzKw, bezugKw }
 */
export function simuliereHybridpark(eingabe = {}) {
  const e = bereinige(eingabe);
  const kwp = e.pvAcKw * e.dcAc;
  const reihen = jahresreihen({ kwp, ertragProKwp: ANNAHMEN.ertragProKwp });
  const { pv, wechselhaft } = reihen;
  const eta = ANNAHMEN.wirkungsgrad;
  const nutzbar = e.bessKwh * ANNAHMEN.nutzbarAnteil;
  const mitSpeicher = e.bessKw > 0 && nutzbar > 0;

  const m0 = () => new Array(12).fill(0);
  const mon = { pvAc: m0(), abrOhne: m0(), abrMit: m0(), entladen: m0(), netzladung: m0() };
  let sDc = 0, sClip = 0, sAc = 0, sAbrOhne = 0, sAbrMit = 0, sLadenPv = 0, sLadenNetz = 0, sEntladen = 0;
  let stundenAbr = 0;
  let soc = 0;
  let i = 0;

  for (let m = 0; m < 12; m++) {
    for (let d = 0; d < TAGE_MONAT[m]; d++) {
      // Halbstunden-/Stundenschritte des Tages vorbereiten: AC-Leistung je Schritt
      const schritte = [];
      for (let h = 0; h < 24; h++, i++) {
        const teile = wechselhaft[i] ? TEIL_WECHSELHAFT : [1];
        const dt = 1 / teile.length;
        let abrStunde = false;
        for (const f of teile) {
          const dcKw = Math.min(pv[i] * f, kwp); // höchstens 1 kW je kWp
          const acKw = Math.min(dcKw, e.pvAcKw);
          sDc += dcKw * dt;
          sClip += (dcKw - acKw) * dt;
          sAc += acKw * dt;
          mon.pvAc[m] += acKw * dt;
          const ueber = Math.max(0, acKw - e.netzKw) * dt;
          if (ueber > 0) abrStunde = true;
          schritte.push({ h, dt, acKw, ueber });
        }
        if (abrStunde) stundenAbr++;
      }
      // Erwartete Abregelung des Tages (begrenzt durch die Ladeleistung) und letzte Abregelungsstunde
      let erwartet = 0;
      let letzteAbr = -1;
      for (const s of schritte) {
        sAbrOhne += s.ueber;
        mon.abrOhne[m] += s.ueber;
        if (s.ueber > 0) {
          erwartet += Math.min(s.ueber, e.bessKw * s.dt);
          letzteAbr = s.h;
        }
      }
      const entladeStart = Math.max(ANNAHMEN.entladenAb, letzteAbr + 1);

      for (const s of schritte) {
        let laden = 0;
        if (mitSpeicher) {
          // 1) Netzladung nachts (Speicherbezug), Platz für die erwartete Abregelung freihalten
          if (e.bezugKw > 0 && s.h >= ANNAHMEN.netzladungVon && s.h < ANNAHMEN.netzladungBis) {
            const ziel = Math.max(0, nutzbar - erwartet * eta);
            const netz = Math.max(0, Math.min(Math.min(e.bezugKw, e.bessKw) * s.dt, (ziel - soc) / eta));
            soc += netz * eta;
            sLadenNetz += netz;
            mon.netzladung[m] += netz;
          }
          // 2) Überschuss über der netzwirksamen Leistung laden
          if (s.ueber > 0) {
            laden = Math.max(0, Math.min(s.ueber, e.bessKw * s.dt, (nutzbar - soc) / eta));
            soc += laden * eta;
            sLadenPv += laden;
          }
          // 3) Entladen ins Netz, solange der Netzanschluss Luft hat
          if (s.h >= entladeStart && s.acKw < e.netzKw && soc > 0) {
            const ent = Math.max(0, Math.min((e.netzKw - s.acKw) * s.dt, e.bessKw * s.dt, soc * eta));
            soc -= ent / eta;
            sEntladen += ent;
            mon.entladen[m] += ent;
          }
        }
        const rest = s.ueber - laden;
        sAbrMit += rest;
        mon.abrMit[m] += rest;
      }
    }
  }

  const tor = torEinordnung(e);
  const einspeisungOhne = sAc - sAbrOhne;
  // Netzeinspeisung mit Speicher: direkt eingespeiste PV + Entladung
  const einspeisungMit = sAc - sAbrMit - sLadenPv + sEntladen;
  return {
    eingabe: e,
    kwp,
    tor,
    pvDc: sDc,
    clipping: sClip,
    pvAc: sAc,
    abregelungOhne: sAbrOhne,
    abregelungMit: sAbrMit,
    anteilOhne: sAc > 0 ? sAbrOhne / sAc : 0,
    anteilMit: sAc > 0 ? sAbrMit / sAc : 0,
    vermieden: sAbrOhne - sAbrMit,
    ladenPv: sLadenPv,
    ladenNetz: sLadenNetz,
    entladen: sEntladen,
    speicherVerluste: sLadenPv + sLadenNetz - sEntladen - soc, // Restladung am Jahresende bleibt im Speicher
    restladung: soc,
    einspeisungOhne,
    einspeisungMit,
    vollzyklen: e.bessKwh > 0 ? sEntladen / e.bessKwh : 0,
    stundenMitAbregelung: stundenAbr,
    roundTrip: ETA_RT(),
    monate: MONATE.map((name, m) => ({
      name,
      pvAc: mon.pvAc[m],
      abrOhne: mon.abrOhne[m],
      abrMit: mon.abrMit[m],
      entladen: mon.entladen[m],
      netzladung: mon.netzladung[m],
    })),
  };
}

const zahlCsv = (n, st = 0) => (Number.isFinite(n) ? n.toFixed(st).replace(".", ",") : "");

/** CSV-Export (Semikolon, deutsches Dezimalkomma) – nur nach dem Lead-Gate angeboten. */
export function hybridparkCsv(erg) {
  const e = erg.eingabe;
  const mwh = (kwh) => zahlCsv(kwh / 1000, 1);
  const kopf = [
    `# Hybridpark-Konfigurator Ökovolt Österreich · Stand ${STAND}`,
    "# Richtwert/Orientierung – vereinfachte Simulation, keine Ertrags- oder Erlöszusage; ersetzt keine Netzberechnung und keine Netzbetreiber-Auskunft.",
    `# Eingaben: PV-AC ${e.pvAcKw} kW; DC/AC ${zahlCsv(e.dcAc, 2)} (${zahlCsv(erg.kwp)} kWp); BESS ${e.bessKw} kW / ${e.bessKwh} kWh; netzwirksame Leistung ${e.netzKw} kW; Speicherbezug ${e.bezugKw} kW`,
    `# Annahmen: ${ANNAHMEN.ertragProKwp} kWh/kWp; Wirkungsgrad je Richtung ${zahlCsv(ANNAHMEN.wirkungsgrad * 100)} %; nutzbar ${zahlCsv(ANNAHMEN.nutzbarAnteil * 100)} %; Profil src/lib/rechner/profile.js (8.760 h, typisches Wetterjahr)`,
    `# TOR (Summe PV-AC + BESS = ${e.pvAcKw + e.bessKw} kW): Typ ${erg.tor.typ ?? "–"}${erg.tor.abweichung ? ` – bei Begrenzung auf ${e.netzKw} kW ggf. Typ ${erg.tor.typBegrenzt} (mit Netzbetreiber zu prüfen)` : ""}`,
    `# Abregelung ohne BESS: ${mwh(erg.abregelungOhne)} MWh (${zahlCsv(erg.anteilOhne * 100, 1)} %); mit BESS: ${mwh(erg.abregelungMit)} MWh (${zahlCsv(erg.anteilMit * 100, 1)} %); Vollzyklen/Jahr: ${zahlCsv(erg.vollzyklen, 0)}`,
  ];
  const zeilen = [
    "Monat;PV-Erzeugung AC (MWh);Abregelung ohne BESS (MWh);Abregelung mit BESS (MWh);Entladung BESS (MWh);Netzladung BESS (MWh)",
    ...erg.monate.map((r) => [r.name, mwh(r.pvAc), mwh(r.abrOhne), mwh(r.abrMit), mwh(r.entladen), mwh(r.netzladung)].join(";")),
    ["Jahr", mwh(erg.pvAc), mwh(erg.abregelungOhne), mwh(erg.abregelungMit), mwh(erg.entladen), mwh(erg.ladenNetz)].join(";"),
  ];
  return [...kopf, ...zeilen].join("\r\n");
}
