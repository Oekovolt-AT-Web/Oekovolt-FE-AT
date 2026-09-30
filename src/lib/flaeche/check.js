// src/lib/flaeche/check.js
//
// Flächen-Check für Grundeigentümer (/flaechen-check): Eignungsampel,
// Pachtspanne und Widmungshinweis für eine mögliche Freiflächen-PV-Fläche.
// Reine Funktionen ohne React/Pfad-Aliase – per Node testbar
// (node scripts/flaeche.test.mjs).
//
// Grundsätze:
//  - Rechtliche Kriterien je Bundesland kommen aus ./laender.js (RIS, Stand 30.09.2026).
//  - Pacht: nur belegte Spannen mit Quelle. Für Flächen ohne belegte Spanne
//    liefert der Check „Richtwert – Quelle offen“ statt einer Zahl.
//  - Neigung/Ausrichtung und Netzentfernung sind Faustregeln für die
//    Ersteinschätzung (keine Norm) und im UI so gekennzeichnet.
//  - Keine Rechts- oder Steuerberatung.

import { PACHT, netzEinschaetzung } from "../rechner/pacht.js";
import { LAENDER, landFuerSlug } from "./laender.js";

/** Belegte Pacht-Angaben (Abruf 30.09.2026). */
export const PACHT_QUELLEN = {
  lkSteiermark: {
    label: "Landwirtschaftskammer Steiermark – Photovoltaik auf Freiflächen: Nicht alles ist Gold, was glänzt (17.05.2022)",
    url: "https://stmk.lko.at/photovoltaik-auf-freifl%C3%A4chen-nicht-alles-ist-gold-was-gl%C3%A4nzt+2400+3668154",
  },
  lkKaernten: {
    label: "Landwirtschaftskammer Kärnten – Photovoltaik: Verträge nicht voreilig unterschreiben (29.09.2022)",
    url: "https://ktn.lko.at/photovoltaik-vertr%C3%A4ge-nicht-voreilig-unterschreiben+2400+3680849",
  },
  lkSteuer: {
    label: "Landwirtschaftskammer (LK Salzburg, veröffentlicht von LK Kärnten) – PV auf Freiflächen: Steuerbombe bei Planung vermeiden (04.06.2025)",
    url: "https://ktn.lko.at/pv-auf-freifl%C3%A4chen-steuerbombe-bei-planung-vermeiden+2400+4265377",
  },
  statistik: {
    label: "Statistik Austria – Landwirtschaftliche Pachtpreise 2024 (veröffentlicht 30.01.2026)",
    url: "https://www.statistik.at/statistiken/land-und-forstwirtschaft/land-und-forstwirtschaftliche-oekonomie-und-preise/landwirtschaftliche-pachtpreise",
  },
};

export const PACHT_BELEG = {
  // „gebotene Pachtzahlungen … durchschnittlich zwischen 3.000 und 5.000 Euro“ je ha und Jahr
  // (LK Steiermark 17.05.2022, LK Kärnten 29.09.2022) – Angebotsniveau, kein Marktpreisspiegel.
  pvVon: 3000,
  pvBis: 5000,
  pvJahr: 2022,
  // Statistik Austria, Pachtpreise 2024 (Österreich-Durchschnitt, €/ha und Jahr)
  ackerland: 364,
  dauergruenland: 257,
  agrarJahr: 2024,
};

export const WIDMUNGEN = [
  { id: "acker", label: "Acker", lang: "Grünland – Acker (landwirtschaftlich genutzt)" },
  { id: "wiese", label: "Wiese/Weide", lang: "Grünland – Wiese oder Weide" },
  { id: "vorbelastet", label: "Vorbelastet", lang: "vorbelastete Fläche (Deponie, Schottergrube, neben Autobahn/Bahn/Umspannwerk)" },
  { id: "pv", label: "PV-Widmung da", lang: "PV-Widmung bzw. Sonderausweisung liegt bereits vor" },
  { id: "bauland", label: "Bauland", lang: "Bauland oder Betriebsbaugebiet" },
  { id: "wald", label: "Wald", lang: "Wald" },
];

