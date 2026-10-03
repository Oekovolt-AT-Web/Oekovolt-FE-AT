// src/components/Startseite/s06-daten.js
//
// Reine Daten- und Farbhilfen für den Startseiten-Abschnitt „Strommarkt live“ (S06).
// Ohne "use client": läuft auf dem Server (Startwert, SEO) und im Browser (Live-Aktualisierung)
// mit identischem Ergebnis.

export const S06_FARBEN = {
  gruen: "#8cba58",
  gruenHell: "#aed083",
  gruenTief: "#669933",
  sonne: "#ffc53d",
  blau: "#7fa7d6",
  navy: "#03122b",
};

/** Koordinaten runden – Server und Browser rechnen Winkelfunktionen minimal verschieden (Hydration). */
export const rd = (v) => Math.round(v * 10) / 10;

/**
 * Erzeugungsquellen Österreichs (Energy-Charts public_power, country=at), wie in src/lib/energy.js
 * zusammengefasst. Reihenfolge = Reihenfolge im Balken.
 */
export const S06_QUELLEN = [
  { key: "wasser", name: "Wasserkraft", farbe: "#7fa7d6", text: "#03122b" },
  { key: "windOnshore", name: "Wind", farbe: "#aed083", text: "#03122b" },
  { key: "solar", name: "Solar", farbe: "#ffc53d", text: "#03122b" },
  { key: "biomasse", name: "Biomasse", farbe: "#5f9a2e", text: "#ffffff" },
  { key: "gas", name: "Erdgas", farbe: "#f29a4a", text: "#03122b" },
  { key: "sonstige", name: "Sonstige", farbe: "rgba(255,255,255,0.3)", text: "#ffffff" },
];

/**
 * Erzeugungsmix zum letzten vollständigen Zeitpunkt.
 * Erwartet `erzeugung` mit `zeiten` und `serien` (Server-Snapshot bzw. `/api/energie/live?voll=1`).
 * Rückgabe null, wenn keine Zeitreihen vorliegen.
 *   quellen: [{ key, name, farbe, text, mw }] – Anteile beziehen sich auf die Summe dieser Quellen
 *   lastMw, importMw (positiv = Nettoimport, negativ = Nettoexport), eeAnteil (Energy-Charts:
 *   „Renewable share of load“ in %), zeitpunkt (ms)
 */
export function erzeugungsMix(erzeugung) {
  const zeiten = erzeugung?.zeiten;
  const s = erzeugung?.serien;
  if (!Array.isArray(zeiten) || !zeiten.length || !s) return null;
  let i = erzeugung.zeitpunkt != null ? zeiten.indexOf(erzeugung.zeitpunkt) : -1;
  if (i < 0) {
    for (let k = zeiten.length - 1; k >= 0; k--) {
      if (s.solar?.[k] != null && s.last?.[k] != null) {
        i = k;
        break;
      }
    }
  }
  if (i < 0) return null;
  const wert = (k) => {
    const v = s[k]?.[i];
    return v == null ? null : Number(v) || 0;
  };
  const quellen = S06_QUELLEN.map((q) => ({ ...q, mw: Math.max(0, wert(q.key) ?? 0) }));
  const summe = quellen.reduce((a, q) => a + q.mw, 0);
  if (!(summe > 0)) return null;
  return {
    zeitpunkt: zeiten[i],
    lastMw: wert("last"),
    importMw: wert("import"),
    eeAnteil: wert("eeAnteil"),
    summe,
    quellen,
  };
}
