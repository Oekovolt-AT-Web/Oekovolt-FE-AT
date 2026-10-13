// src/lib/technik/netzvertraeglichkeit.js
//
// Vereinfachte Vorabschätzung der Spannungsänderung durch eine Erzeugungsanlage am
// Verknüpfungspunkt (reine Funktionen, ohne React – Test: scripts/technik.test.mjs).
//
// Formel (TOR D2 / D-A-CH-CZ-Regeln zur Beurteilung von Netzrückwirkungen):
//   Δu ≈ S_A / S_kV · cos(ψ_kV + φ)
//   S_A   Anschlussscheinleistung der Anlage (kVA)
//   S_kV  Kurzschlussleistung am Verknüpfungspunkt (MVA) – Auskunft des Netzbetreibers
//   ψ_kV  Netzimpedanzwinkel am Verknüpfungspunkt (Grad) – Auskunft des Netzbetreibers
//   φ     Phasenwinkel des Anlagenstroms; untererregt (induktiv, Blindleistung aufnehmend)
//         positiv, übererregt (kapazitiv) negativ. cos φ = 1 → φ = 0.
// Grenzwerte (Summe aller Erzeugungsanlagen, ungestörter Betrieb, gegenüber dem Zustand
// ohne Erzeugungsanlagen): 3 % im Niederspannungsnetz, 2 % im Mittelspannungsnetz.
// Der Netzbetreiber darf abweichende Werte vorgeben; verbindlich ist seine Prüfung.
//
// Alle Ergebnisse sind Richtwerte/Orientierung: die Formel vernachlässigt die
// Vorbelastung durch andere Anlagen, Lastfluss, Stufensteller und die Impedanz der
// Kundenanlage. Stand 10/2026.

export const GRENZEN = Object.freeze({
  NS: { grenzeProzent: 3, netz: "Niederspannung (NE 6/7)", quelle: "TOR D2, Spannungsänderung durch Erzeugungsanlagen im NS-Netz" },
  MS: { grenzeProzent: 2, netz: "Mittelspannung (NE 4/5)", quelle: "TOR D2, Spannungsänderung durch Erzeugungsanlagen im MS-Netz" },
});

/** Blindleistungsbereich nach TOR: Typ A cos φ 0,9; Typ B Bereich II cos φ 0,925 unter- bis übererregt. */
export const COS_PHI_MIN = Object.freeze({ A: 0.9, B: 0.925 });

/**
 * Neutrale Beispielbereiche zur Orientierung – KEIN Ersatz für die Auskunft des
 * Netzbetreibers. Größenordnungen typischer Anschlusssituationen (Richtwert); im
 * Werkzeug ausdrücklich als „Beispielbereich“ gekennzeichnet.
 */
export const BEISPIELBEREICHE = Object.freeze({
  NS: { skMva: [1, 20], psiGrad: [30, 70], hinweis: "Hausanschluss bis Niederspannungs-Hauptverteilung einer Trafostation" },
  MS: { skMva: [30, 500], psiGrad: [55, 85], hinweis: "Übergabestation am Mittelspannungsnetz" },
});

const GRAD = Math.PI / 180;
const rund = (x, n = 2) => Math.round(x * 10 ** n) / 10 ** n;

/** Phasenwinkel φ (Grad, untererregt positiv) aus cos φ und Erregungsart. */
export function phiGrad(cosPhi, erregung = "untererregt") {
  const c = Math.min(1, Math.max(0, Number(cosPhi)));
  const phi = Math.acos(c) / GRAD;
  return erregung === "uebererregt" ? -phi : phi;
}

/**
 * Spannungsänderung in Prozent.
 * @param {object} e  { sKva, skMva, psiGrad, cosPhi = 1, erregung = "untererregt" }
 * @returns {number} Δu in % (positiv = Spannungsanhebung)
 */
export function spannungsaenderung({ sKva, skMva, psiGrad, cosPhi = 1, erregung = "untererregt" }) {
  const s = Number(sKva);
  const sk = Number(skMva) * 1000;
  const psi = Number(psiGrad);
  if (!(s > 0) || !(sk > 0) || !Number.isFinite(psi)) return NaN;
  const phi = phiGrad(cosPhi, erregung);
  return (s / sk) * Math.cos((psi + phi) * GRAD) * 100;
}

/** Ampel gegen die Grenze: gruen ≤ 80 % der Grenze, gelb bis zur Grenze, rot darüber. */
export function ampel(deltaUProzent, netzebene = "NS") {
  const g = GRENZEN[netzebene] ?? GRENZEN.NS;
  const du = Number(deltaUProzent);
  if (!Number.isFinite(du)) return { stufe: "unbekannt", grenzeProzent: g.grenzeProzent, auslastung: NaN };
  const auslastung = du / g.grenzeProzent;
  const stufe = auslastung > 1 ? "rot" : auslastung > 0.8 ? "gelb" : "gruen";
  return { stufe, grenzeProzent: g.grenzeProzent, auslastung: rund(auslastung, 3) };
}

/**
 * Nötiger Verschiebungsfaktor (untererregt), damit Δu die Grenze einhält.
 * Rechnung: cos(ψ + φ) ≤ Grenze · S_kV / S_A → φ ≥ arccos(min(1, Grenze·S_kV/S_A)) − ψ.
 * @returns {{ noetig: boolean, cosPhi: number|null, phiGrad: number, imBereich: boolean, hinweis: string }}
 *   cosPhi null, wenn keine Blindleistung nötig ist (cos φ = 1 hält die Grenze bereits ein).
 *   imBereich: false, wenn der nötige cos φ unter dem TOR-Bereich (Typ B: 0,925) liegt.
 */
