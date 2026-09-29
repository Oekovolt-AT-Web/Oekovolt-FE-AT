// src/lib/rechner/gewerbepv.js
//
// Gewerbe-PV-Rechner (/rechner/gewerbe-pv): „Was bringt Ihr Hallendach?“
//
// Reine Rechenfunktionen ohne React und ohne Pfad-Aliase (per Node prüfbar).
// Baut auf denselben Bausteinen auf wie der Solarrechner (berechne() mit
// zielgruppe "gewerbe"): stündliche Jahressimulation mit Betriebs-Lastprofil
// (jahresreihen/simuliere/betriebsLast aus ./profile.js), Netto-Preise und
// Betriebskosten aus src/data/solarrechner.js, Einspeise-Rechensatz aus
// src/data/einspeiseverguetung.js. Unterschiede zu berechne():
//   - standortgenauer Ertrag (PVGIS je Ort, src/data/regionen-pvgis.json – wird
//     vom Aufrufer als { sued35, ostwest15, flach10 } übergeben),
//   - Dacharten statt Ausrichtung/Neigung, Eingabe über Dachfläche möglich,
//   - Betrachtung 25 Jahre, Kauf ODER Leasing, IRR, IFB-Steuereffekt separat,
//   - Tagesprofil Erzeugung vs. Last (Sommer/Winter), TOR-Typ, EAG-Kategorie.
// Alle Beträge NETTO (Vorsteuerabzug). Stand: September 2026.

import { ANNAHMEN, preisProKwp, speicherPreisProKwh, strompreisGewerbe, betriebskostenProKwp, eagZuschuss } from "../../data/solarrechner.js";
import { VERGUETUNG } from "../../data/einspeiseverguetung.js";
import { jahresreihen, simuliere, TAGE_MONAT } from "./profile.js";

/** Rechenannahmen, die nur dieser Rechner nutzt (Richtwerte, im UI offengelegt). */
export const GEWERBE_PV = {
  jahre: 25, // Betrachtungszeitraum (Modul-Leistungsgarantien typ. 25–30 Jahre)
  // Dacharten: Flächenbedarf je kWp (Dachfläche inkl. Rand- und Reihenabständen,
  // Richtwerte) und Ertragsbasis aus PVGIS für den gewählten Ort.
  //  - Ost-West aufgeständert: 7 m²/kWp (wie Solarrechner, qmProKwpFlachdach), PVGIS Ost-West 15°
  //  - Süd aufgeständert: größere Reihenabstände gegen Eigenverschattung → 10 m²/kWp, PVGIS Süd 10°
  //  - Trapezblech dachparallel: 5 m²/kWp (qmProKwp), flach geneigt, Ausrichtung je nach Halle
  //    → Mittel aus PVGIS Süd 10° und Ost-West 15°
  //  - Sheddach: nur die südgeneigten Flächen der Sheds werden belegt → rund 10 m² Grundfläche
  //    je kWp; Ertrag PVGIS Süd 35° mit 3 % Abschlag für Verschattung durch den Nachbar-Shed
  dacharten: [
    { id: "ost-west", label: "Flachdach Ost-West", sub: "aufgeständert", qmProKwp: ANNAHMEN.qmProKwpFlachdach, ertrag: (e) => e.ostwest15 },
    { id: "sued", label: "Flachdach Süd", sub: "aufgeständert", qmProKwp: 10, ertrag: (e) => e.flach10 },
    { id: "trapez", label: "Trapezblech", sub: "dachparallel", qmProKwp: ANNAHMEN.qmProKwp, ertrag: (e) => (e.flach10 + e.ostwest15) / 2 },
    { id: "shed", label: "Sheddach", sub: "Südflächen", qmProKwp: 10, ertrag: (e) => e.sued35 * 0.97 },
  ],
  // Leasing: Beispielwerte, frei einstellbar – KEINE Konditionen eines Finanzierungspartners
  leasingZinsStandard: 0.05,
  leasingLaufzeitStandard: 10,
  // TOR Stromerzeugungsanlagen (E-Control): Typ A 0,8 kW bis < 250 kW, Typ B 250 kW bis < 35 MW
  torGrenzeTypB: 250,
};

