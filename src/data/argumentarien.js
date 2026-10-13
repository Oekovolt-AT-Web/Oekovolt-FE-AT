// src/data/argumentarien.js
//
// Entscheider-Mappe (Welle A, Paket A09): je Rolle im Betrieb bzw. in der Gemeinde ein A4-Kapitel im
// Druckbericht der Rechner (src/components/RechnerTeilen/Druckblatt.js). Die Kapitel arbeiten nur mit
// Zahlen, die der Rechner selbst liefert (bericht().mappe, siehe MAPPE_FELDER). Fehlt ein Wert, entfällt
// der Satz bzw. der Abschnitt – es werden keine Zahlen ergänzt oder geschätzt.
//
// Regeln: keine Spitzenstellungs- oder Umweltwerbung (Begriffe siehe MUSTER in scripts/werbeaussagen.test.mjs),
// CO₂ nur mit Zeitraum,
// Parkregler-Satz aus src/data/marke.js (Rechteklärung offen), Werbeaussagen nur über src/data/werbeaussagen.js.
// Reine Daten und Funktionen, ohne Browser- oder Node-Abhängigkeiten (auch in scripts/*.test.mjs nutzbar).

import { PARKREGLER_SATZ } from "@/data/marke";

export const ARGUMENTARIEN_STAND = "2026-10-12";

/** Rollen für „Für wen ist der Bericht?“ – Reihenfolge = Reihenfolge der Kapitel im Druck. */
export const MAPPE_ROLLEN = [
  { id: "gf", name: "Geschäftsführung" },
  { id: "cfo", name: "Finanzen/CFO" },
  { id: "technik", name: "Technik/Facility" },
  { id: "bank", name: "Bank" },
  { id: "esg", name: "ESG/Betriebsrat" },
  { id: "gemeinderat", name: "Gemeinderat" },
];

export const MAPPE_ROLLEN_IDS = MAPPE_ROLLEN.map((r) => r.id);

/** Standardauswahl: alle zum Segment passenden Rollen (Gemeinderat nur bei Gemeinden, GF/Bank nicht bei Gemeinden). */
export function standardRollen(segment) {
  if (segment === "gemeinde") return ["gemeinderat", "cfo", "technik", "esg"];
  return ["gf", "cfo", "technik", "bank", "esg"];
}

/** Nur bekannte Rollen, ohne Doppelte, in fester Reihenfolge. */
export function rollenBereinigen(liste) {
  const roh = new Set((Array.isArray(liste) ? liste : []).map((r) => String(r)));
  return MAPPE_ROLLEN_IDS.filter((id) => roh.has(id));
}

/**
 * Zahlen, die ein Rechner in bericht().mappe mitgeben kann (alle optional):
 *  investition (€ netto), amortisation (Jahre), jahre (Betrachtungszeitraum), irr / irrOhneIfb (Anteil 0–1),
 *  ifbAktiv (bool), lcoe / bezugspreis (ct/kWh), cashflow ([netto Jahr 1 … n] in €), kwp, jahresertragKwh,
 *  co2TonnenJahr (t je Betriebsjahr), netzebene (z. B. "7" oder "NE 6"), torTyp ("A"–"D"), speicherKwh,
 *  kapitaldienstJahr (€), ertragMethode (Text), stresstest ([{ szenario, irr, amortisation, summe }] aus A10).
 */
export const MAPPE_FELDER = ["investition", "amortisation", "jahre", "irr", "irrOhneIfb", "ifbAktiv", "lcoe", "bezugspreis", "cashflow", "kwp", "jahresertragKwh", "co2TonnenJahr", "netzebene", "torTyp", "speicherKwh", "kapitaldienstJahr", "ertragMethode", "stresstest"];

const zahl = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const kurz = (v, max = 80) => (typeof v === "string" || typeof v === "number" ? String(v).replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max) : "");

