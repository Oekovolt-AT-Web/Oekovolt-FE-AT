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
// Gemeinsame TOR-Staffel nach AC-Maximalkapazität (auch TOR-Typ-Finder und Pacht-Rechner)
import { acSumme, acVorschlag, DC_AC_VORSCHLAG, torTyp } from "../../components/Technik/torTypen.js";

export { acVorschlag, DC_AC_VORSCHLAG, torTyp };

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

/** Mindestgröße für den EAG-Speicherzuschuss: 0,5 kWh je kWp (EAG-Abwicklungsstelle, FAQ 2026). */
export const EAG_SPEICHER_MIN_KWH_JE_KWP = 0.5;

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

/** Anlagengröße aus Dachfläche, auf 5 kWp gerundet – Startseiten-Rechner und Detailrechnung identisch. */
export const kwpAusDach = (qm, dachartId = "ost-west") => Math.max(5, Math.round(kwpAusFlaeche(qm, dachartId) / 5) * 5);

/** Schichtmodell → Betriebstage (Startseiten-Rechner; Übernahme in die Detailrechnung). */
export const BETRIEBSTAGE_AUS_SCHICHT = { 1: 5, 2: 5, 3: 7 };

/**
 * Eingaben des Startseiten-Rechners (HeroGewerbeRechner) für rechneGewerbePv:
 * Flachdach Ost-West aufgeständert (7 m²/kWp, PVGIS-Ertrag Ost-West 15°), ohne Speicher,
 * ohne EAG-Zuschuss und ohne IFB. Dieselbe Rechnung wie /rechner/gewerbe-pv mit diesen Werten.
 */
