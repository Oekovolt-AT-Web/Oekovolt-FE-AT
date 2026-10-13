// src/components/AnlagenCheck/auswertung.js
//
// Rechenkern des Anlagen-Checks (reines JS, Node-testbar über scripts/bestand-service.test.mjs).
// Die Komponente AnlagenCheck.js liest Monatswerte lokal im Browser ein und stellt dar.
//
// Soll-Wert: PVGIS-Monatserträge (src/data/regionen-pvgis.json, Süd/35° direkt, Ost/West und
// Flachdach über die Geometrie aus src/lib/lastgang/pv.js) × kWp × Alterungsfaktor. Optional
// wetterbereinigt: Verhältnis der gemessenen Monats-Globalstrahlung (GeoSphere INCA, Route
// /api/lastgang/wetter aus Paket B11) zum langjährigen Monatsmittel. Alle Werte sind Richtwerte.
// Die Auswertung bewertet die Anlage – nie den Errichter.

import { monatsErtraege } from "../../lib/lastgang/pv.js";

export const DEGRADATION_PRO_JAHR = 0.005; // Annahme: 0,5 % je Betriebsjahr
export const AMPEL = { gruen: 0.9, gelb: 0.75 }; // Verhältnis Ist/Soll – Richtwerte
export const WETTER_FAKTOR_GRENZEN = { min: 0.6, max: 1.5 };
export const MONATE_KURZ = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export const QUELLEN = [
  { titel: "PVGIS v5.3 (EU-Kommission, JRC), SARAH3, 14 % Systemverluste – Monatserträge je Ort, abgerufen 28.09.2026", href: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
  { titel: "GeoSphere Austria – INCA Analyse (Globalstrahlung, 1 km, stündlich), CC BY 4.0", href: "https://data.hub.geosphere.at/" },
  { titel: "ÖVE/ÖNORM EN 62446-1 – Prüfung und Instandhaltung von PV-Systemen (Ertragsvergleich als Teil der Betriebsüberwachung)", href: "https://shop.austrian-standards.at/" },
];

const MONATS_MUSTER = [
  /^j[aä]n/i, /^feb/i, /^m[aä]r/i, /^apr/i, /^mai|^may/i, /^jun/i, /^jul/i, /^aug/i, /^sep/i, /^okt|^oct/i, /^nov/i, /^dez|^dec/i,
];

/** Zahl mit Komma oder Punkt, Tausenderpunkte erlaubt, Einheit kWh erlaubt */
export function leseZahl(roh) {
  if (roh == null) return null;
  let s = String(roh).trim().replace(/\s*kwh$/i, "").replace(/\s/g, "");
  if (!s) return null;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Monatsindex 0–11 aus „2025-03“, „03.2025“, „3/2025“, „März“, „Mar“, „3“ – sonst -1 */
export function leseMonat(roh) {
  const s = String(roh || "").trim();
  if (!s) return -1;
  let m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.]\d{1,2})?$/);
  if (m) return Number(m[2]) - 1;
  m = s.match(/^(?:\d{1,2}[-/.])?(\d{1,2})[-/.](\d{4})$/);
  if (m) return Number(m[1]) - 1;
  if (/^\d{1,2}$/.test(s)) {
    const n = Number(s);
    return n >= 1 && n <= 12 ? n - 1 : -1;
  }
  const i = MONATS_MUSTER.findIndex((re) => re.test(s));
  return i;
}

/**
 * Monatswerte aus Text (CSV, Tabellen-Einfügen, 12 Zahlen).
 * @returns {{ werte: (number|null)[], erkannt: "zahlen"|"monate"|"leer", fehler: string[] }}
 */