export const AUSRICHTUNGEN = [
  { id: "eben", label: "eben" },
  { id: "sued", label: "Süd" },
  { id: "suedostwest", label: "SO/SW" },
  { id: "ostwest", label: "Ost/West" },
  { id: "nord", label: "Nord" },
];

/** Stufen je Kriterium und ihr Gewicht für die Ampel. */
export const STUFEN = {
  gut: { label: "passt", gewicht: 0 },
  pruefen: { label: "prüfen", gewicht: 1 },
  erschwert: { label: "erschwert", gewicht: 2 },
  kritisch: { label: "Ausschluss", gewicht: 99 },
};

export const AMPEL = {
  gruen: { label: "Gute Voraussetzungen", text: "Auf den ersten Blick spricht wenig gegen einen Solarpark. Nächster Schritt: Widmungschancen mit der Gemeinde und Netzkapazität mit dem Netzbetreiber klären." },
  gelb: { label: "Prüfenswert", text: "Die Fläche kann passen, einzelne Punkte brauchen aber eine genauere Prüfung, bevor Sie einen Vertrag unterschreiben." },
  rot: { label: "Schwierig", text: "Mindestens ein Punkt steht einem Solarpark nach heutigem Stand entgegen. Eine Verpachtung für Freiflächen-PV ist hier unwahrscheinlich." },
};

/** Mindestgröße, ab der wir Freiflächen planen: ≈ 500 kWp (Seite /freiflaechen-photovoltaik). */
export const MIN_KWP = 500;

const zahlHa = (x) => String(x).replace(".", ",");

function widmungKriterium(land, widmung, ha) {
  const id = "widmung";
  const label = "Widmung & Landesrecht";
  if (widmung === "wald") {
    return { id, label, stufe: "kritisch", text: "Für Wald ist ein Solarpark in der Regel keine Option: Neben der Widmung bräuchte es eine Rodungsbewilligung nach dem Forstgesetz – mit ungewissem Ausgang." };
  }
  if (widmung === "pv") {
    return { id, label, stufe: "gut", text: `Eine Widmung für Photovoltaik liegt bereits vor – der aufwendigste Schritt ist damit erledigt. Prüfen Sie, ob Fläche, Befristung und Verwendungszweck zum geplanten Park passen.` };
  }
  if (widmung === "bauland") {
    return { id, label, stufe: "pruefen", text: `Ob eine Freiflächenanlage im Bauland zulässig ist, regelt die jeweilige Baulandkategorie ${land.im}. Klären Sie das mit der Gemeinde – und ob Bauland nicht wertvoller genutzt werden kann.` };
  }
  const vorbelastet = widmung === "vorbelastet";
  const c = land.check;
  if (c.art === "keine") return { id, label, stufe: "erschwert", text: c.text };
  if (c.art === "zonen") return { id, label, stufe: "erschwert", text: c.text };
  if (c.art === "deckel") {
    const grenze = vorbelastet ? c.maxHaVorbelastet : c.maxHa;
    if (ha > grenze) {
      return { id, label, stufe: vorbelastet ? "erschwert" : "kritisch", text: `${land.name} begrenzt eine zusammenhängende Widmungsfläche auf ${zahlHa(c.maxHa)} ha${c.maxHaVorbelastet ? `, auf vorbelasteten oder versiegelten Flächen auf ${zahlHa(c.maxHaVorbelastet)} ha` : ""}. Ihre Fläche liegt darüber – nur ein Teil wäre widmungsfähig${vorbelastet ? ", mehr nur im begründeten Einzelfall" : ""}.` };
    }
    return { id, label, stufe: "pruefen", text: c.text };
  }
  if (c.art === "staffel") {
    if (c.zoneHa && ha > c.zoneHa) {
      return { id, label, stufe: "erschwert", text: `Über ${zahlHa(c.zoneHa)} ha ist ${land.im} nur eine Vorrangzone des Landes möglich (Agri-PV ausgenommen). Prüfen Sie, ob Ihre Fläche in einer Zone liegt.` };
    }
    if (ha > c.grossHa) {
      if (c.vorbelastetHa && vorbelastet) {
        return { id, label, stufe: "pruefen", text: `Bis ${zahlHa(c.vorbelastetHa)} ha dürfen Gemeinden ${land.im} an vorbelasteten Standorten widmen – etwa neben Autobahn, Bahn, Umspannwerk oder Gewerbegebiet.` };
      }
      if (c.vorbelastetHa) {
        return { id, label, stufe: "erschwert", text: `Über ${zahlHa(c.grossHa)} ha ist ${land.im} eine Widmung nur an bestimmten vorbelasteten Standorten (bis ${zahlHa(c.vorbelastetHa)} ha) oder in einer Vorrangzone möglich.` };
      }
      return { id, label, stufe: "erschwert", text: `Über ${zahlHa(c.grossHa)} ha ist ${land.im} eine Widmung nur in einer Zone des Landes oder mit einer gesetzlichen Ausnahme möglich. Prüfen Sie, ob Ihre Fläche in einer Zone liegt.` };
    }
    return { id, label, stufe: "pruefen", text: c.text };
  }
  return { id, label, stufe: "pruefen", text: c.text };
}