const dachart = (id) => GEWERBE_PV.dacharten.find((d) => d.id === id) || GEWERBE_PV.dacharten[0];

/** Anteilig gemischter Einspeise-Rechensatz in ct/kWh (wie mischSatz im Solarrechner). */
export function einspeiseSatzCt(kwp) {
  if (!(kwp > 0)) return VERGUETUNG.saetze[0].teileinspeisung;
  let summe = 0;
  for (const s of VERGUETUNG.saetze) summe += Math.max(0, Math.min(kwp, s.bis) - s.von) * s.teileinspeisung;
  const letzte = VERGUETUNG.saetze[VERGUETUNG.saetze.length - 1];
  if (kwp > letzte.bis) summe += (kwp - letzte.bis) * letzte.teileinspeisung;
  return Math.round((summe / kwp) * 100) / 100;
}

/** Richtwert vermeidbarer Arbeitspreis netto in ct/kWh nach Jahresverbrauch (Eurostat-basiert). */
export const arbeitspreisRichtwertCt = (kwh) => Math.round(strompreisGewerbe(kwh) * 1000) / 10;

/** Spezifischer Ertrag kWh/kWp für Dachart und Standort. */
export function spezifischerErtrag(dachartId, standort) {
  return Math.round(dachart(dachartId).ertrag(standort));
}

/** kWp aus Dachfläche (m²) für eine Dachart. */
export const kwpAusFlaeche = (qm, dachartId) => qm / dachart(dachartId).qmProKwp;

/** TOR-Typ nach Maximalkapazität (hier ≈ kWp angenommen). */
export function torTyp(kw) {
  if (kw < 0.8) return { typ: "–", text: "unter 0,8 kW keine Stromerzeugungsanlage im Sinne der TOR" };
  if (kw < 250) return { typ: "A", text: "0,8 kW bis unter 250 kW" };
  if (kw < 35000) return { typ: "B", text: "250 kW bis unter 35 MW – erweiterte Anforderungen, meist Parkregler" };
  if (kw < 50000) return { typ: "C", text: "35 MW bis unter 50 MW" };
  return { typ: "D", text: "ab 50 MW oder Anschluss ab 110 kV" };
}

/** EAG-Kategorie nach § 5 EAG-IZV 2026 (Anlagengröße). */
export function eagKategorie(kwp) {
  const kat = ANNAHMEN.eagInvestitionszuschuss.kategorien.find((k) => kwp <= k.bisKwp);
  // Über 1.000 kWp: anteilige Förderung bis 1.000 kWp (EAG-Abwicklungsstelle, FAQ 2026 Fragen 19 und 20)
  if (!kat) {
    const d = ANNAHMEN.eagInvestitionszuschuss.kategorien.find((k) => k.id === "D");
    return { id: "D", eurProKwp: d?.eurProKwp, anteiligBisKwp: 1000, text: `Kategorie D, anteilig bis 1.000 kWp gefördert (höchstens ${d?.eurProKwp} €/kWp), alternativ Marktprämie` };
  }
  const von = { A: "bis 10 kWp", B: "über 10 bis 20 kWp", C: "über 20 bis 100 kWp", D: "über 100 bis 1.000 kWp" }[kat.id];
  return { id: kat.id, eurProKwp: kat.eurProKwp, text: `Kategorie ${kat.id} (${von}), ${kat.id === "C" || kat.id === "D" ? "höchstens " : ""}${kat.eurProKwp} €/kWp` };
}

/** Annuität (Rate je Jahr) für Betrag, Zins und Laufzeit. */
export function annuitaet(betrag, zins, jahre) {
  if (!(betrag > 0) || !(jahre > 0)) return 0;
  if (!(zins > 0)) return betrag / jahre;
  const q = Math.pow(1 + zins, jahre);
  return (betrag * zins * q) / (q - 1);
}