/** Übernimmt nur bekannte Felder mit gültigen Werten (Zahlen endlich, Texte gekürzt, Listen begrenzt). */
export function mappeBereinigen(roh) {
  if (!roh || typeof roh !== "object") return {};
  const m = {};
  for (const k of ["investition", "amortisation", "jahre", "irr", "irrOhneIfb", "lcoe", "bezugspreis", "kwp", "jahresertragKwh", "co2TonnenJahr", "speicherKwh", "kapitaldienstJahr"]) {
    const z = zahl(roh[k]);
    if (z !== null) m[k] = z;
  }
  if (typeof roh.ifbAktiv === "boolean") m.ifbAktiv = roh.ifbAktiv;
  for (const k of ["netzebene", "torTyp", "ertragMethode"]) {
    const t = kurz(roh[k], k === "ertragMethode" ? 160 : 20);
    if (t) m[k] = t;
  }
  if (Array.isArray(roh.cashflow)) {
    const cf = roh.cashflow.slice(0, 40).map(zahl);
    if (cf.length && cf.every((x) => x !== null)) m.cashflow = cf;
  }
  if (Array.isArray(roh.stresstest)) {
    const st = roh.stresstest
      .slice(0, 8)
      .map((s) => ({ szenario: kurz(s?.szenario, 80), irr: zahl(s?.irr), amortisation: zahl(s?.amortisation), summe: zahl(s?.summe) }))
      .filter((s) => s.szenario && (s.irr !== null || s.amortisation !== null || s.summe !== null));
    if (st.length) m.stresstest = st;
  }
  return m;
}

/* ------------------------------------------------------------------ Formate */