export function heroEingabe({ flaeche, verbrauchMwh, schichten = 2, standort }) {
  return {
    kwp: kwpAusDach(flaeche, "ost-west"),
    dachart: "ost-west",
    standort,
    verbrauchKwh: verbrauchMwh * 1000,
    typ: "gewerbe",
    betriebstage: BETRIEBSTAGE_AUS_SCHICHT[schichten] ?? 5,
    schichten,
    speicherKwh: 0,
    eag: false,
    ifb: false,
    profil: false,
  };
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
 * @param {number} [e.wrKva]         Wechselrichterleistung AC (kVA); Standard: kWp ÷ 1,15 (Annahme, DC_AC_VORSCHLAG)
 * @param {number} [e.speicherKva]    Speicher-Wechselrichter AC (kVA); Standard: Lade-/Entladeleistung der Simulation
 * @param {number} [e.bestandKw]      bestehende Erzeugung am selben Netzanschlusspunkt (kW)
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
  wrKva,
  speicherKva,
  bestandKw = 0,
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
  const speicherLeistung = speicher > 0 ? Math.max(speicher * A.gewerbeSpeicherCRate, 5) : 0;
  const sim = speicher > 0 ? simuliere(reihen, speicher, { leistungKw: speicherLeistung }) : ohne;
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
  // EAG-Speicherzuschuss nur ab 0,5 kWh je förderfähigem kWp (EAG-AS FAQ 2026, Fragen 19/20 –
  // wie src/lib/foerdercall.js); darunter wird nur die PV gefördert.
  const zuschussRoh = eag ? eagZuschuss(leistung, speicher) : { kategorie: null, pv: 0, speicher: 0, summe: 0 };
  const speicherZuKlein = eag && speicher > 0 && speicher + 1e-9 < Math.min(leistung, 1000) * EAG_SPEICHER_MIN_KWH_JE_KWP;
  const zuschuss = speicherZuKlein ? { ...zuschussRoh, speicher: 0, summe: zuschussRoh.pv, speicherZuKlein: true } : zuschussRoh;
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

  // TOR-Typ nach AC-Maximalkapazität am Netzanschlusspunkt (nicht nach kWp):
  // Wechselrichter AC + Speicher-AC + bestehende Erzeugung
  const vorschlagKva = acVorschlag(leistung);
  const wr = Number(wrKva) > 0 ? Number(wrKva) : vorschlagKva;
  const spAc = speicher > 0 ? (Number(speicherKva) > 0 ? Number(speicherKva) : Math.round(speicherLeistung)) : 0;
  const bestand = Math.max(Number(bestandKw) || 0, 0);
  const ac = { wrKva: wr, wrVorschlag: wr === vorschlagKva && !(Number(wrKva) > 0), vorschlagKva, speicherKva: spAc, bestandKw: bestand, summe: acSumme({ wrKva: wr, speicherKva: spAc, bestandKw: bestand }) };
  const tor = torTyp(ac.summe);
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
    ac,
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

// ---------------------------------------------------------------------------
// CFO-Stresstest (Welle A, Paket A10)
// Drei Läufe derselben Anlage: konservativ, erwartet (ANNAHMEN), günstig.
// Dazu die Break-even-Zeile „Ab welchem Strompreis rechnet sich die Anlage nicht mehr“.
// Alle Abweichungen sind offengelegt (STRESSTEST) und im Rechner/Druckblatt genannt.
// ---------------------------------------------------------------------------

export const STRESSTEST = {
  konservativ: {
    strompreisFaktor: 0.7, // Strompreis −30 % ab Jahr 1 (Arbeitspreis UND Einspeiseerlös – der Marktpreis fällt mit)
    ertragFaktor: 0.9, // Ertrag −10 % (schwächere Jahre, Verschmutzung, Ausfälle)
    preissteigerung: 0, // keine Strompreissteigerung
    zinsPlusPp: 0.02, // Zins +2 Prozentpunkte (wirkt hier auf den Leasingzins)
  },
  guenstig: {
    preissteigerungPlusPp: 0.01, // Strompreissteigerung +1 Prozentpunkt
  },
};

export const STRESSTEST_LAEUFE = [
  { id: "konservativ", label: "Konservativ", annahme: "Strompreis −30 %, Ertrag −10 %, keine Preissteigerung, Zins +2 Pp." },
  { id: "erwartet", label: "Erwartet", annahme: "Annahmen des Rechners" },
  { id: "guenstig", label: "Günstig", annahme: "Strompreissteigerung +1 Pp." },
];

/** Zahl mit Tausenderpunkt und Komma, ohne Intl (Server und Browser identisch). */
export function zahlDe(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const f = Math.pow(10, stellen);
  const r = Math.round(Math.abs(n) * f) / f;
  const [ganz, dez] = r.toFixed(stellen).split(".");
  const text = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (dez ? `,${dez}` : "");
  return n < 0 && r !== 0 ? `−${text}` : text;
}

/** Große Euro-Summen gerundet: ab 1 Mio. „≈ 1,15 Mio. €“, ab 10.000 € auf Tausender „≈ 245.000 €“. */
export function euroGerundet(n) {
  if (!Number.isFinite(n)) return "–";
  const a = Math.abs(n);
  const s = n < 0 ? "−" : "";
  if (a >= 1e6) return `≈ ${s}${zahlDe(a / 1e6, 2)} Mio. €`;
  if (a >= 10000) return `≈ ${s}${zahlDe(Math.round(a / 1000) * 1000)} €`;
  return `${s}${zahlDe(Math.round(a))} €`;
}

/** IRR auf ganze Prozent mit „ca.“; negativ „< 0 %“, nicht bestimmbar „–“. */
export function irrCa(wert) {
  if (wert == null || !Number.isFinite(wert)) return "–";
  if (wert < 0) return "< 0 %";
  return `ca. ${Math.round(wert * 100)} %`;
}

/** Amortisation als Text mit einer Nachkommastelle („7,4 Jahre“), sonst „> 25 Jahre“. */
export function amortisationText(a, jahre = GEWERBE_PV.jahre) {
  if (a == null) return `> ${jahre} Jahre`;
  return `${zahlDe(a, 1)} Jahre`;
}

const skaliereStandort = (s, f) => ({ ...s, sued35: s.sued35 * f, ostwest15: s.ostwest15 * f, flach10: s.flach10 * f });

/**
 * Break-even-Strompreis: vermeidbarer Arbeitspreis netto (Jahr 1, ct/kWh), unter dem der
 * kumulierte Cashflow nach 25 Jahren negativ wird – bei sonst gleichen Annahmen.
 * Der Cashflow ist linear im Arbeitspreis (Ersparnis = Eigenverbrauch × Preis), deshalb
 * exakt aus einem Lauf bestimmbar. null, wenn sich die Anlage auch bei 0 ct trägt.
 */
export function breakEvenStrompreisCt(r) {
  const ersparnisSumme = r.cashflow.reduce((s, c) => s + (c.ersparnis || 0), 0);
  if (!(ersparnisSumme > 0)) return null;
  const x = (r.arbeitspreisCt * (ersparnisSumme - r.summe)) / ersparnisSumme;
  return x > 0 ? x : null;
}

const SATZ_NEIN = "In diesem Fall rechnet sich die Anlage nicht – sprechen wir über Speicher oder Größe.";

/**
 * Der Satz für Entscheider – nur, wenn die Rechnung ihn trägt.
 * Kauf: der konservative Lauf amortisiert sich innerhalb des Betrachtungszeitraums.
 * Leasing: der konservative Lauf liegt nach dem Betrachtungszeitraum im Plus.
 * @param {Array<object>} laeufe  Ergebnis von stresstest().laeufe
 * @returns {{ wahr: boolean, text: string }}
 */
export function stresstestSatz(laeufe) {
  const k = laeufe.find((l) => l.id === "konservativ");
  const wahr = Boolean(k) && (k.leasing ? k.summe > 0 : k.amortisation != null && k.summe > 0);
  if (!wahr) return { wahr: false, text: SATZ_NEIN };
  const nachsatz = k.leasing ? `liegt Ihr Überschuss nach ${GEWERBE_PV.jahre} Jahren bei ${euroGerundet(k.summe)}.` : `liegt Ihre Amortisation bei ${zahlDe(k.amortisation, 1)} Jahren.`;
  return {
    wahr: true,
    text: `Wir rechnen Ihnen auch den schlechten Fall vor. Selbst wenn der Strompreis um 30 % fällt und die Sonne 10 % weniger liefert, ${nachsatz}`,
  };
}

/**
 * Stresstest mit drei Läufen.
 * @param {object} e  Eingaben wie rechneGewerbePv
 * @param {{ erwartet?: object }} [o]  bereits gerechnetes Ergebnis des erwarteten Laufs (spart eine Simulation)
 */
export function stresstest(e, { erwartet } = {}) {
  const K = STRESSTEST.konservativ;
  const G = STRESSTEST.guenstig;
  const leistung = Math.max(Number(e.kwp) || 0, 1);
  const verbrauch = Math.max(Number(e.verbrauchKwh) || 0, 1);
  const preisCt = Number.isFinite(e.arbeitspreisCt) ? e.arbeitspreisCt : strompreisGewerbe(verbrauch) * 100;
  const satzCt = Number.isFinite(e.einspeiseCt) ? e.einspeiseCt : einspeiseSatzCt(leistung);
  const steigerung = Number.isFinite(e.preissteigerung) ? e.preissteigerung : ANNAHMEN.strompreisSteigerung;
  const zins = Number.isFinite(e.leasingZins) ? e.leasingZins : GEWERBE_PV.leasingZinsStandard;
  const basis = { ...e, arbeitspreisCt: preisCt, einspeiseCt: satzCt, preissteigerung: steigerung, leasingZins: zins, profil: false };

  const laeufe = {
    konservativ: rechneGewerbePv({
      ...basis,
      arbeitspreisCt: preisCt * K.strompreisFaktor,
      einspeiseCt: satzCt * K.strompreisFaktor,
      standort: skaliereStandort(e.standort, K.ertragFaktor),
      preissteigerung: K.preissteigerung,
      leasingZins: zins + K.zinsPlusPp,
    }),
    erwartet: erwartet || rechneGewerbePv(basis),
    guenstig: rechneGewerbePv({ ...basis, preissteigerung: steigerung + G.preissteigerungPlusPp }),
  };
  const ergebnis = STRESSTEST_LAEUFE.map((lauf) => {
    const r = laeufe[lauf.id];
    return { ...lauf, amortisation: r.amortisation, irr: r.irr, summe: r.summe, leasing: r.leasing != null, ueberschussJahr1: r.cashflow[1]?.netto ?? 0 };
  });
  const be = breakEvenStrompreisCt(laeufe.erwartet);
  // Frage und Antwort getrennt (Oberfläche: Überschrift + eigener Satz); text = beides für das Druckblatt.
  const frage = "Ab welchem Strompreis rechnet sich die Anlage nicht mehr?";
  const antwort =
    be == null
      ? "Im erwarteten Fall trägt sie sich schon über den Einspeiseerlös – auch bei sehr niedrigem Strompreis."
      : be > preisCt
        ? `Bei den eingesetzten Annahmen rechnet sie sich erst ab ${zahlDe(be, 1)} ct/kWh.`
        : `Unter ${zahlDe(be, 1)} ct/kWh netto – darüber trägt sie sich.`;
  return {
    laeufe: ergebnis,
    breakEven: {
      ct: be,
      frage,
      antwort,
      text: `${frage} ${antwort}`,
      erklaerung: `Vermeidbarer Arbeitspreis netto im Jahr 1 (eingesetzt: ${zahlDe(preisCt, 1)} ct/kWh), unter dem der kumulierte Cashflow nach ${GEWERBE_PV.jahre} Jahren negativ wird – übrige Annahmen wie im erwarteten Lauf.`,
    },
    satz: stresstestSatz(ergebnis),
    jahre: GEWERBE_PV.jahre,
  };
}

/** Stresstest als Tabellenzeilen für das Druckblatt (bericht().stresstest, Paket A09). */
export function stresstestBericht(st) {
  return {
    titel: "Stresstest: schlechter, erwarteter und guter Fall",
    spalten: ["Fall", "Annahme", "Amortisation", "Rendite (IRR)", `Kumuliert nach ${st.jahre} Jahren`],
    zeilen: st.laeufe.map((l) => [l.label, l.annahme, l.leasing ? "–" : amortisationText(l.amortisation, st.jahre), l.leasing ? "–" : irrCa(l.irr), euroGerundet(l.summe)]),
    satz: st.satz.text,
    satzWahr: st.satz.wahr,
    breakEven: st.breakEven.text,
    breakEvenErklaerung: st.breakEven.erklaerung,
  };
}