export function parseMonatswerte(text) {
  const werte = Array(12).fill(null);
  const fehler = [];
  const zeilen = String(text || "")
    .split(/\r?\n/)
    .map((z) => z.trim())
    .filter(Boolean);
  if (!zeilen.length) return { werte, erkannt: "leer", fehler };

  // Fall 1: nur Zahlen (eine Zeile mit 12 Werten oder 12 Zeilen mit je einer Zahl)
  const alleTokens = zeilen.flatMap((z) => z.split(/[;,\t ]+/)).filter(Boolean);
  const nurZahlen = alleTokens.length === 12 && alleTokens.every((t) => leseZahl(t) !== null);
  if (nurZahlen) return { werte: alleTokens.map((t) => leseZahl(t)), erkannt: "zahlen", fehler };

  // Fall 2: Monat + Wert je Zeile
  let treffer = 0;
  for (const z of zeilen) {
    // Trenner: Semikolon oder Tab; sonst Leerraum; Komma nur, wenn davor ein Monat steht (sonst Dezimalkomma)
    let spalten = z.split(/[;\t]/).map((t) => t.trim()).filter(Boolean);
    if (spalten.length < 2) spalten = z.split(/\s+/).filter(Boolean);
    if (spalten.length < 2 && z.includes(",")) {
      const k = z.indexOf(",");
      const links = z.slice(0, k).trim();
      if (leseMonat(links) >= 0) spalten = [links, z.slice(k + 1).trim()];
    }
    const monat = spalten.length >= 2 ? leseMonat(spalten[0]) : -1;
    const wert = spalten.length >= 2 ? leseZahl(spalten[spalten.length - 1]) : null;
    if (monat < 0 || wert === null) {
      if (!/monat|kwh|ertrag|datum/i.test(z)) fehler.push(`Zeile nicht erkannt: „${z.slice(0, 40)}“`);
      continue;
    }
    werte[monat] = (werte[monat] || 0) + wert;
    treffer++;
  }
  if (!treffer) {
    fehler.push("Keine Monatswerte erkannt. Erwartet: „2025-03;1234“ je Zeile oder zwölf Zahlen Jänner bis Dezember.");
    return { werte, erkannt: "leer", fehler };
  }
  return { werte, erkannt: "monate", fehler };
}

/** Langjährige Monats-Globalstrahlung (kWh/m², Näherung aus PVGIS-Jahreswert und Monatsprofil) */
export function klimaGhiMonate(ort) {
  const summe = ort.monate_sued35.reduce((a, b) => a + b, 0) || 1;
  return ort.monate_sued35.map((w) => (ort.einstrahlung_kwh_m2 * w) / summe);
}

/** Wetterfaktoren je Monat aus gemessener Monats-Globalstrahlung (kWh/m²); null, wo nichts gemessen wurde */
export function wetterFaktoren(ort, messGhi) {
  if (!Array.isArray(messGhi)) return null;
  const klima = klimaGhiMonate(ort);
  return klima.map((k, m) => {
    const g = messGhi[m];
    if (!Number.isFinite(g) || g <= 0 || k <= 0) return null;
    return Math.min(WETTER_FAKTOR_GRENZEN.max, Math.max(WETTER_FAKTOR_GRENZEN.min, g / k));
  });
}

/**
 * Stundenreihe der Globalstrahlung (W/m² oder Wh/m²) → Monatssummen kWh/m² (nur Monate mit ≥ 20 Tagen).
 * Erwartet [{ zeit: ISO-String|ms, gl: number }].
 */
export function ghiMonatsSummen(stunden, jahr) {
  const summen = Array(12).fill(0);
  const tage = Array.from({ length: 12 }, () => new Set());
  for (const s of stunden || []) {
    const t = typeof s.zeit === "number" ? s.zeit : Date.parse(s.zeit);
    if (!Number.isFinite(t)) continue;
    const d = new Date(t);
    if (jahr && d.getUTCFullYear() !== jahr) continue;
    const gl = Number(s.gl);
    if (!Number.isFinite(gl) || gl < 0) continue;
    const m = d.getUTCMonth();
    summen[m] += gl / 1000; // W/m² über eine Stunde = Wh/m² → kWh/m²
    tage[m].add(d.getUTCDate());
  }
  return summen.map((s, m) => (tage[m].size >= 20 ? s : null));
}

/** Soll-Erträge je Monat (kWh) */
export function sollMonate({ ort, ausrichtung = "sued", kwp, alterJahre = 0, faktoren = null }) {
  const basis = monatsErtraege(ort, ausrichtung);
  const alterung = Math.max(0.7, 1 - DEGRADATION_PRO_JAHR * Math.max(0, alterJahre));
  return basis.map((w, m) => {
    const f = faktoren && Number.isFinite(faktoren[m]) ? faktoren[m] : 1;
    return w * Math.max(0, kwp) * alterung * f;
  });
}

export const ampelFuer = (quote) => (quote == null ? "grau" : quote >= AMPEL.gruen ? "gruen" : quote >= AMPEL.gelb ? "gelb" : "rot");

