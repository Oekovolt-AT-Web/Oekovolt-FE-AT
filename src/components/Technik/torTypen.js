// Typeinteilung von Stromerzeugungsanlagen in Österreich (RfG-Schwellenwert-V der
// E-Control) mit Regelwerk und wesentlichen Anforderungen – gemeinsame Datenquelle
// für den TOR-Typ-Finder (Client) und die Übersichtstabelle (Server).

export const TYPEN = {
  A: {
    grenze: "≥ 0,8 kW bis < 250 kW",
    netz: "< 110 kV",
    regelwerk: "TOR Stromerzeugungsanlagen Typ A, V1.4 (gültig ab 01.06.2026)",
    anforderungen: [
      "Wirkleistungsbeendigung über Eingangsport binnen 5 s",
      "bei dynamischer Vorgabe nach § 76 ElWG digitale Schnittstelle (OpenADR), Sollwert in 1 min, Rückfallfunktion",
      "Blindleistungsverfahren nach Netzanschlussvertrag",
      "P(U) bei Umrichtern im NS-Netz standardmäßig aktiv",
    ],
  },
  B: {
    grenze: "≥ 250 kW bis < 35 MW",
    netz: "< 110 kV",
    regelwerk: "TOR Stromerzeugungsanlagen Typ B, V1.3 (gültig ab 01.07.2024)",
    anforderungen: [
      "Wirkleistungsvorgabe in bis zu 4 Stufen (< 1 MW), Sollwert bei Umrichtern in 1 min",
      "Blindleistungsbereich II (cos φ 0,925 unter- bis übererregt)",
      "ab 1 MW Fernwirkschnittstelle nach Wahl des Netzbetreibers, Online-Sollwerte und Umschaltung des Q-Verfahrens",
      "FRT und – im MS-Netz auf Verlangen – dynamische Blindstromstützung",
    ],
  },
  C: {
    grenze: "≥ 35 MW bis < 50 MW",
    netz: "< 110 kV",
    regelwerk: "TOR Erzeuger Typ C",
    anforderungen: [
      "zusätzlich u. a. frequenzabhängiger Modus (FSM) und LFSM-U",
      "erweiterte Spannungs- und Blindleistungsregelung",
      "Echtzeit-Datenaustausch mit Netzbetreiber und Übertragungsnetzbetreiber",
    ],
  },
  D: {
    grenze: "≥ 50 MW",
    netz: "oder Netzanschluss ≥ 110 kV",
    regelwerk: "TOR Erzeuger Typ D",
    anforderungen: ["Anforderungen wie Typ C", "dazu erweiterte Robustheits- und Stabilitätsanforderungen", "Abstimmung mit dem Übertragungsnetzbetreiber (APG)"],
  },
};

// ---------------------------------------------------------------------------
// Gemeinsame Typ-Einstufung nach AC-Maximalkapazität (Welle A, Paket A10)
// Genutzt von TOR-Typ-Finder, Gewerbe-PV-Rechner (src/lib/rechner/gewerbepv.js)
// und Pacht-Rechner (src/lib/rechner/pacht.js) – eine Staffel statt mehrerer.
// Reines Modul ohne React und ohne Pfad-Aliase (per Node prüfbar).
// ---------------------------------------------------------------------------

/** Untergrenzen der Typen in kW (RfG-Schwellenwert-V; Netzanschluss < 110 kV). */
export const TOR_GRENZEN = { A: 0.8, B: 250, C: 35000, D: 50000 };

/**
 * Annahme für den Vorschlag der Wechselrichterleistung: DC/AC-Verhältnis 1,15
 * (kWp ÷ 1,15 = kVA AC). Offengelegt im Rechner, vom Nutzer überschreibbar.
 */
export const DC_AC_VORSCHLAG = 1.15;

/** Band um die Typ-B-Grenze, in dem die Auslegung bewusst geprüft werden sollte (kW). */
export const KNAPP_BAND = { von: 230, bis: 270 };

export const KNAPP_HINWEIS = "Knapp an der Typ-B-Grenze: Auslegung bewusst prüfen";

/** Vorschlag Wechselrichterleistung AC (kVA) aus der Modulleistung, auf 1 kVA gerundet. */
export function acVorschlag(kwp) {
  const k = Number(kwp);
  if (!(k > 0)) return 0;
  return Math.max(1, Math.round(k / DC_AC_VORSCHLAG));
}

/**
 * Summe der AC-Maximalkapazitäten am Netzanschlusspunkt: Wechselrichter der neuen
 * Anlage + Speicher-Wechselrichter + bestehende Erzeugung (alles in kW bzw. kVA).
 */
export function acSumme({ wrKva = 0, speicherKva = 0, bestandKw = 0 } = {}) {
  const n = (v) => Math.max(Number(v) || 0, 0);
  return n(wrKva) + n(speicherKva) + n(bestandKw);
}

/**
 * TOR-Typ nach AC-Maximalkapazität der Gesamtanordnung.
 * @param {number} acKw   Summe der AC-Maximalkapazitäten in kW (siehe acSumme)
 * @param {{hochspannung?: boolean}} [o]  Netzanschluss ≥ 110 kV → immer Typ D
 * @returns {{ typ: "A"|"B"|"C"|"D"|"–", text: string, acKw: number, knapp: boolean, hinweis: string|null }}
 */
export function torTyp(acKw, { hochspannung = false } = {}) {
  const kw = Math.max(Number(acKw) || 0, 0);
  const knapp = !hochspannung && kw >= KNAPP_BAND.von && kw <= KNAPP_BAND.bis;
  const basis = { acKw: kw, knapp, hinweis: knapp ? KNAPP_HINWEIS : null };
  if (hochspannung) return { ...basis, typ: "D", text: "Netzanschluss ab 110 kV – unabhängig von der Leistung" };
  if (kw < TOR_GRENZEN.A) return { ...basis, typ: "–", text: "unter 0,8 kW keine Stromerzeugungsanlage im Sinne der TOR" };
  if (kw < TOR_GRENZEN.B) return { ...basis, typ: "A", text: "0,8 kW bis unter 250 kW" };
  if (kw < TOR_GRENZEN.C) return { ...basis, typ: "B", text: "250 kW bis unter 35 MW – erweiterte Anforderungen, meist Parkregler" };
  if (kw < TOR_GRENZEN.D) return { ...basis, typ: "C", text: "35 MW bis unter 50 MW" };
  return { ...basis, typ: "D", text: "ab 50 MW oder Anschluss ab 110 kV" };
}

/**
 * Liest eine Zahl in österreichischer Schreibweise: Punkt als Tausendertrenner
 * („1.000“ = 1000, „12.500,5“ = 12500,5), Komma als Dezimaltrenner („2,5“).
 * Ein einzelner Punkt mit nicht genau drei Folgeziffern gilt als Dezimalpunkt („2.5“ = 2,5).
 * Leere oder ungültige Eingabe → NaN.
 */
export function liesZahlDe(text) {
  let t = String(text ?? "").trim().replace(/\s/g, "");
  if (t === "") return NaN;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  return /^-?\d*\.?\d+$/.test(t) || /^-?\d+\.$/.test(t) ? Number(t) : NaN;
}