function groesseKriterium(kwp) {
  const base = { id: "groesse", label: "Flächengröße" };
  if (kwp < MIN_KWP * 0.4) return { ...base, stufe: "erschwert", text: "Für einen Solarpark ist die Fläche sehr klein – Netzanschluss, Zaun und Genehmigung fallen dann stark ins Gewicht. Eher eine Option für den Eigenverbrauch eines benachbarten Betriebs." };
  if (kwp < MIN_KWP) return { ...base, stufe: "pruefen", text: "Knapp unter der Größe, ab der wir Freiflächenanlagen planen (rund 500 kWp). Interessant, wenn Nachbarflächen dazukommen oder ein Betrieb in der Nähe den Strom nutzt." };
  return { ...base, stufe: "gut", text: "Die Fläche reicht für einen Solarpark in einer wirtschaftlich sinnvollen Größe." };
}

function netzKriterium(abstandKm, kwp) {
  const n = netzEinschaetzung(abstandKm, kwp);
  const stufe = n.stufe === "kritisch" ? "erschwert" : n.stufe;
  return { id: "netz", label: "Weg zum Netz", stufe, text: `${n.text} Freie Kapazität bestätigt nur der Netzbetreiber.` };
}

function gelaendeKriterium(ausrichtung, neigung) {
  const base = { id: "gelaende", label: "Hang & Ausrichtung" };
  const g = Math.max(0, Number(neigung) || 0);
  if (ausrichtung === "eben" || g < 3) return { ...base, stufe: "gut", text: "Ebene Flächen lassen sich einfach und flexibel belegen." };
  if (ausrichtung === "nord") {
    if (g <= 5) return { ...base, stufe: "pruefen", text: "Ein leichter Nordhang ist machbar, braucht aber größere Reihenabstände – es passt weniger Leistung auf die Fläche." };
    if (g <= 12) return { ...base, stufe: "erschwert", text: "Am Nordhang verschatten sich die Modulreihen gegenseitig stark; Ertrag je Hektar und Wirtschaftlichkeit sinken deutlich." };
    return { ...base, stufe: "kritisch", text: "Ein steiler Nordhang ist für Photovoltaik praktisch ungeeignet." };
  }
  const [gutBis, pruefBis] = ausrichtung === "ostwest" ? [10, 20] : [15, 25];
  if (g <= gutBis) return { ...base, stufe: "gut", text: ausrichtung === "ostwest" ? "Ost- oder Westhang mit moderater Neigung – gut belegbar, Ertrag etwas unter einer Südfläche." : "Süd- bis Südost/Südwest-Lage – ideal für den Ertrag." };
  if (g <= pruefBis) return { ...base, stufe: "pruefen", text: "Die Hangneigung macht Aufständerung und Bau aufwendiger (Gründung, Befahrbarkeit, Erosion)." };
  return { ...base, stufe: "erschwert", text: "Sehr steil: Bau, Pflege und Erosionsschutz werden teuer, Gutachten zu Standsicherheit sind wahrscheinlich." };
}