export function noetigerCosPhi({ sKva, skMva, psiGrad, netzebene = "NS", typ = "B" }) {
  const s = Number(sKva);
  const sk = Number(skMva) * 1000;
  const psi = Number(psiGrad);
  const g = (GRENZEN[netzebene] ?? GRENZEN.NS).grenzeProzent / 100;
  if (!(s > 0) || !(sk > 0) || !Number.isFinite(psi)) return { noetig: false, cosPhi: null, phiGrad: 0, imBereich: true, hinweis: "Eingaben unvollständig." };
  const ohne = (s / sk) * Math.cos(psi * GRAD);
  if (ohne <= g) return { noetig: false, cosPhi: null, phiGrad: 0, imBereich: true, hinweis: "Mit cos φ = 1 liegt die Spannungsänderung unter der Grenze." };
  const ziel = Math.min(1, (g * sk) / s);
  const phi = Math.acos(ziel) / GRAD - psi;
  const phiBegrenzt = Math.min(90, Math.max(0, phi));
  const cosPhi = rund(Math.cos(phiBegrenzt * GRAD), 3);
  const minimum = COS_PHI_MIN[typ] ?? COS_PHI_MIN.B;
  const imBereich = cosPhi >= minimum;
  return {
    noetig: true,
    cosPhi,
    phiGrad: rund(phiBegrenzt, 1),
    imBereich,
    hinweis: imBereich
      ? `Mit cos φ ≈ ${cosPhi.toLocaleString("de-AT", { minimumFractionDigits: 3 })} untererregt bleibt Δu unter ${g * 100} %.`
      : `Der nötige cos φ liegt unter dem TOR-Bereich (Typ ${typ}: ${minimum.toLocaleString("de-AT")}). Blindleistung allein reicht nicht – Anschlussleistung, Anschlusspunkt oder Netzverstärkung mit dem Netzbetreiber klären.`,
  };
}

/** Maximale Anschlussscheinleistung (kVA), die mit cos φ = 1 die Grenze einhält. */
export function maxScheinleistungKva({ skMva, psiGrad, netzebene = "NS" }) {
  const sk = Number(skMva) * 1000;
  const psi = Number(psiGrad);
  const g = (GRENZEN[netzebene] ?? GRENZEN.NS).grenzeProzent / 100;
  if (!(sk > 0) || !Number.isFinite(psi)) return NaN;
  const c = Math.cos(psi * GRAD);
  if (c <= 0) return Infinity;
  return rund((g * sk) / c, 1);
}

/**
 * Zeiger für das Diagramm (bezogen auf U_N = 1): Netzspannung ohne Anlage, Spannungsfall
 * über der Netzimpedanz (R- und X-Anteil) und resultierende Spannung am Verknüpfungspunkt.
 * Vereinfachung: Δu entspricht dem Längsanteil I·(R·cos φ + X·sin φ); der Queranteil
 * wird nur für die Darstellung mitgeführt.
 */
export function zeiger({ sKva, skMva, psiGrad, cosPhi = 1, erregung = "untererregt" }) {
  const s = Number(sKva);
  const sk = Number(skMva) * 1000;
  const psi = Number(psiGrad) * GRAD;
  if (!(s > 0) || !(sk > 0) || !Number.isFinite(psi)) return null;
  const phi = phiGrad(cosPhi, erregung) * GRAD;
  const z = 1 / sk; // Netzimpedanz bezogen (U_N = 1, S in gleicher Einheit wie S_k)
  const r = z * Math.cos(psi);
  const x = z * Math.sin(psi);
  const i = s; // Strombetrag bezogen (U = 1)
  const iw = i * Math.cos(phi); // Wirkanteil (Einspeisung)
  // Blindanteil im Erzeugerzählpfeilsystem: untererregt (φ > 0) → +i·sin φ, übererregt → −i·sin φ.
  // Damit ergibt der Längsanteil i·z·cos(ψ + φ) – identisch mit spannungsaenderung().
  const ib = i * Math.sin(phi);
  // ΔU = I·Z (komplex): (iw + j·ib)·(r + j·x)
  const dRe = iw * r - ib * x;
  const dIm = iw * x + ib * r;
  return {
    netz: { re: 1, im: 0 },
    deltaRe: dRe,
    deltaIm: dIm,
    laengs: dRe, // ≈ Δu (Längsspannungsfall)
    quer: dIm,
    vp: { re: 1 + dRe, im: dIm },
    strom: { re: iw / i, im: ib / i, phiGrad: rund(phi / GRAD, 1) },
    betragProzent: rund((Math.hypot(1 + dRe, dIm) - 1) * 100, 3),
  };
}

/** Gesamtergebnis für die Anzeige. */
export function bewerte(e) {
  const netzebene = e.netzebene === "MS" ? "MS" : "NS";
  const du = spannungsaenderung(e);
  return {
    netzebene,
    deltaUProzent: Number.isFinite(du) ? rund(du, 3) : NaN,
    ampel: ampel(du, netzebene),
    cosPhi: noetigerCosPhi({ ...e, netzebene }),
    maxKvaCosPhi1: maxScheinleistungKva({ ...e, netzebene }),
    zeiger: zeiger(e),
    grenze: GRENZEN[netzebene],
  };
}