/**
 * Bewertung Ist gegen Soll. Prüfpunkte beschreiben die Anlage – kein Urteil über den Errichter.
 */
export function bewerte({ ist, soll }) {
  const monate = soll.map((s, m) => {
    const i = Number.isFinite(ist[m]) ? ist[m] : null;
    const quote = i === null || s <= 0 ? null : i / s;
    return { monat: m, ist: i, soll: s, quote, ampel: ampelFuer(quote) };
  });
  const mitDaten = monate.filter((x) => x.ist !== null);
  const istSumme = mitDaten.reduce((a, x) => a + x.ist, 0);
  const sollSumme = mitDaten.reduce((a, x) => a + x.soll, 0);
  const quote = mitDaten.length && sollSumme > 0 ? istSumme / sollSumme : null;
  const jahr = { ist: istSumme, soll: sollSumme, quote, ampel: ampelFuer(quote), monate: mitDaten.length };

  const pruefpunkte = [];
  if (!mitDaten.length) return { monate, jahr, pruefpunkte };

  const namen = (liste) => liste.map((x) => MONATE_KURZ[x.monat]).join(", ");
  const nullMonate = mitDaten.filter((x) => x.ist === 0 && x.soll > 0);
  if (nullMonate.length) {
    pruefpunkte.push({
      id: "ausfall",
      titel: `Kein Ertrag in ${namen(nullMonate)}`,
      text: "Entweder stand die Anlage (Schutzschalter, Störung, Abschaltung) oder das Monitoring hat keine Daten übertragen. Meldungen im Wechselrichter-Portal für diese Monate ansehen.",
      stufe: "rot",
    });
  }

  const winter = mitDaten.filter((x) => [10, 11, 0, 1].includes(x.monat) && x.ist > 0);
  const sommer = mitDaten.filter((x) => [4, 5, 6, 7].includes(x.monat) && x.ist > 0);
  const winterSchwach = winter.filter((x) => x.quote < 0.6);
  const sommerOk = sommer.length && sommer.every((x) => x.quote >= AMPEL.gelb);
  if (winterSchwach.length && sommerOk) {
    pruefpunkte.push({
      id: "winter",
      titel: `Winter deutlich unter Soll (${namen(winterSchwach)})`,
      text: "Bei flacher Sonne wirken Schneedecke, Verschattung durch Nachbargebäude oder Bäume und Verschmutzung an der Modulunterkante besonders stark. Im Sommer passt der Ertrag – ein Hinweis auf Verschattung oder Schnee, nicht auf einen Defekt.",
      stufe: "gelb",
    });
  }

  const sommerSchwach = sommer.filter((x) => x.quote < 0.8);
  if (sommerSchwach.length) {
    pruefpunkte.push({
      id: "sommer",
      titel: `Sommer unter Soll (${namen(sommerSchwach)})`,
      text: "In den ertragsstärksten Monaten fehlt Leistung. Typische Ursachen: Verschmutzung, Hotspots oder ausgefallene Substrings, Übertemperatur des Wechselrichters, Leistungsreduktion wegen hoher Netzspannung (P(U)) oder ein Einspeiselimit. Thermografie und ein Blick in die Meldungen des Wechselrichters klären das.",
      stufe: "gelb",
    });
  }

  // einzelner Einbruch zwischen zwei guten Nachbarmonaten
  for (let m = 1; m < 11; m++) {
    const a = monate[m - 1], b = monate[m], c = monate[m + 1];
    if (b.quote !== null && b.quote < 0.7 && b.ist > 0 && a.quote >= 0.85 && c.quote >= 0.85) {
      pruefpunkte.push({
        id: `einbruch-${m}`,
        titel: `Einzelner Einbruch im ${MONATE_KURZ[m]}`,
        text: "Nachbarmonate passen, ein Monat fällt heraus – meist eine Störung, ein ausgelöster Schutzschalter oder eine Abschaltung für einige Tage. Datum der Lücke im Portal prüfen.",
        stufe: "gelb",
      });
    }
  }

  if (quote !== null && quote < AMPEL.gelb && !nullMonate.length) {
    pruefpunkte.push({
      id: "gesamt-rot",
      titel: "Jahresertrag deutlich unter Soll",
      text: "Über alle Monate fehlt ein spürbarer Anteil. Vor dem Service-Check zuerst die Eingaben prüfen (Leistung in kWp, Ausrichtung, Ort). Bleibt die Lücke, gehören Stringmessung, Isolationsprüfung und Thermografie in den Service-Check.",
      stufe: "rot",
    });
  } else if (quote !== null && quote < AMPEL.gruen) {
    pruefpunkte.push({
      id: "gesamt-gelb",
      titel: "Gleichmäßig etwas unter Soll",
      text: "Mögliche Ursachen: Ausrichtung oder Neigung weichen von der Annahme ab, Teilverschattung, Alterung über dem Richtwert, Wechselrichter-Wirkungsgrad oder ein dauerhaftes Einspeiselimit. Ein Vergleich der Strings untereinander zeigt, ob ein Teil der Anlage zurückbleibt.",
      stufe: "gelb",
    });
  }

  if (quote !== null && quote > 1.15) {
    pruefpunkte.push({
      id: "ueber-soll",
      titel: "Deutlich über Soll",
      text: "Der Soll-Wert ist ein Klimamittel; ein sonniges Jahr oder eine bessere Ausrichtung erklären einige Prozent. Liegt der Ertrag weit darüber, bitte Leistung (kWp) und Ausrichtung in den Eingaben prüfen.",
      stufe: "grau",
    });
  }

  if (!pruefpunkte.length) {
    pruefpunkte.push({
      id: "ok",
      titel: "Erträge im erwarteten Bereich",
      text: "Keine Auffälligkeit in den Monatswerten. Die wiederkehrende Prüfung nach OVE E 8101 bleibt trotzdem fällig – Ertrag sagt nichts über Isolation, Steckverbinder oder Schutzeinrichtungen.",
      stufe: "gruen",
    });
  }

  return { monate, jahr, pruefpunkte };
}