/**
 * Pachtspanne für die Fläche.
 * Belegt nur für landwirtschaftliche Flächen (Acker, Wiese, bestehende PV-Widmung im Grünland).
 * @returns {{belegt: boolean, jeHaVon?: number, jeHaBis?: number, jahrVon?: number, jahrBis?: number, agrar?: number, agrarLabel?: string, faktorVon?: number, faktorBis?: number, hinweis: string, quellen: object[]}}
 */
export function pachtSpanne({ hektar, widmung }) {
  const ha = Math.max(Number(hektar) || 0, 0);
  if (!["acker", "wiese", "pv"].includes(widmung)) {
    return {
      belegt: false,
      hinweis: "Richtwert – Quelle offen. Für diese Flächenart haben wir keine veröffentlichte Pachtspanne einer unabhängigen Stelle gefunden. Pacht oder Kaufpreis werden hier individuell verhandelt.",
      quellen: [],
    };
  }
  const agrar = widmung === "acker" ? PACHT_BELEG.ackerland : PACHT_BELEG.dauergruenland;
  return {
    belegt: true,
    jeHaVon: PACHT_BELEG.pvVon,
    jeHaBis: PACHT_BELEG.pvBis,
    jahrVon: ha * PACHT_BELEG.pvVon,
    jahrBis: ha * PACHT_BELEG.pvBis,
    agrar,
    agrarLabel: widmung === "acker" ? "Ackerland" : "Dauergrünland",
    faktorVon: PACHT_BELEG.pvVon / agrar,
    faktorBis: PACHT_BELEG.pvBis / agrar,
    hinweis: `Durchschnitt der gebotenen Pachten laut Landwirtschaftskammern Steiermark und Kärnten (${PACHT_BELEG.pvJahr}). Angebote von heute können abweichen – nach Lage, Netzanschluss, Förderung und Vertragsgestaltung.`,
    quellen: [PACHT_QUELLEN.lkSteiermark, PACHT_QUELLEN.lkKaernten, PACHT_QUELLEN.statistik],
  };
}

/**
 * Flächen-Check.
 * @param {object} e
 * @param {number} e.hektar       Fläche in ha
 * @param {string} e.widmung      id aus WIDMUNGEN
 * @param {number} e.netzKm       Entfernung zum möglichen Netzanschlusspunkt in km
 * @param {number} e.neigung      Hangneigung in Grad
 * @param {string} e.ausrichtung  id aus AUSRICHTUNGEN
 * @param {string} e.bundesland   Slug aus LAENDER
 */
export function pruefeFlaeche({ hektar, widmung = "acker", netzKm = 1, neigung = 0, ausrichtung = "eben", bundesland = "oberoesterreich" }) {
  const land = landFuerSlug(bundesland) || LAENDER[0];
  const ha = Math.max(Number(hektar) || 0, 0);
  const kwp = ha * PACHT.konzepte[0].kwpProHa;

  const kriterien = [
    widmungKriterium(land, widmung, ha),
    groesseKriterium(kwp),
    netzKriterium(Math.max(Number(netzKm) || 0, 0), kwp),
    gelaendeKriterium(ausrichtung, neigung),
  ];

  const summe = kriterien.reduce((s, k) => s + STUFEN[k.stufe].gewicht, 0);
  const ampel = kriterien.some((k) => k.stufe === "kritisch") ? "rot" : summe <= 1 ? "gruen" : "gelb";

  return {
    ampel,
    punkte: summe,
    kriterien,
    land,
    hektar: ha,
    kwp,
    kwpProHa: PACHT.konzepte[0].kwpProHa,
    pacht: pachtSpanne({ hektar: ha, widmung }),
    // EAG: −25 % auf Investitionszuschuss/Marktprämie auf Agrar- und Grünland (außer Agri-PV)
    eagAbschlag: ["acker", "wiese", "pv"].includes(widmung),
  };
}