/** Interner Zinsfuß (IRR) per Bisektion; null, wenn nicht bestimmbar. */
export function irr(zahlungen) {
  const npv = (r) => zahlungen.reduce((s, z, t) => s + z / Math.pow(1 + r, t), 0);
  let lo = -0.9;
  let hi = 1.5;
  let fLo = npv(lo);
  const fHi = npv(hi);
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi) || fLo * fHi > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const f = npv(mid);
    if (Math.abs(f) < 1e-6) return mid;
    if (f * fLo > 0) {
      lo = mid;
      fLo = f;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Durchschnittlicher Tagesverlauf (kW je Stunde) eines Monats aus den Jahresreihen:
 * PV über alle Tage, Last über die Betriebstage.
 */
function tagesprofil(reihen, monat, betriebstage) {
  const pv = new Array(24).fill(0);
  const last = new Array(24).fill(0);
  let start = 0;
  let tagImJahr = 0;
  for (let m = 0; m < monat; m++) {
    start += TAGE_MONAT[m] * 24;
    tagImJahr += TAGE_MONAT[m];
  }
  let nPv = 0;
  let nLast = 0;
  for (let d = 0; d < TAGE_MONAT[monat]; d++) {
    const wochentag = (3 + tagImJahr + d) % 7; // 1.1.2026 = Donnerstag (Mo = 0), wie profile.js
    const arbeitstag = wochentag < betriebstage;
    nPv++;
    if (arbeitstag) nLast++;
    for (let h = 0; h < 24; h++) {
      const i = start + d * 24 + h;
      pv[h] += reihen.pv[i];
      if (arbeitstag) last[h] += reihen.betrieb ? reihen.betrieb[i] : 0;
    }
  }
  return { pv: pv.map((v) => v / nPv), last: last.map((v) => v / Math.max(nLast, 1)) };
}

/**
 * Hauptberechnung.
 * @param {object} e
 * @param {number} e.kwp              Anlagengröße (kWp)
 * @param {string} e.dachart          id aus GEWERBE_PV.dacharten
 * @param {object} e.standort         { sued35, ostwest15, flach10 } kWh/kWp (PVGIS)
 * @param {number} e.verbrauchKwh     Jahresverbrauch
 * @param {"gewerbe"|"landwirtschaft"} [e.typ]
 * @param {5|6|7} [e.betriebstage]
 * @param {1|2|3} [e.schichten]
 * @param {number} [e.arbeitspreisCt] vermeidbarer Arbeitspreis netto (ct/kWh); Standard: Richtwert
 * @param {number} [e.einspeiseCt]    Einspeiseerlös (ct/kWh); Standard: Rechensatz OeMAG-Marktpreis
 * @param {number} [e.speicherKwh]
 * @param {"kauf"|"leasing"} [e.finanzierung]
 * @param {number} [e.leasingZins]    z. B. 0.05
 * @param {number} [e.leasingJahre]
 * @param {boolean} [e.eag]           EAG-Investitionszuschuss (Höchstsätze) abziehen
 * @param {boolean} [e.ifb]           IFB-Steuereffekt (nur Kauf) im Jahr 1 berücksichtigen
 * @param {number} [e.preissteigerung]
 * @param {boolean} [e.profil]        Tagesprofile Sommer/Winter mitliefern (Standard true)
 */
export function rechneGewerbePv({
  kwp,
  dachart: dachartId = "ost-west",
  standort,
  verbrauchKwh,
  typ = "gewerbe",
  betriebstage = 5,
  schichten = 1,
  arbeitspreisCt,
  einspeiseCt,
  speicherKwh = 0,
  finanzierung = "kauf",
  leasingZins = GEWERBE_PV.leasingZinsStandard,
  leasingJahre = GEWERBE_PV.leasingLaufzeitStandard,
  eag = false,
  ifb = true,
  preissteigerung = ANNAHMEN.strompreisSteigerung,
  profil = true,
}) {
  const A = ANNAHMEN;
  const leistung = Math.max(Number(kwp) || 0, 1);
  const verbrauch = Math.max(Number(verbrauchKwh) || 0, 1);
  const speicher = Math.max(Number(speicherKwh) || 0, 0);
  const d = dachart(dachartId);
  const spez = d.ertrag(standort);
  const tage = typ === "landwirtschaft" ? 7 : betriebstage;

  // --- Energie: stündliche Jahressimulation ---
  const reihen = jahresreihen({ kwp: leistung, ertragProKwp: spez, betrieb: { kwh: verbrauch, typ, betriebstage: tage, schichten } });
  const ohne = simuliere(reihen, 0);
  const sim = speicher > 0 ? simuliere(reihen, speicher, { leistungKw: Math.max(speicher * A.gewerbeSpeicherCRate, 5) }) : ohne;
  const jahresertrag = leistung * spez;
  const eigenverbrauch = Math.min(sim.autark, verbrauch);
  const einspeisung = Math.max(sim.einspeisung, 0);
  const eigenverbrauchsquote = jahresertrag > 0 ? eigenverbrauch / jahresertrag : 0;
  const autarkie = Math.min(eigenverbrauch / verbrauch, 1);

  // --- Geld (Jahr 1, netto) ---
  const preisCt = Number.isFinite(arbeitspreisCt) ? arbeitspreisCt : strompreisGewerbe(verbrauch) * 100;
  const satzCt = Number.isFinite(einspeiseCt) ? einspeiseCt : einspeiseSatzCt(leistung);
  const ersparnis = (eigenverbrauch * preisCt) / 100;
  const einspeiseErloes = (einspeisung * satzCt) / 100;
  const betriebskosten = leistung * betriebskostenProKwp(leistung, "gewerbe");
  const nutzenJahr1 = ersparnis + einspeiseErloes - betriebskosten;

  // --- Investition ---
  const anlagenpreis = leistung * preisProKwp(leistung, "gewerbe");
  const speicherpreis = speicher * speicherPreisProKwh(speicher, "gewerbe");
  const zuschuss = eag ? eagZuschuss(leistung, speicher) : { kategorie: null, pv: 0, speicher: 0, summe: 0 };
  const investition = Math.max(anlagenpreis + speicherpreis - zuschuss.summe, 0);

  // Investitionsfreibetrag: nur bei Kauf (bei Leasing meist beim Leasinggeber).
  // Bemessungsgrundlage = Anschaffungskosten abzüglich steuerfreier Zuschüsse, max. 1 Mio. €.
  const ifbBasis = Math.min(investition, A.ifb.bemessungsgrundlageMax);
  const ifbBetrag = ifbBasis * A.ifb.satzOeko;
  const ifbSteuereffekt = ifbBetrag * A.ifb.koest;
  const ifbAktiv = ifb && finanzierung === "kauf";

  // --- Leasing ---
  const leasing = finanzierung === "leasing";
  const rate = leasing ? annuitaet(investition, leasingZins, leasingJahre) : 0;

  // --- Cashflow über 25 Jahre ---
  const jahre = GEWERBE_PV.jahre;
  const start = leasing ? 0 : -investition;
  const cashflow = [{ jahr: 0, netto: start, kumuliert: start, ersparnis: 0, einspeisung: 0, betrieb: 0, ifb: 0, rate: 0 }];
  let kumuliert = start;
  let amortisation = leasing ? null : investition <= 0 ? 0 : null;
  let ersteNegativ = null;
  for (let t = 1; t <= jahre; t++) {
    const deg = Math.pow(1 - A.degradationProJahr, t - 1);
    const ersparnisT = ersparnis * deg * Math.pow(1 + preissteigerung, t - 1);
    const einspeisungT = einspeiseErloes * deg;
    const betriebT = betriebskosten * Math.pow(1 + A.betriebskostenSteigerung, t - 1);
    const ifbT = ifbAktiv && t === 1 ? ifbSteuereffekt : 0;
    const rateT = leasing && t <= leasingJahre ? rate : 0;
    const netto = ersparnisT + einspeisungT - betriebT + ifbT - rateT;
    const vorher = kumuliert;
    kumuliert += netto;
    if (!leasing && amortisation === null && vorher < 0 && kumuliert >= 0 && netto > 0) amortisation = t - 1 + -vorher / netto;
    if (leasing && netto < 0 && ersteNegativ === null) ersteNegativ = t;
    cashflow.push({ jahr: t, netto, kumuliert, ersparnis: ersparnisT, einspeisung: einspeisungT, betrieb: betriebT, ifb: ifbT, rate: rateT });
  }
  const zahlungen = cashflow.map((c) => c.netto);
  const irrWert = leasing ? null : irr(zahlungen);
  // IRR ohne IFB-Effekt zum Vergleich (Steuereffekt separat ausgewiesen)
  const irrOhneIfb = !leasing && ifbAktiv ? irr(zahlungen.map((z, t) => (t === 1 ? z - ifbSteuereffekt : z))) : irrWert;

  const tor = torTyp(leistung);
  const kat = eagKategorie(leistung);

  return {
    kwp: leistung,
    dachart: d.id,
    dachartLabel: `${d.label} (${d.sub})`,
    qmProKwp: d.qmProKwp,
    flaecheQm: leistung * d.qmProKwp,
    spezifischerErtrag: spez,
    jahresertrag,
    eigenverbrauch,
    einspeisung,
    netzbezug: Math.max(verbrauch - eigenverbrauch, 0),
    eigenverbrauchsquote,
    autarkie,
    ohneSpeicher: { eigenverbrauchsquote: ohne.eigenverbrauchsquote, autarkie: Math.min(ohne.autark / verbrauch, 1) },
    arbeitspreisCt: preisCt,
    einspeiseCt: satzCt,
    ersparnis,
    einspeiseErloes,
    betriebskosten,
    nutzenJahr1,
    anlagenpreis,
    speicherpreis,
    zuschuss,
    investition,
    ifb: { aktiv: ifbAktiv, satz: A.ifb.satzOeko, basis: ifbBasis, betrag: ifbBetrag, steuereffekt: ifbSteuereffekt, koest: A.ifb.koest },
    leasing: leasing ? { rate, zins: leasingZins, jahre: leasingJahre, ersteNegativ } : null,
    cashflow,
    amortisation,
    irr: irrWert,
    irrOhneIfb,
    summe: kumuliert,
    jahre,
    co2Tonnen: (jahresertrag * A.co2KgProKwh) / 1000,
    tor,
    eag: kat,
    oemagMoeglich: leistung < VERGUETUNG.marktpreis.anlagenGrenzeKwp,
    tagesprofil: profil ? { sommer: tagesprofil(reihen, 6, tage), winter: tagesprofil(reihen, 0, tage) } : null,
  };
}

/** Voreinstellungen für typische Betriebe (Richtwerte, keine Kundendaten). */
export const GEWERBE_PRESETS = [
  { id: "logistik", label: "Logistikhalle", flaeche: 6000, dachart: "ost-west", verbrauch: 450000, typ: "gewerbe", betriebstage: 6, schichten: 2, speicher: 0 },
  { id: "metall", label: "Metallbetrieb 2-Schicht", flaeche: 6000, dachart: "trapez", verbrauch: 1200000, typ: "gewerbe", betriebstage: 5, schichten: 2, speicher: 0 },
  { id: "kuehlung", label: "Lebensmittelhandel / Kühlung", flaeche: 2500, dachart: "sued", verbrauch: 550000, typ: "gewerbe", betriebstage: 7, schichten: 3, speicher: 0 },
  { id: "hotel", label: "Hotel", flaeche: 1400, dachart: "ost-west", verbrauch: 600000, typ: "gewerbe", betriebstage: 7, schichten: 3, speicher: 100 },
  { id: "milchvieh", label: "Landwirtschaft Milchvieh", flaeche: 800, dachart: "trapez", verbrauch: 90000, typ: "landwirtschaft", betriebstage: 7, schichten: 1, speicher: 50 },
];
