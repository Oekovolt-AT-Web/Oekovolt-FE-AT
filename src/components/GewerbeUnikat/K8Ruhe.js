// src/components/GewerbeUnikat/K8Ruhe.js
//
// K8 · Montagefenster: ruhige Werktage im Lastgang finden (REIN – ohne React, Server, Client und Node).
// Grundlage ist das Raster aus lastAufbereiten() (./_rechnen.js), das useGewerbeDaten() liefert.
//
// Regel: Ein Werktag (Mo–Fr, kein Feiertag) gilt als ruhig, wenn sein Tagesmittel unter
//   Grundlast + 25 % × (Median der Werktags-Mittel − Grundlast)
// liegt – also weniger als ein Viertel der üblichen Produktionslast über der Grundlast anfällt.
// Feiertage an Werktagen verlängern einen ruhigen Abschnitt, Wochenenden unterbrechen ihn nicht.
// Ein Abschnitt zählt ab 5 ruhigen Werktagen. Zurück kommt der längste Abschnitt.
//
// Warum nicht „Tagesmittel < 1,3 × Grundlast“ (Konzept)? Im synthetischen Beispielbetrieb liegt das
// Tagesmittel im Betriebsurlaub bei ≈ 1,36 × Grundlast (Instandhaltung 7–15 Uhr) – die feste 1,3-Schwelle
// fände ihn nicht. Die relative Schwelle trennt Urlaub (≈ 46 kW) und Schichttage (≈ 130 kW) im Beispiel
// sicher und passt auch zu Betrieben mit hoher Grundlast (Kühlung, Druckluft), bei denen schon ein
// normaler Werktag nur wenig über der Grundlast liegt.

export const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** Zeitraum in Worten: „4.–15. August“ bzw. „28. Juli – 8. August“ (Wanduhr-UTC-ms). */
export function zeitraumText(vonMs, bisMs) {
  const a = new Date(vonMs);
  const b = new Date(bisMs);
  const ta = a.getUTCDate();
  const tb = b.getUTCDate();
  const ma = a.getUTCMonth();
  const mb = b.getUTCMonth();
  if (ma === mb) return ta === tb ? `${ta}. ${MONATE_LANG[ma]}` : `${ta}.–${tb}. ${MONATE_LANG[mb]}`;
  return `${ta}. ${MONATE_LANG[ma]} – ${tb}. ${MONATE_LANG[mb]}`;
}

/**
 * Längster Abschnitt ruhiger Werktage.
 * @param {{ grundlast:number, raster:{ tage:ArrayLike<number>, typ:ArrayLike<number>, slots:number, last:ArrayLike<number> } }} last
 * @returns {null | { von:number, bis:number, werktage:number, text:string, schwelleKw:number, medianKw:number }}
 */
export function ruhigeWerktage(last, { mindestTage = 5, anteil = 0.25 } = {}) {
  const r = last?.raster;
  if (!r || !r.tage || !r.tage.length || !(r.slots > 0)) return null;
  const { tage, typ, slots } = r;
  const werte = r.last;
  const n = tage.length;

  // Tagesmittel (nur Tage mit mindestens 80 % gültigen Werten)
  const mittel = new Float64Array(n);
  for (let d = 0; d < n; d++) {
    let s = 0;
    let c = 0;
    for (let k = 0; k < slots; k++) {
      const v = werte[d * slots + k];
      if (Number.isFinite(v)) {
        s += v;
        c++;
      }
    }
    mittel[d] = c >= slots * 0.8 ? s / c : NaN;
  }

  const werktagsMittel = [];
  for (let d = 0; d < n; d++) if (typ[d] === 0 && Number.isFinite(mittel[d])) werktagsMittel.push(mittel[d]);
  if (werktagsMittel.length < 20) return null;
  werktagsMittel.sort((a, b) => a - b);
  const m = werktagsMittel.length;
  const median = m % 2 ? werktagsMittel[(m - 1) / 2] : (werktagsMittel[m / 2 - 1] + werktagsMittel[m / 2]) / 2;
  const grund = Number.isFinite(last.grundlast) ? last.grundlast : werktagsMittel[0];
  // Ohne ausgeprägten Unterschied zwischen Werktag und Grundlast (Dauerbetrieb) gibt es nichts zu erkennen
  if (!(median > grund * 1.15)) return null;
  const schwelle = grund + anteil * (median - grund);

  let best = null;
  let lauf = null;
  const abschliessen = () => {
    if (lauf && lauf.werktage >= mindestTage && (!best || lauf.werktage > best.werktage)) best = lauf;
    lauf = null;
  };
  for (let d = 0; d < n; d++) {
    const wochentag = new Date(tage[d]).getUTCDay(); // 0 So … 6 Sa
    if (wochentag === 0 || wochentag === 6) continue; // Wochenende: weder zählen noch unterbrechen
    const feiertag = typ[d] === 2;
    const ruhig = feiertag || (Number.isFinite(mittel[d]) && mittel[d] < schwelle);
    if (!ruhig) {
      abschliessen();
      continue;
    }
    if (!lauf) lauf = { von: d, bis: d, werktage: 0 };
    lauf.bis = d;
    if (!feiertag) lauf.werktage++;
  }
  abschliessen();
  if (!best) return null;
  return {
    von: tage[best.von],
    bis: tage[best.bis],
    werktage: best.werktage,
    text: zeitraumText(tage[best.von], tage[best.bis]),
    schwelleKw: schwelle,
    medianKw: median,
  };
}