/** CSV für den Export (Semikolon, Dezimalkomma) */
export function csvExport({ ergebnis, meta }) {
  const z = (n) => (n == null ? "" : String(Math.round(n * 10) / 10).replace(".", ","));
  const zeilen = [
    `Anlagen-Check Ökovolt;Stand ${meta.stand}`,
    `Ort;${meta.ort}`,
    `Leistung;${z(meta.kwp)} kWp`,
    `Ausrichtung;${meta.ausrichtung}`,
    `Inbetriebnahme;${meta.jahr}`,
    `Soll-Basis;${meta.wetter ? "PVGIS-Monatswerte, wetterbereinigt (GeoSphere INCA)" : "PVGIS-Monatswerte (Klimamittel)"}`,
    "",
    "Monat;Ist kWh;Soll kWh;Ist/Soll",
    ...ergebnis.monate.map((m) => `${MONATE_KURZ[m.monat]};${z(m.ist)};${z(m.soll)};${m.quote == null ? "" : `${Math.round(m.quote * 100)} %`}`),
    `Jahr (${ergebnis.jahr.monate} Monate);${z(ergebnis.jahr.ist)};${z(ergebnis.jahr.soll)};${ergebnis.jahr.quote == null ? "" : `${Math.round(ergebnis.jahr.quote * 100)} %`}`,
    "",
    "Richtwert zur Orientierung – kein Prüfbefund. Quellen: PVGIS v5.3 (JRC), GeoSphere Austria INCA (CC BY 4.0).",
  ];
  return zeilen.join("\n");
}

/**
 * Beispielvorschau vor dem Lead-Gate (Stufe 2): KEINE Messwerte, sondern ein frei gewähltes Muster
 * (Faktoren je Monat auf den Soll-Wert), das zeigt, wie die Auswertung aussieht – Winter deutlich
 * schwächer als der Sommer, damit Prüfpunkte sichtbar werden. Auf der Seite immer als „Beispiel“
 * gekennzeichnet.
 */
export const BEISPIEL_MUSTER = [0.52, 0.6, 0.86, 0.95, 0.97, 0.96, 0.98, 0.97, 0.94, 0.84, 0.58, 0.5];
export const BEISPIEL = { ortSlug: "ostermiething", kwp: 30, ausrichtung: "sued", alterJahre: 9 };

export function beispielAuswertung(ort) {
  if (!ort) return null;
  const soll = sollMonate({ ort, ausrichtung: BEISPIEL.ausrichtung, kwp: BEISPIEL.kwp, alterJahre: BEISPIEL.alterJahre });
  const ist = soll.map((s, m) => Math.round(s * BEISPIEL_MUSTER[m]));
  return { soll, ergebnis: bewerte({ ist, soll }) };
}