const de = (n, stellen = 0) => n.toLocaleString("de-AT", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
export const euro = (n) => `${de(Math.round(n))} €`;
const prozent = (anteil) => `${de(anteil * 100, 1)} %`;
const jahreText = (n) => `${de(n, 1)} Jahre`;
const ct = (n) => `${de(n, 1)} ct/kWh`;

/* ---------------------------------------------------------------- Kapitel */

/**
 * Baut das Kapitel einer Rolle. Rückgabe: { id, titel, absaetze: string[], zeilen: [label, wert, zusatz][],
 * tabelle?: { kopf: string[], reihen: string[][] }, punkte: string[] } – leere Teile entfallen beim Druck.
 * @param {string} rolle  id aus MAPPE_ROLLEN
 * @param {object} p      { mappe (bereinigt), name (Rechnername), segment }
 */
export function kapitel(rolle, { mappe = {}, name = "Rechner" } = {}) {
  const m = mappe;
  const jahre = m.jahre || null;
  const titel = MAPPE_ROLLEN.find((r) => r.id === rolle)?.name || "";

  if (rolle === "gf") {
    const kern = [];
    kern.push(jahre ? `Ihr Dach senkt die Energiekosten planbar über ${de(jahre)} Jahre Betrachtungszeitraum.` : "Ihr Dach senkt die Energiekosten planbar über die gesamte Betriebsdauer.");
    if (m.investition != null) kern.push(`Kapitalbindung ${euro(m.investition)}${m.amortisation != null ? `, Amortisation ${jahreText(m.amortisation)}, danach Überschuss` : ""}.`);
    kern.push(m.stresstest ? "Das Risiko liegt bei Strompreis und Ertrag; beides zeigt der Stresstest im Kapitel Finanzen." : "Das Risiko liegt bei Strompreis und Ertrag; die Annahmen dazu stehen am Ende des Berichts.");
    return {
      id: rolle,
      titel: `Für die ${titel}`,
      absaetze: [kern.join(" ")],
      zeilen: [
        m.investition != null && ["Investition netto", euro(m.investition)],
        m.amortisation != null && ["Amortisation", jahreText(m.amortisation)],
        m.irr != null && ["Rendite (IRR)", prozent(m.irr), "vor Steuern"],
        m.kwp != null && ["Anlagengröße", `${de(m.kwp)} kWp`],
      ].filter(Boolean),
      punkte: ["Entscheidung vorbereiten: Dachdaten, Lastgang und Netzzusage klären – die nächsten Schritte stehen am Ende des Berichts."],
    };
  }

  if (rolle === "cfo") {
    const zeilen = [
      m.investition != null && ["Investition netto", euro(m.investition)],
      m.irr != null && [m.ifbAktiv ? "IRR mit Investitionsfreibetrag (IFB)" : "IRR", prozent(m.irr), "vor Steuern"],
      m.irrOhneIfb != null && ["IRR ohne IFB", prozent(m.irrOhneIfb), "vor Steuern"],
      m.lcoe != null && ["Stromgestehungskosten (LCOE)", ct(m.lcoe)],
      m.bezugspreis != null && ["Bezugspreis (vermeidbar)", ct(m.bezugspreis), m.lcoe != null ? `Abstand ${ct(m.bezugspreis - m.lcoe)}` : ""],
    ].filter(Boolean);
    let tabelle = null;
    if (m.cashflow?.length) {
      let kum = -(m.investition || 0);
      const reihen = m.cashflow.map((netto, i) => {
        kum += netto;
        return [String(i + 1), euro(netto), m.investition != null ? euro(kum) : "–"];
      });
      tabelle = { kopf: ["Jahr", "Cashflow netto", "kumuliert"], reihen };
    }
    const stress = m.stresstest
      ? {
          kopf: ["Szenario", "IRR", "Amortisation"],
          reihen: m.stresstest.map((s) => [s.szenario, s.irr != null ? prozent(s.irr) : "–", s.amortisation != null ? jahreText(s.amortisation) : "–"]),
        }
      : null;
    return {
      id: rolle,
      titel: `Für ${titel}`,
      absaetze: [
        `Cashflow über ${jahre ? `${de(jahre)} Jahre` : "den Betrachtungszeitraum"}, Rendite und Stromgestehungskosten aus dem ${name}. Alle Werte netto, vor Steuern, ohne Finanzierungskosten, sofern nicht anders angegeben.`,
      ],
      zeilen,
      tabelle,
      stresstest: stress,
      punkte: ["Steuerliche Fragen (IFB, Abschreibung, Vorsteuer) mit Ihrer Steuerberatung klären."],
    };
  }

  if (rolle === "technik") {
    return {
      id: rolle,
      titel: `Für ${titel}`,
      absaetze: ["Technische Eckpunkte für Planung, Netzanschluss und Betrieb. Endgültige Werte legen Netzbetreiber, Statik und Planung fest."],
      zeilen: [
        m.kwp != null && ["Anlagengröße", `${de(m.kwp)} kWp`],
        m.speicherKwh != null && m.speicherKwh > 0 && ["Speicher", `${de(m.speicherKwh)} kWh`],
        m.netzebene && ["Netzebene", m.netzebene],
        m.torTyp && ["TOR Erzeuger", `Typ ${m.torTyp}`, "Einstufung durch den Netzbetreiber"],
      ].filter(Boolean),
      punkte: [
        "Statik und Schneelast: Tragfähigkeit des Daches durch einen Tragwerksplaner prüfen lassen; Richtwerte zur Schneelast zeigt oekovolt.com/schneelast.",
        `Netzanschluss: Netzzugangsantrag mit Zählpunkt und Lastgang beim Netzbetreiber; Unterlagenliste unter oekovolt.com/netzanmeldung/checkliste.`,
        PARKREGLER_SATZ,
        "Prüfung nach Elektroschutzverordnung 2012 (ESV 2012): Erstprüfung vor Inbetriebnahme und wiederkehrende Prüfungen – das Intervall legt die Prüfperson nach Anlagenart und Nutzung fest; die PV-Anlage gehört in Ihren Prüfplan.",
      ],
    };
  }

  if (rolle === "bank") {
    return {
      id: rolle,
      titel: `Für die ${titel}`,
      absaetze: [
        m.ertragMethode
          ? `Ertragsprognose: ${m.jahresertragKwh != null ? `${de(Math.round(m.jahresertragKwh / 1000))} MWh im Jahr, ` : ""}Methode: ${m.ertragMethode}.`
          : `Ertragsprognose${m.jahresertragKwh != null ? `: ${de(Math.round(m.jahresertragKwh / 1000))} MWh im Jahr` : ""} aus Standortdaten und dem Rechenmodell des ${name} (Annahmen am Ende des Berichts).`,
      ],
      zeilen: [
        m.investition != null && ["Finanzierungsbedarf netto", euro(m.investition)],
        m.kapitaldienstJahr != null && ["Kapitaldienst pro Jahr", euro(m.kapitaldienstJahr)],
        m.cashflow?.length > 0 && ["Cashflow Jahr 1 (vor Kapitaldienst)", euro(m.cashflow[0])],
      ].filter(Boolean),
      punkte: [
        "Jahresabschlüsse der letzten zwei bis drei Jahre",
        "Aktuelle betriebswirtschaftliche Auswertung (BWA) bzw. Saldenliste",
        "Nachweis über die Dachnutzung (Eigentum oder Nutzungsvertrag)",
        "Netzzusage bzw. Stand beim Netzbetreiber",
        "Angebot mit Wirtschaftlichkeitsrechnung (erstellen wir)",
      ],
    };
  }

  if (rolle === "esg") {
    const co2 = m.co2TonnenJahr != null ? `Rechnerisch vermiedene Emissionen: ${de(m.co2TonnenJahr, m.co2TonnenJahr < 100 ? 1 : 0)} t CO₂ je Betriebsjahr (Rechenwert, Zeitraum: ein volles Betriebsjahr ab Inbetriebnahme).` : "";
    return {
      id: rolle,
      titel: `Für ${titel}`,
      absaetze: [
        [co2, "Für die Berichterstattung zählt der tatsächlich gemessene Eigenverbrauch im Berichtsjahr. Der Rechenwert ersetzt keine Bilanz nach GHG Protocol."].filter(Boolean).join(" "),
      ],
      zeilen: [],
      punkte: [
        "VSME (freiwilliger Standard für KMU) bzw. ESRS E1: Eigenerzeugung und Strombezug getrennt ausweisen (Scope 2 standort- und marktbasiert).",
        "Die Anlage senkt Emissionen, sie gleicht keine aus – im Bericht deshalb nur die Reduktion nennen, keine ausgeglichene Bilanz.",
        "Betriebsrat: Die Anlage ändert keine Arbeitsplätze; Montagezeiten und Zugänge stimmen wir mit der Betriebsleitung ab.",
      ],
    };
  }

  if (rolle === "gemeinderat") {
    return {
      id: rolle,
      titel: `Für den ${titel}`,
      absaetze: ["Grundlage für die Beratung im Gemeinderat: Liegenschaft, Wirtschaftlichkeit und Förderweg in Kurzform."],
      zeilen: [
        m.kwp != null && ["Anlagengröße", `${de(m.kwp)} kWp`],
        m.investition != null && ["Investition netto", euro(m.investition)],
        m.amortisation != null && ["Amortisation", jahreText(m.amortisation)],
      ].filter(Boolean),
      punkte: [
        "Liegenschaft: Dach bzw. Fläche, Eigentum, Zählpunkt und Verbrauch der Liegenschaft festhalten.",
        "Förderweg: Förderstelle und Antragszeitpunkt vor der Bestellung klären (Antrag meist vor Auftragsvergabe).",
        "Vergabeweg mit Ihrer Vergabestelle abstimmen.",
      ],
    };
  }

  return null;
}

/** Kapitel für die gewählten Rollen, in fester Reihenfolge, ohne leere. */
export function mappeKapitel(rollen, p) {
  return rollenBereinigen(rollen)
    .map((r) => kapitel(r, p))
    .filter(Boolean);
}

/** Fußzeile jedes Kapitels. */
export const MAPPE_FUSS = ["Kein Angebot – Richtwerte aus einem vereinfachten Rechenmodell.", "Steuerliche Fragen mit Ihrer Steuerberatung klären."];
