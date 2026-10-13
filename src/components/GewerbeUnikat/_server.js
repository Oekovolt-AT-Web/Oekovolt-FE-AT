// src/components/GewerbeUnikat/_server.js
//
// NUR SERVER (Server-Komponenten von /gewerbe): Kennzahlen des synthetischen Beispielbetriebs für
// Text, figcaption, Kurzantwort und den Wochen-Puls im Hero – einmal je Server-Prozess gerechnet
// (≈ 0,6 s beim ersten Aufruf, danach aus dem Modul-Speicher). Dieselben Funktionen wie im Web Worker
// (./_rechnen.js), deshalb stimmen SSR-Text und interaktive Grafik exakt überein.
//
// Rückgabe ist vollständig serialisierbar (Zahlen, Arrays) – darf als Prop an Client-Inseln gehen.

import pvgis from "@/data/regionen-pvgis.json";
import { simuliere } from "@/lib/lastgang/pv";
import { ersparnisLeistungspreis, speicherFuerSchwelle } from "@/lib/lastgang/peak";
import { netzpreise } from "@/lib/rechner/peakshaving";
import { BEISPIEL_AUSRICHTUNG, BEISPIEL_ORT, beispielLastgang, kennzahlen, lastAufbereiten, monatsspitzenMitPv, pvAufbereiten, wochenPuls } from "./_rechnen.js";

/** Anlagengrößen für die SSR-Tabelle in K3 (Beispielbetrieb, Linz, Ost-West). */
const GROESSEN_KWP = [100, 200, 280, 300, 400, 600];
/** Deckel (kW) für die SSR-Tabelle in K5. */
const KAPP_SCHWELLEN = [290, 265, 250, 230, 210, 190];

let cache = null;

/**
 * @returns {{
 *   kennzahlen: ReturnType<typeof kennzahlen>,
 *   groessen: { kwp:number, evQuote:number, autarkie:number, erzeugtKwh:number, eigenKwh:number, einspeisungKwh:number }[],
 *   monatsspitzenMitPv: { kwp:number, mittel:number, spitzen:number[] },
 *   kappung: { schwelle:number, moeglich:boolean, leistungKw:number, nennKwh:number, tage:number, senkungKw:number, euro:number }[],
 *   puls: { slots:number, kwp:number, last:number[], pv:number[], tage:{t:number,typ:number}[], spitze:{i:number,kw:number} },
 *   tagesgang: { werktag:number[], samstag:number[], sonntag:number[] },
 *   dauerlinie: { anteil:number, kw:number }[],
 *   ueberschussRuhe: number   // Anteil des PV-Überschusses (Empfehlung) an Sa/So/Feiertagen + Betriebsurlaub
 * }}
 */
export function beispielServer() {
  if (cache) return cache;
  const lg = beispielLastgang();
  const last = lastAufbereiten(lg, "beispiel");
  const pv = pvAufbereiten(lg, last, pvgis.orte[BEISPIEL_ORT], BEISPIEL_ORT, BEISPIEL_AUSRICHTUNG);
  const w = wochenPuls(last, pv);

  // Anteil des Überschusses, der anfällt, wenn der Betrieb ruht (Sa/So/Feiertag oder Betriebsurlaub laut beispiel.js)
  const { slots, tage, typ } = last.raster;
  const k = pv.empfehlung.kwp;
  let ueb = 0;
  let uebRuhe = 0;
  for (let d = 0; d < tage.length; d++) {
    const dt = new Date(tage[d]);
    const m = dt.getUTCMonth();
    const t = dt.getUTCDate();
    const urlaub = (m === 7 && t >= 4 && t <= 15) || (m === 11 && t >= 24) || (m === 0 && t <= 6);
    for (let s = 0; s < slots; s++) {
      const j = d * slots + s;
      const l = last.raster.last[j];
      if (!Number.isFinite(l)) continue;
      const u = Math.max(0, pv.raster[j] * k - l);
      ueb += u;
      if (typ[d] > 0 || urlaub) uebRuhe += u;
    }
  }

  const groessen = GROESSEN_KWP.map((kwp) => {
    const s = simuliere(lg.kwh, pv.reihe, kwp);
    return { kwp, evQuote: s.evQuote, autarkie: s.autarkie, erzeugtKwh: s.erzeugt, eigenKwh: s.eigenverbrauch, einspeisungKwh: s.einspeisung };
  });
  const mitPv = monatsspitzenMitPv(last.reihe, pv.reihe, pv.empfehlung.kwp, last.intervall);

  // K5: Deckel → Speicher → Ersparnis für ausgewählte Schwellen (Netzebene 6, Oberösterreich wie das Rechenbeispiel)
  const lp = netzpreise("ooe", 6).lp;
  const kappung = KAPP_SCHWELLEN.map((schwelle) => {
    const sp = speicherFuerSchwelle(last.reihe.kw, last.intervall, schwelle);
    const er = ersparnisLeistungspreis(last.monate, schwelle, lp);
    return { schwelle, moeglich: sp.moeglich, leistungKw: sp.leistungKw, nennKwh: sp.nennKwh, tage: sp.tageMitEingriff, senkungKw: er.senkungKw, euro: er.euro };
  });

  cache = {
    kennzahlen: kennzahlen(last, pv),
    groessen, // K3: Tabelle Anlagengröße → Eigenverbrauch/Autarkie
    monatsspitzenMitPv: { kwp: pv.empfehlung.kwp, mittel: mitPv.mittel, spitzen: mitPv.spitzen }, // K5: PV-Wirkung auf die Spitzen
    kappung, // K5: [{ schwelle, moeglich, leistungKw, nennKwh, tage, senkungKw, euro }] bei NE 6 OÖ
    puls: w && { slots: w.slots, kwp: w.kwp, last: Array.from(w.last, (v) => Math.round(v * 10) / 10), pv: Array.from(w.pv, (v) => Math.round(v * 10) / 10), tage: w.tage, spitze: w.spitze },
    tagesgang: { werktag: last.tagesgang.werktag, samstag: last.tagesgang.samstag, sonntag: last.tagesgang.sonntag },
    dauerlinie: last.dauerlinie,
    ueberschussRuhe: ueb > 0 ? uebRuhe / ueb : 0,
  };
  return cache;
}
