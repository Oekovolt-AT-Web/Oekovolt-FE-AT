// src/components/GewerbeUnikat/K3Server.js
//
// NUR SERVER (aus K3Anlagengroesse.js): Startdaten von Kapitel 03, die beispielServer() nicht liefert –
// einmal je Server-Prozess gerechnet (≈ 0,4 s, danach aus dem Modul-Speicher):
//  - die vollständige Knick-Kurve (60 Punkte, dieselbe wie im Web Worker) samt Anteil des Überschusses an
//    ruhenden Tagen je Anlagengröße → Startbild = gerechnetes Bild, beim Eintreffen der Worker-Daten
//    springt nichts,
//  - die Juniwoche des Wochen-Pulses (Mo 16.–So 22.6.2025) für den Wochenstreifen,
//  - der Betriebsurlaubstag (Mi 6.8.2025) für das dritte Tagesband,
//  - der Überschuss-Anteil an Ruhetagen bei der Empfehlung (88 %) mit DERSELBEN Regel wie die Bühne
//    (K3Modell.vorbereiten: Sa/So/Feiertag oder Werktag mit Betriebsruhe).
//
// Abweichung von der Regel „Server-Komponenten nehmen ihre Zahlen aus _server.js“: _server.js liefert
// weder Raster noch Kurve, und Bau-Agenten ändern _server.js nicht. Deshalb rechnet diese Datei mit
// denselben reinen Funktionen (./_rechnen.js, K3Modell.js) – ausschließlich auf dem Server, nie im Bundle.
// Rückgabe vollständig serialisierbar (Zahlen, Arrays).

import pvgis from "@/data/regionen-pvgis.json";
import { beispielServer } from "./_server";
import { BEISPIEL_AUSRICHTUNG, BEISPIEL_ORT, beispielLastgang, lastAufbereiten, pvAufbereiten } from "./_rechnen.js";
import { BEISPIEL_WOCHE, kurveFuerZeichnung, tagKurz, ueberschussRuhe, vorbereiten, wocheDaten } from "./K3Modell";

const URLAUB_TAG = Date.UTC(2025, 7, 6);
const r1 = (v) => Math.round(v * 10) / 10;
const r4 = (v) => Math.round(v * 1e4) / 1e4;

let cache = null;

/**
 * @returns {{
 *   empfKwp:number, xMax:number, ertragMwhJeKwp:number, ortId:string, ausrichtung:string, ruheEmp:number,
 *   punkte:{kwp:number, ev:number, aut:number, grenz:number, ruhe:number}[],
 *   woche:{slots:number, tage:{t:number, typ:number, ruht:boolean}[], L:number[], P1:number[]} | null,
 *   urlaub:{t:number, L:number[], P1:number[]} | null
 * }}
 */
export function k3Start() {
  if (cache) return cache;
  beispielServer(); // wärmt den gemeinsamen Lastgang-Speicher in ./_rechnen.js (kein zweites Parsen)
  const lg = beispielLastgang();
  const last = lastAufbereiten(lg, "beispiel");
  const pv = pvAufbereiten(lg, last, pvgis.orte[BEISPIEL_ORT], BEISPIEL_ORT, BEISPIEL_AUSRICHTUNG);
  const vor = vorbereiten(last);
  const emp = pv.empfehlung.kwp;

  const punkte = kurveFuerZeichnung(pv.kurve).map((p) => ({
    kwp: r4(p.kwp),
    ev: r4(p.ev),
    aut: r4(p.aut),
    grenz: r4(p.grenz),
    ruhe: p.kwp > 0 ? r4(ueberschussRuhe(lg.kwh, pv.reihe, p.kwp, vor)) : 1,
  }));

  const { tage, slots } = last.raster;
  const d0 = Array.prototype.indexOf.call(tage, BEISPIEL_WOCHE);
  let woche = null;
  if (d0 >= 0 && d0 + 6 < tage.length) {
    const w = wocheDaten(last, pv, vor, d0, null);
    woche = { slots: w.slots, tage: w.tage, L: Array.from(w.L, r1), P1: Array.from(w.P1, r4) };
  }
  const du = Array.prototype.indexOf.call(tage, URLAUB_TAG);
  let urlaub = null;
  if (du >= 0) {
    const L = [];
    const P1 = [];
    for (let s = 0; s < slots; s++) {
      const v = last.raster.last[du * slots + s];
      L.push(r1(Number.isFinite(v) ? v : 0));
      P1.push(r4(Math.max(0, pv.raster[du * slots + s] || 0)));
    }
    urlaub = { t: URLAUB_TAG, datum: tagKurz(URLAUB_TAG), L, P1 };
  }

  let ertrag = 0; // kWh je kWp im Messzeitraum (wie simuliere().erzeugt / kWp)
  for (let i = 0; i < pv.reihe.length; i++) ertrag += pv.reihe[i];

  // Anteil an Ruhetagen für die Tabellen-Größen (Wissensschublade)
  const ruheBei = {};
  for (const g of beispielServer().groessen) ruheBei[g.kwp] = ueberschussRuhe(lg.kwh, pv.reihe, g.kwp, vor);

  cache = {
    empfKwp: emp,
    ruheBei,
    xMax: pv.kurveMax,
    ertragMwhJeKwp: ertrag / 1000,
    ortId: pv.ortId,
    ausrichtung: pv.ausrichtung,
    ruheEmp: ueberschussRuhe(lg.kwh, pv.reihe, emp, vor),
    punkte,
    woche,
    urlaub,
  };
  return cache;
}
